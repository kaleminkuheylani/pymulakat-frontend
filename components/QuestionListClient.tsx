"use client";

// components/QuestionListClient.tsx
// TÜM kategori sayfalarında paylaşılan soru listesi client component.
// 📌 DB-FIRST mimari: Soruları backend API'den çeker (DB = tek kaynak).
// CSV sadece seed/migration aracı (fallback değil).


import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { listQuestionsByCategory } from "@/lib/api/questionAPI";

export interface QuestionListClientProps {
  /** Filtrelenecek kategori (örn. "programlama-temelleri", "dynamic-programming") */
  category: string;
  /** Çoklu kategori (yeni: birleşik liste için) — filter'ı genişletir */
  categories?: string[];
  /** URL'de gösterilecek kategori slug'ı (örn. "python-temelleri") */
  urlSlug: string;
  /** Kartlarda gösterilecek kategori label'ı (örn. "python-temelleri") */
  displaySlug?: string;
  /** Skeleton sayısı (yüklenirken) */
  skeletonCount?: number;
  /**
   * SSR için server tarafında CSV'den çekilmiş initial sorular.
   * CSV-FIRST mimari: ilk HTML'e (no-JS / Googlebot) soruları basar.
   * Prop verilirse useEffect'in ilk fetch'i skip edilir.
   */
  initialQuestions?: Question[];
  /** initialQuestions'un kaynağı (debug/SEO için) */
  initialSource?: "primary" | "fallback";
}

interface Question {
  id: number;
  title: string;
  slug?: string | null;
  category: string;
  level: string;
  description: string;
  complexity?: string | null;
  function_name?: string | null;
}

interface QuestionsResponse {
  data: Question[];
}

const LEVEL_COLORS: Record<string, string> = {
  beginner: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
  intermediate: "bg-amber-500/10 border-amber-500/30 text-amber-300",
  advanced: "bg-rose-500/10 border-rose-500/30 text-rose-300",
};

const DEFAULT_GRADIENT_FROM = "#6366f1";
const DEFAULT_GRADIENT_TO = "#f59e0b";
const DEFAULT_ACCENT = "#fbbf24";


// ─── CSV Parser (RFC 4180 mini) ──────────────────────────────
// 9 kolon CSV: category,title,level,description,starter_code,test_cases,hints,id,function_name
// parseCSV kaldırıldı (artık DB'den API ile çekiliyor)


type FetchSource = "api";

// DB-FIRST mimari: Soruları backend API'den çek (DB = tek kaynak).
// CSV sadece seed/migration aracı, runtime'da kullanılmaz.
// Hata durumunda exception fırlatır (caller handle eder).
async function fetchQuestionsFromAPI(
  cats: string[],
): Promise<{ items: Question[]; source: string }> {
  const results = await Promise.all(cats.map((c) => listQuestionsByCategory(c)));
  const items = results.flat();
  if (items.length === 0) {
    throw new Error("API'den soru yüklenemedi (boş sonuç)");
  }
  return { items, source: "api" };
}

export default function QuestionListClient({
  category,
  categories,
  urlSlug,
  displaySlug,
  skeletonCount = 6,
  initialQuestions,
  initialSource,
}: QuestionListClientProps) {
  // CSV-FIRST: initial veri varsa direkt kullan, ilk render'da sorular görünür.
  // Boş array ([]) ile başlatmak loading flash'a yol açar, undefined ile başlat
  // "henüz fetch edilmedi" demek.
  const [questions, setQuestions] = useState<Question[]>(initialQuestions ?? []);
  const [loading, setLoading] = useState<boolean>(initialQuestions === undefined);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(initialSource ?? null);

  useEffect(() => {
    // Initial veri zaten varsa (SSR'dan geldi) tekrar fetch etme.
    if (initialQuestions !== undefined) return;
    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const cats = categories && categories.length > 0 ? categories : [category];
    fetchQuestionsFromAPI(cats)
      .then((result) => {
        if (cancelled) return;
        setSource(result.source);
        const filterSet = categories && categories.length > 0 ? new Set(categories) : null;
        // ApiQuestion → Question dönüşümü (slug: null → undefined)
        const mapped: Question[] = result.items.map((q) => ({
          id: q.id,
          title: q.title,
          slug: q.slug ?? undefined,
          category: q.category,
          level: q.level,
          description: q.description,
          complexity: q.complexity ?? undefined,
          function_name: q.function_name ?? undefined,
        }));
        const filtered = filterSet
          ? mapped.filter((q) => filterSet.has(q.category))
          : mapped.filter((q) => q.category === category);
        setQuestions(filtered);
      })
      .catch((err: any) => {
        if (cancelled || err?.name === "AbortError") return;;
        setError(err?.message || "Sorular yüklenemedi");
      })
      .finally(() => {
        if (cancelled) return;
        clearTimeout(timeoutId);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [category, categories ? categories.join(',') : '']);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(skeletonCount)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 h-44 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Sorular yüklenemedi</h2>
        <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
          CSV ve backend&apos;e bağlanılamadı ({error}). Birkaç saniye sonra tekrar deneyebilirsin.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
        <div className="text-5xl mb-4">📭</div>
        <h2 className="text-xl font-semibold mb-2">Bu kategoride henüz soru yok</h2>
        <p className="text-white/50 text-sm">CSV&apos;ye eklenen sorular burada listelenir.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-white/50">
          {questions.length} soru listeleniyor
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {questions.map((q) => {
          const lvl = (q.level || "beginner").toLowerCase();
          // Slug-URL tercih edilir: /interviews/[category]/[slug]
          // Title yoksa ID'ye fallback.
          const slug = q.slug ?? "";
          const href = slug
            ? `/interviews/${q.category}/${slug}`
            : `/interviews/${q.category}/${q.id}`;
          return (
            <Link
              key={q.id}
              href={href}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/20 transition-colors overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${DEFAULT_GRADIENT_FROM}, ${DEFAULT_GRADIENT_TO})`,
                }}
              />
              <div
                className="absolute top-0 left-0 right-0 h-0.5 opacity-50 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(90deg, ${DEFAULT_GRADIENT_FROM}, ${DEFAULT_GRADIENT_TO})`,
                }}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${
                      LEVEL_COLORS[lvl] || LEVEL_COLORS.beginner
                    }`}
                  >
                    {q.level}
                  </span>
                  {q.complexity && (
                    <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">
                      {q.complexity}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold mb-2 ">
                  {q.title}
                </h3>

                <p className="text-sm text-white/50 line-clamp-3 min-h-[3.5rem]">
                  {q.description}
                </p>

                {q.function_name && (
                  <div className="mt-3 text-xs text-white/40 font-mono">
                    def {q.function_name}(...)
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-3 mt-2 border-t border-white/5">
                  {displaySlug || q.category}
                  <span
                    className="flex items-center gap-1.5 text-white/50"
                    style={{ color: DEFAULT_ACCENT }}
                  >
                    Çöz
                    <svg
                      className="w-3 h-3 "
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

// EOF


// ─── Title → URL-safe slug (CSV'de slug kolonu varsa kullan, yoksa fallback) ──
const trMap: Record<string, string> = {
  "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u",
  "Ç": "c", "Ğ": "g", "İ": "i", "Ö": "o", "Ş": "s", "Ü": "u",
};
function slugifyTitleLocal(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (c) => trMap[c] || c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
