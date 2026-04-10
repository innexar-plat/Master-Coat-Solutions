import { prisma } from "@/lib/prisma";
import { hasDatabaseUrl } from "@/lib/env";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  createGalleryAlbumSchema,
  createGalleryCategorySchema,
  createGalleryItemSchema,
  updateGalleryAlbumSchema,
  updateGalleryCategorySchema,
  updateGalleryItemSchema
} from "@/modules/gallery/dtos/manage-gallery.dto";

export type GalleryCategory = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type GalleryAlbum = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  service: string;
  location: string;
  imageUrl: string;
  categoryId: string;
  albumId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GalleryContent = {
  categories: GalleryCategory[];
  albums: GalleryAlbum[];
  items: GalleryItem[];
};

function isPrismaAvailable(): boolean {
  return hasDatabaseUrl();
}

function toIso(d: Date): string {
  return d.toISOString();
}

// â”€â”€â”€ Prisma implementations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

async function prismaReadGalleryContent(): Promise<GalleryContent> {
  const [categories, albums, items] = await Promise.all([
    prisma.galleryCategory.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.galleryAlbum.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } })
  ]);

  return {
    categories: categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, createdAt: toIso(c.createdAt), updatedAt: toIso(c.updatedAt) })),
    albums: albums.map((a) => ({ id: a.id, name: a.name, slug: a.slug, categoryId: a.categoryId, isPublished: a.isPublished, createdAt: toIso(a.createdAt), updatedAt: toIso(a.updatedAt) })),
    items: items.map((i) => ({ id: i.id, title: i.title, service: i.service, location: i.location, imageUrl: i.imageUrl, categoryId: i.categoryId, albumId: i.albumId, isPublished: i.isPublished, createdAt: toIso(i.createdAt), updatedAt: toIso(i.updatedAt) }))
  };
}

async function prismaCreateCategory(input: unknown): Promise<GalleryCategory> {
  const payload = createGalleryCategorySchema.parse(input);
  const existing = await prisma.galleryCategory.findUnique({ where: { slug: payload.slug } });
  if (existing) throw new Error("CATEGORY_CONFLICT");

  const now = new Date();
  const created = await prisma.galleryCategory.create({
    data: { id: crypto.randomUUID(), name: payload.name, slug: payload.slug, createdAt: now, updatedAt: now }
  });
  return { id: created.id, name: created.name, slug: created.slug, createdAt: toIso(created.createdAt), updatedAt: toIso(created.updatedAt) };
}

async function prismaUpdateCategory(id: string, input: unknown): Promise<GalleryCategory | null> {
  const payload = updateGalleryCategorySchema.parse(input);
  const current = await prisma.galleryCategory.findUnique({ where: { id } });
  if (!current) return null;

  if (payload.slug) {
    const conflict = await prisma.galleryCategory.findFirst({ where: { slug: payload.slug, NOT: { id } } });
    if (conflict) throw new Error("CATEGORY_CONFLICT");
  }

  const updated = await prisma.galleryCategory.update({ where: { id }, data: { ...payload, updatedAt: new Date() } });
  return { id: updated.id, name: updated.name, slug: updated.slug, createdAt: toIso(updated.createdAt), updatedAt: toIso(updated.updatedAt) };
}

