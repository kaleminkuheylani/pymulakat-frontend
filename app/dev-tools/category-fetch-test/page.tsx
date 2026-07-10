// app/dev-tools/category-fetch-test/page.tsx
//
// TÜM kategori sayfaları için diagnostic.
// Memory kuralı: "X kategorisine bir şey yap" → tümüne aynısı.
// Bu sayfa 9 pillar kategoriyi (heap, stack, queue, DP, pandas, ...)
// liste halinde test eder — sekme sekme.

import CategoryFetchTest from "../../../components/CategoryFetchTest";

export const metadata = {
  title: "Category Fetch-Test | dev-tools | PythonMulakat",
  robots: { index: false, follow: false },
};

export default function CategoryFetchTestPage() {
  return <CategoryFetchTest />;
}
