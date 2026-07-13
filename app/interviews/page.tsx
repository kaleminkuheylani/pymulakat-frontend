// app/interviews/page.tsx
//
// 8 KATEGORİ LİSTESİ — DB-FIRST (kullanici direktifi 2026-07-13).
//
// Her şey DB'den gelir:
//   - label, description, count → /api/v2/categories
//   - icon → DB emoji'den lucide mapping (lib/icons.ts CATEGORY_ICONS)
//   - level → DB level agregat (en düşük level)
//
// Queue kategorisi KALDIRILDI (DB'de 0 soru, kategori yok).
// 8 kategori: python-basics, data-structures, list-dict, pandas,
// algorithms, heap, stack, dynamic-programming.
//
// Server component, ISR 1h cache, hardcoded label/description YOK.

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listCategories } from "@/lib/api/questionAPI";
import { CATEGORY_ICONS } from "@/lib/icons";

export const revalidate = 3600; // 1 saat ISR

interface Category {
  slug: string;
  label: string;
  description: string;
  question_count: number;
  level: "beginner" | "intermediate" | "advanced";
}

const LEVEL_LABEL: Record<string, string> = {
  beginner: "Başlangıç",
  intermediate: "Orta",
  advanced: "İleri",
};

const LEVEL_STYLE: Record<string, string> = {
  beginner: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  intermediate: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  advanced: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

async function fetchCategoriesFromDB(): Promise<Category[]> {
  try {
    const items = await listCategories();
    const filtered = items.filter((c) => c.slug !== "queue" && !!c.slug);
    return filtered.map((c) => {
      // Backend su anda level dondurmuyor, default beginner
      const level: Category["level"] = "beginner";
      return {
        slug: c.slug as string,
        label: c.label ?? c.slug ?? "",
        description: c.description ?? "",
        question_count: c.question_count ?? 0,
        level,
      };
    });
  } catch (e) {
    console.error("[interviews] listCategories hatasi:", e);
    return [];
  }
}

export default async function InterviewsListPage() {
  const categories = await fetchCategoriesFromDB();

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* ─── Header ─────────────────────────────────────── */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Python Mülakat Soruları
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl">
            Seviyene uygun kategoriyi seç, tarayıcıda kod yaz, anında test et.
            Tüm kategoriler DB'den beslenir — yeni soru eklendikçe otomatik görünür.
          </p>
        </header>

        {/* ─── 8 Kategori grid ────────────────────────────── */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => {
            const Icon = CATEGORY_ICONS[c.slug] ?? CATEGORY_ICONS["python-basics"];
            return (
              <li key={c.slug}>
                <Link
                  href={`/interviews/${c.slug}`}
                  className="block bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:bg-white/[0.06] hover:border-white/20 transition-colors h-full"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border font-semibold tracking-wider uppercase ${
                        LEVEL_STYLE[c.level] ?? LEVEL_STYLE.beginner
                      }`}
                    >
                      {LEVEL_LABEL[c.level] ?? c.level}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-white mb-2">
                    {c.label}
                  </h2>
                  <p className="text-sm text-white/50 line-clamp-2 mb-4 min-h-[2.5rem]">
                    {c.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/40">{c.question_count} soru</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ─── Footer notu ────────────────────────────────── */}
        <p className="mt-10 text-center text-xs text-white/40">
          8 kategori, toplam {categories.reduce((s, c) => s + c.question_count, 0)} soru
        </p>
      </div>
    </main>
  );
}
