// app/admin/test-diagnostics/page.tsx
// Detay sayfa fetch diagnostigi - 5 farkli soru, alan kontrolu
// Production debug icin. Kimlik dogrulama yok (test-only).

import { findQuestion } from "@/lib/api/questionAPI";
import type { ApiQuestion, ApiTestCase } from "@/lib/api/types";

type FullQuestion = ApiQuestion & {
  test_cases?: ApiTestCase[];
  hints?: string[];
};

interface DiagnosticResult {
  id: number;
  category: string;
  slug: string;
  title?: string;
  description?: string;
  starter_code?: string;
  test_cases_count?: number;
  test_cases_first?: any;
  level?: string;
  function_name?: string;
  has_hints?: boolean;
  status: "ok" | "missing_field" | "error";
  error?: string;
  field_issues: string[];
}

async function diagnoseQuestion(category: string, slug: string): Promise<DiagnosticResult> {
  const issues: string[] = [];
  const result: DiagnosticResult = {
    id: 0,
    category,
    slug,
    status: "ok",
    field_issues: [],
  };
  try {
    const q = (await findQuestion(category, slug)) as FullQuestion | null;
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
  } catch (e: any) {
    result.status = "error";
    result.error = e?.message ?? String(e);
  }
  return result;
}

const TEST_QUERIES: { category: string; slug: string; label: string }[] = [
  { category: "python-basics", slug: "palindrome-checker", label: "Python Temelleri - Palindrome Checker" },
  { category: "pandas", slug: "eksik-deger-doldurma", label: "Pandas - Eksik Değer Doldurma" },
  { category: "heap", slug: "kth-largest-element", label: "Heap - Kth Largest Element" },
  { category: "data-structures", slug: "en-uzun-artan-alt-dizi", label: "Veri Yapıları - En Uzun Artan Alt Dizi" },
  { category: "algorithms", slug: "matris-carpimi", label: "Algoritmalar - Matris Çarpımı" },
];

export const dynamic = "force-dynamic";

export default async function TestDiagnosticsPage() {
  const results: DiagnosticResult[] = [];
  for (const t of TEST_QUERIES) {
    const r = await diagnoseQuestion(t.category, t.slug);
    r.category = t.category;
    r.slug = t.slug;
    results.push(r);
  }

  const okCount = results.filter((r) => r.status === "ok").length;
  const missingCount = results.filter((r) => r.status === "missing_field").length;
  const errorCount = results.filter((r) => r.status === "error").length;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Test Diagnostics - Detay Sayfa Fetch</h1>
        <p className="text-white/60 text-sm mb-6">
          5 farkli soru icin findQuestion() cagirilir, tum alanlar kontrol edilir.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-emerald-300">{okCount}</div>
            <div className="text-sm text-white/60 mt-1">Tam dolu</div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-amber-300">{missingCount}</div>
            <div className="text-sm text-white/60 mt-1">Eksik alan</div>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-rose-300">{errorCount}</div>
            <div className="text-sm text-white/60 mt-1">Fetch hata</div>
          </div>
        </div>

        <div className="space-y-4">
          {results.map((r, i) => {
            const borderColor = r.status === "ok" ? "border-emerald-500/30" : r.status === "missing_field" ? "border-amber-500/30" : "border-rose-500/30";
            const bgColor = r.status === "ok" ? "bg-emerald-500/5" : r.status === "missing_field" ? "bg-amber-500/5" : "bg-rose-500/5";
            return (
              <div key={i} className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">
                    {TEST_QUERIES[i].label} <span className="text-white/40 text-sm">(id={r.id})</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${r.status === "ok" ? "bg-emerald-500/20 text-emerald-300" : r.status === "missing_field" ? "bg-amber-500/20 text-amber-300" : "bg-rose-500/20 text-rose-300"}`}>
                    {r.status === "ok" ? "OK" : r.status === "missing_field" ? "Eksik" : "Hata"}
                  </span>
                </div>

                {r.error && <div className="text-rose-300 text-sm mb-2">Hata: {r.error}</div>}

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-white/40">title:</span> {r.title ?? <em className="text-rose-300">yok</em>}</div>
                  <div><span className="text-white/40">level:</span> {r.level ?? <em className="text-rose-300">yok</em>}</div>
                  <div><span className="text-white/40">function_name:</span> <code className="text-cyan-300">{r.function_name ?? <em className="text-rose-300">yok</em>}</code></div>
                  <div><span className="text-white/40">test_count:</span> {r.test_cases_count ?? 0}</div>
                  <div><span className="text-white/40">has_hints:</span> {r.has_hints ? "var" : "yok"}</div>
                  <div><span className="text-white/40">slug:</span> {r.slug}</div>
                </div>

                {r.description && (
                  <div className="mt-2 text-xs text-white/50 line-clamp-2">
                    <strong>description:</strong> {r.description.slice(0, 200)}...
                  </div>
                )}

                {r.starter_code && (
                  <details className="mt-2">
                    <summary className="text-xs text-cyan-300 cursor-pointer">starter_code goster</summary>
                    <pre className="mt-1 p-2 bg-black/30 rounded text-xs overflow-x-auto">
                      <code>{r.starter_code}</code>
                    </pre>
                  </details>
                )}

                {r.test_cases_first && (
                  <details className="mt-2">
                    <summary className="text-xs text-cyan-300 cursor-pointer">
                      ilk test_case goster (test_count={r.test_cases_count})
                    </summary>
                    <pre className="mt-1 p-2 bg-black/30 rounded text-xs overflow-x-auto">
                      <code>{JSON.stringify(r.test_cases_first, null, 2)}</code>
                    </pre>
                  </details>
                )}

                {r.field_issues.length > 0 && (
                  <div className="mt-2 text-amber-300 text-sm">
                    Eksik alanlar: {r.field_issues.join(", ")}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
