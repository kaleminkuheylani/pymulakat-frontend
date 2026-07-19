// lib/auth-client.ts
//
// TEK KAYNAK — Supabase browser client uzerinden OAuth islemleri.
// 2026-07-19: Sadece OAuth (Google + GitHub). Email/sifre akisi kaldirildi.

import { getSupabaseBrowser } from "../hooks/useSupabaseBrowser";
import type { Provider } from "@supabase/supabase-js";

export interface SignInResult {
  ok: boolean;
  error?: string;
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
