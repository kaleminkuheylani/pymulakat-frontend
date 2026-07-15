// app/api/sitemap/route.ts
//
// Sitemap endpoint — JSON response, browser/SEO crawler dostu.
// Vercel Edge Cache bypass için: no-store header + force-dynamic.
//
// 2026-07-15: app/sitemap.ts (Next.js MetadataRoute.Sitemap) Vercel'de
// eski data tutuyordu (20 soru, DB 85). Yeni route + no-cache header ile
// tamamen fresh, tüm 85 soru sitemap'e dahil.
//
// robots.txt: Sitemap: https://pythonmulakat.com/api/sitemap
//
// Response: application/xml (Next.js standard sitemap format).

import { NextResponse } from "next/server";
import { fetchAllQuestions, listCategories, slugifyTitle } from "@/lib/api/questionAPI";
import { BASE_URL } from "@/lib/seo";
import { getCategoryUrl } from "@/lib/categorySlug";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LESSON_SLUGS = [
  "temel-kavramlar",
  "kontrol-yapilari",
  "fonksiyonlar",
  "veri-yapilari",
  "oop",
  "ileri-konular",
];

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}

function toEntry(url: string, lastmod: string, changefreq: string, priority: number): SitemapEntry {
  return { loc: url, lastmod, changefreq, priority };
}

function toXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority.toFixed(2)}</priority>\n  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

export async function GET() {
  const now = new Date().toISOString();

  // 1. Statik sayfalar
  const staticEntries: SitemapEntry[] = [
    toEntry(`${BASE_URL}/`, now, "daily", 1.0),
    toEntry(`${BASE_URL}/interviews`, now, "daily", 0.9),
    toEntry(`${BASE_URL}/python-online`, now, "monthly", 0.85),
    toEntry(`${BASE_URL}/python-egitimi`, now, "monthly", 0.85),
    toEntry(`${BASE_URL}/python-kodlari`, now, "monthly", 0.85),
    toEntry(`${BASE_URL}/about`, now, "monthly", 0.7),
    toEntry(`${BASE_URL}/login`, now, "monthly", 0.5),
    toEntry(`${BASE_URL}/register`, now, "monthly", 0.6),
    toEntry(`${BASE_URL}/terms`, now, "yearly", 0.3),
    toEntry(`${BASE_URL}/profile`, now, "monthly", 0.4),
    toEntry(`${BASE_URL}/dashboard`, now, "monthly", 0.5),
    toEntry(`${BASE_URL}/dashboard/forms`, now, "daily", 0.6),
    toEntry(`${BASE_URL}/dashboard/recommendations`, now, "daily", 0.6),
  ];

  // 2. Kategori landing sayfaları
  const categories = await listCategories().catch(() => []);
  const categoryEntries: SitemapEntry[] = categories
    .map((c) => c.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) =>
      toEntry(`${BASE_URL}${getCategoryUrl(slug)}`, now, "weekly", 0.85),
    );

  // 3. Soru detay sayfaları (DB-FIRST)
  const questions = await fetchAllQuestions().catch((err) => {
    console.error("[api/sitemap] fetchAllQuestions ERROR:", err);
    return [];
  });
  const questionEntries: SitemapEntry[] = questions
    .filter((q) => q.category && (q.title || q.slug))
    .map((q) =>
      toEntry(
        `${BASE_URL}/interviews/${q.category}/${q.slug || slugifyTitle(q.title || "")}`,
        now,
        "monthly",
        0.7,
      ),
    );

  // 4. Ders sayfaları
  const lessonEntries: SitemapEntry[] = LESSON_SLUGS.map((slug) =>
    toEntry(`${BASE_URL}/python-egitimi/${slug}`, now, "monthly", 0.7),
  );

  const all = [...staticEntries, ...categoryEntries, ...questionEntries, ...lessonEntries];
  const xml = toXml(all);

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Vercel Edge Cache bypass — sitemap her istekte fresh
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
