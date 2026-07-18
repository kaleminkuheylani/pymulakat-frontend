// app/interviews/page.tsx
//
// KATEGORİ GRİD — 8 pillar kategori, DB-driven, ISR 1h.
//
// 2026-07-16 kullanıcı direktifi:
//   /interviews → kategori grid (soru listesi DEĞİL)
//   Her kategori kartı tıklanabilir → /interviews/{db_slug}
//   Örnek: "Dinamik Programlama" → /interviews/dynamic-programming
//
// Mimari:
//   - Server component (initial HTML dolu)
//   - DB-FIRST: getAllCategories() (1 saat cache)
//   - ISR: revalidate=3600 (kategori eklenince/silinince revalidate)
//   - 8 kategori: python-basics, data-structures, list-dict, pandas,
//     algorithms, heap, stack, dynamic-programming
//   - Sade/düz tasarım: icon + label + description + count
//   - Lucide icon (lib/icons.ts → CATEGORY_ICONS)
//   - DB'den description (TEK KAYNAK)
//
// SEO:
//   - Title: "Mülakat Soruları — Python Kategorileri | Python Mülakat"
//   - JSON-LD: CollectionPage + ItemList

import Link from "next/link";
import { getAllCategories } from "@/lib/api/categoryAPI";
import { CATEGORY_ICONS } from "@/lib/icons";
import { getCategoryUrl } from "@/lib/categorySlug";
import type { Metadata } from "next";
import { BASE_URL } from "@/lib/seo";

// ISR — 1 saatte bir yenile (kategori eklenince değişsin)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Python Mülakat Soruları — Tüm Kategoriler | Python Mülakat",
  description:
    "Python mülakat sorularını kategorilere göre keşfet: temeller, veri yapıları, algoritma, dinamik programlama, heap, stack, pandas. 8 kategori, 100+ soru.",
  keywords: [
    "python mülakat soruları",
    "python kategori",
    "algoritma soruları",
    "dinamik programlama",
    "veri yapıları soruları",
    "heap stack mülakat",
    "pandas soruları",
  ],
  openGraph: {
    title: "Python Mülakat Soruları — Tüm Kategoriler",
    description:
      "Python mülakat sorularını kategorilere göre keşfet. 8 farklı kategori, 85+ soru.",
    url: `${BASE_URL}/interviews`,
    siteName: "Python Mülakat",
    locale: "tr_TR",
    type: "website",
  },
  alternates: {
    canonical: `${BASE_URL}/interviews`,
  },
};

interface Category {
  slug: string;
  label: string;
  description: string;
  question_count: number;
}

export default async function InterviewsGridPage() {
  const allCategories = (await getAllCategories()) as Category[];
  // queue kategorisini filtrele (varsa)
  const categories = allCategories.filter((c) => c.slug !== "queue");

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        {/* ─── Header ─────────────────────────────────────── */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Python Mülakat Soruları
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl leading-relaxed">
            Aşağıdaki kategorilerden birini seçerek o alandaki mülakat
            sorularına ulaşabilirsin. Her kategoride 5-20+ soru, açıklama
            ve örnek test case&apos;leri bulunur.
          </p>
          <div className="mt-4 text-sm text-white/50">
            {categories.length} kategori · toplam{" "}
            {categories.reduce((sum, c) => sum + (c.question_count || 0), 0)}{" "}
            soru
          </div>
        </header>

        {/* ─── Kategori grid (sade/düz) ──────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug] ?? CATEGORY_ICONS["python-basics"];
            return (
              <Link
                key={cat.slug}
                href={getCategoryUrl(cat.slug)}
                className="group block p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-colors"
              >
                {/* Icon + count */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-amber-300" />
                  </div>
                  <span className="text-xs text-white/40 font-mono">
                    {cat.question_count ?? 0} soru
                  </span>
                </div>

                {/* Label */}
                <h2 className="text-lg font-semibold text-white mb-1.5 group-hover:text-amber-300 transition-colors">
                  {cat.label ?? cat.slug}
                </h2>

                {/* Description */}
                {cat.description && (
                  <p className="text-sm text-white/50 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
