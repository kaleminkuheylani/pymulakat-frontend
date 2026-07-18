// app/sitemap.xml/route.ts
//
// Klasik sitemap URL (/sitemap.xml) — Google "HTML sayfa" hatasi
// vermesin diye dogrudan XML sun. /api/sitemap ile ayni icerik.
//
// 2026-07-15: Google Search Console 'Site haritanizin bir HTML sayfasi
// oldugu gorunuyor' hatasi veriyordu. /sitemap.xml 308 redirect
// sonrasi bazen HTML fallback donuyor olabilir. Yeni route ile
// dogrudan XML don, 308 redirect kaldirildi.

import { NextResponse } from "next/server";
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

export async function GET() {
  const now = new Date().toISOString();

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
  ];

  const apiBase =
    process.env.INTERNAL_API_URL ||
    "https://pymulakat-backend-production.up.railway.app";

  const [catRes, qRes] = await Promise.all([
    fetch(`${apiBase}/api/v2/categories`, { cache: "no-store" }),
    fetch(`${apiBase}/api/v2/questions/all?limit=500`, { cache: "no-store" }),
  ]).catch(() => [null, null] as const);

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

  // 2026-07-18: pandas scope'tan cikarildi
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


  // 2026-07-17: Blog yazilari (simdilik inline)
  const BLOG_POSTS = [
    { slug: "algoritma-nedir", date: "2026-07-17" },
    { slug: "programlama-temelleri", date: "2026-07-18" },
    { slug: "sifirdan-zirveye", date: "2026-07-18" },
  ];
  const blogEntries: SitemapEntry[] = BLOG_POSTS.map((p) =>
    toEntry(`${BASE_URL}/blog/${p.slug}`, p.date, "monthly", 0.7),
  );

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
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
