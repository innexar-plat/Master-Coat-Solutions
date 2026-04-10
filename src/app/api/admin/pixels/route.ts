import { NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { getAdminApiText } from "@/modules/admin/i18n/admin-i18n";
import { updatePixelSettingsSchema } from "@/modules/pixels/dtos/pixel-settings.dto";
import { readPixelSettings, updatePixelSettings } from "@/modules/pixels/services/pixel-settings.service";

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

  const settings = await readPixelSettings();

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
    const payload = updatePixelSettingsSchema.parse(body);

    const updated = await updatePixelSettings(payload);

    return NextResponse.json(
      {
        data: updated,
        message: t("api.pixels.updated")
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        statusCode: 400,
        error: "Bad Request",
        message: t("api.pixels.invalidPayload")
      },
      { status: 400 }
    );
  }
}
