// app/interviews/page.tsx
// TÜM KATEGORİLERİN LİSTESİ — Kategori kartları sayfası
// Client component: server-side fetch hatalarını önler, build sırasında API çağırmaz

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Backend URL — env tanımlıysa onu kullan, yoksa default Railway
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";

interface Category {
  slug: string;
  label: string;
  description?: string;
  icon?: string;
  question_count: number;
}

interface CategoriesResponse {
  data: Category[];
}

// Kategori renkleri (gradient) — backend ile aynı
const CATEGORY_STYLES: Record<string, { from: string; to: string; accent: string }> = {
  "python-basics": { from: "#3b82f6", to: "#1e40af", accent: "#60a5fa" },
  strings: { from: "#a855f7", to: "#7e22ce", accent: "#c084fc" },
  "list-dict": { from: "#f59e0b", to: "#b45309", accent: "#fbbf24" },
  pandas: { from: "#10b981", to: "#047857", accent: "#34d399" },
  algorithms: { from: "#ef4444", to: "#b91c1c", accent: "#f87171" },
  oop: { from: "#8b5cf6", to: "#6d28d9", accent: "#a78bfa" },
  "data-types": { from: "#06b6d4", to: "#0e7490", accent: "#22d3ee" },
  "simple-apps": { from: "#84cc16", to: "#4d7c0f", accent: "#a3e635" },
  "beyin-firtinasi": { from: "#eab308", to: "#a16207", accent: "#facc15" },
  sqlite3: { from: "#64748b", to: "#334155", accent: "#94a3b8" },
  numpy: { from: "#0ea5e9", to: "#0369a1", accent: "#38bdf8" },
  sklearn: { from: "#ec4899", to: "#9d174d", accent: "#f472b6" },
  scipy: { from: "#14b8a6", to: "#0f766e", accent: "#2dd4bf" },
  matplotlib: { from: "#f43f5e", to: "#9f1239", accent: "#fb7185" },
  seaborn: { from: "#22c55e", to: "#15803d", accent: "#4ade80" },
  statsmodels: { from: "#6366f1", to: "#3730a3", accent: "#818cf8" },
  nltk: { from: "#d946ef", to: "#86198f", accent: "#e879f9" },
  dask: { from: "#facc15", to: "#ca8a04", accent: "#fde047" },
  pytorch: { from: "#fb923c", to: "#c2410c", accent: "#fdba74" },
};

function getCategoryStyle(slug: string) {
  return CATEGORY_STYLES[slug] || { from: "#6366f1", to: "#4338ca", accent: "#818cf8" };
}

export default function InterviewsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchCategories = () => {
      setLoading(true);
      setError(null);

      const timeoutId = setTimeout(() => controller.abort(), 8000);

      fetch(`${API_BASE}/api/v2/categories`, {
        cache: "no-store",
        signal: controller.signal,
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data: CategoriesResponse | Category[]) => {
          if (Array.isArray(data)) {
            setCategories(data);
          } else if (data && Array.isArray(data.data)) {
            setCategories(data.data);
          } else {
            setCategories([]);
          }
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.warn("[InterviewsPage] fetch error:", err);
            setError(err.message || "Kategoriler yüklenemedi");
          }
        })
        .finally(() => {
          clearTimeout(timeoutId);
          setLoading(false);
        });
    };

    fetchCategories();

    return () => controller.abort();
  }, []);

  const totalQuestions = categories.reduce((sum, c) => sum + (c.question_count || 0), 0);
  const totalCategories = categories.length;

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* ─── HEADER ──────────────────────────────────────── */}
      <header className="bg-[#0a0e1a]/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-3 transition-colors"
          >
            ← Ana Sayfa
          </Link>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Tüm Kategoriler</h1>
              <p className="text-white/60 text-base">
                Seviyene uygun bir kategori seç ve Python pratiği yap.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <span className="text-white/40">Kategori: </span>
                <span className="text-white font-semibold">{totalCategories}</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <span className="text-white/40">Soru: </span>
                <span className="text-white font-semibold">{totalQuestions}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/python-online"
                className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-semibold transition-colors"
              >
                🧪 Online Editör
              </Link>
              <Link
                href="/python-egitimi"
                className="px-3 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 text-xs font-semibold transition-colors"
              >
                🎓 Eğitim
              </Link>
              <Link
                href="/python-kodlari"
                className="px-3 py-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 text-xs font-semibold transition-colors"
              >
                💻 Kodlar
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ─── KATEGORİ KARTLARI ──────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 h-44 animate-pulse"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <div className="text-5xl mb-4">{error ? "⚠️" : "📭"}</div>
            <h2 className="text-xl font-semibold mb-2">
              {error ? "Kategoriler yüklenemedi" : "Henüz kategori yok"}
            </h2>
            <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
              {error ? (
                <>
                  Backend'e bağlanılamadı ({error}). Birkaç saniye sonra tekrar deneyebilirsin.
                </>
              ) : (
                "Backend'de henüz kategori yok. Biraz sonra tekrar dene."
              )}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => {
              const style = getCategoryStyle(cat.slug);
              const count = cat.question_count || 0;
              return (
                <Link
                  key={cat.slug}
                  href={`/interviews/${cat.slug}`}
                  className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/20 transition-all overflow-hidden"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity"
                    style={{
                      background: `linear-gradient(135deg, ${style.from}, ${style.to})`,
                    }}
                  />
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 opacity-50 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: `linear-gradient(90deg, ${style.from}, ${style.to})`,
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                        style={{
                          background: `linear-gradient(135deg, ${style.from}30, ${style.to}30)`,
                          border: `1px solid ${style.accent}50`,
                        }}
                      >
                        {cat.icon || "📘"}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-bold text-white">{count}</span>
                        <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">
                          soru
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-2 group-hover:text-amber-400 transition-colors">
                      {cat.label}
                    </h3>

                    {cat.description && (
                      <p className="text-sm text-white/50 line-clamp-2 mb-4 min-h-[2.5rem]">
                        {cat.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs pt-3">
                      <span className="text-white/40 font-mono">{cat.slug}</span>
                      <span
                        className="flex items-center gap-1.5 transition-colors group-hover:text-amber-400"
                        style={{ color: style.accent }}
                      >
                        <span>Keşfet</span>
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
        )}

        {!loading && categories.length > 0 && (
          <div className="mt-12 text-center text-xs text-white/40">
            Toplam <span className="text-white/70 font-semibold">{totalQuestions}</span>{" "}
            soru · <span className="text-white/70 font-semibold">{totalCategories}</span>{" "}
            kategori
          </div>
        )}
      </main>
    </div>
  );
}