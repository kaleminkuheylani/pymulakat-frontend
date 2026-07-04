// WorkspaceEditor — sağ panel: Monaco editor + test results

import { useState } from "react";
import { CodeEditorMonaco as CodeEditor, CodeEditorRef } from "../../../../../components/Monaco";
import { TestRunResult } from "../../../../../hooks/usePyodide";
import { parseFunctionSignature, parseUserInput, formatValue } from "../../../../../components/parsePython";
import { QuestionTests } from "../../../../../api/v2/questions";
import { getErrorLabel } from "../../../../../lib/errorClassifier";

interface TestCase {
  input: any[];
  expected: any;
  description?: string;
}

interface EditorProps {
  editorRef: React.RefObject<CodeEditorRef | null>;
  code: string;
  onCodeChange: (code: string) => void;
  testCases: QuestionTests | null;
  testResults: TestRunResult[];
  isRunning: boolean;
  errorLines: string[];
  pyStatus: "idle" | "loading" | "ready" | "running" | "error";
  isGuest: boolean;
  category: string;
  id: string;
  onRun: () => void;
  starterCode?: string;       // Fonksiyon imzası parse için
  onCustomRun?: (args: any[]) => Promise<{ actual: any; errorLine?: string; errorCategory?: string }>;
}

type Tab = "examples" | "console";

// ─── Python def satırını parse → parametre listesi (name + type + placeholder) ───
// ─── Tab Components ───────────────────────────────────────

