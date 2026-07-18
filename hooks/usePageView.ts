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

    // 2026-07-18: Custom analytics track KALDIRILDI
    // - Sebep: admin panel kaldirildi, backend analytics router da yok
    // - 404 spam: /api/v2/analytics/track her sayfa view'da 404 donuyordu
    // - Alternatif: Vercel Analytics (zaten kuruldu, page views otomatik)
    // - Ileride: Supabase page_view tablosu + yeni router eklenebilir
    //
    // Vercel Analytics sayfa view'leri otomatik trackliyor, o yuzden
    // burada ek call'a gerek yok.
    void path;
    void referrer;
    void sessionId;
  }, []);
}
