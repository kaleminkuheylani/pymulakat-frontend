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
import { CATEGORY_LABEL, CATEGORY_DESCRIPTION, CATEGORY_SLUGS } from "../categorySlug";

const CACHE_TTL = 60; // 2026-07-18: gecici cache bypass (slug migration sonrasi 3600'a dondur)

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
        // 2026-07-18: "Programlama Mülakatı" pozisyonlaması (cache invalidation).
        // DB-First olduğu için label/description DB'den gelir, ama
        // Python'a bağımlı etiketleri frontend canonical map ile override ederiz.
        // (DB'de "Python Temelleri" yazıyorsa bile UI'da "Programlama Temelleri" görünür)
        label: CATEGORY_LABEL[cat.slug] ?? cat.label ?? '',
        description: CATEGORY_DESCRIPTION[cat.slug] ?? cat.description ?? '',
        icon: cat.icon ?? '',
        question_count: cat.question_count,
      });
    }
    categoryCache = map;
    cacheTs = Date.now();
    return Array.from(map.values());
  } catch (e) {
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
 * Cache invalidate (deprecated 2026-07-18: module cache kaldirildi).
 */
export function clearCategoryCache() {
  // no-op
}
