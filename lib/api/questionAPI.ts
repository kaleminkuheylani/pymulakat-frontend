// lib/api/questionAPI.ts
//
// 📌 Question endpoint'leri için TEK MODÜL. Diğer tüm sayfalar buradan tüketir.
// DB-FIRST mimari (2026-07-11): sorular artık FastAPI backend'den (Supabase DB).
//
// Cache stratejisi:
//   - Backend (FastAPI Railway): in-memory 60s cache
//   - Frontend (Next.js Vercel): revalidate: 3600 (1 saat ISR)
//   - On-demand revalidation: tags: ["questions-list"] (/api/revalidate endpoint'i)
//
// DB-FIRST spec: docs/superpowers/specs/2026-07-11--db-first-migration.md

import { apiFetch, ApiError } from "./index";
import type {
  ApiQuestion,
  ApiQuestionTests,
  ApiCategory,
  ApiCategoryDetail,
  ApiPagination,
  ApiRecommendationFlow,
} from "./types";

// ═══════════════════════════════════════════════════════════════
// ─── Cache tag registry (TEK KAYNAK) ─────────────────────────
// ═══════════════════════════════════════════════════════════════
// On-demand revalidation (/api/revalidate) bu tag'leri kullanır.
// Yeni içerik eklendiğinde ilgili tag tetiklenir → Next.js cache'i düşer →
// sonraki istek taze veriyle gelir.

export const CACHE_TAGS = {
  ALL_QUESTIONS: "questions-list",
  ALL_CATEGORIES: "categories-list",
  CATEGORY: (slug: string) => `category-${slug}`,
  QUESTION: (cat: string, slug: string) => `question-${cat}-${slug}`,
} as const;

// ═══════════════════════════════════════════════════════════════
// ─── Question CRUD ───────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Tüm soruları backend'den çek (DB-FIRST).
 * revalidate=3600: 1 saat ISR cache.
 * tags: "questions-list" → on-demand revalidation için (/api/revalidate)
 */
export async function fetchAllQuestions(): Promise<ApiQuestion[]> {
  const data = await apiFetch<ApiPagination | ApiQuestion[]>(
    "/api/v2/questions",
    {
      next: { revalidate: 3600, tags: ["questions-list"] },
    }
  );
  // Backend InterviewListResponse.items döner; fallback: data veya [] direkt
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items as ApiQuestion[];
  if (Array.isArray(data?.data)) return data.data as ApiQuestion[];
  return [];
}

/**
 * Sayfalanmış tüm soruları backend'den çek (dashboard flow / sitemap fallback).
 * /api/v2/questions/all — DB'den 200+ soruyu listeler.
 */
export async function getAllQuestions(params?: {
  category?: string;
  limit?: number;
}): Promise<ApiQuestion[]> {
  // Tag: kategori verilirse `category-${slug}` da ekle → tek soru eklendiğinde
  // hem liste hem o kategori sayfası cache'i düşer.
  const tags = params?.category
    ? [CACHE_TAGS.ALL_QUESTIONS, CACHE_TAGS.CATEGORY(params.category)]
    : [CACHE_TAGS.ALL_QUESTIONS];
  try {
    const data = await apiFetch<ApiPagination | ApiQuestion[]>(
      // 2026-07-15: Vercel Data Cache sorunlu, no-store + revalidate=0
      "/api/v2/questions/all",
      { params, next: { revalidate: 0 }, cache: "no-store" },
    );
    console.log(`[getAllQuestions] params=${JSON.stringify(params)} keys=${data && typeof data === "object" ? Object.keys(data).join(",") : typeof data}`);
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data as ApiQuestion[];
    if (Array.isArray(data?.items)) return data.items as ApiQuestion[];
    return [];
  } catch (err) {
    console.error(`[getAllQuestions] ERROR params=${JSON.stringify(params)}:`, err);
    return [];
  }
}

/**
 * ID ile tek soru. /api/v2/questions/{id}
 */
export async function getById(
  id: number,
  options: { includeStarter?: boolean } = {}
): Promise<ApiQuestion> {
  // ID bazlı fetch (legacy URL fallback). Tag yok → eski ID URL'ler düşük öncelikli
  // cache. Yeni URL'ler (slug) findQuestion() üzerinden question-${cat}-${slug} tag'i alır.
  return apiFetch<ApiQuestion>(`/api/v2/questions/${id}`, {
    params: { include_starter: options.includeStarter ? "true" : undefined },
    next: { revalidate: 3600, tags: [CACHE_TAGS.ALL_QUESTIONS] },
  });
}

/**
 * Slug ile tek soru. /api/v2/questions/by-slug/{cat}/{slug}
 */
