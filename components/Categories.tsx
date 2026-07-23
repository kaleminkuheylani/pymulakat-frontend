// components/Categories.tsx
//
// POPÜLER KATEGORİLER — Anasayfa ikinci katman.
//
// 2026-07-23: SEO restart — intent upgrade.
//   7 kategori (programlama temelleri, data structures, algorithms, list-dict,
//     heap, stack, dynamic programming) — commercial + generic intent.
//
// Kullanici niyetleri:
//   - "python ogren" → "Programlama Temelleri"
//   - "kodlama temelleri" → "Programlama Temelleri"
//   - "sifirdan yazilim" → "Programlama Temelleri"
//   - "mulakat hazirlik" → "Algorithms" + "Data Structures"
//
// Her kart:
//   - Lucide icon
//   - Kategori adi + aciklama
//   - Soru sayisi (DB'den)
//   - "Basla" butonu (canonical URL)
//   - Hover effect

import Link from "next/link";
import {
  Code2,
  Layers,
  ListOrdered,
  Binary,
  Boxes,
  Layers3,
  GitBranch,
  ArrowRight,
} from "lucide-react";
import { CATEGORY_SLUGS, getCategoryUrl } from "@/lib/categorySlug";

// Kategori meta (server-render, hardcoded fallback)
// production'da DB'den (getAllCategories) cekilebilir
const CATEGORY_META: Record<string, {
  icon: any;
  title: string;
  desc: string;
  questionCount: number;
  color: "amber" | "emerald" | "cyan" | "indigo" | "rose" | "violet" | "teal";
}> = {
  "programlama-temelleri": {
    icon: Code2,
    title: "Programlama Temelleri",
    desc: "Sıfırdan Python öğren: değişkenler, koşullar, döngüler, fonksiyonlar.",
    questionCount: 19,
    color: "amber",
  },
  "data-structures": {
    icon: Layers,
    title: "Veri Yapıları",
    desc: "List, dict, tuple, set ve string operasyonları. Temel veri yapıları.",
    questionCount: 12,
    color: "emerald",
  },
  algorithms: {
    icon: GitBranch,
    title: "Algoritmalar",
    desc: "Sıralama, arama, recursion, greedy yaklaşımlar. Mülakat klasikleri.",
    questionCount: 18,
    color: "cyan",
  },
  "list-dict": {
    icon: ListOrdered,
    title: "Listeler & Sözlükler",
    desc: "Python liste ve dict manipülasyonu, comprehension, performans.",
    questionCount: 4,
    color: "indigo",
  },
  heap: {
    icon: Boxes,
    title: "Heap (Öncelik Kuyruğu)",
    desc: "Heapq, öncelik kuyruğu, kth largest, top-k problemleri.",
    questionCount: 5,
    color: "rose",
  },
  stack: {
    icon: Layers3,
    title: "Stack (Yığın)",
    desc: "Yığın veri yapısı, balanced parantez, RPN, stack-based iterasyon.",
    questionCount: 4,
    color: "violet",
  },
  "dynamic-programming": {
    icon: Binary,
    title: "Dinamik Programlama",
    desc: "Memoization, tabulation, klasik DP problemleri, mülakat hazırlık.",
    questionCount: 21,
    color: "teal",
  },
};

const COLOR_MAP: Record<string, { border: string; bg: string; text: string; chip: string }> = {
  amber: { border: "border-amber-500/20", bg: "bg-amber-500/5", text: "text-amber-300", chip: "bg-amber-500/10" },
  emerald: { border: "border-emerald-500/20", bg: "bg-emerald-500/5", text: "text-emerald-300", chip: "bg-emerald-500/10" },
  cyan: { border: "border-cyan-500/20", bg: "bg-cyan-500/5", text: "text-cyan-300", chip: "bg-cyan-500/10" },
  indigo: { border: "border-indigo-500/20", bg: "bg-indigo-500/5", text: "text-indigo-300", chip: "bg-indigo-500/10" },
  rose: { border: "border-rose-500/20", bg: "bg-rose-500/5", text: "text-rose-300", chip: "bg-rose-500/10" },
  violet: { border: "border-violet-500/20", bg: "bg-violet-500/5", text: "text-violet-300", chip: "bg-violet-500/10" },
  teal: { border: "border-teal-500/20", bg: "bg-teal-500/5", text: "text-teal-300", chip: "bg-teal-500/10" },
};

export default function Categories() {
  return (
    <section className="relative py-12 md:py-20 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-4">
            <Layers className="w-3.5 h-3.5" />
            Popüler Kategoriler
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
            Hangi Konuda Kodlama Pratiği Yapmak İstersin?
          </h2>
          <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto">
            Sıfırdan Python öğrenmek için temel yapı taşlarından, ileri
            seviye algoritmalara kadar 7 farklı kategori. Her birinde gerçek
            mülakat soruları ve AI destekli geri bildirim.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORY_SLUGS.map((slug) => {
            const meta = CATEGORY_META[slug];
            if (!meta) return null;
            const colors = COLOR_MAP[meta.color];
            const Icon = meta.icon;

            return (
              <Link
                key={slug}
                href={getCategoryUrl(slug)}
                className={`group relative rounded-2xl border ${colors.border} ${colors.bg} p-5 hover:scale-[1.02] transition-transform duration-200`}
              >
                {/* Üst: Icon + Soru sayisi */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${colors.chip} flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <span className="text-xs text-white/40 font-mono">
                    {meta.questionCount} soru
                  </span>
                </div>

                {/* Başlık */}
                <h3 className="text-lg font-bold mb-2 text-white">
                  {meta.title}
                </h3>

                {/* Açıklama */}
                <p className="text-sm text-white/60 leading-relaxed mb-4">
                  {meta.desc}
                </p>

                {/* CTA */}
                <div className={`flex items-center gap-1 text-sm font-medium ${colors.text} group-hover:gap-2 transition-all`}>
                  Başla
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Alt: Tüm kategoriler */}
        <div className="text-center mt-8">
          <Link
            href="/interviews"
            className="inline-flex items-center gap-2 text-sm text-amber-300 hover:text-amber-200 transition-colors"
          >
            Tüm Kategorileri Gör
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
