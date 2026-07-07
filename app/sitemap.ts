import type { MetadataRoute } from "next";

const BASE = "https://pythonmulakat.com";
const API = process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";

interface Category { category?: string | null; }

// Soru listesi: build sırasında backend /api/v2/questions/all'dan çekilir (DB source of truth)
// Kod-içi veri YOK. Timeout 8s — Vercel 60s build limit'ine uy.
async function fetchQuestionsFromBackend(): Promise<Array<{ category: string; slug: string }>> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${API}/api/v2/questions/all`, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timeout);
    if (!res.ok) return [];
    const data = await res.json();
    const items: Array<{ category?: string; slug?: string }> = data?.data || [];
    return items
      .filter((q) => q.category && q.slug)
      .map((q) => ({ category: q.category!, slug: q.slug! }));
  } catch {
    return [];
  }
}

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
    { url: `${BASE}/python-online`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/python-egitimi`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/python-kodlari`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/profile`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/dashboard`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/dashboard/forms`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${BASE}/dashboard/recommendations`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
  ];

  // 2. Soru + kategori listesi — backend'den (tek fetch, hem kategori hem slug döner)
  const questions = await fetchQuestionsFromBackend();
  const categorySlugs = Array.from(new Set(questions.map((q) => q.category)));
  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${BASE}/interviews/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  const questionPages: MetadataRoute.Sitemap = questions.map((q) => ({
    url: `${BASE}/interviews/${q.category}/${q.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 📌 Tutorials kaldırıldı — /guides sayfası silindi, sitemap'te yer almıyor.
  return [...staticPages, ...categoryPages, ...questionPages];
}