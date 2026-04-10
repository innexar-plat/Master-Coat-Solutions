import { describe, expect, it } from "vitest";
import { trackAnalyticsEventSchema } from "@/modules/analytics/dtos/track-event.dto";

describe("trackAnalyticsEventSchema", () => {
  it("accepts valid analytics payload", () => {
    const parsed = trackAnalyticsEventSchema.parse({
      eventName: "CTA_CLICK",
      pagePath: "/en",
      locale: "en",
      source: "hero",
      metadata: {
        ctaLabel: "Get free estimate"
      }
    });

    expect(parsed.eventName).toBe("CTA_CLICK");
  });

  it("rejects invalid event name", () => {
    expect(() =>
      trackAnalyticsEventSchema.parse({
        eventName: "INVALID",
        pagePath: "/en"
      })
    ).toThrow();
  });
});
