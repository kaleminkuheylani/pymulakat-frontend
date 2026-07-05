import type { MetadataRoute } from "next";
import { slugifyTitle } from "../lib/questionMeta";

const BASE = "https://pythonmulakat.com";

interface Category { slug: string; question_count?: number; }
interface Question { id: number; category: string; title: string; slug?: string; updated_at?: string; }
interface Tutorial { slug: string; updated_at?: string; published_at?: string; }

interface ListResponse<T> { items: T[]; data?: T[]; total: number; }
interface CategoryEnvelope { data: Category[]; }

async function fetchJsonSafe<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function getApiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  const apiBase = getApiBase();

  // 1. Statik sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/interviews`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/profile`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/dashboard`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/dashboard/forms`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${BASE}/dashboard/recommendations`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
  ];

  // 2. Kategoriler (boş olmayanlar)
  let categorySlugs: string[] = [];
  const catData = await fetchJsonSafe<CategoryEnvelope>(`${apiBase}/api/v2/categories`);
  if (catData?.data) {
    categorySlugs = catData.data
      .filter((c) => (c.question_count || 0) > 0)
      .map((c) => c.slug)
      .filter(Boolean);
  } else {
    // Fallback
    categorySlugs = ["python-basics", "data-structures", "list-dict", "pandas", "algorithms"];
  }

  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${BASE}/interviews/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 3. Sorular
  let questions: Question[] = [];
  const qData = await fetchJsonSafe<ListResponse<Question>>(`${apiBase}/api/v2/questions/all?limit=500`);
  if (qData) {
    questions = qData.items || qData.data || [];
  }

  const questionPages: MetadataRoute.Sitemap = questions.map((q) => ({
    url: `${BASE}/interviews/${q.category}/${q.slug || slugifyTitle(q.title)}`,
    lastModified: q.updated_at || now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 4. 🆕 Tutorials (DB'den) — yüksek SEO değeri
  let tutorials: Tutorial[] = [];
  // Backend'de tutorials endpoint yoksa fallback hard-coded liste
  const tData = await fetchJsonSafe<{ data: Tutorial[] } | Tutorial[]>(`${apiBase}/api/v2/tutorials`);
  if (tData) {
    tutorials = Array.isArray(tData) ? tData : tData.data || [];
  } else {
    // Fallback: SEO_CONTENT.py'deki tutorial_slug'lardan üret (unique)
    const fallbackSlugs = [
      "python-palindrome-cozum",
      "python-fizzbuzz-algoritma",
      "python-binary-search",
      "python-asal-sayi-algoritma",
      "python-obeb-oklid",
      "python-two-sum",
      "python-degisken-nedir",
      "python-if-else-kosullar",
      "pandas-groupby-rehberi",
    ];
    tutorials = fallbackSlugs.map((slug) => ({ slug }));
  }

  const tutorialPages: MetadataRoute.Sitemap = tutorials.map((t) => ({
    url: `${BASE}/guides/${t.slug}`,
    lastModified: t.updated_at || t.published_at || now,
    changeFrequency: "monthly" as const,
    priority: 0.85, // Yüksek öncelik — uzun form içerik
  }));

  return [...staticPages, ...categoryPages, ...questionPages, ...tutorialPages];
}