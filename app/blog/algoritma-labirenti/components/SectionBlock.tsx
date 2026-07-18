// app/blog/algoritma-labirenti/components/SectionBlock.tsx
//
// 2026-07-18: Algoritma Labirenti — section block.
// 2 test case (kolay + edge), ikisi de gecmeli.
// Mini Pyodide runner (usePyodide stdout capture etmiyordu).

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Lock, Play, CheckCircle2, RotateCcw, HelpCircle,
  Sparkles, ArrowRight, Code2, AlertTriangle, Trophy,
} from "lucide-react";
import type { Section } from "../data/sections";

interface Props {
  section: Section;
  index: number;
  total: number;
  locked: boolean;
  completed: boolean;
  onComplete: () => void;
}

const PYODIDE_VERSION = "v0.27.7";
const PYODIDE_BASE = `/pyodide/${PYODIDE_VERSION}/full/`;

// Pyodide singleton — birden fazla section ayni instance'i kullansin
let pyodidePromise: Promise<any> | null = null;
let pyodideInstance: any = null;

function getPyodide(): Promise<any> {
  if (pyodideInstance) return Promise.resolve(pyodideInstance);
  if (pyodidePromise) return pyodidePromise;

  pyodidePromise = (async () => {
    // @ts-ignore
    if (!(window as any).loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = `${PYODIDE_BASE}pyodide.js`;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("pyodide.js yüklenemedi"));
        document.head.appendChild(s);
      });
    }
    // @ts-ignore
    pyodideInstance = await (window as any).loadPyodide({
      indexURL: PYODIDE_BASE,
    });
    return pyodideInstance;
  })();
  return pyodidePromise;
}

type TestStatus = "pending" | "running" | "pass" | "fail";

interface TestResult {
  status: TestStatus;
  actual?: string;
  error?: string;
}

