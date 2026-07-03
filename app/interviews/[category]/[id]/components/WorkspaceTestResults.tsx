"use client";

import { memo } from "react";
import type { TestRunResult } from "../../../../../hooks/usePyodide";

// ═══════════════════════════════════════════════════════════
// WorkspaceTestResults — Test case'ler + çalıştırma sonuçları
//
// Görünüm:
//   - Üstte özet (X/Y geçti) — sonuç varsa
//   - Her test case kartı: input + expected + (varsa actual/error)
//   - Çalıştırma spinner'ı
//
// Bu component hem test case tanımlarını hem çalıştırma sonuçlarını gösterir.
// Default tab = "tests" olduğu için kullanıcı ilk açılışta test case'leri görür.
// ═══════════════════════════════════════════════════════════

export interface TestCaseDef {
  input: any;
  expected: any;
  description?: string;
}

interface WorkspaceTestResultsProps {
  results: TestRunResult[];
  isRunning: boolean;
  testCases?: {
    function_name: string;
    test_cases: TestCaseDef[];
  } | null;
}

// ── Helpers ──
function formatValue(v: any): string {
  if (v === null || v === undefined) return "None";
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

// ── Row ──
const Row = memo(function Row({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: any;
  tone?: "default" | "success" | "fail";
}) {
  const color =
    tone === "success"
      ? "text-green-400/80"
      : tone === "fail"
      ? "text-amber-300"
      : "text-white/70";
  return (
    <div>
      <div className="text-[9px] uppercase tracking-wider text-white/40 mb-0.5 font-bold">
        {label}
      </div>
      <pre
        className={`text-[11px] font-mono ${color} bg-black/30 p-1.5 rounded overflow-x-auto`}
      >
        {formatValue(value)}
      </pre>
    </div>
  );
});

// ── Test Card — definitions + optional result ──
const TestCard = memo(function TestCard({
  def,
  result,
  index,
}: {
  def: TestCaseDef;
  result?: TestRunResult;
  index: number;
}) {
  const hasRun = result !== undefined;
  const isPassed = hasRun && result!.passed;
  const isFailed = hasRun && !result!.passed;

  // Card rengi: tanım aşamasında nötr; çalıştırılınca pass/fail rengine döner
  const stateClass = hasRun
    ? isPassed
      ? "bg-green-500/5 border-green-500/30"
      : "bg-red-500/5 border-red-500/30"
    : "bg-white/[0.02] border-white/10";

  return (
    <div className={`rounded-xl border overflow-hidden ${stateClass}`}>
      <div
        className={`flex items-center justify-between px-3 py-2 ${
          hasRun ? (isPassed ? "border-b border-green-500/20" : "border-b border-red-500/20") : ""
        }`}
      >
        <div className="flex items-center gap-2">
          {hasRun ? (
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isPassed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              }`}
            >
              {isPassed ? "✓" : "✗"}
            </span>
          ) : (
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-white/5 text-white/40">
              {index + 1}
            </span>
          )}
          <span className="text-xs font-semibold">
            {hasRun ? `Test #${index + 1}` : `Örnek #${index + 1}`}
          </span>
        </div>
        <span
          className={`text-[9px] uppercase font-bold tracking-wider ${
            hasRun
              ? isPassed
                ? "text-green-400"
                : "text-red-400"
              : "text-white/30"
          }`}
        >
          {hasRun ? (isPassed ? "Geçti" : "Başarısız") : "Tanım"}
        </span>
      </div>

      <div className="p-2.5 space-y-2">
        <Row label="📥 Input" value={def.input} />
        <Row label="✓ Expected" value={def.expected} tone="success" />
        {hasRun && (
          <Row
            label={isPassed ? "✓ Actual" : "✗ Actual"}
            value={result!.error || result!.actual}
            tone={isPassed ? "success" : "fail"}
          />
        )}
      </div>
    </div>
  );
});

// ── Summary strip ──
function Summary({ results, isRunning, definedCount }: { results: TestRunResult[]; isRunning: boolean; definedCount: number }) {
  if (isRunning) {
    return (
      <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
        <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs text-indigo-300 font-semibold">Testler çalışıyor…</span>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/10">
        <span className="text-[11px] text-white/60">
          🧪 Tanımlı <span className="font-bold text-white">{definedCount}</span> test case —
          çalıştırmak için <span className="text-amber-400 font-semibold">Çalıştır</span>'a bas
        </span>
      </div>
    );
  }

  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const allPassed = passed === total;
  const ms = results.reduce((s, r) => s + (r.execution_ms || 0), 0);

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border ${
        allPassed ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={`text-lg ${allPassed ? "text-green-400" : "text-red-400"}`}>
          {allPassed ? "🏆" : "⚠"}
        </span>
        <div>
          <div className="text-xs font-bold text-white">
            {passed} / {total} geçti
          </div>
          <div className="text-[10px] text-white/40">
            {allPassed ? "Tebrikler, tüm testler geçti!" : "Bazı testler başarısız oldu"}
          </div>
        </div>
      </div>
      <div className="text-[10px] text-white/40 font-mono">{ms}ms</div>
    </div>
  );
}

// ── Main ──
export function WorkspaceTestResults({ results, isRunning, testCases }: WorkspaceTestResultsProps) {
  // Test case'ler henüz yüklenmedi → spinner
  if (!testCases || testCases.test_cases.length === 0) {
    return (
      <div className="p-4 flex items-center justify-center gap-3">
        <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs text-white/60">Test caseler yükleniyor...</span>
      </div>
    );
  }

  // Test case'leri her zaman göster (definition).
  // Sonuç varsa, eşleşen index'e yerleştir (test_number 1-based, index 0-based).
  const renderList = testCases.test_cases.map((def, idx) => {
    const result = results[idx];
    return { def, result, idx };
  });

  return (
    <div className="p-3 space-y-3">
      <Summary results={results} isRunning={isRunning} definedCount={testCases.test_cases.length} />

      <div className="space-y-2">
        {renderList.map(({ def, result, idx }) => (
          <TestCard key={idx} def={def} result={result} index={idx} />
        ))}
      </div>

      {results.length > 0 && results.length < testCases.test_cases.length && (
        <p className="text-[10px] text-white/40 text-center pt-1">
          +{testCases.test_cases.length - results.length} tanım daha — çalıştırılınca görünür
        </p>
      )}
    </div>
  );
}
