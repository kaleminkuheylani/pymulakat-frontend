// lib/api/formAPI.ts
//
// 📌 Form (community) endpoint'leri için TEK MODÜL.
// Backend /api/v2/forms — topluluk paylaşımları, soru yardımı, kod yardımı.

import { apiFetch } from "./index";
import type {
  ApiForm,
  ApiFormCategory,
  ApiFormCreatePayload,
  ApiFormReplyPayload,
  ApiPagination,
} from "./types";

// ═══════════════════════════════════════════════════════════════
// ─── List & Get ──────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Form listesi (kategori filtresi opsiyonel).
 * Auth header otomatik eklenir (private formlar için).
 */
export async function listForms(category?: string): Promise<ApiForm[]> {
  const data = await apiFetch<{ data: ApiForm[] } | ApiForm[] | ApiPagination>(
    "/api/v2/forms",
    { params: { category: category || undefined }, auth: true }
  );
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data as ApiForm[];
  if (Array.isArray(data?.items)) return data.items as ApiForm[];
  return [];
}

/**
 * Tek form detayı (+ replies dahil).
 */
export async function getForm(id: number): Promise<ApiForm | null> {
  try {
    const data = await apiFetch<{ data: ApiForm } | ApiForm>(
      `/api/v2/forms/${id}`
    );
    if ("data" in data && data.data) return data.data;
    return data as ApiForm;
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// ─── Create ──────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Yeni form/paylaşım oluştur.
 * Auth zorunlu (backend 401 → throw).
 */
export async function createForm(
  payload: ApiFormCreatePayload
): Promise<ApiForm> {
  return apiFetch<ApiForm>("/api/v2/forms", {
    method: "POST",
    body: payload,
    auth: true,
  });
}

// ═══════════════════════════════════════════════════════════════
// ─── Reply ───────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Forma yanıt gönder.
 */
export async function submitReply(
  formId: number,
  payload: ApiFormReplyPayload
): Promise<{ ok: boolean; reply_id?: number }> {
  return apiFetch<{ ok: boolean; reply_id?: number }>(
    `/api/v2/forms/${formId}/reply`,
    { method: "POST", body: payload, auth: true }
  );
}

// ═══════════════════════════════════════════════════════════════
// ─── Categories (form-level) ─────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Form kategorileri (feedback, question_help, code_help, share).
 * Backend metadata döner (slug, label, icon, color).
 */
export async function listFormCategories(): Promise<ApiFormCategory[]> {
  const data = await apiFetch<
    { data: ApiFormCategory[] } | ApiFormCategory[] | ApiPagination
  >("/api/v2/forms/categories");
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data as ApiFormCategory[];
  if (Array.isArray(data?.items)) return data.items as ApiFormCategory[];
  return [];
}
