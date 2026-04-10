import { promises as fs } from "node:fs";
import path from "node:path";
import type { LeadRecord } from "@/modules/leads/dtos/create-lead.dto";
import { allowFileLeadStorageFallback, hasDatabaseUrl } from "@/lib/env";
import {
  readLeadRecordsFromPrisma,
  saveLeadRecordInPrisma,
  updateLeadStatusByIdInPrisma,
} from "@/modules/leads/services/lead-prisma-storage.service";

const LEADS_FILE_PATH = path.join(process.cwd(), "data", "leads.json");

async function ensureLeadsFile() {
  await fs.mkdir(path.dirname(LEADS_FILE_PATH), { recursive: true });

  try {
    await fs.access(LEADS_FILE_PATH);
  } catch {
    await fs.writeFile(LEADS_FILE_PATH, "[]", "utf8");
  }
}

function shouldUsePrismaStorage(): boolean {
  return hasDatabaseUrl();
}

function shouldFallbackToFileStorage(): boolean {
  return allowFileLeadStorageFallback();
}

async function saveLeadRecordInFile(record: LeadRecord): Promise<void> {
  await ensureLeadsFile();

  const current = await fs.readFile(LEADS_FILE_PATH, "utf8");
  const leads = JSON.parse(current) as LeadRecord[];
  leads.unshift(record);

  await fs.writeFile(LEADS_FILE_PATH, JSON.stringify(leads, null, 2), "utf8");
}

function normalizeLeadStatus(
  record: LeadRecord | (LeadRecord & { status?: LeadRecord["status"] }),
): LeadRecord {
  return {
    ...record,
    status: record.status ?? "NEW",
  };
}

async function readLeadRecordsFromFile(): Promise<LeadRecord[]> {
  await ensureLeadsFile();

  const current = await fs.readFile(LEADS_FILE_PATH, "utf8");
  const leads = JSON.parse(current) as Array<
    LeadRecord & { status?: LeadRecord["status"] }
  >;

  return leads.map((entry) => normalizeLeadStatus(entry));
}

async function updateLeadStatusByIdInFile(
  leadId: string,
  status: LeadRecord["status"],
): Promise<LeadRecord | null> {
  await ensureLeadsFile();

  const current = await fs.readFile(LEADS_FILE_PATH, "utf8");
  const leads = JSON.parse(current) as Array<
    LeadRecord & { status?: LeadRecord["status"] }
  >;
  const normalized = leads.map((entry) => normalizeLeadStatus(entry));

  const targetIndex = normalized.findIndex((entry) => entry.id === leadId);

  if (targetIndex < 0) {
    return null;
  }

  normalized[targetIndex] = {
    ...normalized[targetIndex],
    status,
  };

  await fs.writeFile(
    LEADS_FILE_PATH,
    JSON.stringify(normalized, null, 2),
    "utf8",
  );

  return normalized[targetIndex];
}

export async function saveLeadRecord(record: LeadRecord): Promise<void> {
  if (shouldUsePrismaStorage()) {
    try {
      await saveLeadRecordInPrisma(record);
      return;
    } catch (error) {
      if (!shouldFallbackToFileStorage()) {
        throw new Error(
          `Lead persistence failed using Prisma: ${String(error)}`,
        );
      }

      await saveLeadRecordInFile(record);
      return;
    }
  }

  await saveLeadRecordInFile(record);
}

export async function readLeadRecords(): Promise<LeadRecord[]> {
  if (shouldUsePrismaStorage()) {
    try {
      return await readLeadRecordsFromPrisma();
    } catch (error) {
      if (!shouldFallbackToFileStorage()) {
        throw new Error(`Lead read failed using Prisma: ${String(error)}`);
      }

      return readLeadRecordsFromFile();
    }
  }

  return readLeadRecordsFromFile();
}

export async function updateLeadStatusById(
  leadId: string,
  status: LeadRecord["status"],
): Promise<LeadRecord | null> {
  if (shouldUsePrismaStorage()) {
    try {
      return await updateLeadStatusByIdInPrisma(leadId, status);
    } catch (error) {
      if (!shouldFallbackToFileStorage()) {
        throw new Error(
          `Lead status update failed using Prisma: ${String(error)}`,
        );
      }

      return updateLeadStatusByIdInFile(leadId, status);
    }
  }

  return updateLeadStatusByIdInFile(leadId, status);
}
