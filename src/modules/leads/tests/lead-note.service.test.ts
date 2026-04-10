import { describe, expect, it, vi } from "vitest";
import { createLeadNote, listLeadNotes } from "@/modules/leads/services/lead-note.service";

describe("lead-note.service", () => {
  it("creates note when lead exists", async () => {
    const saveLeadNoteRecord = vi.fn(async () => undefined);

    const created = await createLeadNote(
      "lead-1",
      { note: "Call back tomorrow" },
      "admin@vinipainting.com",
      {
        leadsStorage: {
          readLeadRecords: async () => [{ id: "lead-1" }]
        },
        leadNotesStorage: {
          readLeadNotesByLeadId: async () => [],
          saveLeadNoteRecord
        }
      }
    );

    expect(created?.leadId).toBe("lead-1");
    expect(saveLeadNoteRecord).toHaveBeenCalledTimes(1);
  });

  it("returns empty notes when lead does not exist", async () => {
    const notes = await listLeadNotes("missing", {
      leadsStorage: {
        readLeadRecords: async () => []
      },
      leadNotesStorage: {
        readLeadNotesByLeadId: async () => [{ id: "n1", leadId: "missing", note: "x", createdAt: "", createdBy: "" }],
        saveLeadNoteRecord: async () => undefined
      }
    });

    expect(notes).toEqual([]);
  });
});
