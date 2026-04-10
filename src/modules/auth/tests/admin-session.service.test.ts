import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = process.env;

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.resetModules();
});

describe("admin-session.service", () => {
  it("creates and verifies valid token", async () => {
    const { createAdminSessionToken, verifyAdminSessionToken } =
      await import("@/modules/auth/services/admin-session.service");
    const token = createAdminSessionToken(
      "admin@vinipainting.com",
      "ADMIN",
      60,
    );
    const result = verifyAdminSessionToken(token);

    expect(result.valid).toBe(true);
    expect(result.email).toBe("admin@vinipainting.com");
    expect(result.role).toBe("ADMIN");
  });

  it("rejects malformed token", async () => {
    const { verifyAdminSessionToken } =
      await import("@/modules/auth/services/admin-session.service");
    const result = verifyAdminSessionToken("invalid-token");

    expect(result.valid).toBe(false);
  });

  it("rejects default production admin password", async () => {
    process.env = {
      ...ORIGINAL_ENV,
      NODE_ENV: "production",
      ADMIN_PASSWORD: "Admin123!",
    };

    const { getAdminCredentials } =
      await import("@/modules/auth/services/admin-session.service");

    expect(() => getAdminCredentials()).toThrowError(
      "ADMIN_PASSWORD must be overridden in production",
    );
  });

  it("rejects default production session secret", async () => {
    process.env = {
      ...ORIGINAL_ENV,
      NODE_ENV: "production",
      ADMIN_SESSION_SECRET: "change-this-secret-in-production",
    };

    const { createAdminSessionToken } =
      await import("@/modules/auth/services/admin-session.service");

    expect(() =>
      createAdminSessionToken("admin@vinipainting.com", "ADMIN"),
    ).toThrowError("ADMIN_SESSION_SECRET must be overridden in production");
  });
});
