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
const MAX_FREE_FEEDBACK = 5;

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

  useEffect(() => {
    setUsed(readCount());
    setByokKeyState(readByokKey());
  }, []);

  // Unmount'ta aktif stream'i iptal et
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

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

        if (!res.body) {
          setError("Boş yanıt");
          return null;
        }

        // ── SSE streaming parse ────────────────────────────────
        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        let fullText = "";
        let model = "deepseek-chat";
        let usage: AiFeedbackResult["usage"] | undefined;
        let lastError: string | null = null;

        // SSE "data: {...}\n\n" parse — buffer kısmi chunk'ları biriktirir
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // SSE event'leri \n\n ile ayrılır. Kısmi event buffer'da kalır.
          let eventEnd: number;
          while ((eventEnd = buffer.indexOf("\n\n")) !== -1) {
            const event = buffer.slice(0, eventEnd);
            buffer = buffer.slice(eventEnd + 2);

            // "event:" prefix'i (custom eventler için), "data:" zorunlu
            const eventTypeMatch = event.match(/^event:\s*(.+)$/m);
            const dataMatch = event.match(/^data:\s*(.+)$/m);
            if (!dataMatch) continue;

            const dataStr = dataMatch[1].trim();
            if (dataStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(dataStr);

              // Custom error event (backend tarafında gönderildi)
              if (eventTypeMatch?.[1] === "error" || parsed.error) {
                lastError = parsed.message || parsed.error || "Stream hatası";
                continue;
              }

              // OpenAI/DeepSeek streaming chunk shape
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                fullText += delta;
                setPartialFeedback(fullText);
              }
              if (parsed.model) model = parsed.model;
              if (parsed.usage) usage = parsed.usage;
            } catch (parseErr) {
              // Parse hatası — chunk bozuk olabilir, sessizce atla
              console.warn("[useAiFeedback] SSE parse hatası:", parseErr, dataStr.slice(0, 100));
            }
          }
        }

        if (lastError) {
          setError(lastError);
          return null;
        }

        if (!fullText) {
          setError("Boş yanıt");
          return null;
        }

        // Quota increment
        const newUsed = currentUsed + 1;
        writeCount(newUsed);
        setUsed(newUsed);

        const finalResult: AiFeedbackResult = {
          feedback: fullText,
          model,
          usage,
        };
        setResult(finalResult);
        return finalResult;
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
    }
  }, []);

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
