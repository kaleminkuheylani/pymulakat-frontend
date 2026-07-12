// app/admin/page.tsx
// Admin dashboard ana sayfa — 3 ana widget kartı + özelleştirilebilir grid.
//
// MİMARİ:
// - 3 widget kart (Question Audit, Page Audit, User Audit) → büyük, özellik
// - Diğer widget'lar (Settings, Test Diagnostics, vs.) → küçük kart
// - Client component: localStorage'tan widget tercihi (hide/reorder) oku
// - Server component: widget metadata (badge, link) sağla
//
// MİMARİ KURAL (KESİN):
// - lib/api/ üzerinden veri çekilir (inline fetch YASAK)
// - Widget registry tek kaynak (lib/admin/widgetRegistry.ts)
// - Client customization: localStorage, versioned key (v1, v2 migration)

import { getAllWidgets, WIDGET_PREF_KEY, getDefaultWidgetPreference } from "@/lib/admin/widgetRegistry";
import type { AdminWidget } from "@/lib/admin/widgetRegistry";
import { LayoutDashboard, Sparkles, TrendingUp, Wrench } from "lucide-react";
import AdminWidgetGrid from "./AdminWidgetGrid";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const widgets = getAllWidgets();
  const defaultPref = getDefaultWidgetPreference();

  // 3 ana widget'ı vurgula (Question Audit, Page Audit, User Audit)
  const primaryWidgetIds = ["question-audit", "page-audit", "user-audit"];
  const primaryWidgets = primaryWidgetIds
    .map((id) => widgets.find((w) => w.id === id))
    .filter((w): w is AdminWidget => Boolean(w));
  const secondaryWidgets = widgets.filter((w) => !primaryWidgetIds.includes(w.id));

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-mono uppercase tracking-widest mb-2">
          <LayoutDashboard className="w-4 h-4" />
          Admin Dashboard
        </div>
        <h1 className="text-3xl font-bold mb-2">PythonMulakat Admin</h1>
        <p className="text-white/60 text-sm">
          Soru denetimi, sayfa SEO, kullanıcı aktivitesi — tek panelden.
        </p>
      </div>

      {/* ─── Stats banner ───────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-slate-900/50 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">85</div>
          <div className="text-xs text-white/50 mt-1">Toplam Soru</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-emerald-300">85</div>
          <div className="text-xs text-white/50 mt-1">Audit Passed</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-amber-300">0</div>
          <div className="text-xs text-white/50 mt-1">Pending</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-cyan-300">9</div>
          <div className="text-xs text-white/50 mt-1">Kategori</div>
        </div>
      </div>

      {/* ─── 3 Primary widget kart (büyük) ──────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Ana Widget'lar
          </h2>
          <Link
            href="/admin/settings"
            className="text-xs text-white/50 hover:text-white flex items-center gap-1"
          >
            <Wrench className="w-3 h-3" />
            Özelleştir
          </Link>
        </div>
        <AdminWidgetGrid
          widgets={primaryWidgets}
          defaultPreference={defaultPref}
          storageKey={WIDGET_PREF_KEY}
          variant="primary"
        />
      </div>

      {/* ─── Diğer widget'lar (küçük grid) ──────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Diğer Araçlar
          </h2>
        </div>
        <AdminWidgetGrid
          widgets={secondaryWidgets}
          defaultPreference={defaultPref}
          storageKey={WIDGET_PREF_KEY}
          variant="compact"
        />
      </div>
    </div>
  );
}

// Next.js Link için import (JSX'te kullandığımız)
import Link from "next/link";
