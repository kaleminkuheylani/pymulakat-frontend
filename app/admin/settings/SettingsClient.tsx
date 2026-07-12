"use client";

// app/admin/settings/SettingsClient.tsx
// Widget enable/disable + localStorage reset.

import { useEffect, useState } from "react";
import { getAllWidgets, WIDGET_PREF_KEY, getDefaultWidgetPreference } from "@/lib/admin/widgetRegistry";
import type { AdminWidget, WidgetPreference } from "@/lib/admin/widgetRegistry";
import { Eye, EyeOff, RotateCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsClient() {
  const router = useRouter();
  const widgets = getAllWidgets();
  const [preference, setPreference] = useState<WidgetPreference>(getDefaultWidgetPreference());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WIDGET_PREF_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as WidgetPreference;
        if (parsed && Array.isArray(parsed.hidden) && Array.isArray(parsed.order)) {
          setPreference(parsed);
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const save = (next: WidgetPreference) => {
    setPreference(next);
    try {
      localStorage.setItem(WIDGET_PREF_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const toggleHide = (id: string) => {
    const next = {
      ...preference,
      hidden: preference.hidden.includes(id)
        ? preference.hidden.filter((h) => h !== id)
        : [...preference.hidden, id],
    };
    save(next);
  };

  const reset = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(WIDGET_PREF_KEY);
    }
    setPreference(getDefaultWidgetPreference());
    router.refresh();
  };

  const env = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓" : "✗",
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ? "✓" : "✗ (default Railway)",
  };

  return (
    <div className="space-y-6">
      {/* ─── Widget yönetimi ────────────────────────────────── */}
      <div className="bg-slate-900/50 border border-white/10 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Widget Görünürlüğü</h2>
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Sıfırla
          </button>
        </div>

        <div className="space-y-2">
          {widgets.map((w: AdminWidget) => {
            const Icon = w.icon;
            const hidden = preference.hidden.includes(w.id);
            return (
              <div
                key={w.id}
                className="flex items-center gap-3 px-3 py-2.5 bg-slate-900/30 border border-white/5 rounded-lg"
              >
                <Icon className="w-4 h-4 text-white/50 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">{w.title}</div>
                  <div className="text-[10px] text-white/50 truncate">{w.href}</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleHide(w.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${
                    hidden
                      ? "bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                      : "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                  }`}
                  disabled={!hydrated}
                >
                  {hidden ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      Gizli
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      Görünür
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Environment bilgisi ────────────────────────────── */}
      <div className="bg-slate-900/50 border border-white/10 rounded-xl p-5">
        <h2 className="text-base font-bold text-white mb-4">Environment</h2>
        <div className="space-y-1.5 text-sm font-mono">
          {Object.entries(env).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between">
              <span className="text-white/60">{k}</span>
              <span className={v.startsWith("✓") ? "text-emerald-300" : "text-amber-300"}>{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[10px] text-white/40">
          Environment değişkenleri Vercel dashboard'dan set edilir. Production'da default fallback'ler (Railway URL) kullanılır.
        </div>
      </div>

      {/* ─── localStorage temizle ───────────────────────────── */}
      <div className="bg-slate-900/50 border border-white/10 rounded-xl p-5">
        <h2 className="text-base font-bold text-white mb-2">Veri Temizleme</h2>
        <p className="text-xs text-white/50 mb-3">
          Tüm admin widget tercihi (gizli, sıralama) sıfırlanır. Sayfa yenilenir.
        </p>
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-sm font-medium"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Tüm Tercihleri Sıfırla
        </button>
      </div>
    </div>
  );
}
