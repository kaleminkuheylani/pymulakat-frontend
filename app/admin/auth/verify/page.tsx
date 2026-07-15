import VerifyClient from "./VerifyClient";
// app/admin/auth/verify/page.tsx
// 2026-07-15: Magic link verification — token ile cookie set + redirect.
//
// Backend GET /api/v2/admin/auth/verify?token=... zaten:
//   - Token dogrular
//   - Session JWT olusturur
//   - HttpOnly cookie set eder
//   - HTML response doner (auto-redirect to /admin)
//
// Bu sayfa proxy gibi davranir: client-side'da token'i alip backend'e
// fetch eder, response cookie'sini kaydeder, sonra /admin'e yonlendirir.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.INTERNAL_API_URL ||
  "https://pymulakat-backend-production.up.railway.app";

export const dynamic = "force-dynamic";

interface SearchParams {
  token?: string;
  error?: string;
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { token, error } = await searchParams;

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-3 text-rose-400">Giris Basarisiz</h1>
          <p className="text-white/60 text-sm">{decodeURIComponent(error)}</p>
          <a href="/admin/login" className="mt-6 inline-block text-amber-300 underline">
            Tekrar dene
          </a>
        </div>
      </div>
    );
  }

  if (!token) {
    redirect("/admin/login");
  }

  // Server-side: backend GET /api/v2/admin/auth/verify?token=... cagir
  // Backend zaten Set-Cookie header ile admin_session cookie'si set eder.
  // Next.js server component bu cookie'yi set edemez (response objesi yok),
  // bu yuzden client-side fetch kullanacagiz.
  // Burada sadece token'i client'e pass edelim.

  return <VerifyClient token={token} apiBase={API_BASE} />;
}

