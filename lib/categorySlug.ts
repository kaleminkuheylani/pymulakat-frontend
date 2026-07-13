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