export async function getBySlug(
  category: string,
  slug: string,
  options: { includeStarter?: boolean } = {}
): Promise<ApiQuestion> {
  // Tag: hem `question-{cat}-{slug}` (tekil sayfa) hem `category-{cat}` (kategori listesi)
  // hem `questions-list` (global). Yeni cevap/versiyon yüklenince 3 cache birden düşer.
  return apiFetch<ApiQuestion>(
    `/api/v2/questions/by-slug/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`,
    {
      params: { include_starter: options.includeStarter ? "true" : undefined },
      next: {
        revalidate: 3600,
        tags: [
          CACHE_TAGS.QUESTION(category, slug),
          CACHE_TAGS.CATEGORY(category),
          CACHE_TAGS.ALL_QUESTIONS,
        ],
      },
    }
  );
}

/**
 * Slug veya ID ile tek soru bul.
 * /interviews/{category}/{id_or_slug} için — önce slug dener, bulamazsa ID'ye düşer.
 *
 * @returns Bulunamazsa null (caller 404'e düşebilir).
 */
export async function findQuestion(
  category: string,
  idOrSlug: string
): Promise<ApiQuestion | null> {
  // 1) Slug dene (DB-FIRST'te canonical)
  try {
    return await getBySlug(category, idOrSlug, { includeStarter: true });
  } catch (e) {
    // 404 veya network → ID fallback'e geç
    if (!(e instanceof ApiError) || e.status >= 500) {
      // 5xx ise hatayı yutma; null yerine throw et
      if (e instanceof ApiError && e.status >= 500) throw e;
    }
  }

  // 2) ID dene (legacy URL)
  const asNum = parseInt(idOrSlug, 10);
  if (!isNaN(asNum)) {
    try {
      return await getById(asNum, { includeStarter: true });
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Kategoriye göre soruları backend'den çek (sadece o kategori).
 * SSR için optimize: 132 soru yerine sadece kategori sayısı (~5-34).
 * Limit 100 çünkü hiçbir kategori 100'ü geçmiyor.
 */
export async function listQuestionsByCategory(
  category: string
): Promise<ApiQuestion[]> {
  const data = await apiFetch<ApiPagination | ApiQuestion[]>(
    `/api/v2/questions?category=${encodeURIComponent(category)}&limit=100`,
    {
      next: { revalidate: 3600, tags: ["questions-list", `category-${category}`] },
    }
  );
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items as ApiQuestion[];
  if (Array.isArray(data?.data)) return data.data as ApiQuestion[];
  return [];
}

// ═══════════════════════════════════════════════════════════════
// ─── Test Cases ──────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Slug ile soru test case'lerini çek.
 * SSR'da misafirler de okuyabilsin diye auth gerekmez.
 */
export async function getQuestionTestsBySlug(
  category: string,
  slug: string
): Promise<ApiQuestionTests | null> {
  try {
    const data = await apiFetch<{ data: ApiQuestionTests } | ApiQuestionTests>(
      `/api/v2/questions/by-slug/${encodeURIComponent(category)}/${encodeURIComponent(slug)}/tests`,
      {
        next: {
          revalidate: 3600,
          tags: [
            CACHE_TAGS.QUESTION(category, slug),
            CACHE_TAGS.CATEGORY(category),
          ],
        },
      }
    );
    if ("data" in data && data.data) return data.data;
    return data as ApiQuestionTests;
  } catch {
    return null;
  }
}

/**
 * ID ile soru test case'lerini çek.
 */
export async function getQuestionTests(
  category: string,
  slugOrId: string
): Promise<ApiQuestionTests | null> {
  // Hem slug hem ID kabul eder; slug alanı varsa by-slug, yoksa by-id
  if (/^\d+$/.test(slugOrId)) {
    try {
      const data = await apiFetch<{ data: ApiQuestionTests } | ApiQuestionTests>(
        `/api/v2/questions/${slugOrId}/tests`,
        { next: { revalidate: 3600, tags: [CACHE_TAGS.ALL_QUESTIONS] } }
      );
      if ("data" in data && data.data) return data.data;
      return data as ApiQuestionTests;
    } catch {
      return null;
    }
  }
  return getQuestionTestsBySlug(category, slugOrId);
}

// ═══════════════════════════════════════════════════════════════
// ─── Category page composite (kategori landing için) ─────────
// ═══════════════════════════════════════════════════════════════

/**
 * Tek çağrıda kategori meta + soru listesi (kategori sayfası için).
 * İki ayrı fetch yerine Promise.all ile paralel çek → cold start ~50% azalır.
 *
 * 2026-07-13 fix (kullanici direktifi): BACKEND /api/v2/questions/all endpoint'i
 * `category` query param'ını YOKSAYARAK tüm soruları döndürüyor. Bu fonksiyon
 * /api/v2/questions?category=X&limit=100 (listQuestionsByCategory) kullanır —
 *   backend .eq('category', X) ile DB-side filtre yapar.
 *
 * @example
 *   const { meta, questions } = await getCategoryPageData("python-basics");
 */
export async function getCategoryPageData(
  categorySlug: string
): Promise<{
  meta: Awaited<ReturnType<typeof listCategories>>[number] | null;
  questions: ApiQuestion[];
}> {
  const [allCats, allQs] = await Promise.all([
    listCategories(),
    listQuestionsByCategory(categorySlug), // DB-side filtre (heap → sadece heap)
  ]);
  return {
    meta: allCats.find((c) => c.slug === categorySlug) ?? null,
    questions: allQs,
  };
}

/**
 * generateStaticParams için: tüm bilinen kategori slug'larını DB'den döner.
 * `dynamicParams: true` olduğu için build sonrası eklenen kategoriler de çalışır.
 */
export async function listAllCategorySlugs(): Promise<string[]> {
  const cats = await listCategories();
  // c.slug string | undefined — filter(Boolean) sonrası tip düzeltmesi gerekiyor
  return cats.map((c) => c.slug).filter((s): s is string => Boolean(s));
}

// ═══════════════════════════════════════════════════════════════
// ─── Categories ──────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Backend /api/v2/categories — unique kategorileri DB'den döner.
 * Frontend'de unique + count hesabı (eski davranış) artık backend'de.
 */
export async function listCategories(): Promise<ApiCategory[]> {
  const data = await apiFetch<ApiPagination | ApiCategory[]>(
    "/api/v2/categories",
    {
      next: { revalidate: 3600, tags: ["categories-list"] },
    }
  );
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data as ApiCategory[];
  if (Array.isArray(data?.items)) return data.items as ApiCategory[];
  return [];
}

/**
 * Legacy: fetchAllQuestions'tan unique + count hesapla.
 * Yeni sayfalar listCategories() kullanmalı — bu fallback olarak korunur.
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

/**
 * Slug ile tek kategori + içindeki sorular.
 */
export async function getCategoryDetail(slug: string): Promise<ApiCategoryDetail | null> {
  try {
    return await apiFetch<ApiCategoryDetail>(`/api/v2/categories/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// ─── Recommendations ─────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Kişiselleştirilmiş recommendation flow (dashboard).
 * Auth header otomatik eklenir; misafir ise public fallback döner.
 */
export async function getRecommendationFlow(limit = 20): Promise<ApiRecommendationFlow | null> {
  try {
    return await apiFetch<ApiRecommendationFlow>(
      "/api/v2/recommendations/flow",
      { params: { limit }, auth: true }
    );
  } catch {
    return null;
  }
}

/**
 * Community recommendations (topluluk paylaşımları).
 */
export async function getCommunityRecommendations(limit = 15): Promise<ApiPagination> {
  try {
    return await apiFetch<ApiPagination>("/api/v2/recommendations/community", {
      params: { limit },
      auth: true,
    });
  } catch {
    return { data: [] };
  }
}

// ═══════════════════════════════════════════════════════════════
// ─── slugifyTitle ────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Title → URL-safe slug (frontend-only).
 * DB-FIRST'te DB'de slug var, ama client-side navigation için
 * frontend'de de slugify gerekebilir (eski URL'ler, breadcrumb vs).
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
 * Toplam soru sayısını DB'den dinamik çek (hardcoded değer yerine).
 * 9 pillar sayfa + Hero + python-egitimi FAQ bu fonksiyonu kullanır.
 * ISR cache 60s (revalidate).
 */
export async function getTotalQuestionCount(): Promise<number> {
  try {
    const all = await getAllQuestions({ limit: 200 });
    return all.length;
  } catch {
    return 0;  // Hata durumunda 0 (UI "yükleniyor" yerine gizler)
  }
}


/**
 * Belirli bir kategorideki soru sayısını DB'den dinamik çek.
 * 9 pillar sayfa description ve related kartları hardcoded rakam
 * yerine bu fonksiyonu kullanır (DB-FIRST mimari).
 */
export async function getCategoryCount(category: string): Promise<number> {
  try {
    // listQuestionsByCategory: DB-side .eq('category', X) → sadece o kategori
    // (getAllQuestions /all endpoint'i category filtresini yoksayıyor)
    const all = await listQuestionsByCategory(category);
    return all.length;
  } catch {
    return 0;
  }
}

// ═══════════════════════════════════════════════════════════════
// ─── Backward compat object (eski questionsAPI) ──────────────
// ═══════════════════════════════════════════════════════════════
// Eski import: import { questionsAPI } from "@/lib/api"
// Yeni named export'lar yukarida. Bu object kullananlar icin facade.
export const questionsAPI = {
  getBySlug: (category: string, slugOrId: string, opts?: { includeStarter?: boolean }) =>
    getBySlug(category, slugOrId, opts ?? {}),
  getById: (id: number, opts?: { includeStarter?: boolean }) =>
    getById(id, opts ?? {}),
  getTests: (questionId: number) => getQuestionTests("", String(questionId)),
  listAll: (params?: Parameters<typeof getAllQuestions>[0]) => getAllQuestions(params),
  listByCategory: (category: string) => listQuestionsByCategory(category),
  getCategoryCount: (category: string) => getCategoryCount(category),
  getTotalCount: () => getTotalQuestionCount(),
  find: (category: string, idOrSlug: string) => findQuestion(category, idOrSlug),
  listCategories: () => listCategories(),
};
