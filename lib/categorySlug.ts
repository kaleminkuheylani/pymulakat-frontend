// lib/categorySlug.ts
//
// TEK KAYNAK: kategori DB slug'ları + legacy display URL redirect'leri.
//
// 2026-07-13 refactor (kullanici direktifi "seoyu kırıyor suan"):
//   ESKİ: Canonical = display URL (/temelleri, /veri-yapilari, /liste-sozluk, ...)
//         SEO kötü: Türkçe karakterler, çok uzun, kısaltılmış formlar.
//   YENİ: Canonical = DB slug (/python-basics, /data-structures, /list-dict, ...)
//         SEO iyi: İngilizce, kısa, tutarlı, Google-friendly.
//
// Legacy display URL'ler → 308 → canonical DB slug URL.
//   /temelleri            → /python-basics
//   /veri-yapilari        → /data-structures
//   /liste-sozluk         → /list-dict
//   /pandas               → 410 Gone (scope'tan cikarildi, 2026-07-18)
//   /algoritma-sorulari   → /algorithms
//   /heap                 → /heap (DB slug aynı)
//   /stack                → /stack (DB slug aynı)
//   /dinamik-programlama  → /dynamic-programming
//   /python-temelleri     → /python-basics (legacy alias)
//
// Canonical top-level dynamic route: app/[category]/page.tsx
//   - URL = /{db_slug} (örn. /python-basics, /heap)
//   - 8 path pre-rendered (ISR 1h, DB-FIRST)
//   - dynamicParams=true → yeni kategori eklenince otomatik
//
// Soru detay URL'i (değişmedi): /interviews/{db}/{slug}

// ─── 8 canonical DB slug — sıralama sitemap/sidebar için ────
export const CATEGORY_SLUGS = [
  "python-basics",
  "data-structures",
  "list-dict",
  "algorithms",
  "heap",
  "stack",
  "dynamic-programming",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

// ─── DB slug → display label (UI için) ──────────────────────
export const CATEGORY_LABEL: Record<string, string> = {
  "python-basics": "Python Temelleri",
  "data-structures": "Python Veri Yapıları",
  "list-dict": "Python Liste & Sözlük",
  algorithms: "Python Algoritma",
  heap: "Python Heap",
  stack: "Python Stack",
  "dynamic-programming": "Python Dinamik Programlama",
};

// ─── Legacy display URL → canonical DB slug (308 redirect) ──
// 308 = kalıcı redirect, SEO juice yeni URL'ye aktarılır.
const LEGACY_DISPLAY_TO_DB: Record<string, string> = {
  // Türkçe display URL'ler (eski 8 pillar statik sayfalar)
  temelleri: "python-basics",
  "veri-yapilari": "data-structures",
  "liste-sozluk": "list-dict",
  "algoritma-sorulari": "algorithms",
  "dinamik-programlama": "dynamic-programming",
  // Legacy alias
  "python-temelleri": "python-basics",
};

// ─── Public API ─────────────────────────────────────────────
/** Canonical URL oluştur (basit: /{db_slug}). */
export function getCategoryUrl(dbSlug: string): string {
  return `/${dbSlug}`;
}

/** DB slug → display label. UI için. */
export function getCategoryLabel(dbSlug: string): string {
  return CATEGORY_LABEL[dbSlug] ?? dbSlug;
}

/**
 * Verilen slug canonical bir DB slug mı?
 * generateStaticParams validation, middleware whitelist vb. için.
 */
export function isCanonicalCategory(slug: string): boolean {
  return CATEGORY_SLUGS.includes(slug as CategorySlug);
}

/**
 * Legacy display URL/slug → canonical DB slug.
 * `/temelleri`, `temelleri`, `/python-temelleri` hepsini kabul eder.
 * Canonical zaten DB slug ise kendisini döner. Bilinmeyen → null.
 */
export function legacyDisplayToDb(slug: string): string | null {
  const normalized = slug.replace(/^\//, "").toLowerCase();
  // Canonical (DB slug) ise kendisini döndür
  if (isCanonicalCategory(normalized)) return normalized;
  // Legacy display URL ise DB slug'a map'le
  return LEGACY_DISPLAY_TO_DB[normalized] ?? null;
}

/** generateStaticParams için: 8 canonical DB slug. */
export function listAllCategorySlugs(): string[] {
  return [...CATEGORY_SLUGS];
}

/** Legacy redirect için: tüm eski display URL'ler. */
export function listAllLegacyDisplaySlugs(): string[] {
  return Object.keys(LEGACY_DISPLAY_TO_DB);
}

// ─── SEO KEYWORDS — kategori başına long-tail keşif sorguları ───
//
// 2026-07-13 v2 (spam-risk reduction): Her slug için MAX 5 long-tail.
//   Önceki 14-18 varyant duplicate content riski yaratıyordu (aynı sayfa
//   için "X çözümü/açıklaması/kodu/algoritması" gibi 4-5 varyasyon).
//   Yeni kural: her sayfa için max 5 category-specific + 7 base = 12.
//
// Keyword türleri (5/slug):
//   1) "X soru bankası" — keşif hacim
//   2) "X çözümleri" — niyet
//   3) 1-2 spesifik kavram (knapsack, memoization, sort) — long-tail CTR
//   4) 1 seviye kelimesi (junior/mülakat) — funnel
// ───────────────────────────────────────────────────────────────
const CATEGORY_SEO_KEYWORDS: Record<string, readonly string[]> = {
  // ── python-basics ────────────────────────────────────────
  "python-basics": [
    "python soru bankası",
    "python temel sorular ve çözümleri",
    "açıklamalı python soruları",
    "yeni başlayanlar için python",
    "python alıştırma soruları türkçe",
  ],

  // ── algorithms ───────────────────────────────────────────
  algorithms: [
    "algoritma soru bankası",
    "açıklamalı algoritma soruları ve çözümleri",
    "python algoritma soru örnekleri",
    "sıralama algoritmaları python",
    "big o notation açıklaması",
  ],

  // ── data-structures ──────────────────────────────────────
  "data-structures": [
    "veri yapıları soru bankası",
    "python veri yapıları mülakat soruları",
    "linked list soru örnekleri",
    "tree soruları python",
    "junior developer veri yapıları",
  ],

  // ── list-dict ─────────────────────────────────────────────
  "list-dict": [
    "python liste soruları",
    "python sözlük alıştırma",
    "list comprehension örnekleri",
    "python veri tipi soruları",
    "python liste mülakat soruları",
  ],

  // pandas 2026-07-18 scope'tan cikarildi,

  // ── heap ─────────────────────────────────────────────────
  heap: [
    "heap soru bankası",
    "priority queue python soruları",
    "heap sort algoritması",
    "min heap max heap soruları",
    "heap mülakat soruları",
  ],

  // ── stack ────────────────────────────────────────────────
  stack: [
    "stack soru bankası",
    "stack python mülakat soruları",
    "balanced parentheses python",
    "LIFO veri yapısı soruları",
    "stack implementation python",
  ],

  // ── dynamic-programming ──────────────────────────────────
  "dynamic-programming": [
    "dinamik programlama soru bankası",
    "python dp soru örnekleri",
    "knapsack problemi çözümü",
    "memoization örnekleri python",
    "dinamik programlama türkçe kaynak",
  ],
};

/** Kategori için SEO keywords dizisi (canonical DB slug). */
export function getCategorySeoKeywords(slug: string): string[] {
  return [...(CATEGORY_SEO_KEYWORDS[slug] ?? [])];
}
