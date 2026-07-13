// app/stack/page.tsx
// Pillar: stack → DB category: stack
// 9 pillar kategoriden 1. — ayri route, kendi sayfasi
// Icerik: components/PillarCategoryPage (DB-driven landing)

import { PillarCategoryPage } from "@/components/PillarCategoryPage";

export const dynamic = "force-dynamic";

export default async function PillarPage() {
  return PillarCategoryPage({ displaySlug: "stack", dbCategory: "stack" });
}
