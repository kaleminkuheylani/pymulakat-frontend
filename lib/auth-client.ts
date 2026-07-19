// lib/auth-client.ts
//
// TEK KAYNAK — Supabase browser client uzerinden OAuth islemleri.
// Browser-side signInWithOAuth cagirir, PKCE code_verifier browser
// localStorage'da saklanir, /auth/callback?code=xxx Supabase client
// tarafindan otomatik algilanir (detectSessionInUrl=true).

import { getSupabaseBrowser } from "../hooks/useSupabaseBrowser";
import type { Provider } from "@supabase/supabase-js";

export interface SignInResult {
  ok: boolean;
  error?: string;
}

/**
 * OAuth (google / github) akisi — Supabase provider'a yonlendirir.
 * PKCE code_verifier browser localStorage'da olusturulur, callback'te
 * ayni client tarafindan okunur.
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
      ...(payload.provider === "github"
        ? { scopes: "read:user user:email" }
        : {}),
    },
  });
  if (error) {
    return { ok: false, error: error.message || "OAuth başlatılamadı" };
  }
  return { ok: true };
}
