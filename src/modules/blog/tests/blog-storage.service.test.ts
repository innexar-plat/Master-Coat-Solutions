import { beforeEach, describe, expect, it, vi } from "vitest";

const fsMock = {
  mkdir: vi.fn(),
  access: vi.fn(),
  writeFile: vi.fn(),
  readFile: vi.fn()
};

vi.mock("node:fs", () => ({
  default: { promises: fsMock },
  promises: fsMock
}));

describe("blog-storage service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fsMock.mkdir.mockResolvedValue(undefined);
    fsMock.access.mockResolvedValue(undefined);
    fsMock.writeFile.mockResolvedValue(undefined);
  });

  it("creates a post and prepends it to the list", async () => {
    fsMock.readFile.mockResolvedValue(
      JSON.stringify([
        {
          slug: "existing-post",
          category: "Painting Tips",
          publishedAt: "2026-01-01T00:00:00.000Z",
          title: { en: "Existing title en", pt: "Existing title pt", es: "Existing title es" },
          excerpt: { en: "Existing excerpt en", pt: "Existing excerpt pt", es: "Existing excerpt es" },
          content: {
            en: ["Existing paragraph en enough length"],
            pt: ["Paragrafo existente pt suficiente"],
            es: ["Parrafo existente es suficiente"]
          }
        }
      ])
    );

    const { createStoredBlogPost } = await import("@/modules/blog/services/blog-storage.service");

    const created = await createStoredBlogPost({
      slug: "new-post",
      category: "Color Trends",
      title: { en: "New title en", pt: "Novo titulo pt", es: "Nuevo titulo es" },
      excerpt: { en: "New excerpt en", pt: "Novo resumo pt", es: "Nuevo resumen es" },
      content: {
        en: ["New paragraph en long enough"],
        pt: ["Novo paragrafo pt bem completo"],
        es: ["Nuevo parrafo es suficientemente largo"]
      }
    });

    expect(created.slug).toBe("new-post");
    expect(fsMock.writeFile).toHaveBeenCalledTimes(1);
  });

  it("throws conflict when slug already exists", async () => {
    fsMock.readFile.mockResolvedValue(
      JSON.stringify([
        {
          slug: "existing-post",
          category: "Painting Tips",
          publishedAt: "2026-01-01T00:00:00.000Z",
          title: { en: "Existing title en", pt: "Existing title pt", es: "Existing title es" },
          excerpt: { en: "Existing excerpt en", pt: "Existing excerpt pt", es: "Existing excerpt es" },
          content: {
            en: ["Existing paragraph en enough length"],
            pt: ["Paragrafo existente pt suficiente"],
            es: ["Parrafo existente es suficiente"]
          }
        }
      ])
    );

    const { createStoredBlogPost } = await import("@/modules/blog/services/blog-storage.service");

    await expect(
      createStoredBlogPost({
        slug: "existing-post",
        category: "Color Trends",
        title: { en: "New title en", pt: "Novo titulo pt", es: "Nuevo titulo es" },
        excerpt: { en: "New excerpt en", pt: "Novo resumo pt", es: "Nuevo resumen es" },
        content: {
          en: ["New paragraph en long enough"],
          pt: ["Novo paragrafo pt bem completo"],
          es: ["Nuevo parrafo es suficientemente largo"]
        }
      })
    ).rejects.toThrow("BLOG_POST_CONFLICT");
  });

  it("returns localized payload by slug", async () => {
    fsMock.readFile.mockResolvedValue(
      JSON.stringify([
        {
          slug: "localized-post",
          category: "Painting Tips",
          publishedAt: "2026-01-01T00:00:00.000Z",
          title: { en: "Title EN", pt: "Titulo PT", es: "Titulo ES" },
          excerpt: { en: "Excerpt EN", pt: "Resumo PT", es: "Resumen ES" },
          content: {
            en: ["Long paragraph en here"],
            pt: ["Paragrafo longo pt aqui"],
            es: ["Parrafo largo es aqui"]
          }
        }
      ])
    );

    const { findLocalizedBlogPostBySlug } = await import("@/modules/blog/services/blog-storage.service");
    const post = await findLocalizedBlogPostBySlug("localized-post", "pt");

    expect(post?.title).toBe("Titulo PT");
  });
});
