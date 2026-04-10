import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/services/admin-request-auth.service", () => ({
  authorizeAdminRequest: vi.fn()
}));

vi.mock("@/modules/leads/services/lead-follow-up.service", () => ({
  listLeadFollowUps: vi.fn()
}));

import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { listLeadFollowUps } from "@/modules/leads/services/lead-follow-up.service";
import { GET } from "./route";

describe("GET /api/admin/follow-ups", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthorized", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: false,
      statusCode: 401,
      error: "Unauthorized",
      message: "Admin authentication required"
    });

    const response = await GET(new Request("http://localhost/api/admin/follow-ups"));
    expect(response.status).toBe(401);
  });

  it("returns list when authorized", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: true,
      session: { role: "VIEWER" }
    });
    vi.mocked(listLeadFollowUps).mockResolvedValue([
      {
        leadId: "lead-1",
        followUpAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    const response = await GET(new Request("http://localhost/api/admin/follow-ups"));
    expect(response.status).toBe(200);
  });
});
