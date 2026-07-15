// app/page.tsx
//
// Anasayfa — Server Component. JS yok, initial HTML dolu.
//
// 2026-07-13 refactor: Eski "Pillar CTA banner" → CategoryGrid component.
//   - 8 kategori DB'den, ikonlu kart grid (1/2/3 col responsive)
//   - Her kart /{display} top-level canonical URL'sine link
//   - Soru sayısı DB'den (question_count)
//
// Kurallar:
//   - Server component (initial HTML dolu)
//   - Lucide icon, no emoji, no span
//   - DB-FIRST (lib/api/categoryAPI.ts)

import Hero from "../components/Hero";
import Features from "../components/Features";
import CategoryGrid from "../components/CategoryGrid";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Hero />
      <Features />
      <CategoryGrid />
    </main>
  );
}
