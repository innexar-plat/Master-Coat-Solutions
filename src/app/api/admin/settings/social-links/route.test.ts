import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/services/admin-request-auth.service", () => ({
  authorizeAdminRequest: vi.fn()
}));

vi.mock("@/modules/settings/services/social-links-settings.service", () => ({
  readSocialLinksSettings: vi.fn(),
  updateSocialLinksSettings: vi.fn()
}));

import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import {
  readSocialLinksSettings,
  updateSocialLinksSettings
} from "@/modules/settings/services/social-links-settings.service";
import { GET, PATCH } from "./route";

describe("/api/admin/settings/social-links", () => {
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

    const response = await GET(new Request("http://localhost/api/admin/settings/social-links"));
    expect(response.status).toBe(401);
  });

  it("GET returns settings when authorized", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: true,
      session: {
        role: "VIEWER"
      }
    });
    vi.mocked(readSocialLinksSettings).mockResolvedValue({
      facebookUrl: "",
      instagramUrl: "https://instagram.com/mastercoat",
      linkedinUrl: "",
      youtubeUrl: "",
      tiktokUrl: "",
      xUrl: ""
    });

    const response = await GET(new Request("http://localhost/api/admin/settings/social-links"));
    expect(response.status).toBe(200);
  });

  it("PATCH returns 200 when payload is valid", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: true,
      session: {
        role: "SUPER_ADMIN"
      }
    });
    vi.mocked(updateSocialLinksSettings).mockResolvedValue({
      facebookUrl: "",
      instagramUrl: "https://instagram.com/mastercoat",
      linkedinUrl: "",
      youtubeUrl: "",
      tiktokUrl: "",
      xUrl: ""
    });

    const response = await PATCH(
      new Request("http://localhost/api/admin/settings/social-links", {
        method: "PATCH",
        body: JSON.stringify({ instagramUrl: "https://instagram.com/mastercoat" })
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
      new Request("http://localhost/api/admin/settings/social-links", {
        method: "PATCH",
        body: JSON.stringify({ instagramUrl: "not-an-url" })
      })
    );

    expect(response.status).toBe(400);
  });
});
