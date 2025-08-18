// src/app/robots.ts
import type { MetadataRoute } from "next";
import { SITE_URL, IS_PROD } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: IS_PROD ? "/" : "",
        disallow: IS_PROD ? undefined : "/",
      },
    ],
    sitemap: IS_PROD ? `${SITE_URL}/sitemap.xml` : undefined,
    host: IS_PROD ? SITE_URL : undefined,
  };
}
