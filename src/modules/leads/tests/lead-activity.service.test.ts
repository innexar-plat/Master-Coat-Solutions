import { describe, expect, it, vi } from "vitest";
import { createLeadActivity, listLeadActivities } from "@/modules/leads/services/lead-activity.service";

describe("lead-activity.service", () => {
  it("creates activity record", async () => {
    const appendLeadActivity = vi.fn(async () => undefined);

    const record = await createLeadActivity(
      {
        leadId: "lead-1",
        type: "STATUS_CHANGED",
        description: "Status changed",
        createdBy: "admin"
      },
      {
        storage: {
          appendLeadActivity,
          readLeadActivities: async () => []
        }
      }
    );

    expect(record.id).toBeTypeOf("string");
    expect(record.leadId).toBe("lead-1");
    expect(appendLeadActivity).toHaveBeenCalledTimes(1);
  });

  it("lists activities for specific lead", async () => {
    const items = await listLeadActivities("lead-1", {
      storage: {
        appendLeadActivity: async () => undefined,
        readLeadActivities: async () => [
      {
        id: "a1",
        leadId: "lead-1",
        type: "NOTE_ADDED",
        description: "Note",
        createdBy: "admin",
        createdAt: "2026-04-03T12:00:00.000Z"
      },
      {
        id: "a2",
        leadId: "lead-2",
        type: "STATUS_CHANGED",
        description: "Status",
        createdBy: "admin",
        createdAt: "2026-04-03T12:10:00.000Z"
      }
    ]
      }
    });

    expect(items.every((entry) => entry.leadId === "lead-1")).toBe(true);
  });
});
