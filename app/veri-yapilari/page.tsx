// app/veri-yapilari/page.tsx
// Pillar: veri-yapilari → DB category: data-structures
// 9 pillar kategoriden 1. — ayri route, kendi sayfasi
// Icerik: components/PillarCategoryPage (DB-driven landing)

import { PillarCategoryPage } from "@/components/PillarCategoryPage";

export const dynamic = "force-dynamic";

export default async function PillarPage() {
  return PillarCategoryPage({ displaySlug: "veri-yapilari", dbCategory: "data-structures" });
}
