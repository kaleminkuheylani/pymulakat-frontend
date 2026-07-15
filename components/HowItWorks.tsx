// components/HowItWorks.tsx
//
// Anasayfa "Nasıl Çalışır" bölümü — server component.
// 2026-07-15: Eski /demo sayfasi kaldirildi, icerigi buraya tasindi.
//
// Icerik:
//   1. Ornek soru: Palindrome Checker (en populer)
//   2. Starter code + 4/4 test gecisi
//   3. Custom input (stdin/stdout)
//   4. Terminal komutlari: 'python solution.py' (Pyodide 12 MB WASM)
//   5. Hemen Basla CTA
//
// Static render (no auth, no DB, no Pyodide call) — sadece gorsel demo.

import Link from "next/link";
import {
  Check,
  X,
  Clock,
  Cpu,
  Sparkles,
  Terminal as TerminalIcon,
  Pencil,
  ArrowRight,
} from "lucide-react";

const STARTER_CODE = `def is_palindrome(text: str) -> bool:
    """
    Bir kelimenin veya cümlenin palindrome olup olmadığını kontrol et.
    Büyük/küçük harf fark etmesin, boşluk ve noktalama işaretlerini yok say.
    """
    # Senin kodun buraya
    pass
`;

const SAMPLE_TESTS = [
  { name: "Basit kelime", input: "racecar", status: "pass", time: "0.4ms" },
  { name: "Cümle (boşluk + noktalama)", input: "'A man a plan a canal Panama'", status: "pass", time: "0.6ms" },
  { name: "Büyük/küçük harf", input: "'RaceCar'", status: "pass", time: "0.3ms" },
  { name: "Palindrome değil", input: "'hello'", status: "pass", time: "0.4ms" },
];

export default function HowItWorks() {
  return (
    <section className="py-12 md:py-20 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* ─── Section header ───────────────────────────── */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium mb-4">
            <TerminalIcon className="w-3.5 h-3.5" />
            Nasıl Çalışır
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
            Tarayıcıda kodla,
            <br />
            <mark className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent">
              anında test et
            </mark>
          </h2>
          <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto">
            Python kurulumu yok, terminal komutu yok. Soruyu seç, kodu yaz,
            anında gerçekçi test sonuçlarını gör.
          </p>
        </div>

        {/* ─── 2-col: Starter code (sol) + Test sonuçları (sağ) */}
        <div className="grid lg:grid-cols-2 gap-4 md:gap-5 mb-8">
          {/* Sol: Starter code */}
          <div className="bg-slate-950/80 border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-[10px] text-white/40 ml-2 font-mono">
                solution.py — starter
              </span>
            </div>
            <pre className="p-4 text-xs md:text-sm font-mono leading-relaxed text-white/80 overflow-x-auto">
              <code>{STARTER_CODE}</code>
            </pre>
          </div>

          {/* Sağ: Test sonuçları (gerçekçi terminal) */}
          <div className="bg-slate-950/80 border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] text-white/60 font-mono">
                  Running test 1/4... ✓
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">
                4/4 passed
              </span>
            </div>
            <div className="p-4 space-y-2 font-mono text-xs">
              {SAMPLE_TESTS.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 py-1.5 px-2 rounded bg-white/[0.02] border border-white/5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {t.status === "pass" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    )}
                    <span className="text-white/70 truncate">
                      Test {i + 1}: {t.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-white/40 text-[10px]">
                      input: <code className="text-amber-300">{t.input}</code>
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-white/40">
                      <Clock className="w-3 h-3" />
                      {t.time}
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-white/5 text-[11px] text-white/50 flex items-center gap-2">
                <Cpu className="w-3 h-3" />
                Toplam: 1.7ms · 0 hata · 4/4 geçti
              </div>
            </div>
          </div>
        </div>

        {/* ─── Custom Input + Terminal komutları (yan yana) */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-5 mb-10">
          {/* Custom Input */}
          <div className="p-5 md:p-6 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Pencil className="w-4 h-4 text-indigo-300" />
              <h3 className="text-base md:text-lg font-semibold text-white">
                Custom Input
              </h3>
            </div>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              Kendi test senaryonu yaz, anında sonuç al. Hızlı deneme,
              kenar durum keşfi, gerçek mülakat ortamı.
            </p>
            <div className="bg-slate-950/80 border border-white/10 rounded-lg p-3 font-mono text-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-indigo-400">stdin&gt;</span>
                <code className="text-white/80">No lemon, no melon</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">stdout&gt;</span>
                <code className="text-white/80">True</code>
              </div>
            </div>
          </div>

          {/* Terminal komutları */}
          <div className="p-5 md:p-6 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-3">
              <TerminalIcon className="w-4 h-4 text-cyan-300" />
              <h3 className="text-base md:text-lg font-semibold text-white">
                Gerçekçi Terminal
              </h3>
            </div>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              Pyodide (WASM) ile tarayıcıda gerçek Python çalışır.
              Kurulum yok, saniyeler içinde hazır.
            </p>
            <div className="bg-slate-950 border border-white/10 rounded-lg p-3 font-mono text-[11px] space-y-0.5">
              <div>
                <span className="text-cyan-400">$</span>{" "}
                <span className="text-white/80">python solution.py</span>
              </div>
              <div className="text-white/50">{"\u00bb"} Loading Pyodide (12 MB, WASM)...</div>
              <div className="text-emerald-400">{"\u2713"} Pyodide ready in 1.8s</div>
              <div className="text-emerald-300 font-bold pt-1">
                {"\u2713"} All tests passed — 4/4 in 1.7ms
              </div>
            </div>
          </div>
        </div>

        {/* ─── CTA ──────────────────────────────────────── */}
        <div className="text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Şimdi sen dene — kısıtlı süreliğine ücretsiz
          </h3>
          <p className="text-sm text-white/60 mb-5 max-w-lg mx-auto">
            Hesap aç, soruyu seç, kodu yaz, anında test sonuçlarını gör.
            AI feedback ile gelişimini takip et.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-colors shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              Hemen Başla — Ücretsiz
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/interviews"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors"
            >
              Tüm Sorular
            </Link>
          </div>
          <p className="text-xs text-white/40 mt-3">
            Kredi kartı yok · 5 dakikada hesap · Süre sınırı yakında
          </p>
        </div>
      </div>
    </section>
  );
}
