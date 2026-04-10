import { randomUUID } from "node:crypto";
import { createLeadSchema, type CreateLeadInput, type LeadRecord } from "@/modules/leads/dtos/create-lead.dto";

export type LeadStoragePort = {
  saveLeadRecord: (record: LeadRecord) => Promise<void>;
};

export type LeadNotificationPort = {
  notifyNewLead: (record: LeadRecord) => Promise<void>;
};

export async function captureLead(
  payload: unknown,
  dependencies: {
    storage: LeadStoragePort;
    notifier: LeadNotificationPort;
  }
): Promise<LeadRecord> {
  const parsed = createLeadSchema.parse(payload) as CreateLeadInput;

  const record: LeadRecord = {
    id: randomUUID(),
    name: parsed.name,
    phone: parsed.phone,
    email: parsed.email || undefined,
    service: parsed.service,
    message: parsed.message || undefined,
    locale: parsed.locale,
    source: parsed.source,
    status: "NEW",
    createdAt: new Date().toISOString()
  };

  await dependencies.storage.saveLeadRecord(record);
  await dependencies.notifier.notifyNewLead(record);

  return record;
}
