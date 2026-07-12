"use client";

// app/admin/AdminWidgetGrid.tsx
// Özelleştirilebilir widget grid — localStorage tercihleri.
//
// MİMARİ:
// - Client component (localStorage erişim için)
// - Server-rendered: önce default widget'lar, sonra hydration'da localStorage
// - Preference: { hidden: string[], order: string[] }
// - Toggle hide: ikon → X
// - Reorder: drag & drop YOK (basitlik için, sonra eklenebilir)
//
// MİMARİ KURAL (KESİN):
// - localStorage KEY'leri versioned: pymulakat_admin_widgets_v1
// - JSON parse hatası → default preference
// - Bulunamayan widget ID'leri → filtrele (silinen widget'lar)

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AdminWidget, WidgetPreference } from "@/lib/admin/widgetRegistry";
import { ChevronRight, Eye, EyeOff } from "lucide-react";

interface Props {
  widgets: AdminWidget[];
  defaultPreference: WidgetPreference;
  storageKey: string;
  variant: "primary" | "compact";
}

export default function AdminWidgetGrid({
  widgets,
  defaultPreference,
  storageKey,
  variant,
}: Props) {
  const [preference, setPreference] = useState<WidgetPreference>(defaultPreference);
  const [hydrated, setHydrated] = useState(false);

  // Hydration sonrası localStorage'tan tercih oku
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as WidgetPreference;
        // Geçerlilik kontrolü
        if (parsed && Array.isArray(parsed.hidden) && Array.isArray(parsed.order)) {
          setPreference(parsed);
        }
      }
    } catch {
      // Parse hatası → default kullan
    }
    setHydrated(true);
  }, [storageKey]);

  // Tercih değiştiğinde localStorage'a yaz
  const updatePreference = (next: WidgetPreference) => {
    setPreference(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Storage yok / quota → ignore
    }
  };

  // Widget'ları tercihe göre filtrele + sırala
  const visibleWidgets = widgets
    .filter((w) => !preference.hidden.includes(w.id))
    .sort((a, b) => {
      const ai = preference.order.indexOf(a.id);
      const bi = preference.order.indexOf(b.id);
      // Bilinmeyen ID'ler sona
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

  const toggleHide = (id: string) => {
    const next = {
      ...preference,
      hidden: preference.hidden.includes(id)
        ? preference.hidden.filter((h) => h !== id)
        : [...preference.hidden, id],
    };
    updatePreference(next);
  };

  // Hydration öncesi: default (SSR uyumu)
  const displayWidgets = hydrated ? visibleWidgets : widgets;

  if (variant === "primary") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayWidgets.map((w) => {
          const Icon = w.icon;
          return (
            <div
              key={w.id}
              className="group relative bg-slate-900/50 border border-white/10 rounded-xl p-5 hover:border-amber-500/30 transition-colors"
            >
              {hydrated && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleHide(w.id);
                  }}
                  className="absolute top-3 right-3 p-1 rounded text-white/30 hover:text-white/70 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Gizle"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                </button>
              )}

              <Link href={w.href} className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-amber-400" />
                  </div>
                  {w.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        w.badge.variant === "warning"
                          ? "bg-amber-500/15 text-amber-300"
                          : w.badge.variant === "danger"
                            ? "bg-rose-500/15 text-rose-300"
                            : w.badge.variant === "success"
                              ? "bg-emerald-500/15 text-emerald-300"
                              : "bg-white/10 text-white/60"
                      }`}
                    >
                      {w.badge.label}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white mb-1">{w.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed mb-3">
                  {w.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-amber-300/80">
                  Aç
                  <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            </div>
          );
        })}
        {hydrated && displayWidgets.length === 0 && (
          <div className="col-span-3 bg-slate-900/30 border border-white/10 rounded-xl p-6 text-center text-sm text-white/50">
            <Eye className="w-5 h-5 mx-auto mb-2 opacity-50" />
            Tüm widget'lar gizlendi. Settings'ten geri açabilirsin.
          </div>
        )}
      </div>
    );
  }

  // Compact variant (küçük kartlar grid)
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {displayWidgets.map((w) => {
        const Icon = w.icon;
        return (
          <div
            key={w.id}
            className="group relative bg-slate-900/40 border border-white/10 rounded-lg p-3 hover:border-white/20 transition-colors"
          >
            {hydrated && (
              <button
                type="button"
                onClick={() => toggleHide(w.id)}
                className="absolute top-2 right-2 p-0.5 rounded text-white/30 hover:text-white/70 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Gizle"
              >
                <EyeOff className="w-3 h-3" />
              </button>
            )}

            <Link href={w.href} className="block">
              <Icon className="w-5 h-5 text-white/60 mb-2" />
              <div className="text-sm font-medium text-white mb-0.5">{w.title}</div>
              <div className="text-[10px] text-white/50 leading-snug line-clamp-2">
                {w.description}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
