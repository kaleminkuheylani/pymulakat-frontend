// components/DpFetchTest.tsx
//
// Backward-compatible wrapper: DP kategorisi için CategoryFetchTest'i
// pre-configure eder. Generic versiyon için CategoryFetchTest kullan.
//
// 📌 Mimari: paylaşılan bileşen → 9 kategori sayfası için tek source.
// Yeni kategori ekle → ALL_CATEGORIES'e entry ekle, geri kalanı otomatik.

"use client";

import CategoryFetchTest from "./CategoryFetchTest";

export default function DpFetchTest() {
  return <CategoryFetchTest category="dynamic-programming" categoryLabel="DP" />;
}
