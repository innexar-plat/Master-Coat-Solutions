import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/services/admin-request-auth.service", () => ({
  authorizeAdminRequest: vi.fn()
}));

vi.mock("@/modules/blog/services/blog-storage.service", () => ({
  deleteStoredBlogPost: vi.fn()
}));

import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { deleteStoredBlogPost } from "@/modules/blog/services/blog-storage.service";
import { DELETE } from "./route";

describe("/api/admin/blog/:slug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("DELETE returns 403 when role is insufficient", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: false,
      statusCode: 403,
      error: "Forbidden",
      message: "Insufficient permissions"
    });

    const response = await DELETE(new Request("http://localhost/api/admin/blog/post-1"), { params: { slug: "post-1" } });
    expect(response.status).toBe(403);
  });

  it("DELETE returns 404 when slug does not exist", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({ authorized: true, session: { role: "ADMIN" } });
    vi.mocked(deleteStoredBlogPost).mockResolvedValue(false);

    const response = await DELETE(new Request("http://localhost/api/admin/blog/post-1"), { params: { slug: "post-1" } });
    expect(response.status).toBe(404);
  });

  it("DELETE returns 200 when post is deleted", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({ authorized: true, session: { role: "SUPER_ADMIN" } });
    vi.mocked(deleteStoredBlogPost).mockResolvedValue(true);

    const response = await DELETE(new Request("http://localhost/api/admin/blog/post-1"), { params: { slug: "post-1" } });
    expect(response.status).toBe(200);
  });
});
