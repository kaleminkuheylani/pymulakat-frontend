// app/dinamik-programlama/page.tsx
// Pillar: dinamik-programlama → DB category: dynamic-programming
// 9 pillar kategoriden 1. — ayri route, kendi sayfasi
// Icerik: components/PillarCategoryPage (DB-driven landing)

import { PillarCategoryPage } from "@/components/PillarCategoryPage";

export const dynamic = "force-dynamic";

export default async function PillarPage() {
  return PillarCategoryPage({ displaySlug: "dinamik-programlama", dbCategory: "dynamic-programming" });
}
