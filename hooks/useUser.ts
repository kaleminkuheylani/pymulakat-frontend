// hooks/useUser.ts — Supabase SSR tabanlı, çoklu kaynaklardan token çıkarımı + auto-refresh.

import { useState, useEffect, useCallback, useRef } from "react";
import { getSupabaseBrowser, clearAuthSentinel } from "./useSupabaseBrowser";

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

// ═══════════════════════════════════════════════════════════════
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";

/**
 * Supabase'in kullandığı storage key'leri dahil tüm olası konumlardan access_token çıkar.
 * @supabase/ssr hem localStorage hem cookie kullanabilir; biz her iki kaynağı da tarıyoruz.
 */
function extractAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  // 1) Bilinen storage key'ler
  const knownKeys = [
    "sb-pymulakat-auth-token",
    "sb-pymulakat-auth-token-code-verifier", // PKCE
  ];
  for (const key of knownKeys) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      const token =
        parsed?.access_token ||
        parsed?.currentSession?.access_token ||
        parsed?.session?.access_token;
      if (token) return token;
    } catch {
      // ignore
    }
  }

  // 2) "-auth-token" ile biten tüm key'leri tara
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.endsWith("-auth-token") || knownKeys.includes(key)) continue;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      const token =
        parsed?.access_token ||
        parsed?.currentSession?.access_token ||
        parsed?.session?.access_token;
      if (token) return token;
    } catch {
      // ignore
    }
  }

  // 3) Plain "token" key'i (backend'in eski login endpoint'i için fallback)
  const plain = localStorage.getItem("token");
  if (plain) return plain;

  // 4) Cookies (SSR tarayıcıya yazabilir)
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split(";");
    for (const c of cookies) {
      const [k, v] = c.trim().split("=");
      if (k && v && (k.includes("auth-token") || k.includes("access-token"))) {
        try {
          const decoded = decodeURIComponent(v);
          // JWT formatı (header.payload.signature)
          if (decoded.startsWith("eyJ")) return decoded;
          const parsed = JSON.parse(decoded);
          if (parsed?.access_token) return parsed.access_token;
          if (parsed?.[0]?.access_token) return parsed[0].access_token;
        } catch {
          // raw jwt olabilir
          if (v.startsWith("eyJ")) return v;
        }
      }
    }
  }

  return null;
}

/**
 * Refresh token ile yeni access token al. Storage'i de günceller.
 * Returns true if refresh succeeded.
 */
async function tryRefreshToken(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    // Try Supabase client first (preferred)
    const supabase = getSupabaseBrowser();
    if (supabase) {
      const { data, error } = await supabase.auth.refreshSession();
      if (!error && data?.session?.access_token) {
        return true; // Supabase kendi storage'ini günceller
      }
    }

    // Fallback: backend refresh endpoint (yoksa false)
    const raw = localStorage.getItem("sb-pymulakat-auth-token");
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    const refreshToken = parsed?.refresh_token;
    if (!refreshToken) return false;

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) return false;
    const json = await res.json();
    const newAccess = json?.access_token;
    const newRefresh = json?.refresh_token || refreshToken;
    if (!newAccess) return false;

    const expiresAt = json?.expires_at
      ? Math.floor(new Date(json.expires_at).getTime() / 1000)
      : Math.floor(Date.now() / 1000) + 3600;

    // 📌 Canonical depolama: Supabase yönettiği JSON. Plain 'token' ve
    // 'refresh_token' artık yazılmıyor — extractAccessToken fallback olarak
    // okumaya devam ediyor (eski session'lardan gelen plain token'lar için)
    const updated = {
      ...parsed,
      access_token: newAccess,
      refresh_token: newRefresh,
      expires_at: expiresAt,
    };
    localStorage.setItem("sb-pymulakat-auth-token", JSON.stringify(updated));

    return true;
  } catch {
    return false;
  }
}

async function fetchMe(): Promise<UserResponse | null> {
  if (typeof window === "undefined") return null;

  let token = extractAccessToken();
  if (!token) return null;

  try {
    const doFetch = (accessToken: string) =>
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

    let res = await doFetch(token);

    // 🆕 401 gelirse refresh_token ile yeni access_token al
    if (res.status === 401) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        token = extractAccessToken();
        if (token) {
          res = await doFetch(token);
        }
      }
    }

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        // Token expired/invalid — Supabase client'ı temizle
        const supabase = getSupabaseBrowser();
        if (supabase) {
          try {
            await supabase.auth.signOut();
          } catch {
            // ignore
          }
        }
        localStorage.removeItem("sb-pymulakat-auth-token");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refresh_token");
      }
      return null;
    }

    const data = await res.json();

    return {
      id: data.id || "",
      email: data.email || "",
      username: data.username || data.email?.split("@")[0] || "user",
      is_verified: data.is_verified ?? false,
      points: data.points ?? 0,
      total_attempts: data.total_attempts ?? 0,
      success_count: data.success_count ?? 0,
      fail_count: data.fail_count ?? 0,
      success_rate: data.success_rate ?? 0,
      solution_average_time: data.solution_average_time ?? 0,
      solution_average_time_ms: data.solution_average_time_ms ?? 0,
    };
  } catch (err) {
    console.error("fetchMe error:", err);
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
      console.error("useUser fetch error:", message);
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
      const token = extractAccessToken();
      if (token) {
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
      } catch (err) {
        console.warn("Supabase signOut error:", err);
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

export { extractAccessToken };