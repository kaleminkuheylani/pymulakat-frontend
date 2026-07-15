// components/Hero.tsx
//
// Anasayfa hero bölümü — server component, JS yok.
// 2-col layout: sol metin + sağ TerminalMock (animated).
// lucide-react iconlar dekoratif emoji yerine.
//
// Sayfa kararlılığı kuralı: paragraf metin içeriği real-world örnek,
// görsel sunum dekoratif.

import Link from "next/link";
import { ArrowRight, Sparkles, Check, Code2 } from "lucide-react";
import TerminalMock from "./TerminalMock";
import { getTotalQuestionCount } from "@/lib/api/questionAPI";

export default async function Hero() {
  const total = await getTotalQuestionCount();
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(245,158,11,0.08), transparent 50%), radial-gradient(circle at 80% 80%, rgba(99,102,241,0.06), transparent 50%)",
        }}
        aria-hidden
      />

      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* ─── Sol: metin ─────────────────────────────────────── */}
          <div className="anim-fade-up">
            {/* Tag pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Şimdilik ücretsiz · Kurulum yok
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5">
              Yapay zeka destekli
              <br />
              Python{" "}
              <mark className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">mülakat platformu.</mark>
            </h1>

            <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-xl mb-7">
              {total} gerçek mülakat sorusu — yapay zeka denetiminden geçirilmiş,
              kategorize ve zorluk seviyeli. Tarayıcıda kod yaz, anında test et,
              yapay zekâdan geri bildirim al.
            </p>

            {/* CTA: Hesap aç, hemen başla */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-colors shadow-lg shadow-amber-500/20"
              >
                Hesap Aç, Hemen Başla
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/interviews/python-basics/palindrome-checker"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors"
              >
                <Code2 className="w-4 h-4" />
                Misafir Olarak Dene
              </Link>
            </div>

            {/* Kurulum yok strip */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/50 mb-2">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Kurulum yok
              </span>
              ·
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                5 dakikada hesap
              </span>
              ·
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Anında kod yazmaya başla
              </span>
            </div>
          </div>

          {/* ─── Sağ: terminal mock ────────────────────────────── */}
          <div className="anim-fade-up anim-delay-2">
            <TerminalMock />
          </div>
        </div>
      </div>
    </section>
  );
}
