import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { getAdminApiText } from "@/modules/admin/i18n/admin-i18n";
import { updateSocialLinksSettingsSchema } from "@/modules/settings/dtos/social-links-settings.dto";
import { readSocialLinksSettings, updateSocialLinksSettings } from "@/modules/settings/services/social-links-settings.service";

export async function GET(request: Request) {
  const auth = authorizeAdminRequest(request, "VIEWER");

  if (!auth.authorized) {
    return NextResponse.json(
      {
        statusCode: auth.statusCode,
        error: auth.error,
        message: auth.message
      },
      { status: auth.statusCode }
    );
  }

  const settings = await readSocialLinksSettings();

  return NextResponse.json(
    {
      data: settings
    },
    { status: 200 }
  );
}

export async function PATCH(request: Request) {
  const t = (key: string) => getAdminApiText(request, key);
  const auth = authorizeAdminRequest(request, "ADMIN");

  if (!auth.authorized) {
    return NextResponse.json(
      {
        statusCode: auth.statusCode,
        error: auth.error,
        message: auth.message
      },
      { status: auth.statusCode }
    );
  }

  try {
    const body = await request.json();
    const payload = updateSocialLinksSettingsSchema.parse(body);

    const updated = await updateSocialLinksSettings(payload);

    return NextResponse.json(
      {
        data: updated,
        message: t("api.settings.social.updated")
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        statusCode: 400,
        error: "Bad Request",
        message: t("api.settings.social.invalidPayload")
      },
      { status: 400 }
    );
  }
}
