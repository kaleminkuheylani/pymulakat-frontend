// app/api/ai-feedback/increment/route.ts
//
// 2026-07-14: DB quota increment proxy (Next.js → FastAPI backend).
//
// AI feedback success sonrası frontend bu endpoint'i çağırır.
// Backend Supabase'de used_count++ yapar (atomik FOR UPDATE).
//
// Auth: Cookie forward (sb-*-auth-token veya pymulakat_anon_id).
// BYOK user frontend quota çağırmaz (limit muaf).

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "https://pymulakat-backend-production.up.railway.app";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const body = await req.text();

    const backendRes = await fetch(`${BACKEND_URL}/api/ai-feedback/increment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body,
      cache: "no-store",
    });

    const responseBody = await backendRes.text();
    return new NextResponse(responseBody, {
      status: backendRes.status,
      headers: {
        "Content-Type": backendRes.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (err) {
    // Backend unreachable — frontend fallback localStorage
    return NextResponse.json(
      { used: 0, limit: 10, remaining: 10, allowed: false },
      { status: 200 },
    );
  }
}
