// app/api/admin/auth/callback/route.ts
// 2026-07-15: Backend verify proxy + Set-Cookie kopyalama (same-origin cookie)
//
// Akis:
//   1. Email'de magic link: https://pythonmulakat.com/api/admin/auth/callback?token=...
//   2. Bu route server-side backend'e fetch eder
//   3. Backend Set-Cookie header'ini Next.js response'a kopyalar
//   4. Cookie SAME-ORIGIN'de (Vercel) set olur (cross-domain sorun yok)
//   5. /admin'e redirect

import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.INTERNAL_API_URL ||
  "https://pymulakat-backend-production.up.railway.app";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Server-side: backend /api/v2/admin/auth/verify?token=... cagir
  const backendUrl = `${API_BASE}/api/v2/admin/auth/verify?token=${encodeURIComponent(token)}`;
  
  let backendRes: Response;
  try {
    backendRes = await fetch(backendUrl, {
      method: "GET",
      redirect: "manual",  // 302'yi manual olarak isle
    });
  } catch (err) {
    console.error("[admin/callback] backend fetch error:", err);
    return NextResponse.redirect(
      new URL("/admin/login?error=" + encodeURIComponent("Backend baglanti hatasi"), request.url)
    );
  }

  // Backend 302 redirect: Set-Cookie header'i al
  // Backend redirect target'i: FRONTEND_URL/admin (c06100c commit)
  // Biz /admin'e redirect ediyoruz (same-origin)
  const response = NextResponse.redirect(new URL("/admin", request.url), { status: 302 });

  // Backend Set-Cookie header'ini Next.js response'a kopyala
  // Backend 'admin_session=...; Domain=.pythonmulakat.com; ...' set eder
  // Next.js bunu oldugu gibi forward eder → cookie Vercel domain'inde set olur
  const setCookieHeader = backendRes.headers.get("set-cookie");
  if (setCookieHeader) {
    response.headers.set("set-cookie", setCookieHeader);
  } else {
    // Backend Set-Cookie gondermedi (404/500 olabilir)
    console.error("[admin/callback] backend Set-Cookie yok, status:", backendRes.status);
    return NextResponse.redirect(
      new URL("/admin/login?error=" + encodeURIComponent("Token gecersiz veya suresi dolmus"), request.url)
    );
  }

  return response;
}
