import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminAnalyticsOverview } from "./AdminAnalyticsOverview";

describe("AdminAnalyticsOverview", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders analytics metrics from API", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        data: {
          totalEvents: 14,
          uniquePages: 4,
          eventsByName: { LEAD_SUBMIT: 3, CTA_CLICK: 6 },
          topPages: [{ pagePath: "/en/free-estimate", count: 8 }],
          lastEventAt: new Date().toISOString()
        }
      })
    }));

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);
    Object.defineProperty(window, "fetch", { value: fetchMock, writable: true });

    render(<AdminAnalyticsOverview />);

    expect(await screen.findByText("Total Events (30d)")).toBeInTheDocument();
    expect(await screen.findByText("14")).toBeInTheDocument();
    expect(await screen.findByText("/en/free-estimate")).toBeInTheDocument();
  });
});
