// lib/auth.ts — Tek canonical token extractor.
// Token storage stratejisi:
//   1. Canonical: Supabase yönettiği 'sb-pymulakat-auth-token' JSON içinde
//      access_token + refresh_token + expires_at (localStorage)
//   2. Cookie: @supabase/ssr base64- / chunked cookie formatı
//   3. Backward compat: legacy plain 'token' key
//
// Bu modül auth state'ini merkezileştirir — tüm caller'lar
// `getAccessToken()` üzerinden okur.

function tokenFromSessionLike(parsed: unknown): string | null {
  if (!parsed || typeof parsed !== "object") return null;
  const obj = parsed as Record<string, unknown>;
  const candidates = [
    obj.access_token,
    (obj.currentSession as Record<string, unknown> | undefined)?.access_token,
    (obj.session as Record<string, unknown> | undefined)?.access_token,
  ];
  for (const tok of candidates) {
    if (typeof tok === "string" && tok.length > 0) return tok;
  }
  return null;
}

function decodeCookieValue(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function tokenFromCookiePayload(value: string): string | null {
  const decoded = decodeCookieValue(value);
  if (!decoded) return null;

  // @supabase/ssr: "base64-<payload>"
  let payload = decoded;
  if (payload.startsWith("base64-")) {
    payload = payload.slice("base64-".length);
    try {
      const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
      payload = atob(normalized);
    } catch {
      return null;
    }
  }

  if (payload.startsWith("eyJ")) return payload;

  try {
    const parsed = JSON.parse(payload);
    if (Array.isArray(parsed)) {
      for (const item of parsed) {
        const tok = tokenFromSessionLike(item);
        if (tok) return tok;
      }
      return null;
    }
    return tokenFromSessionLike(parsed);
  } catch {
    return null;
  }
}

/** Tek kaynak: Supabase JSON / cookie'den access_token çıkar. */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("sb-pymulakat-auth-token");
    if (raw) {
      const parsed = JSON.parse(raw);
      const tok = tokenFromSessionLike(parsed);
      if (tok) return tok;
    }
  } catch {
    // ignore
  }

  try {
    const plain = localStorage.getItem("token");
    if (plain && plain.length > 0 && plain !== "null" && plain !== "undefined") {
      return plain;
    }
  } catch {
    // ignore
  }

  if (typeof document !== "undefined") {
    const parts = document.cookie.split(";");
    const byName = new Map<string, string>();
    for (const c of parts) {
      const idx = c.indexOf("=");
      if (idx === -1) continue;
      const k = c.slice(0, idx).trim();
      const v = c.slice(idx + 1).trim();
      if (k) byName.set(k, v);
    }

    const authNames = Array.from(byName.keys()).filter(
      (n) =>
        (n.includes("auth-token") || n.includes("access-token")) &&
        !n.includes("code-verifier")
    );

    const groups = new Map<string, { idx: number; value: string }[]>();
    for (const name of authNames) {
      const m = name.match(/^(.*?)(?:\.(\d+)|-chunk-(\d+))?$/);
      if (!m) continue;
      const base = m[1];
      const idx = m[2] != null ? parseInt(m[2], 10) : m[3] != null ? parseInt(m[3], 10) : -1;
      const list = groups.get(base) || [];
      list.push({ idx, value: byName.get(name) || "" });
      groups.set(base, list);
    }

    for (const [, chunks] of groups) {
      chunks.sort((a, b) => a.idx - b.idx);
      const joined =
        chunks.length === 1 && chunks[0].idx === -1
          ? chunks[0].value
          : chunks.map((c) => c.value).join("");
      const tok = tokenFromCookiePayload(joined);
      if (tok) return tok;
    }
  }

  return null;
}

export function hasAccessToken(): boolean {
  return getAccessToken() !== null;
}

export async function getAccessTokenAsync(): Promise<string | null> {
  return getAccessToken();
}

export function isAuthenticatedClient(): boolean {
  if (typeof window === "undefined") return false;

  const cookies = document.cookie.split(";");
  for (const c of cookies) {
    const [k, v] = c.trim().split("=");
    if (k === "pymulakat_auth" && v === "1") return true;
  }

  return hasAccessToken();
}