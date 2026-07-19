// hooks/useUser.ts — Tek hook: Supabase client + /auth/me fetch + auto-refresh.
//
// 2026-07-19: SADELESTIRILDI — lib/auth.ts'teki getAccessToken TEK KAYNAK
// oldu. extractAccessToken ve tryRefreshToken helperlari burada duplicate
// olarak yasamaktaydi, hepsi kaldirildi. Supabase kendi autoRefreshToken
// mekanizmasini yonetir; biz sadece /auth/me'yi cagiriyoruz.

import { useState, useEffect, useCallback, useRef } from "react";
import { getSupabaseBrowser } from "./useSupabaseBrowser";
import { authAPI } from "../lib/api/authAPI";
import { isAuthenticatedClient } from "../lib/auth";
import { setAuthSentinel, clearAuthSentinel } from "../lib/auth-sentinel";

const AUTH_EVENT = "auth-state-changed";

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  is_verified?: boolean;
  points?: number;
  attempt_points?: number;
  achievement_points?: number;
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
  if (!isAuthenticatedClient()) return null;

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
    // 📌 Sentinel cookie login/OAuth callback sirasinda setAuthSentinel()
    // ile zaten yazilir; burada sadece fetchUser tetiklenir (isAuthenticatedClient
    // sentinel'i fetchMe icinde kontrol eder).
    fetchUser();

    // Supabase tab'lar arası session değişikliğini dinle
    const supabase = getSupabaseBrowser();
    let sub: { unsubscribe: () => void } | null = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.access_token) setAuthSentinel();
        else clearAuthSentinel();
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
      // Sentinel cookie — tek kaynak lib/auth-sentinel.ts
      clearAuthSentinel();
      const cookieNamesToDelete = [
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
  }, []);

  return { user, loading, error, refresh, logout };
}

