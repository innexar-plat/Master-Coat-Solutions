import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LeadNotesPanel } from "./LeadNotesPanel";

describe("LeadNotesPanel", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("loads notes and creates a new note", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              id: "n1",
              leadId: "1",
              note: "First note",
              createdAt: new Date().toISOString(),
              createdBy: "admin@vinipainting.com"
            }
          ]
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            id: "n2",
            leadId: "1",
            note: "Second note",
            createdAt: new Date().toISOString(),
            createdBy: "admin@vinipainting.com"
          }
        })
      });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);
    Object.defineProperty(window, "fetch", { value: fetchMock, writable: true });

    render(<LeadNotesPanel leadId="1" />);

    expect(await screen.findByText("First note")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Add internal note"), { target: { value: "Second note" } });
    fireEvent.click(screen.getByText("Add Note"));

    expect(await screen.findByText("Second note")).toBeInTheDocument();
  });
});
