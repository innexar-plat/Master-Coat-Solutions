import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/services/admin-request-auth.service", () => ({
  authorizeAdminRequest: vi.fn()
}));

vi.mock("@/modules/analytics/services/analytics-storage.service", () => ({
  buildAnalyticsSummary: vi.fn()
}));

import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { buildAnalyticsSummary } from "@/modules/analytics/services/analytics-storage.service";
import { GET } from "./route";

describe("GET /api/admin/analytics/summary", () => {
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
    const response = await GET(new Request("http://localhost/api/admin/analytics/summary"));
    expect(response.status).toBe(401);
  });

  it("returns summary when authorized", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: true,
      session: {
        role: "ADMIN"
      }
    });
    vi.mocked(buildAnalyticsSummary).mockResolvedValue({
      totalEvents: 10,
      uniquePages: 4,
      eventsByName: {},
      topPages: [],
      lastEventAt: null
    });

    const response = await GET(new Request("http://localhost/api/admin/analytics/summary?sinceDays=15"));
    expect(response.status).toBe(200);
    expect(buildAnalyticsSummary).toHaveBeenCalledWith(15);
  });

  it("returns 403 when role is insufficient", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: false,
      statusCode: 403,
      error: "Forbidden",
      message: "Insufficient permissions"
    });

    const response = await GET(new Request("http://localhost/api/admin/analytics/summary"));
    expect(response.status).toBe(403);
  });
});
