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

// 📌 Renk/ikon hardcoded yok — backend'ten gelen icon emoji kullanılıyor.
// Tek ortak gradient (indigo → amber) tüm kategorilerde tutarlı görünüm sağlar.
const DEFAULT_GRADIENT_FROM = "#6366f1";
const DEFAULT_GRADIENT_TO = "#f59e0b";
const DEFAULT_ACCENT = "#fbbf24";

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
          </div>
        </div>
      </header>

      {/* ─── ACİL #3: HIZLI HEDEF KEŞFİ (Internal Linkleme) ─── */}
      <section className="max-w-6xl mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/python-algoritma-sorulari"
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/[0.07] via-amber-500/[0.05] to-transparent p-5 hover:border-amber-400/40 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center text-2xl flex-shrink-0">
                ⚡
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  Python Algoritma Soruları
                </h2>
                <p className="text-sm text-white/50 mt-0.5">
                  Sıralama, arama, DP, graf ve string algoritmaları — 26+ interaktif soru.
                </p>
              </div>
              <span className="text-amber-400 text-xl group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
          <Link
            href="/python-dinamik-programlama"
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/[0.07] via-indigo-500/[0.05] to-transparent p-5 hover:border-indigo-400/40 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-500 flex items-center justify-center text-2xl flex-shrink-0">
                🧠
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  Python Dinamik Programlama
                </h2>
                <p className="text-sm text-white/50 mt-0.5">
                  Fibonacci, Knapsack, Edit Distance, LCS — 12+ klasik DP sorusu.
                </p>
              </div>
              <span className="text-indigo-400 text-xl group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>
      </section>

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
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                        style={{
                          background: `linear-gradient(135deg, ${DEFAULT_GRADIENT_FROM}30, ${DEFAULT_GRADIENT_TO}30)`,
                          border: `1px solid ${DEFAULT_ACCENT}50`,
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
                        style={{ color: DEFAULT_ACCENT }}
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