// components/Hero.tsx
//
// HERO — Anasayfa ilk katman.
//
// 2026-07-23: SEO restart — intent upgrade.
//   Eski: "Yapay zeka destekli Python ve JavaScript mülakat platformu"
//          (teknik odakli, DA 1 site icin siralanamaz).
//   Yeni: "Python Mulakat Hazirlik — Tarayicida Yapay Zeka Destekli
//          Kodlama Pratiği" (commercial + generic intent).
//
// Kullanici niyetleri hedeflenen (Sonnet 5 long-tail research):
//   1. "python mulakat" (commercial — is arayanlar)
//   2. "python ogren" (generic — ogrenci)
//   3. "sifirdan python" (commercial — kurs alicisi)
//   4. "mulakat hazirlik" (commercial — aktif is arayan)
//   5. "kodlama temelleri" (generic — yeni baslayan)
//
// Kurallar:
//   - Server component, no client JS
//   - Lucide icons (no emoji)
//   - Intent-basli, dogal Turkce
//   - Tek H1 (SEO kritik)
//   - JSON-LD FAQPage (structured data)

import { ArrowRight, Sparkles, Check, Code2, Brain, Trophy } from "lucide-react";
import Link from "next/link";

interface HeroProps {
  total?: number;
  categoryCount?: number;
}

export default function Hero({ total = 83, categoryCount = 7 }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Arka plan */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(245,158,11,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_50%,rgba(99,102,241,0.08),transparent_50%)]" />

      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* ─── Sol: Metin ─────────────────────────────────────── */}
          <div className="anim-fade-up">
            {/* Tag pill — Intent signals */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Ücretsiz · Kurulum yok · Üye olmadan dene
            </div>

            {/* H1 — Ana commercial intent */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5">
              Python Mülakat Hazırlık —
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Tarayıcıda Kodlama Pratiği
              </span>
            </h1>

            {/* Subtitle — Generic + commercial */}
            <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-xl mb-7">
              Sıfırdan ileri seviyeye <strong className="text-white">{total}+ gerçek mülakat sorusu</strong>{" "}
              ile kodlama öğren. Yapay zekâ destekli değerlendirme, anlık
              geri bildirim ve 7 farklı kategori. Kurulum yok — hesap aç,
              hemen pratik yap.
            </p>

            {/* CTA: Mulakat hazirlik (commercial) */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                href="/interviews"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-colors shadow-lg shadow-amber-500/20"
              >
                Mülakat Sorularına Başla
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/blog/sifirdan-zirveye"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors"
              >
                <Code2 className="w-4 h-4" />
                Sıfırdan Python Öğren
              </Link>
            </div>

            {/* Kurulum yok strip — Trust signals */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/50 mb-2">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Kurulum yok
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Üye olmadan dene
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                AI Feedback
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Mobil uyumlu
              </span>
            </div>
          </div>

          {/* ─── Sağ: Mock terminal + Stats ─────────────────────── */}
          <div className="anim-fade-up-2">
            {/* Stats card — Trust + Numbers */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-amber-300 mb-1">
                  {total}+
                </div>
                <div className="text-xs text-white/50">Mülakat Sorusu</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-emerald-300 mb-1">
                  {categoryCount}
                </div>
                <div className="text-xs text-white/50">Kategori</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-cyan-300 mb-1">
                  7/24
                </div>
                <div className="text-xs text-white/50">Erişim</div>
              </div>
            </div>

            {/* Mock terminal — Visual proof */}
            <div className="rounded-2xl border border-white/10 bg-[#0a0e1a] overflow-hidden shadow-2xl">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                <span className="ml-3 text-xs text-white/40 font-mono">
                  python_mülakat.py
                </span>
              </div>
              <div className="p-5 font-mono text-sm">
                <div className="text-white/40 mb-1"># Python Mülakat Sorusu</div>
                <div className="text-cyan-300 mb-1">
                  def palindrome_mi(text: str) -&gt; bool:
                </div>
                <div className="text-white/80 pl-4 mb-2">
                  <span className="text-amber-300">return</span> text == text[::-1]
                </div>
                <div className="text-white/40 mt-3 mb-1"># Test</div>
                <div className="text-emerald-300">
                  ✓ palindrome_mi("kek") → True
                </div>
                <div className="text-emerald-300">
                  ✓ palindrome_mi("python") → False
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-xs">
                  <Brain className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300">AI Feedback:</span>
                  <span className="text-white/60">Mükemmel çözüm! 0.3ms</span>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/40">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Yapay zekâ denetiminden geçirilmiş sorular</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
