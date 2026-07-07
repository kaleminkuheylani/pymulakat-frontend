"use client";

// components/MaintenanceNotice.tsx
// Server bakımda bildirimi — header altında sabit banner.
// Üyelik gerektirmez, misafir kullanıcılar da görür.
// "×" ile kapatılabilir (sessionStorage'da hatırla).

import { useEffect, useState } from "react";

const STORAGE_KEY = "maintenance-notice-dismissed";
const MAINTENANCE_MESSAGE =
  "🔧 Server bakımda — yeni sorular ve özellikler üzerinde çalışıyoruz. Mevcut sorular çalışmaya devam ediyor.";

export default function MaintenanceNotice() {
  const [dismissed, setDismissed] = useState(true); // SSR'da gizli başla

  useEffect(() => {
    // Client-side'da storage kontrol
    const wasDismissed = sessionStorage.getItem(STORAGE_KEY) === "1";
    setDismissed(wasDismissed);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 left-0 right-0 z-50 bg-amber-500/10 backdrop-blur-sm border-b border-amber-500/30"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3 text-sm">
        <span className="flex-1 text-amber-200/90">
          {MAINTENANCE_MESSAGE}
        </span>
        <button
          onClick={handleDismiss}
          aria-label="Kapat"
          className="shrink-0 w-7 h-7 rounded-md hover:bg-amber-500/20 flex items-center justify-center text-amber-200/70 hover:text-amber-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}