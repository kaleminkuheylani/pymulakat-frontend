// frontend/api/v2/questions.ts
// v2 API Client — FIXED VERSION — tek dosya, hem browser hem server'da çalışır

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface TestCase {
  input: any[];
  expected: any;
  description?: string;
}

export interface Question {
  id: number;
  title: string;
  category: string;
  level: string;
  description: string;
  starter_code?: string;
  function_name?: string;
  tags?: string[];
  hints?: string[];
  // 🆕 SEO & içerik
  explanation?: string;
  complexity?: string;
  related_concepts?: string[];
  related_question_ids?: number[];
  tutorial_slug?: string;
  meta_title?: string;
  meta_description?: string;
  // Related question objects (server-side prefetch ile doldurulur)
  related_questions?: Array<{
    id: number;
    title: string;
    category: string;
    level: string;
  }>;
  [key: string]: any;
}

export interface QuestionTests {
  question_id: number;
  title: string;
  function_name: string;
  test_cases: TestCase[];
}

export interface BestAttempt {
  passed_tests: number;
  total_tests: number;
  success: boolean;
  execution_time_ms: number;
  submitted_at: string;
}

export interface Progress {
  question_id: number;
  best_attempt: BestAttempt | null;
  total_attempts: number;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface Category {
  slug: string;
  name: string;
  count: number;
  color?: string;
  icon?: string;
  [key: string]: any;
}

export interface AttemptResponse {
  id: string | number;
  user_id: string;
  question_id: number;
  question_title?: string;
  category?: string;
  passed_tests: number;
  total_tests: number;
  success: boolean;
  execution_time_ms: number;
  hints_used?: number;
  created_at: string;
  user_code?: string;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  // 🆕 Token'i global olarak ekle (varsa) — her API call'unda auth header olur
  const token = typeof window !== "undefined" ? extractToken() : null;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }

  return res.json();
}

function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const token = extractToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function extractToken(): string | null {
  if (typeof window === "undefined") return null;

  // 1) Supabase storage key
  try {
    const supabaseAuth = JSON.parse(
      localStorage.getItem("sb-pymulakat-auth-token") ||
        sessionStorage.getItem("sb-pymulakat-auth-token") ||
        "{}"
    );
    if (supabaseAuth?.access_token) return supabaseAuth.access_token;
  } catch {
    // ignore
  }

  // 2) Plain 'token' key (fallback)
  return localStorage.getItem("token");
}

export const questionsAPI = {
  async list(params: {
    category?: string;
    level?: string;
    search?: string;
    tag?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ListResponse<Question>> {
    const qs = new URLSearchParams();
    if (params.category) qs.set("category", params.category);
    if (params.level) qs.set("level", params.level);
    if (params.search) qs.set("search", params.search);
    if (params.tag) qs.set("tag", params.tag);
    if (params.page) qs.set("page", String(params.page));
    if (params.limit) qs.set("limit", String(params.limit));

    const url = `${BASE_URL}/api/v2/questions${qs.toString() ? `?${qs}` : ""}`;
    return fetchJson<ListResponse<Question>>(url);
  },

  async listAll(category?: string): Promise<ListResponse<Question>> {
    const qs = category ? `?category=${encodeURIComponent(category)}` : "";
    const url = `${BASE_URL}/api/v2/questions/all${qs}`;
    return fetchJson<ListResponse<Question>>(url);
  },

  async getById(id: number, options: { includeStarter?: boolean } = {}): Promise<Question> {
    const qs = options.includeStarter ? "?include_starter=true" : "";
    const url = `${BASE_URL}/api/v2/questions/${id}${qs}`;
    return fetchJson<Question>(url);
  },

  async getTests(id: number): Promise<QuestionTests> {
    const url = `${BASE_URL}/api/v2/questions/${id}/tests`;
    // ✅ Backend envelope döndürüyor: { data: {...} }
    // Client düz objeyi bekliyor → .data'yı unwrap et
    const response = await fetchJson<{ data: QuestionTests }>(url, { headers: authHeaders() });
    return response.data ?? { question_id: id, title: '', function_name: 'solution', test_cases: [] };
  },

  async getProgress(id: number): Promise<Progress> {
    const url = `${BASE_URL}/api/v2/questions/${id}/progress`;
    const response = await fetchJson<{ data: Progress }>(url, { headers: authHeaders() });
    return response.data ?? { question_id: id, best_attempt: null, total_attempts: 0 };
  },
};

export const categoriesAPI = {
  async list(): Promise<{ data: Category[] }> {
    const url = `${BASE_URL}/api/v2/categories`;
    return fetchJson<{ data: Category[] }>(url);
  },

  async getBySlug(slug: string): Promise<Category> {
    const url = `${BASE_URL}/api/v2/categories/${encodeURIComponent(slug)}`;
    return fetchJson<Category>(url);
  },
};

// ─── interviewsAPI (backward compat) ───────────────────────────────
export const interviewsAPI = {
  async getMyAttempts(limit: number = 10): Promise<AttemptResponse[]> {
    const url = `${BASE_URL}/api/v2/attempts?limit=${limit}`;
    const response = await fetchJson<{ data: AttemptResponse[] } | AttemptResponse[]>(url, {
      headers: authHeaders(),
    });
    if (Array.isArray(response)) return response;
    return response?.data ?? [];
  },

  async getMyStats(): Promise<{
    total_attempts: number;
    success_count: number;
    fail_count: number;
    points: number;
    success_rate: number;
  }> {
    const url = `${BASE_URL}/api/v2/attempts/stats`;
    return fetchJson(url, { headers: authHeaders() });
  },
};
