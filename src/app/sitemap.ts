import type { MetadataRoute } from "next";
import { buildSeoRouteEntries, resolveSiteUrl } from "@/modules/seo/services/seo-routes.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = resolveSiteUrl();
  const entries = await buildSeoRouteEntries();

  return entries.map((entry) => ({
    url: `${siteUrl}${entry.path}`,
    lastModified: new Date(),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority
  }));
}
