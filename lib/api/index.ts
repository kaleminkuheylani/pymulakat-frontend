// lib/api/index.ts
//
// 📌 Base fetch wrapper — TEK YERDE API_BASE + apiFetch.
// Mimari kuralı: inline fetch + inline URL YASAK. Tüm xxxAPI.ts buradan tüketir.
//
// Diğer modüller:
//   import { apiFetch, API_BASE, ApiError } from "./index";
//
// ApiError (types.ts'ten re-export) throw eder — UI katmanı status'a göre handle eder.

import type { ApiErrorBody } from "./types";
import { ApiError } from "./types";

export { ApiError };

// ─── API_BASE — server vs client ayrımı ──────────────────────
/**
 * Sunucu tarafı (RSC, generateStaticParams, ISR) → INTERNAL_API_URL
 *   - Docker/k8s internal network (örn. http://fastapi:8000)
 *   - Public DNS atlanır, latency düşer + CORS/auth gerekmez
 *   - Fallback: NEXT_PUBLIC_API_URL
 *   - Son çare: Railway public URL (local dev için)
 *
 * İstemci tarafı (browser fetch, workspace/code runner) → NEXT_PUBLIC_API_URL
 *   - NEXT_PUBLIC_*: browser bundle'a inline edilir, public olmalı
 *   - Server component'lerde import edilmemeli
 *
 * 📌 SADECE burada tanımlı — başka yerde process.env.NEXT_PUBLIC_API_URL
 *    veya hardcoded URL YASAK.
 */
function normalizeApiBase(url: string): string {
  if (!url) return url;
  // Yanlışlıkla NEXT_PUBLIC_API_URL /api ile bitirilirse çift prefix oluşmasın
  // (örn. .../api + /auth/me → .../api/auth/me 404). Proje FastAPI root'unda
  // /auth ve /api/v2 route'larına sahip; base URL host+port olmalı.
  return url.replace(/\/api\/?$/, "").replace(/\/+$/, "");
}

function resolveServerBase(): string {
  // RSC'ler server'da çalışır — internal URL tercih et
  return normalizeApiBase(
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://pymulakat-backend-production.up.railway.app"
  );
}

function resolveClientBase(): string {
  // Browser bundle'da NEXT_PUBLIC_* env'leri inline edilir
  return normalizeApiBase(
    process.env.NEXT_PUBLIC_API_URL ||
    "https://pymulakat-backend-production.up.railway.app"
  );
}

/**
 * Browser'da (window tanımlı) → public URL, server'da → internal URL.
 * Server component'ler apiFetch() çağırırken bu base kullanılır; browser
 * kodundan (useEffect, onClick handler) çağrıldığında public base'e düşer.
 */
export const API_BASE: string =
  typeof window === "undefined" ? resolveServerBase() : resolveClientBase();

/** Hangi base'in seçildiğini debug için (server log). */
export const API_BASE_KIND: "internal" | "public" | "fallback" =
  process.env.INTERNAL_API_URL
    ? "internal"
    : process.env.NEXT_PUBLIC_API_URL
    ? "public"
    : "fallback";

// ─── Request init options ────────────────────────────────────
export interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  /** Next.js cache stratejisi: { revalidate: 3600, tags: [...] } */
  next?: { revalidate?: number | false; tags?: string[] };
  /** Request body — object geçilirse JSON.stringify otomatik yapılır */
  body?: unknown;
  /** Query string params (URL'e otomatik eklenir) */
  params?: Record<string, string | number | boolean | undefined | null>;
  /** Auth header otomatik eklensin mi (default: false, server endpoint'leri için) */
  auth?: boolean;
  /**
   * Fetch credentials modu. Default 'include' (cross-origin cookie gerekli).
   * - 'include': cross-origin cookie'ler (admin session) — production
   * - 'same-origin': same-origin only
   * - 'omit': cookie gönderme
   */
  credentials?: RequestCredentials;
}

