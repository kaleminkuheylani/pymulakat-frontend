// lib/categorySlug.ts
//
// TEK KAYNAK: kategori display URL ↔ DB slug mapping.
//
// 8 canonical display URL:
//   /temelleri            → python-basics
//   /veri-yapilari        → data-structures
//   /liste-sozluk         → list-dict
//   /pandas               → pandas
//   /algoritma-sorulari   → algorithms
//   /heap                 → heap
//   /stack                → stack
//   /dinamik-programlama  → dynamic-programming
//
// Legacy display URL'ler (hâlâ redirect ediliyor, SEO juice korunsun):
//   /python-temelleri     → python-basics
//
// Canonical top-level dynamic route: app/[display]/page.tsx
// - /heap, /pandas, /temelleri ... → 8 pre-rendered (ISR 1h, DB-FIRST)
// - /interviews/{db} → 308 → /{display} (eski canonical konsolidasyon)
// - /python-temelleri → 308 → /temelleri (legacy)

// ─── DB slug → display URL (canonical) ──────────────────────
export const CATEGORY_DISPLAY_URL: Record<string, string> = {
  "python-basics": "/temelleri",
  "data-structures": "/veri-yapilari",
  "list-dict": "/liste-sozluk",
  "pandas": "/pandas",
  "algorithms": "/algoritma-sorulari",
  "heap": "/heap",
  "stack": "/stack",
  "dynamic-programming": "/dinamik-programlama",
};

// ─── DB slug → display label (UI) ───────────────────────────
export const CATEGORY_LABEL: Record<string, string> = {
  "python-basics": "Python Temelleri",
  "data-structures": "Python Veri Yapıları",
  "list-dict": "Python Liste & Sözlük",
  "pandas": "Python Pandas",
  "algorithms": "Python Algoritma",
  "heap": "Python Heap",
  "stack": "Python Stack",
  "dynamic-programming": "Python Dinamik Programlama",
};

// ─── Display URL/slug → DB slug (ters mapping) ──────────────
// Hem canonical ("/heap") hem legacy ("python-temelleri") kapsar.
// `displayToDb()` fonksiyonu bu mapping'i kullanır.
const DISPLAY_SLUG_TO_DB: Record<string, string> = {
  // Canonical (oneksiz, kısa)
  temelleri: "python-basics",
  "veri-yapilari": "data-structures",
  "liste-sozluk": "list-dict",
  pandas: "pandas",
  "algoritma-sorulari": "algorithms",
  heap: "heap",
  stack: "stack",
  "dinamik-programlama": "dynamic-programming",
  // Legacy alias
  "python-temelleri": "python-basics",
};

// ─── Public API ─────────────────────────────────────────────
/** DB slug → display URL. Canonical, redirect yok. */
export function getCategoryDisplayUrl(dbSlug: string): string {
  return CATEGORY_DISPLAY_URL[dbSlug] ?? `/interviews/${dbSlug}`;
}

/** DB slug → display label. UI için. */
export function getCategoryLabel(dbSlug: string): string {
  return CATEGORY_LABEL[dbSlug] ?? dbSlug;
}

/**
 * Display URL/slug → DB slug.
 * `/heap`, `/python-temelleri`, `heap`, `python-temelleri` hepsini kabul eder.
 * Bulunamazsa null — caller 404'e düşer.
 */
export function displayToDb(displaySlug: string): string | null {
  // "/heap" veya "heap" → normalize
  const normalized = displaySlug.replace(/^\//, "").toLowerCase();
  return DISPLAY_SLUG_TO_DB[normalized] ?? null;
}

/**
 * Tüm bilinen display slug'ları (canonical + legacy).
 * generateStaticParams için.
 */
export function listAllDisplaySlugs(): string[] {
  return Object.keys(DISPLAY_SLUG_TO_DB);
}

/**
 * Sadece canonical (active) display slug'ları.
 * Sitemap, breadcrumb, link generation için — legacy URL'ler sitemap'te yok.
 */
export function listCanonicalDisplaySlugs(): string[] {
  return Object.values(CATEGORY_DISPLAY_URL).map((p) => p.replace(/^\//, ""));
}

/** Tüm bilinen DB slug'ları. */
export function listAllDbCategorySlugs(): string[] {
  return Object.keys(CATEGORY_DISPLAY_URL);
}
