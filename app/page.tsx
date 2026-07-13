// app/page.tsx
//
// Anasayfa — Server Component (sayfa render kuralı, 2026-07-12).
// JS yok, initial HTML dolu. Hero + Pillar CTA.
//
// ETAP 2 redesign: page-original.tsx (client, framer-motion, useUser)
// yerine temiz server component.
//
// KURAL (2026-07-13, kullanici direktifi):
//   - Anasayfada KATEGORI LISTESI YOK
//   - 9 pillar sayfalari ayri route'larda (app/python-temelleri/, app/data-structures/, ...)
//   - Anasayfa sadece Hero + Pillar CTA banner

import Link from "next/link";
import Hero from "../components/Hero";
import { ArrowRight, Code2 } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Hero />

      {/* ─── Pillar CTA (9 kategorinin 9 ayri sayfasi var) ──────── */}
      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">9 Farklı Kategori</h2>
          <p className="text-white/60 text-sm md:text-base">
            Seviyene uygun kategoriyi seç, tarayıcıda kod yaz, anında test et.
          </p>
        </div>
        <div className="flex justify-center">
          <Link
            href="/interviews"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-colors"
          >
            <Code2 className="w-4 h-4" />
            Tüm Soruları Gör
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
