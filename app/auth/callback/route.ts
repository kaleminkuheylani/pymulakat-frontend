// app/auth/callback/route.ts
//
// TEK DOSYA — server-side OAuth callback handler. /login + /auth/callback
// arasindaki PKCE code_verifier cookie kaybi sorununu cozer: butun
// is server'da yapilir, code_verifier server cookie'de kalir, exchange
// sonrasi response cookie Supabase'in httpOnly session cookie'lerini
// yazar + 302 redirect ile /dashboard'a (veya returnUrl'e) yonlendir.
//
// Desteklenen akislar (Supabase redirect parametrelerine gore):
//   - PKCE OAuth (?code=...) — default yeni Supabase
//   - Implicit OAuth (#access_token=...) — eski Supabase / custom flow
//   - Magic link (Supabase implicit session'i okur)
//   - Email confirmation (?code=..., type=signup veya email)
//   - Password recovery (type=recovery)
//
// 2026-07-19: @supabase/ssr server-side code_verifier cookie'leri paylasir.

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pythonmulakat.com";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const returnUrl = url.searchParams.get("returnUrl") || "/dashboard";
  const safeReturn = returnUrl.startsWith("/") ? returnUrl : "/dashboard";
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type"); // "signup" | "recovery" | "email" | "magiclink"

  // 302 redirect helper — response cookie'leri tasimak icin mutlaka NextResponse
  // dondurmeliyiz, setAll wrapper'i onun uzerine yazacak.
  function redirect(path: string, extras?: { error?: string }) {
    const target = new URL(path.startsWith("http") ? path : `${SITE_URL}${path}`, SITE_URL);
    if (extras?.error) target.searchParams.set("error", extras.error);
    const res = NextResponse.redirect(target);
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // Supabase server client — server-side cookie yonetimi
  function makeClient(response: NextResponse) {
    return createServerClient(
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
  }

  // ── 1) PKCE / email-link flow: ?code=... veya ?token_hash=...&type=... ──
  if (code || tokenHash) {
    const response = NextResponse.redirect(new URL(safeReturn, SITE_URL));
    response.headers.set("Cache-Control", "no-store");
    const supabase = makeClient(response);

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) return redirect("/login", { error: error.message });
      // PKCE success — httpOnly session cookie'ler response'a yazildi
      // Sentinel cookie'yi de ekle (middleware server-side auth gate)
      response.cookies.set("pymulakat_auth", "1", {
        path: "/",
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
        httpOnly: false,
      });
      return response;
    }

    if (tokenHash) {
      const verifyType =
        type === "recovery" || type === "signup" || type === "email_change" || type === "magiclink"
          ? type
          : "email";
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: verifyType,
      });
      if (error) return redirect("/login", { error: error.message });
      // Recovery akisinda reset-password'e yonlendir
      if (verifyType === "recovery") {
        const r = NextResponse.redirect(new URL("/auth/reset-password", SITE_URL));
        r.headers.set("Cache-Control", "no-store");
        // session cookie'lerini de tasimak icin
        for (const c of response.cookies.getAll()) {
          r.cookies.set(c.name, c.value, {
            path: c.path,
            maxAge: c.maxAge,
            sameSite: c.sameSite as any,
            httpOnly: c.httpOnly,
            secure: c.secure,
          });
        }
        return r;
      }
      response.cookies.set("pymulakat_auth", "1", {
        path: "/",
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
        httpOnly: false,
      });
      return response;
    }
  }

  // ── 2) Implicit flow fallback: URL hash'te access_token (Supabase legacy) ──
  // Bu server'da calismaz (hash browser-only), bu yuzden bir client page'e yonlendir.
  // Yine de /auth/callback sayfa yolu icin kisa bir not: Supabase yeni default
  // PKCE oldugu icin bu nadirdir; callback client page artik yok, gerekirse
  // kullanici login sayfasina yonlendirilir.
  return redirect("/login", { error: "implicit_flow_use_pkce" });
}
