import { promises as fs } from "node:fs";
import path from "node:path";
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

export async function readLeadActivities(): Promise<LeadActivityRecord[]> {
  await ensureLeadActivitiesFile();

  const raw = await fs.readFile(LEAD_ACTIVITIES_FILE_PATH, "utf8");
  return JSON.parse(raw) as LeadActivityRecord[];
}

export async function appendLeadActivity(record: LeadActivityRecord): Promise<void> {
  await ensureLeadActivitiesFile();

  const current = await readLeadActivities();
  current.unshift(record);

  await fs.writeFile(LEAD_ACTIVITIES_FILE_PATH, JSON.stringify(current, null, 2), "utf8");
}
