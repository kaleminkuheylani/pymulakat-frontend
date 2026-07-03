// WorkspaceEditor — sağ panel: Monaco editor + test results

import { useState } from "react";
import { CodeEditorMonaco as CodeEditor, CodeEditorRef } from "../../../../../components/Monaco";
import { TestRunResult } from "../../../../../hooks/usePyodide";
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
  consoleOutput: string;
  pyStatus: "idle" | "loading" | "ready" | "running" | "error";
  isGuest: boolean;
  category: string;
  id: string;
  onRun: () => void;
}

type Tab = "examples" | "console";

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
  consoleOutput,
  pyStatus,
  isGuest,
  category,
  id,
  onRun,
}: EditorProps) {
  const [activeTab, setActiveTab] = useState<Tab>("examples");
  

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 relative">
        <CodeEditor
          ref={editorRef}
          value={code}
          onChange={onCodeChange}
          height="100%"
          language="python"
          readOnly={isGuest}
          // 📌 Desktop client'ta copy/paste/cut engelli
          // (kontext menu zaten readonly'da kapanir, ek Monaco command override)
          disableCopyPaste={!isGuest}
        />
      </div>

      <div className="h-72 border-t border-white/5 bg-[#0a0e1a] flex flex-col flex-shrink-0">
        <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 flex-shrink-0">
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
                    {consoleOutput && consoleOutput.trim() && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    )}
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={onRun}
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

          {activeTab === "console" && <ConsoleTab consoleOutput={consoleOutput} />}
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

              {/* ─── HATA DURUMU ─── */}
              {isError && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-rose-400/80 mb-1 font-bold">
                    ⚠ Traceback (son satır)
                  </div>
                  <pre className="text-xs font-mono text-rose-300 bg-rose-500/10 p-2 rounded overflow-x-auto border border-rose-500/30 min-h-[2.5rem]">
                    {result.errorLine || getErrorLabel(result.errorCategory!) || "Bilinmeyen hata"}
                  </pre>
                </div>
              )}

              {/* ─── HATA YOKSA: Expected vs Actual karşılaştırma ─── */}
              {!isError && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-emerald-400/80 mb-1 font-bold">
                      ✓ Expected
                    </div>
                    <pre className={`text-xs font-mono p-2 rounded overflow-x-auto border min-h-[2.5rem] ${
                      hasRun && isLogicFail && !valueMatches(result.actual, tc.expected)
                        ? "text-emerald-300 bg-emerald-500/5 border-emerald-500/20"
                        : "text-white/70 bg-black/20 border-white/5"
                    }`}>
                      {formatValue(tc.expected)}
                    </pre>
                  </div>
                  <div>
                    <div className={`text-[10px] uppercase tracking-wider mb-1 font-bold ${
                      hasRun
                        ? result.passed
                          ? "text-green-400/80"
                          : "text-amber-400/80"
                        : "text-white/40"
                    }`}>
                      {hasRun ? (result.passed ? "✓ Actual" : "✗ Actual") : "⏳ Henüz çalıştırılmadı"}
                    </div>
                    <pre className={`text-xs font-mono p-2 rounded overflow-x-auto border min-h-[2.5rem] ${
                      hasRun
                        ? result.passed
                          ? "text-green-300 bg-green-500/5 border-green-500/20"
                          : "text-amber-200 bg-amber-500/10 border-amber-500/40"
                        : "text-white/30 bg-black/20 border-white/5 italic"
                    }`}>
                      {hasRun ? formatValue(result.actual) : "Çalıştır'a bas"}
                    </pre>
                  </div>
                </div>
              )}

              {/* ─── Logic fail diff hint ─── */}
              {isLogicFail && (
                <div className="text-[10px] text-amber-300/80 italic px-1">
                  💡 Return değeri beklenenle eşleşmiyor — sol sütun ne bekleniyor, sağ sütun senin kodun ne döndü.
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Basit karşılaştırma: eşit mi? (UI'da vurgu için) ───
function valueMatches(a: any, b: any): boolean {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return a === b;
  }
}

function ConsoleTab({ consoleOutput }: { consoleOutput: string }) {
  // Boş durum
  if (!consoleOutput || consoleOutput.trim() === "") {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 text-white/30 py-8">
        <div className="text-2xl">🖨️</div>
        <p className="text-xs">Henüz print() çıktısı yok.</p>
        <p className="text-[10px] text-white/20">Kodunda print() kullanıp Çalıştır'a bas</p>
      </div>
    );
  }

  // Satır satır böl: stderr olanları renklendir, stdout olanları normal
  const lines = consoleOutput.split("\n");

  return (
    <div className="p-3 space-y-2">
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">
          📤 Konsol Çıktısı
        </span>
        <span className="text-[10px] text-white/30 font-mono">
          {lines.filter((l) => l.trim()).length} satır
        </span>
      </div>
      <pre className="text-xs text-white/80 font-mono whitespace-pre-wrap leading-relaxed">
        {lines.map((line, i) => {
          if (line.startsWith("[stderr]")) {
            return (
              <div key={i} className="text-amber-300/90">
                {line}
              </div>
            );
          }
          if (line.startsWith("[error]")) {
            return (
              <div key={i} className="text-rose-300/90 font-semibold">
                {line}
              </div>
            );
          }
          if (line.startsWith("[import hatası]")) {
            return (
              <div key={i} className="text-rose-300/90">
                {line}
              </div>
            );
          }
          return (
            <div key={i} className="text-white/80">
              {line || "\u00A0"}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
