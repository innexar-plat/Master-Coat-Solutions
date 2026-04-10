import { z } from "zod";

export const blogLocaleSchema = z.enum(["en", "pt", "es"]);

export const localizedTextSchema = z.object({
  en: z.string().trim().min(3).max(220),
  pt: z.string().trim().min(3).max(220),
  es: z.string().trim().min(3).max(220)
});

export const localizedParagraphsSchema = z.object({
  en: z.array(z.string().trim().min(10).max(1000)).min(1).max(10),
  pt: z.array(z.string().trim().min(10).max(1000)).min(1).max(10),
  es: z.array(z.string().trim().min(10).max(1000)).min(1).max(10)
});

export const createBlogPostSchema = z.object({
  slug: z.string().trim().min(3).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().trim().min(3).max(80),
  title: localizedTextSchema,
  excerpt: localizedTextSchema,
  content: localizedParagraphsSchema
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