export default function SectionBlock({
  section,
  index,
  total,
  locked,
  completed,
  onComplete,
}: Props) {
  const [code, setCode] = useState(section.exercise.starter);
  const [results, setResults] = useState<[TestResult, TestResult]>([
    { status: "pending" },
    { status: "pending" },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const [pyodideError, setPyodideError] = useState<string | null>(null);

  // Mount'ta Pyodide yuklemeye basla
  useEffect(() => {
    if (locked) return;
    let cancelled = false;
    setPyodideLoading(true);
    getPyodide()
      .then(() => {
        if (!cancelled) {
          setPyodideReady(true);
          setPyodideLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setPyodideError(err.message || "Pyodide yüklenemedi");
          setPyodideLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [locked]);

  const runTest = useCallback(
    async (testIndex: 0 | 1) => {
      if (!pyodideReady || !pyodideInstance) return;
      const tc = section.exercise.testCases[testIndex];

      // Running state
      setResults((prev) => {
        const next = [...prev] as [TestResult, TestResult];
        next[testIndex] = { status: "running" };
        return next;
      });

      try {
        // stdout capture
        let captured = "";
        pyodideInstance.setStdout({
          batched: (s: string) => {
            captured += s + "\n";
          },
        });
        pyodideInstance.setStderr({
          batched: (s: string) => {
            captured += s + "\n";
          },
        });

        // Kullanıcının kodu + test case input'unu birleste calistir
        const fullCode = `${code}\n\n# TEST ${testIndex + 1}\n${tc.input}`;
        await pyodideInstance.runPythonAsync(fullCode);

        // captured'i trim et ve karsilastir
        const actual = captured.trim();
        const expected = tc.expected.trim();

        if (actual === expected) {
          setResults((prev) => {
            const next = [...prev] as [TestResult, TestResult];
            next[testIndex] = { status: "pass", actual };
            return next;
          });
        } else {
          setResults((prev) => {
            const next = [...prev] as [TestResult, TestResult];
            next[testIndex] = {
              status: "fail",
              actual,
              error: `Beklenen: ${expected}\nSenin çıktın: ${actual}`,
            };
            return next;
          });
        }
      } catch (err: any) {
        setResults((prev) => {
          const next = [...prev] as [TestResult, TestResult];
          next[testIndex] = {
            status: "fail",
            error: err.message || String(err),
          };
          return next;
        });
      }
    },
    [code, pyodideReady, section.exercise]
  );

  const runAll = useCallback(async () => {
    setIsRunning(true);
    setResults([
      { status: "pending" },
      { status: "pending" },
    ]);
    await runTest(0);
    await runTest(1);
    setIsRunning(false);
  }, [runTest]);

  // 2 test de pass oldu mu kontrol et — useEffect ile
  useEffect(() => {
    if (results[0].status === "pass" && results[1].status === "pass" && !completed) {
      onComplete();
    }
  }, [results, completed, onComplete]);

  const reset = () => {
    setCode(section.exercise.starter);
    setResults([{ status: "pending" }, { status: "pending" }]);
  };

  // Locked state
  if (locked) {
    return (
      <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-white/40 uppercase tracking-wider">Seviye {index + 1}</div>
            <h3 className="text-xl font-bold text-white/50">Kilitli</h3>
          </div>
        </div>
        <p className="text-sm text-white/40">
          Bu seviyeyi açmak için önce Seviye {index} tamamla.
        </p>
      </article>
    );
  }

  const bothPass = results[0].status === "pass" && results[1].status === "pass";

  return (
    <article className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.03] to-transparent p-6 space-y-5">
      {/* Baslik */}
      <header className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300 flex-shrink-0">
          <Code2 className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-amber-300/80 uppercase tracking-wider">
            Seviye {index + 1} / {total}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mt-0.5">
            {section.title}
          </h3>
        </div>
        {completed && (
          <div className="flex items-center gap-1 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Geçti
          </div>
        )}
      </header>

      {/* Hikaye */}
      <div className="rounded-lg bg-[#0a0e1a] border border-white/10 p-4 space-y-2 text-sm text-white/80">
        {section.story.map((p, i) => (
          <p key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: p }} />
        ))}
      </div>

      {/* Anlatim */}
      <div className="space-y-2 text-sm text-white/70 leading-relaxed">
        {section.anlatim.map((p, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
        ))}
      </div>

      {/* Editor */}
      <div className="rounded-lg overflow-hidden border border-white/10">
        <div className="flex items-center justify-between bg-[#0a0e1a] px-3 py-2 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            </div>
            <span className="ml-2 font-mono">{section.exercise.functionName}.py</span>
          </div>
          <button
            onClick={reset}
            disabled={isRunning}
            className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1 disabled:opacity-50"
          >
            <RotateCcw className="w-3 h-3" />
            Sıfırla
          </button>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          disabled={isRunning}
          className="w-full bg-[#050816] text-white/90 font-mono text-sm p-4 outline-none resize-y min-h-[200px] disabled:opacity-50"
          style={{ tabSize: 4 }}
        />
      </div>

      {/* Run butonu */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={runAll}
          disabled={!pyodideReady || isRunning}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-[#050816] font-semibold text-sm hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          {isRunning ? "Çalışıyor..." : "2 Testi de Çalıştır"}
        </button>

        {pyodideLoading && (
          <div className="text-xs text-white/50 flex items-center gap-1.5">
            <div className="w-3 h-3 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
            Pyodide yükleniyor (~2-5sn)...
          </div>
        )}

        {pyodideError && (
          <div className="text-xs text-rose-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            {pyodideError}
          </div>
        )}

        {pyodideReady && !isRunning && (
          <div className="text-xs text-emerald-300/80 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Pyodide hazır
          </div>
        )}
      </div>

      {/* 2 Test Case Sonuclari */}
      <div className="grid sm:grid-cols-2 gap-3">
        {section.exercise.testCases.map((tc, i) => {
          const r = results[i];
          return (
            <div
              key={tc.id}
              className={`rounded-lg border p-3 text-xs space-y-2 ${
                r.status === "pass"
                  ? "border-emerald-500/40 bg-emerald-500/[0.05]"
                  : r.status === "fail"
                  ? "border-rose-500/40 bg-rose-500/[0.05]"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-mono text-white/60">
                  Test {i + 1}: {tc.description.replace(/^(Kolay|Edge):\s*/, "")}
                </div>
                <TestBadge status={r.status} />
              </div>
              {r.status === "fail" && r.error && (
                <pre className="text-rose-200/80 font-mono text-[11px] whitespace-pre-wrap break-words leading-snug">
                  {r.error}
                </pre>
              )}
              {r.status === "pass" && r.actual && (
                <div className="font-mono text-emerald-200/80 text-[11px] break-words">
                  ✓ Çıktı: {r.actual}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Yardim */}
      {section.yardimLink && (
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/[0.03] p-3 text-xs">
          <div className="flex items-start gap-2 text-white/70">
            <HelpCircle className="w-3.5 h-3.5 mt-0.5 text-indigo-300 flex-shrink-0" />
            <div>
              <strong className="text-indigo-200">Kafana takıldı mı?</strong>{" "}
              <Link href={section.yardimLink.href} className="text-indigo-300 hover:underline">
                {section.yardimLink.label}
              </Link>
              <p className="text-white/50 mt-1 italic">İpucu: {section.ipucu}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tamamlandi banner */}
      {bothPass && (
        <div className="rounded-lg border border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 to-amber-500/10 p-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-emerald-300 font-bold">
            <Trophy className="w-5 h-5" />
            Seviye {index + 1} Tamamlandı!
          </div>
          {index < total - 1 ? (
            <p className="text-xs text-white/60">
              Aşağıdaki sonraki seviye açıldı. Devam et.
            </p>
          ) : (
            <p className="text-xs text-amber-300 font-semibold">
              Tüm labirent tamamlandı! Sen gerçek bir algoritma kaşifisin.
            </p>
          )}
        </div>
      )}
    </article>
  );
}

function TestBadge({ status }: { status: TestStatus }) {
  if (status === "pending") {
    return <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/50">Bekliyor</span>;
  }
  if (status === "running") {
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 flex items-center gap-1">
        <div className="w-2 h-2 border border-amber-300/50 border-t-amber-300 rounded-full animate-spin" />
        Çalışıyor
      </span>
    );
  }
  if (status === "pass") {
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" />
        Geçti
      </span>
    );
  }
  return (
    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
      Kaldı
    </span>
  );
}
