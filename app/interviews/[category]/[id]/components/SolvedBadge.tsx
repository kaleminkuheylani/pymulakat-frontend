// SolvedBadge — kullanıcının bu soruyu çözüp çözmediğini gösterir
// Question detail page'de (server component'in altında) çağrılır

"use client";

import { useEffect, useState } from "react";
import { questionsAPI, BestAttempt } from "../../../../../api/v2/questions";
import { useUser } from "../../../../../hooks/useUser";

export default function SolvedBadge({ questionId }: { questionId: number }) {
  const { user, loading: userLoading } = useUser();
  const [bestAttempt, setBestAttempt] = useState<BestAttempt | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      setBestAttempt(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const progress = await questionsAPI.getProgress(questionId);
        if (cancelled) return;
        setBestAttempt(progress.best_attempt);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [questionId, user, userLoading]);

  // Misafir → gösterme
  if (userLoading || !user) return null;

  // Loading state
  if (loading) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/5 border border-white/10 text-white/40 animate-pulse">
        <span className="w-2 h-2 bg-white/30 rounded-full" />
        Yükleniyor...
      </div>
    );
  }

  // Hiç deneme yok
  if (!bestAttempt) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/5 border border-white/10 text-white/50">
        <span className="w-2 h-2 bg-white/30 rounded-full" />
        Çözülmedi
      </div>
    );
  }

  const success = bestAttempt.success;
  const ratio = bestAttempt.total_tests > 0
    ? Math.round((bestAttempt.passed_tests / bestAttempt.total_tests) * 100)
    : 0;

  if (success) {
    return (
      <div
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-green-500/15 border border-green-500/30 text-green-300"
        title={`${bestAttempt.passed_tests}/${bestAttempt.total_tests} test geçti`}
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Çözüldü · {ratio}%
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300"
      title={`${bestAttempt.passed_tests}/${bestAttempt.total_tests} test geçti`}
    >
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M10 6v4" />
      </svg>
      Yarım · {ratio}%
    </div>
  );
}