import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/analytics/services/analytics-capture.service", () => ({
  captureAnalyticsEvent: vi.fn()
}));

import { captureAnalyticsEvent } from "@/modules/analytics/services/analytics-capture.service";
import { POST } from "./route";

describe("POST /api/analytics/track", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 201 for valid event", async () => {
    vi.mocked(captureAnalyticsEvent).mockResolvedValue({ id: "evt-1" } as never);

    const response = await POST(
      new Request("http://localhost/api/analytics/track", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          referer: "https://google.com",
          "user-agent": "ua-test"
        },
        body: JSON.stringify({
          eventName: "CTA_CLICK",
          pagePath: "/en",
          locale: "en"
        })
      })
    );

    expect(response.status).toBe(201);
  });

  it("returns 400 for invalid payload", async () => {
    const response = await POST(
      new Request("http://localhost/api/analytics/track", {
        method: "POST",
        body: JSON.stringify({ eventName: "INVALID" })
      })
    );

    expect(response.status).toBe(400);
  });
});