function ExamplesTab({
  testCases,
  testResults,
  isGuest,
  category,
  id,
}: {
  testCases: QuestionTests | null;
  testResults: TestRunResult[];
  isGuest: boolean;
  category: string;
  id: string;
}) {
  if (!testCases || testCases.test_cases.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 text-white/30">
        {isGuest ? (
          <>
            <p className="text-xs">Test caseleri üyelikle erişilebilir.</p>
            <a
              href={`/login?returnUrl=${encodeURIComponent(`/interviews/${category}/${id}`)}`}
              className="text-xs px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              Giriş Yap
            </a>
          </>
        ) : (
          <p className="text-xs">Bu soru için örnek test case bulunmuyor.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3">
      {testCases.test_cases.map((tc: TestCase, idx: number) => {
        const result = testResults[idx];
        const hasRun = result !== undefined;
        // 1) Hata varsa: traceback'in son satırı + kategori badge
        // 2) Hata yok ama fail: expected vs actual karşılaştırması
        // 3) Pass: tek "actual = expected" gösterimi
        const isError = hasRun && !!result.errorCategory;
        const isLogicFail = hasRun && !result.passed && !isError;
        return (
          <div
            key={idx}
            className={`p-4 rounded-lg border ${
              hasRun
                ? result.passed
                  ? "bg-green-500/5 border-green-500/30"
                  : "bg-red-500/5 border-red-500/30"
                : "bg-white/5 border-white/10"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                Örnek #{idx + 1}
              </span>
              <div className="flex items-center gap-2">
                {hasRun && result.execution_ms != null && (
                  <span className="text-[10px] text-white/40 font-mono">
                    {result.execution_ms}ms
                  </span>
                )}
                {hasRun && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    result.passed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}>
                    {result.passed ? "✓ Geçti" : isError ? "✗ Hata" : "✗ Yanlış"}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              {/* Input */}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1 font-bold">
                  📥 Input
                </div>
                <pre className="text-xs font-mono text-white/80 bg-black/30 p-2 rounded overflow-x-auto border border-white/5">
                  {formatValue(tc.input)}
                </pre>
              </div>

              {/* Expected (her zaman gösterilir) */}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-emerald-400/80 mb-1 font-bold">
                  ✓ Expected
                </div>
                <pre className="text-xs font-mono text-emerald-300 bg-emerald-500/5 p-2 rounded overflow-x-auto border border-emerald-500/20 min-h-[2.5rem]">
                  {formatValue(tc.expected)}
                </pre>
              </div>

              {/* Hata varsa: traceback son satırı (debug için) */}
              {isError && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-rose-400/80 mb-1 font-bold">
                    ⚠ Traceback
                  </div>
                  <pre className="text-xs font-mono text-rose-300 bg-rose-500/10 p-2 rounded overflow-x-auto border border-rose-500/30 min-h-[2.5rem]">
                    {result.errorLine || getErrorLabel(result.errorCategory!) || "Bilinmeyen hata"}
                  </pre>
                </div>
              )}

              {/* Logic fail: Actual + beklenen karşılaştırması (debug için) */}
              {isLogicFail && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-rose-400/80 mb-1 font-bold">
                    ✗ Actual (senin kodun)
                  </div>
                  <pre className="text-xs font-mono text-rose-300 bg-rose-500/5 p-2 rounded overflow-x-auto border border-rose-500/20 min-h-[2.5rem]">
                    {formatValue(result.actual)}
                  </pre>
                  <div className="text-[10px] text-amber-300/80 italic px-1 mt-1">
                    💡 Return değeri beklenenle eşleşmiyor — yukarıdaki Actual, senin kodun bu test için ne döndüğü.
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}



// ─── Konsol: Custom Input + Hata Traceback ───
function ConsoleTab({
  errorLines,
  starterCode,
  functionName,
  isRunning,
  onCustomRun,
}: {
  errorLines: string[];
  starterCode?: string;
  functionName?: string;
  isRunning?: boolean;
  onCustomRun?: (args: any[]) => Promise<{ actual: any; errorLine?: string; errorCategory?: string }>;
}) {
  const params = parseFunctionSignature(starterCode || "", functionName || "");
  const [inputs, setInputs] = useState<string[]>(
    Array.from({ length: params.length }, () => "")
  );
  const [result, setResult] = useState<any>(undefined);
  const [resultError, setResultError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    if (!onCustomRun) return;
    setRunning(true);
    setResult(undefined);
    setResultError(null);
    try {
      // Parse user inputs — kullanıcı JSON ya da Python literal yazabilir
      const parsed = inputs.map((s) => parseUserInput(s));
      const r = await onCustomRun(parsed);
      setResult(r.actual);
      setResultError(r.errorLine || null);
    } catch (e: any) {
      setResultError(e?.message || "Çalıştırma hatası");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="p-3 space-y-3 overflow-y-auto h-full">
      {/* Custom Input paneli */}
      {params.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-white/60 font-bold">
              🧪 Kendi Input'unla Dene
            </span>
            <span className="text-[10px] text-white/40">
              {params.length} parametre
            </span>
          </div>

          {params.map((p, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono text-white/70">
                  {p.name}
                  <span className="text-[10px] text-white/40 ml-2">: {p.type}</span>
                </label>
                <span className="text-[9px] text-white/30 font-mono">
                  {p.type}
                </span>
              </div>
              <input
                type="text"
                value={inputs[idx] || ""}
                placeholder={p.placeholder}
                onChange={(e) => {
                  const next = [...inputs];
                  next[idx] = e.target.value;
                  setInputs(next);
                }}
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-black/30 border border-white/10 rounded text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          ))}

          <button
            onClick={handleRun}
            disabled={running || isRunning}
            className="w-full px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-indigo-500/20"
          >
            {running ? "⏳ Çalışıyor..." : "▶ Kendi Input'umla Çalıştır"}
          </button>
        </div>
      ) : (
        <div className="text-[10px] text-white/30 text-center py-4">
          Fonksiyon imzası bulunamadı
        </div>
      )}

      {/* Sonuç */}
      {result !== undefined && (
        <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/30">
          <div className="text-[10px] uppercase tracking-wider text-green-400/80 mb-1 font-bold">
            ✓ Sonuç
          </div>
          <pre className="text-xs font-mono text-green-200 whitespace-pre-wrap break-all">
            {formatValue(result)}
          </pre>
        </div>
      )}

      {/* Hata Traceback */}
      {errorLines.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-rose-400/80 font-bold">
              ⚠ Son Çalıştırma Hatası
            </span>
            <span className="text-[10px] text-white/30 font-mono">
              {errorLines.length} satır
            </span>
          </div>
          <pre className="text-xs text-rose-200 font-mono whitespace-pre-wrap leading-relaxed">
            {errorLines.map((line, i) => (
              <div key={i} className="text-rose-300/90 font-semibold">
                {line}
              </div>
            ))}
          </pre>
        </div>
      )}

      {/* Custom run sonucu hata */}
      {resultError && !errorLines.length && (
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
          <div className="text-[10px] uppercase tracking-wider text-rose-400/80 mb-1 font-bold">
            ⚠ Çalıştırma Hatası
          </div>
          <pre className="text-xs font-mono text-rose-200 whitespace-pre-wrap">
            {resultError}
          </pre>
        </div>
      )}
    </div>
  );
}
