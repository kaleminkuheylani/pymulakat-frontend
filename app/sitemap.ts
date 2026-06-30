import type { MetadataRoute } from "next";
import { categoriesAPI, questionsAPI } from "../api/v2/questions";

const BASE = "https://www.pythonmulakat.com";

interface Category { slug: string; question_count?: number; }
interface Question { id: number; category: string; }

interface ListResponse<T> { items: T[]; total: number; }
interface CategoryEnvelope { data: Category[]; }
interface QuestionsEnvelope { items?: Question[]; data?: Question[]; }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // 1. Statik sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/interviews`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/profile`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  // 2. Kategoriler (DB'den dinamik çek, fallback olarak sabit liste)
  let categorySlugs: string[] = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${apiUrl}/api/v2/categories`, {
      next: { revalidate: 3600 }, // 1 saat cache
    });
    if (res.ok) {
      const data: CategoryEnvelope | Category[] = await res.json();
      const list = Array.isArray(data) ? data : data.data || [];
      // Sadece sorusu olan kategorileri al (boş olanları kaldır)
      categorySlugs = list
        .filter((c) => (c.question_count || 0) > 0)
        .map((c) => c.slug)
        .filter(Boolean);
    }
  } catch {
    // Backend'e erişilemedi → fallback
    categorySlugs = ["python-basics", "strings", "list-dict", "pandas", "algorithms"];
  }

  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${BASE}/interviews/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 3. Sorular (DB'den dinamik çek, max 500)
  let questions: Question[] = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${apiUrl}/api/v2/questions/all?limit=500`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data: ListResponse<Question> | QuestionsEnvelope = await res.json();
      const items = "items" in data ? data.items : "data" in data ? (data.data as Question[]) : [];
      questions = items || [];
    }
  } catch {
    // Backend yoksa boş bırak
  }

  const questionPages: MetadataRoute.Sitemap = questions.map((q) => ({
    url: `${BASE}/interviews/${q.category}/${q.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...questionPages];
}