import type { MetadataRoute } from "next";
import { slugifyTitle } from "../lib/questionMeta";

const BASE = "https://pythonmulakat.com";

interface Category { slug: string; question_count?: number; }
interface Question { id: number; category: string; title: string; slug?: string; updated_at?: string; }
interface Tutorial { slug: string; updated_at?: string; published_at?: string; }

// Vercel build sınıri 60s. Backend fetch bazen yavas olur, bu yuzden
// Supabase REST API'sinden doğrudan minimal veri çekiyoruz (anon key,
// service_role degil). Timeout 10s ile korunuyoruz.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lhuhfgpjbnngjxzlvywp.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Build sırasında çalışır, env yoksa boş liste döndür (Vercel fail olmaz)
function hasSupabaseEnv(): boolean {
  return Boolean(SUPABASE_ANON_KEY && SUPABASE_URL);
}

async function fetchSupabaseSafe<T>(
  table: string,
  select: string,
  filter?: string,
): Promise<T[]> {
  if (!hasSupabaseEnv()) return [];
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  url.searchParams.set("select", select);
  if (filter) url.searchParams.set(filter, "true");
  url.searchParams.set("limit", "500");

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);  // 8s timeout

    const res = await fetch(url.toString(), {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      },
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timeout);
    if (!res.ok) return [];
    return (await res.json()) as T[];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // 1. Statik sayfalar (her zaman)
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

  // 2. Kategoriler — DB'den unique
  const cats = await fetchSupabaseSafe<Category>("questions", "category", "is_published=eq.true");
  let categorySlugs: string[] = Array.from(
    new Set(cats.map((c) => c.category).filter(Boolean))
  );
  if (categorySlugs.length === 0) {
    categorySlugs = ["python-basics", "data-structures", "list-dict", "pandas", "algorithms"];
  }
  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${BASE}/interviews/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 3. Sorular — slug + category
  const questions = await fetchSupabaseSafe<Question>(
    "questions",
    "category,title,slug,updated_at",
    "is_published=eq.true"
  );
  const questionPages: MetadataRoute.Sitemap = questions.map((q) => ({
    url: `${BASE}/interviews/${q.category}/${q.slug || slugifyTitle(q.title)}`,
    lastModified: q.updated_at || now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 4. Tutorials — DB'den (varsa), yoksa fallback hard-coded liste
  let tutorials: Tutorial[] = await fetchSupabaseSafe<Tutorial>(
    "tutorials",
    "slug,updated_at,published_at",
    "is_published=eq.true"
  );
  if (tutorials.length === 0) {
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
    priority: 0.85,
  }));

  return [...staticPages, ...categoryPages, ...questionPages, ...tutorialPages];
}