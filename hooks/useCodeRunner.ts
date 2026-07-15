// hooks/useCodeRunner.ts
//
// 2026-07-15: Unified code runner — language dispatch.
// Pyodide (Python, browser) + Web Worker (JavaScript, native V8).
//
// API uyumu: usePyodide ile ayni signature (mevcut Workspace kodu kırılmasın).
//   - runTests(code, functionName, testCases) → PyodideRunResult / RunTestCaseResult[]
//   - runWithCustomInput(code, functionName, args) → { actual, errorLine?, errorCategory? }
//
// useCodeRunner.runTests/code runner tek tip RunTestCaseResult[] doner (Workspace uyumlu).

import { useCallback, useEffect, useRef, useState } from "react";
import {
  usePyodide,
  PyodideStatus,
  PyodideRunResult,
  TestCase,
  TestRunResult,
} from "./usePyodide";
import type { ErrorCategory } from "../lib/errorClassifier";
import {
  runJsOnce,
  createJsRunner,
  type JsRunner,
  type JsRunResult,
} from "../lib/codeRunners/jsRunner";

export type SupportedLanguage = "python" | "javascript";

export interface RunTestCaseInput {
  name?: string;
  input: string;
  expected: string;
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

export interface UnifiedRunResult {
  /** Her test case icin detay (sade, sirali) */
  results: RunTestCaseResult[];
  total: number;
  passed: number;
  allPassed: boolean;
  durationMs: number;
  errorLines: string[];
  errorCategory?: ErrorCategory | null;
}

export interface CustomRunResult {
  /** Stdout yerine "actual" (eski API uyumu) */
  actual: any;
  errorLine?: string;
  errorCategory?: ErrorCategory;
}

export interface UseCodeRunnerReturn {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;

  /** Python icin Pyodide status; JS icin her zaman 'idle' (worker aninda hazir) */
  status: PyodideStatus | "idle";
  /** Pyodide yukleme (sadece python icin anlamli; js icin noop) */
  isLoading: boolean;
  /** Hata mesaji (varsa) — usePyodide.errorMsg ile ayni tip (string | null) */
  error: string | null;

  /**
   * Tum test case'leri calistir.
   * usePyodide ile ayni signature: (code, functionName, testCases).
   * Tek dilimli UnifiedRunResult doner (Workspace uyumlu).
   */
  runTests: (
    userCode: string,
    functionName: string,
    testCases: RunTestCaseInput[],
  ) => Promise<UnifiedRunResult>;

  /**
   * Custom input calistir (sidebar / TestPanel).
   * usePyodide ile ayni signature: (code, functionName, args).
   * CustomRunResult doner (actual + errorLine).
   */
  runWithCustomInput: (
    userCode: string,
    functionName: string,
    args: any[],
  ) => Promise<CustomRunResult>;
}

function normalizeErrorCategory(c: ErrorCategory | undefined | null): ErrorCategory | null {
  return c ?? null;
}

export function useCodeRunner(initial: SupportedLanguage = "python"): UseCodeRunnerReturn {
  const [language, setLanguageState] = useState<SupportedLanguage>(initial);
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
  }, []);

  // ─── Test runner dispatch ──────────────────────────────
  const runTests = useCallback(
    async (
      userCode: string,
      functionName: string,
      testCases: RunTestCaseInput[],
    ): Promise<UnifiedRunResult> => {
      if (language === "javascript") {
        const runner = getJsRunner();
        const start = performance.now();
        const results: RunTestCaseResult[] = [];
        const errorLines: string[] = [];

        for (let i = 0; i < testCases.length; i++) {
          const tc = testCases[i];
          try {
            const r: JsRunResult = await runner.run({
              code: userCode,
              input: tc.input,
              fnName: functionName,
              timeoutMs: 5_000,
            });
            const actual = r.stdout.trim();
            const expected = String(tc.expected).trim();
            const passed = r.ok && actual === expected;
            results.push({
              name: tc.name ?? `Test ${i + 1}`,
              passed,
              input: tc.input,
              expected,
              actual,
              durationMs: r.durationMs,
              error: r.error ?? null,
            });
            if (!r.ok && r.stderr) errorLines.push(r.stderr);
          } catch (err: any) {
            const msg = err?.message || String(err);
            results.push({
              name: tc.name ?? `Test ${i + 1}`,
              passed: false,
              input: tc.input,
              expected: String(tc.expected),
              actual: "",
              durationMs: 0,
              error: msg,
            });
            errorLines.push(msg);
          }
        }

        const passed = results.filter((r) => r.passed).length;
        return {
          results,
          total: results.length,
          passed,
          allPassed: passed === results.length,
          durationMs: Math.round(performance.now() - start),
          errorLines,
          errorCategory: null,
        };
      }

      // Python: usePyodide.runTests(code, functionName, testCases) → PyodideRunResult
      const pyCases: TestCase[] = testCases.map((tc, i) => ({
        name: tc.name ?? `Test ${i + 1}`,
        input: tc.input,
        expected: tc.expected,
        is_hidden: tc.isHidden,
      }));
      const pyRes: PyodideRunResult = await py.runTests(userCode, functionName, pyCases);

      // Pyodide'in TestRunResult'larini bizim RunTestCaseResult formatiyla map'le
      // (usePyodide TestRunResult: input/expected/actual/passed/errorLine/execution_ms)
      const unifiedResults: RunTestCaseResult[] = (pyRes.results || []).map((r: TestRunResult, i: number) => ({
        name: r.description ?? `Test ${i + 1}`,
        passed: r.passed,
        input: r.input,
        expected: r.expected,
        actual: r.actual,
        durationMs: r.execution_ms ?? 0,
        error: r.errorLine ?? null,
      }));

      return {
        results: unifiedResults,
        total: pyRes.total_tests,
        passed: pyRes.passed_tests,
        allPassed: pyRes.all_passed,
        durationMs: pyRes.execution_ms,
        errorLines: pyRes.error_lines ?? [],
        errorCategory: normalizeErrorCategory(pyRes.errorCategory),
      };
    },
    [language, py, getJsRunner],
  );

  const runWithCustomInput = useCallback(
    async (
      userCode: string,
      functionName: string,
      args: any[],
    ): Promise<CustomRunResult> => {
      if (language === "javascript") {
        try {
          const input = Array.isArray(args)
            ? args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" ")
            : String(args ?? "");
          const r = await getJsRunner().run({
            code: userCode,
            input,
            fnName: functionName,
            timeoutMs: 5_000,
          });
          if (r.ok) {
            return { actual: r.stdout.trim() };
          }
          return { actual: "", errorLine: r.stderr, errorCategory: "unknown" };
        } catch (err: any) {
          return { actual: "", errorLine: err?.message || String(err), errorCategory: "unknown" };
        }
      }
      // Python: usePyodide.runWithCustomInput(code, functionName, args)
      return py.runWithCustomInput(userCode, functionName, args);
    },
    [language, py, getJsRunner],
  );

  return {
    language,
    setLanguage,
    status: language === "javascript" ? "idle" : py.status,
    isLoading: language === "python" && py.status === "loading",
    error: py.errorMsg, // usePyodide'in errorMsg field'i (string | null)
    runTests,
    runWithCustomInput,
  };
}
