import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminLeadsWorkspace } from "./AdminLeadsWorkspace";

describe("AdminLeadsWorkspace", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("loads leads and renders pipeline section", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              id: "1",
              name: "John",
              phone: "4075551111",
              service: "Interior",
              locale: "en",
              source: "free-estimate",
              status: "NEW",
              createdAt: new Date().toISOString()
            }
          ]
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: []
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: null
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: []
        })
      });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);
    Object.defineProperty(window, "fetch", {
      value: fetchMock,
      writable: true
    });

    render(<AdminLeadsWorkspace />);

    expect(fetchMock.mock.calls[0]?.[0]).toContain("/api/admin/leads?");
    expect(await screen.findByText("Lead Inbox")).toBeInTheDocument();
    expect(await screen.findByText("Lead Notes")).toBeInTheDocument();
    expect(await screen.findByText("Follow-up Reminder")).toBeInTheDocument();
    expect(await screen.findByText("Lead Timeline")).toBeInTheDocument();
    expect(await screen.findByText("Export CSV")).toBeInTheDocument();
    expect(fetchMock.mock.calls.some((call) => String(call[0]).includes("/api/admin/leads/1/notes"))).toBe(true);
  });
});
