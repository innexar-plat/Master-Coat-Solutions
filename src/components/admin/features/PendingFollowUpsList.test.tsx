import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PendingFollowUpsList } from "./PendingFollowUpsList";

describe("PendingFollowUpsList", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders pending follow-up rows", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            leadId: "lead-1",
            leadName: "John Doe",
            leadPhone: "4075550000",
            leadStatus: "CONTACTED",
            followUpAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
      })
    });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);
    Object.defineProperty(window, "fetch", {
      value: fetchMock,
      writable: true
    });

    render(<PendingFollowUpsList />);

    expect(await screen.findByText("Pending Follow-up Queue")).toBeInTheDocument();
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
  });

  it("marks follow-up as done and removes row", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              leadId: "lead-1",
              leadName: "John Doe",
              leadPhone: "4075550000",
              leadStatus: "CONTACTED",
              followUpAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ]
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            leadId: "lead-1",
            followUpAt: null,
            updatedAt: new Date().toISOString()
          }
        })
      });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);
    Object.defineProperty(window, "fetch", {
      value: fetchMock,
      writable: true
    });

    render(<PendingFollowUpsList />);

    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Mark Done"));

    await waitFor(() => {
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
    expect(String(fetchMock.mock.calls[1]?.[0])).toContain("/api/admin/leads/lead-1/follow-up");
  });
});
