// components/QuestionListClient.tsx
// TÜM kategori sayfalarında paylaşılan soru listesi client component.
// 📌 CSV-FIRST: GitHub'daki public CSV'yi jsDelivr CDN üzerinden çeker.
// Backend DB yavaş deploy olur / cache'li kalır — CSV ise push ile anında güncellenir.
// DB endpoint'i sadece CSV fetch başarısız olursa fallback olarak kullanılır.

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";

// jsDelivr CDN — GitHub raw yerine tercih edilir (daha hızlı, content-type: text/csv)
// @main branch = main, @v1 / @commit-sha = pinned (cache'lenebilir)
// Fallback: backend /api/v2/questions/all (eski davranış)
const CSV_PRIMARY = "https://raw.githubusercontent.com/kaleminkuheylani/pymulakat-backend/main/data/QUESTIONS-v3.csv";
const CSV_FALLBACK = "https://cdn.jsdelivr.net/gh/kaleminkuheylani/pymulakat-backend@main/data/QUESTIONS-v3.csv";

export interface QuestionListClientProps {
  /** Filtrelenecek kategori (örn. "python-basics", "dynamic-programming") */
  category: string;
  /** URL'de gösterilecek kategori slug'ı (örn. "python-temelleri") */
  urlSlug: string;
  /** Kartlarda gösterilecek kategori label'ı (örn. "python-temelleri") */
  displaySlug?: string;
  /** Skeleton sayısı (yüklenirken) */
  skeletonCount?: number;
}

interface Question {
  id: number;
  title: string;
  slug?: string;
  category: string;
  level: string;
  description: string;
  complexity?: string;
  function_name?: string;
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

// ─── Title → URL-safe slug ────────────────────────────────
// Server-side csvSource.ts ile aynı kural seti — DRY için paylaşılabilir,
// ama burada kısa bir kopyası (build'de tree-shake eder).
function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ü/g, "u").replace(/ö/g, "o")
    .replace(/ş/g, "s").replace(/ç/g, "c").replace(/ğ/g, "g")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── CSV Parser (RFC 4180 mini) ──────────────────────────────
// 9 kolon CSV: category,title,level,description,starter_code,test_cases,hints,id,function_name
function parseCSV(text: string): Question[] {
  const rows: string[][] = [];
  let current: string[] = [];
  let cell = "";
  let inQuote = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuote) {
      if (c === '"') {
        // Çift tırnak escape: ""
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuote = false;
        }
      } else {
        cell += c;
      }
    } else {
      if (c === '"') {
        inQuote = true;
      } else if (c === ",") {
        current.push(cell);
        cell = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        current.push(cell);
        cell = "";
        if (current.length > 1 || current[0] !== "") rows.push(current);
        current = [];
      } else {
        cell += c;
      }
    }
  }
  if (cell || current.length) {
    current.push(cell);
    rows.push(current);
  }

  if (rows.length < 2) return [];
  const header = rows[0];
  const idx = (name: string) => header.indexOf(name);

  return rows
    .slice(1)
    .map((cols) => {
      const get = (k: string) => cols[idx(k)] || "";
      return {
        id: parseInt(get("id"), 10) || 0,
        title: get("title"),
        category: get("category"),
        level: get("level") || "beginner",
        description: get("description"),
        function_name: get("function_name") || undefined,
      };
    })
    .filter((q) => q.id > 0 && q.title);
}

type FetchSource = "csv" | "csv-fallback" | "db";

async function fetchCSV(): Promise<{ items: Question[]; source: FetchSource }> {
  const errors: string[] = [];
  // 1) raw GitHub (primary, Vercel fetch'i en güvenilir bu)
  for (const url of [CSV_PRIMARY, CSV_FALLBACK]) {
    try {
      const r = await fetch(url, { cache: "no-store" });
      if (r.ok) {
        const text = await r.text();
        const parsed = parseCSV(text);
        if (parsed.length > 0) {
          return {
            items: parsed,
            source: url === CSV_PRIMARY ? "csv" : "csv-fallback",
          };
        }
      } else {
        errors.push(`${url}: HTTP ${r.status}`);
      }
    } catch (e: any) {
      errors.push(`${url}: ${e?.message || "fetch error"}`);
    }
  }

  // 2) Backend DB fallback
  try {
    const r = await fetch(`${API_BASE}/api/v2/questions/all`, { cache: "no-store" });
    if (r.ok) {
      const data: QuestionsResponse | Question[] = await r.json();
      return {
        items: Array.isArray(data) ? data : data?.data || [],
        source: "db",
      };
    }
    errors.push(`backend: HTTP ${r.status}`);
  } catch (e: any) {
    errors.push(`backend: ${e?.message || "fetch error"}`);
  }

  throw new Error(errors.join("; "));
}

export default function QuestionListClient({
  category,
  urlSlug,
  displaySlug,
  skeletonCount = 6,
}: QuestionListClientProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"csv" | "db" | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    fetchCSV()
      .then((result) => {
        if (cancelled) return;
        setSource(result.source);
        const filtered = result.items.filter((q) => q.category === category);
        setQuestions(filtered);
      })
      .catch((err) => {
        if (cancelled || err?.name === "AbortError") return;
        console.warn(`[QuestionListClient:${category}] fetch error:`, err);
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
  }, [category]);

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
        <div className="text-5xl mb-4">⚠️</div>
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
          <span className="text-white font-semibold">{questions.length}</span> soru listeleniyor
        </div>
        {source && (
          <div className="text-[10px] uppercase tracking-wider text-white/30 font-mono">
            {source === "csv" ? "📄 CSV (GitHub)" : "🗄️ DB fallback"}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {questions.map((q) => {
          const lvl = (q.level || "beginner").toLowerCase();
          // Slug-URL tercih edilir: /interviews/[category]/[slug]
          // Title yoksa ID'ye fallback.
          const slug = q.title ? slugifyTitle(q.title) : null;
          const href = slug
            ? `/interviews/${q.category}/${slug}`
            : `/interviews/${q.category}/${q.id}`;
          return (
            <Link
              key={q.id}
              href={href}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/20 transition-all overflow-hidden"
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

                <h3 className="text-lg font-bold mb-2 group-hover:text-amber-400 transition-colors">
                  {q.title}
                </h3>

                <p className="text-sm text-white/50 line-clamp-3 min-h-[3.5rem]">
                  {q.description}
                </p>

                {q.function_name && (
                  <div className="mt-3 text-xs text-white/40 font-mono">
                    <span className="text-indigo-300">def</span> {q.function_name}(...)
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-3 mt-2 border-t border-white/5">
                  <span className="text-white/40 font-mono">{displaySlug || q.category}</span>
                  <span
                    className="flex items-center gap-1.5 transition-colors group-hover:text-amber-400"
                    style={{ color: DEFAULT_ACCENT }}
                  >
                    <span>Çöz</span>
                    <svg
                      className="w-3 h-3 transition-transform group-hover:translate-x-1"
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
