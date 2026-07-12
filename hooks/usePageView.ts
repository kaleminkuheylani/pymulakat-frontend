// hooks/usePageView.ts
// Sayfa ziyaret tracking hook.
//
// MİMARİ:
// - Client-side: useEffect mount'ta 1 kez track
// - Session ID: crypto.randomUUID() (cookie'siz fingerprint)
// - localStorage'da sakla (browser session boyunca)
// - Throttle: ayni sayfa 5s icinde 1 kez
// - Referrer: window.location referrer
// - Sessiz hata yut (analytics UX bozmamali)
//
// KULLANIM:
//   usePageView();  // her sayfada bir kez cagir

"use client";

import { useEffect, useRef } from "react";
import { apiFetch } from "@/lib/api";

const SESSION_KEY = "pymulakat_session_id_v1";
const THROTTLE_MS = 5_000;
const lastTrackMap = new Map<string, number>();

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36)) as string;
      localStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

export function usePageView(): void {
  const tracked = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || tracked.current) return;
    tracked.current = true;

    const path = window.location.pathname;
    const sessionId = getOrCreateSessionId();

    // Throttle (aynı sayfa 5s içinde 1 kez)
    const now = Date.now();
    const last = lastTrackMap.get(path) || 0;
    if (now - last < THROTTLE_MS) return;
    lastTrackMap.set(path, now);

    // Referrer
    let referrer = document.referrer || "";
    try {
      if (referrer && new URL(referrer).origin === window.location.origin) {
        referrer = ""; // same-origin → boş (internal navigation)
      }
    } catch {
      referrer = "";
    }

    // Fire-and-forget (analytics UX bozmamali)
    apiFetch("/api/v2/analytics/track", {
      method: "POST",
      body: { path, referrer, session_id: sessionId },
    }).catch(() => {
      // Sessizce yut (network hatası, 5xx, vb.)
    });
  }, []);
}
