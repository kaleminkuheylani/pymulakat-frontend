// app/demo/page.tsx
//
// "Test Terminal Simülasyonu" detay sayfası — public, auth gerekmez.
// 2026-07-15: Kullanıcı direktifi — Features kartlarindaki 'Test Terminal
// Simülasyonu' ve 'Custom Input' artilari icin detay sayfasi olacak.
//
// Sayfa icerigi:
//   1. Örnek soru: "Palindrome Checker" (en popüler)
//   2. Interaktif terminal mock — gerçekçi test çalıştırma simülasyonu
//   3. Custom input — kullanıcı kendi testini girer
//   4. Test case sonuçları (PASS/FAIL, süre, bellek)
//   5. Hemen Başla CTA
//
// Static render (no auth, no DB call) — server component.

import Link from "next/link";
import { ArrowRight, Check, X, Clock, Cpu, Sparkles, Terminal as TerminalIcon, Pencil } from "lucide-react";

// ─── Örnek soru: Palindrome Checker ─────────────────────
const SAMPLE_QUESTION = {
  title: "Palindrome Checker",
  difficulty: "beginner",
  category: "python-basics",
  starter_code: `def is_palindrome(text: str) -> bool:
    """
    Bir kelimenin veya cümlenin palindrome olup olmadığını kontrol et.
    Büyük/küçük harf fark etmesin, boşluk ve noktalama işaretlerini yok say.
    """
    # Senin kodun buraya
    pass
`,
  solution: `def is_palindrome(text: str) -> bool:
    cleaned = "".join(c.lower() for c in text if c.isalnum())
    return cleaned == cleaned[::-1]
`,
  tests: [
    { name: "Basit kelime", input: "racecar", expected: "True", status: "pass", time: "0.4ms" },
    { name: "Cümle (boşluk + noktalama)", input: "'A man a plan a canal Panama'", expected: "True", status: "pass", time: "0.6ms" },
    { name: "Büyük/küçük harf", input: "'RaceCar'", expected: "True", status: "pass", time: "0.3ms" },
    { name: "Palindrome değil", input: "'hello'", expected: "False", status: "pass", time: "0.4ms" },
  ],
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        {/* ─── Header ─────────────────────────────────────── */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium mb-4">
            <TerminalIcon className="w-3.5 h-3.5" />
            Test Terminal Simülasyonu · Demo
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-3">
            Gerçekçi test ortamı,
            <br />
            <mark className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent">
              tarayıcıda, kurulum yok
            </mark>
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl">
            Aşağıda örnek bir sorunun kodunu, test case'lerini ve simüle edilmiş terminal çıktısını görüyorsun.
            Gerçek editörde kendi kodunuzu yazıp aynı testleri çalıştırabilirsiniz.
          </p>
        </header>

        {/* ─── 2-col: Kod + Test Sonuçları ────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* Sol: Starter code (monaco benzeri görünüm) */}
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
              <code>{SAMPLE_QUESTION.starter_code}</code>
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
              {SAMPLE_QUESTION.tests.map((t, i) => (
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

        {/* ─── Custom Input demo ────────────────────────────── */}
        <section className="mb-10 p-5 md:p-6 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Pencil className="w-4 h-4 text-indigo-300" />
            <h2 className="text-base md:text-lg font-semibold text-white">
              Custom Input — kendi testini yaz
            </h2>
          </div>
          <p className="text-sm text-white/60 mb-4 leading-relaxed">
            Kütüphane fonksiyonu veya kendi test senaryonu yaz, anında sonuç al. Hızlı deneme,
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
        </section>

        {/* ─── Test çıktı simülasyonu (animasyonsuz, server-render) */}
        <section className="mb-10 p-5 md:p-6 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
          <div className="flex items-center gap-2 mb-3">
            <TerminalIcon className="w-4 h-4 text-cyan-300" />
            <h2 className="text-base md:text-lg font-semibold text-white">
              Gerçekçi terminal — satır satır çıktı
            </h2>
          </div>
          <div className="bg-slate-950 border border-white/10 rounded-lg p-4 font-mono text-xs space-y-1">
            <div><span className="text-cyan-400">$</span> <span className="text-white/80">python solution.py</span></div>
            <div className="text-white/50">{"\u00bb"} Loading Pyodide runtime (12 MB, WASM)...</div>
            <div className="text-emerald-400">{"\u2713"} Pyodide ready in 1.8s</div>
            <div className="text-white/50">{"\u00bb"} Running test 1/4: <code className="text-amber-300">"racecar"</code> ... <span className="text-emerald-400">PASS (0.4ms)</span></div>
            <div className="text-white/50">{"\u00bb"} Running test 2/4: <code className="text-amber-300">"A man a plan a canal Panama"</code> ... <span className="text-emerald-400">PASS (0.6ms)</span></div>
            <div className="text-white/50">{"\u00bb"} Running test 3/4: <code className="text-amber-300">"RaceCar"</code> ... <span className="text-emerald-400">PASS (0.3ms)</span></div>
            <div className="text-white/50">{"\u00bb"} Running test 4/4: <code className="text-amber-300">"hello"</code> ... <span className="text-emerald-400">PASS (0.4ms)</span></div>
            <div className="pt-2 text-emerald-300 font-bold">
              {"\u2713"} All tests passed — 4/4 in 1.7ms
            </div>
          </div>
        </section>

        {/* ─── CTA ────────────────────────────────────────── */}
        <div className="text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Şimdi sen dene — kısıtlı süreliğine ücretsiz
          </h3>
          <p className="text-sm text-white/60 mb-5 max-w-lg mx-auto">
            Hesap aç, soruyu seç, kodu yaz, anında test sonuçlarını gör. AI feedback ile gelişimini takip et.
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
    </main>
  );
}
