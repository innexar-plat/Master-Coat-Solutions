import { ADMIN_SESSION_COOKIE, hasRequiredRole, type AdminRole } from "@/modules/auth/services/auth.constants";
import { verifyAdminSessionToken } from "@/modules/auth/services/admin-session.service";
import { getAdminApiText } from "@/modules/admin/i18n/admin-i18n";

export function getAdminRequestSession(request: Request): { valid: boolean; email?: string; role?: AdminRole } {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`))
    ?.split("=")[1];

  if (!token) {
    return { valid: false };
  }

  return verifyAdminSessionToken(decodeURIComponent(token));
}

export function isAdminRequestAuthenticated(request: Request, requiredRole: AdminRole = "ADMIN"): boolean {
  const session = getAdminRequestSession(request);

  if (!session.valid || !session.role) {
    return false;
  }

  return hasRequiredRole(session.role, requiredRole);
}

export type AdminRequestAuthorization =
  | {
      authorized: true;
      session: {
        email?: string;
        role: AdminRole;
      };
    }
  | {
      authorized: false;
      statusCode: 401 | 403;
      error: "Unauthorized" | "Forbidden";
      message: string;
    };

export function authorizeAdminRequest(
  request: Request,
  requiredRole: AdminRole = "ADMIN"
): AdminRequestAuthorization {
  const session = getAdminRequestSession(request);

  if (!session.valid || !session.role) {
    return {
      authorized: false,
      statusCode: 401,
      error: "Unauthorized",
      message: getAdminApiText(request, "api.auth.required")
    };
  }

  if (!hasRequiredRole(session.role, requiredRole)) {
    return {
      authorized: false,
      statusCode: 403,
      error: "Forbidden",
      message: getAdminApiText(request, "api.auth.insufficientPermissions")
    };
  }

  return {
    authorized: true,
    session: {
      email: session.email,
      role: session.role
    }
  };
}
