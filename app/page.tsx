// app/page.tsx
//
// Anasayfa — Server Component (sayfa render kuralı, 2026-07-12).
// JS yok, initial HTML dolu. Hero + kategori listesi + CTA.
//
// ETAP 2 redesign: page-original.tsx (client, framer-motion, useUser)
// yerine temiz server component. Mevcut içerik (paragraflar, bölümler)
// korunur, sadece görsel sunum güncellendi (emoji → lucide, animasyonlar
// CSS).

import Link from "next/link";
import Hero from "../components/Hero";
import { CATEGORY_ICONS } from "../lib/icons";
import {
  Code2,
  ArrowRight,
  BookOpen,
  Sparkles,
  Trophy,
  Users,
  Layers,
  Database,
  Cpu,
  Brain,
  ListTree,
  Mountain,
  ListOrdered,
  type LucideIcon,
} from "lucide-react";

// Kategori listesi (icon + başlık + 1 cümle açıklama)
// Sayfa kararlılığı kuralı: kategori adı, açıklaması içerik — korunur
const CATEGORIES: Array<{
  slug: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  count: number;
  href: string;
  level: "beginner" | "intermediate" | "advanced";
}> = [
  {
    slug: "python-basics",
    title: "Python Temelleri",
    desc: "Değişkenler, veri tipleri, string, döngüler, fonksiyonlar.",
    icon: Code2,
    count: 34,
    href: "/python-temelleri",
    level: "beginner",
  },
  {
    slug: "data-structures",
    title: "Veri Yapıları",
    desc: "Stack, queue, linked list, tree, graph, hash table.",
    icon: Layers,
    count: 21,
    href: "/python-veri-yapilari",
    level: "advanced",
  },
  {
    slug: "list-dict",
    title: "Liste & Sözlük",
    desc: "List, dict, tuple, set, comprehension, sorting.",
    icon: ListTree,
    count: 8,
    href: "/python-liste-sozluk",
    level: "beginner",
  },
  {
    slug: "pandas",
    title: "Pandas",
    desc: "DataFrame, Series, groupby, merge, filter, agg.",
    icon: Database,
    count: 13,
    href: "/python-pandas",
    level: "intermediate",
  },
  {
    slug: "algorithms",
    title: "Algoritmalar",
    desc: "Sıralama, arama, graf, string algoritmaları.",
    icon: Cpu,
    count: 26,
    href: "/python-algoritma-sorulari",
    level: "advanced",
  },
  {
    slug: "dynamic-programming",
    title: "Dinamik Programlama",
    desc: "Memoization, tabulation, fibonacci, knapsack, edit distance.",
    icon: Brain,
    count: 12,
    href: "/python-dinamik-programlama",
    level: "advanced",
  },
  {
    slug: "heap",
    title: "Heap / Priority Queue",
    desc: "heapq modülü, min-heap, max-heap, priority queue.",
    icon: Mountain,
    count: 8,
    href: "/python-heap",
    level: "intermediate",
  },
  {
    slug: "stack",
    title: "Stack",
    desc: "LIFO, push/pop, parantez dengesi, undo/redo, DFS.",
    icon: Layers,
    count: 5,
    href: "/python-stack",
    level: "intermediate",
  },
  {
    slug: "queue",
    title: "Queue",
    desc: "FIFO, enqueue/dequeue, BFS, deque, circular queue.",
    icon: ListOrdered,
    count: 5,
    href: "/python-queue",
    level: "intermediate",
  },
];

const LEVEL_STYLES: Record<string, string> = {
  beginner: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
  intermediate: "bg-amber-500/10 border-amber-500/30 text-amber-300",
  advanced: "bg-rose-500/10 border-rose-500/30 text-rose-300",
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />

      {/* ─── 9 Konu Başlığı (kategori grid) ──────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              9 Konu Başlığı
            </h2>
          </div>
          <p className="text-white/50 text-sm md:text-base ml-[52px]">
            Seviyene uygun kategoriyi seç, tarayıcıda kod yaz, anında test et.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={cat.href}
                className="group relative rounded-xl border border-white/10 bg-white/[0.02] p-5 card-hover overflow-hidden"
              >
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center text-white"
                      style={{
                        background: "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(99,102,241,0.12))",
                        border: "1px solid rgba(245,158,11,0.25)",
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${LEVEL_STYLES[cat.level]}`}
                    >
                      {cat.level}
                    </span>
                  </div>

                  <h3 className="text-base font-bold mb-1.5 group-hover:text-amber-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                    {cat.desc}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <span className="text-xs text-white/40 font-mono">
                      {cat.count} soru
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 " />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── 3 Adım (nasıl çalışır) ──────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Nasıl Çalışır?
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              step: "01",
              title: "Kategori Seç",
              desc: "9 kategoriden birini seç. Seviyene uygun zorlukta sorularla başla.",
              icon: BookOpen,
            },
            {
              step: "02",
              title: "Kod Yaz, Test Et",
              desc: "Tarayıcıda kodu yaz, Çalıştır'a bas. Pyodide ile saniyeler içinde test sonucu.",
              icon: Code2,
            },
            {
              step: "03",
              title: "İlerle, Paylaş",
              desc: "Geçen testlerde puan kazan, rozet topla. Çözümlerini arkadaşlarınla paylaş.",
              icon: Trophy,
            },
          ].map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-5 anim-fade-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-mono text-amber-400/70 tracking-widest">
                    {s.step}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center text-amber-400 mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold mb-1.5">{s.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Kimler İçin? ───────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Kimler İçin?
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-base font-bold mb-2 text-white">
              Mülakat hazırlığında olan
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Junior ya da mid seviye Python mülakatına 2-4 hafta kaldıysa
              sistematik çalışmak için ideal. Zayıf olduğun konuyu tespit et,
              o kategoride 20+ soru çöz, mülakata hazır gir.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-base font-bold mb-2 text-white">
              Belirli konuyu pekiştirmek isteyen
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Sadece dinamik programlama ya da heap ile ilgileniyorsan, o
              kategoriye dalıp 10-15 soru çöz. Geri kalan kategorileri
              atlayabilirsin. Her kategori bağımsız çalışır.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
          Hazırsan başlayalım.
        </h2>
        <p className="text-white/60 text-base mb-7">
          Kurulum yok, hesap açmak zorunda değilsin. Bir kategori seç, ilk
          soruyu çöz.
        </p>
        <Link
          href="/interviews"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-colors shadow-lg shadow-amber-500/20"
        >
          Tüm Soruları Gör
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </main>
  );
}
