// WorkspaceEditor — sağ panel: Monaco editor + test results

import { useState } from "react";
import { CodeEditorMonaco as CodeEditor, CodeEditorRef } from "../../../../../components/CodeEditor";
import { TestRunResult } from "../../../../../hooks/usePyodide";
import { QuestionTests } from "../../../../../api/v2/questions";
import { getErrorLabel } from "../../../../../lib/errorClassifier";
import GuestEditorGate from "./GuestEditorGate";

// 📌 Test case formatı: { input, expected, actual?, description? }
interface TestCase {
  input: any;
  expected: any;
  actual?: any;
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
type ParamInfo = {
  name: string;
  type: "str" | "int" | "float" | "bool" | "list" | "dict" | "tuple" | "any";
  placeholder: string;
};

function parseFunctionSignature(starterCode: string, functionName: string): ParamInfo[] {
  if (!starterCode || !functionName) return [];
  // def name(p1: t1, p2: t2 = None, *args, **kwargs) -> ret:
  const m = starterCode.match(
    new RegExp(`def\\s+${functionName}\\s*\\(([^)]*)\\)`, "m")
  );
  if (!m) return [];
  const raw = m[1].trim();
  if (!raw) return [];

  const paramStrs = raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith("*") && !s.startsWith("self"));

  return paramStrs.map((p): ParamInfo => {
    // "name: type = default" veya "name = default" veya "name"
    const colonIdx = p.indexOf(":");
    let name: string;
    let pyType: ParamInfo["type"] = "any";
    if (colonIdx > -1) {
      name = p.slice(0, colonIdx).trim();
      const typePart = p.slice(colonIdx + 1).split("=")[0].trim();
      pyType = normalizeType(typePart);
    } else {
      const eqIdx = p.indexOf("=");
      name = (eqIdx > -1 ? p.slice(0, eqIdx) : p).trim();
    }
    return { name, type: pyType, placeholder: placeholderFor(pyType) };
  });
}

function normalizeType(t: string): ParamInfo["type"] {
  const s = t.toLowerCase().trim();
  if (s.includes("str")) return "str";
  if (s.includes("float")) return "float";
  if (s.includes("int")) return "int";
  if (s.includes("bool")) return "bool";
  if (s.includes("dict")) return "dict";
  if (s.includes("tuple")) return "tuple";
  if (s.includes("list") || s.includes("[")) return "list";
  return "any";
}

function placeholderFor(t: ParamInfo["type"]): string {
  switch (t) {
    case "str": return '"text"';
    case "int": return "42";
    case "float": return "3.14";
    case "bool": return "True";
    case "list": return "[1, 2, 3]";
    case "tuple": return "(1, 2)";
    case "dict": return '{"key": "value"}';
    default: return "value";
  }
}

// ─── Kullanıcı string'ini Python değerine parse et ───
// Sıra: JSON.parse → Python literal_eval (Pyodide) → string fallback.
// Konsol Custom Input için.
function parseUserInput(raw: string): any {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  // Önce JSON
  try {
    return JSON.parse(trimmed);
  } catch {
    // Python literal'leri (None, True, False, '...', "...") için basit fallback:
    if (trimmed === "None") return null;
    if (trimmed === "True") return true;
    if (trimmed === "False") return false;
    // Tek tırnaklı Python string'i düzelt
    if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
      return trimmed.slice(1, -1);
    }
    // Hiçbir şey tutmuyorsa string olarak gönder
    return trimmed;
  }
}

