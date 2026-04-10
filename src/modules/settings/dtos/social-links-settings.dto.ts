import { z } from "zod";

const socialUrlSchema = z.string().trim().max(200).url().optional().or(z.literal(""));

export const socialLinksSettingsSchema = z.object({
  facebookUrl: socialUrlSchema,
  instagramUrl: socialUrlSchema,
  linkedinUrl: socialUrlSchema,
  youtubeUrl: socialUrlSchema,
  tiktokUrl: socialUrlSchema,
  xUrl: socialUrlSchema
});

export const updateSocialLinksSettingsSchema = socialLinksSettingsSchema.partial();

export type SocialLinksSettings = z.infer<typeof socialLinksSettingsSchema>;
export type UpdateSocialLinksSettingsInput = z.infer<typeof updateSocialLinksSettingsSchema>;

export const DEFAULT_SOCIAL_LINKS_SETTINGS: SocialLinksSettings = {
  facebookUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
  youtubeUrl: "",
  tiktokUrl: "",
  xUrl: ""
};
