// hooks/usePyodide.ts — LAZY LOAD VERSION (mobil-friendly)
// Pyodide'i sayfa açıldığında DEĞİL, "Çalıştır" butonuna tıklayınca indir.
// Toplamda 14MB script yerine ilk yüklemede 0KB. İlk çalıştırma yavaş, sonrakiler cache'li.

import { useState, useRef, useCallback, useEffect } from "react";

export type PyodideStatus = "idle" | "loading" | "ready" | "running" | "error";

export interface TestCase {
  input: any;
  expected: any;
  description?: string;
}

export interface TestRunResult {
  input: any;
  expected: any;
  actual: any;
  passed: boolean;
  error?: string;
  description?: string;
  execution_ms?: number;
}

export interface PyodideRunResult {
  results: TestRunResult[];
  total_tests: number;
  passed_tests: number;
  console_output: string;
  all_passed: boolean;
  execution_ms: number;
  error?: string;
}

export interface UsePyodideReturn {
  status: PyodideStatus;
  errorMsg: string | null;
  runTests: (
    userCode: string,
    functionName: string,
    testCases: TestCase[]
  ) => Promise<PyodideRunResult>;
}

const PYODIDE_VERSION = "v0.27.7";
// 📌 Self-hosted: Pyodide bundle'ı Vercel'in kendi CDN'inden sunuluyor.
//    jsdelivr.net, unpkg.com gibi 3rd-party CDN'lere gidiş yok —
//    kullanıcı IP'si sızmıyor, KVKK uyumu tam.
const PYODIDE_CDN = `/pyodide/${PYODIDE_VERSION}/full/`;
const PYODIDE_SCRIPT_URL = `${PYODIDE_CDN}pyodide.js`;

declare global {
  interface Window {
    loadPyodide?: (config: any) => Promise<any>;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("Document not available (SSR)"));
      return;
    }
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing && typeof window.loadPyodide === "function") {
      resolve();
      return;
    }
    if (existing && !window.loadPyodide) {
      // script var ama yüklenmedi, yüklenmesini bekle
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Script yüklenemedi: ${src}`)), { once: true });
      return;
    }
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      if (typeof window.loadPyodide === "function") resolve();
      else reject(new Error("loadPyodide bulunamadı"));
    };
    script.onerror = () => reject(new Error(`Script yüklenemedi: ${src}`));
    document.head.appendChild(script);
  });
}

// ─── Deep equality for test outputs ────────────────────────────────────────
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (typeof a === "object") {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
}

// ═══════════════════════════════════════════════════════════════════════════
export function usePyodide(): UsePyodideReturn {
  const [status, setStatus] = useState<PyodideStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const pyodideRef = useRef<any>(null);
  // 📌 Lazy init: `null` ise henüz indirilmemiş. useEffect ile DEĞİL,
  //    runTests ilk çağrıldığında ensureReady tetiklenir.
  const initPromiseRef = useRef<Promise<void> | null>(null);

  const ensureReady = useCallback(async (): Promise<void> => {
    if (initPromiseRef.current) {
      await initPromiseRef.current;
      return;
    }

    initPromiseRef.current = (async () => {
      setStatus("loading");
      try {
        await loadScript(PYODIDE_SCRIPT_URL);
        if (!window.loadPyodide) throw new Error("loadPyodide yok");
        const py = await window.loadPyodide({
          indexURL: PYODIDE_CDN,
          fullStdLib: false,
        });
        pyodideRef.current = py;
        setStatus("ready");
      } catch (err: any) {
        setStatus("error");
        setErrorMsg(err.message);
        throw err;
      }
    })();
    await initPromiseRef.current;
  }, []);

  // ✅ runTests — lazy init tetikler, mobil 5s bloklamaz.
  // ✅ Cache: ikinci test çağrısı yeniden indirmez (initPromiseRef dolu).
  const runTests = useCallback(
    async (
      userCode: string,
      functionName: string,
      testCases: TestCase[]
    ): Promise<PyodideRunResult> => {
      // ✅ İlk çağrı → Pyodide'i indir, sonra testleri çalıştır
      await ensureReady();

      const py = pyodideRef.current;
      if (!py) throw new Error("Pyodide yüklenmedi");

      setStatus("running");
      setErrorMsg(null);

      const startTime = performance.now();
      const results: TestRunResult[] = [];
      let consoleOutput = "";
      let errorMsg: string | undefined;

      try {
        // Her çalıştırmada temiz stdout
        py.setStdout({
          batched: (s: string) => {
            consoleOutput += s + "\n";
          },
        });
        py.setStderr({
          batched: (s: string) => {
            consoleOutput += `[stderr] ${s}\n`;
          },
        });

        // Kullanıcı kodunu çalıştır
        // 1) Import'lar ve setup
        // 2) Fonksiyon tanımını ayıkla
        const functionMatch = userCode.match(new RegExp(`def\\s+${functionName}\\s*\\(`));
        const importMatch = userCode.match(/^((?:from\s+\S+\s+)?import\s+.*(?:\n(?!\S).*)*)/gm);

        let fullCode = userCode;
        if (importMatch) {
          // import'ları ayrı çalıştır (her satır)
          for (const im of importMatch) {
            try {
              await py.runPythonAsync(im);
            } catch (e: any) {
              consoleOutput += `[import hatası] ${e.message}\n`;
            }
          }
          fullCode = userCode.replace(/^((?:from\s+\S+\s+)?import\s+.*(?:\n(?!\S).*)*)/gm, "");
        }

        // Function'ı tanımla
        await py.runPythonAsync(fullCode);

        // Her test case'i çalıştır
        for (const tc of testCases) {
          const tcStart = performance.now();
          try {
            const pyResult = await py.runPythonAsync(
              `${functionName}(${JSON.stringify(tc.input).slice(1, -1)})`
            );
            const actual = pyResult?.toJs ? pyResult.toJs() : pyResult;
            const passed = deepEqual(actual, tc.expected);
            results.push({
              input: tc.input,
              expected: tc.expected,
              actual,
              passed,
              description: tc.description,
              execution_ms: Math.round(performance.now() - tcStart),
            });
          } catch (e: any) {
            results.push({
              input: tc.input,
              expected: tc.expected,
              actual: undefined,
              passed: false,
              error: e.message,
              description: tc.description,
              execution_ms: Math.round(performance.now() - tcStart),
            });
          }
        }

        if (!functionMatch) {
          errorMsg = `Fonksiyon '${functionName}' bulunamadı`;
        }
      } catch (err: any) {
        errorMsg = err.message || "Çalıştırma hatası";
        consoleOutput += `[error] ${errorMsg}\n`;
      } finally {
        // Stdout reset
        try {
          py.setStdout({ batched: () => {} });
          py.setStderr({ batched: () => {} });
        } catch {}
      }

      const totalMs = Math.round(performance.now() - startTime);
      const passedTests = results.filter((r) => r.passed).length;

      setStatus("ready");

      return {
        results,
        total_tests: testCases.length,
        passed_tests: passedTests,
        console_output: consoleOutput,
        all_passed: passedTests === testCases.length && !errorMsg,
        execution_ms: totalMs,
        error: errorMsg,
      };
    },
    [ensureReady]
  );

  // 📌 Cleanup (component unmount): Pyodide instance'ı temizle
  useEffect(() => {
    return () => {
      // Pyodide ref'i GC'ye bırak (her şey tarayıcıda, WebAssembly belleği serbest bırakır)
      pyodideRef.current = null;
    };
  }, []);

  return { status, errorMsg, runTests };
}

// 📌 Diğer componentler için yardımcı export
// (zaten export edildi yukarıda)
