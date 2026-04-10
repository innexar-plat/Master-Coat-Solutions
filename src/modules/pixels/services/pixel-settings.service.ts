import { promises as fs } from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_PIXEL_SETTINGS,
  pixelSettingsSchema,
  type PixelSettings,
  type UpdatePixelSettingsInput
} from "@/modules/pixels/dtos/pixel-settings.dto";

const PIXEL_SETTINGS_FILE_PATH = path.join(process.cwd(), "data", "pixel-settings.json");
const PIXEL_SETTINGS_SINGLETON_ID = "default";

function toDomainPixelSettings(input: Partial<PixelSettings>): PixelSettings {
  return pixelSettingsSchema.parse({
    ...DEFAULT_PIXEL_SETTINGS,
    ...input
  });
}

async function readLegacyPixelSettingsFile(): Promise<PixelSettings | null> {
  try {
    const current = await fs.readFile(PIXEL_SETTINGS_FILE_PATH, "utf8");
    const json = JSON.parse(current) as Partial<PixelSettings>;
    return toDomainPixelSettings(json);
  } catch {
    return null;
  }
}

async function ensurePixelSettingsRow() {
  const existing = await prisma.pixelSettings.findUnique({
    where: { id: PIXEL_SETTINGS_SINGLETON_ID }
  });

  if (existing) {
    return existing;
  }

  const legacy = await readLegacyPixelSettingsFile();
  const initial = toDomainPixelSettings(legacy ?? DEFAULT_PIXEL_SETTINGS);

  return prisma.pixelSettings.create({
    data: {
      id: PIXEL_SETTINGS_SINGLETON_ID,
      enabled: initial.enabled,
      ga4MeasurementId: initial.ga4MeasurementId ?? "",
      gtmId: initial.gtmId ?? "",
      metaPixelId: initial.metaPixelId ?? "",
      googleAdsId: initial.googleAdsId ?? "",
      tiktokPixelId: initial.tiktokPixelId ?? ""
    }
  });
}

export async function readPixelSettings(): Promise<PixelSettings> {
  const row = await ensurePixelSettingsRow();

  return toDomainPixelSettings({
    enabled: row.enabled,
    ga4MeasurementId: row.ga4MeasurementId,
    gtmId: row.gtmId,
    metaPixelId: row.metaPixelId,
    googleAdsId: row.googleAdsId,
    tiktokPixelId: row.tiktokPixelId
  });
}

export async function updatePixelSettings(input: UpdatePixelSettingsInput): Promise<PixelSettings> {
  const row = await ensurePixelSettingsRow();
  const current = toDomainPixelSettings({
    enabled: row.enabled,
    ga4MeasurementId: row.ga4MeasurementId,
    gtmId: row.gtmId,
    metaPixelId: row.metaPixelId,
    googleAdsId: row.googleAdsId,
    tiktokPixelId: row.tiktokPixelId
  });

  const updated = pixelSettingsSchema.parse({
    ...current,
    ...input
  });

  await prisma.pixelSettings.update({
    where: { id: PIXEL_SETTINGS_SINGLETON_ID },
    data: {
      enabled: updated.enabled,
      ga4MeasurementId: updated.ga4MeasurementId ?? "",
      gtmId: updated.gtmId ?? "",
      metaPixelId: updated.metaPixelId ?? "",
      googleAdsId: updated.googleAdsId ?? "",
      tiktokPixelId: updated.tiktokPixelId ?? ""
    }
  });

  return updated;
}
