// app/api/auth/session/route.ts
//
// OAuth callback'ten gelen access_token + refresh_token'i alip
// Supabase SSR httpOnly cookie'ye yazar. Sonra /auth/me bu cookie'den user okur.

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { access_token, refresh_token } = body;

    if (!access_token || !refresh_token) {
      return NextResponse.json(
        { ok: false, error: "access_token ve refresh_token gerekli" },
        { status: 400 }
      );
    }

    // Response cookie — Supabase SSR'in yazacagi
    const response = NextResponse.json({ ok: true });

    // Supabase server client — cookie islemleri icin
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            for (const { name, value, options } of cookiesToSet) {
              response.cookies.set(name, value, options);
            }
          },
        },
      }
    );

    // setSession — Supabase'in httpOnly cookie'lerini yaz
    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 401 }
      );
    }

    return response;
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message || "Bilinmeyen hata" },
      { status: 500 }
    );
  }
}
