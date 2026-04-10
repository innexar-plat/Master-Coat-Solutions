import { describe, expect, it } from "vitest";
import { updateLeadFollowUpSchema } from "@/modules/leads/dtos/lead-follow-up.dto";

describe("lead-follow-up.dto", () => {
  it("accepts nullable follow-up datetime", () => {
    const parsed = updateLeadFollowUpSchema.parse({ followUpAt: null });
    expect(parsed.followUpAt).toBeNull();
  });

  it("accepts valid ISO datetime", () => {
    const iso = new Date().toISOString();
    const parsed = updateLeadFollowUpSchema.parse({ followUpAt: iso });
    expect(parsed.followUpAt).toBe(iso);
  });

  it("rejects invalid payload", () => {
    expect(() => updateLeadFollowUpSchema.parse({ followUpAt: "tomorrow" })).toThrow();
  });
});
