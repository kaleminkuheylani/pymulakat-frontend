import type { MetadataRoute } from "next";
import { fetchAllQuestions, listCategories, slugifyTitle } from "../lib/api/questionAPI";
import { BASE_URL } from "../lib/seo";

// Sitemap (2026-07-13 refactor):
//   - Tüm sayfa URL'leri DB'den (kategori meta + soru listesi)
//   - 8 pillar statik sayfa artık yok — sitemap yalnızca canonical /interviews/{db}/...
//   - Soru + kategori URL'leri dinamik, yeni eklenen içerik otomatik sitemap'e düşer
//   - robots.ts allow: "/interviews/*" ile tutarlı

// Soru listesi: DB'den çekilir (DB-FIRST, 2026-07-11).
async function fetchQuestionsFromAPI(): Promise<
  Array<{ category: string; slug: string; updated_at?: string | null }>
> {
  try {
    const rows = await fetchAllQuestions();
    return rows
      .filter((q) => q.category && (q.title || q.slug))
      .map((q) => ({
        category: q.category,
        slug: q.slug || slugifyTitle(q.title || ""),
      }));
  } catch {
    return [];
  }
}

// Python eğitim dersleri (6 ders — statik)
const LESSON_SLUGS = [
  "temel-kavramlar",
  "kontrol-yapilari",
  "fonksiyonlar",
  "veri-yapilari",
  "oop",
  "ileri-konular",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // 1. Statik sayfalar (her zaman)
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/interviews`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/python-online`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE_URL}/python-egitimi`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE_URL}/python-kodlari`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/profile`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/dashboard`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/dashboard/forms`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${BASE_URL}/dashboard/recommendations`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
  ];

  // 2. Kategori landing sayfaları (DB-FIRST). 8 pillar + queue dahil tüm kategoriler.
  //    Sitemap'e eklemek thin content riskini azaltır (her sayfada DB'den meta + soru listesi var).
  const categories = await listCategories().catch(() => []);
  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((c) => c.slug)
    .map((c) => ({
      url: `${BASE_URL}/interviews/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

  // 3. Soru detay sayfaları (DB-FIRST)
  const questions = await fetchQuestionsFromAPI();
  const questionPages: MetadataRoute.Sitemap = questions.map((q) => ({
    url: `${BASE_URL}/interviews/${q.category}/${q.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 4. Python eğitim dersleri (statik 6 ders)
  const lessonPages: MetadataRoute.Sitemap = LESSON_SLUGS.map((slug) => ({
    url: `${BASE_URL}/python-egitimi/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...questionPages, ...lessonPages];
}
