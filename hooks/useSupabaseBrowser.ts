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
import { serialize, parse } from "cookie";
import type { SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Sentinel cookie'yi document.cookie'ye yaz. Login sonrası server tarafında
 * /python-egitimi ve /python-kodlari guard'larını geçmek için.
 */
function writeSentinelCookie(): void {
  if (typeof document === "undefined") return;
  try {
    document.cookie =
      "pymulakat_auth=1; path=/; max-age=86400; SameSite=Lax";
  } catch {
    /* ignore */
  }
}

function clearSentinelCookie(): void {
  if (typeof document === "undefined") return;
  try {
    document.cookie = "pymulakat_auth=; path=/; max-age=0; SameSite=Lax";
  } catch {
    /* ignore */
  }
}

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
      detectSessionInUrl: true,
      // 2026-07-19: "implicit" — Supabase yeni PKCE flow @supabase/ssr'nin
      // code_verifier cookie'lerini SSR arayüzünde kaybedebiliyor ("PKCE code
      // verifier not found in storage"). Implicit flow access_token'i hash
      // fragment'te doner, code_verifier gerektirmez — daha guvenilir.
      flowType: "implicit",
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
        if (hasAuthToken) writeSentinelCookie();
      },
      // getAll: @supabase/ssr default documentCookieGetAll davranışı
      getAll: () => {
        if (typeof document === "undefined") return [];
        const parsed = parse(document.cookie || "");
        if (!parsed) return [];
        const arr = Array.isArray(parsed) ? parsed : Object.values(parsed);
        return (arr as any[]).map((c: any) => ({
          name: c.name ?? "",
          value: c.value ?? "",
        }));
      },
    },
  });

  return _client;
}

/**
 * Logout'ta sentinel'i temizle. useUser.ts içinden çağrılabilir.
 */
export function clearAuthSentinel(): void {
  clearSentinelCookie();
}

/** Client'ı sıfırla (logout sonrası veya env değişikliği için). */
export function resetSupabaseBrowser() {
  _client = null;
}
