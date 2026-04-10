import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS
} from "@/modules/auth/services/auth.constants";
import {
  createAdminSessionToken,
  getAdminCredentials
} from "@/modules/auth/services/admin-session.service";
import { getAdminApiText } from "@/modules/admin/i18n/admin-i18n";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  const t = (key: string) => getAdminApiText(request, key);

  try {
    const body = await request.json();
    const payload = loginSchema.parse(body);
    const credentials = getAdminCredentials();

    if (payload.email !== credentials.email || payload.password !== credentials.password) {
      return NextResponse.json(
        {
          statusCode: 401,
          error: "Unauthorized",
          message: t("api.auth.invalidCredentials")
        },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken(payload.email, credentials.role);

    const response = NextResponse.json(
      {
        data: {
          email: payload.email,
          role: credentials.role
        },
        message: t("api.auth.loginSuccess")
      },
      { status: 200 }
    );

    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_TTL_SECONDS
    });

    return response;
  } catch {
    return NextResponse.json(
      {
        statusCode: 400,
        error: "Bad Request",
        message: t("api.auth.invalidLoginPayload")
      },
      { status: 400 }
    );
  }
}
