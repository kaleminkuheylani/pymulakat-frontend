// app/dashboard/layout.tsx
// Dashboard layout — auth gerekli, tüm dashboard route'ları buradan geçer.

"use client";

import { useUser } from "../../hooks/useUser";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

const NAV = [
  { href: "/dashboard", label: "Akışım", icon: "✨" },
  { href: "/dashboard/forms", label: "Topluluk", icon: "💬" },
  { href: "/dashboard/recommendations", label: "Öneriler", icon: "🎯" },
  { href: "/dashboard/settings", label: "Ayarlar", icon: "⚙️" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 📌 Middleware tek kapı: /dashboard* için auth kontrolünü zaten yapıyor.
  // Layout'a user geldiyse authenticated demektir. Client-side redirect yok.
  const { user, loading, logout } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  // 2026-07-15: Dashboard'a gelince geri tuşunu inaktif yap
  //   - Mevcut sayfayı history'de replace et (back stack'e ekleme)
  //   - popstate event'inde mevcut sayfaya geri dön (sonsuz döngü önlemi)
  useEffect(() => {
    if (typeof window === "undefined") return;
    // İlk dashboard yüklendiğinde history entry'yi değiştir
    window.history.replaceState(
      { dashboard: true, ts: Date.now() },
      "",
      window.location.href,
    );

    const handlePopState = () => {
      // Kullanıcı geri tuşuna bastı → mevcut sayfada kal (dashboard'ta)
      window.history.pushState(
        { dashboard: true, ts: Date.now() },
        "",
        window.location.href,
      );
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Auth gerektirip giriş yapılmamışsa login'e yönlendir
  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, pathname, router]);

  // 2026-07-15: Çıkış → landing page'e yönlendir
  const handleLogout = async () => {
    await logout();
    if (typeof window !== "undefined") {
      // Logout sonrası back stack temizle → landing'den geri dönülemez
      window.history.replaceState(null, "", "/");
      window.location.assign("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050816] text-white flex justify-center">
      <div className="w-[80%] max-w-5xl mx-auto px-4 md:px-6 py-6">
        {/* Üst bar — merkezi, tek kolon, sidebar YOK */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
              {(user.username || "U").slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white/40 uppercase tracking-wide">Hoş geldin</div>
              <div className="font-semibold text-white truncate">{user.username}</div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-white/50 hover:text-rose-300 transition-colors px-2 py-1 rounded"
              title="Çıkış Yap"
            >
              🚪
            </button>
          </div>

          {/* 📌 Stats — dashboard'a girer girmez görsün */}
          <div className="grid grid-cols-3 gap-2 text-center mb-4">
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

          {/* 2026-07-15: Nav (yatay) + Hemen Başla — sidebar kaldırıldı */}
          <nav className="flex flex-wrap gap-1.5">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? "bg-indigo-500/20 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/interviews"
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition-colors"
            >
              ⚡ Hemen Başla
            </Link>
          </nav>
        </div>

        {/* Main content — merkezi */}
        <main>{children}</main>
      </div>
    </div>
  );
}