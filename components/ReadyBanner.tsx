"use client";

// components/ReadyBanner.tsx
//
// "Sitemiz kullanıma hazır" — sticky top banner.
// 2026-07-14 kullanıcı direktifi: yeni ziyaretçilere "buradasın, katıl"
//   sinyali, dönüşüm hunisinin ilk adımı.
//
// Davranış:
// - localStorage "pymulakat_ready_banner_dismissed" === "1" ise gösterme
// - X tıklanırsa localStorage'a yaz, kaybolur (SSR-safe: client-only render)
// - Layout'ta root altında render edilir, tüm sayfalarda görünür
// - Lucide icon (Sparkles + X) — span yok, semantik element
// - Kural: misafir kullanıcı hedef (cookie'se banner anlamsız, ama gizleme
//   logic'i server-side'a bağlamadık — sade tut)

import { useEffect, useState } from "react";
import { Sparkles, X, ArrowRight } from "lucide-react";

const STORAGE_KEY = "pymulakat_ready_banner_dismissed";

export default function ReadyBanner() {
  // İlk render: server + client aynı (gizli) → hydration uyumu
  // Mount sonrası: localStorage kontrolü, gerekirse göster
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") {
        setVisible(true);
      }
    } catch {
      // localStorage yok (private mode) → yine göster
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Site kullanıma hazır duyurusu"
      className="sticky top-0 z-50 w-full border-b border-indigo-500/30 bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 text-white shadow-md"
    >
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <p className="text-sm font-medium truncate">
            <strong className="font-semibold text-amber-100">Sitemiz kullanıma hazır.</strong>
            <span className="hidden sm:inline">
              {" "}— İlk sorunuzu çözün, AI geri bildirim alın. Şimdilik ücretsiz.
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/interviews"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-md bg-amber-400 hover:bg-amber-300 text-indigo-950 text-xs font-semibold transition-colors"
          >
            Ücretsiz Başla
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Banner'ı kapat"
            className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
