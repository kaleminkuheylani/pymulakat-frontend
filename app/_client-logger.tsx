"use client";

// app/_client-logger.tsx
// Tüm client-side runtime hatalarını Vercel log'larına iletir.
// Hata mesajları Vercel Dashboard → Deployments → [deployment] → Logs'da görünür.

import { useEffect } from "react";

const APP_VERSION = "1.0.0";

function sendLog(payload: {
  type: "error" | "warn" | "info";
  message: string;
  stack?: string;
  source?: string;
}) {
  if (typeof window === "undefined") return;

  // navigator.sendBeacon sayfa unload olsa bile gönderir
  try {
    const body = JSON.stringify({
      ...payload,
      url: window.location.href,
      userAgent: navigator.userAgent,
      appVersion: APP_VERSION,
      timestamp: Date.now(),
    });

    const blob = new Blob([body], { type: "application/json" });
    const ok = navigator.sendBeacon?.("/api/log", blob);
    if (!ok) {
      // sendBeacon yoksa fetch ile dene
      fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Sessizce yut — log gönderimi kendi hata vermesin
  }
}

export default function ClientLogger() {
  useEffect(() => {
    // ── Global error handler ──────────────────────────────
    const onError = (event: ErrorEvent) => {
      sendLog({
        type: "error",
        message: event.message || "Unknown error",
        stack: event.error?.stack,
        source: "window.onerror",
      });
    };

    // ── Unhandled promise rejection ───────────────────────
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      sendLog({
        type: "error",
        message:
          reason instanceof Error
            ? reason.message
            : typeof reason === "string"
              ? reason
              : JSON.stringify(reason).substring(0, 300),
        stack: reason instanceof Error ? reason.stack : undefined,
        source: "unhandledrejection",
      });
    };

    // ── Next.js route hataları için (navigate sırasında) ─
    const origPushState = history.pushState;
    const origReplaceState = history.replaceState;

    history.pushState = function (...args) {
      try {
        return origPushState.apply(this, args);
      } catch (e: any) {
        sendLog({
          type: "error",
          message: `history.pushState: ${e?.message}`,
          stack: e?.stack,
          source: "history.pushState",
        });
        throw e;
      }
    };

    history.replaceState = function (...args) {
      try {
        return origReplaceState.apply(this, args);
      } catch (e: any) {
        sendLog({
          type: "error",
          message: `history.replaceState: ${e?.message}`,
          stack: e?.stack,
          source: "history.replaceState",
        });
        throw e;
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      history.pushState = origPushState;
      history.replaceState = origReplaceState;
    };
  }, []);

  return null;
}