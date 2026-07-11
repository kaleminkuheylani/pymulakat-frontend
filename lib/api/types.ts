// lib/api/types.ts
//
// 📌 TÜM API type'ları için TEK KAYNAK. Başka yerde inline type tanımlama YASAK.
// Mimari kuralı (project memory):
//   - lib/api/types.ts       : tüm type'lar
//   - lib/api/index.ts       : base fetch wrapper, error handling
//   - lib/api/questionAPI.ts : question endpoint'leri
//   - lib/api/authAPI.ts     : auth endpoint'leri
//   - lib/api/formAPI.ts     : form endpoint'leri
//
// Backend: FastAPI Railway (https://pymulakat-backend-production.up.railway.app)
// Mimari: DB-FIRST (sorular artık backend DB'den, CSV değil).

// ═══════════════════════════════════════════════════════════════
// ─── Question ────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Backend InterviewOut Pydantic modeli ile uyumlu.
 * DB-FIRST: backend /api/v2/questions endpoint'i döner.
 */
export interface ApiQuestion {
  id: number;
  title: string;
  category: string;
  level: string;
  description: string;
  starter_code: string | null;
  hints: string[];
  tags?: string[];
  slug: string | null;
  function_name?: string | null;
  complexity?: string | null;
  topic?: string | null;
  explanation?: string | null;
  related_concepts?: string[];
  related_question_ids?: number[];
  tutorial_slug?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string[];
}

/**
 * Backend TestCase endpoint shape.
 * SSR'da hem misafir hem üye okuyabilsin diye public.
 */
export interface ApiTestCase {
  input: unknown;
  expected: unknown;
  actual?: unknown;
  description?: string;
}

export interface ApiQuestionTests {
  question_id: number;
  function_name: string;
  test_cases: ApiTestCase[];
}

// ═══════════════════════════════════════════════════════════════
// ─── Category ────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Backend /api/v2/categories'ten dönen liste elemanı.
 * DB-FIRST: artık backend unique category'leri döner.
 */
export interface ApiCategory {
  category: string;
  slug?: string;
  label?: string;
  description?: string;
  icon?: string;
  count: number;
  color?: string;
}

export interface ApiCategoryDetail extends ApiCategory {
  questions: ApiQuestion[];
}

// ═══════════════════════════════════════════════════════════════
// ─── User / Auth ─────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Backend /auth/me endpoint shape — Supabase user ile senkron.
 * Auth state hem client (useUser) hem server (authAPI.getMe) tarafından tüketilir.
 */
export interface ApiUser {
  id: string;
  email: string;
  username: string;
  is_verified?: boolean;
  points?: number;
  total_attempts?: number;
  success_count?: number;
  fail_count?: number;
  success_rate?: number;
  solution_average_time?: number;
  solution_average_time_ms?: number;
  created_at?: string;
}

export interface ApiProfile extends ApiUser {
  // İleride ek profil alanları (avatar, bio vb.) buraya eklenir
  avatar_url?: string;
  bio?: string;
  updated_at?: string;
}

export interface ApiAuthResponse {
  ok: boolean;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  user?: ApiUser;
  message?: string;
}

export interface ApiMessageResponse {
  ok: boolean;
  message?: string;
  verified?: boolean;
  expires_in_minutes?: number;
}

// ═══════════════════════════════════════════════════════════════
// ─── Form (community) ────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Backend /api/v2/forms endpoint shape.
 * Topluluk paylaşımları (soru yardımı, kod yardımı, geri bildirim, paylaşım).
 */
export interface ApiFormReply {
  id: number;
  form_id: number;
  user_id: string;
  body: string;
  created_at: string;
  author?: Pick<ApiUser, "id" | "username">;
}

export interface ApiForm {
  id: number;
  category: string; // 'feedback' | 'question_help' | 'code_help' | 'share'
  title: string;
  body: string;
  author_id: string;
  author_username?: string;
  tags?: string[];
  view_count?: number;
  reply_count?: number;
  question_id?: number | null;
  created_at: string;
  updated_at?: string;
  replies?: ApiFormReply[];
}

export interface ApiFormCategory {
  slug: string; // 'feedback' | 'question_help' | 'code_help' | 'share'
  label: string;
  icon: string;
  color: string;
  description?: string;
}

export interface ApiFormCreatePayload {
  category: string;
  title: string;
  body: string;
  tags?: string[];
  question_id?: number;
}

export interface ApiFormReplyPayload {
  body: string;
}

// ═══════════════════════════════════════════════════════════════
// ─── Pagination & Error ──────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Backend InterviewListResponse / ListResponse envelope shape.
 * Birçok endpoint { items, total, page, limit, has_next, has_prev } döner.
 */
export interface ApiPagination {
  items?: unknown[];
  data?: unknown[]; // bazı endpoint'ler data kullanıyor
  total?: number;
  page?: number;
  limit?: number;
  has_next?: boolean;
  has_prev?: boolean;
  next_cursor?: string | null;
}

/**
 * Standart hata response shape (FastAPI HTTPException + custom error'lar).
 * Tüm xxxAPI.ts bu shape'i parse eder.
 */
export interface ApiErrorBody {
  detail?: string | Array<{ loc?: string[]; msg: string; type?: string }>;
  message?: string;
  error?: string;
  code?: string;
}

/**
 * fetch wrapper'ın throw ettiği typed error.
 * UI katmanı `instanceof ApiError` ile yakalar, status/endpoint'e göre mesaj gösterir.
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly endpoint: string;
  public readonly body?: ApiErrorBody;

  constructor(status: number, endpoint: string, message: string, body?: ApiErrorBody) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.endpoint = endpoint;
    this.body = body;
  }
}

// ═══════════════════════════════════════════════════════════════
// ─── Recommendations ─────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

/**
 * Backend /api/v2/recommendations dönüş şekli.
 * Dashboard'da PersonalFlow + CommunityFlow tarafından tüketilir.
 */
export type ApiRecommendationItemType = "question" | "form" | "tutorial";

export interface ApiRecommendationItem {
  type: ApiRecommendationItemType;
  id: number;
  title: string;
  category?: string;
  level?: string;
  slug?: string;
  body?: string;
  tags?: string[];
  score: number;
  reason: string;
  created_at?: string;
  view_count?: number;
  attempt_count?: number;
  reply_count?: number;
}


export interface ApiRecommendationFlow {
  sections: {
    personal: ApiRecommendationItem[];
    recent: ApiRecommendationItem[];
    popular: ApiRecommendationItem[];
    next_level: ApiRecommendationItem[];
    recommended?: ApiRecommendationItem[];
  };
  context: ApiRecommendationContext;
  items?: ApiRecommendationItem[];
  next_cursor?: string | null;
  source?: string;
}

// ═══════════════════════════════════════════════════════════════════
// ─── Recommendation (basit liste) ────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

export interface ApiRecommendation {
  id?: number;
  question_id?: number;
  title?: string;
  category?: string;
  level?: string;
  description?: string;
  slug?: string;
  reason?: string;
  score?: number;
  url?: string;
}

export interface ApiRecommendationContext {
  is_authenticated: boolean;
  top_categories: string[];
  solved_categories?: string[];
  success_rate?: number;
  target_level?: string;
  recent_category?: string | null;
  user_level?: string | null;
  total_attempts?: number;
}

// ═══════════════════════════════════════════════════════════════════
// ─── Supabase Auth (REST) ────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

export interface ApiSupabaseSession {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
  token_type?: string;
  user?: ApiSupabaseUser;
}

export interface ApiSupabaseUser {
  id: string;
  email?: string;
  phone?: string;
  role?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}
