import { randomUUID } from "node:crypto";
import { createLeadNoteSchema, type LeadNoteRecord } from "@/modules/leads/dtos/create-lead-note.dto";
import { readLeadRecords } from "@/modules/leads/services/lead-storage.service";
import { readLeadNotesByLeadId, saveLeadNoteRecord } from "@/modules/leads/services/lead-note-storage.service";

type LeadNoteStoragePort = {
  readLeadNotesByLeadId: (leadId: string) => Promise<LeadNoteRecord[]>;
  saveLeadNoteRecord: (record: LeadNoteRecord) => Promise<void>;
};

type LeadStoragePort = {
  readLeadRecords: () => Promise<Array<{ id: string }>>;
};

export async function listLeadNotes(
  leadId: string,
  dependencies: {
    leadNotesStorage?: LeadNoteStoragePort;
    leadsStorage?: LeadStoragePort;
  } = {}
): Promise<LeadNoteRecord[]> {
  const leadNotesStorage = dependencies.leadNotesStorage ?? {
    readLeadNotesByLeadId,
    saveLeadNoteRecord
  };

  const leadsStorage = dependencies.leadsStorage ?? {
    readLeadRecords
  };

  const leads = await leadsStorage.readLeadRecords();
  const exists = leads.some((lead) => lead.id === leadId);

  if (!exists) {
    return [];
  }

  return leadNotesStorage.readLeadNotesByLeadId(leadId);
}

export async function createLeadNote(
  leadId: string,
  payload: unknown,
  createdBy: string,
  dependencies: {
    leadNotesStorage?: LeadNoteStoragePort;
    leadsStorage?: LeadStoragePort;
  } = {}
): Promise<LeadNoteRecord | null> {
  const leadNotesStorage = dependencies.leadNotesStorage ?? {
    readLeadNotesByLeadId,
    saveLeadNoteRecord
  };

  const leadsStorage = dependencies.leadsStorage ?? {
    readLeadRecords
  };

  const leads = await leadsStorage.readLeadRecords();
  const exists = leads.some((lead) => lead.id === leadId);

  if (!exists) {
    return null;
  }

  const parsed = createLeadNoteSchema.parse(payload);

  const record: LeadNoteRecord = {
    id: randomUUID(),
    leadId,
    note: parsed.note,
    createdBy,
    createdAt: new Date().toISOString()
  };

  await leadNotesStorage.saveLeadNoteRecord(record);

  return record;
}
