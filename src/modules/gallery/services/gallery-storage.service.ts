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

export async function readGalleryContent() {
  return readRaw();
}

export async function createGalleryCategory(input: unknown) {
  const payload = createGalleryCategorySchema.parse(input);
  const content = await readRaw();

  if (content.categories.some((entry) => entry.slug === payload.slug)) {
    throw new Error("CATEGORY_CONFLICT");
  }

  const now = new Date().toISOString();
  const created: GalleryCategory = {
    id: crypto.randomUUID(),
    name: payload.name,
    slug: payload.slug,
    createdAt: now,
    updatedAt: now
  };

  content.categories.unshift(created);
  await writeRaw(content);

  return created;
}

export async function updateGalleryCategory(id: string, input: unknown) {
  const payload = updateGalleryCategorySchema.parse(input);
  const content = await readRaw();
  const index = content.categories.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return null;
  }

  if (payload.slug && content.categories.some((entry) => entry.slug === payload.slug && entry.id !== id)) {
    throw new Error("CATEGORY_CONFLICT");
  }

  const updated: GalleryCategory = {
    ...content.categories[index],
    ...payload,
    updatedAt: new Date().toISOString()
  };

  content.categories[index] = updated;
  await writeRaw(content);

  return updated;
}

export async function deleteGalleryCategory(id: string) {
  const content = await readRaw();
  const hasDependencies = content.albums.some((entry) => entry.categoryId === id) || content.items.some((entry) => entry.categoryId === id);

  if (hasDependencies) {
    throw new Error("CATEGORY_IN_USE");
  }

  const filtered = content.categories.filter((entry) => entry.id !== id);

  if (filtered.length === content.categories.length) {
    return false;
  }

  content.categories = filtered;
  await writeRaw(content);
  return true;
}

export async function createGalleryAlbum(input: unknown) {
  const payload = createGalleryAlbumSchema.parse(input);
  const content = await readRaw();

  if (!content.categories.some((entry) => entry.id === payload.categoryId)) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  if (content.albums.some((entry) => entry.slug === payload.slug)) {
    throw new Error("ALBUM_CONFLICT");
  }

  const now = new Date().toISOString();
  const created: GalleryAlbum = {
    id: crypto.randomUUID(),
    name: payload.name,
    slug: payload.slug,
    categoryId: payload.categoryId,
    isPublished: payload.isPublished,
    createdAt: now,
    updatedAt: now
  };

  content.albums.unshift(created);
  await writeRaw(content);

  return created;
}

export async function updateGalleryAlbum(id: string, input: unknown) {
  const payload = updateGalleryAlbumSchema.parse(input);
  const content = await readRaw();
  const index = content.albums.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return null;
  }

  if (payload.categoryId && !content.categories.some((entry) => entry.id === payload.categoryId)) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  if (payload.slug && content.albums.some((entry) => entry.slug === payload.slug && entry.id !== id)) {
    throw new Error("ALBUM_CONFLICT");
  }

  const updated: GalleryAlbum = {
    ...content.albums[index],
    ...payload,
    updatedAt: new Date().toISOString()
  };

  content.albums[index] = updated;
  await writeRaw(content);

  return updated;
}

export async function deleteGalleryAlbum(id: string) {
  const content = await readRaw();
  const hasDependencies = content.items.some((entry) => entry.albumId === id);

  if (hasDependencies) {
    throw new Error("ALBUM_IN_USE");
  }

  const filtered = content.albums.filter((entry) => entry.id !== id);

  if (filtered.length === content.albums.length) {
    return false;
  }

  content.albums = filtered;
  await writeRaw(content);
  return true;
}

export async function createGalleryItem(input: unknown) {
  const payload = createGalleryItemSchema.parse(input);
  const content = await readRaw();

  const categoryExists = content.categories.some((entry) => entry.id === payload.categoryId);
  const album = content.albums.find((entry) => entry.id === payload.albumId);

  if (!categoryExists) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  if (!album) {
    throw new Error("ALBUM_NOT_FOUND");
  }

  if (album.categoryId !== payload.categoryId) {
    throw new Error("ALBUM_CATEGORY_MISMATCH");
  }

  const now = new Date().toISOString();
  const created: GalleryItem = {
    id: crypto.randomUUID(),
    title: payload.title,
    service: payload.service,
    location: payload.location,
    imageUrl: payload.imageUrl,
    categoryId: payload.categoryId,
    albumId: payload.albumId,
    isPublished: payload.isPublished,
    createdAt: now,
    updatedAt: now
  };

  content.items.unshift(created);
  await writeRaw(content);

  return created;
}

export async function updateGalleryItem(id: string, input: unknown) {
  const payload = updateGalleryItemSchema.parse(input);
  const content = await readRaw();
  const index = content.items.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return null;
  }

  const current = content.items[index];
  const nextCategoryId = payload.categoryId ?? current.categoryId;
  const nextAlbumId = payload.albumId ?? current.albumId;

  const categoryExists = content.categories.some((entry) => entry.id === nextCategoryId);
  const album = content.albums.find((entry) => entry.id === nextAlbumId);

  if (!categoryExists) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  if (!album) {
    throw new Error("ALBUM_NOT_FOUND");
  }

  if (album.categoryId !== nextCategoryId) {
    throw new Error("ALBUM_CATEGORY_MISMATCH");
  }

  const updated: GalleryItem = {
    ...current,
    ...payload,
    categoryId: nextCategoryId,
    albumId: nextAlbumId,
    updatedAt: new Date().toISOString()
  };

  content.items[index] = updated;
  await writeRaw(content);

  return updated;
}

export async function deleteGalleryItem(id: string) {
  const content = await readRaw();
  const filtered = content.items.filter((entry) => entry.id !== id);

  if (filtered.length === content.items.length) {
    return false;
  }

  content.items = filtered;
  await writeRaw(content);
  return true;
}

export async function listPublicGalleryItems() {
  const content = await readRaw();

  return content.items
    .filter((item) => item.isPublished)
    .map((item) => {
      const category = content.categories.find((entry) => entry.id === item.categoryId);
      const album = content.albums.find((entry) => entry.id === item.albumId);

      return {
        id: item.id,
        title: item.title,
        service: item.service,
        location: item.location,
        imageUrl: item.imageUrl,
        categoryName: category?.name ?? "Uncategorized",
        albumName: album?.name ?? "General"
      };
    });
}
