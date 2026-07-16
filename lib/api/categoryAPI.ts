// lib/api/categoryAPI.ts
// DB-FIRST kategori API'leri.
//
// Backend /api/v2/categories endpoint'inden kategori listesi cekip
// slug → label mapping olusturur. TUM kategori isimleri DB'den
// gelir — hardcoded label YOK (kullanici direktifi 2026-07-13).
//
// Avantajlar:
//   - DB yeni kategori eklenince UI otomatik guncellenir
//   - Frontend'te hardcoded string YOK
//   - ISR cache ile backend yukunu minimumda tutar
//
// Cache stratejisi (2026-07-13, refactor):
//   - 1 saat ISR (`revalidate: 3600`)
//   - Tag: "categories-list" → on-demand revalidation (/api/revalidate)
//   - Yeni kategori eklenince /api/revalidate tetiklenir, max 1 saat beklemez

/** Cache tag'leri (TEK KAYNAK). */
export const CACHE_TAGS = {
  ALL_CATEGORIES: "categories-list",
  CATEGORY: (slug: string) => `category-${slug}`,
} as const;

import { apiFetch } from "./index";
import type { ApiCategory } from "./types";

const CACHE_TTL = 3600; // 1 saat ISR cache

interface CategoryMeta {
  slug: string;
  label: string;
  description: string;
  icon: string;
  question_count: number;
}

let categoryCache: Map<string, CategoryMeta> | null = null;
let cacheTs = 0;

/**
 * Tum kategorileri DB'den cek (1 saat cache).
 * label'lar DB'de tutuldugu icin hardcoded gerekmez.
 */
export async function getAllCategories(): Promise<CategoryMeta[]> {
  if (categoryCache && Date.now() - cacheTs < CACHE_TTL * 1000) {
    return Array.from(categoryCache.values());
  }

  try {
    const res = await apiFetch<{ data: ApiCategory[] } | ApiCategory[]>(
      "/api/v2/categories",
      { next: { revalidate: CACHE_TTL, tags: ["categories-list"] } }
    );

    const list = Array.isArray(res) ? res : res.data || [];
    const map = new Map<string, CategoryMeta>();
    for (const cat of list) {
      if (!cat.slug) continue;
      map.set(cat.slug, {
        slug: cat.slug,
        label: cat.label ?? '',
        description: cat.description ?? '',
        icon: cat.icon ?? '',
        question_count: cat.question_count,
      });
    }
    categoryCache = map;
    cacheTs = Date.now();
    return Array.from(map.values());
  } catch (e) {
    console.error("[categoryAPI] getAllCategories error:", e);
    return [];
  }
}


/**
 * Tek bir kategorinin metadata'sini slug ile getir.
 * DB'den dinamik label — hardcoded YOK.
 */
export async function getCategoryMeta(slug: string): Promise<CategoryMeta | null> {
  const all = await getAllCategories();
  return all.find((c) => c.slug === slug) ?? null;
}

/**
 * Cache invalidate (admin data-tools invalidate-cache icin).
 */
export function clearCategoryCache() {
  categoryCache = null;
  cacheTs = 0;
}
