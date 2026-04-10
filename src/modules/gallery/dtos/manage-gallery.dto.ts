import { z } from "zod";

export const galleryCategorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
});

export const galleryAlbumSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  categoryId: z.string().uuid(),
  isPublished: z.boolean().default(true)
});

export const galleryItemSchema = z.object({
  title: z.string().trim().min(3).max(140),
  service: z.string().trim().min(3).max(120),
  location: z.string().trim().min(2).max(120),
  imageUrl: z.string().trim().min(1).max(500),
  categoryId: z.string().uuid(),
  albumId: z.string().uuid(),
  isPublished: z.boolean().default(true)
});

function buildPartialSchema<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return schema.partial().refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field must be provided"
  });
}

export const createGalleryCategorySchema = galleryCategorySchema;
export const updateGalleryCategorySchema = buildPartialSchema(galleryCategorySchema);

export const createGalleryAlbumSchema = galleryAlbumSchema;
export const updateGalleryAlbumSchema = buildPartialSchema(galleryAlbumSchema);

export const createGalleryItemSchema = galleryItemSchema;
export const updateGalleryItemSchema = buildPartialSchema(galleryItemSchema);

export type CreateGalleryCategoryInput = z.infer<typeof createGalleryCategorySchema>;
export type UpdateGalleryCategoryInput = z.infer<typeof updateGalleryCategorySchema>;

export type CreateGalleryAlbumInput = z.infer<typeof createGalleryAlbumSchema>;
export type UpdateGalleryAlbumInput = z.infer<typeof updateGalleryAlbumSchema>;

export type CreateGalleryItemInput = z.infer<typeof createGalleryItemSchema>;
export type UpdateGalleryItemInput = z.infer<typeof updateGalleryItemSchema>;
