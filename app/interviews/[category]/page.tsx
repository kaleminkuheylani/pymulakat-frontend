// app/interviews/[category]/page.tsx
// Kategori landing page — DB'den soru listesi + DB label.
//
// /interviews/{db_category} → kategori detay sayfası
// (DB'de olmayan kategori 404).
//
// DB-FIRST mimari (kullanici direktifi 2026-07-13):
//   - Label, description, icon → DB (lib/api/categoryAPI.ts)
//   - Soru listesi → DB (lib/api/questionAPI.ts)
//   - Hardcoded label/description YOK

import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight, Code2 } from "lucide-react";
import { getCategoryMeta } from "@/lib/api/categoryAPI";
import { getAllQuestions } from "@/lib/api/questionAPI";
import type { ApiQuestion } from "@/lib/api/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryLandingPage({ params }: PageProps) {
  const { category } = await params;

  // DB'den kategori meta
  const meta = await getCategoryMeta(category);
  if (!meta) {
    notFound();
  }

  // DB'den soru listesi (bu kategoride)
  const allQuestions: ApiQuestion[] = await getAllQuestions({ category, limit: 200 });

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* ─── Breadcrumb (görsel, DB label) ──────────── */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm">
          <ol className="flex flex-wrap items-center gap-1 text-white/60">
            <li className="flex items-center gap-1">
              <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
                <Home className="w-3.5 h-3.5" />
                <span>Ana Sayfa</span>
              </Link>
            </li>
            <li className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-white/30" />
              <Link href="/interviews" className="hover:text-white transition-colors">
                Sorular
              </Link>
            </li>
            <li className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-white/30" />
              <strong className="text-white font-medium">{meta.label}</strong>
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
                  href={`/interviews/${category}/${q.slug}`}
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
