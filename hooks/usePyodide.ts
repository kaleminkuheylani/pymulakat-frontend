// hooks/usePyodide.ts — LAZY LOAD VERSION (mobil-friendly)
// Pyodide'i sayfa açıldığında DEĞİL, "Çalıştır" butonuna tıklayınca indir.
// Toplamda 14MB script yerine ilk yüklemede 0KB. İlk çalıştırma yavaş, sonrakiler cache'li.

import { useState, useRef, useCallback, useEffect } from "react";
import { classifyError, type ErrorCategory } from "../lib/errorClassifier";
import { installSandboxPolicy } from "../lib/sandboxPolicy";

// ─── Traceback helper: sadece son satırı döner (File "..." line X kısmı atılır) ───
// Örn. tam metin:
//   Traceback (most recent call last):
//     File "<exec>", line 5, in <module>
//   ValueError: invalid literal for int() with base 10: 'abc'
// → "ValueError: invalid literal for int() with base 10: 'abc'"
function lastErrorLine(raw: string | undefined | null): string {
  if (!raw) return "";
  // Önce string'i normalize et — \n veya gerçek yeni satırlar
  const lines = String(raw)
    .replace(/\\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return "";
  // Son satır (genelde "ValueError: ..." gibi exception+message)
  const last = lines[lines.length - 1];
  // Eğer son satır Traceback başlıksa (çok nadir), bir önceki satıra düş
  if (/^Traceback \(most recent call last\)/i.test(last) && lines.length > 1) {
    return lines[lines.length - 2];
  }
  return last;
}

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
  // 📌 Raw Python error ASLA UI'a dönmez — sadece hardcoded kategori enum
  errorCategory?: ErrorCategory;
  // Traceback'in son satırı (örn. "ValueError: invalid literal...").
  // Hata olduğunda UI'da gösterilir, hata yoksa undefined.
  errorLine?: string;
  description?: string;
  execution_ms?: number;
}

export interface PyodideRunResult {
  results: TestRunResult[];
  total_tests: number;
  passed_tests: number;
  // Sadece hata traceback'lerinin son satırları — print() çıktıları YAKALANMAZ
  // (kullanıcı kendi debug'ını kendi mantığıyla yapar; UI sadece hata varsa bilgi verir)
  error_lines: string[];
  all_passed: boolean;
  execution_ms: number;
  // Genel hata varsa kategori (örn. import hatası, fonksiyon bulunamadı)
  errorCategory?: ErrorCategory;
}

