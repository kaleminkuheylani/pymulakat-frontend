// app/interviews/[category]/[slug]/components/workspace/AiFeedbackView.tsx
//
// 2026-07-14 v3: Mobile "Feedback" alt tab içeriği.
//   - useAiFeedback hook'unu kendi içinde kullanır (parent'ta değil)
//   - Buton + result + loading + error hepsi bu component'te
//   - Misafir → login CTA, limit doldu → BYOK prompt
//   - Result varsa: metin olarak göster (markdown yok, düz text)

"use client";

import { Sparkles, Lock, KeyRound, Loader2, AlertCircle, Settings } from "lucide-react";
import { useAiFeedback, AI_FEEDBACK_MAX } from "@/hooks/useAiFeedback";

interface AiFeedbackViewProps {
  isGuest: boolean;
  hasRunOnce: boolean;
  code: string;
  questionTitle: string;
  questionDescription?: string;
  testResults: Array<{ input?: string; expected?: string; actual?: string; passed: boolean; description?: string }>;
}

export default function AiFeedbackView({
  isGuest,
  hasRunOnce,
  code,
  questionTitle,
  questionDescription,
  testResults,
}: AiFeedbackViewProps) {
  const {
    loading,
    error,
    result,
    remaining,
    limitReached,
    requestFeedback,
    setByokKey,
    hasByokKey,
  } = useAiFeedback();

  const handleClick = async () => {
    if (isGuest) {
      const returnUrl = typeof window !== "undefined" ? window.location.pathname : "/";
      window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
      return;
    }
    await requestFeedback({ code, questionTitle, questionDescription, testResults });
  };

  return (
    <div className="space-y-3">
      {/* Header: buton + kalan hak */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <h3 className="text-sm font-bold text-white truncate">AI Feedback</h3>
          {!isGuest && !limitReached && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/20">
              {remaining}/{AI_FEEDBACK_MAX}
            </span>
          )}
          {hasByokKey && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
              kendi key
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            // BYOK key girişi için basit prompt
            const current = typeof window !== "undefined" ? (localStorage.getItem("pymulakat_ai_feedback_byok_key") || "") : "";
            const next = window.prompt(
              "DeepSeek API key (sk-...). Boş bırakırsanız kaldırılır:",
              current
            );
            if (next !== null) setByokKey(next);
          }}
          className="p-1.5 rounded text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          title="Kendi API key'ini ayarla"
          aria-label="Ayarlar"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Buton: 4 state */}
      {isGuest ? (
        <button
          type="button"
          onClick={handleClick}
          className="w-full px-3 py-2.5 rounded-md text-xs font-medium flex items-center justify-center gap-2 bg-white/[0.03] border border-white/10 text-white/70 hover:bg-white/[0.06]"
        >
          <Lock className="w-4 h-4 text-white/50" />
          Giriş Yap & AI Feedback Dene
        </button>
      ) : !hasRunOnce ? (
        <div className="w-full px-3 py-2.5 rounded-md text-xs text-center bg-white/[0.03] border border-white/10 text-white/50">
          Önce kodu çalıştır, sonra AI Feedback al
        </div>
      ) : limitReached ? (
        <button
          type="button"
          onClick={() => {
            const current = typeof window !== "undefined" ? (localStorage.getItem("pymulakat_ai_feedback_byok_key") || "") : "";
            const next = window.prompt(
              "Ücretsiz deneme hakkın bitti. Kendi DeepSeek API key'ini ekle (sk-...):",
              current
            );
            if (next !== null) setByokKey(next);
          }}
          className="w-full px-3 py-2.5 rounded-md text-xs font-medium flex items-center justify-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/15"
        >
          <KeyRound className="w-4 h-4" />
          Limit doldu — kendi API key'ini ekle
        </button>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className="w-full px-3 py-2.5 rounded-md text-xs font-medium flex items-center justify-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-200 hover:bg-amber-500/25 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analiz ediliyor…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              AI Feedback Al
            </>
          )}
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-rose-200 font-mono">{error}</p>
        </div>
      )}

      {/* Result */}
      {result ? (
        <div className="p-3 rounded-lg bg-amber-500/[0.06] border border-amber-500/20">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span className="text-[10px] uppercase tracking-wider text-amber-300/80 font-bold">
              DeepSeek {result.model.includes("coder") ? "Coder" : "V3"} · {result.usage?.total_tokens ?? "?"} token
            </span>
          </div>
          <pre className="text-[12px] text-white/85 font-sans whitespace-pre-wrap leading-relaxed">
{result.feedback}
          </pre>
        </div>
      ) : !isGuest && hasRunOnce && !loading ? (
        <div className="p-3 rounded-lg border border-dashed border-white/10 text-center">
          <p className="text-[11px] text-white/40 font-mono">
            Yukarıdaki butona bas, kodunun analizini ve önerileri al.
          </p>
        </div>
      ) : null}
    </div>
  );
}
