import { describe, expect, it } from "vitest";
import { pixelSettingsSchema } from "@/modules/pixels/dtos/pixel-settings.dto";

describe("pixelSettingsSchema", () => {
  it("accepts full settings payload", () => {
    const parsed = pixelSettingsSchema.parse({
      enabled: true,
      ga4MeasurementId: "G-TEST123",
      gtmId: "GTM-TEST123",
      metaPixelId: "123456789",
      googleAdsId: "AW-98765",
      tiktokPixelId: "TT-3322"
    });

    expect(parsed.enabled).toBe(true);
  });

  it("defaults to disabled when omitted", () => {
    const parsed = pixelSettingsSchema.parse({});
    expect(parsed.enabled).toBe(false);
  });
});
