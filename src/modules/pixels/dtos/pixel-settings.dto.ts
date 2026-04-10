import { z } from "zod";

const pixelIdSchema = z.string().trim().max(80);

export const pixelSettingsSchema = z.object({
  enabled: z.boolean().default(false),
  ga4MeasurementId: pixelIdSchema.optional().or(z.literal("")),
  gtmId: pixelIdSchema.optional().or(z.literal("")),
  metaPixelId: pixelIdSchema.optional().or(z.literal("")),
  googleAdsId: pixelIdSchema.optional().or(z.literal("")),
  tiktokPixelId: pixelIdSchema.optional().or(z.literal(""))
});

export const updatePixelSettingsSchema = pixelSettingsSchema.partial();

export type PixelSettings = z.infer<typeof pixelSettingsSchema>;
export type UpdatePixelSettingsInput = z.infer<typeof updatePixelSettingsSchema>;

export const DEFAULT_PIXEL_SETTINGS: PixelSettings = {
  enabled: false,
  ga4MeasurementId: "",
  gtmId: "",
  metaPixelId: "",
  googleAdsId: "",
  tiktokPixelId: ""
};
