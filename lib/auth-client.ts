// lib/auth-client.ts
//
// TEK KAYNAK — Supabase browser client üzerinden tüm auth islemleri.
// Login sayfasi, register sayfasi, OAuth handler, callback handler hep
// buradan gecer. Inline `createClient` veya duplicate helper olmaz.
//
// Akis:
//   signInWithPassword()   → Supabase oturum acar, kendi storage'ini yazar
//   signInWithOAuth()      → /auth/callback'e hash'le redirect
//   register()             → backend /auth/register + email verification kodu
//   verifyEmail()          → backend /auth/verify-email (6 haneli kod)
//   resendCode()           → backend /auth/resend-code
//
// Token / cookie yonetimi lib/auth.ts ve hooks/useUser.ts'in isidir.

import { getSupabaseBrowser } from "../hooks/useSupabaseBrowser";
import type { Provider } from "@supabase/supabase-js";

export interface SignInResult {
  ok: boolean;
  error?: string;
  needsVerification?: boolean;
  email?: string;
}

/**
 * Email + password ile Supabase signIn. Supabase kendi storage'ini
 * (`sb-pymulakat-auth-token` JSON) yazar, sentinel cookie zaten
 * useSupabaseBrowser.setAll wrapper'inda set edilir.
 */
export async function signInWithPassword(payload: {
  email: string;
  password: string;
}): Promise<SignInResult> {
  const supabase = getSupabaseBrowser();
  if (!supabase) {
    return { ok: false, error: "Supabase client yüklenemedi" };
  }
  const { data, error } = await supabase.auth.signInWithPassword(payload);
  if (error) {
    const msg = (error.message || "").toLowerCase();
    if (msg.includes("email not confirmed") || msg.includes("not verified")) {
      return { ok: false, error: "E-posta adresin doğrulanmamış", needsVerification: true, email: payload.email };
    }
    if (msg.includes("invalid login credentials")) {
      return { ok: false, error: "E-posta veya şifre hatalı" };
    }
    return { ok: false, error: error.message || "Giriş başarısız" };
  }
  if (!data.session) {
    return { ok: false, error: "Oturum açılamadı" };
  }
  return { ok: true };
}

/**
 * OAuth (google / github) akisi — Supabase provider'a yonlendirir.
 * Callback URL returnUrl parametresi tasir. Auth state Supabase tarfindan
 * yonetilir; token'lar hash fragment ile callback'e gelir.
 */
export async function signInWithOAuth(payload: {
  provider: Provider;
  returnUrl: string;
}): Promise<SignInResult> {
  const supabase = getSupabaseBrowser();
  if (!supabase) {
    return { ok: false, error: "Supabase client yüklenemedi" };
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: payload.provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback?returnUrl=${encodeURIComponent(payload.returnUrl)}`,
      ...(payload.provider === "google"
        ? { queryParams: { access_type: "offline", prompt: "consent" } }
        : {}),
    },
  });
  if (error) {
    return { ok: false, error: error.message || "OAuth başlatılamadı" };
  }
  return { ok: true };
}
