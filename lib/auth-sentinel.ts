// lib/auth-sentinel.ts
//
// TEK KAYNAK — sentinel cookie yönetimi. Middleware'in server-side auth gate'i
// için. 3 dosyada duplicate inline cookie yazma vardı (useUser, useSupabaseBrowser,
// auth/callback), hepsi buraya delege edildi.

const SENTINEL = "pymulakat_auth";
const MAX_AGE_SECONDS = 60 * 60 * 24; // 1 gün

export function setAuthSentinel(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SENTINEL}=1; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearAuthSentinel(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SENTINEL}=; path=/; max-age=0; SameSite=Lax`;
}

export function hasAuthSentinel(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => {
    const [k, v] = c.trim().split("=");
    return k === SENTINEL && v === "1";
  });
}
