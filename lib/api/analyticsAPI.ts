// lib/api/analyticsAPI.ts
// Analytics API client — server-side, admin panel için.
//
// MİMARİ (server-side):
// - Server component'te direkt fetch (apiFetch değil — server credentials)
// - /api/v2/analytics/top-pages → en çok ziyaret edilen sayfalar
// - /api/v2/analytics/stats → aggregate istatistikler
// - /api/v2/analytics/category-breakdown → kategori bazlı
//
// Frontend tracking: hooks/usePageView.ts (client-side, fire-and-forget)
// Backend tracking endpoint: POST /api/v2/analytics/track

import { API_BASE } from "./index";

export interface TopPage {
  path: string;
  category: string | null;
  total_views: number;
  days: number;
}

export interface AnalyticsStats {
  total_views: number;
  unique_paths: number;
  unique_categories: number;
  days: number;
  daily_rows: number;
}

export interface CategoryBreakdown {
  category: string;
  views: number;
  days: number;
}

/**
 * Server-side fetch helper. lib/api/apiFetch yerine düz fetch (server credentials).
 * NO_CACHE ile her istek taze veri.
 */
async function serverFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Analytics fetch failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

/**
 * En çok ziyaret edilen sayfalar.
 * @param limit default 200 (tüm 85+ pillar/detay sayfa)
 * @param days default 30
 */
export async function getTopPages(limit = 200, days = 30): Promise<TopPage[]> {
  try {
    const data = await serverFetch<{ pages: TopPage[]; total: number; days: number }>(
      `/api/v2/analytics/top-pages?limit=${limit}&days=${days}`
    );
    return data.pages || [];
  } catch {
    return [];
  }
}

/**
 * Aggregate istatistikler.
 */
export async function getAnalyticsStats(days = 30): Promise<AnalyticsStats | null> {
  try {
    return await serverFetch<AnalyticsStats>(`/api/v2/analytics/stats?days=${days}`);
  } catch {
    return null;
  }
}

/**
 * Kategori bazlı ziyaret istatistikleri.
 */
export async function getCategoryBreakdown(days = 30): Promise<CategoryBreakdown[]> {
  try {
    const data = await serverFetch<{ categories: CategoryBreakdown[]; days: number }>(
      `/api/v2/analytics/category-breakdown?days=${days}`
    );
    return data.categories || [];
  } catch {
    return [];
  }
}

/**
 * Path → view count map (server-side, hızlı lookup).
 */
export async function getViewCountMap(days = 30): Promise<Map<string, number>> {
  const pages = await getTopPages(500, days);
  const map = new Map<string, number>();
  for (const p of pages) {
    map.set(p.path, p.total_views);
  }
  return map;
}
