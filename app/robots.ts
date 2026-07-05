import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register", "/interviews", "/guides", "/dashboard", "/terms", "/profile"],
        disallow: ["/_next/", "/api/", "/admin/", "/auth/callback", "/auth/reset-password"],
      },
    ],
    sitemap: "https://pythonmulakat.com/sitemap.xml",
    host: "https://pythonmulakat.com",
  };
}