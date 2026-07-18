// app/blog/sifirdan-zirveye/SectionsRenderer.tsx
//
// 2026-07-18: Client component — sections sırayla render, unlock logic.
// ProgressTopbar + SectionBlock'ları yönetir.

"use client";

import { useSifirProgress } from "./hooks/useProgress";
import { SECTIONS, type SectionId } from "./data/sections";
import SectionBlock from "./components/SectionBlock";
import ProgressTopbar from "./components/ProgressTopbar";
import { LinkIcon, Sparkles } from "lucide-react";
import Link from "next/link";

const ALL_IDS: SectionId[] = SECTIONS.map((s) => s.id);

export default function SectionsRenderer() {
  const { completed, mounted, markComplete } = useSifirProgress();

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <ProgressTopbar />

      <article className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        {/* Hero */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium mb-4">
            <Sparkles className="w-3 h-3" />
            Sıfırdan Zirveye
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.15] mb-4">
            Programlama Öğren — 30 Dakikada Temeller
          </h1>
          <p className="text-white/65 leading-relaxed text-[15px]">
            Hiç kod yazmamış biri için hazırlandı. 8 kısa görev, 30 dakika.
            Yaz → Çalıştır → Test geçti mi? Sonraki açılır. Tarayıcıda Python
            çalışır, kurulum yok.
          </p>
        </header>

        {/* Bölümler */}
        {mounted ? (
          SECTIONS.map((section, i) => {
            const locked =
              i > 0 && !completed.includes(ALL_IDS[i - 1] as SectionId);
            return (
              <SectionBlock
                key={section.id}
                section={section}
                index={i}
                total={SECTIONS.length}
                locked={locked}
                completed={completed.includes(section.id)}
                onComplete={() => markComplete(section.id)}
              />
            );
          })
        ) : (
          // Hydration öncesi placeholder (server-side'da hep locked göstermemek için)
          SECTIONS.map((section, i) => (
            <div
              key={section.id}
              className="mb-8 p-6 rounded-2xl border border-white/5 bg-white/[0.01] animate-pulse h-48"
            />
          ))
        )}

        {/* Bitti */}
        {mounted && completed.length === SECTIONS.length && (
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-amber-500/15 to-amber-700/10 border border-amber-500/30 text-center">
            <Sparkles className="w-8 h-8 text-amber-300 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Tebrikler! Sıfırdan Zirveye tamamlandı.
            </h3>
            <p className="text-white/70 text-sm mb-5 max-w-md mx-auto">
              Temelleri öğrendin. Şimdi gerçek mülakat sorularıyla pratik yap:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link
                href="/interviews/programlama-temelleri"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold transition-colors"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Sorulara geç
              </Link>
              <Link
                href="/interviews"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/15 text-white/80 hover:bg-white/5 text-sm font-semibold transition-colors"
              >
                Tüm kategoriler
              </Link>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
