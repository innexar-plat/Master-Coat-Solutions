import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LeadActivityTimeline } from "./LeadActivityTimeline";

describe("LeadActivityTimeline", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("loads lead activity rows", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            id: "a1",
            leadId: "1",
            type: "STATUS_CHANGED",
            description: "Status changed to CONTACTED",
            createdBy: "admin",
            createdAt: new Date().toISOString()
          }
        ]
      })
    });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);
    Object.defineProperty(window, "fetch", {
      value: fetchMock,
      writable: true
    });

    render(<LeadActivityTimeline leadId="1" />);

    expect(await screen.findByText("Lead Timeline")).toBeInTheDocument();
    expect(await screen.findByText("Status changed to CONTACTED")).toBeInTheDocument();
  });
});
