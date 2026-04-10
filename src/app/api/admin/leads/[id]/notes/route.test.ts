import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/services/admin-request-auth.service", () => ({
  authorizeAdminRequest: vi.fn()
}));

vi.mock("@/modules/leads/services/lead-note.service", () => ({
  listLeadNotes: vi.fn(),
  createLeadNote: vi.fn()
}));

vi.mock("@/modules/leads/services/lead-activity.service", () => ({
  trackLeadNoteAdded: vi.fn()
}));

import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { createLeadNote, listLeadNotes } from "@/modules/leads/services/lead-note.service";
import { GET, POST } from "./route";

describe("/api/admin/leads/:id/notes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET returns notes for authorized user", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({ authorized: true, session: { role: "VIEWER" } });
    vi.mocked(listLeadNotes).mockResolvedValue([]);

    const response = await GET(new Request("http://localhost/api/admin/leads/1/notes"), { params: { id: "1" } });
    expect(response.status).toBe(200);
  });

  it("POST returns 403 for insufficient role", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: false,
      statusCode: 403,
      error: "Forbidden",
      message: "Insufficient permissions"
    });

    const response = await POST(
      new Request("http://localhost/api/admin/leads/1/notes", {
        method: "POST",
        body: JSON.stringify({ note: "follow up" })
      }),
      { params: { id: "1" } }
    );

    expect(response.status).toBe(403);
  });

  it("POST creates note for admin", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: true,
      session: { role: "ADMIN", email: "admin@vinipainting.com" }
    });
    vi.mocked(createLeadNote).mockResolvedValue({
      id: "n1",
      leadId: "1",
      note: "follow up",
      createdAt: new Date().toISOString(),
      createdBy: "admin@vinipainting.com"
    });

    const response = await POST(
      new Request("http://localhost/api/admin/leads/1/notes", {
        method: "POST",
        body: JSON.stringify({ note: "follow up" })
      }),
      { params: { id: "1" } }
    );

    expect(response.status).toBe(201);
  });
});
