// WorkspaceProgress — kullanıcının bu sorudaki ilerlemesi
// Sol sidebar üstünde gösterilir: en iyi deneme + başarı durumu

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { questionsAPI, BestAttempt } from "../../../../../api/v2/questions";

interface ProgressProps {
  questionId: number;
  isGuest: boolean;
  userReady: boolean;
}

export default function WorkspaceProgress({ questionId, isGuest, userReady }: ProgressProps) {
  const [bestAttempt, setBestAttempt] = useState<BestAttempt | null>(null);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isGuest || !userReady) return;

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const progress = await questionsAPI.getProgress(questionId);
        if (cancelled) return;
        setBestAttempt(progress.best_attempt);
        setTotalAttempts(progress.total_attempts);
      } catch {
        // sessizce ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [questionId, isGuest, userReady]);

  // Misafir kullanıcı için login CTA
  if (isGuest) {
    return (
      <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <div className="text-[10px] uppercase tracking-wider text-amber-300 mb-1.5">
          İlerleme
        </div>
        <p className="text-xs text-amber-200/80 leading-relaxed">
          İlerlemeni kaydetmek ve rozet kazanmak için{" "}
          <a
            href={`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`}
            className="underline font-semibold text-amber-300 hover:text-amber-200"
          >
            giriş yap
          </a>.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-3 rounded-lg bg-white/5 border border-white/10 animate-pulse">
        <div className="h-3 bg-white/10 rounded mb-2 w-1/2" />
        <div className="h-2 bg-white/10 rounded w-full" />
      </div>
    );
  }

  if (!bestAttempt) {
    return (
      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
        <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1.5">
          İlerleme
        </div>
        <p className="text-xs text-white/60">
          Henüz deneme yapmadın. Hadi başlayalım!
        </p>
      </div>
    );
  }

  const success = bestAttempt.success;
  const ratio = bestAttempt.total_tests > 0
    ? Math.round((bestAttempt.passed_tests / bestAttempt.total_tests) * 100)
    : 0;

  return (
    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase tracking-wider text-white/40">
          En İyi Deneme
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            success
              ? "bg-green-500/20 text-green-400"
              : "bg-amber-500/20 text-amber-400"
          }`}
        >
          {success ? "✓ Çözüldü" : "Yarım"}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full transition-all ${
            success
              ? "bg-gradient-to-r from-green-500 to-emerald-400"
              : "bg-gradient-to-r from-amber-500 to-orange-400"
          }`}
          style={{ width: `${ratio}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px]">
        <span className="text-white/60 font-mono">
          {bestAttempt.passed_tests}/{bestAttempt.total_tests} test
        </span>
        <span className="text-white/40 font-mono">
          {bestAttempt.execution_time_ms}ms
        </span>
      </div>

      {totalAttempts > 1 && (
        <Link
          href="/profile"
          className="mt-2 text-[11px] text-indigo-300 hover:text-indigo-200 transition-colors block"
        >
          {totalAttempts} deneme yapıldı → profilini gör
        </Link>
      )}
    </div>
  );
}