import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/services/admin-request-auth.service", () => ({
  authorizeAdminRequest: vi.fn()
}));

vi.mock("@/modules/leads/services/list-leads.service", () => ({
  listLeads: vi.fn()
}));

import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { listLeads } from "@/modules/leads/services/list-leads.service";
import { GET } from "./route";

describe("GET /api/admin/leads/export", () => {
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

    const response = await GET(new Request("http://localhost/api/admin/leads/export"));
    expect(response.status).toBe(403);
  });

  it("returns csv payload when authorized", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: true,
      session: { role: "VIEWER" }
    });
    vi.mocked(listLeads).mockResolvedValue({
      data: [
        {
          id: "1",
          name: "John",
          phone: "407555",
          email: "john@email.com",
          service: "Interior",
          locale: "en",
          source: "free-estimate",
          status: "NEW",
          createdAt: new Date().toISOString()
        }
      ],
      meta: {
        total: 1,
        page: 1,
        limit: 100,
        totalPages: 1
      }
    });

    const response = await GET(new Request("http://localhost/api/admin/leads/export"));
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/csv");
  });
});
