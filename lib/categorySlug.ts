// lib/categorySlug.ts
// TEK KAYNAK: internal slug ↔ display slug mapping
// python-temelleri HARIC tum URL'ler "python-" oneksiz (kisa, internal = display).
//
// Cozum: routing dilemma (internal slug + display URL = 2 set) yok, sadece
// tek URL var. /interviews/{internal-slug} 308 redirect ile /{display-url}
// otomatik tutarlilik.

export const CATEGORY_DISPLAY_URL: Record<string, string> = {
  "python-basics": "/temelleri",
  "data-structures": "/veri-yapilari",
  "list-dict": "/liste-sozluk",
  "pandas": "/pandas",
  "algorithms": "/algoritma-sorulari",
  "heap": "/heap",
  "stack": "/stack",
  "queue": "/queue",
  "dynamic-programming": "/dinamik-programlama",
};

export const CATEGORY_LABEL: Record<string, string> = {
  "python-basics": "Python Temelleri",
  "data-structures": "Veri Yapıları",
  "list-dict": "Liste & Sözlük",
  "pandas": "Pandas",
  "algorithms": "Algoritma",
  "heap": "Heap",
  "stack": "Stack",
  "queue": "Queue",
  "dynamic-programming": "Dinamik Programlama",
};

/** Internal slug → display URL. */
export function getCategoryDisplayUrl(internalSlug: string): string {
  return CATEGORY_DISPLAY_URL[internalSlug] ?? `/interviews/${internalSlug}`;
}

/** Internal slug → display label. */
export function getCategoryLabel(internalSlug: string): string {
  return CATEGORY_LABEL[internalSlug] ?? internalSlug;
}

/** Ters mapping: display URL → internal slug (middleware redirect icin). */
export const DISPLAY_URL_TO_INTERNAL: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_DISPLAY_URL).map(([internal, url]) => [url, internal])
);
