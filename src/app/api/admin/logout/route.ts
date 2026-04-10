import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/modules/auth/services/auth.constants";
import { getAdminApiText } from "@/modules/admin/i18n/admin-i18n";

export async function POST(request: Request) {
  const response = NextResponse.json(
    {
      message: getAdminApiText(request, "api.auth.logoutSuccess")
    },
    { status: 200 }
  );

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    maxAge: 0,
    path: "/"
  });

  return response;
}
