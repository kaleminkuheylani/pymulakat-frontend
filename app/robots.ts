// app/robots.ts
//
// robots.txt generator.
// 2026-07-15: Sitemap URL /api/sitemap — /api/ tamamen disallow ETME.
//   Google "site haritası okunamadı" hatası veriyordu çünkü
//   /api/ disallow ile sitemap aynı yerde çelişiyordu.
//   Sitemap'i crawl edebilmesi için /api/sitemap path'ine
//   en azından izin verilmeli. Sadece auth gerektiren
//   /api/auth/* ve /api/ai-feedback/* disallow kalabililir
//   (yine de crawl edilebilir, sadece isteğe bağlı).

import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/sitemap"],
        disallow: [
          // Auth + AI feedback endpoint'leri — crawl gereksiz
          "/api/auth/",
          "/api/ai-feedback/",
          "/api/revalidate",
          "/admin/",
          "/dashboard/",
          "/auth/callback",
        ],
      },
    ],
    sitemap: `${BASE_URL}/api/sitemap`,
    host: BASE_URL,
  };
}
