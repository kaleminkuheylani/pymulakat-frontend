"use client";

// components/MaintenancePage.tsx
// Full-page maintenance component — tüm sayfa bu component'i gösterir.
// Navigation tamamen devre dışı, üyelik gerektirmez.

import { useEffect, useState } from "react";

const STORAGE_KEY = "maintenance-notice-dismissed";
const MAINTENANCE_TITLE = "Server Bakımda";
const MAINTENANCE_DESCRIPTION =
  "Yeni sorular ve özellikler üzerinde çalışıyoruz. Mevcut içerikler kısa süre içinde geri gelecek.";

export default function MaintenancePage() {
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    // Mevcut zamanı göster (TR saat dilimi)
    const update = () => {
      const d = new Date();
      setNow(
        d.toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Istanbul",
        })
      );
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col">
      {/* Üst ince bar — saat + durum */}
      <div className="border-b border-white/10 bg-[#0a0e1a]/40 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            
              Maintenance
            
          </div>
          {now && (
            <span className="text-white/30 font-mono">
              {now} TR
            </span>
          )}
        </div>
      </div>

      {/* Ana içerik */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-2xl w-full text-center">
          {/* Animated icon */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-2xl bg-amber-500/10 animate-pulse" />
            <div className="absolute inset-2 rounded-xl bg-amber-500/15 flex items-center justify-center text-5xl">
              🔧
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent">
            {MAINTENANCE_TITLE}
          </h1>

          <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-10 max-w-md mx-auto">
            {MAINTENANCE_DESCRIPTION}
          </p>

          {/* Bilgi kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left">
              <div className="text-2xl mb-1">📝</div>
              <div className="text-sm font-semibold text-white/90">Sorular hazır</div>
              <div className="text-xs text-white/50 mt-0.5">
                Yeni içerikler DB'de ekili
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left">
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-sm font-semibold text-white/90">Test ediliyor</div>
              <div className="text-xs text-white/50 mt-0.5">
                Son kontroller yapılıyor
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left">
              <div className="text-2xl mb-1">🚀</div>
              <div className="text-sm font-semibold text-white/90">Çok yakında</div>
              <div className="text-xs text-white/50 mt-0.5">
                Birkaç saat içinde yayında
              </div>
            </div>
          </div>

          {/* Durum çubuğu */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mb-6">
            <div className="flex items-center gap-3 text-amber-200/90 text-sm">
              <svg
                className="w-4 h-4 animate-spin shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Çalışmalar sürüyor. Sabrınız için teşekkürler.
            </div>
          </div>

          {/* Footer notu — link yok */}
          <p className="text-xs text-white/30">
            Bu sayfa içinde gezinme devre dışı. Lütfen daha sonra tekrar deneyin.
          </p>
        </div>
      </main>
    </div>
  );
}