"use client";

// LogoutButton — admin panel sidebar için client component.
//
// Cross-origin cookie sorunu: backend farklı domain'de (railway.app),
// Set-Cookie: Domain=pythonmulakat.com modern tarayıcılarda reddedilir.
// Çözüm: Backend session revoke + client-side document.cookie temizleme.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
      // 1) Backend: DB'deki session'ı revoke et
      await fetch(`${API_BASE}/api/v2/admin/auth/logout`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {
        // silent — backend zaten cookie'yi silemez (cross-origin)
      });
    } finally {
      // 2) Client-side cookie temizle
      // Max-Age=0 + Path=/ → tarayıcı expire eder
      try {
        document.cookie = "admin_session=; Path=/; Max-Age=0; SameSite=Lax";
      } catch {
        /* ignore */
      }
      // 3) Login sayfasına yönlendir
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-rose-300 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
    >
      <LogOut className="w-4 h-4" />
      {loading ? "Çıkış yapılıyor..." : "Oturumu Kapat"}
    </button>
  );
}
