import { describe, expect, it, vi } from "vitest";
import { captureAnalyticsEvent } from "@/modules/analytics/services/analytics-capture.service";

describe("captureAnalyticsEvent", () => {
  it("persists normalized analytics event", async () => {
    const appendAnalyticsEvent = vi.fn(async () => undefined);

    const event = await captureAnalyticsEvent(
      {
        eventName: "LEAD_SUBMIT",
        pagePath: "/en/free-estimate",
        locale: "en",
        source: "estimate-form"
      },
      {
        referrer: "https://google.com",
        userAgent: "test-agent"
      },
      {
        storage: { appendAnalyticsEvent }
      }
    );

    expect(event.id).toBeTypeOf("string");
    expect(event.referrer).toBe("https://google.com");
    expect(appendAnalyticsEvent).toHaveBeenCalledTimes(1);
  });
});
