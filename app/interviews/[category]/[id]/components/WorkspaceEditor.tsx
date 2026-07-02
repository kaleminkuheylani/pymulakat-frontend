// WorkspaceEditor — sağ panel: Monaco editor + test results

import { useState } from "react";
import { CodeEditorMonaco as CodeEditor, CodeEditorRef } from "../../../../../components/Monaco";
import { TestRunResult } from "../../../../../hooks/usePyodide";
import { QuestionTests } from "../../../../../api/v2/questions";

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
  pyStatus: "idle" | "loading" | "ready" | "running" | "error";
  isGuest: boolean;
  category: string;
  id: string;
  onRun: () => void;
}

type Tab = "examples" | "tests" | "console";

export default function WorkspaceEditor({
  editorRef,
  code,
  onCodeChange,
  testCases,
  testResults,
  isRunning,
  pyStatus,
  isGuest,
  category,
  id,
  onRun,
}: EditorProps) {
  const [activeTab, setActiveTab] = useState<Tab>("examples");
  const passedCount = testResults.filter((r) => r.passed).length;
  const totalCount = testResults.length;
  const allPassed = totalCount > 0 && passedCount === totalCount;

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
            {(["examples", "tests", "console"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeTab === tab ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                {tab === "tests" ? (
                  <span className="flex items-center gap-2">
                    Testler
                    {totalCount > 0 && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${allPassed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {passedCount}/{totalCount}
                      </span>
                    )}
                  </span>
                ) : tab === "examples" ? (
                  <span className="flex items-center gap-2">
                    Örnekler
                    {testCases && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                        {testCases.test_cases.length}
                      </span>
                    )}
                  </span>
                ) : (
                  "Konsol"
                )}
              </button>
            ))}
          </div>

          <button
            onClick={onRun}
            disabled={isRunning || pyStatus !== "ready"}
            className={`px-5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
              isRunning || pyStatus !== "ready"
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

          {activeTab === "tests" && (
            <TestsTab testResults={testResults} />
          )}

          {activeTab === "console" && <ConsoleTab />}
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
    <div className="space-y-3">
      {testCases.test_cases.map((tc: TestCase, idx: number) => {
        const result = testResults[idx];
        const hasRun = result !== undefined;
        return (
          <div
            key={idx}
            className={`p-4 rounded-lg border ${
              hasRun
                ? result.passed
                  ? "bg-green-500/5 border-green-500/20"
                  : "bg-red-500/5 border-red-500/20"
                : "bg-white/5 border-white/10"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                Örnek #{idx + 1}
              </span>
              {hasRun && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  result.passed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}>
                  {result.passed ? "✓ Geçti" : "✗ Başarısız"}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Input</div>
                <pre className="text-xs font-mono text-white/70 bg-black/20 p-2 rounded overflow-x-auto">
                  {JSON.stringify(tc.input, null, 2)}
                </pre>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Expected Output</div>
                <pre className="text-xs font-mono text-green-400/80 bg-black/20 p-2 rounded overflow-x-auto">
                  {JSON.stringify(tc.expected, null, 2)}
                </pre>
              </div>
              {hasRun && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Your Output</div>
                  <pre className={`text-xs font-mono bg-black/20 p-2 rounded overflow-x-auto ${
                    result.passed ? "text-green-400/80" : "text-amber-300"
                  }`}>
                    {result.error || JSON.stringify(result.output, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TestsTab({ testResults }: { testResults: TestRunResult[] }) {
  if (testResults.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 text-white/30">
        <p className="text-xs">Testleri çalıştırmak için "Çalıştır" butonuna bas</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {testResults.map((r, i) => (
        <div
          key={i}
          className={`p-3 rounded-lg border ${
            r.passed ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"
          }`}
        >
          <div className="flex items-start gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${r.passed ? "bg-green-500/20" : "bg-red-500/20"}`}>
              {r.passed ? "✓" : "✗"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold mb-1 text-white/80">Test #{r.test_number}</div>
              {r.error ? (
                <pre className="text-xs text-red-300/80 font-mono whitespace-pre-wrap break-words">{r.error}</pre>
              ) : (
                <div className="space-y-1 text-xs font-mono">
                  <div><span className="text-white/40">Girdi: </span>{JSON.stringify(r.input)}</div>
                  <div><span className="text-white/40">Beklenen: </span>{JSON.stringify(r.expected)}</div>
                  {!r.passed && <div><span className="text-white/40">Alınan: </span><span className="text-amber-300">{JSON.stringify(r.output)}</span></div>}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ConsoleTab() {
  return (
    <pre className="text-xs text-white/60 font-mono whitespace-pre-wrap leading-relaxed">
      <span className="text-white/20">Konsol çıktısı için print() kullanın</span>
    </pre>
  );
}