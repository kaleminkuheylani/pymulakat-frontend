// app/heap/page.tsx
// Pillar: heap → DB category: heap
// 9 pillar kategoriden 1. — ayri route, kendi sayfasi
// Icerik: components/PillarCategoryPage (DB-driven landing)

import { PillarCategoryPage } from "@/components/PillarCategoryPage";

export const dynamic = "force-dynamic";

export default async function PillarPage() {
  return PillarCategoryPage({ displaySlug: "heap", dbCategory: "heap" });
}
