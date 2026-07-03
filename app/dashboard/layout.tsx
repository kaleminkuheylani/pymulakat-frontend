// app/dashboard/layout.tsx
// Dashboard layout — auth gerekli, tüm dashboard route'ları buradan geçer.

"use client";

import { useUser } from "../../hooks/useUser";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const NAV = [
  { href: "/dashboard", label: "Ana Sayfa", icon: "🏠" },
  { href: "/dashboard/flow", label: "Akışım", icon: "🌊" },
  { href: "/dashboard/recommendations", label: "Öneriler", icon: "✨" },
  { href: "/dashboard/forms", label: "Topluluk", icon: "💬" },
  { href: "/dashboard/settings", label: "Ayarlar", icon: "⚙️" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

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
            <div className="mb-4 pb-4 border-b border-white/10">
              <div className="text-xs text-white/40 uppercase tracking-wide mb-1">Hoş geldin</div>
              <div className="font-semibold text-white">{user.username}</div>
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