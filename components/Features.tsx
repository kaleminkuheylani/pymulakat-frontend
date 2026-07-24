// components/Features.tsx
//
// Anasayfa "Artılar" bölümü — server component.
// 4 özellik kartı (lucide icon, 2-col responsive, 4-col desktop).
// 2026-07-15: Kullanıcı direktifi — artıları dokümante et:
//   1. Yapay zeka feedback (DeepSeek V3)
//   2. Hazır test case'ler (4-6 otomatik)
//   3. Python kurulumu yok (Pyodide, browser-based)
//   4. KVKK uyumlu kod oynatma
// + 5. Custom input (kendi testinizi girin)
// + 6. Test case simüle eden terminal (gerçekçi görüntü)

import Link from "next/link";
import {
  Sparkles,
  TestTube,
  Zap,
  ShieldCheck,
  Terminal,
  Pencil,
} from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Yapay Zeka Feedback",
    body: "DeepSeek V3 ile çözümünüzü analiz eder, doğru/yanlış yönleri ve geliştirme önerilerini detaylı anlatır. Her gün 10 hak — yeterli.",
    color: "amber",
  },
  {
    icon: TestTube,
    title: "Hazır Test Case'ler",
    body: "Her soruda 4-6 otomatik test case — kenar durumlar dahil. Kodunuz anında çalışır, sonuçları görürsünüz.",
    color: "emerald",
  },
  {
    icon: Terminal,
    title: "Test Terminal Simülasyonu",
    body: "Gerçek Python çıktısına yakın terminal görüntüsü. Satır satır input/output, hata mesajları, süre ve bellek kullanımı.",
    color: "cyan",
  },
  {
    icon: Pencil,
    title: "Custom Input",
    body: "Kendi test senaryolarınızı girin. Hızlı deneme, kenar durum keşfi, gerçek mülakat ortamı.",
    color: "indigo",
  },
  {
    icon: Zap,
    title: "Kurulum Yok",
    body: "Python tarayıcıda çalışır (Pyodide). Kurulum, indirme, sürüm derdi yok. Hesap aç, kodlamaya başla.",
    color: "amber",
  },
  {
    icon: ShieldCheck,
    title: "KVKK Uyumlu",
    body: "Verileriniz Supabase'de şifreli, hesap silme tek tıkla. Kullanıcı kodu saklanmaz. 3. parti reklam veya tracker yok.",
    color: "emerald",
  },
];

const COLOR_MAP: Record<string, { border: string; bg: string; text: string; chip: string }> = {
  amber: {
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
    text: "text-amber-300",
    chip: "bg-amber-500/10",
  },
  emerald: {
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
    text: "text-emerald-300",
    chip: "bg-emerald-500/10",
  },
  cyan: {
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/5",
    text: "text-cyan-300",
    chip: "bg-cyan-500/10",
  },
  indigo: {
    border: "border-indigo-500/20",
    bg: "bg-indigo-500/5",
    text: "text-indigo-300",
    chip: "bg-indigo-500/10",
  },
};

export default function Features() {
  return (
    <section className="py-12 md:py-20 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        {/* ─── Section header ─────────────────────────────────────── */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Kısıtlı süreliğine ücretsiz
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
            Mülakat hazırlığında{" "}
            <mark className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              ihtiyacınız olan her şey
            </mark>
          </h2>
          <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto">
            Kurulum yok, gizli maliyet yok, kısıtlama yok. Tarayıcıda aç, kodla, geri bildirim al.
          </p>
        </div>

        {/* ─── 6 feature grid (2-col md, 3-col lg) ──────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {FEATURES.map((f) => {
            const c = COLOR_MAP[f.color];
            const Icon = f.icon;
            return (
              <article
                key={f.title}
                className={`group relative p-5 md:p-6 rounded-xl ${c.bg} ${c.border} border hover:border-white/20 transition-colors`}
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${c.chip} ${c.text} mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base md:text-lg font-semibold mb-2 text-white">
                  {f.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {f.body}
                </p>
              </article>
            );
          })}
        </div>

        {/* ─── Bottom CTA ─────────────────────────────────────────── */}
        <div className="mt-10 md:mt-14 text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-colors shadow-lg shadow-amber-500/20"
          >
            Hemen Başla — Ücretsiz
            <Sparkles className="w-4 h-4" />
          </Link>
          <p className="text-xs text-white/40 mt-3">
            Kredi kartı yok · 5 dakikada hesap · Süre sınırı yakında
          </p>
        </div>
      </div>
    </section>
  );
}
