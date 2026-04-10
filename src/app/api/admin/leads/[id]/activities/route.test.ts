import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/services/admin-request-auth.service", () => ({
  authorizeAdminRequest: vi.fn()
}));

vi.mock("@/modules/leads/services/lead-activity.service", () => ({
  listLeadActivities: vi.fn()
}));

import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { listLeadActivities } from "@/modules/leads/services/lead-activity.service";
import { GET } from "./route";

describe("GET /api/admin/leads/:id/activities", () => {
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

    const response = await GET(new Request("http://localhost/api/admin/leads/1/activities"), {
      params: { id: "1" }
    });

    expect(response.status).toBe(401);
  });

  it("returns activities when authorized", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: true,
      session: { role: "VIEWER" }
    });
    vi.mocked(listLeadActivities).mockResolvedValue([
      {
        id: "a1",
        leadId: "1",
        type: "NOTE_ADDED",
        description: "Note added",
        createdBy: "admin",
        createdAt: new Date().toISOString()
      }
    ]);

    const response = await GET(new Request("http://localhost/api/admin/leads/1/activities"), {
      params: { id: "1" }
    });

    expect(response.status).toBe(200);
  });
});
