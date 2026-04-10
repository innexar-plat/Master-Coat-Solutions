import { promises as fs } from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_SOCIAL_LINKS_SETTINGS,
  socialLinksSettingsSchema,
  type SocialLinksSettings,
  type UpdateSocialLinksSettingsInput
} from "@/modules/settings/dtos/social-links-settings.dto";

const SOCIAL_LINKS_SETTINGS_FILE_PATH = path.join(process.cwd(), "data", "social-links-settings.json");
const SOCIAL_LINKS_SETTINGS_SINGLETON_ID = "default";

function toDomainSocialLinksSettings(input: Partial<SocialLinksSettings>): SocialLinksSettings {
  return socialLinksSettingsSchema.parse({
    ...DEFAULT_SOCIAL_LINKS_SETTINGS,
    ...input
  });
}

async function readLegacySocialLinksSettingsFile(): Promise<SocialLinksSettings | null> {
  try {
    const current = await fs.readFile(SOCIAL_LINKS_SETTINGS_FILE_PATH, "utf8");
    const json = JSON.parse(current) as Partial<SocialLinksSettings>;
    return toDomainSocialLinksSettings(json);
  } catch {
    return null;
  }
}

async function ensureSocialLinksSettingsRow() {
  const existing = await prisma.socialLinksSettings.findUnique({
    where: { id: SOCIAL_LINKS_SETTINGS_SINGLETON_ID }
  });

  if (existing) {
    return existing;
  }

  const legacy = await readLegacySocialLinksSettingsFile();
  const initial = toDomainSocialLinksSettings(legacy ?? DEFAULT_SOCIAL_LINKS_SETTINGS);

  return prisma.socialLinksSettings.create({
    data: {
      id: SOCIAL_LINKS_SETTINGS_SINGLETON_ID,
      facebookUrl: initial.facebookUrl ?? "",
      instagramUrl: initial.instagramUrl ?? "",
      linkedinUrl: initial.linkedinUrl ?? "",
      youtubeUrl: initial.youtubeUrl ?? "",
      tiktokUrl: initial.tiktokUrl ?? "",
      xUrl: initial.xUrl ?? ""
    }
  });
}

export async function readSocialLinksSettings(): Promise<SocialLinksSettings> {
  try {
    const row = await ensureSocialLinksSettingsRow();

    return toDomainSocialLinksSettings({
      facebookUrl: row.facebookUrl,
      instagramUrl: row.instagramUrl,
      linkedinUrl: row.linkedinUrl,
      youtubeUrl: row.youtubeUrl,
      tiktokUrl: row.tiktokUrl,
      xUrl: row.xUrl
    });
  } catch {
    const legacy = await readLegacySocialLinksSettingsFile();
    return toDomainSocialLinksSettings(legacy ?? DEFAULT_SOCIAL_LINKS_SETTINGS);
  }
}

export async function updateSocialLinksSettings(
  input: UpdateSocialLinksSettingsInput
): Promise<SocialLinksSettings> {
  const row = await ensureSocialLinksSettingsRow();
  const current = toDomainSocialLinksSettings({
    facebookUrl: row.facebookUrl,
    instagramUrl: row.instagramUrl,
    linkedinUrl: row.linkedinUrl,
    youtubeUrl: row.youtubeUrl,
    tiktokUrl: row.tiktokUrl,
    xUrl: row.xUrl
  });

  const updated = socialLinksSettingsSchema.parse({
    ...current,
    ...input
  });

  await prisma.socialLinksSettings.update({
    where: { id: SOCIAL_LINKS_SETTINGS_SINGLETON_ID },
    data: {
      facebookUrl: updated.facebookUrl ?? "",
      instagramUrl: updated.instagramUrl ?? "",
      linkedinUrl: updated.linkedinUrl ?? "",
      youtubeUrl: updated.youtubeUrl ?? "",
      tiktokUrl: updated.tiktokUrl ?? "",
      xUrl: updated.xUrl ?? ""
    }
  });

  return updated;
}
