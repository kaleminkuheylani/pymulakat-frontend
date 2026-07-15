// app/interviews/page.tsx
//
// TÜM SORULAR — Tek liste + kategori filtreleme.
//
// /interviews → tüm 85+ soru, DB'den (kullanici direktifi 2026-07-13).
//   - Kategori filtresi: butonlar (8 kategori)
//   - Default: tümü
//   - Tıklanan kategori: sadece o kategorinin soruları
//   - URL: ?category=python-basics (deep linking)
//   - DB-FIRST: server-side fetch, ISR 1h cache
//   - 8 kategori (queue kaldirildi)
//
// Mimari:
//   - Server component (initial HTML dolu, JS yok calissin)
//   - Soru kartlari /interviews/{db_cat}/{slug} link
//   - Client component (FilterButtons): kategori state + URL sync
//   - DB'den soru + label + description + count

import Link from "next/link";
import { getAllCategories } from "@/lib/api/categoryAPI";
import { getAllQuestions } from "@/lib/api/questionAPI";
import type { ApiQuestion } from "@/lib/api/types";
import FilterButtons from "./FilterButtons";
import QuestionListItem from "@/components/QuestionListItem";

export const revalidate = 60; // 2026-07-15: gecici 1dk ISR (cache sifirlama sonrasi 3600 dondurulecek)

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function InterviewsListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeCategory = params.category ?? "all";

  // DB'den tüm kategoriler (8 kategori, queue yok)
  const allCategories = await getAllCategories();
  const categories = allCategories.filter((c) => c.slug !== "queue");

  // 2026-07-15 debug: server-side fetch kontrol (Vercel log'da gorulecek)
  const _apiBase = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "fallback-railway";
  console.log(`[interviews/page] activeCategory=${activeCategory} apiBase=${_apiBase} catCount=${categories.length}`);
  // DB'den tüm sorular (filtre uygulanacak)
  const allQuestions: ApiQuestion[] =
    activeCategory === "all"
      ? await getAllQuestions({ limit: 500 })
      : await getAllQuestions({ category: activeCategory, limit: 500 });
  console.log(`[interviews/page] allQuestions.length=${allQuestions.length} activeCategory=${activeCategory}`);

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* ─── Header ─────────────────────────────────────── */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Python Mülakat Soruları
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl">
            {activeCategory === "all"
              ? "Tüm kategorilerdeki Python mülakat soruları. Filtre ile daraltabilirsin."
              : categories.find((c) => c.slug === activeCategory)?.description ||
                "Filtrelenmiş sorular."}
          </p>
          <div className="mt-3 text-sm text-white/50">
            {allQuestions.length} soru gösteriliyor
            {activeCategory !== "all" && (
              <>
                {" · "}
                <Link
                  href="/interviews"
                  className="text-amber-400 hover:text-amber-300 underline-offset-2 hover:underline"
                >
                  Filtreyi temizle
                </Link>
              </>
            )}
          </div>
        </header>

        {/* ─── Filtre butonlari (client component) ───────── */}
        <FilterButtons
          categories={categories.map((c) => ({
            slug: c.slug,
            label: c.label ?? c.slug,
            count: c.question_count,
          }))}
          active={activeCategory}
        />

        {/* ─── Soru listesi (DB'den, paylaşılan component) ─── */}
        <ul className="space-y-3 mt-6" data-ssr-interviews-list>
          {allQuestions.length === 0 ? (
            <li className="text-white/50 text-sm py-8 text-center">
              {activeCategory === "all"
                ? "Henüz soru yok."
                : "Bu kategoride henüz soru yok."}
            </li>
          ) : (
            allQuestions.map((q) => (
              <QuestionListItem
                key={q.id}
                question={q}
                categorySlug={q.category}
                categoryLabel={categories.find((c) => c.slug === q.category)?.label ?? q.category}
              />
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
