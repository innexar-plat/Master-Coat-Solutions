import { NextResponse } from "next/server";
import { ADMIN_LOCALE_COOKIE, getAdminApiText, resolveAdminLocale } from "@/modules/admin/i18n/admin-i18n";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { locale?: string } | null;
  const locale = resolveAdminLocale(body?.locale);

  if (!locale) {
    return NextResponse.json(
      {
        statusCode: 400,
        error: "Bad Request",
        message: getAdminApiText(request, "api.admin.invalidLocale")
      },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ data: { locale } }, { status: 200 });
  response.cookies.set(ADMIN_LOCALE_COOKIE, locale, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365
  });

  return response;
}