import type { MetadataRoute } from "next";
import { fetchAllQuestions, slugifyTitle } from "../lib/api";

const BASE = "https://pythonmulakat.com";

// Soru listesi: build sırasında CSV'den çekilir (CSV = source of truth).
// CSV-only mimari: backend DB'ye hiç bağlanmıyoruz.
async function fetchQuestionsFromCSV(): Promise<Array<{ category: string; slug: string }>> {
  try {
    const rows = await fetchAllQuestions();
    return rows
      .filter((q) => q.category && q.title)
      .map((q) => ({ category: q.category, slug: slugifyTitle(q.title) }));
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
    { url: `${BASE}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/interviews`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/python-online`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/python-egitimi`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/python-kodlari`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/python-temelleri`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${BASE}/python-veri-yapilari`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${BASE}/python-pandas`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${BASE}/python-liste-sozluk`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/python-heap`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/python-stack`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/python-queue`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/python-algoritma-sorulari`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${BASE}/python-dinamik-programlama`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/profile`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/dashboard`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/dashboard/forms`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${BASE}/dashboard/recommendations`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
  ];

  // 2. Soru listesi — CSV'den. /interviews/[category] artık redirect olduğu için
  //    kategori sayfaları sitemap'e EKLENMIYOR (sadece yeni pillar URL'leri yukarıda).
  const questions = await fetchQuestionsFromCSV();
  const questionPages: MetadataRoute.Sitemap = questions.map((q) => ({
    url: `${BASE}/interviews/${q.category}/${q.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 3. Python eğitim dersleri (statik 6 ders)
  const lessonPages: MetadataRoute.Sitemap = LESSON_SLUGS.map((slug) => ({
    url: `${BASE}/python-egitimi/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...questionPages, ...lessonPages];
}