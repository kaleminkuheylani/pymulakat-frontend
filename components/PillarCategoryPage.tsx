// components/PillarCategoryPage.tsx
// 9 pillar sayfanin ortak component'i.
//
// Her pillar (9 ayri route) ayni sablonu kullanir:
//   - DB-FIRST: meta (label, description, count) DB'den
//   - Soru listesi DB'den
//   - Breadcrumb (DB label)
//   - Ayni kart tasarimi
//
// Pillar route'lari:
//   /python-temelleri           → python-basics
//   /veri-yapilari              → data-structures
//   /liste-sozluk               → list-dict
//   /pandas                     → pandas
//   /algoritma-sorulari         → algorithms
//   /heap                       → heap
//   /stack                      → stack
//   /dinamik-programlama        → dynamic-programming
//   /queue                      → queue (yakinda, 0 soru)

import { notFound } from "next/navigation";
import Link from "next/link";
import { Code2 } from "lucide-react";
import { getCategoryMeta } from "@/lib/api/categoryAPI";
import { getAllQuestions } from "@/lib/api/questionAPI";
import type { ApiQuestion } from "@/lib/api/types";

interface PillarProps {
  displaySlug: string; // URL'de gorunen (ornek: "python-temelleri")
  dbCategory: string;  // DB'deki category (ornek: "python-basics")
}

export async function PillarCategoryPage({ displaySlug, dbCategory }: PillarProps) {
  // DB'den kategori meta (kullanici direktifi: hardcoded YOK)
  const meta = await getCategoryMeta(dbCategory);
  if (!meta) {
    notFound();
  }

  // DB'den soru listesi
  const allQuestions: ApiQuestion[] = await getAllQuestions({ category: dbCategory, limit: 200 });

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* ─── Breadcrumb (DB label, semantik ol/li) ─── */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm">
          <ol className="flex flex-wrap items-center gap-1 text-white/60">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Ana Sayfa
              </Link>
            </li>
            <li className="text-white/30">/</li>
            <li>
              <Link href={`/${displaySlug}`} className="hover:text-white transition-colors">
                {meta.label}
              </Link>
            </li>
            <li className="text-white/30">/</li>
            <li>
              <strong className="text-white font-medium">Sorular</strong>
            </li>
          </ol>
        </nav>

        {/* ─── Hero ───────────────────────────────────── */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{meta.label} Soruları</h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl">
            {meta.description || `${meta.label} konusunda Python mülakat soruları ve çözümleri.`}
          </p>
          <div className="mt-3 text-sm text-white/50">
            {allQuestions.length} soru · Tarayıcıda çöz, otomatik test et
          </div>
        </header>

        {/* ─── Soru listesi (DB'den) ──────────────────── */}
        <ul className="space-y-3">
          {allQuestions.length === 0 ? (
            <li className="text-white/50 text-sm py-8 text-center">
              Bu kategoride henüz soru yok.
            </li>
          ) : (
            allQuestions.map((q) => (
              <li key={q.id}>
                <Link
                  href={`/interviews/${dbCategory}/${q.slug}`}
                  className="block bg-white/[0.03] border border-white/10 rounded-lg p-4 hover:bg-white/[0.06] hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Code2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <h2 className="text-base font-semibold text-white truncate">
                          {q.title}
                        </h2>
                      </div>
                      <p className="text-xs text-white/50 line-clamp-2">
                        {q.description?.split("\n")[0] || "Soru açıklaması"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/60 uppercase tracking-wider">
                          {q.level}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
