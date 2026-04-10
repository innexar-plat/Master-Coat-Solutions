import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LeadFollowUpPanel } from "./LeadFollowUpPanel";

describe("LeadFollowUpPanel", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("loads and saves follow-up reminder", async () => {
    const followUpIso = new Date().toISOString();

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            leadId: "1",
            followUpAt: followUpIso,
            updatedAt: new Date().toISOString()
          }
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            leadId: "1",
            followUpAt: followUpIso,
            updatedAt: new Date().toISOString()
          }
        })
      });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);
    Object.defineProperty(window, "fetch", { value: fetchMock, writable: true });

    render(<LeadFollowUpPanel leadId="1" />);

    expect(await screen.findByText("Follow-up Reminder")).toBeInTheDocument();
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    const dateInput = document.querySelector('input[type="datetime-local"]') as HTMLInputElement;
    expect(dateInput).toBeTruthy();
    fireEvent.change(dateInput, { target: { value: dateInput.value } });
    fireEvent.click(screen.getByText("Save Reminder"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
    expect(String(fetchMock.mock.calls[1]?.[0])).toContain("/api/admin/leads/1/follow-up");
  });
});
