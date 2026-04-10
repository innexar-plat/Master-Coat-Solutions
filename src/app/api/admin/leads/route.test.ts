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

describe("GET /api/admin/leads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when request is not authenticated", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: false,
      statusCode: 401,
      error: "Unauthorized",
      message: "Admin authentication required"
    });

    const response = await GET(new Request("http://localhost/api/admin/leads"));
    expect(response.status).toBe(401);
  });

  it("returns filtered leads payload", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: true,
      session: {
        role: "ADMIN"
      }
    });
    vi.mocked(listLeads).mockResolvedValue({
      data: [
        {
          id: "1",
          name: "John",
          phone: "407",
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
        limit: 20,
        totalPages: 1
      }
    });

    const response = await GET(new Request("http://localhost/api/admin/leads?status=NEW&search=john"));
    const json = (await response.json()) as { data: unknown[]; meta: { total: number } };

    expect(response.status).toBe(200);
    expect(json.data).toHaveLength(1);
    expect(json.meta.total).toBe(1);
  });

  it("returns 400 for invalid query params", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: true,
      session: {
        role: "ADMIN"
      }
    });

    const response = await GET(new Request("http://localhost/api/admin/leads?limit=999"));
    expect(response.status).toBe(400);
  });

  it("returns 403 when role has insufficient permissions", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: false,
      statusCode: 403,
      error: "Forbidden",
      message: "Insufficient permissions"
    });

    const response = await GET(new Request("http://localhost/api/admin/leads"));
    expect(response.status).toBe(403);
  });
});
