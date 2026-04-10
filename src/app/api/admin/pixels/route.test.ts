import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/services/admin-request-auth.service", () => ({
  authorizeAdminRequest: vi.fn()
}));

vi.mock("@/modules/pixels/services/pixel-settings.service", () => ({
  readPixelSettings: vi.fn(),
  updatePixelSettings: vi.fn()
}));

import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { readPixelSettings, updatePixelSettings } from "@/modules/pixels/services/pixel-settings.service";
import { GET, PATCH } from "./route";

describe("/api/admin/pixels", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET returns 401 when unauthorized", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: false,
      statusCode: 401,
      error: "Unauthorized",
      message: "Admin authentication required"
    });
    const response = await GET(new Request("http://localhost/api/admin/pixels"));
    expect(response.status).toBe(401);
  });

  it("GET returns settings when authorized", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: true,
      session: {
        role: "VIEWER"
      }
    });
    vi.mocked(readPixelSettings).mockResolvedValue({
      enabled: true,
      ga4MeasurementId: "G-TEST",
      gtmId: "",
      metaPixelId: "",
      googleAdsId: "",
      tiktokPixelId: ""
    });

    const response = await GET(new Request("http://localhost/api/admin/pixels"));
    expect(response.status).toBe(200);
  });

  it("PATCH returns 200 when payload is valid", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: true,
      session: {
        role: "SUPER_ADMIN"
      }
    });
    vi.mocked(updatePixelSettings).mockResolvedValue({
      enabled: true,
      ga4MeasurementId: "G-TEST",
      gtmId: "",
      metaPixelId: "",
      googleAdsId: "",
      tiktokPixelId: ""
    });

    const response = await PATCH(
      new Request("http://localhost/api/admin/pixels", {
        method: "PATCH",
        body: JSON.stringify({ enabled: true, ga4MeasurementId: "G-TEST" })
      })
    );

    expect(response.status).toBe(200);
  });

  it("PATCH returns 400 for invalid payload", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: true,
      session: {
        role: "SUPER_ADMIN"
      }
    });

    const response = await PATCH(
      new Request("http://localhost/api/admin/pixels", {
        method: "PATCH",
        body: JSON.stringify({ gtmId: "A".repeat(200) })
      })
    );

    expect(response.status).toBe(400);
  });

  it("PATCH returns 403 when role is insufficient", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: false,
      statusCode: 403,
      error: "Forbidden",
      message: "Insufficient permissions"
    });

    const response = await PATCH(
      new Request("http://localhost/api/admin/pixels", {
        method: "PATCH",
        body: JSON.stringify({ enabled: true })
      })
    );

    expect(response.status).toBe(403);
  });
});
