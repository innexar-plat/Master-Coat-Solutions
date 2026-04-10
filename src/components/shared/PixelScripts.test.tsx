import { describe, expect, it, vi } from "vitest";

vi.mock("@/modules/pixels/services/pixel-settings.service", () => ({
  readPixelSettings: vi.fn(async () => ({
    enabled: true,
    ga4MeasurementId: "G-TEST123",
    gtmId: "",
    metaPixelId: "",
    googleAdsId: "",
    tiktokPixelId: ""
  }))
}));

import { PixelScripts } from "./PixelScripts";

describe("PixelScripts", () => {
  it("renders tracking scripts when pixel settings are enabled", async () => {
    const view = await PixelScripts();
    expect(view).not.toBeNull();

    const children = (view as { props?: { children?: Array<{ props?: { id?: string } }> } }).props?.children ?? [];
    const scriptIds = children
      .filter((child) => Boolean(child))
      .map((child) => child.props?.id)
      .filter((id) => Boolean(id));

    expect(scriptIds).toContain("gtag-config");
  });
});
