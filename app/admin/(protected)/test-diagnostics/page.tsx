// app/admin/test-diagnostics/page.tsx
// TÜM 85 detay sayfa fetch diagnostigi.
// Production debug + regression test icin.
//
// MİMARİ:
// - Server component: tüm soru listesini backend'den al (getAllQuestions)
// - Her soru icin findQuestion(category, slug) cagir (gercek production path)
// - 8 alan kontrolu: title, description, starter_code, test_cases,
//   level, function_name, category, slug, hints
// - Category bazli gruplanmis sonuclar
// - Sonuc: ok / missing_field / error + detay
// - Her sorunun kategory stats'i + tam dolu orani
//
// MİMARİ KURALLAR (KESİN):
// - lib/api/ uzerinden fetch (inline fetch YASAK)
// - Promise.all ile paralel (85 soru × ~50ms = ~4s, sirali olsa 8s+)
// - Bulunamayan slug'lar 'error' (DB-FIRST'te canonical slug kullaniyoruz)

import { findQuestion, getAllQuestions } from "@/lib/api/questionAPI";
import { CATEGORY_LABEL, getCategoryUrl } from "@/lib/categorySlug";
import type { ApiQuestion, ApiTestCase } from "@/lib/api/types";

type FullQuestion = ApiQuestion & {
  test_cases?: ApiTestCase[];
  hints?: string[];
};

interface DiagnosticResult {
  id: number;
  category: string;
  categoryLabel: string;
  slug: string;
  title?: string;
  description?: string;
  starter_code?: string;
  test_cases_count?: number;
  test_cases_first?: unknown;
  level?: string;
  function_name?: string;
  has_hints?: boolean;
  status: "ok" | "missing_field" | "error";
  error?: string;
  field_issues: string[];
  /** Response time (ms) */
  elapsedMs: number;
}

/** Tek bir soruyu denetle. */
async function diagnoseQuestion(
  category: string,
  slug: string
): Promise<DiagnosticResult> {
  const issues: string[] = [];
  const result: DiagnosticResult = {
    id: 0,
    category,
    categoryLabel: CATEGORY_LABEL[category] || category,
    slug,
    status: "ok",
    field_issues: [],
    elapsedMs: 0,
  };

  const start = performance.now();
  try {
    const q = (await findQuestion(category, slug)) as FullQuestion | null;
    result.elapsedMs = Math.round(performance.now() - start);

    if (!q) {
      result.status = "error";
      result.error = "findQuestion null dondu";
      return result;
    }

    result.id = q.id;
    result.title = q.title ?? undefined;
    result.description = q.description ?? undefined;
    result.starter_code = q.starter_code ?? undefined;
    result.test_cases_count = Array.isArray(q.test_cases) ? q.test_cases.length : 0;
    result.test_cases_first = Array.isArray(q.test_cases) && q.test_cases.length > 0
      ? q.test_cases[0]
      : null;
    result.level = q.level ?? undefined;
    result.function_name = q.function_name ?? undefined;
    result.has_hints = Array.isArray(q.hints) && q.hints.length > 0;

    if (!q.title) issues.push("title");
    if (!q.description) issues.push("description");
    if (!q.starter_code) issues.push("starter_code");
    if (!Array.isArray(q.test_cases) || q.test_cases.length === 0) issues.push("test_cases");
    if (!q.level) issues.push("level");
    if (!q.function_name) issues.push("function_name");
    if (!q.category) issues.push("category");
    if (!q.slug) issues.push("slug");

    result.field_issues = issues;
    result.status = issues.length > 0 ? "missing_field" : "ok";
  } catch (e) {
    result.elapsedMs = Math.round(performance.now() - start);
    result.status = "error";
    result.error = e instanceof Error ? e.message : String(e);
  }
  return result;
}

export const dynamic = "force-dynamic";

