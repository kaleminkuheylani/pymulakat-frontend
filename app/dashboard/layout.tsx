// app/dashboard/layout.tsx
// Dashboard layout — auth gerekli, tüm dashboard route'ları buradan geçer.

"use client";

import { useUser } from "../../hooks/useUser";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV = [
  { href: "/dashboard", label: "Akışım", icon: "✨" },
  { href: "/dashboard/forms", label: "Topluluk", icon: "💬" },
  { href: "/dashboard/recommendations", label: "Öneriler", icon: "🎯" },
  { href: "/dashboard/settings", label: "Ayarlar", icon: "⚙️" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 📌 Middleware tek kapı: /dashboard* için auth kontrolünü zaten yapıyor.
  // Layout'a user geldiyse authenticated demektir. Client-side redirect yok.
  const { user, loading } = useUser();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 h-fit md:sticky md:top-4">
            <div className="mb-4 pb-4 border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                  {(user.username || "U").slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white/40 uppercase tracking-wide">Hoş geldin</div>
                  <div className="font-semibold text-white truncate">{user.username}</div>
                </div>
              </div>

              {/* 📌 Stats — dashboard'a girer girmez görsün */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white/[0.04] rounded-lg p-2">
                  <div className="text-base font-bold text-amber-400">{user.total_attempts || 0}</div>
                  <div className="text-[10px] text-white/40">Deneme</div>
                </div>
                <div className="bg-white/[0.04] rounded-lg p-2">
                  <div className="text-base font-bold text-emerald-400">{user.success_count || 0}</div>
                  <div className="text-[10px] text-white/40">Başarılı</div>
                </div>
                <div className="bg-white/[0.04] rounded-lg p-2">
                  <div className="text-base font-bold text-indigo-400">{Math.round(user.success_rate || 0)}%</div>
                  <div className="text-[10px] text-white/40">Oran</div>
                </div>
              </div>
            </div>
            <nav className="space-y-1">
              {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-indigo-500/20 text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}