async function prismaDeleteCategory(id: string): Promise<boolean> {
  const deps = await prisma.galleryAlbum.count({ where: { categoryId: id } });
  if (deps > 0) throw new Error("CATEGORY_IN_USE");
  const itemDeps = await prisma.galleryItem.count({ where: { categoryId: id } });
  if (itemDeps > 0) throw new Error("CATEGORY_IN_USE");

  try {
    await prisma.galleryCategory.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

async function prismaCreateAlbum(input: unknown): Promise<GalleryAlbum> {
  const payload = createGalleryAlbumSchema.parse(input);
  const category = await prisma.galleryCategory.findUnique({ where: { id: payload.categoryId } });
  if (!category) throw new Error("CATEGORY_NOT_FOUND");

  const conflict = await prisma.galleryAlbum.findUnique({ where: { slug: payload.slug } });
  if (conflict) throw new Error("ALBUM_CONFLICT");

  const now = new Date();
  const created = await prisma.galleryAlbum.create({
    data: { id: crypto.randomUUID(), name: payload.name, slug: payload.slug, categoryId: payload.categoryId, isPublished: payload.isPublished, createdAt: now, updatedAt: now }
  });
  return { id: created.id, name: created.name, slug: created.slug, categoryId: created.categoryId, isPublished: created.isPublished, createdAt: toIso(created.createdAt), updatedAt: toIso(created.updatedAt) };
}

async function prismaUpdateAlbum(id: string, input: unknown): Promise<GalleryAlbum | null> {
  const payload = updateGalleryAlbumSchema.parse(input);
  const current = await prisma.galleryAlbum.findUnique({ where: { id } });
  if (!current) return null;

  if (payload.categoryId) {
    const cat = await prisma.galleryCategory.findUnique({ where: { id: payload.categoryId } });
    if (!cat) throw new Error("CATEGORY_NOT_FOUND");
  }
  if (payload.slug) {
    const conflict = await prisma.galleryAlbum.findFirst({ where: { slug: payload.slug, NOT: { id } } });
    if (conflict) throw new Error("ALBUM_CONFLICT");
  }

  const updated = await prisma.galleryAlbum.update({ where: { id }, data: { ...payload, updatedAt: new Date() } });
  return { id: updated.id, name: updated.name, slug: updated.slug, categoryId: updated.categoryId, isPublished: updated.isPublished, createdAt: toIso(updated.createdAt), updatedAt: toIso(updated.updatedAt) };
}

async function prismaDeleteAlbum(id: string): Promise<boolean> {
  const deps = await prisma.galleryItem.count({ where: { albumId: id } });
  if (deps > 0) throw new Error("ALBUM_IN_USE");

  try {
    await prisma.galleryAlbum.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

async function prismaCreateItem(input: unknown): Promise<GalleryItem> {
  const payload = createGalleryItemSchema.parse(input);
  const category = await prisma.galleryCategory.findUnique({ where: { id: payload.categoryId } });
  if (!category) throw new Error("CATEGORY_NOT_FOUND");

  const album = await prisma.galleryAlbum.findUnique({ where: { id: payload.albumId } });
  if (!album) throw new Error("ALBUM_NOT_FOUND");
  if (album.categoryId !== payload.categoryId) throw new Error("ALBUM_CATEGORY_MISMATCH");

  const now = new Date();
  const created = await prisma.galleryItem.create({
    data: { id: crypto.randomUUID(), title: payload.title, service: payload.service, location: payload.location, imageUrl: payload.imageUrl, categoryId: payload.categoryId, albumId: payload.albumId, isPublished: payload.isPublished, createdAt: now, updatedAt: now }
  });
  return { id: created.id, title: created.title, service: created.service, location: created.location, imageUrl: created.imageUrl, categoryId: created.categoryId, albumId: created.albumId, isPublished: created.isPublished, createdAt: toIso(created.createdAt), updatedAt: toIso(created.updatedAt) };
}

async function prismaUpdateItem(id: string, input: unknown): Promise<GalleryItem | null> {
  const payload = updateGalleryItemSchema.parse(input);
  const current = await prisma.galleryItem.findUnique({ where: { id } });
  if (!current) return null;

  const nextCategoryId = payload.categoryId ?? current.categoryId;
  const nextAlbumId = payload.albumId ?? current.albumId;

  const cat = await prisma.galleryCategory.findUnique({ where: { id: nextCategoryId } });
  if (!cat) throw new Error("CATEGORY_NOT_FOUND");
  const album = await prisma.galleryAlbum.findUnique({ where: { id: nextAlbumId } });
  if (!album) throw new Error("ALBUM_NOT_FOUND");
  if (album.categoryId !== nextCategoryId) throw new Error("ALBUM_CATEGORY_MISMATCH");

  const updated = await prisma.galleryItem.update({
    where: { id },
    data: { ...payload, categoryId: nextCategoryId, albumId: nextAlbumId, updatedAt: new Date() }
  });
  return { id: updated.id, title: updated.title, service: updated.service, location: updated.location, imageUrl: updated.imageUrl, categoryId: updated.categoryId, albumId: updated.albumId, isPublished: updated.isPublished, createdAt: toIso(updated.createdAt), updatedAt: toIso(updated.updatedAt) };
}

async function prismaDeleteItem(id: string): Promise<boolean> {
  try {
    await prisma.galleryItem.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

async function prismaListPublic() {
  const items = await prisma.galleryItem.findMany({
    where: { isPublished: true },
    include: { category: { select: { name: true } }, album: { select: { name: true } } },
    orderBy: { createdAt: "desc" }
  });

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    service: item.service,
    location: item.location,
    imageUrl: item.imageUrl,
    categoryName: item.category.name,
    albumName: item.album.name
  }));
}

// â”€â”€â”€ File-based fallback â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const GALLERY_FILE_PATH = path.join(process.cwd(), "data", "gallery-content.json");

const EMPTY_CONTENT: GalleryContent = {
  categories: [],
  albums: [],
  items: []
};

async function ensureGalleryFile() {
  await fs.mkdir(path.dirname(GALLERY_FILE_PATH), { recursive: true });

  try {
    await fs.access(GALLERY_FILE_PATH);
  } catch {
    await fs.writeFile(GALLERY_FILE_PATH, JSON.stringify(EMPTY_CONTENT, null, 2), "utf8");
  }
}

async function readRaw(): Promise<GalleryContent> {
  await ensureGalleryFile();
  const raw = await fs.readFile(GALLERY_FILE_PATH, "utf8");
  const parsed = JSON.parse(raw) as Partial<GalleryContent>;

  return {
    categories: parsed.categories ?? [],
    albums: parsed.albums ?? [],
    items: parsed.items ?? []
  };
}

async function writeRaw(content: GalleryContent) {
  await fs.writeFile(GALLERY_FILE_PATH, JSON.stringify(content, null, 2), "utf8");
}

// â”€â”€â”€ Public API (Prisma-first, file fallback) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function readGalleryContent() {
  if (isPrismaAvailable()) return prismaReadGalleryContent();
  return readRaw();
}

export async function createGalleryCategory(input: unknown) {
  if (isPrismaAvailable()) return prismaCreateCategory(input);

  const payload = createGalleryCategorySchema.parse(input);
  const content = await readRaw();
  if (content.categories.some((entry) => entry.slug === payload.slug)) throw new Error("CATEGORY_CONFLICT");

  const now = new Date().toISOString();
  const created: GalleryCategory = { id: crypto.randomUUID(), name: payload.name, slug: payload.slug, createdAt: now, updatedAt: now };
  content.categories.unshift(created);
  await writeRaw(content);
  return created;
}

export async function updateGalleryCategory(id: string, input: unknown) {
  if (isPrismaAvailable()) return prismaUpdateCategory(id, input);

  const payload = updateGalleryCategorySchema.parse(input);
  const content = await readRaw();
  const index = content.categories.findIndex((entry) => entry.id === id);
  if (index === -1) return null;
  if (payload.slug && content.categories.some((entry) => entry.slug === payload.slug && entry.id !== id)) throw new Error("CATEGORY_CONFLICT");

  const updated: GalleryCategory = { ...content.categories[index], ...payload, updatedAt: new Date().toISOString() };
  content.categories[index] = updated;
  await writeRaw(content);
  return updated;
}

export async function deleteGalleryCategory(id: string) {
  if (isPrismaAvailable()) return prismaDeleteCategory(id);

  const content = await readRaw();
  const hasDeps = content.albums.some((entry) => entry.categoryId === id) || content.items.some((entry) => entry.categoryId === id);
  if (hasDeps) throw new Error("CATEGORY_IN_USE");
  const filtered = content.categories.filter((entry) => entry.id !== id);
  if (filtered.length === content.categories.length) return false;
  content.categories = filtered;
  await writeRaw(content);
  return true;
}

export async function createGalleryAlbum(input: unknown) {
  if (isPrismaAvailable()) return prismaCreateAlbum(input);

  const payload = createGalleryAlbumSchema.parse(input);
  const content = await readRaw();
  if (!content.categories.some((entry) => entry.id === payload.categoryId)) throw new Error("CATEGORY_NOT_FOUND");
  if (content.albums.some((entry) => entry.slug === payload.slug)) throw new Error("ALBUM_CONFLICT");

  const now = new Date().toISOString();
  const created: GalleryAlbum = { id: crypto.randomUUID(), name: payload.name, slug: payload.slug, categoryId: payload.categoryId, isPublished: payload.isPublished, createdAt: now, updatedAt: now };
  content.albums.unshift(created);
  await writeRaw(content);
  return created;
}

export async function updateGalleryAlbum(id: string, input: unknown) {
  if (isPrismaAvailable()) return prismaUpdateAlbum(id, input);

  const payload = updateGalleryAlbumSchema.parse(input);
  const content = await readRaw();
  const index = content.albums.findIndex((entry) => entry.id === id);
  if (index === -1) return null;
  if (payload.categoryId && !content.categories.some((entry) => entry.id === payload.categoryId)) throw new Error("CATEGORY_NOT_FOUND");
  if (payload.slug && content.albums.some((entry) => entry.slug === payload.slug && entry.id !== id)) throw new Error("ALBUM_CONFLICT");

  const updated: GalleryAlbum = { ...content.albums[index], ...payload, updatedAt: new Date().toISOString() };
  content.albums[index] = updated;
  await writeRaw(content);
  return updated;
}

export async function deleteGalleryAlbum(id: string) {
  if (isPrismaAvailable()) return prismaDeleteAlbum(id);

  const content = await readRaw();
  const hasDeps = content.items.some((entry) => entry.albumId === id);
  if (hasDeps) throw new Error("ALBUM_IN_USE");
  const filtered = content.albums.filter((entry) => entry.id !== id);
  if (filtered.length === content.albums.length) return false;
  content.albums = filtered;
  await writeRaw(content);
  return true;
}

export async function createGalleryItem(input: unknown) {
  if (isPrismaAvailable()) return prismaCreateItem(input);

  const payload = createGalleryItemSchema.parse(input);
  const content = await readRaw();
  if (!content.categories.some((entry) => entry.id === payload.categoryId)) throw new Error("CATEGORY_NOT_FOUND");
  const album = content.albums.find((entry) => entry.id === payload.albumId);
  if (!album) throw new Error("ALBUM_NOT_FOUND");
  if (album.categoryId !== payload.categoryId) throw new Error("ALBUM_CATEGORY_MISMATCH");

  const now = new Date().toISOString();
  const created: GalleryItem = { id: crypto.randomUUID(), title: payload.title, service: payload.service, location: payload.location, imageUrl: payload.imageUrl, categoryId: payload.categoryId, albumId: payload.albumId, isPublished: payload.isPublished, createdAt: now, updatedAt: now };
  content.items.unshift(created);
  await writeRaw(content);
  return created;
}

export async function updateGalleryItem(id: string, input: unknown) {
  if (isPrismaAvailable()) return prismaUpdateItem(id, input);

  const payload = updateGalleryItemSchema.parse(input);
  const content = await readRaw();
  const index = content.items.findIndex((entry) => entry.id === id);
  if (index === -1) return null;

  const current = content.items[index];
  const nextCategoryId = payload.categoryId ?? current.categoryId;
  const nextAlbumId = payload.albumId ?? current.albumId;
  if (!content.categories.some((entry) => entry.id === nextCategoryId)) throw new Error("CATEGORY_NOT_FOUND");
  const album = content.albums.find((entry) => entry.id === nextAlbumId);
  if (!album) throw new Error("ALBUM_NOT_FOUND");
  if (album.categoryId !== nextCategoryId) throw new Error("ALBUM_CATEGORY_MISMATCH");

  const updated: GalleryItem = { ...current, ...payload, categoryId: nextCategoryId, albumId: nextAlbumId, updatedAt: new Date().toISOString() };
  content.items[index] = updated;
  await writeRaw(content);
  return updated;
}

export async function deleteGalleryItem(id: string) {
  if (isPrismaAvailable()) return prismaDeleteItem(id);

  const content = await readRaw();
  const filtered = content.items.filter((entry) => entry.id !== id);
  if (filtered.length === content.items.length) return false;
  content.items = filtered;
  await writeRaw(content);
  return true;
}

export async function listPublicGalleryItems() {
  if (isPrismaAvailable()) return prismaListPublic();

  const content = await readRaw();
  return content.items
    .filter((item) => item.isPublished)
    .map((item) => {
      const category = content.categories.find((entry) => entry.id === item.categoryId);
      const album = content.albums.find((entry) => entry.id === item.albumId);
      return { id: item.id, title: item.title, service: item.service, location: item.location, imageUrl: item.imageUrl, categoryName: category?.name ?? "Uncategorized", albumName: album?.name ?? "General" };
    });
}

export async function listPublicCategories(): Promise<{ id: string; name: string; slug: string }[]> {
  if (isPrismaAvailable()) {
    const cats = await prisma.galleryCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, slug: true } });
    return cats;
  }

  const content = await readRaw();
  return content.categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })).sort((a, b) => a.name.localeCompare(b.name));
}