// ─── apiFetch<T>() generic helper ────────────────────────────
/**
 * Generic typed fetch wrapper.
 *   - URL birleştirme (relative path → API_BASE + path)
 *   - Query string serialize
 *   - JSON body otomatik serialize + Content-Type header
 *   - 4xx/5xx → ApiError throw
 *   - JSON parse + T tipinde döner
 *
 * @example
 *   const data = await apiFetch<ApiQuestion[]>("/api/v2/questions", {
 *     next: { revalidate: 3600, tags: ["questions-list"] },
 *   });
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { next, body, params, auth = false, headers, ...rest } = options;

  // 1) URL oluştur
  let url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  if (params) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue;
      qs.set(k, String(v));
    }
    const qsStr = qs.toString();
    if (qsStr) {
      url += (url.includes("?") ? "&" : "?") + qsStr;
    }
  }

  // 2) Headers
  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string> | undefined),
  };

  // 3) Body
  let finalBody: BodyInit | undefined;
  if (body !== undefined && body !== null) {
    if (typeof body === "string" || body instanceof FormData || body instanceof Blob) {
      finalBody = body as BodyInit;
    } else {
      finalBody = JSON.stringify(body);
      if (!finalHeaders["Content-Type"] && !finalHeaders["content-type"]) {
        finalHeaders["Content-Type"] = "application/json";
      }
    }
  }

  // 4) Auth: server-side cookie'ye guven (sb-pymulakat-auth-token).
  //    2026-07-19: Bearer header KALDIRILDI — Supabase yeni projeler ES256
  //    public key rotate edebiliyor, JWKS bazen 2-3sn gecikmeli oluyor, ve
  //    browser localStorage'daki access_token ile cookie'deki access_token
  //    farkli olabiliyor (server-side exchange vs client getSession). Cookie
  //    Supabase'in kanonik kaynagi; backend zaten sb-*-auth-token cookie'sini
  //    okuyor. credentials: 'include' ile otomatik gider.
  if (auth && typeof window !== "undefined") {
    if (rest.credentials === undefined) rest.credentials = "include";
  }

  // 5) Next.js fetch init
  const init: RequestInit & { next?: ApiFetchOptions["next"] } = {
    ...rest,
    credentials: options.credentials ?? "include",
    headers: finalHeaders,
  };
  if (body !== undefined && body !== null) init.body = finalBody;
  if (next) init.next = next;

  // 6) Fetch
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Network error";
    throw new ApiError(0, url, `Network error: ${msg}`);
  }

  // 7) Response handling
  if (!res.ok) {
    let errBody: ApiErrorBody | undefined;
    let detail = "";
    try {
      const text = await res.text();
      try {
        errBody = JSON.parse(text) as ApiErrorBody;
        detail = extractErrorMessage(errBody, `API error: ${res.status}`);
      } catch {
        detail = text || res.statusText || `API error: ${res.status}`;
      }
    } catch {
      detail = res.statusText || `API error: ${res.status}`;
    }
    throw new ApiError(res.status, url, detail, errBody);
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  // 8) JSON parse
  try {
    return (await res.json()) as T;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "JSON parse error";
    throw new ApiError(res.status, url, `JSON parse error: ${msg}`);
  }
}

// ─── Helpers ─────────────────────────────────────────────────

/**
 * FastAPI HTTPException + custom error shape'lerinden anlamlı mesaj çıkar.
 * `detail` string ise direkt döner, array ise Pydantic validation hatası parse edilir.
 */
function extractErrorMessage(body: ApiErrorBody, fallback: string): string {
  if (typeof body?.detail === "string") return body.detail;
  if (Array.isArray(body?.detail)) {
    return body.detail
      .map((err) => {
        const field = (err.loc || []).filter((l) => l !== "body").join(".");
        return field ? `${field}: ${err.msg}` : err.msg;
      })
      .join(" | ");
  }
  if (typeof body?.message === "string") return body.message;
  if (typeof body?.error === "string") return body.error;
  return fallback;
}

/**
 * Browser-only token extractor (auth header için).
 * Server component'lerde auth header eklemeye gerek yok — server fetch'lerinde
 * auth gerekiyorsa caller explicit header geçmeli.
 *
 * localStorage key'leri:
 *   1) sb-pymulakat-auth-token (canonical, Supabase yönetir)
 *   2) plain "token" (legacy fallback)
 *   3) "refresh_token" (eski)
 */
function extractTokenForAuth(): string | null {
  if (typeof window === "undefined") return null;
  try {
    // 1) Supabase canonical
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
    // ignore
  }
  // 2) Legacy plain
  try {
    const plain = localStorage.getItem("token");
    if (plain && plain !== "null" && plain !== "undefined" && plain.length > 0) {
      return plain;
    }
  } catch {
    // ignore
  }
  return null;
}

// ─── Re-exports (backward compat) ────────────────────────────
export {
  fetchAllQuestions,
  getAllQuestions,
  getById,
  getBySlug,
  findQuestion,
  listQuestionsByCategory,
  getQuestionTestsBySlug,
  getQuestionTests,
  listCategories,
  getCategories,
  getCategoryDetail,
  getRecommendationFlow,
  getCommunityRecommendations,
  slugifyTitle,
  getTotalQuestionCount,
  getCategoryCount,
} from "./questionAPI";
// type aliases: Question, QuestionTests, TestCase (eski import'lar icin)
export type { Question, QuestionTests, TestCase } from "./types";
// type aliases
export type { AttemptResponse } from "./types";
// ─── questionsAPI object (backward compat) ───────────────────
export { questionsAPI } from "./questionAPI";
