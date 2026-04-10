import type { MetadataRoute } from "next";
import { resolveSiteUrl } from "@/modules/seo/services/seo-routes.service";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = resolveSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/admin"]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
