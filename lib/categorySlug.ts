// lib/categorySlug.ts
// TEK KAYNAK: internal slug ↔ display slug mapping
// Tüm breadcrumb, redirect, internal link bu mapping'i kullanmalı.

export const CATEGORY_DISPLAY_URL: Record<string, string> = {
  "python-basics": "/python-temelleri",
  "data-structures": "/python-veri-yapilari",
  "list-dict": "/python-liste-sozluk",
  "pandas": "/python-pandas",
  "algorithms": "/python-algoritma-sorulari",
  "heap": "/python-heap",
  "stack": "/python-stack",
  "queue": "/python-queue",
  "dynamic-programming": "/python-dinamik-programlama",
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

/** Internal slug → display URL (canonical). Yoksa internal slug döner. */
export function getCategoryDisplayUrl(internalSlug: string): string {
  return CATEGORY_DISPLAY_URL[internalSlug] ?? `/interviews/${internalSlug}`;
}

/** Internal slug → display label. Yoksa slug döner. */
export function getCategoryLabel(internalSlug: string): string {
  return CATEGORY_LABEL[internalSlug] ?? internalSlug;
}