export default async function TestDiagnosticsPage() {
  // 1) Tüm soru listesini backend'den al
  const allData = await getAllQuestions({ limit: 200 });
  const questions = allData;

  // 2) Her soru icin findQuestion cagir (paralel)
  //    85 soru × ~50ms = ~4-5s toplam
  const start = performance.now();
  const results = await Promise.all(
    questions
      .filter((q) => q.slug && q.category)
      .map((q) => {
        const category = q.category as string;
        const slug = q.slug as string;
        return diagnoseQuestion(category, slug);
      })
  );
  const totalElapsedMs = Math.round(performance.now() - start);

  // 3) Stats
  const okCount = results.filter((r) => r.status === "ok").length;
  const missingCount = results.filter((r) => r.status === "missing_field").length;
  const errorCount = results.filter((r) => r.status === "error").length;
  const checkedCount = results.length;
  const total = questions.length;

  // 4) Category bazli grupla
  const byCategory = new Map<string, DiagnosticResult[]>();
  for (const r of results) {
    if (!byCategory.has(r.category)) byCategory.set(r.category, []);
    byCategory.get(r.category)!.push(r);
  }

  // 5) Ortalama response time
  const avgMs = results.length > 0
    ? Math.round(results.reduce((a, r) => a + r.elapsedMs, 0) / results.length)
    : 0;
  const maxMs = results.length > 0
    ? Math.max(...results.map((r) => r.elapsedMs))
    : 0;

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-2">
          <Database className="w-4 h-4" />
          Test Diagnostics
        </div>
        <h1 className="text-2xl font-bold mb-2">Detay Sayfa Fetch Denetimi</h1>
        <p className="text-white/60 text-sm">
          Tüm 85 soru için findQuestion() çağrılır, 8 alan kontrol edilir.{" "}
          <strong>Canonical slug</strong> kullanılır (DB-FIRST mimari).
        </p>
      </div>

      {/* ─── Stats banner ───────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-900/50 border border-white/10 rounded-lg p-4">
          <div className="text-xs text-white/50 mb-1">Denetlenen</div>
          <div className="text-2xl font-bold text-white">
            {checkedCount}
            <span className="text-sm text-white/40 font-normal"> / {total}</span>
          </div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
          <div className="text-xs text-emerald-300 mb-1">Tam Dolu</div>
          <div className="text-2xl font-bold text-emerald-300">{okCount}</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <div className="text-xs text-amber-300 mb-1">Eksik Alan</div>
          <div className="text-2xl font-bold text-amber-300">{missingCount}</div>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4">
          <div className="text-xs text-rose-300 mb-1">Fetch Hata</div>
          <div className="text-2xl font-bold text-rose-300">{errorCount}</div>
        </div>
      </div>

      {/* ─── Performance ────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-900/50 border border-white/10 rounded-lg p-4">
          <div className="text-xs text-white/50 mb-1">Toplam Süre</div>
          <div className="text-lg font-bold text-white">{(totalElapsedMs / 1000).toFixed(2)}s</div>
        </div>
        <div className="bg-slate-900/50 border border-white/10 rounded-lg p-4">
          <div className="text-xs text-white/50 mb-1">Ortalama / Soru</div>
          <div className="text-lg font-bold text-white">{avgMs}ms</div>
        </div>
        <div className="bg-slate-900/50 border border-white/10 rounded-lg p-4">
          <div className="text-xs text-white/50 mb-1">En Yavaş</div>
          <div className="text-lg font-bold text-white">{maxMs}ms</div>
        </div>
      </div>

      {/* ─── Category bazlı sonuçlar ─────────────────────────── */}
      <div className="space-y-3">
        {Array.from(byCategory.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([cat, items]) => {
            const catOk = items.filter((i) => i.status === "ok").length;
            const catMissing = items.filter((i) => i.status === "missing_field").length;
            const catError = items.filter((i) => i.status === "error").length;
            const label = CATEGORY_LABEL[cat] || cat;
            const displayUrl = getCategoryUrl(cat);
            const total = items.length;
            const pct = Math.round((catOk / total) * 100);

            return (
              <details
                key={cat}
                className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden"
              >
                <summary className="px-4 py-3 cursor-pointer hover:bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        catError > 0
                          ? "bg-rose-400"
                          : catMissing > 0
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                      }`}
                    />
                    <span className="font-semibold text-white">{label}</span>
                    <span className="text-xs text-white/40 font-mono">{cat}</span>
                    <a
                      href={displayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-cyan-300 hover:underline"
                    >
                      ({displayUrl})
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-xs flex-shrink-0">
                    <span className="text-emerald-300">{catOk} OK</span>
                    {catMissing > 0 && <span className="text-amber-300">{catMissing} eksik</span>}
                    {catError > 0 && <span className="text-rose-300">{catError} hata</span>}
                    <span className="text-white/40 font-mono">{pct}%</span>
                  </div>
                </summary>

                <div className="border-t border-white/5">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900/30 text-[10px] uppercase tracking-wider text-white/40">
                      <tr>
                        <th className="text-left px-4 py-1.5 font-semibold">ID</th>
                        <th className="text-left px-4 py-1.5 font-semibold">Başlık</th>
                        <th className="text-left px-4 py-1.5 font-semibold">Slug</th>
                        <th className="text-left px-4 py-1.5 font-semibold">Status</th>
                        <th className="text-left px-4 py-1.5 font-semibold">Sorunlar</th>
                        <th className="text-left px-4 py-1.5 font-semibold">Süre</th>
                        <th className="px-4 py-1.5"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((r) => (
                        <tr
                          key={r.id}
                          className="border-t border-white/5 hover:bg-white/5"
                        >
                          <td className="px-4 py-1.5 text-white/40 font-mono text-xs">
                            {r.id}
                          </td>
                          <td className="px-4 py-1.5 text-white text-xs">
                            {r.title ?? <em className="text-rose-300">null</em>}
                          </td>
                          <td className="px-4 py-1.5 font-mono text-[10px] text-cyan-300">
                            {r.slug}
                          </td>
                          <td className="px-4 py-1.5">
                            {r.status === "ok" ? (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                                OK
                              </span>
                            ) : r.status === "missing_field" ? (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300">
                                Eksik
                              </span>
                            ) : (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300">
                                Hata
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-1.5 text-[10px] text-rose-200/80">
                            {r.field_issues.length > 0
                              ? r.field_issues.join(", ")
                              : r.error
                                ? r.error
                                : "—"}
                          </td>
                          <td className="px-4 py-1.5 text-[10px] text-white/40 font-mono">
                            {r.elapsedMs}ms
                          </td>
                          <td className="px-4 py-1.5 text-right">
                            <a
                              href={`/interviews/${r.category}/${r.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/30 hover:text-white text-xs"
                            >
                              ↗
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            );
          })}
      </div>

      {/* ─── Altbilgi ──────────────────────────────────────── */}
      <div className="mt-6 text-[10px] text-white/30 leading-relaxed">
        <p>
          <strong>Mimari:</strong> DB-FIRST — her soru <code className="bg-black/30 px-1 rounded">findQuestion(category, slug)</code>{" "}
          ile backend&apos;den çekilir, sonra 8 alan doğrulanır.
        </p>
        <p>
          <strong>Test edilen alanlar:</strong> title, description, starter_code, test_cases, level,
          function_name, category, slug, hints.
        </p>
        <p>
          <strong>Performans:</strong> 85 soru Promise.all ile paralel çekilir. Ortalama {avgMs}ms / soru.
        </p>
      </div>
    </div>
  );
}

import { Database } from "lucide-react";
