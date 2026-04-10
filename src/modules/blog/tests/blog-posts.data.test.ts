import { describe, expect, it } from "vitest";
import { findBlogPostBySlug, listBlogPostSlugs, listBlogPosts } from "@/modules/blog/data/blog-posts.data";

describe("blog-posts.data", () => {
  it("returns sorted localized posts", () => {
    const posts = listBlogPosts("en");

    expect(posts.length).toBeGreaterThan(0);
    expect(new Date(posts[0]!.publishedAt).getTime()).toBeGreaterThanOrEqual(new Date(posts[1]!.publishedAt).getTime());
  });

  it("finds blog post by slug and locale", () => {
    const post = findBlogPostBySlug("how-much-does-house-painting-cost-in-orlando", "pt");
    expect(post?.title).toContain("Quanto Custa");
  });

  it("returns null for unknown slug", () => {
    const post = findBlogPostBySlug("missing", "en");
    expect(post).toBeNull();
  });

  it("lists all post slugs", () => {
    const slugs = listBlogPostSlugs();
    expect(slugs).toContain("interior-color-trends-in-orlando-homes-2026");
  });
});
