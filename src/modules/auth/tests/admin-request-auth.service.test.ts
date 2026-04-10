import { describe, expect, it } from "vitest";
import { createAdminSessionToken } from "@/modules/auth/services/admin-session.service";
import {
  authorizeAdminRequest,
  isAdminRequestAuthenticated
} from "@/modules/auth/services/admin-request-auth.service";

describe("admin-request-auth.service", () => {
  it("authorizes by required role", () => {
    const token = createAdminSessionToken("admin@vinipainting.com", "ADMIN", 60);
    const request = new Request("https://example.com/api/admin", {
      headers: {
        cookie: `admin_session=${encodeURIComponent(token)}`
      }
    });

    expect(isAdminRequestAuthenticated(request, "VIEWER")).toBe(true);
    expect(isAdminRequestAuthenticated(request, "ADMIN")).toBe(true);
    expect(isAdminRequestAuthenticated(request, "SUPER_ADMIN")).toBe(false);
  });

  it("returns 403 authorization result for insufficient role", () => {
    const token = createAdminSessionToken("viewer@vinipainting.com", "VIEWER", 60);
    const request = new Request("https://example.com/api/admin", {
      headers: {
        cookie: `admin_session=${encodeURIComponent(token)}`
      }
    });

    const auth = authorizeAdminRequest(request, "ADMIN");

    expect(auth.authorized).toBe(false);
    if (!auth.authorized) {
      expect(auth.statusCode).toBe(403);
      expect(auth.error).toBe("Forbidden");
    }
  });

  it("returns 401 authorization result when token is missing", () => {
    const request = new Request("https://example.com/api/admin");
    const auth = authorizeAdminRequest(request, "VIEWER");

    expect(auth.authorized).toBe(false);
    if (!auth.authorized) {
      expect(auth.statusCode).toBe(401);
      expect(auth.error).toBe("Unauthorized");
    }
  });
});
