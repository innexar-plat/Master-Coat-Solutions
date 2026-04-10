import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/services/admin-request-auth.service", () => ({
  authorizeAdminRequest: vi.fn()
}));

vi.mock("@/modules/leads/services/lead-follow-up.service", () => ({
  getLeadFollowUpByLeadId: vi.fn(),
  updateLeadFollowUpByLeadId: vi.fn()
}));

vi.mock("@/modules/leads/services/lead-activity.service", () => ({
  trackLeadFollowUpUpdated: vi.fn()
}));

import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { getLeadFollowUpByLeadId, updateLeadFollowUpByLeadId } from "@/modules/leads/services/lead-follow-up.service";
import { GET, PATCH } from "./route";

describe("/api/admin/leads/:id/follow-up", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET returns null data for missing lead follow-up", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: true,
      session: { role: "VIEWER" }
    });
    vi.mocked(getLeadFollowUpByLeadId).mockResolvedValue(null);

    const response = await GET(new Request("http://localhost/api/admin/leads/1/follow-up"), {
      params: { id: "1" }
    });

    expect(response.status).toBe(200);
  });

  it("PATCH returns 404 when lead does not exist", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: true,
      session: { role: "ADMIN" }
    });
    vi.mocked(updateLeadFollowUpByLeadId).mockResolvedValue(null);

    const response = await PATCH(
      new Request("http://localhost/api/admin/leads/1/follow-up", {
        method: "PATCH",
        body: JSON.stringify({ followUpAt: null })
      }),
      { params: { id: "1" } }
    );

    expect(response.status).toBe(404);
  });

  it("PATCH returns 200 when update succeeds", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: true,
      session: { role: "ADMIN" }
    });
    vi.mocked(updateLeadFollowUpByLeadId).mockResolvedValue({
      leadId: "1",
      followUpAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const response = await PATCH(
      new Request("http://localhost/api/admin/leads/1/follow-up", {
        method: "PATCH",
        body: JSON.stringify({ followUpAt: new Date().toISOString() })
      }),
      { params: { id: "1" } }
    );

    expect(response.status).toBe(200);
  });
});
