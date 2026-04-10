import { describe, expect, it, vi } from "vitest";
import { captureLead } from "@/modules/leads/services/lead-capture.service";

describe("captureLead", () => {
  it("persists and notifies with normalized record", async () => {
    const saveLeadRecord = vi.fn(async () => undefined);
    const notifyNewLead = vi.fn(async () => undefined);

    const lead = await captureLead(
      {
        name: "Jane Smith",
        phone: "4075557777",
        service: "Exterior Painting",
        locale: "en",
        source: "free-estimate"
      },
      {
        storage: { saveLeadRecord },
        notifier: { notifyNewLead }
      }
    );

    expect(lead.id).toBeTypeOf("string");
    expect(saveLeadRecord).toHaveBeenCalledTimes(1);
    expect(notifyNewLead).toHaveBeenCalledTimes(1);
  });
});
