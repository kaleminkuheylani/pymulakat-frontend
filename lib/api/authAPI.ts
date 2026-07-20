// lib/api/authAPI.ts
//
// 📌 Auth endpoint'leri için TEK MODÜL.
// 2026-07-19: Email/sifre akislari kaldirildi. Sadece OAuth ile giris/kayit.
//   - OAuth islemleri lib/auth-client.ts + @supabase/ssr uzerinden gider.
//   - /auth/me, attempts, stats gibi korumali endpoint'ler FastAPI'ye gider.
//
// Browser'da token gereken her endpoint'te `auth: true` opsiyonu kullanılır
// (apiFetch otomatik Authorization header ekler).

import { apiFetch, API_BASE } from "./index";
import type { ApiUser, ApiUserStats, ApiAttemptResponse, ApiUserPerformance } from "./types";

// ═══════════════════════════════════════════════════════════════
// ─── Me / Profile ────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Backend /auth/me — current user.
 * Browser'da localStorage'dan access token çekilir (apiFetch auth: true).
 * 401 → null (caller logout tetikler).
 */
export async function getMe(): Promise<ApiUser | null> {
  try {
    return await apiFetch<ApiUser>("/auth/me", { auth: true });
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// ─── Account delete (KVKK) ───────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * KVKK md. 11 — hesap ve tüm verilerin silinmesi.
 * Confirmation metni ("HESABIMI SIL") backend'de doğrulanır.
 */
export async function deleteAccount(confirmation: string): Promise<{
  ok: boolean;
  message?: string;
}> {
  return apiFetch<{ ok: boolean; message?: string }>("/api/v2/account/delete", {
    method: "POST",
    body: { confirmation },
    auth: true,
  });
}

// ═══════════════════════════════════════════════════════════════
// ─── Attempts / Stats ────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

export interface ApiAttemptPayload {
  question_id: number;
  passed_tests: number;
  total_tests: number;
  success: boolean;
  execution_time_ms: number;
  hints_used?: number;
}

/**
 * Yeni attempt gönder. KVKK: user_code gönderilmez.
 */
export async function submitAttempt(payload: ApiAttemptPayload): Promise<ApiAttemptResponse> {
  return apiFetch<ApiAttemptResponse>("/api/v2/attempts", {
    method: "POST",
    body: payload,
    auth: true,
  });
}

/**
 * Kullanıcının son N attempt'i.
 */
export async function getMyAttempts(limit = 10): Promise<ApiAttemptResponse[]> {
  const data = await apiFetch<{ data: ApiAttemptResponse[] } | ApiAttemptResponse[]>(
    "/api/v2/attempts",
    { params: { limit }, auth: true }
  );
  if (Array.isArray(data)) return data;
  return data?.data ?? [];
}

/**
 * Kullanıcı istatistikleri.
 */
export async function getMyStats(): Promise<ApiUserStats> {
  return apiFetch<ApiUserStats>("/api/v2/attempts/stats", { auth: true });
}

// ═══════════════════════════════════════════════════════════════
// ─── Play Count ───────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Play count döner (misafir auth gerektirmez — backend 0 döner).
 */
export async function getPlayCount(): Promise<{ count: number }> {
  try {
    return await apiFetch<{ count: number }>("/api/v2/users/me/play-count", {
      auth: true,
    });
  } catch {
    return { count: 0 };
  }
}

/**
 * Play count +1 (her kod değişikliğinde debounced 2s çağrılır).
 * Misafirde 401 → silent fail.
 */
export async function incrementPlayCount(): Promise<{ count: number } | null> {
  try {
    return await apiFetch<{ count: number }>("/api/v2/users/me/play-count", {
      method: "POST",
      auth: true,
    });
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// ─── User Performance (total usage time + streak) ───────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Oturumda geçirilen süreyi (saniye) backend'e gönder.
 * Toplam kullanım süresi artırılır, streak güncellenir.
 */
export async function trackSession(seconds: number): Promise<ApiUserPerformance | null> {
  try {
    return await apiFetch<ApiUserPerformance>("/api/v2/users/me/session", {
      method: "POST",
      body: { seconds: Math.max(0, Math.floor(seconds)) },
      auth: true,
    });
  } catch {
    return null;
  }
}

/**
 * Kullanıcının toplam kullanım süresi ve streak değerlerini getir.
 */
export async function getPerformance(): Promise<ApiUserPerformance | null> {
  try {
    return await apiFetch<ApiUserPerformance>("/api/v2/users/me/performance", {
      auth: true,
    });
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// ─── Re-exports ───────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/** API_BASE export — sadece authAPI dış bağlantı için (örn. lib/revalidate.ts) */
export { API_BASE };

/** Namespace export: import { authAPI } from "./authAPI"; authAPI.getMe() */
export const authAPI = {
  getMe,
  deleteAccount,
  submitAttempt,
  getMyAttempts,
  getMyStats,
  getPlayCount,
  incrementPlayCount,
  trackSession,
  getPerformance,
};
