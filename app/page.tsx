// app/page.tsx
//
// Anasayfa — Server Component. JS yok, initial HTML dolu.
//
// 2026-07-15: CategoryGrid kaldirildi (kullanici direktifi).
//   - Landing artik: Hero (mock terminal) + Features (6 arti karti)
//   - Soru listesi /interviews sayfasinda (kategori filtresi ile)
//
// Kurallar:
//   - Server component (initial HTML dolu)
//   - Lucide icon, no emoji, no span
//   - DB-FIRST (lib/api/categoryAPI.ts)

import Hero from "../components/Hero";
import Features from "../components/Features";
import PublicQuestionsSection from "../components/PublicQuestionsSection";
import HowItWorks from "../components/HowItWorks";
import About from "../components/About";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Hero />
      <Features />
      <PublicQuestionsSection />
      <HowItWorks />
      <About />
    </main>
  );
}

