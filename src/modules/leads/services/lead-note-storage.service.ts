import { promises as fs } from "node:fs";
import path from "node:path";
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

export async function readLeadNotesByLeadId(leadId: string): Promise<LeadNoteRecord[]> {
  await ensureLeadNotesFile();

  const content = await fs.readFile(LEAD_NOTES_FILE_PATH, "utf8");
  const records = JSON.parse(content) as LeadNoteRecord[];

  return records
    .filter((entry) => entry.leadId === leadId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveLeadNoteRecord(record: LeadNoteRecord): Promise<void> {
  await ensureLeadNotesFile();

  const content = await fs.readFile(LEAD_NOTES_FILE_PATH, "utf8");
  const records = JSON.parse(content) as LeadNoteRecord[];
  records.unshift(record);

  await fs.writeFile(LEAD_NOTES_FILE_PATH, JSON.stringify(records, null, 2), "utf8");
}
