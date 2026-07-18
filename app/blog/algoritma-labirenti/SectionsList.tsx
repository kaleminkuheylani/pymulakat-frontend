// app/blog/algoritma-labirenti/SectionsList.tsx
//
// 2026-07-18: Algoritma Labirenti — client component.
// SectionsList sadece section listesini render eder.
// useProgress localStorage ile tamamlanan seviyeleri takip eder.

"use client";

import { useAlgProgress } from "./hooks/useProgress";
import { SECTIONS, TOTAL_MINUTES, type SectionId } from "./data/sections";
import SectionBlock from "./components/SectionBlock";
import ProgressTopbar from "./components/ProgressTopbar";
import { Sparkles, Trophy, MapPin } from "lucide-react";
import Link from "next/link";

export default function SectionsList() {
  const { completed, mounted, markComplete } = useAlgProgress();

  return (
    <>
      <ProgressTopbar />

      <article className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        {/* Hero */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium mb-4">
            <Sparkles className="w-3 h-3" />
            Algoritma Labirenti
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.15] mb-4">
            30 Dakikada 6 Algoritma Problemini Çöz
          </h1>
          <p className="text-white/65 leading-relaxed text-[15px]">
            Algoritma kasabasında kaybolan birisin. 6 kapıyı geçmen gerek.
            Her kapıda 2 sınav var: <strong>kolay + edge</strong>.
            İkisini de geçmeden sonraki kapı açılmaz. Toplam{" "}
            <strong className="text-amber-300">{TOTAL_MINUTES} dakika</strong>{" "}
            (~{Math.round(TOTAL_MINUTES / SECTIONS.length)} dk/seviye). Tarayıcıda Python
            yaz, anlık test et.
          </p>
        </header>

        {/* Map */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60 mb-3">
            <MapPin className="w-3.5 h-3.5" />
            Labirent Haritası
          </div>
          <ol className="space-y-1.5 text-sm">
            {SECTIONS.map((s, i) => {
              const done = mounted && completed.includes(s.id);
              return (
                <li
                  key={s.id}
                  className={`flex items-center gap-2 ${done ? "text-emerald-300" : "text-white/60"}`}
                >
                  <span className="font-mono text-xs w-6 text-white/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {done ? <Trophy className="w-3.5 h-3.5" /> : <span className="w-3.5 h-3.5" />}
                  <span>{s.title}</span>
                  <span className="text-white/30 text-xs ml-auto">
                    ~{s.estimatedMinutes} dk
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {SECTIONS.map((section, i) => {
            // Lock: onceki seviye tamamlanmamissa kilitli
            const prevId: SectionId | undefined = i > 0 ? SECTIONS[i - 1].id : undefined;
            const locked = mounted && !!prevId && !completed.includes(prevId);
            const isCompleted = mounted && completed.includes(section.id);

            return (
              <SectionBlock
                key={section.id}
                section={section}
                index={i}
                total={SECTIONS.length}
                locked={locked}
                completed={isCompleted}
                onComplete={() => markComplete(section.id)}
              />
            );
          })}
        </div>

        {/* Ilerleme */}
        {mounted && completed.length === SECTIONS.length && (
          <div className="mt-12 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-emerald-500/10 p-8 text-center space-y-4">
            <Trophy className="w-12 h-12 text-amber-300 mx-auto" />
            <h2 className="text-2xl font-bold">Tebrikler! Labirenti Tamamladın</h2>
            <p className="text-white/70 text-sm max-w-md mx-auto">
              6 seviye, 12 test case — hepsini geçtin. Artık temel algoritma
              problemlerinin üstesinden gelebilirsin.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <Link
                href="/interviews"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-[#050816] font-semibold text-sm hover:bg-amber-400 transition-colors"
              >
                Mülakat Sorularına Geç
              </Link>
              <Link
                href="/blog/programlama-temelleri"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 text-white font-semibold text-sm hover:bg-white/15 transition-colors"
              >
                Programlama Temelleri
              </Link>
            </div>
          </div>
        )}

        {/* Ileri okuma */}
        <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">
            İlgili Yazılar
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/blog/sifirdan-zirveye" className="group p-4 rounded-xl border border-white/10 hover:border-amber-500/30 transition-colors">
              <div className="text-sm font-semibold mb-1 group-hover:text-amber-300 transition-colors">Sıfırdan Zirveye</div>
              <div className="text-xs text-white/60">Önce bunu tamamla: 30 dk'da Python temelleri.</div>
            </Link>
            <Link href="/blog/algoritma-nedir" className="group p-4 rounded-xl border border-white/10 hover:border-amber-500/30 transition-colors">
              <div className="text-sm font-semibold mb-1 group-hover:text-amber-300 transition-colors">Algoritma Nedir?</div>
              <div className="text-xs text-white/60">Algoritma kavramı: sandviçten kodlamaya yolculuk.</div>
            </Link>
            <Link href="/blog/teknik-terimler" className="group p-4 rounded-xl border border-white/10 hover:border-amber-500/30 transition-colors">
              <div className="text-sm font-semibold mb-1 group-hover:text-amber-300 transition-colors">Teknik Terimler</div>
              <div className="text-xs text-white/60">Big O, runtime, hash map gibi kavramlar.</div>
            </Link>
            <Link href="/interviews/algorithms" className="group p-4 rounded-xl border border-white/10 hover:border-amber-500/30 transition-colors">
              <div className="text-sm font-semibold mb-1 group-hover:text-amber-300 transition-colors">Algoritma Soruları</div>
              <div className="text-xs text-white/60">Labirenti geçtin, şimdi gerçek sorulara bak.</div>
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
