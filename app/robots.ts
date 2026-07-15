// app/robots.ts
//
// robots.txt generator.
// 2026-07-15: Sitemap URL güncellendi — /api/sitemap (eski /sitemap.xml
// Vercel Edge Cache sorunu nedeniyle eski data tutuyordu).

import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard/", "/auth/callback"],
      },
    ],
    sitemap: `${BASE_URL}/api/sitemap`,
    host: BASE_URL,
  };
}
