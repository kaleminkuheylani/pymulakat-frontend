// /python-algoritma-sorulari/AlgorithmQuestionList.tsx
// Client component — backend'ten algorithms + dynamic-programming kategorisindeki soruları çeker.

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";

interface Question {
  id: number;
  title: string;
  category: string;
  level: string;
  description: string;
  complexity?: string;
  tags?: string[];
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

export default function AlgorithmQuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    fetch(`${API_BASE}/api/v2/questions/all`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: QuestionsResponse | Question[]) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        // algorithms + dynamic-programming kategorilerindeki sorular
        const filtered = list.filter(
          (q) => q.category === "algorithms" || q.category === "dynamic-programming"
        );
        setQuestions(filtered);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.warn("[AlgorithmQuestionList] fetch error:", err);
          setError(err.message || "Sorular yüklenemedi");
        }
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(9)].map((_, i) => (
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
          Backend&apos;e bağlanılamadı ({error}). Birkaç saniye sonra tekrar deneyebilirsin.
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
        <h2 className="text-xl font-semibold mb-2">Henüz algoritma sorusu yok</h2>
        <p className="text-white/50 text-sm">Backend&apos;e eklenen sorular burada listelenir.</p>
      </div>
    );
  }

  return (
    <>
      <div className="text-sm text-white/50 mb-4">
        <span className="text-white font-semibold">{questions.length}</span> Python algoritma sorusu listeleniyor
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {questions.map((q) => {
          const lvl = (q.level || "beginner").toLowerCase();
          return (
            <Link
              key={q.id}
              href={`/interviews/${q.category}/${q.id}`}
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
                  <span className="text-white/40 font-mono">
                    {q.category === "dynamic-programming" ? "dinamik-programlama" : q.category}
                  </span>
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
