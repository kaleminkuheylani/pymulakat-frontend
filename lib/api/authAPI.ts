// lib/api/authAPI.ts
//
// 📌 Auth endpoint'leri için TEK MODÜL.
// Backend (FastAPI) ile Supabase Auth birlikte çalışır:
//   - Login/register/verify: Supabase Auth (client-side createClient)
//   - /auth/me, /auth/refresh, /auth/logout, attempts, stats: FastAPI
//
// Tüm browser tarafı çağrılar index.ts'teki apiFetch üzerinden gider.
// localStorage / cookie yönetimi lib/auth.ts'te kalır (getAccessToken).
//
// 📌 lib/auth.ts ile birlikte çalışır:
//   - lib/auth.ts : token extractor (canonical, backward compat)
//   - lib/api/authAPI.ts : backend auth endpoint'leri
//   - lib/api/index.ts : apiFetch + ApiError
//
// Browser'da token gereken her endpoint'te `auth: true` opsiyonu kullanılır
// (apiFetch otomatik Authorization header ekler).

import { apiFetch, API_BASE } from "./index";
import type {
  ApiUser,
  ApiAuthResponse,
  ApiMessageResponse,
} from "./types";

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
// ─── Login / Register / Verify ────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Backend /auth/login (FastAPI route — legacy fallback).
 * NOT: Login akışı Supabase createClient üzerinden gider
 * (bkz. app/login/page.tsx). Bu helper legacy backend endpoint'i içindir.
 */
export async function login(payload: {
  email: string;
  password: string;
}): Promise<ApiAuthResponse> {
  return apiFetch<ApiAuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

/**
 * Backend /auth/register — yeni kullanıcı.
 * 6 haneli doğrulama kodu response.message içinde döner (dev ortamı).
 */
export async function register(payload: {
  username: string;
  email: string;
  password: string;
  privacy_policy_consent?: boolean;
}): Promise<ApiMessageResponse> {
  return apiFetch<ApiMessageResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

/**
 * Backend /auth/verify-email — 6 haneli kodu doğrula.
 */
export async function verifyEmail(payload: {
  email: string;
  code: number;
}): Promise<ApiMessageResponse> {
  return apiFetch<ApiMessageResponse>("/auth/verify-email", {
    method: "POST",
    body: payload,
  });
}

/**
 * Backend /auth/resend-code — yeni doğrulama kodu gönder.
 */
export async function resendCode(email: string): Promise<ApiMessageResponse> {
  return apiFetch<ApiMessageResponse>("/auth/resend-code", {
    method: "POST",
    body: { email },
  });
}

// ═══════════════════════════════════════════════════════════════
// ─── Token refresh ───────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Backend /auth/refresh — refresh_token ile yeni access_token al.
 * Storage güncellemesi lib/auth.ts extractAccessToken tarafından yapılır.
 */
export async function refreshToken(refreshTokenValue: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_at?: number | string;
}> {
  return apiFetch<{
    access_token: string;
    refresh_token?: string;
    expires_at?: number | string;
  }>("/auth/refresh", {
    method: "POST",
    body: { refresh_token: refreshTokenValue },
  });
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

export interface ApiAttemptResponse {
  id: string | number;
  user_id: string;
  question_id: number;
  question_title?: string;
  question_slug?: string;
  question_category?: string;
  is_orphaned?: boolean;
  category?: string;
  passed_tests: number;
  total_tests: number;
  success: boolean;
  execution_time_ms: number;
  hints_used?: number;
  created_at: string;
  user_code?: string;
}

export interface ApiUserStats {
  total_attempts: number;
  success_count: number;
  fail_count: number;
  points: number;
  success_rate: number;
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
// ─── Re-exports ───────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/** API_BASE export — sadece authAPI dış bağlantı için (örn. lib/revalidate.ts) */
export { API_BASE };

/** Namespace export: import { authAPI } from "./authAPI"; authAPI.getMe() */
export const authAPI = {
  getMe,
  login,
  register,
  verifyEmail,
  resendCode,
  refreshToken,
  deleteAccount,
  submitAttempt,
  getMyAttempts,
  getMyStats,
  getPlayCount,
  incrementPlayCount,
};
