import { promises as fs } from "node:fs";
import path from "node:path";
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

export async function readLeadFollowUps(): Promise<LeadFollowUpRecord[]> {
  await ensureLeadFollowUpsFile();

  const content = await fs.readFile(LEAD_FOLLOW_UPS_FILE_PATH, "utf8");
  return JSON.parse(content) as LeadFollowUpRecord[];
}

export async function saveLeadFollowUp(record: LeadFollowUpRecord): Promise<void> {
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
