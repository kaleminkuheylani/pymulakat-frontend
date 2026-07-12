"use client";

// app/admin/audit/page.tsx
//
// Soru denetim komponenti (admin).
//  - Scrollable dropdown: tüm sorular (audit status ile)
//  - "Kod Üret" butonu: Mavis API ile doğru kodu üret
//  - "Testleri Çalıştır" butonu: üretilen kodu subprocess ile test et
//  - Sonuç paneli: kaç test passed, kaç failed
//  - Tüm testler geçtiyse otomatik olarak DB'de is_audited=true işaretle

import { useEffect, useState, useCallback } from "react";
import {
  listAuditQuestions,
  generateAuditCode,
  runAuditTests,
  markAudit,
  getAuditStats,
} from "@/lib/api/auditAPI";
import type {
  ApiQuestionAudit,
  ApiAuditTestResult,
  ApiAuditStats,
} from "@/lib/api/types";
import { CheckCircle2, XCircle, AlertCircle, Sparkles, Play, Save, RefreshCw } from "lucide-react";

export default function AuditPage() {
  const [questions, setQuestions] = useState<ApiQuestionAudit[]>([]);
  const [stats, setStats] = useState<ApiAuditStats | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [testResults, setTestResults] = useState<ApiAuditTestResult[] | null>(null);
  const [stderr, setStderr] = useState<string | null>(null);
  const [loading, setLoading] = useState({ list: false, gen: false, run: false, mark: false });
  const [error, setError] = useState<string | null>(null);

  // Soru seçildiğinde detayları al
  const selected = questions.find((q) => q.id === selectedId) || null;

  // Listeyi yükle
  const loadList = useCallback(async () => {
    setLoading((l) => ({ ...l, list: true }));
    setError(null);
    try {
      const [data, stat] = await Promise.all([
        listAuditQuestions(),
        getAuditStats(),
      ]);
      setQuestions(data);
      setStats(stat);
    } catch (e: any) {
      setError(e?.message || "Liste yüklenemedi");
    } finally {
      setLoading((l) => ({ ...l, list: false }));
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  // Kod üret
  const handleGenerate = async () => {
    if (!selected) return;
    setLoading((l) => ({ ...l, gen: true }));
    setError(null);
    setTestResults(null);
    try {
      // Sorunun description, function_name, test_cases bilgisi gerekiyor.
      // /api/v2/questions/by-slug/{cat}/{slug} ile çekilebilir ya da
      // basitçe list endpoint'ine ekleme yapıldı (admin endpoint zaten döndürüyor).
      // Geçici: listeden description yok → sadece code generate ederken DB'den çekmiyoruz.
      // Çözüm: yeni admin endpoint ile full question data al.
      const resp = await generateAuditCode({
        question_id: selected.id,
        description: (selected as any).description || "",
        function_name: (selected as any).function_name || "",
        test_cases: (selected as any).test_cases || [],
        starter_code: (selected as any).starter_code || undefined,
      });
      setGeneratedCode(resp.code);
    } catch (e: any) {
      setError(e?.message || "Kod üretilemedi");
    } finally {
      setLoading((l) => ({ ...l, gen: false }));
    }
  };

  // Test çalıştır
  const handleRun = async () => {
    if (!selected || !generatedCode) return;
    setLoading((l) => ({ ...l, run: true }));
    setError(null);
    setTestResults(null);
    setStderr(null);
    try {
      const resp = await runAuditTests({
        question_id: selected.id,
        code: generatedCode,
        function_name: (selected as any).function_name || "",
        test_cases: (selected as any).test_cases || [],
      });
      setTestResults(resp.results);
      setStderr(resp.stderr || null);

      // Tüm testler geçtiyse otomatik mark
      if (resp.passed_count === resp.total && resp.total > 0) {
        await handleMark(true, resp);
      }
    } catch (e: any) {
      setError(e?.message || "Test çalıştırılamadı");
    } finally {
      setLoading((l) => ({ ...l, run: false }));
    }
  };

  // Mark (DB güncelle)
  const handleMark = async (passed: boolean, prevResult?: any) => {
    if (!selected) return;
    setLoading((l) => ({ ...l, mark: true }));
    try {
      await markAudit({ question_id: selected.id, passed });
      await loadList(); // listeyi yenile (audit_status güncellendi)
    } catch (e: any) {
      setError(e?.message || "Mark güncellenemedi");
    } finally {
      setLoading((l) => ({ ...l, mark: false }));
    }
  };

  // Stats hesapla
  const passedCount = testResults?.filter((r) => r.passed).length || 0;
  const failedCount = testResults?.filter((r) => !r.passed).length || 0;
  const totalTests = testResults?.length || 0;
  const allPassed = testResults && passedCount === totalTests && totalTests > 0;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Soru Denetim Aracı
          </h1>
          <p className="mt-2 text-slate-400">
            Mavis API ile üretilen kodu test case'lerde çalıştır, tüm testler
            geçerse soruyu denetlenmiş olarak işaretle.
          </p>
        </header>

        {/* Stats Banner */}
        {stats && (
          <div className="mb-6 grid grid-cols-4 gap-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-slate-400">Toplam</div>
            </div>
            <div className="rounded-lg border border-emerald-800/40 bg-emerald-950/30 p-4">
              <div className="text-2xl font-bold text-emerald-300">{stats.passed}</div>
              <div className="text-sm text-emerald-400">Passed</div>
            </div>
            <div className="rounded-lg border border-rose-800/40 bg-rose-950/30 p-4">
              <div className="text-2xl font-bold text-rose-300">{stats.failed}</div>
              <div className="text-sm text-rose-400">Failed</div>
            </div>
            <div className="rounded-lg border border-amber-800/40 bg-amber-950/30 p-4">
              <div className="text-2xl font-bold text-amber-300">{stats.pending}</div>
              <div className="text-sm text-amber-400">Pending</div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-rose-800/50 bg-rose-950/30 p-4 text-rose-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div className="text-sm">{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ─── Sol Panel: Soru Dropdown ─── */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                Soru Seç
              </h2>

              {/* Dropdown Trigger */}
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="w-full rounded border border-slate-700 bg-slate-800 px-4 py-3 text-left hover:border-amber-500/50"
              >
                {selected ? (
                  <div>
                    <div className="font-medium">
                      #{selected.id} {selected.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      {selected.category} · {selected.level}
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500">— Soru seçin —</div>
                )}
              </button>

              {/* Scrollable Dropdown */}
              {dropdownOpen && (
                <div className="mt-2 max-h-96 overflow-y-auto rounded border border-slate-700 bg-slate-950">
                  {loading.list ? (
                    <div className="p-4 text-center text-slate-500">Yükleniyor...</div>
                  ) : questions.length === 0 ? (
                    <div className="p-4 text-center text-slate-500">Soru yok</div>
                  ) : (
                    questions.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => {
                          setSelectedId(q.id);
                          setDropdownOpen(false);
                          setGeneratedCode("");
                          setTestResults(null);
                        }}
                        className="flex w-full items-center justify-between gap-2 border-b border-slate-800/50 px-3 py-2 text-left text-sm hover:bg-slate-800/50"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="truncate">
                            #{q.id} {q.title}
                          </div>
                          <div className="text-xs text-slate-500">
                            {q.category} · {q.level}
                          </div>
                        </div>
                        <AuditBadge status={q.audit_status} />
                      </button>
                    ))
                  )}
                </div>
              )}

              <button
                onClick={loadList}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-amber-500/50"
              >
                <RefreshCw className="h-4 w-4" />
                Listeyi Yenile
              </button>
            </div>
          </div>

          {/* ─── Sağ Panel: İşlem Alanı ─── */}
          <div className="lg:col-span-2 space-y-6">
            {selected ? (
              <>
                {/* Soru Bilgisi */}
                <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-semibold">
                        #{selected.id} {selected.title}
                      </h2>
                      <div className="mt-1 text-sm text-slate-400">
                        {selected.category} · {selected.level} ·{" "}
                        <code className="rounded bg-slate-800 px-1">
                          {selected.slug}
                        </code>
                      </div>
                    </div>
                    <AuditBadge status={selected.audit_status} big />
                  </div>
                </div>

                {/* Üretilen Kod */}
                <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                      Üretilen Kod (Mavis API)
                    </h3>
                    <button
                      onClick={handleGenerate}
                      disabled={loading.gen}
                      className="flex items-center gap-2 rounded bg-amber-500 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-amber-400 disabled:opacity-50"
                    >
                      <Sparkles className="h-4 w-4" />
                      {loading.gen ? "Üretiliyor..." : "Kod Üret"}
                    </button>
                  </div>
                  <pre className="max-h-64 overflow-auto rounded bg-slate-950 p-3 text-xs">
                    <code className="text-slate-300">
                      {generatedCode || "// 'Kod Üret' butonuna bas"}
                    </code>
                  </pre>
                </div>

                {/* Test Sonuçları */}
                <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                      Test Sonuçları
                    </h3>
                    <button
                      onClick={handleRun}
                      disabled={!generatedCode || loading.run}
                      className="flex items-center gap-2 rounded bg-emerald-500 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-emerald-400 disabled:opacity-50"
                    >
                      <Play className="h-4 w-4" />
                      {loading.run ? "Çalışıyor..." : "Testleri Çalıştır"}
                    </button>
                  </div>

                  {testResults === null ? (
                    <div className="rounded bg-slate-950 p-4 text-center text-sm text-slate-500">
                      {generatedCode
                        ? "Test sonuçları burada görünecek"
                        : "Önce kod üret"}
                    </div>
                  ) : (
                    <>
                      <div className="mb-3 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                          <strong>{passedCount}</strong> passed
                        </div>
                        <div className="flex items-center gap-1 text-rose-400">
                          <XCircle className="h-4 w-4" />
                          <strong>{failedCount}</strong> failed
                        </div>
                        <div className="text-slate-400">
                          Toplam <strong>{totalTests}</strong> test
                        </div>
                        {allPassed && (
                          <div className="ml-auto flex items-center gap-1 text-emerald-300">
                            <CheckCircle2 className="h-4 w-4" />
                            Otomatik işaretlendi ✓
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        {testResults.map((r, i) => (
                          <TestResultRow key={i} index={i} result={r} />
                        ))}
                      </div>
                      {stderr && (
                        <details className="mt-3">
                          <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-300">
                            Stderr (debug)
                          </summary>
                          <pre className="mt-2 max-h-32 overflow-auto rounded bg-slate-950 p-2 text-xs text-rose-300">
                            {stderr}
                          </pre>
                        </details>
                      )}
                    </>
                  )}
                </div>

                {/* Manuel Mark */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleMark(true)}
                    disabled={loading.mark}
                    className="flex items-center gap-2 rounded border border-emerald-700 bg-emerald-950/30 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-950/50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Passed olarak işaretle
                  </button>
                  <button
                    onClick={() => handleMark(false)}
                    disabled={loading.mark}
                    className="flex items-center gap-2 rounded border border-rose-700 bg-rose-950/30 px-4 py-2 text-sm text-rose-200 hover:bg-rose-950/50"
                  >
                    <XCircle className="h-4 w-4" />
                    Failed olarak işaretle
                  </button>
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-12 text-center text-slate-500">
                Denetlemek istediğin soruyu seç
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Sub Components ───────────────────────────────────────

function AuditBadge({ status, big }: { status: "pending" | "passed" | "failed"; big?: boolean }) {
  const map = {
    passed: { color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", icon: CheckCircle2, label: "Passed" },
    failed: { color: "bg-rose-500/15 text-rose-300 border-rose-500/30", icon: XCircle, label: "Failed" },
    pending: { color: "bg-amber-500/15 text-amber-300 border-amber-500/30", icon: AlertCircle, label: "Pending" },
  };
  const { color, icon: Icon, label } = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs ${color} ${
        big ? "px-3 py-1 text-sm" : ""
      }`}
    >
      <Icon className={big ? "h-4 w-4" : "h-3 w-3"} />
      {label}
    </span>
  );
}

function TestResultRow({ index, result }: { index: number; result: ApiAuditTestResult }) {
  return (
    <div
      className={`flex items-start gap-2 rounded border p-2 text-xs ${
        result.passed
          ? "border-emerald-800/30 bg-emerald-950/20"
          : "border-rose-800/30 bg-rose-950/20"
      }`}
    >
      {result.passed ? (
        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
      ) : (
        <XCircle className="h-4 w-4 flex-shrink-0 text-rose-400" />
      )}
      <div className="flex-1 min-w-0">
        <div className="font-mono text-slate-300">
          Test #{index + 1}
        </div>
        <div className="mt-1 text-slate-400">
          <strong>input:</strong>{" "}
          <code className="text-slate-300">{JSON.stringify(result.input)}</code>
        </div>
        <div className="text-slate-400">
          <strong>expected:</strong>{" "}
          <code className="text-slate-300">{JSON.stringify(result.expected)}</code>
        </div>
        <div className="text-slate-400">
          <strong>actual:</strong>{" "}
          <code className="text-slate-300">{JSON.stringify(result.actual)}</code>
        </div>
        {result.error && (
          <div className="mt-1 text-rose-300">
            <strong>error:</strong> {result.error}
          </div>
        )}
      </div>
    </div>
  );
}
