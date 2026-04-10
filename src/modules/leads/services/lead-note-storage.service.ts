import { promises as fs } from "node:fs";
import path from "node:path";
import { allowFileLeadStorageFallback, hasDatabaseUrl } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import type { LeadNoteRecord } from "@/modules/leads/dtos/create-lead-note.dto";

const LEAD_NOTES_FILE_PATH = path.join(process.cwd(), "data", "lead-notes.json");

async function ensureLeadNotesFile() {
  await fs.mkdir(path.dirname(LEAD_NOTES_FILE_PATH), { recursive: true });

  try {
    await fs.access(LEAD_NOTES_FILE_PATH);
  } catch {
    await fs.writeFile(LEAD_NOTES_FILE_PATH, "[]", "utf8");
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

export async function readLeadNotesByLeadId(leadId: string): Promise<LeadNoteRecord[]> {
  if (shouldUsePrismaStorage()) {
    try {
      const rows = await prisma.leadNote.findMany({
        where: { leadId },
        orderBy: { createdAt: "desc" }
      });

      return rows.map((row) => ({
        id: row.id,
        leadId: row.leadId,
        note: row.note,
        createdBy: row.createdBy,
        createdAt: row.createdAt.toISOString()
      }));
    } catch (error) {
      if (!shouldFallbackToFileStorage()) {
        throw new Error(`Lead notes read failed using Prisma: ${String(error)}`);
      }
    }
  }

  await ensureLeadNotesFile();

  const content = await fs.readFile(LEAD_NOTES_FILE_PATH, "utf8");
  const parsed = parseArrayWithRecovery<LeadNoteRecord>(content);

  if (parsed.recovered) {
    await fs.writeFile(LEAD_NOTES_FILE_PATH, JSON.stringify(parsed.data, null, 2), "utf8");
  }

  const records = parsed.data;

  return records
    .filter((entry) => entry.leadId === leadId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveLeadNoteRecord(record: LeadNoteRecord): Promise<void> {
  if (shouldUsePrismaStorage()) {
    try {
      await prisma.leadNote.create({
        data: {
          id: record.id,
          leadId: record.leadId,
          note: record.note,
          createdBy: record.createdBy,
          createdAt: new Date(record.createdAt)
        }
      });
      return;
    } catch (error) {
      if (!shouldFallbackToFileStorage()) {
        throw new Error(`Lead note persistence failed using Prisma: ${String(error)}`);
      }
    }
  }

  await ensureLeadNotesFile();

  const content = await fs.readFile(LEAD_NOTES_FILE_PATH, "utf8");
  const parsed = parseArrayWithRecovery<LeadNoteRecord>(content);
  const records = parsed.data;
  records.unshift(record);

  await fs.writeFile(LEAD_NOTES_FILE_PATH, JSON.stringify(records, null, 2), "utf8");
}
