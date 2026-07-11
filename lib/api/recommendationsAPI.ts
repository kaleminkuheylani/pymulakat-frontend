// lib/api/recommendationsAPI.ts
//
// Recommendation endpoint'leri için TEK MODÜL. Diğer tüm sayfalar buradan tüketir.
// DB-FIRST mimari: backend /api/v2/recommendations/...
//
// types.ts'ten ApiRecommendation, ApiRecommendationContext kullanır.

import { apiFetch } from "./index";
import type { ApiRecommendation, ApiRecommendationContext } from "./types";

// ═══════════════════════════════════════════════════════════════════
// ─── Recommendations ────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

export async function getRecommendations(
  limit = 5,
  options?: { accessToken?: string }
): Promise<{ items: ApiRecommendation[]; context: ApiRecommendationContext }> {
  const headers: Record<string, string> = {};
  if (options?.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }
  const res = await apiFetch<{ data?: ApiRecommendation[]; context?: ApiRecommendationContext }>(
    `/api/v2/recommendations?limit=${limit}`,
    { headers, credentials: "include" }
  );
  return {
    items: res.data || [],
    context: res.context || { is_authenticated: false, top_categories: [] },
  };
}

export async function getCommunityPicks(
  limit = 15,
  options?: { accessToken?: string }
): Promise<ApiRecommendation[]> {
  const headers: Record<string, string> = {};
  if (options?.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }
  const res = await apiFetch<{ data?: ApiRecommendation[] }>(
    `/api/v2/recommendations/community?limit=${limit}`,
    { headers }
  );
  return res.data || [];
}

export async function getAllQuestionsForRecs(
  limit = 200
): Promise<unknown[] | { data?: unknown[] }> {
  // Dashboard overview için tüm sorular (recommendations engine feed)
  // Backend ya direkt array ya da {data: [...]} dönebilir — iki şekli de kabul et
  return apiFetch<unknown[] | { data?: unknown[] }>(
    `/api/v2/questions/all?limit=${limit}`,
    { cache: "no-store" }
  );
}
