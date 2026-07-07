// lib/auth.ts — Tek canonical token extractor.
// Token storage stratejisi:
//   1. Canonical: Supabase yönettiği 'sb-pymulakat-auth-token' JSON içinde
//      access_token + refresh_token + expires_at
//   2. Backward compat: legacy plain 'token' key (eski session verisi)
//
// Bu modül auth state'ini merkezileştirir — tüm caller'lar
// `getAccessToken()` üzerinden okur, localStorage API'sine
// tek tek dokunmaz.

/** Tek kaynak: Supabase JSON'dan access_token çıkar. Yoksa legacy plain fallback. */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  // 1) Canonical: Supabase SSR yönettiği JSON
  try {
    const raw = localStorage.getItem("sb-pymulakat-auth-token");
    if (raw) {
      const parsed = JSON.parse(raw);
      const tok =
        parsed?.access_token ||
        parsed?.currentSession?.access_token ||
        parsed?.session?.access_token;
      if (typeof tok === "string" && tok.length > 0) return tok;
    }
  } catch {
    // ignore parse error
  }

  // 2) Legacy plain token (eski session verisi için backward compat)
  try {
    const plain = localStorage.getItem("token");
    if (plain && plain.length > 0 && plain !== "null" && plain !== "undefined") {
      return plain;
    }
  } catch {
    // ignore
  }

  // 3) Cookies (document.cookie) — Supabase SSR fallback
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split(";");
    for (const c of cookies) {
      const [k, v] = c.trim().split("=");
      if (!k || !v) continue;
      if (k.includes("auth-token") || k.includes("access-token")) {
        try {
          const decoded = decodeURIComponent(v);
          if (decoded.startsWith("base64-")) continue; // chunked, atla
          if (decoded.startsWith("eyJ")) return decoded; // raw JWT
          const parsed = JSON.parse(decoded);
          const tok =
            parsed?.access_token ||
            parsed?.currentSession?.access_token ||
            parsed?.session?.access_token;
          if (typeof tok === "string" && tok.length > 0) return tok;
        } catch {
          if (v.startsWith("eyJ")) return v;
        }
      }
    }
  }

  return null;
}

/** Token var mı? (truthy check) */
export function hasAccessToken(): boolean {
  return getAccessToken() !== null;
}

/** Async wrappers — bazı çağrılar `await getAccessToken()` kullanıyor olabilir */
export async function getAccessTokenAsync(): Promise<string | null> {
  return getAccessToken();
}

/**
 * Tarayıcıda Authenticated mi? Sentinel cookie + token varlığı kontrolü.
 * Middleware'in `pymulakat_auth` cookie'si burada JS'den tekrar kontrol edilir
 * (genelde middleware zaten returnUrl ile login'e yönlendirmiş oluyor ama
 * client-side guard için lazım).
 */
export function isAuthenticatedClient(): boolean {
  if (typeof window === "undefined") return false;

  // 1) Sentinel cookie
  const cookies = document.cookie.split(";");
  for (const c of cookies) {
    const [k, v] = c.trim().split("=");
    if (k === "pymulakat_auth" && v === "1") return true;
  }

  // 2) Fallback: token var mı?
  return hasAccessToken();
}
