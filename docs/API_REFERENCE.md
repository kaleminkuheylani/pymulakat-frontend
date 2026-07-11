# API Client Referansı (pymulakat-frontend)

**Mimari kuralı**: Inline fetch + inline URL YASAK. Tüm API'ler `lib/api/` altında.

**Son güncelleme**: 2026-07-11 (paralel agent görevi)

## Yapı

```
lib/api/
├── index.ts             (apiFetch wrapper, API_BASE, ApiError)
├── types.ts             (tüm type'lar — TEK KAYNAK, 281 satır)
├── questionAPI.ts       (soru verisi, 14 fonksiyon)
├── authAPI.ts           (backend auth, 13 fonksiyon + interface)
├── formAPI.ts           (form işlemleri, 5 fonksiyon)
├── recommendationsAPI.ts (öneri motoru, 3 fonksiyon)
```

## API'ler ve Kullanıcılar

### 1. `questionAPI` (lib/api/questionAPI.ts)

| Fonksiyon | Endpoint | Kullanan sayfalar |
|---|---|---|
| `fetchAllQuestions()` | GET /api/v2/questions | sitemap.ts, ServerQuestionList |
| `getAllQuestions(params?)` | GET /api/v2/questions/all | dashboard/page.tsx |
| `getById(id)` | GET /api/v2/questions/{id} | (legacy) |
| `getBySlug(category, slug)` | GET /api/v2/questions/by-slug/{cat}/{slug} | (legacy) |
| `findQuestion(category, idOrSlug)` | composite | interviews/.../page.tsx, sitemap.ts |
| `listQuestionsByCategory(category)` | composite | ServerQuestionList |
| `getQuestionTestsBySlug(cat, slug)` | GET /api/v2/questions/by-slug/{cat}/{slug}/tests | interviews/.../page.tsx |
| `getQuestionTests(cat, slug)` | alias | (alias) |
| `listCategories()` | GET /api/v2/categories | interviews/page.tsx |
| `getCategories()` | composite (grouped) | interviews/page.tsx |
| `getCategoryDetail(slug)` | composite | (future) |
| `getRecommendationFlow(limit)` | GET /api/v2/recommendations/flow | dashboard/page.tsx |
| `getCommunityRecommendations(limit)` | GET /api/v2/recommendations/community | dashboard/page.tsx |
| `slugifyTitle(title)` | helper | ServerQuestionList, sitemap.ts |

### 2. `authAPI` (lib/api/authAPI.ts)

Backend auth (FastAPI).

| Fonksiyon | Endpoint | Kullanan sayfalar |
|---|---|---|
| `getMe()` | GET /api/v2/users/me | interviews/.../layout.tsx, useUser.ts, login/page.tsx |
| `login(payload)` | POST /api/v2/auth/login | login/page.tsx |
| `register(payload)` | POST /api/v2/auth/register | register/page.tsx |
| `verifyEmail(payload)` | POST /api/v2/auth/verify | register/page.tsx |
| `resendCode(email)` | POST /api/v2/auth/resend-code | register/page.tsx |
| `refreshToken(token)` | POST /api/v2/auth/refresh | useUser.ts |
| `deleteAccount(confirmation)` | DELETE /api/v2/users/me | profile/page.tsx |
| `submitAttempt(payload)` | POST /api/v2/attempts | WorkspaceClient, WorkspaceMobileClient |
| `getMyAttempts(limit)` | GET /api/v2/users/me/attempts | profile/page.tsx |
| `getMyStats()` | GET /api/v2/users/me/stats | profile/page.tsx |
| `getPlayCount()` | GET /api/v2/users/me/play-count | WorkspaceClient, WorkspaceMobileClient |
| `incrementPlayCount()` | POST /api/v2/users/me/play-count | WorkspaceClient, WorkspaceMobileClient |

### 3. `formAPI` (lib/api/formAPI.ts)

| Fonksiyon | Endpoint | Kullanan sayfalar |
|---|---|---|
| `listForms(category?)` | GET /api/v2/forms | dashboard/forms/page.tsx |
| `getForm(id)` | GET /api/v2/forms/{id} | dashboard/forms/[id]/page.tsx |
| `createForm(payload)` | POST /api/v2/forms | dashboard/forms/page.tsx (admin) |
| `submitReply(formId, payload)` | POST /api/v2/forms/{id}/reply | dashboard/forms/[id]/page.tsx |
| `listFormCategories()` | GET /api/v2/forms/categories | dashboard/forms/page.tsx, FormCategoryTabs |

### 4. `recommendationsAPI` (lib/api/recommendationsAPI.ts)

| Fonksiyon | Endpoint | Kullanan sayfalar |
|---|---|---|
| `getRecommendations(limit, options?)` | GET /api/v2/recommendations | useRecommendations.ts |
| `getCommunityPicks(limit, options?)` | GET /api/v2/recommendations/community | useRecommendations.ts |
| `getAllQuestionsForRecs(limit)` | GET /api/v2/questions/all?limit=200 | useRecommendations.ts (fallback) |


Supabase Auth REST (GoTrue backend).

| Fonksiyon | Endpoint | Kullanan sayfalar |
|---|---|---|
| `supabaseRefresh(refreshToken)` | POST /auth/v1/token?grant_type=refresh_token | (reserved) |
| `supabaseGetMe(accessToken)` | GET /auth/v1/user | (reserved) |

## Kullanım istatistikleri

| API | Kullanan dosya sayısı |
|---|---|
| `questionAPI` | 6 |
| `authAPI` | 7 |
| `formAPI` | 2 |
| `recommendationsAPI` | 1 |

## Kurallar (KESİN)

1. **Asla inline type tanımlama** — `types.ts`'ten al
2. **Asla inline fetch** — `xxxAPI.fn()` üzerinden
3. **Asla direkt URL** — `API_BASE` sadece `index.ts`'te
4. **Asla `any` tipi** — types.ts'ten doğru type
5. **Asla response manuel parse** — `apiFetch<T>()` typed data döner

## Yeni API eklerken

- Type → `types.ts`
- Function → ilgili modül (`xxxAPI.ts`)
- Yoksa yeni modül oluştur
- Asla başka modülde fetch yazma

## Cache stratejisi (next/cache)

- `revalidate: 3600` (1 saat ISR) — sayfa listeleri
- `cache: "no-store"` — user-specific
- `tags: ["questions-list"]` — on-demand reval