// ─── Value formatter: primitive, list, dict, string hepsini okunur bas ───
function formatValue(v: any): string {
  if (v === undefined) return "undefined";
  if (v === null) return "null";
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

export default function WorkspaceEditor({
  editorRef,
  code,
  onCodeChange,
  testCases,
  testResults,
  isRunning,
  errorLines,
  pyStatus,
  isGuest,
  category,
  id,
  onRun,
  starterCode,
  onCustomRun,
}: EditorProps) {
  const [activeTab, setActiveTab] = useState<Tab>("examples");
  

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 relative">
        {/* 📌 Misafir için editor gizle, yerine net CTA. readonly bir
            editör göstermek yanıltıcı — kullanıcı yazıp gönderince
            "test çalıştır" akışı login'e düşüyor (handleRun guard).
            Burada net: editöre erişim yok, kod çalıştırmak yok. */}
        {isGuest ? (
          <GuestEditorGate
            category={category ?? ""}
            id={id ?? ""}
            starterCode={starterCode}
          />
        ) : (
          <CodeEditor
            ref={editorRef}
            value={code}
            onChange={onCodeChange}
            height="100%"
            language="python"
          />
        )}
      </div>

      <div className="h-[28rem] bg-[#0a0e1a] flex flex-col flex-shrink-0">
        <div className="h-10 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-1">
            {(["examples", "console"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeTab === tab ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                {tab === "examples" ? (
                  <span className="flex items-center gap-2">
                    Örnekler
                    {testCases && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                        {testCases.test_cases.length}
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    🖨️ Konsol
                    {errorLines.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    )}
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setActiveTab("examples");
              onRun();
            }}
            disabled={isRunning || (pyStatus !== "ready" && pyStatus !== "idle")}
            className={`px-5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
              isRunning || (pyStatus !== "ready" && pyStatus !== "idle")
                ? "bg-white/5 text-white/30 cursor-not-allowed"
                : isGuest
                ? "bg-amber-500/10 border border-amber-400/40 text-amber-400 hover:bg-amber-500/20"
                : "bg-amber-500 hover:bg-amber-400 text-[#050816] hover:shadow-lg hover:shadow-amber-500/30"
            }`}
          >
            {isRunning ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
                Çalışıyor...
              </>
            ) : isGuest ? (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2" />
                </svg>
                Giriş Yap & Çalıştır
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Çalıştır
              </>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {activeTab === "examples" && (
            <ExamplesTab
              testCases={testCases}
              testResults={testResults}
              isGuest={isGuest}
              category={category}
              id={id}
            />
          )}

          {activeTab === "console" && (
            <ConsoleTab
              errorLines={errorLines}
              starterCode={starterCode}
              functionName={testCases?.function_name}
              isRunning={isRunning}
              onCustomRun={onCustomRun}
            />
          )}
        </div>
      </div>
    </main>
  );
}

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
  // 📌 Misafirler test case'leri okuyabilsin (input/expected/actual önizleme),
  //    sadece çalıştırma auth gerektirir. Test case yoksa empty-state göster.
  if (!testCases || testCases.test_cases.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 text-white/30 p-4 text-center">
        <p className="text-xs">Bu soru için örnek test case bulunmuyor.</p>
        {isGuest && (
          <a
            href={`/login?returnUrl=${encodeURIComponent(`/interviews/${category}/${id}`)}`}
            className="text-[11px] px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            Giriş Yap (Kodu çalıştırmak için)
          </a>
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
        // Misafirlere referans çıktıyı (db'de tutulan `actual`) önizleme olarak göster.
        const referenceActual = tc.actual !== undefined && tc.actual !== null ? tc.actual : null;
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
                <pre className="text-xs font-mono text-white/80 bg-black/30 p-2 rounded overflow-x-auto border">
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

              {/* Misafirlere: DB'deki referans çıktı (actual) önizleme */}
              {!hasRun && referenceActual !== null && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-cyan-300/70 mb-1 font-bold">
                    👁 Actual (referans çıktı)
                  </div>
                  <pre className="text-xs font-mono text-cyan-200 bg-cyan-500/5 p-2 rounded overflow-x-auto border border-cyan-500/20 min-h-[2.5rem]">
                    {formatValue(referenceActual)}
                  </pre>
                </div>
              )}

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
          <div className="flex items-center justify-between pb-1">
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
