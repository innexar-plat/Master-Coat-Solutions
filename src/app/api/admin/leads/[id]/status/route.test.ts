import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/services/admin-request-auth.service", () => ({
  authorizeAdminRequest: vi.fn()
}));

vi.mock("@/modules/leads/services/lead-storage.service", () => ({
  updateLeadStatusById: vi.fn()
}));

vi.mock("@/modules/leads/services/lead-activity.service", () => ({
  trackLeadStatusChanged: vi.fn()
}));

import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { updateLeadStatusById } from "@/modules/leads/services/lead-storage.service";
import { PATCH } from "./route";

describe("PATCH /api/admin/leads/:id/status", () => {
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

    const response = await PATCH(new Request("http://localhost/api/admin/leads/1/status", { method: "PATCH" }), {
      params: { id: "1" }
    });

    expect(response.status).toBe(401);
  });

  it("returns 404 when lead does not exist", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: true,
      session: {
        role: "ADMIN"
      }
    });
    vi.mocked(updateLeadStatusById).mockResolvedValue(null);

    const response = await PATCH(
      new Request("http://localhost/api/admin/leads/1/status", {
        method: "PATCH",
        body: JSON.stringify({ status: "CONTACTED" })
      }),
      { params: { id: "1" } }
    );

    expect(response.status).toBe(404);
  });

  it("returns 200 when status update succeeds", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: true,
      session: {
        role: "ADMIN"
      }
    });
    vi.mocked(updateLeadStatusById).mockResolvedValue({
      id: "1",
      name: "John",
      phone: "407",
      service: "Interior",
      locale: "en",
      source: "free-estimate",
      status: "CONTACTED",
      createdAt: new Date().toISOString()
    });

    const response = await PATCH(
      new Request("http://localhost/api/admin/leads/1/status", {
        method: "PATCH",
        body: JSON.stringify({ status: "CONTACTED" })
      }),
      { params: { id: "1" } }
    );

    expect(response.status).toBe(200);
  });

  it("returns 400 for invalid payload", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: true,
      session: {
        role: "ADMIN"
      }
    });

    const response = await PATCH(
      new Request("http://localhost/api/admin/leads/1/status", {
        method: "PATCH",
        body: JSON.stringify({ status: "INVALID" })
      }),
      { params: { id: "1" } }
    );

    expect(response.status).toBe(400);
  });

  it("returns 403 when role is insufficient", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: false,
      statusCode: 403,
      error: "Forbidden",
      message: "Insufficient permissions"
    });

    const response = await PATCH(
      new Request("http://localhost/api/admin/leads/1/status", {
        method: "PATCH",
        body: JSON.stringify({ status: "CONTACTED" })
      }),
      { params: { id: "1" } }
    );

    expect(response.status).toBe(403);
  });
});
