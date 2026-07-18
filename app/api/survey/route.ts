// app/api/survey/route.ts
//
// 2026-07-18: Onboarding anket API proxy.
// Frontend bu endpoint'i çağırır, cookie auth'u Vercel proxy'de yönetilir
// (sb-*-auth-token httpOnly cookie) → backend'e Bearer olarak iletilir.

import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "https://pymulakat-backend-production.up.railway.app";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getAuthHeader(req: Request): Promise<Record<string, string>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  // Authorization header varsa (nadir, server-side call)
  const auth = req.headers.get("authorization");
  if (auth) headers["Authorization"] = auth;

  // Cookie'leri ilet (Supabase httpOnly cookie backend'e gidebilmesi için)
  const cookie = req.headers.get("cookie");
  if (cookie) headers["Cookie"] = cookie;

  return headers;
}

export async function GET(req: Request) {
  try {
    const headers = await getAuthHeader(req);
    const res = await fetch(`${BACKEND}/api/v2/survey/status`, {
      method: "GET",
      headers,
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json(
      { dismissed: true, has_response: false, error: "proxy_error" },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const headers = await getAuthHeader(req);
    const res = await fetch(`${BACKEND}/api/v2/survey`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "proxy_error" },
      { status: 200 }
    );
  }
}
