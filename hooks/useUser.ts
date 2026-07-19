// hooks/useUser.ts — Tek hook: Supabase client + /auth/me fetch + auto-refresh.
//
// 2026-07-19: SADELESTIRILDI — lib/auth.ts'teki getAccessToken TEK KAYNAK
// oldu. extractAccessToken ve tryRefreshToken helperlari burada duplicate
// olarak yasamaktaydi, hepsi kaldirildi. Supabase kendi autoRefreshToken
// mekanizmasini yonetir; biz sadece /auth/me'yi cagiriyoruz.

import { useState, useEffect, useCallback, useRef } from "react";
import { getSupabaseBrowser, clearAuthSentinel } from "./useSupabaseBrowser";
import { authAPI } from "../lib/api/authAPI";
import { hasAccessToken } from "../lib/auth";

const AUTH_EVENT = "auth-state-changed";

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  is_verified?: boolean;
  points?: number;
  total_attempts?: number;
  success_count?: number;
  fail_count?: number;
  success_rate?: number;
  solution_average_time?: number;
  solution_average_time_ms?: number;
  created_at?: string;
}

export function notifyAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
}

async function fetchMe(): Promise<UserResponse | null> {
  if (typeof window === "undefined") return null;
  if (!hasAccessToken()) return null;

  try {
    return await authAPI.getMe();
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
export function useUser() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  const fetchUser = useCallback(async () => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchMe();
      if (!mountedRef.current) return;
      setUser(data);
      if (data) {
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        localStorage.removeItem("user");
      }
    } catch (err: unknown) {
      if (!mountedRef.current) return;
      const message =
        err instanceof Error ? err.message : "Bilinmeyen hata";
      setError(message);
      setUser(null);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    // 📌 Mount sirasinda mevcut session varsa middleware cookie'yi
    // hemen set et. Bu sayede login olan kullanici sayfayi kapatsa
    // bile cookie TTL boyunca (24 saat) auth-gated sayfalara erisebilir.
    try {
      if (hasAccessToken()) {
        document.cookie = "pymulakat_auth=1; path=/; max-age=86400; SameSite=Lax";
      }
    } catch {
      // ignore
    }

    fetchUser();

    // Supabase tab'lar arası session değişikliğini dinle
    const supabase = getSupabaseBrowser();
    let sub: { unsubscribe: () => void } | null = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        // 📌 Middleware'in (Edge runtime) görebileceği server-readable cookie.
        // Supabase kendi storage'ini yazar (sb-pymulakat-auth-token) ama
        // chunked/base64url encoding, cookie name varyasyonlari gibi nedenlerle
        // middleware her zaman bulamiyor. Bu yüzden bizzat bir 'pymulakat_auth'
        // sentinel cookie set ediyoruz — middleware bunu ilk sirada kontrol eder.
        try {
          if (session?.access_token) {
            // 1 gün TTL, path=/, SameSite=Lax (CSRF korumasi + middleware erişimi)
            document.cookie = "pymulakat_auth=1; path=/; max-age=86400; SameSite=Lax";
          } else {
            document.cookie = "pymulakat_auth=; path=/; max-age=0; SameSite=Lax";
          }
        } catch {
          // ignore (SSR veya cookie disable)
        }
        fetchUser();
      });
      sub = data.subscription;
    }

    const onStorage = (e: StorageEvent) => {
      if (
        e.key === "token" ||
        e.key === "logout" ||
        e.key?.endsWith("-auth-token")
      ) {
        fetchUser();
      }
    };
    const onAuthChange = () => fetchUser();

    window.addEventListener("storage", onStorage);
    window.addEventListener(AUTH_EVENT, onAuthChange);
    // Attempt gönderildiğinde user stats'larını tazele (deneme/başarılı sayısı)
    const onAttemptSubmitted = () => fetchUser();
    window.addEventListener("pm:attempt-submitted", onAttemptSubmitted);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(AUTH_EVENT, onAuthChange);
      window.removeEventListener("pm:attempt-submitted", onAttemptSubmitted);
      sub?.unsubscribe();
    };
  }, [fetchUser]);

  const refresh = useCallback(() => fetchUser(), [fetchUser]);

  /**
   * 📌 Bulletproof logout — tek tıklamada TÜM auth izlerini temizler:
   * 1) Supabase official signOut (server-side session invalidate + kendi cookie temizliği)
   * 2) TÜM auth cookie'leri: sentinel + Supabase ana cookie + chunked cookie'ler
   * 3) TÜM localStorage auth keyleri
   * 4) React state + onAuthChange event
   * (Cagrilan yerde 5) window.location.assign("/") ile hard reload
   */
  const logout = useCallback(async () => {
    // (1) ÖNCE Supabase official signOut — kendi localStorage + cookie
    //     temizliğini yapar (setAll(cookie max-age=0) cagirir). Bu sayede
    //     logout yarışında Supabase state'i temizlenmIS kalmiyor.
    const supabase = getSupabaseBrowser();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {;
      }
    }

    // (2) Belt-and-suspenders: belt = cookie'ler (Supabase bazen sessiz
    //     birakabilir, özellikle custom setAll wrapper'i ile), suspenders =
    //     localStorage. İkisi de elle nuke edilir.
    if (typeof document !== "undefined") {
      const cookieNamesToDelete = [
        "pymulakat_auth",
        "sb-pymulakat-auth-token",
        "sb-pymulakat-auth-token-code-verifier",
        "token",
      ];
      for (const name of cookieNamesToDelete) {
        // Tüm olası path/domain varyantlarında sil
        document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
        document.cookie = `${name}=; path=/; max-age=0`;
        document.cookie = `${name}=; path=/; domain=${window.location.hostname}; max-age=0`;
      }
      // Supabase'in yazmış olabileceği chunked cookie'leri de temizle
      const allCookies = document.cookie.split(";");
      for (const c of allCookies) {
        const name = c.split("=")[0].trim();
        if (
          name.startsWith("sb-pymulakat-auth-token-chunk-") ||
          name === "sb-pymulakat-auth-token-refresh-token" ||
          name.startsWith("sb-") && name.includes("-auth")
        ) {
          document.cookie = `${name}=; path=/; max-age=0`;
        }
      }
    }

    // (3) TÜM localStorage auth keyleri — wildcard sweep + bilinen isimler
    try {
      const keysToRemove = new Set<string>();
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k) keysToRemove.add(k);
      }
      keysToRemove.add("token");
      keysToRemove.add("refresh_token");
      keysToRemove.add("user");
      keysToRemove.add("logout");
      keysToRemove.add("sb-pymulakat-auth-token");
      keysToRemove.add("sb-pymulakat-auth-token-code-verifier");
      for (const k of keysToRemove) localStorage.removeItem(k);
    } catch { /* ignore */ }

    // (4) React state + broadcast (storage event'i dinleyen diger tab'lara da)
    setUser(null);
    notifyAuthChange();

    try { clearAuthSentinel(); } catch { /* ignore */ }
  }, []);

  return { user, loading, error, refresh, logout };
}

