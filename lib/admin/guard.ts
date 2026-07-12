// lib/admin/guard.ts
// Supabase admin guard — server-side, tüm /admin/* rotalarını korur.
//
// KURAL (KESİN):
// - Admin kontrolü SADECE Supabase `app_metadata.role === "admin"` ile yapılır.
// - Cookie/localStorage'la kontrol YASAK (client tarafında bypass edilebilir).
// - Server component'lerde (admin layout) çalışır; service_role kullanmaz
//   (RLS zaten app_metadata.role üzerinden filtreliyor).
//
// KULLANIM:
//   // Server component
//   import { requireAdmin } from "@/lib/admin/guard";
//   const user = await requireAdmin();  // admin değilse redirect to /
//
//   // API route
//   import { checkAdmin } from "@/lib/admin/guard";
//   const isAdmin = await checkAdmin();

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";

// Supabase URL'ler
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

async function makeServerClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server component'te set çalışmaz (read-only) — ignore
        }
      },
    },
  });
}

/**
 * Supabase admin mi? Sadece app_metadata.role === "admin" kabul edilir.
 * RLS: profiles tablosunda admin policy bu role'ü kontrol eder.
 */
export async function isSupabaseAdmin(supabase: SupabaseClient, user: User): Promise<boolean> {
  // 1) app_metadata.role === "admin" (en güvenilir — kullanıcı değiştiremez)
  const appRole = (user.app_metadata as Record<string, unknown> | undefined)?.role;
  if (appRole === "admin") return true;

  // 2) user_metadata.role === "admin" (fallback — ilk kurulumda app_metadata boş olabilir)
  const userRole = (user.user_metadata as Record<string, unknown> | undefined)?.role;
  if (userRole === "admin") return true;

  // 3) Fresh fallback: backend API'den dogrula (service_role-backed, Supabase admin)
  // Supabase auth.getUser() JWT token cache'leyebilir; logout sonrasi bile
  // eski JWT yeni metadata ile yenilenmemis olabilir. Backend'de her zaman
  // fresh role dondurur.
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";
    const cookieHeader = (await cookies())
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
    const res = await fetch(`${apiBase}/api/v2/admin/users/me`, {
      headers: { Cookie: cookieHeader, Accept: "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = (await res.json()) as { role?: string };
      if (data.role === "admin") return true;
    }
  } catch (e) {
    // Backend unreachable — fall through
  }

  // 4) DB'de profiles tablosunda is_admin = true kontrol (RLS service_role açık)
  // Bu kontrol service_role gerektirir, burada yapamayız. UI tarafında
  // /api/v2/admin/me endpoint'i ile kontrol edilebilir.
  return false;
}

/**
 * Server component'lerde admin guard. Admin değilse /'ya redirect.
 *
 * @returns Supabase user (admin)
 */
export async function requireAdmin(): Promise<User> {
  const cookieStore = cookies();

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("[admin/guard] NEXT_PUBLIC_SUPABASE_URL veya SUPABASE_ANON_KEY tanımsız");
    redirect("/");
  }

  // Supabase client (cookie-based session)
  const supabase = await makeServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?returnUrl=/admin");
  }

  const admin = await isSupabaseAdmin(supabase, user);
  if (!admin) {
    // Admin değil — ana sayfaya yönlendir (KVKK uyumu, iç yönlendirme yapma)
    redirect("/");
  }

  return user;
}

/**
 * Sadece kontrol — redirect etmez. UI/API route'larında kullanılır.
 */
export async function checkAdmin(): Promise<{ isAdmin: boolean; user: User | null }> {
  try {
    const supabase = await makeServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { isAdmin: false, user: null };

    const admin = await isSupabaseAdmin(supabase, user);
    return { isAdmin: admin, user };
  } catch {
    return { isAdmin: false, user: null };
  }
}
