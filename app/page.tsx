// app/page.tsx
//
// Anasayfa — Server Component. JS yok, initial HTML dolu.
//
// 2026-07-23: SEO restart — intent upgrade.
//   Yeni akis (commercial + generic intent):
//     1) Hero — "Python Mulakat Hazirlik" (commercial)
//     2) Categories — 7 kategori (sifirdan python, kodlama temelleri)
//     3) HowItWorks — "3 Adimda Mulakat Hazirligi" (commercial)
//     4) Features — neden pythonmulakat (kodlama ogren)
//     5) About — "Sifirdan Zirveye: Kodlama Ogren" (generic)
//   Soru listesi /interviews sayfasinda (kategori filtresi ile).
//
// Kurallar:
//   - Server component (initial HTML dolu)
//   - Lucide icon, no emoji, no span
//   - DB-FIRST (lib/api/categoryAPI.ts)
//   - Intent-basli, dogal Turkce
//   - metadata: SERP icin optimize (commercial + generic keywords)

import type { Metadata } from "next";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import About from "../components/About";

export const metadata: Metadata = {
  // 2026-07-24 keyword stuffing temizligi: description 13→2 python, keywords
  //   10→6 unique phrase (her biri tek seferlik, "python" prefixi minimize).
  title: "Python Mülakat Hazırlık — Tarayıcıda Sıfırdan Kodlama Öğren",
  description:
    "Mülakat hazırlık için tarayıcıda kodlama pratiği. 7 kategori, 83+ gerçek soru, AI feedback. Kurulum yok, ücretsiz.",
  keywords: [
    "python mulakat",
    "mulakat hazirlik",
    "sifirdan kodlama",
    "kodlama temelleri",
    "yazilim mulakat",
    "programlama ogren",
  ],
  alternates: { canonical: "https://pythonmulakat.com/" },
  openGraph: {
    title: "Python Mülakat Hazırlık — Tarayıcıda Sıfırdan Kodlama Öğren",
    description:
      "83+ gerçek mülakat sorusu, AI feedback, 7 kategori. Tarayıcıda kodlama pratiği — ücretsiz, kurulum yok.",
    type: "website",
    url: "https://pythonmulakat.com/",
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Hero />
      <Categories />
      <HowItWorks />
      <Features />
      <About />
    </main>
  );
}

