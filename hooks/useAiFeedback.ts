// hooks/useAiFeedback.ts
//
// 2026-07-14 — AI Feedback state + quota + DeepSeek call.
//
// Davranış:
//   - Misafir user tetikleyemez (auth gate backend'de, UI sadece ipucu)
//   - Üye user 5 deneme hakkı (localStorage "pymulakat_ai_feedback_count")
//   - Hak 0'a düşünce button disabled, "yarın sıfırlanır" mesajı
//   - BYOK: user kendi DeepSeek key'ini localStorage'da tutabilir
//     (Vercel env fallback server'da, ama BYOK tercih edilir — server-side
//      rate limit BYOK user için kaldırılır)
//
// Trigger kuralı: ilk Run Tests çağrısından sonra enable olur
//   (useAiFeedback'in dışında, parent component yönetir)

"use client";

import { useCallback, useEffect, useState } from "react";

const COUNT_KEY = "pymulakat_ai_feedback_count";
const BYOK_KEY = "pymulakat_ai_feedback_byok_key";
const MAX_FREE_FEEDBACK = 5;

export interface AiFeedbackResult {
  feedback: string;
  model: string;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
}

export interface AiFeedbackState {
  /** Tıklama başına state. */
  loading: boolean;
  /** Hata varsa kullanıcıya gösterilecek mesaj. */
  error: string | null;
  /** Son başarılı feedback. */
  result: AiFeedbackResult | null;
  /** Kalan deneme hakkı (0-5). */
  remaining: number;
  /** Limit doldu mu? */
  limitReached: boolean;
  /** feedback al butonu tetikleyici. */
  requestFeedback: (params: {
    code: string;
    questionTitle: string;
    questionDescription?: string;
    testResults?: Array<{ input?: string; expected?: string; actual?: string; passed: boolean; description?: string }>;
  }) => Promise<AiFeedbackResult | null>;
  /** BYOK key'i set et (settings'ten çağrılır). */
  setByokKey: (key: string) => void;
  /** BYOK key var mı? */
  hasByokKey: boolean;
  /** localStorage quota sıfırla (debug amaçlı, production'da UI'dan çağrılmaz). */
  resetQuota: () => void;
}

function readCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const v = localStorage.getItem(COUNT_KEY);
    const n = v ? parseInt(v, 10) : 0;
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

function writeCount(n: number) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COUNT_KEY, String(n));
  } catch {
    // localStorage yok (private mode) — sessizce geç
  }
}

function readByokKey(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(BYOK_KEY) || null;
  } catch {
    return null;
  }
}

function writeByokKey(key: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (key) localStorage.setItem(BYOK_KEY, key);
    else localStorage.removeItem(BYOK_KEY);
  } catch {
    // ignore
  }
}

export function useAiFeedback(): AiFeedbackState {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiFeedbackResult | null>(null);
  const [used, setUsed] = useState(0);
  const [byokKey, setByokKeyState] = useState<string | null>(null);

  // Mount: localStorage'dan count + BYOK oku
  useEffect(() => {
    setUsed(readCount());
    setByokKeyState(readByokKey());
  }, []);

  const requestFeedback = useCallback<AiFeedbackState["requestFeedback"]>(
    async (params) => {
      // Quota kontrol (client-side gate — backend de auth kontrol ediyor)
      const currentUsed = readCount();
      if (currentUsed >= MAX_FREE_FEEDBACK) {
        setError("Ücretsiz deneme hakkın bitti. Yarın sıfırlanır veya kendi API key'ini kullanabilirsin.");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        const key = readByokKey();
        if (key) headers["X-User-Api-Key"] = key;

        const res = await fetch("/api/ai-feedback", {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify(params),
        });

        if (res.status === 401) {
          setError("AI feedback için giriş yapmalısın.");
          return null;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.message || `Hata: ${res.status}`);
          return null;
        }

        const data = await res.json();
        // Quota increment
        const newUsed = currentUsed + 1;
        writeCount(newUsed);
        setUsed(newUsed);
        setResult({
          feedback: data.feedback,
          model: data.model,
          usage: data.usage,
        });
        return data as AiFeedbackResult;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Bilinmeyen hata");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const setByokKey = useCallback((key: string) => {
    const trimmed = key.trim();
    writeByokKey(trimmed || null);
    setByokKeyState(trimmed || null);
  }, []);

  const resetQuota = useCallback(() => {
    writeCount(0);
    setUsed(0);
  }, []);

  const remaining = Math.max(0, MAX_FREE_FEEDBACK - used);
  const limitReached = remaining === 0;

  return {
    loading,
    error,
    result,
    remaining,
    limitReached,
    requestFeedback,
    setByokKey,
    hasByokKey: Boolean(byokKey),
    resetQuota,
  };
}

export const AI_FEEDBACK_MAX = MAX_FREE_FEEDBACK;
