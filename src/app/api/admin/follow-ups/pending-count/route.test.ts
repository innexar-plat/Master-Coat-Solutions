import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/services/admin-request-auth.service", () => ({
  authorizeAdminRequest: vi.fn()
}));

vi.mock("@/modules/leads/services/lead-follow-up.service", () => ({
  countPendingFollowUps: vi.fn()
}));

import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { countPendingFollowUps } from "@/modules/leads/services/lead-follow-up.service";
import { GET } from "./route";

describe("GET /api/admin/follow-ups/pending-count", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 403 when forbidden", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: false,
      statusCode: 403,
      error: "Forbidden",
      message: "Insufficient permissions"
    });

    const response = await GET(new Request("http://localhost/api/admin/follow-ups/pending-count"));
    expect(response.status).toBe(403);
  });

  it("returns pending count when authorized", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: true,
      session: { role: "VIEWER" }
    });
    vi.mocked(countPendingFollowUps).mockResolvedValue(2);

    const response = await GET(new Request("http://localhost/api/admin/follow-ups/pending-count"));
    expect(response.status).toBe(200);
  });
});
