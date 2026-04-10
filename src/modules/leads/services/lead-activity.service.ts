import { randomUUID } from "node:crypto";
import type { LeadStatus } from "@/modules/leads/dtos/create-lead.dto";
import { appendLeadActivity, readLeadActivities } from "@/modules/leads/services/lead-activity-storage.service";

export type LeadActivityType = "STATUS_CHANGED" | "NOTE_ADDED" | "FOLLOW_UP_UPDATED";

export type LeadActivityRecord = {
  id: string;
  leadId: string;
  type: LeadActivityType;
  description: string;
  createdBy: string;
  createdAt: string;
};

type LeadActivityDependencies = {
  storage?: {
    appendLeadActivity: (record: LeadActivityRecord) => Promise<void>;
    readLeadActivities: () => Promise<LeadActivityRecord[]>;
  };
};

export async function createLeadActivity(input: {
  leadId: string;
  type: LeadActivityType;
  description: string;
  createdBy: string;
}, dependencies: LeadActivityDependencies = {}): Promise<LeadActivityRecord> {
  const storage = dependencies.storage ?? {
    appendLeadActivity,
    readLeadActivities
  };

  const record: LeadActivityRecord = {
    id: randomUUID(),
    leadId: input.leadId,
    type: input.type,
    description: input.description,
    createdBy: input.createdBy,
    createdAt: new Date().toISOString()
  };

  await storage.appendLeadActivity(record);
  return record;
}

export async function listLeadActivities(
  leadId: string,
  dependencies: LeadActivityDependencies = {}
): Promise<LeadActivityRecord[]> {
  const storage = dependencies.storage ?? {
    appendLeadActivity,
    readLeadActivities
  };

  const records = await storage.readLeadActivities();

  return records
    .filter((entry) => entry.leadId === leadId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function trackLeadStatusChanged(
  leadId: string,
  status: LeadStatus,
  createdBy: string
): Promise<LeadActivityRecord> {
  return createLeadActivity({
    leadId,
    type: "STATUS_CHANGED",
    description: `Status changed to ${status}`,
    createdBy
  });
}

export async function trackLeadNoteAdded(
  leadId: string,
  preview: string,
  createdBy: string
): Promise<LeadActivityRecord> {
  const shortPreview = preview.trim().slice(0, 80);

  return createLeadActivity({
    leadId,
    type: "NOTE_ADDED",
    description: `Note added: ${shortPreview}`,
    createdBy
  });
}

export async function trackLeadFollowUpUpdated(
  leadId: string,
  followUpAt: string | null,
  createdBy: string
): Promise<LeadActivityRecord> {
  const description = followUpAt
    ? `Follow-up scheduled for ${new Date(followUpAt).toLocaleString()}`
    : "Follow-up reminder cleared";

  return createLeadActivity({
    leadId,
    type: "FOLLOW_UP_UPDATED",
    description,
    createdBy
  });
}
