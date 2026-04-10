import { describe, expect, it, beforeEach, vi } from "vitest";
import { updatePixelSettingsSchema } from "@/modules/pixels/dtos/pixel-settings.dto";
import { readPixelSettings, updatePixelSettings } from "@/modules/pixels/services/pixel-settings.service";

const prismaMock = vi.hoisted(() => ({
  pixelSettings: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn()
  }
}));

const fsMock = vi.hoisted(() => ({
  readFile: vi.fn()
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock
}));

vi.mock("node:fs", () => ({
  default: {
    promises: {
      readFile: fsMock.readFile
    }
  },
  promises: {
    readFile: fsMock.readFile
  }
}));

describe("pixel-settings service contracts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepts partial updates", () => {
    const payload = updatePixelSettingsSchema.parse({
      enabled: true,
      ga4MeasurementId: "G-TEST123"
    });

    expect(payload.enabled).toBe(true);
    expect(payload.ga4MeasurementId).toBe("G-TEST123");
  });

  it("rejects overlong ids", () => {
    const invalidValue = "A".repeat(81);

    expect(() =>
      updatePixelSettingsSchema.parse({
        gtmId: invalidValue
      })
    ).toThrow();
  });

  it("reads settings directly from database when singleton row exists", async () => {
    prismaMock.pixelSettings.findUnique.mockResolvedValue({
      id: "default",
      enabled: true,
      ga4MeasurementId: "G-ABCD",
      gtmId: "GTM-123",
      metaPixelId: "META-1",
      googleAdsId: "ADS-1",
      tiktokPixelId: "TT-1"
    });

    const result = await readPixelSettings();

    expect(result.enabled).toBe(true);
    expect(result.ga4MeasurementId).toBe("G-ABCD");
    expect(prismaMock.pixelSettings.create).not.toHaveBeenCalled();
  });

  it("bootstraps singleton row from legacy JSON file when database is empty", async () => {
    prismaMock.pixelSettings.findUnique.mockResolvedValue(null);
    fsMock.readFile.mockResolvedValue(
      JSON.stringify({
        enabled: true,
        ga4MeasurementId: "G-LEGACY"
      }) as never
    );
    prismaMock.pixelSettings.create.mockResolvedValue({
      id: "default",
      enabled: true,
      ga4MeasurementId: "G-LEGACY",
      gtmId: "",
      metaPixelId: "",
      googleAdsId: "",
      tiktokPixelId: ""
    });

    const result = await readPixelSettings();

    expect(result.ga4MeasurementId).toBe("G-LEGACY");
    expect(prismaMock.pixelSettings.create).toHaveBeenCalledTimes(1);
  });

  it("updates settings and persists merged values to database", async () => {
    prismaMock.pixelSettings.findUnique.mockResolvedValue({
      id: "default",
      enabled: false,
      ga4MeasurementId: "",
      gtmId: "",
      metaPixelId: "",
      googleAdsId: "",
      tiktokPixelId: ""
    });
    prismaMock.pixelSettings.update.mockResolvedValue({
      id: "default"
    });

    const result = await updatePixelSettings({
      enabled: true,
      gtmId: "GTM-NEW"
    });

    expect(result.enabled).toBe(true);
    expect(result.gtmId).toBe("GTM-NEW");
    expect(prismaMock.pixelSettings.update).toHaveBeenCalledWith({
      where: { id: "default" },
      data: {
        enabled: true,
        ga4MeasurementId: "",
        gtmId: "GTM-NEW",
        metaPixelId: "",
        googleAdsId: "",
        tiktokPixelId: ""
      }
    });
  });

  it("falls back to defaults when legacy file is not available", async () => {
    prismaMock.pixelSettings.findUnique.mockResolvedValue(null);
    fsMock.readFile.mockRejectedValue(new Error("missing file"));
    prismaMock.pixelSettings.create.mockResolvedValue({
      id: "default",
      enabled: false,
      ga4MeasurementId: "",
      gtmId: "",
      metaPixelId: "",
      googleAdsId: "",
      tiktokPixelId: ""
    });

    const result = await readPixelSettings();

    expect(result.enabled).toBe(false);
    expect(prismaMock.pixelSettings.create).toHaveBeenCalledTimes(1);
  });
});
