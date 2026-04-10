import { describe, expect, it, vi } from "vitest";
import {
  countPendingFollowUps,
  getLeadFollowUpByLeadId,
  listPendingFollowUps,
  updateLeadFollowUpByLeadId
} from "@/modules/leads/services/lead-follow-up.service";
import type { LeadRecord, LeadStatus } from "@/modules/leads/dtos/create-lead.dto";

function makeLead(id: string, status: LeadStatus): LeadRecord {
  return {
    id,
    name: `Lead ${id}`,
    phone: "4075550000",
    service: "Interior",
    locale: "en",
    source: "free-estimate",
    status,
    createdAt: new Date().toISOString()
  };
}

describe("lead-follow-up.service", () => {
  it("gets follow-up by lead id", async () => {
    const record = await getLeadFollowUpByLeadId("lead-1", {
      leadsStorage: {
        readLeadRecords: async () => [makeLead("lead-1", "NEW")]
      },
      leadFollowUpStorage: {
        readLeadFollowUps: async () => [
          {
            leadId: "lead-1",
            followUpAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        saveLeadFollowUp: async () => undefined
      }
    });

    expect(record?.leadId).toBe("lead-1");
  });

  it("updates follow-up when lead exists", async () => {
    const saveLeadFollowUp = vi.fn(async () => undefined);
    const followUpAt = new Date().toISOString();

    const updated = await updateLeadFollowUpByLeadId(
      "lead-1",
      { followUpAt },
      {
        leadsStorage: {
          readLeadRecords: async () => [makeLead("lead-1", "CONTACTED")]
        },
        leadFollowUpStorage: {
          readLeadFollowUps: async () => [],
          saveLeadFollowUp
        }
      }
    );

    expect(updated?.followUpAt).toBe(followUpAt);
    expect(saveLeadFollowUp).toHaveBeenCalledTimes(1);
  });

  it("counts pending follow-ups excluding won/lost", async () => {
    const now = "2026-04-03T15:00:00.000Z";

    const count = await countPendingFollowUps(now, {
      leadsStorage: {
        readLeadRecords: async () => [
          makeLead("lead-1", "NEW"),
          makeLead("lead-2", "WON")
        ]
      },
      leadFollowUpStorage: {
        readLeadFollowUps: async () => [
          { leadId: "lead-1", followUpAt: "2026-04-03T14:00:00.000Z", updatedAt: now },
          { leadId: "lead-2", followUpAt: "2026-04-03T14:00:00.000Z", updatedAt: now },
          { leadId: "lead-1", followUpAt: "2026-04-04T14:00:00.000Z", updatedAt: now }
        ],
        saveLeadFollowUp: async () => undefined
      }
    });

    expect(count).toBe(1);
  });

  it("lists pending follow-up details ordered by due time", async () => {
    const now = "2026-04-03T15:00:00.000Z";

    const items = await listPendingFollowUps(now, {
      leadsStorage: {
        readLeadRecords: async () => [
          {
            id: "lead-1",
            name: "A",
            phone: "111",
            status: "NEW",
            service: "Interior",
            locale: "en",
            source: "free-estimate",
            createdAt: now
          },
          {
            id: "lead-2",
            name: "B",
            phone: "222",
            status: "CONTACTED",
            service: "Exterior",
            locale: "en",
            source: "free-estimate",
            createdAt: now
          }
        ]
      },
      leadFollowUpStorage: {
        readLeadFollowUps: async () => [
          { leadId: "lead-2", followUpAt: "2026-04-03T14:30:00.000Z", updatedAt: now },
          { leadId: "lead-1", followUpAt: "2026-04-03T14:00:00.000Z", updatedAt: now }
        ],
        saveLeadFollowUp: async () => undefined
      }
    });

    expect(items).toHaveLength(2);
    expect(items[0]?.leadId).toBe("lead-1");
    expect(items[1]?.leadId).toBe("lead-2");
  });
});
