import { promises as fs } from "node:fs";
import path from "node:path";
import { createBlogPostSchema } from "@/modules/blog/dtos/manage-blog-post.dto";
import { listBlogPostSlugs, type BlogLocale } from "@/modules/blog/data/blog-posts.data";

export type StoredBlogPost = {
  slug: string;
  category: string;
  publishedAt: string;
  title: Record<BlogLocale, string>;
  excerpt: Record<BlogLocale, string>;
  content: Record<BlogLocale, string[]>;
};

const BLOG_FILE_PATH = path.join(process.cwd(), "data", "blog-posts.json");

async function ensureBlogFile() {
  await fs.mkdir(path.dirname(BLOG_FILE_PATH), { recursive: true });

  try {
    await fs.access(BLOG_FILE_PATH);
  } catch {
    await fs.writeFile(BLOG_FILE_PATH, "[]", "utf8");
  }
}

export async function readStoredBlogPosts(): Promise<StoredBlogPost[]> {
  await ensureBlogFile();

  const raw = await fs.readFile(BLOG_FILE_PATH, "utf8");
  const parsed = JSON.parse(raw) as StoredBlogPost[];

  return parsed.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function createStoredBlogPost(input: unknown): Promise<StoredBlogPost> {
  const payload = createBlogPostSchema.parse(input);
  const current = await readStoredBlogPosts();

  if (current.some((post) => post.slug === payload.slug)) {
    throw new Error("BLOG_POST_CONFLICT");
  }

  const created: StoredBlogPost = {
    ...payload,
    publishedAt: new Date().toISOString()
  };

  const updated = [created, ...current];
  await fs.writeFile(BLOG_FILE_PATH, JSON.stringify(updated, null, 2), "utf8");

  return created;
}

export async function updateStoredBlogPost(slug: string, input: unknown): Promise<StoredBlogPost | null> {
  const payload = createBlogPostSchema.parse(input);
  const current = await readStoredBlogPosts();
  const index = current.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return null;
  }

  if (payload.slug !== slug && current.some((post) => post.slug === payload.slug)) {
    throw new Error("BLOG_POST_CONFLICT");
  }

  const previous = current[index];
  const updated: StoredBlogPost = {
    ...previous,
    ...payload,
    publishedAt: previous.publishedAt
  };

  const next = [...current];
  next[index] = updated;
  await fs.writeFile(BLOG_FILE_PATH, JSON.stringify(next, null, 2), "utf8");

  return updated;
}

export async function deleteStoredBlogPost(slug: string): Promise<boolean> {
  const current = await readStoredBlogPosts();
  const filtered = current.filter((post) => post.slug !== slug);

  if (filtered.length === current.length) {
    return false;
  }

  await fs.writeFile(BLOG_FILE_PATH, JSON.stringify(filtered, null, 2), "utf8");
  return true;
}

export async function listBlogPostSlugsFromStorage(): Promise<string[]> {
  const posts = await readStoredBlogPosts();

  if (posts.length === 0) {
    return listBlogPostSlugs();
  }

  return posts.map((post) => post.slug);
}

export async function listLocalizedBlogPosts(locale: BlogLocale) {
  const posts = await readStoredBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
    category: post.category,
    publishedAt: post.publishedAt,
    title: post.title[locale],
    excerpt: post.excerpt[locale],
    content: post.content[locale]
  }));
}

export async function findLocalizedBlogPostBySlug(slug: string, locale: BlogLocale) {
  const posts = await readStoredBlogPosts();
  const post = posts.find((entry) => entry.slug === slug);

  if (!post) {
    return null;
  }

  return {
    slug: post.slug,
    category: post.category,
    publishedAt: post.publishedAt,
    title: post.title[locale],
    excerpt: post.excerpt[locale],
    content: post.content[locale]
  };
}
