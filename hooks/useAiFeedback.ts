// hooks/useAiFeedback.ts
//
// 2026-07-14 v2: Streaming feedback (DeepSeek SSE passthrough).
//
// Akış:
//   1. POST /api/ai-feedback (SSE stream response)
//   2. response.body.getReader() → chunk'ları oku
//   3. Her chunk: "data: {json}\n\n" parse et, delta.content biriktir
//   4. State.partialFeedback güncellenir (UI anlık gösterir)
//   5. done: true → state.result final feedback olur
//
// Avantaj: 200ms'de ilk kelime, "yükleniyor" yok, UX canlı.
// Iptal: AbortController ile signal, unmount'ta otomatik cancel.

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const COUNT_KEY = "pymulakat_ai_feedback_count";
const BYOK_KEY = "pymulakat_ai_feedback_byok_key";
const MAX_FREE_FEEDBACK = 10;

export interface AiFeedbackResult {
  feedback: string;
  model: string;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
}

export interface AiFeedbackState {
  loading: boolean;
  /** Stream sırasında kademeli feedback metni. */
  partialFeedback: string;
  error: string | null;
  result: AiFeedbackResult | null;
  remaining: number;
  limitReached: boolean;
  requestFeedback: (params: {
    code: string;
    questionTitle: string;
    questionDescription?: string;
    testResults?: Array<{ input?: string; expected?: string; actual?: string; passed: boolean; description?: string }>;
  }) => Promise<AiFeedbackResult | null>;
  setByokKey: (key: string) => void;
  hasByokKey: boolean;
  resetQuota: () => void;
  /** Aktif stream'i iptal et. */
  abort: () => void;
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
  } catch {}
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
  } catch {}
}

