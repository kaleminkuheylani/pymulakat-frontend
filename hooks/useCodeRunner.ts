// hooks/useCodeRunner.ts
//
// 2026-07-15: Unified code runner — language dispatch.
// Pyodide (Python, browser) + Web Worker (JavaScript, native V8).
// Workspace bu hook'u kullanir — eski usePyodide'in yerini alir.

import { useCallback, useEffect, useRef, useState } from "react";
import { usePyodide, PyodideStatus, TestRunResult } from "./usePyodide";
import { runJsOnce, createJsRunner, type JsRunner } from "../lib/codeRunners/jsRunner";

export type SupportedLanguage = "python" | "javascript";

export interface RunTestCaseInput {
  /** Test adi (orn. "Basic test 1") */
  name: string;
  /** Fonksiyona verilecek input (string olarak; runner parse eder) */
  input: string;
  /** Beklenen output (string olarak; runner parse eder) */
  expected: string;
  /** Gizli mi? Gizli testlerde expected frontend'e gosterilmez */
  isHidden?: boolean;
}

export interface RunTestCaseResult {
  name: string;
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  durationMs: number;
  error: string | null;
}

export interface UseCodeRunnerReturn {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;

  /** Python icin Pyodide status; JS icin her zaman 'idle' (worker aninda hazir) */
  status: PyodideStatus | "idle";
  /** Pyodide yukleme (sadece python icin anlamli; js icin noop) */
  isLoading: boolean;
  /** Hata mesaji (varsa) */
  error: string | null;

  /**
   * Tum test case'leri calistir.
   * Workspace'in orijinal mantigiyla uyumlu: test_cases + user code → sonuclar.
   */
  runTests: (
    userCode: string,
    testCases: RunTestCaseInput[],
    functionName: string,
  ) => Promise<RunTestCaseResult[]>;

  /**
   * Custom input calistir (sidebar / TestPanel).
   */
  runWithCustomInput: (
    userCode: string,
    input: string,
    functionName: string,
  ) => Promise<{ stdout: string; stderr: string; durationMs: number }>;
}

/**
 * Workspace icin unified code runner.
 * Python: mevcut Pyodide (lazy load)
 * JavaScript: Web Worker (native V8, 0KB)
 */
export function useCodeRunner(initial: SupportedLanguage = "python"): UseCodeRunnerReturn {
  const [language, setLanguageState] = useState<SupportedLanguage>(initial);
  const [jsError, setJsError] = useState<string | null>(null);
  const jsRunnerRef = useRef<JsRunner | null>(null);

  // Python runtime (Pyodide, lazy load)
  const py = usePyodide();

  // JS runner (Worker, lazy)
  const getJsRunner = useCallback((): JsRunner => {
    if (!jsRunnerRef.current) jsRunnerRef.current = createJsRunner();
    return jsRunnerRef.current;
  }, []);

  useEffect(() => {
    return () => {
      if (jsRunnerRef.current) {
        jsRunnerRef.current.destroy();
        jsRunnerRef.current = null;
      }
    };
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    setJsError(null);
  }, []);

  // ─── Test runner dispatch ──────────────────────────────
  const runTests = useCallback(
    async (
      userCode: string,
      testCases: RunTestCaseInput[],
      functionName: string,
    ): Promise<RunTestCaseResult[]> => {
      if (language === "javascript") {
        const runner = getJsRunner();
        const results: RunTestCaseResult[] = [];
        for (const tc of testCases) {
          try {
            const r = await runner.run({
              code: userCode,
              input: tc.input,
              fnName: functionName,
              timeoutMs: 5_000,
            });
            const actual = r.stdout.trim();
            const expected = String(tc.expected).trim();
            const passed = actual === expected && r.ok;
            results.push({
              name: tc.name,
              passed,
              input: tc.input,
              expected,
              actual,
              durationMs: r.durationMs,
              error: r.error,
            });
          } catch (err: any) {
            results.push({
              name: tc.name,
              passed: false,
              input: tc.input,
              expected: String(tc.expected),
              actual: "",
              durationMs: 0,
              error: err?.message || String(err),
            });
          }
        }
        return results;
      }

      // Python: Pyodide'dan TestRunResult doner, bizim formata map'le
      const pyResults = await py.runTests(userCode, testCases as any, functionName);
      return pyResults.map((r) => ({
        name: r.name,
        passed: r.passed,
        input: r.input,
        expected: r.expected,
        actual: r.actual,
        durationMs: r.durationMs,
        error: r.error,
      }));
    },
    [language, py, getJsRunner],
  );

  const runWithCustomInput = useCallback(
    async (
      userCode: string,
      input: string,
      functionName: string,
    ): Promise<{ stdout: string; stderr: string; durationMs: number }> => {
      if (language === "javascript") {
        try {
          const r = await getJsRunner().run({
            code: userCode,
            input,
            fnName: functionName,
            timeoutMs: 5_000,
          });
          return { stdout: r.stdout, stderr: r.stderr, durationMs: r.durationMs };
        } catch (err: any) {
          return { stdout: "", stderr: err?.message || String(err), durationMs: 0 };
        }
      }
      return py.runWithCustomInput(userCode, input, functionName);
    },
    [language, py, getJsRunner],
  );

  return {
    language,
    setLanguage,
    status: language === "javascript" ? "idle" : py.status,
    isLoading: language === "python" && py.status === "loading",
    error: language === "javascript" ? jsError : py.error,
    runTests,
    runWithCustomInput,
  };
}
