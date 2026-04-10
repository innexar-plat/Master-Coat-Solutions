import type { LeadRecord, LeadStatus } from "@/modules/leads/dtos/create-lead.dto";
import { updateLeadFollowUpSchema, type LeadFollowUpRecord } from "@/modules/leads/dtos/lead-follow-up.dto";
import { readLeadRecords } from "@/modules/leads/services/lead-storage.service";
import { readLeadFollowUps, saveLeadFollowUp } from "@/modules/leads/services/lead-follow-up-storage.service";

type LeadStoragePort = {
  readLeadRecords: () => Promise<LeadRecord[]>;
};

type LeadFollowUpStoragePort = {
  readLeadFollowUps: () => Promise<LeadFollowUpRecord[]>;
  saveLeadFollowUp: (record: LeadFollowUpRecord) => Promise<void>;
};

export type PendingLeadFollowUp = {
  leadId: string;
  leadName: string;
  leadPhone: string;
  leadStatus: LeadStatus;
  followUpAt: string;
  updatedAt: string;
};

export async function listLeadFollowUps(
  dependencies: {
    leadFollowUpStorage?: LeadFollowUpStoragePort;
  } = {}
): Promise<LeadFollowUpRecord[]> {
  const storage = dependencies.leadFollowUpStorage ?? {
    readLeadFollowUps,
    saveLeadFollowUp
  };

  return storage.readLeadFollowUps();
}

export async function getLeadFollowUpByLeadId(
  leadId: string,
  dependencies: {
    leadFollowUpStorage?: LeadFollowUpStoragePort;
    leadsStorage?: LeadStoragePort;
  } = {}
): Promise<LeadFollowUpRecord | null> {
  const leadsStorage = dependencies.leadsStorage ?? { readLeadRecords };
  const followUpStorage = dependencies.leadFollowUpStorage ?? {
    readLeadFollowUps,
    saveLeadFollowUp
  };

  const leads = await leadsStorage.readLeadRecords();
  const exists = leads.some((lead) => lead.id === leadId);

  if (!exists) {
    return null;
  }

  const followUps = await followUpStorage.readLeadFollowUps();
  return followUps.find((entry) => entry.leadId === leadId) ?? null;
}

export async function updateLeadFollowUpByLeadId(
  leadId: string,
  payload: unknown,
  dependencies: {
    leadsStorage?: LeadStoragePort;
    leadFollowUpStorage?: LeadFollowUpStoragePort;
  } = {}
): Promise<LeadFollowUpRecord | null> {
  const leadsStorage = dependencies.leadsStorage ?? { readLeadRecords };
  const followUpStorage = dependencies.leadFollowUpStorage ?? {
    readLeadFollowUps,
    saveLeadFollowUp
  };

  const leads = await leadsStorage.readLeadRecords();
  const exists = leads.some((lead) => lead.id === leadId);

  if (!exists) {
    return null;
  }

  const parsed = updateLeadFollowUpSchema.parse(payload);

  const record: LeadFollowUpRecord = {
    leadId,
    followUpAt: parsed.followUpAt,
    updatedAt: new Date().toISOString()
  };

  await followUpStorage.saveLeadFollowUp(record);

  return record;
}

export async function countPendingFollowUps(
  nowIso = new Date().toISOString(),
  dependencies: {
    leadsStorage?: LeadStoragePort;
    leadFollowUpStorage?: LeadFollowUpStoragePort;
  } = {}
): Promise<number> {
  const leadsStorage = dependencies.leadsStorage ?? { readLeadRecords };
  const followUpStorage = dependencies.leadFollowUpStorage ?? {
    readLeadFollowUps,
    saveLeadFollowUp
  };

  const leads = await leadsStorage.readLeadRecords();
  const followUps = await followUpStorage.readLeadFollowUps();
  const leadStatusMap = new Map(leads.map((lead) => [lead.id, lead.status]));

  const now = new Date(nowIso);

  return followUps.filter((entry) => {
    if (!entry.followUpAt) {
      return false;
    }

    const status = leadStatusMap.get(entry.leadId);
    if (status === "WON" || status === "LOST") {
      return false;
    }

    const followUpDate = new Date(entry.followUpAt);
    return followUpDate <= now;
  }).length;
}

export async function listPendingFollowUps(
  nowIso = new Date().toISOString(),
  dependencies: {
    leadsStorage?: LeadStoragePort;
    leadFollowUpStorage?: LeadFollowUpStoragePort;
  } = {}
): Promise<PendingLeadFollowUp[]> {
  const leadsStorage = dependencies.leadsStorage ?? { readLeadRecords };
  const followUpStorage = dependencies.leadFollowUpStorage ?? {
    readLeadFollowUps,
    saveLeadFollowUp
  };

  const [leads, followUps] = await Promise.all([
    leadsStorage.readLeadRecords(),
    followUpStorage.readLeadFollowUps()
  ]);

  const leadMap = new Map(leads.map((lead) => [lead.id, lead]));
  const now = new Date(nowIso);

  return followUps
    .filter((entry) => {
      if (!entry.followUpAt) {
        return false;
      }

      const lead = leadMap.get(entry.leadId);
      if (!lead) {
        return false;
      }

      if (lead.status === "WON" || lead.status === "LOST") {
        return false;
      }

      return new Date(entry.followUpAt) <= now;
    })
    .map((entry) => {
      const lead = leadMap.get(entry.leadId)!;
      return {
        leadId: entry.leadId,
        leadName: lead.name,
        leadPhone: lead.phone,
        leadStatus: lead.status,
        followUpAt: entry.followUpAt!,
        updatedAt: entry.updatedAt
      };
    })
    .sort((a, b) => new Date(a.followUpAt).getTime() - new Date(b.followUpAt).getTime());
}
