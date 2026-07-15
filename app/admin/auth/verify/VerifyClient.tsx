"use client";

// app/admin/auth/verify/VerifyClient.tsx
// 2026-07-15: Magic link verification — direkt backend URL'ine navigate.
//
// Backend GET /api/v2/admin/auth/verify?token=... zaten:
//   - Token dogrular
//   - Session JWT olusturur
//   - Set-Cookie (SameSite=None; Secure) + 302 redirect
//   - Redirect hedefi: FRONTEND_URL/admin
//
// Bu sayfa proxy degil — sadece backend verify URL'ine yonlendirir.

import { useEffect } from "react";

export default function VerifyClient({ token, apiBase }: { token: string; apiBase: string }) {
  useEffect(() => {
    // Direkt backend verify URL'ine navigate (Set-Cookie browser'a set olur)
    window.location.href = `${apiBase}/api/v2/admin/auth/verify?token=${encodeURIComponent(token)}`;
  }, [token, apiBase]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-3">
          <div className="w-7 h-7 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Yonlendiriliyor</h1>
        <p className="text-white/60 text-sm">Magic link dogrulaniyor...</p>
      </div>
    </div>
  );
}
