// lib/admin/guard.ts
// Admin guard — backend session cookie tabanlı (2FA destekli).
//
// MİMARİ (2FA, session-based, production-grade):
// - Eski: Supabase cookies + app_metadata.role (sadece password)
// - Yeni: Backend /api/v2/admin/auth/me + HttpOnly session cookie
//   - Login: email + password → mfa_token (5dk)
//   - MFA: mfa_token + TOTP → session cookie (8 saat)
//   - Session: HttpOnly, Secure, SameSite=Strict
//   - Audit log: her login attempt + her admin action
//   - Lockout: 5 fail → 15dk
//   - IP allowlist: env bazlı (opsiyonel)
//
// AVANTAJ:
// - Supabase bağımlılığı yok (daha az saldırı yüzeyi)
// - 2FA zorunlu (Mavis API maliyetli, DB-FIRST kritik)
// - Audit trail: kim ne zaman ne yaptı
// - Session revoke: çalınan cookie geçersiz kılınabilir
// - IP binding: farklı IP'den kullanım reddedilir
//
// KULLANIM:
//   import { requireAdmin } from "@/lib/admin/guard";
//   const user = await requireAdmin();  // /admin/login'e redirect

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Server-side fetch (RSC, force-dynamic):
// - INTERNAL_API_URL (k8s/docker internal, public DNS atlanır)
// - NEXT_PUBLIC_API_URL fallback (local dev veya internal tanımsız)
// - Son çare: Railway public URL
const API_BASE =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://pymulakat-backend-production.up.railway.app";

export interface AdminUser {
  id: string;
  email: string;
  role: "admin";
  expires_at?: string;
}

/**
 * Server component'te admin guard. Session yoksa /admin/login'e redirect.
 *
 * @returns Admin user (session validate edildi)
 */
export async function requireAdmin(): Promise<AdminUser> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  // Session yoksa cookie header bos olur → 401 → redirect login
  let user: AdminUser | null = null;
  try {
    const res = await fetch(`${API_BASE}/api/v2/admin/auth/me`, {
      headers: {
        Cookie: cookieHeader,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (res.ok) {
      user = (await res.json()) as AdminUser;
    } else if (res.status === 401) {
      // Session yok veya süresi dolmuş
      user = null;
    } else {
      // Backend 5xx veya başka hata — fail-closed
      user = null;
    }
  } catch (e) {
    // Backend unreachable — fail-closed
    user = null;
  }

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  return user;
}

/**
 * API route veya client component'te admin kontrol (redirect etmez).
 */
export async function checkAdmin(): Promise<{ isAdmin: boolean; user: AdminUser | null }> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const res = await fetch(`${API_BASE}/api/v2/admin/auth/me`, {
      headers: {
        Cookie: cookieHeader,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (res.ok) {
      const user = (await res.json()) as AdminUser;
      return { isAdmin: user.role === "admin", user };
    }
    return { isAdmin: false, user: null };
  } catch {
    return { isAdmin: false, user: null };
  }
}

/**
 * BYPASS mode — Vercel env NEXT_PUBLIC_ADMIN_BYPASS=1 ise herkes admin.
 * Sadece acil durum / debug için. Production'da KAPALI olmalı.
 */
export function isBypassEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ADMIN_BYPASS === "1";
}
