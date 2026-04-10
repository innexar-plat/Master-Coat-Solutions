import { listBlogPostSlugsFromStorage } from "@/modules/blog/services/blog-storage.service";
import { listServiceAreaSlugs } from "@/modules/areas/data/service-areas.data";

const PUBLIC_BASE_ROUTES = [
  "",
  "/about",
  "/services",
  "/gallery",
  "/blog",
  "/contact",
  "/free-estimate",
  "/faq",
  "/areas"
] as const;

const SUPPORTED_LOCALES = ["en", "pt", "es"] as const;

export type SeoRouteEntry = {
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
};

function withLocale(locale: string, route: string): string {
  return `/${locale}${route}`;
}

export async function buildSeoRouteEntries(): Promise<SeoRouteEntry[]> {
  const entries: SeoRouteEntry[] = [];
  const blogSlugs = await listBlogPostSlugsFromStorage();

  for (const locale of SUPPORTED_LOCALES) {
    for (const route of PUBLIC_BASE_ROUTES) {
      entries.push({
        path: withLocale(locale, route),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8
      });
    }

    for (const slug of blogSlugs) {
      entries.push({
        path: withLocale(locale, `/blog/${slug}`),
        changeFrequency: "weekly",
        priority: 0.7
      });
    }

    for (const areaSlug of listServiceAreaSlugs()) {
      entries.push({
        path: withLocale(locale, `/areas/${areaSlug}`),
        changeFrequency: "monthly",
        priority: 0.75
      });
    }
  }

  return entries;
}

export function resolveSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://vinipainting.com";
}
