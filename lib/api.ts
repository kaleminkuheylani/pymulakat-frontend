// lib/api.ts
// DB-FIRST mimari: sorular artık FastAPI backend'den çekilir (Supabase DB).
//
// Cache stratejisi:
//  - Backend (FastAPI Railway): in-memory 60s cache
//  - Frontend (Next.js Vercel): revalidate: 3600 (1 saat ISR)
//  - On-demand revalidation: commit 5'te eklenecek
//
// DB-FIRST spec: docs/superpowers/specs/2026-07-11--db-first-migration.md

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";

// ─── Types (backend InterviewOut Pydantic ile uyumlu) ─────────

export interface ApiQuestion {
  id: number;
  title: string;
  category: string;
  level: string;
  description: string;
  starter_code: string | null;
  hints: string[];
  tags?: string[];
  slug: string | null;
  // Backend Pydantic InterviewOut'ta yok ama to_public_dict'te dönüyor
  // (ileride InterviewOut'a eklenebilir — column freeze kuralı: sormak gerekir)
}

// ─── Public API ──────────────────────────────────────────────

/**
 * Tüm soruları backend'den çek (DB-FIRST).
 * revalidate=3600: 1 saat ISR cache.
 */
export async function fetchAllQuestions(): Promise<ApiQuestion[]> {
  const res = await fetch(`${API_BASE}/api/v2/questions`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  // Backend InterviewListResponse.items döner
  return data.items || data || [];
}

/**
 * Kategoriye göre soruları filtrele.
 * Backend'de category query var; burada client-side filtreleme de yapılabilir.
 * Mevcut CSV-FIRST davranışıyla uyumlu: tüm listeyi çek, client filtre.
 */
export async function listQuestionsByCategory(category: string): Promise<ApiQuestion[]> {
  const all = await fetchAllQuestions();
  return all.filter((q) => q.category === category);
}

/**
 * Slug veya ID ile tek soru bul.
 * /interviews/{category}/{id_or_slug} için.
 */
export async function findQuestion(
  category: string,
  idOrSlug: string
): Promise<ApiQuestion | null> {
  // Önce slug (DB-FIRST'te canonical)
  // Backend /api/v2/questions/by-slug/{cat}/{slug}
  try {
    const res = await fetch(
      `${API_BASE}/api/v2/questions/by-slug/${category}/${idOrSlug}`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const q = await res.json();
      return q as ApiQuestion;
    }
  } catch (e) {
    // Ağ hatası → ID ile dene
  }

  // Slug bulunamadı veya 404 → ID dene (legacy)
  const asNum = parseInt(idOrSlug, 10);
  if (!isNaN(asNum)) {
    const all = await fetchAllQuestions();
    const byId = all.find((q) => q.id === asNum && q.category === category);
    if (byId) return byId;
  }

  return null;
}

/**
 * Slugify title (DB-FIRST'te DB'de slug var, ama client-side navigation için
 * frontend'de de slugify gerekebilir — eski URL'ler, breadcrumb vs).
 * Backend DB ile %100 uyumlu.
 */
export function slugifyTitle(title: string): string {
  const trMap: Record<string, string> = {
    "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u",
    "Ç": "c", "Ğ": "g", "İ": "i", "Ö": "o", "Ş": "s", "Ü": "u",
  };
  let s = title.toLowerCase().trim();
  s = s.replace(/[çğıöşüÇĞİÖŞÜ]/g, (c) => trMap[c] || c);
  s = s.replace(/[^a-z0-9\s-]/g, "");
  s = s.replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return s;
}

/**
 * Kategorileri listele (DB'den unique category alanları).
 */
export async function getCategories(): Promise<{ category: string; count: number }[]> {
  const all = await fetchAllQuestions();
  const counts = new Map<string, number>();
  for (const q of all) {
    counts.set(q.category, (counts.get(q.category) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => a.category.localeCompare(b.category));
}
