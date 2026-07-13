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
//   /pandas               → /pandas (DB slug aynı, redirect gereksiz)
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
  "pandas",
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
  pandas: "Python Pandas",
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
// 2026-07-13 kullanıcı direktifi: "algoritma soru bankası", "açıklamalı
//   algoritma soruları ve çözümleri" gibi intent-yoğun sorgular.
// Conversion psychology: kullanıcı çözüm ararken soru sayfasına düşsün,
//   orada "test çalıştırmak için ücretsiz üye ol" CTA'sı görsün.
//
// Her slug için 14-20 long-tail keyword. Hem generic (türkçe SEO) hem
//   category-spesifik (algoritma/dp/veri yapıları için farklı kelime seti).
// Yeni kategori eklenirken buraya entry ekle — app/[category]/page.tsx
//   generateMetadata otomatik çeker.
//
// Keyword türleri:
//   1) "X soru bankası" / "X soru örnekleri" — keşif (yüksek hacim)
//   2) "X çözümleri" / "X açıklaması" — niyet (yüksek conversion)
//   3) Spesifik kavramlar (knapsack, memoization, vs.) — long-tail CTR
//   4) Seviye (beginner, junior, mülakat) — funnel
// ───────────────────────────────────────────────────────────────
const CATEGORY_SEO_KEYWORDS: Record<string, readonly string[]> = {
  // ── python-basics ────────────────────────────────────────
  "python-basics": [
    "python soru bankası",
    "python temel sorular ve çözümleri",
    "açıklamalı python soruları",
    "python başlangıç soruları",
    "yeni başlayanlar için python alıştırma",
    "python string soruları",
    "python değişken tipi soruları",
    "python operatör soruları",
    "python döngü soruları",
    "python fonksiyon soruları",
    "python mülakat temelleri",
    "python kodlama pratiği",
    "python online test çöz",
    "python alıştırma soruları türkçe",
  ],

  // ── algorithms (kullanıcı direktifi vurgu) ────────────────
  algorithms: [
    "algoritma soru bankası",
    "açıklamalı algoritma soruları ve çözümleri",
    "python algoritma soru örnekleri",
    "algoritma çözümleri türkçe",
    "python algoritma mülakat soruları",
    "sıralama algoritmaları python",
    "arama algoritmaları python",
    "big o notation açıklaması",
    "zaman karmaşıklığı hesaplama",
    "alan karmaşıklığı soruları",
    "özyinelemeli algoritmalar python",
    "algoritma analizi soruları",
    "bubble sort python",
    "binary search python",
    "merge sort python",
    "quick sort python",
    "algoritma pratiği türkçe",
    "junior developer algoritma soruları",
  ],

  // ── data-structures (kullanıcı direktifi vurgu) ───────────
  "data-structures": [
    "veri yapıları soru bankası",
    "python veri yapıları mülakat soruları",
    "açıklamalı veri yapıları soruları ve çözümleri",
    "linked list soru örnekleri",
    "tree soruları python",
    "binary tree alıştırma",
    "graph algoritmaları soruları",
    "hash table python soruları",
    "trie veri yapısı",
    "avl tree soruları",
    "veri yapıları çözümleri türkçe",
    "junior developer veri yapıları",
    "python linked list mülakat",
    "data structures türkçe kaynak",
  ],

  // ── list-dict ─────────────────────────────────────────────
  "list-dict": [
    "python liste soruları",
    "python sözlük alıştırma",
    "list comprehension örnekleri",
    "dict manipulation python",
    "python liste mülakat soruları",
    "python tuple soruları",
    "python set soruları",
    "nested dict python",
    "list slicing soruları",
    "dictionary comprehension örnekleri",
    "python veri tipi soruları",
  ],

  // ── pandas (kullanıcı direktifi vurgu) ───────────────────
  pandas: [
    "pandas soru bankası",
    "python pandas alıştırma soruları",
    "pandas mülakat soruları türkçe",
    "dataframe soruları",
    "pandas groupby örnekleri",
    "pandas merge join alıştırma",
    "pandas veri temizleme",
    "pandas filtreleme soruları",
    "pandas apply lambda",
    "pandas pivot table soruları",
    "pandas csv okuma",
    "veri bilimi mülakat soruları",
    "pandas türkçe kaynak",
  ],

  // ── heap (kullanıcı direktifi vurgu) ──────────────────────
  heap: [
    "heap soru bankası",
    "priority queue python soruları",
    "heap sort algoritması",
    "min heap max heap soruları",
    "heapify python",
    "heap mülakat soruları",
    "açıklamalı heap soruları ve çözümleri",
    "heap veri yapısı türkçe",
  ],

  // ── stack (kullanıcı direktifi vurgu) ─────────────────────
  stack: [
    "stack soru bankası",
    "stack python mülakat soruları",
    "balanced parentheses python",
    "LIFO veri yapısı soruları",
    "stack implementation python",
    "açıklamalı stack soruları ve çözümleri",
    "stack veri yapısı türkçe",
  ],

  // ── dynamic-programming (kullanıcı direktifi vurgu) ───────
  "dynamic-programming": [
    "dinamik programlama soru bankası",
    "python dp soru örnekleri",
    "dinamik programlama mülakat soruları",
    "memoization örnekleri python",
    "knapsack problemi çözümü",
    "0-1 knapsack python",
    "fibonacci memoization",
    "longest common subsequence python",
    "dinamik programlama türkçe kaynak",
    "coin change problemi python",
    "edit distance algoritması",
    "python dp alıştırma",
    "açıklamalı dp soruları ve çözümleri",
    "tabulation vs memoization",
    "junior developer dp soruları",
  ],
};

/** Kategori için SEO keywords dizisi (canonical DB slug). */
export function getCategorySeoKeywords(slug: string): string[] {
  return [...(CATEGORY_SEO_KEYWORDS[slug] ?? [])];
}
