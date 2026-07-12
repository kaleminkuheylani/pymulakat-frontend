// lib/api/auditAPI.ts
//
// Admin soru denetim API client.
// Mavis API ile kod üret → test runner → DB'de audit_status güncelle.
//
// Mimari: lib/api/{index,types,xxxAPI}.ts yapısına uygun.

import { apiFetch, API_BASE } from "./index";
import type {
  ApiQuestionAudit,
  ApiAuditGenerateRequest,
  ApiAuditGenerateResponse,
  ApiAuditRunRequest,
  ApiAuditRunResponse,
  ApiAuditMarkRequest,
  ApiAuditStats,
} from "./types";

/** Tüm soruları audit durumu ile listele. */
export async function listAuditQuestions(): Promise<ApiQuestionAudit[]> {
  return apiFetch<ApiQuestionAudit[]>(`/api/v2/admin/audit/list`);
}

/** Mavis API ile soru için doğru Python kodu üret. */
export async function generateAuditCode(
  req: ApiAuditGenerateRequest,
): Promise<ApiAuditGenerateResponse> {
  return apiFetch<ApiAuditGenerateResponse>(`/api/v2/admin/audit/generate`, {
    method: "POST",
    body: req,
  });
}

/** Üretilen kodu tüm test case'lerde çalıştır. */
export async function runAuditTests(
  req: ApiAuditRunRequest,
): Promise<ApiAuditRunResponse> {
  return apiFetch<ApiAuditRunResponse>(`/api/v2/admin/audit/run`, {
    method: "POST",
    body: req,
  });
}

/** DB'de is_audited güncelle. */
export async function markAudit(
  req: ApiAuditMarkRequest,
): Promise<{ ok: boolean; is_audited: boolean; audit_status: string }> {
  return apiFetch(`/api/v2/admin/audit/mark`, {
    method: "POST",
    body: req,
  });
}

/** Tek sorunun audit durumu. */
export async function getAuditStatus(
  questionId: number,
): Promise<ApiQuestionAudit> {
  return apiFetch<ApiQuestionAudit>(`/api/v2/admin/audit/status/${questionId}`);
}

/** Audit durumu özeti (dashboard). */
export async function getAuditStats(): Promise<ApiAuditStats> {
  return apiFetch<ApiAuditStats>(`/api/v2/admin/audit/stats`);
}

export { API_BASE };
