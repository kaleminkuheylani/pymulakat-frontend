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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lhuhfgpjbnngjxzlvywp.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Build sırasında çalışır, env yoksa boş liste döndür (Vercel fail olmaz)
function hasSupabaseEnv(): boolean {
  return Boolean(SUPABASE_ANON_KEY && SUPABASE_URL);
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
    { url: `${BASE}/python-online`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/python-egitimi`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/python-kodlari`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    // 📌 YENİ: 7 pillar kategori sayfası (ACİL #5)
    { url: `${BASE}/python-temelleri`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${BASE}/python-veri-yapilari`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${BASE}/python-pandas`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${BASE}/python-liste-sozluk`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/python-heap`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/python-stack`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/python-queue`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/profile`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/dashboard`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/dashboard/forms`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${BASE}/dashboard/recommendations`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
  ];

  // 2. Soru listesi — backend'den. /interviews/[category] artık redirect olduğu için
  //    kategori sayfaları sitemap'e EKLENMIYOR (sadece yeni pillar URL'leri yukarıda).
  //    Soru detay URL'leri hâlâ /interviews/[category]/[id] üzerinden çalışıyor.
  const questions = await fetchQuestionsFromBackend();
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

  // 📌 Tutorials kaldırıldı — /guides sayfası silindi, sitemap'te yer almıyor.
  // categoryPages kaldırıldı: /interviews/[category] artık redirect (yeni pillar URL'leri
  // staticPages'de zaten var). Sadece questionPages + lessonPages ekleniyor.
  return [...staticPages, ...questionPages, ...lessonPages];
}