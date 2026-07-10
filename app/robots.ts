import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // Wildcard (*) ile prefix match: /interviews/* → /interviews/python-basics dahil
        allow: [
          "/",
          "/login",
          "/register",
          "/interviews/*",
          "/python-online",
          "/python-egitimi",
          "/python-egitimi/*",
          "/python-kodlari",
          "/dashboard",
          "/dashboard/*",
          "/terms",
          "/profile",
        ],
        disallow: ["/_next/", "/api/", "/admin/", "/auth/callback", "/auth/reset-password", "/test-question/", "/dev-tools/"],
      },
    ],
    sitemap: "https://pythonmulakat.com/sitemap.xml",
    host: "https://pythonmulakat.com",
  };
}