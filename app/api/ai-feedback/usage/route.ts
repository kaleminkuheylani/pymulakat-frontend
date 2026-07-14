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
      },
      cache: "no-store",
    });

    // Backend response'unu olduğu gibi geçir (status + body)
    const body = await backendRes.text();
    return new NextResponse(body, {
      status: backendRes.status,
      headers: {
        "Content-Type": backendRes.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (err) {
    // Backend unreachable — fallback boş response (frontend localStorage'a düşer)
    return NextResponse.json(
      { used: 0, limit: 10, remaining: 10, periodEnd: null, isAnonymous: true },
      { status: 200 },
    );
  }
}
