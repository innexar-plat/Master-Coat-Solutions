import { promises as fs } from "node:fs";
import path from "node:path";
import { allowFileLeadStorageFallback, hasDatabaseUrl } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import type { LeadFollowUpRecord } from "@/modules/leads/dtos/lead-follow-up.dto";

const LEAD_FOLLOW_UPS_FILE_PATH = path.join(process.cwd(), "data", "lead-follow-ups.json");

async function ensureLeadFollowUpsFile() {
  await fs.mkdir(path.dirname(LEAD_FOLLOW_UPS_FILE_PATH), { recursive: true });

  try {
    await fs.access(LEAD_FOLLOW_UPS_FILE_PATH);
  } catch {
    await fs.writeFile(LEAD_FOLLOW_UPS_FILE_PATH, "[]", "utf8");
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

export async function readLeadFollowUps(): Promise<LeadFollowUpRecord[]> {
  if (shouldUsePrismaStorage()) {
    try {
      const rows = await prisma.leadFollowUp.findMany({
        orderBy: {
          updatedAt: "desc"
        }
      });

      return rows.map((row) => ({
        leadId: row.leadId,
        followUpAt: row.followUpAt ? row.followUpAt.toISOString() : null,
        updatedAt: row.updatedAt.toISOString()
      }));
    } catch (error) {
      if (!shouldFallbackToFileStorage()) {
        throw new Error(`Lead follow-ups read failed using Prisma: ${String(error)}`);
      }
    }
  }

  await ensureLeadFollowUpsFile();

  const content = await fs.readFile(LEAD_FOLLOW_UPS_FILE_PATH, "utf8");
  const parsed = parseArrayWithRecovery<LeadFollowUpRecord>(content);

  if (parsed.recovered) {
    await fs.writeFile(LEAD_FOLLOW_UPS_FILE_PATH, JSON.stringify(parsed.data, null, 2), "utf8");
  }

  return parsed.data;
}

export async function saveLeadFollowUp(record: LeadFollowUpRecord): Promise<void> {
  if (shouldUsePrismaStorage()) {
    try {
      await prisma.leadFollowUp.upsert({
        where: {
          leadId: record.leadId
        },
        create: {
          leadId: record.leadId,
          followUpAt: record.followUpAt ? new Date(record.followUpAt) : null,
          updatedAt: new Date(record.updatedAt)
        },
        update: {
          followUpAt: record.followUpAt ? new Date(record.followUpAt) : null,
          updatedAt: new Date(record.updatedAt)
        }
      });
      return;
    } catch (error) {
      if (!shouldFallbackToFileStorage()) {
        throw new Error(`Lead follow-up persistence failed using Prisma: ${String(error)}`);
      }
    }
  }

  await ensureLeadFollowUpsFile();

  const current = await readLeadFollowUps();
  const index = current.findIndex((entry) => entry.leadId === record.leadId);

  if (index >= 0) {
    current[index] = record;
  } else {
    current.unshift(record);
  }

  await fs.writeFile(LEAD_FOLLOW_UPS_FILE_PATH, JSON.stringify(current, null, 2), "utf8");
}