export interface UsePyodideReturn {
  status: PyodideStatus;
  // UI'da gösterilecek hata mesajı: sabit hardcoded string. Raw Python error değil.
  errorMsg: string | null;
  runTests: (
    userCode: string,
    functionName: string,
    testCases: TestCase[]
  ) => Promise<PyodideRunResult>;
  runWithCustomInput: (
    userCode: string,
    functionName: string,
    args: any[]
  ) => Promise<{ actual: any; errorLine?: string; errorCategory?: ErrorCategory }>;
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
// ─── Deep equality: tip bağımsız, sayı/string dönüşümü tolerant ───
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  // Sayı ↔ numeric string toleransı: "5" ile 5 eşit sayılır
  if (typeof a === "number" && typeof b === "string") {
    const nb = Number(b);
    if (!Number.isNaN(nb) && a === nb) return true;
  }
  if (typeof a === "string" && typeof b === "number") {
    const na = Number(a);
    if (!Number.isNaN(na) && na === b) return true;
  }
  // Her iki taraf object ise (array dahil) JSON normalize karşılaştırması
  if (typeof a === "object" && typeof b === "object") {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  // Son çare: primitive karşılaştırması
  return a === b;
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
      // 2026-07-14: 12s timeout — Pyodide yükleme takılırsa (CSP, network,
      // SharedArrayBuffer) sonsuza kadar loading'de kalmayı önler. Timeout
      // → error state, editör hâlâ kullanılabilir (sadece Run disabled).
      const TIMEOUT_MS = 12000;
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Pyodide yükleme zaman aşımı (12s)")), TIMEOUT_MS)
      );
      try {
        await Promise.race([
          (async () => {
            await loadScript(PYODIDE_SCRIPT_URL);
            if (!window.loadPyodide) throw new Error("loadPyodide yok");
            const py = await window.loadPyodide({
              indexURL: PYODIDE_CDN,
              fullStdLib: false,
            });
            try {
              await installSandboxPolicy(py);
            } catch (policyErr) {
              console.error("[usePyodide] sandbox policy yüklenemedi:", policyErr);
            }
            pyodideRef.current = py;
          })(),
          timeoutPromise,
        ]);
        setStatus("ready");
      } catch (err: any) {
        setStatus("error");
        // 📌 Raw error.message UI'a sızmaz — sabit hardcoded mesaj
        setErrorMsg("Çalıştırma ortamı yüklenemedi");
        console.error("[usePyodide] init failed:", err);
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
      // 📌 Sadece hata traceback'lerinin son satırları toplanır.
      //    print() / stdout YAKALANMAZ (kullanıcı kendi debug'ını kendi yapar).
      const errorLines: string[] = [];
      // 📌 Raw Python error ASLA UI'a, console'a, toast'a sızmaz.
      //    Sadece kategori enum'u tutulur.
      let generalErrorCategory: ErrorCategory | undefined;

      try {
        // Stdout/stderr callback'leri boş — print() ÇIKTILARI YAKALANMAZ
        py.setStdout({ batched: () => {} });
        py.setStderr({ batched: () => {} });

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
              // Raw mesaj yerine sadece kategori — içerik sızmaz
              const last = lastErrorLine(e?.message || "");
              if (last) errorLines.push(`[import hatası] ${last}`);
            }
          }
          fullCode = userCode.replace(/^((?:from\s+\S+\s+)?import\s+.*(?:\n(?!\S).*)*)/gm, "");
        }

        // Function'ı tanımla
        await py.runPythonAsync(fullCode);

        // Her test case'i çalıştır
        // 📌 Input formatı: function_input olduğu gibi tek arg olarak geçer.
        //   - Array  → doğrudan geçir (Python list parametresi olarak)
        //   - Object → values spread (örn {arr, target} → arr, target — multi-arg)
        //   - Primitive → direkt geçir
        // 📌 NOT: Test case input'u ARRAY olduğunda spread YAPMA —
        //         çünkü fonksiyon (nums: list) imzasıyla çağrılıyor,
        //         tek parametre olarak list alıyor.
        for (const tc of testCases) {
          const tcStart = performance.now();
          let pyArg: string;
          if (Array.isArray(tc.input)) {
            // Array'i spread etmeden tek arg olarak geçir: [1,3,5] → "[1,3,5]"
            pyArg = JSON.stringify(tc.input);
          } else if (tc.input && typeof tc.input === "object") {
            // Object ise values'ları spread et: {arr:[1,3], target:7} → "[1,3], 7"
            const values = Object.values(tc.input);
            pyArg = values
              .map((a) => (typeof a === "string" ? JSON.stringify(a) : JSON.stringify(a)))
              .join(", ");
          } else {
            // Primitive
            pyArg = typeof tc.input === "string" ? JSON.stringify(tc.input) : String(tc.input);
          }
          try {
            const pyResult = await py.runPythonAsync(
              `${functionName}(${pyArg})`
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
            // 📌 Raw e.message UI'a sızmaz; konsola sadece son satırı düşer
            const rawMsg = e?.message || "";
            const last = lastErrorLine(rawMsg);
            results.push({
              input: tc.input,
              expected: tc.expected,
              actual: undefined,
              passed: false,
              errorCategory: classifyError(rawMsg),
              errorLine: last || undefined,
              description: tc.description,
              execution_ms: Math.round(performance.now() - tcStart),
            });
            if (last) {
              errorLines.push(`[error] ${last}`);
            }
          }
        }

        if (!functionMatch) {
          generalErrorCategory = "syntax_error"; // fonksiyon tanımı yok → syntax/setup hatası
        }
      } catch (err: any) {
        // 📌 Raw err.message asla UI'a düşmez — sadece kategori enum
        const rawMsg = err?.message || "";
        generalErrorCategory = classifyError(rawMsg);
        // Konsola sadece traceback'in son satırı (genelde "ValueError: ..." gibi)
        const last = lastErrorLine(rawMsg);
        if (last) {
          errorLines.push(`[error] ${last}`);
        }
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
        error_lines: errorLines,
        all_passed: passedTests === testCases.length && !generalErrorCategory,
        execution_ms: totalMs,
        errorCategory: generalErrorCategory,
      };
    },
    [ensureReady]
  );

  // 📌 Cleanup (component unmount): Pyodide instance'ı temizle
  useEffect(() => {
    return () => {
      // Pyodide ref'leri sıfırla — WebAssembly belleği serbest, init promise cache temizlendi
      // (yoksa yeniden mount eski promise'i bekler)
      pyodideRef.current = null;
      initPromiseRef.current = null;
    };
  }, []);

  // Tek seferlik custom input ile fonksiyon çağrısı — Konsol Custom Input için
  const runWithCustomInput = useCallback(
    async (
      userCode: string,
      functionName: string,
      args: any[]
    ): Promise<{ actual: any; errorLine?: string; errorCategory?: ErrorCategory }> => {
      await ensureReady();
      const py = pyodideRef.current;
      if (!py) throw new Error("Pyodide yüklenmedi");

      try {
        py.setStdout({ batched: () => {} });
        py.setStderr({ batched: () => {} });
        await py.runPythonAsync(userCode);
        // Boş input'lar için kullanıcıya açık hata dön (Python TypeError'dan önce)
        const emptyIdx = args.findIndex((a) => a === "" || a === undefined);
        if (emptyIdx !== -1) {
          return {
            actual: undefined,
            errorLine: `${emptyIdx + 1}. parametre boş bırakılmış — değer gir ve tekrar dene.`,
            errorCategory: "TypeError" as ErrorCategory,
          };
        }
        const pyArgs = args
          .map((a) => (typeof a === "string" ? JSON.stringify(a) : JSON.stringify(a)))
          .join(", ");
        const pyResult = await py.runPythonAsync(`${functionName}(${pyArgs})`);
        const actual = pyResult?.toJs ? pyResult.toJs() : pyResult;
        return { actual };
      } catch (e: any) {
        const rawMsg = e?.message || String(e);
        const last = lastErrorLine(rawMsg);
        console.error("[runWithCustomInput] failed:", rawMsg, "args:", args, "userCode:", userCode?.slice(0, 200));
        return {
          actual: undefined,
          errorLine: last || rawMsg,
          errorCategory: classifyError(rawMsg),
        };
      }
    },
    [ensureReady]
  );

  return { status, errorMsg, runTests, runWithCustomInput };
}

// 📌 Diğer componentler için yardımcı export
// (zaten export edildi yukarıda)
