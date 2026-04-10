import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

vi.mock("@/modules/auth/services/admin-request-auth.service", () => ({
  authorizeAdminRequest: vi.fn()
}));

vi.mock("@/modules/blog/services/blog-storage.service", () => ({
  readStoredBlogPosts: vi.fn(),
  createStoredBlogPost: vi.fn()
}));

import { authorizeAdminRequest } from "@/modules/auth/services/admin-request-auth.service";
import { createStoredBlogPost, readStoredBlogPosts } from "@/modules/blog/services/blog-storage.service";
import { GET, POST } from "./route";

describe("/api/admin/blog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET returns 401 when unauthorized", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({
      authorized: false,
      statusCode: 401,
      error: "Unauthorized",
      message: "Admin authentication required"
    });

    const response = await GET(new Request("http://localhost/api/admin/blog"));
    expect(response.status).toBe(401);
  });

  it("GET returns posts when authorized", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({ authorized: true, session: { role: "VIEWER" } });
    vi.mocked(readStoredBlogPosts).mockResolvedValue([]);

    const response = await GET(new Request("http://localhost/api/admin/blog"));
    expect(response.status).toBe(200);
  });

  it("POST returns 201 for valid payload", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({ authorized: true, session: { role: "ADMIN" } });
    vi.mocked(createStoredBlogPost).mockResolvedValue({
      slug: "new-post",
      category: "Painting Tips",
      publishedAt: "2026-04-01T10:00:00.000Z",
      title: { en: "Title EN", pt: "Titulo PT", es: "Titulo ES" },
      excerpt: { en: "Excerpt EN", pt: "Resumo PT", es: "Resumen ES" },
      content: {
        en: ["Long paragraph en"],
        pt: ["Paragrafo longo pt"],
        es: ["Parrafo largo es"]
      }
    });

    const response = await POST(
      new Request("http://localhost/api/admin/blog", {
        method: "POST",
        body: JSON.stringify({ slug: "new-post" })
      })
    );

    expect(response.status).toBe(201);
  });

  it("POST returns 400 for zod validation errors", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({ authorized: true, session: { role: "ADMIN" } });
    vi.mocked(createStoredBlogPost).mockRejectedValue(
      new ZodError([
        {
          code: "custom",
          message: "Invalid slug",
          path: ["slug"]
        }
      ])
    );

    const response = await POST(
      new Request("http://localhost/api/admin/blog", {
        method: "POST",
        body: JSON.stringify({ slug: "bad slug" })
      })
    );

    expect(response.status).toBe(400);
  });

  it("POST returns 409 for duplicate slug", async () => {
    vi.mocked(authorizeAdminRequest).mockReturnValue({ authorized: true, session: { role: "ADMIN" } });
    vi.mocked(createStoredBlogPost).mockRejectedValue(new Error("BLOG_POST_CONFLICT"));

    const response = await POST(
      new Request("http://localhost/api/admin/blog", {
        method: "POST",
        body: JSON.stringify({ slug: "new-post" })
      })
    );

    expect(response.status).toBe(409);
  });
});
