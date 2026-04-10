import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./src/i18n/routing";
import { ADMIN_SESSION_COOKIE } from "./src/modules/auth/services/auth.constants";
import { ADMIN_LOCALE_COOKIE, detectAdminLocaleFromHeader, resolveAdminLocale } from "./src/modules/admin/i18n/admin-i18n";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const isLoginRoute = pathname === "/admin/login";
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const hasSession = Boolean(token);
    const adminLocale = request.cookies.get(ADMIN_LOCALE_COOKIE)?.value;
    const publicLocale = request.cookies.get("NEXT_LOCALE")?.value;

    const inferredAdminLocale =
      resolveAdminLocale(adminLocale) ??
      resolveAdminLocale(publicLocale) ??
      detectAdminLocaleFromHeader(request.headers.get("accept-language"));

    if (!hasSession && !isLoginRoute) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      if (!adminLocale) {
        response.cookies.set(ADMIN_LOCALE_COOKIE, inferredAdminLocale, {
          httpOnly: false,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 365
        });
      }
      return response;
    }

    if (hasSession && isLoginRoute) {
      const response = NextResponse.redirect(new URL("/admin", request.url));
      if (!adminLocale) {
        response.cookies.set(ADMIN_LOCALE_COOKIE, inferredAdminLocale, {
          httpOnly: false,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 365
        });
      }
      return response;
    }

    const response = NextResponse.next();
    if (!adminLocale) {
      response.cookies.set(ADMIN_LOCALE_COOKIE, inferredAdminLocale, {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365
      });
    }

    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]
};
