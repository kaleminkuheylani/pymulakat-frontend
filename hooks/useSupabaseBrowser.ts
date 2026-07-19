// hooks/useSupabaseBrowser.ts
// Browser-side Supabase client — @supabase/ssr ile cookie + localStorage dual storage.
// Hem email verification, hem OAuth callback, hem password recovery akışlarını destekler.
//
// 📌 Auth gate middleware'in (Edge runtime) her session oluşumunda
// `pymulakat_auth` sentinel cookie'yi görebilmesi için createBrowserClient'a
// özel `cookies.setAll` wrapper enjekte ediyoruz. Supabase session cookie'lerini
// document.cookie'ye yazdığı her anda, biz de aynı transaction içinde
// sentinel'i set ediyoruz — böylece login/OAuth/refresh/register akışlarının
// HEPSİNDE middleware cookie'yi görür.

import { createBrowserClient } from "@supabase/ssr";
import { serialize } from "cookie";
import type { SupabaseClient } from "@supabase/supabase-js";
import { setAuthSentinel } from "../lib/auth-sentinel";

let _client: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (typeof window === "undefined") return null;

  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY tanımlı değil!"
    );
  }

  _client = createBrowserClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // 2026-07-19: detectSessionInUrl=false — server-side redirect ile code
      // geldiginde auto-detect gostermiyor. /auth/callback page.tsx useEffect
      // icinde exchangeCodeForSession(code) MANUEL cagirir.
      detectSessionInUrl: false,
      flowType: "pkce",
      storageKey: "sb-pymulakat-auth-token",
    },
    cookies: {
      // setAll: @supabase/ssr'nin default documentCookieSetAll davranışını
      // birebir taklit eder + sentinel cookie'yi SENKRONIZE yazar.
      setAll: (cookies: any[]) => {
        if (typeof document === "undefined") return;
        for (const { name, value, options } of cookies) {
          document.cookie = serialize(name, value, options);
        }
        // Sentinel — auth-token yazıldıysa, üye authenticated
        const hasAuthToken = cookies.some((c) =>
          /auth-token(?!-code-verifier)/.test(c.name)
        );
        if (hasAuthToken) setAuthSentinel();
      },
      // getAll: document.cookie'yi {name,value} dizisine çevir.
      getAll: () => {
        if (typeof document === "undefined") return [];
        return document.cookie.split(";").map((part) => {
          const idx = part.indexOf("=");
          if (idx === -1) return { name: part.trim(), value: "" };
          return {
            name: part.slice(0, idx).trim(),
            value: part.slice(idx + 1).trim(),
          };
        });
      },
    },
  });

  return _client;
}

/** Client'ı sıfırla (logout sonrası veya env değişikliği için). */
export function resetSupabaseBrowser() {
  _client = null;
}
