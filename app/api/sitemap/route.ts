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
import { NextRequest } from "next/server";
import { BASE_URL } from "@/lib/seo";
import { getCategoryUrl } from "@/lib/categorySlug";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export async function GET(req: NextRequest) {
  // 2026-07-15: header oku → dynamic mode (Function Cache bypass)
  req.headers.get("host");
  const now = new Date().toISOString();

  // 1. Statik sayfalar (yalnizca public, 200 donen, noindex/auth-gated olmayan)
  // 2026-07-15: /dashboard, /dashboard/forms, /dashboard/recommendations, /profile
  //   auth-gated (302 redirect → /login veya auth context), sitemap'te olmamali
  //   (Google crawl ederse "redirect" veya "soft 404" hatasi verir).
  const staticEntries: SitemapEntry[] = [
    toEntry(`${BASE_URL}/`, now, "daily", 1.0),
    toEntry(`${BASE_URL}/interviews`, now, "daily", 0.9),
    toEntry(`${BASE_URL}/python-online`, now, "monthly", 0.85),
    toEntry(`${BASE_URL}/python-kodlari`, now, "monthly", 0.85),
    toEntry(`${BASE_URL}/about`, now, "monthly", 0.7),
    toEntry(`${BASE_URL}/login`, now, "monthly", 0.5),
    toEntry(`${BASE_URL}/register`, now, "monthly", 0.6),
    toEntry(`${BASE_URL}/terms`, now, "yearly", 0.3),
  ];

  // 2-3. Inline fetch (apiFetch import etmeden) — Vercel Function Cache bypass
  const apiBase = process.env.INTERNAL_API_URL || "https://pymulakat-backend-production.up.railway.app";
  const [catRes, qRes] = await Promise.all([
    fetch(`${apiBase}/api/v2/categories`, { cache: "no-store" }),
    fetch(`${apiBase}/api/v2/questions/all?limit=500`, { cache: "no-store" }),
  ]).catch((err) => {
    return [null, null] as const;
  });

  let categories: Array<{ slug: string }> = [];
  if (catRes && catRes.ok) {
    const cData = await catRes.json();
    categories = cData.data || cData.items || cData || [];
  }
  let questions: Array<{ category?: string; title?: string; slug?: string }> = [];
  if (qRes && qRes.ok) {
    const qData = await qRes.json();
    questions = qData.data || qData.items || qData || [];
  }

  // 2026-07-18: pandas scope'tan cikarildi — sitemap'te de filtrele
  const categoryEntries: SitemapEntry[] = categories
    .map((c) => c.slug)
    .filter((slug) => slug !== "pandas")
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) =>
      toEntry(`${BASE_URL}${getCategoryUrl(slug)}`, now, "weekly", 0.85),
    );

  // 2026-07-16: /interviews/{category} kategori listesi sayfalari (yeni route)
  // 7 canonical slug (programlama-temelleri, data-structures, list-dict, algorithms,
  // algorithms, heap, stack, dynamic-programming)
  const interviewsCategoryEntries: SitemapEntry[] = categories
    .map((c) => c.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) =>
      toEntry(`${BASE_URL}/interviews/${slug}`, now, "weekly", 0.8),
    );

  // pandas sorulari artik sitemap'te yok
  const questionEntries: SitemapEntry[] = questions
    .filter((q) => q.category && q.category !== "pandas" && (q.title || q.slug))
    .map((q) =>
      toEntry(
        `${BASE_URL}/interviews/${q.category}/${q.slug || (q.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
        now,
        "monthly",
        0.7,
      ),
    );

  // 4. Blog yazilari (PYBlog — Google'in dizine eklemesi icin)
  const BLOG_POSTS = [
    { slug: "algoritma-nedir", date: "2026-07-17" },
    { slug: "programlama-temelleri", date: "2026-07-18" },
    { slug: "sifirdan-zirveye", date: "2026-07-18" },
    { slug: "javascript-closure-nedir", date: "2026-07-19" },
    { slug: "algoritma-labirenti", date: "2026-07-18" },
    { slug: "teknik-terimler", date: "2026-07-18" },
  ];
  const blogEntries: SitemapEntry[] = BLOG_POSTS.map((p) =>
    toEntry(`${BASE_URL}/blog/${p.slug}`, p.date, "monthly", 0.7),
  );

  // 5. Ders sayfaları
  const all = [
    ...staticEntries,
    ...categoryEntries,
    ...interviewsCategoryEntries,
    ...questionEntries,
    ...blogEntries,
  ];
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
