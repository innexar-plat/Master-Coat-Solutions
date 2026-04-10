import { promises as fs } from "node:fs";
import path from "node:path";
import {
  createLandingPageSchema,
  type CreateLandingPageInput,
  updateLandingPageSchema,
  type UpdateLandingPageInput
} from "@/modules/landing-pages/dtos/manage-landing-page.dto";

export type StoredLandingPage = {
  id: string;
  slug: string;
  name: string;
  headline: string;
  status: "DRAFT" | "PUBLISHED";
  createdAt: string;
  updatedAt: string;
};

const LANDING_PAGES_FILE_PATH = path.join(process.cwd(), "data", "landing-pages.json");

async function ensureLandingPagesFile() {
  await fs.mkdir(path.dirname(LANDING_PAGES_FILE_PATH), { recursive: true });

  try {
    await fs.access(LANDING_PAGES_FILE_PATH);
  } catch {
    await fs.writeFile(LANDING_PAGES_FILE_PATH, "[]", "utf8");
  }
}

async function readRawLandingPages(): Promise<StoredLandingPage[]> {
  await ensureLandingPagesFile();
  const raw = await fs.readFile(LANDING_PAGES_FILE_PATH, "utf8");
  return JSON.parse(raw) as StoredLandingPage[];
}

async function writeRawLandingPages(items: StoredLandingPage[]) {
  await fs.writeFile(LANDING_PAGES_FILE_PATH, JSON.stringify(items, null, 2), "utf8");
}

export async function listStoredLandingPages(): Promise<StoredLandingPage[]> {
  const items = await readRawLandingPages();
  return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function createStoredLandingPage(input: unknown): Promise<StoredLandingPage> {
  const payload = createLandingPageSchema.parse(input) as CreateLandingPageInput;
  const items = await readRawLandingPages();

  if (items.some((item) => item.slug === payload.slug)) {
    throw new Error("LANDING_PAGE_CONFLICT");
  }

  const now = new Date().toISOString();
  const created: StoredLandingPage = {
    id: crypto.randomUUID(),
    slug: payload.slug,
    name: payload.name,
    headline: payload.headline,
    status: payload.status,
    createdAt: now,
    updatedAt: now
  };

  await writeRawLandingPages([created, ...items]);
  return created;
}

export async function updateStoredLandingPage(id: string, input: unknown): Promise<StoredLandingPage | null> {
  const payload = updateLandingPageSchema.parse(input) as UpdateLandingPageInput;
  const items = await readRawLandingPages();
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  if (payload.slug && items.some((item) => item.slug === payload.slug && item.id !== id)) {
    throw new Error("LANDING_PAGE_CONFLICT");
  }

  const current = items[index];
  const updated: StoredLandingPage = {
    ...current,
    ...payload,
    updatedAt: new Date().toISOString()
  };

  const next = [...items];
  next[index] = updated;
  await writeRawLandingPages(next);

  return updated;
}

export async function deleteStoredLandingPage(id: string): Promise<boolean> {
  const items = await readRawLandingPages();
  const filtered = items.filter((item) => item.id !== id);

  if (filtered.length === items.length) {
    return false;
  }

  await writeRawLandingPages(filtered);
  return true;
}