export function useAiFeedback(): AiFeedbackState {
  const [loading, setLoading] = useState(false);
  const [partialFeedback, setPartialFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiFeedbackResult | null>(null);
  const [used, setUsed] = useState(0);
  const [byokKey, setByokKeyState] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Typewriter efekt (2026-07-14): Stream chunk'ları anında state'e
  // yazılmak yerine buffer'da birikir, setInterval 20ms'de birkaç
  // karakter state'e aktarılır. Kullanıcı için yazıyormuş hissi.
  const typewriterBufferRef = useRef<string>("");
  const typewriterDisplayedRef = useRef<number>(0);
  const typewriterIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typewriterModelRef = useRef<string>("deepseek-chat");
  const typewriterUsageRef = useRef<AiFeedbackResult["usage"]>(undefined);

  const stopTypewriter = useCallback(() => {
    if (typewriterIntervalRef.current) {
      clearInterval(typewriterIntervalRef.current);
      typewriterIntervalRef.current = null;
    }
  }, []);

  const startTypewriter = useCallback(() => {
    stopTypewriter();
    // 2026-07-14 v7: Hız insan okuma seviyesi (~200 wpm Turkce)
    //   50ms tick × 2 karakter = 40 char/sn (2000 char / 50s = 40 char/s)
    //   Onceki 20ms × 2 = 100 char/sn (cok hizli, "akma" hissi yok)
    typewriterIntervalRef.current = setInterval(() => {
      const target = typewriterBufferRef.current;
      const current = typewriterDisplayedRef.current;
      if (current < target.length) {
        // Her tick 2 karakter — ~40 char/sn (yazı okuma hızı)
        const next = Math.min(current + 2, target.length);
        setPartialFeedback(target.slice(0, next));
        typewriterDisplayedRef.current = next;
        if (next === target.length) {
          // Tam metin gösterildi — result + loading kapat
          setResult({
            feedback: target,
            model: typewriterModelRef.current,
            usage: typewriterUsageRef.current,
          });
          setLoading(false);
          stopTypewriter();
        }
      } else {
        stopTypewriter();
      }
    }, 50);
  }, [stopTypewriter]);

  useEffect(() => {
    setUsed(readCount());
    setByokKeyState(readByokKey());
  }, []);

  // Unmount'ta aktif stream'i iptal et, typewriter durdur
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
      stopTypewriter();
    };
  }, [stopTypewriter]);

  const requestFeedback = useCallback<AiFeedbackState["requestFeedback"]>(
    async (params) => {
      const currentUsed = readCount();
      if (currentUsed >= MAX_FREE_FEEDBACK) {
        setError("Ücretsiz deneme hakkın bitti. Yarın sıfırlanır veya kendi API key'ini kullanabilirsin.");
        return null;
      }

      setLoading(true);
      setError(null);
      setResult(null);
      setPartialFeedback("");
      // Typewriter state reset
      stopTypewriter();
      typewriterBufferRef.current = "";
      typewriterDisplayedRef.current = 0;
      typewriterModelRef.current = "deepseek-chat";
      typewriterUsageRef.current = undefined;

      const controller = new AbortController();
      abortRef.current = controller;

      // 2026-07-14 v4: Her istek öncesi sentinel cookie refresh.
      // User authenticated ama cookie 24h TTL'den dolmussa veya
      // yazilamamissa (SameSite, third-party block, vs.) backend 401
      // döner. Yenileme ile cookie var oldugundan emin ol.
      if (typeof document !== "undefined") {
        try {
          document.cookie = "pymulakat_auth=1; path=/; max-age=86400; SameSite=Lax";
        } catch {}
      }

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        };
        const key = readByokKey();
        if (key) headers["X-User-Api-Key"] = key;

        const res = await fetch("/api/ai-feedback", {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify(params),
          signal: controller.signal,
        });

        if (res.status === 401) {
          // 2026-07-14 v3: 401 login'e yönlendirmez, sadece hata gösterir.
          // Misafir zaten "Giriş Yap & Dene" butonu kullanıyor
          // (AiFeedbackButton/AiFeedbackView). Burada sadece hata göster,
          // kullanıcı manuel karar versin (yenileme veya giriş).
          setError("Oturum süresi dolmuş olabilir. Sayfayı yenile veya giriş yap.");
          return null;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.message || `Hata: ${res.status}`);
          return null;
        }

        // 2026-07-14 v8: JSON response (backend'de stream: false).
        // SSE streaming Vercel Node.js'te buffer'lanıyordu (yarim geliyor).
        // Edge runtime timeout nedeniyle kesiliyordu. En güvenilir: normal
        // JSON response, frontend typewriter interval kademeli gösterir
        // (40 char/sn, yazı okuma hızı). Kullanıcı deneyimi aynı.
        const data = await res.json();
        if (!data.feedback) {
          setError("Boş yanıt");
          return null;
        }

        const fullText: string = data.feedback;
        const model: string = data.model || "deepseek-chat";
        const usage = data.usage;

        // Buffer'a koy, interval kademeli gösterir
        typewriterBufferRef.current = fullText;
        typewriterModelRef.current = model;
        typewriterUsageRef.current = usage;
        // Interval henüz başlamadıysa başlat
        if (!typewriterIntervalRef.current) {
          startTypewriter();
        }

        // Quota increment (interval tamamlanmasını beklemeden)
        const newUsed = currentUsed + 1;
        writeCount(newUsed);
        setUsed(newUsed);

        return null; // Result interval bittiğinde set edilir
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") {
          // Kullanıcı iptal etti — sessizce çık
          return null;
        }
        setError(e instanceof Error ? e.message : "Bilinmeyen hata");
        return null;
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [],
  );

  const setByokKey = useCallback((key: string) => {
    const trimmed = key.trim();
    writeByokKey(trimmed || null);
    setByokKeyState(trimmed || null);
  }, []);

  const abort = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setLoading(false);
      stopTypewriter();
    }
  }, [stopTypewriter]);

  const resetQuota = useCallback(() => {
    writeCount(0);
    setUsed(0);
  }, []);

  const remaining = Math.max(0, MAX_FREE_FEEDBACK - used);
  const limitReached = remaining === 0;

  return {
    loading,
    partialFeedback,
    error,
    result,
    remaining,
    limitReached,
    requestFeedback,
    setByokKey,
    hasByokKey: Boolean(byokKey),
    resetQuota,
    abort,
  };
}

export const AI_FEEDBACK_MAX = MAX_FREE_FEEDBACK;
