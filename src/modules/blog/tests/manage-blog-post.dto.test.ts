import { describe, expect, it } from "vitest";
import { createBlogPostSchema } from "@/modules/blog/dtos/manage-blog-post.dto";

describe("manage-blog-post dto", () => {
  it("accepts a valid localized blog payload", () => {
    const parsed = createBlogPostSchema.parse({
      slug: "orlando-exterior-paint-guide",
      category: "Painting Tips",
      title: {
        en: "Orlando exterior paint guide",
        pt: "Guia de pintura externa em Orlando",
        es: "Guia de pintura exterior en Orlando"
      },
      excerpt: {
        en: "A practical guide for exterior painting in humid weather.",
        pt: "Um guia pratico para pintura externa em clima umido.",
        es: "Una guia practica para pintura exterior en clima humedo."
      },
      content: {
        en: ["Use high-quality acrylic paint and proper primer for longer durability."],
        pt: ["Use tinta acrilica premium e primer adequado para maior durabilidade."],
        es: ["Use pintura acrilica premium e imprimacion adecuada para mayor durabilidad."]
      }
    });

    expect(parsed.slug).toBe("orlando-exterior-paint-guide");
  });

  it("rejects invalid slug format", () => {
    expect(() =>
      createBlogPostSchema.parse({
        slug: "Invalid Slug",
        category: "Painting Tips",
        title: {
          en: "Orlando exterior paint guide",
          pt: "Guia de pintura externa em Orlando",
          es: "Guia de pintura exterior en Orlando"
        },
        excerpt: {
          en: "A practical guide for exterior painting in humid weather.",
          pt: "Um guia pratico para pintura externa em clima umido.",
          es: "Una guia practica para pintura exterior en clima humedo."
        },
        content: {
          en: ["Use high-quality acrylic paint and proper primer for longer durability."],
          pt: ["Use tinta acrilica premium e primer adequado para maior durabilidade."],
          es: ["Use pintura acrilica premium e imprimacion adecuada para mayor durabilidad."]
        }
      })
    ).toThrow();
  });
});
