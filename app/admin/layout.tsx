// app/admin/layout.tsx
// Tüm /admin/* rotaları için ortak shell + Supabase admin guard.
//
// MİMARİ:
// 1. requireAdmin() → user.role !== "admin" ise /'ya redirect
// 2. Shell: sol sidebar (kategori grupları) + sağ ana içerik
// 3. Tüm admin rotaları buradan geçer
//
// KVKK UYUMU:
// - Admin yetkisi sadece server-side kontrol edilir
// - Client tarafında admin state'e güvenilmez
// - /api/v2/admin/* rotaları kendi içinde aynı kontrolü yapar

import { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/guard";
import { getWidgetsByCategory } from "@/lib/admin/widgetRegistry";
import { LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import type { AdminWidget } from "@/lib/admin/widgetRegistry";

export const dynamic = "force-dynamic";

interface LayoutProps {
  children: ReactNode;
}

const CATEGORY_LABELS: Record<AdminWidget["category"], string> = {
  audit: "Denetim",
  content: "İçerik",
  users: "Kullanıcılar",
  system: "Sistem",
};

export default async function AdminLayout({ children }: LayoutProps) {
  // Server-side admin guard. Admin değilse /'ya redirect.
  const user = await requireAdmin();

  const grouped = getWidgetsByCategory();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* ─── Sidebar ──────────────────────────────────────────── */}
      <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-slate-900/40 flex flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold text-white">Admin Panel</h1>
          </div>
          <p className="text-[11px] text-white/50 truncate">
            {user.email}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Dashboard (ana sayfa) */}
          <Link
            href="/admin"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/5 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          {/* Kategori grupları */}
          {(Object.keys(grouped) as AdminWidget["category"][]).map((cat) => (
            <div key={cat}>
              <div className="px-3 mb-1.5 text-[10px] uppercase tracking-wider text-white/40 font-semibold">
                {CATEGORY_LABELS[cat]}
              </div>
              <div className="space-y-0.5">
                {grouped[cat].map((w) => {
                  const Icon = w.icon;
                  return (
                    <Link
                      key={w.id}
                      href={w.href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <Icon className="w-4 h-4 text-white/50" />
                      <span className="flex-1 truncate">{w.title}</span>
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
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Siteye Dön
          </Link>
        </div>
      </aside>

      {/* ─── Main content ─────────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
