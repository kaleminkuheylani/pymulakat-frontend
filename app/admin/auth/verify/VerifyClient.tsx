"use client";

// app/admin/auth/verify/VerifyClient.tsx
// Token'i backend'e yolla, Set-Cookie response'dan al, /admin'e redirect.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

export default function VerifyClient({ token, apiBase }: { token: string; apiBase: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${apiBase}/api/v2/admin/auth/verify?token=${encodeURIComponent(token)}`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          // Backend Set-Cookie header set etti (HttpOnly + SameSite=Strict)
          // Ama cross-origin oldugu icin browser otomatik kaydetmeyebilir.
          // CORS ayari gerekli (backend'de ALLOWED_ORIGINS).
          // Simdilik: 2sn sonra /admin'e yonlendir, cookie orada kontrol edilir.
          // Eger cookie yoksa admin guard /admin/login'e yonlendirir.
          setTimeout(() => {
            window.location.href = "/admin";
          }, 1500);
        } else {
          const data = await res.json().catch(() => ({}));
          setError(data.detail || `Token dogrulanamadi (HTTP ${res.status})`);
        }
      } catch (err: any) {
        setError(err?.message || "Baglanti hatasi");
      }
    };
    verify();
  }, [token, apiBase, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 mb-3">
            <AlertCircle className="w-7 h-7 text-rose-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-rose-400">Giris Basarisiz</h1>
          <p className="text-white/60 text-sm mb-6">{error}</p>
          <a href="/admin/login" className="inline-block px-6 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-semibold">
            Tekrar Dene
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-3">
          <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Dogrulaniyor</h1>
        <p className="text-white/60 text-sm">Magic link kontrol ediliyor...</p>
      </div>
    </div>
  );
}
