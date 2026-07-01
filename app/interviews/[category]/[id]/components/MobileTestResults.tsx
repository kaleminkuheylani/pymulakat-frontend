"use client";

import { memo } from "react";
import type { TestRunResult } from "../../../../../hooks/usePyodide";

// ═══════════════════════════════════════════════════════════
// MobileTestResults — Test sonuçları kartları (mobile)
// ═══════════════════════════════════════════════════════════

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
const Row = memo(function Row({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-wider text-white/40 mb-0.5 font-bold">
        {label}
      </div>
      <pre className="text-[11px] font-mono text-white/70 bg-black/30 p-1.5 rounded overflow-x-auto">
        {formatValue(value)}
      </pre>
    </div>
  );
});

// ── Test Card ──
const TestCard = memo(function TestCard({ result, index }: { result: TestRunResult; index: number }) {
  const isPassed = result.passed;
  return (
    <div
      className={`rounded-xl border overflow-hidden ${
        isPassed ? "bg-green-500/5 border-green-500/30" : "bg-red-500/5 border-red-500/30"
      }`}
    >
      <div
        className={`flex items-center justify-between px-3 py-2 border-b ${
          isPassed ? "border-green-500/20" : "border-red-500/20"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              isPassed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
            }`}
          >
            {isPassed ? "✓" : "✗"}
          </span>
          <span className="text-xs font-semibold">Test #{index + 1}</span>
        </div>
        <span
          className={`text-[9px] uppercase font-bold tracking-wider ${
            isPassed ? "text-green-400" : "text-red-400"
          }`}
        >
          {isPassed ? "Geçti" : "Başarısız"}
        </span>
      </div>

      <div className="p-2.5 space-y-2">
        <Row label="📥 Input" value={result.input} />
        <Row label="✓ Expected" value={result.expected} />
        <Row label={`${isPassed ? "✓" : "✗"} Actual`} value={result.error || result.output} />
      </div>
    </div>
  );
});

// ── Main ──
interface MobileTestResultsProps {
  results: TestRunResult[];
  isRunning: boolean;
}

export function MobileTestResults({ results, isRunning }: MobileTestResultsProps) {
  if (isRunning) {
    return (
      <div className="p-4 flex items-center justify-center gap-3">
        <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs text-white/60">Testler çalışıyor...</span>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-6 text-center">
        <span className="text-3xl mb-2 block">🧪</span>
        <p className="text-white/40 text-xs">Henüz test çalıştırılmadı.</p>
        <p className="text-white/30 text-[10px] mt-1">"Çalıştır" butonuna bas ve sonuçları gör.</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-2">
      {results.map((r, i) => (
        <TestCard key={i} result={r} index={i} />
      ))}
    </div>
  );
}