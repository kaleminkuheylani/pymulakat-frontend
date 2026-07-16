// app/interviews/[category]/[slug]/components/workspace/AiFeedbackButton.tsx
//
// 2026-07-14 — Gerçek AI Feedback butonu (DeepSeek V3 arkasında).
// useAiFeedback hook'unu kullanır, durumu UI'a yansıtır.
//
// 4 state:
//   1) Misafir   → "Giriş Yap & AI Feedback Dene" disabled (auth gate)
//   2) Hak bitti  → "Limit doldu" disabled, BYOK CTA'sı
//   3) Loading   → spinner + "Analiz ediliyor..."
//   4) Ready     → "AI Feedback" tıklanabilir, kalan hak badge
//
// Trigger: ilk Run çağrısından sonra enable olur (parent hasRunOnce prop).

"use client";

import { Sparkles, Lock, Loader2, KeyRound, AlertCircle } from "lucide-react";
import { useAiFeedback } from "@/hooks/useAiFeedback";
import { useState } from "react";

interface AiFeedbackButtonProps {
  /** Üye mi? (useUser().user null/undefined ise misafir) */
  isAuthenticated: boolean;
  /** İlk Run çağrıldı mı? (false iken disabled) */
  hasRunOnce: boolean;
  /** Şu anki kod (kullanıcının editördeki hali) */
  code: string;
  /** Soru başlığı (feedback prompt'una eklenir) */
  questionTitle: string;
  /** Soru açıklaması (opsiyonel) */
  questionDescription?: string;
  /** Test sonuçları (son Run'dan) */
  testResults: Array<{ input?: string; expected?: string; actual?: string; passed: boolean; description?: string }>;
  /** 2026-07-16: Hangi dilde yazildi (python/javascript) — AI prompt'unu language-aware yapar */
  language: "python" | "javascript";
  /** Settings modalı aç (BYOK key girişi için) */
  onOpenSettings: () => void;
}

export default function AiFeedbackButton({
  isAuthenticated,
  hasRunOnce,
  code,
  questionTitle,
  questionDescription,
  testResults,
  language,
  onOpenSettings,
}: AiFeedbackButtonProps) {
  const {
    loading,
    error,
    remaining,
    limit,        // 2026-07-14 v12: DB'den
    limitReached,
    requestFeedback,
  } = useAiFeedback();

  const handleClick = async () => {
    if (!isAuthenticated) {
      // Misafir → /login'e yönlendir (returnUrl ile geri)
      const returnUrl = typeof window !== "undefined" ? window.location.pathname : "/";
      window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
      return;
    }
    if (limitReached) {
      onOpenSettings();
      return;
    }
    // 2026-07-16: language eklendi (AI prompt language-aware)
    await requestFeedback({ code, questionTitle, questionDescription, testResults, language });
  };

  // ─── Disabled: misafir (kullanıcıya mesaj ver, tıklanırsa login'e) ───
  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 bg-white/[0.03] border border-white/10 text-white/50 hover:bg-white/[0.06] hover:text-white/70 transition-colors"
        title="AI Geri Bildirim — giriş yap, 5 ücretsiz deneme hakkı kazan"
      >
        <Lock className="w-3.5 h-3.5 text-white/40" />
        <span>AI Feedback</span>
        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/20">
          giriş yap
        </span>
      </button>
    );
  }

  // ─── Disabled: ilk Run hâlâ yapılmamış (hasRunOnce false) ───
  if (!hasRunOnce) {
    return (
      <button
        type="button"
        disabled
        title="Önce kodu çalıştır, sonra AI Feedback al"
        className="px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 bg-white/[0.03] border border-white/10 text-white/40 cursor-not-allowed"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-300/50" />
        <span>AI Feedback</span>
        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white/5 text-white/30 border border-white/10">
          önce çalıştır
        </span>
      </button>
    );
  }

  // ─── Disabled: limit doldu ───
  if (limitReached) {
    return (
      <button
        type="button"
        onClick={onOpenSettings}
        title="Ücretsiz 5 deneme hakkın bitti. Kendi DeepSeek API key'ini ekleyerek sınırsız kullanabilirsin."
        className="px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 bg-white/[0.03] border border-rose-500/20 text-rose-300/80 hover:bg-rose-500/[0.05] transition-colors"
      >
        <KeyRound className="w-3.5 h-3.5" />
        <span>AI Feedback</span>
        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/20">
          limit doldu
        </span>
      </button>
    );
  }

  // ─── Loading ───
  if (loading) {
    return (
      <button
        type="button"
        disabled
        className="px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 cursor-wait"
      >
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>AI Feedback</span>
        <span className="text-[10px] text-amber-300/60">analiz ediliyor…</span>
      </button>
    );
  }

  // ─── Ready ───
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleClick}
        title={`AI Feedback — kalan ${remaining}/${limit} deneme`}
        className="px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-200 hover:bg-amber-500/25 hover:border-amber-500/50 transition-colors"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>AI Feedback</span>
        {error && (
          <span title={error} className="ml-1">
            <AlertCircle className="w-3 h-3 text-rose-400" />
          </span>
        )}
      </button>
      <span
        className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/20"
        title={`${remaining}/${limit} ücretsiz deneme kaldı`}
      >
        {remaining}/{limit}
      </span>
    </div>
  );
}
