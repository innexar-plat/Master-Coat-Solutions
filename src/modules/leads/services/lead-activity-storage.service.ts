import { promises as fs } from "node:fs";
import path from "node:path";
import { allowFileLeadStorageFallback, hasDatabaseUrl } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import type { LeadActivityRecord } from "@/modules/leads/services/lead-activity.service";

const LEAD_ACTIVITIES_FILE_PATH = path.join(process.cwd(), "data", "lead-activities.json");

async function ensureLeadActivitiesFile() {
  await fs.mkdir(path.dirname(LEAD_ACTIVITIES_FILE_PATH), { recursive: true });

  try {
    await fs.access(LEAD_ACTIVITIES_FILE_PATH);
  } catch {
    await fs.writeFile(LEAD_ACTIVITIES_FILE_PATH, "[]", "utf8");
  }
}

function shouldUsePrismaStorage(): boolean {
  return hasDatabaseUrl();
}

function shouldFallbackToFileStorage(): boolean {
  return allowFileLeadStorageFallback();
}

function parseArrayWithRecovery<T>(raw: string): { data: T[]; recovered: boolean } {
  try {
    return { data: JSON.parse(raw) as T[], recovered: false };
  } catch {
    const start = raw.indexOf("[");

    if (start < 0) {
      return { data: [], recovered: true };
    }

    for (let end = raw.lastIndexOf("]"); end > start; end = raw.lastIndexOf("]", end - 1)) {
      const candidate = raw.slice(start, end + 1);

      try {
        return { data: JSON.parse(candidate) as T[], recovered: true };
      } catch {
        continue;
      }
    }

    return { data: [], recovered: true };
  }
}

export async function readLeadActivities(): Promise<LeadActivityRecord[]> {
  if (shouldUsePrismaStorage()) {
    try {
      const rows = await prisma.leadActivity.findMany({
        orderBy: {
          createdAt: "desc"
        }
      });

      return rows.map((row) => ({
        id: row.id,
        leadId: row.leadId,
        type: row.type as LeadActivityRecord["type"],
        description: row.description,
        createdBy: row.createdBy,
        createdAt: row.createdAt.toISOString()
      }));
    } catch (error) {
      if (!shouldFallbackToFileStorage()) {
        throw new Error(`Lead activities read failed using Prisma: ${String(error)}`);
      }
    }
  }

  await ensureLeadActivitiesFile();

  const raw = await fs.readFile(LEAD_ACTIVITIES_FILE_PATH, "utf8");
  const parsed = parseArrayWithRecovery<LeadActivityRecord>(raw);

  if (parsed.recovered) {
    await fs.writeFile(LEAD_ACTIVITIES_FILE_PATH, JSON.stringify(parsed.data, null, 2), "utf8");
  }

  return parsed.data;
}

export async function appendLeadActivity(record: LeadActivityRecord): Promise<void> {
  if (shouldUsePrismaStorage()) {
    try {
      await prisma.leadActivity.create({
        data: {
          id: record.id,
          leadId: record.leadId,
          type: record.type,
          description: record.description,
          createdBy: record.createdBy,
          createdAt: new Date(record.createdAt)
        }
      });
      return;
    } catch (error) {
      if (!shouldFallbackToFileStorage()) {
        throw new Error(`Lead activity persistence failed using Prisma: ${String(error)}`);
      }
    }
  }

  await ensureLeadActivitiesFile();

  const current = await readLeadActivities();
  current.unshift(record);

  await fs.writeFile(LEAD_ACTIVITIES_FILE_PATH, JSON.stringify(current, null, 2), "utf8");
}
