// app/api/auth/oauth/[provider]/route.ts
//
// Server-side OAuth akisi. /login'den buton yerine bu endpoint'e redirect
// edilir. Supabase server client ile OAuth URL uretilir (code_verifier
// server cookie'de), browser Supabase'e yonlendirilir, callback'te
// /auth/callback?code=xxx server route'unda exchange edilir.
//
// code_verifier HAYAT BOYU server cookie'de kalir — localStorage/browser
// cookie cross-storage sorunu YASAK.

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pythonmulakat.com";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  if (provider !== "google" && provider !== "github") {
    return NextResponse.json({ error: "invalid provider" }, { status: 400 });
  }

  const url = new URL(request.url);
  const returnUrl = url.searchParams.get("returnUrl") || "/dashboard";
  const safeReturn = returnUrl.startsWith("/") ? returnUrl : "/dashboard";

  // Response objesi — setAll() bu uzerine cookie yazacak
  const response = NextResponse.json({ ok: true });
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

  // Supabase server-side OAuth URL — code_verifier server cookie'de uretilir
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as "google" | "github",
    options: {
      redirectTo: `${SITE_URL}/auth/callback?returnUrl=${encodeURIComponent(safeReturn)}`,
      ...(provider === "google"
        ? { queryParams: { access_type: "offline", prompt: "consent" } }
        : {}),
    },
  });

  if (error || !data?.url) {
    return NextResponse.json(
      { error: error?.message || "OAuth URL üretilemedi" },
      { status: 500 }
    );
  }

  // Browser'i Supabase OAuth URL'ine yonlendir. code_verifier cookie
  // response.cookies'a yazildi, redirect ile birlikte browser'a tasinir.
  // Callback'te server route ayni cookie'yi okur.
  const redirectResponse = NextResponse.redirect(data.url);
  // code_verifier cookie'lerini redirect response'a kopyala
  for (const c of response.cookies.getAll()) {
    redirectResponse.cookies.set(c.name, c.value, {
      path: c.path,
      maxAge: c.maxAge,
      sameSite: c.sameSite as any,
      httpOnly: c.httpOnly,
      secure: c.secure,
    });
  }
  return redirectResponse;
}
