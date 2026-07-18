// app/api/ai-feedback/usage/route.ts
//
// 2026-07-14: DB quota fetch proxy (Next.js → FastAPI backend).
//
// Akış:
//   1. Frontend useAiFeedback fetch → /api/ai-feedback/usage
//   2. Bu route backend'e GET /api/ai-feedback/usage proxy eder
//   3. Backend Supabase'den user_id (auth cookie) veya anon_id
//      (cookie) ile quota çeker
//   4. Response: { used, limit, remaining, periodEnd, isAnonymous }
//
// Auth: Cookie forward (sb-*-auth-token veya pymulakat_anon_id).
// Frontend BYOK user muaf (backend limit check'i yok).

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "https://pymulakat-backend-production.up.railway.app";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";

    const backendRes = await fetch(`${BACKEND_URL}/api/ai-feedback/usage`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
        // 2026-07-14 v4: Authorization header forward (Supabase JWT
        //   cookie'de yok, frontend'ten header'da geliyor). Backend
        //   get_current_user dependency ile user_id alır.
        Authorization: req.headers.get("authorization") || "",
      },
      cache: "no-store",
    });

    // 2026-07-14 v3 DEBUG: Header flow + response log

    // Backend response'unu olduğu gibi geçir (status + body + Set-Cookie!)
    // 2026-07-14 v2: Set-Cookie header forward KRITIK — yoksa backend'in
    //   pymulakat_anon_id cookie'si client'a ulaşmaz, her request'te
    //   yeni UUID oluşur, DB'de yeni satır = 0/5 (limit sifirlanmis görünür).
    const body = await backendRes.text();
    const responseHeaders = new Headers();
    const contentType = backendRes.headers.get("Content-Type");
    if (contentType) responseHeaders.set("Content-Type", contentType);
    // Tüm set-cookie header'larını ilet (backend birden fazla Set-Cookie gönderebilir)
    // 2026-07-14 v2: getSetCookie() Node 20+ / modern fetch — backend'in
    //   pymulakat_anon_id cookie'si client'a ulaşmazsa her request'te
    //   yeni UUID olusur, DB'de yeni satır = 0/5 görünür.
    const setCookies = (backendRes.headers as any).getSetCookie?.() || [];
    for (const cookie of setCookies) {
      responseHeaders.append("Set-Cookie", cookie);
    }
    return new NextResponse(body, {
      status: backendRes.status,
      headers: responseHeaders,
    });
  } catch (err) {
    // Backend unreachable — fallback boş response (frontend localStorage'a düşer)
    return NextResponse.json(
      { used: 0, limit: 10, remaining: 10, periodEnd: null, isAnonymous: true },
      { status: 200 },
    );
  }
}
