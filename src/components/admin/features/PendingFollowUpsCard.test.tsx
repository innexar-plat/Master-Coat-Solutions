import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PendingFollowUpsCard } from "./PendingFollowUpsCard";

describe("PendingFollowUpsCard", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("loads pending follow-up count", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          pendingCount: 3
        }
      })
    });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);
    Object.defineProperty(window, "fetch", {
      value: fetchMock,
      writable: true
    });

    render(<PendingFollowUpsCard />);

    expect(await screen.findByText("3")).toBeInTheDocument();
  });
});
