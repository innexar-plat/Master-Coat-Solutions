import { describe, expect, it } from "vitest";
import { createLeadNoteSchema } from "@/modules/leads/dtos/create-lead-note.dto";

describe("createLeadNoteSchema", () => {
  it("accepts valid note payload", () => {
    const parsed = createLeadNoteSchema.parse({
      note: "Customer asked for weekend estimate"
    });

    expect(parsed.note).toBe("Customer asked for weekend estimate");
  });

  it("rejects short note payload", () => {
    expect(() => createLeadNoteSchema.parse({ note: "a" })).toThrow();
  });
});
