// lib/codeRunners/index.ts
//
// 2026-07-15: Language dispatch — Python (Pyodide) veya JavaScript (Web Worker).
// Soru detayinda dil secici ile calistirilacak runtime'i secer.

import type { JsRunResult, JsRunOptions } from "./jsRunner";
import { runJsOnce, createJsRunner } from "./jsRunner";

export type SupportedLanguage = "python" | "javascript";

export interface RunResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
  language: SupportedLanguage;
  error?: string | null;
}

export interface RunOptions {
  code: string;
  language: SupportedLanguage;
  input?: string;
  fnName?: string;
  timeoutMs?: number;
}

/**
 * Calisma zamani dispatch — dil'e gore uygun runtime.
 * - python: Mevcut Pyodide runtime (usePyodide hook ile entegre)
 * - javascript: Web Worker (native V8, 0KB bundle)
 */
export async function runCode(options: RunOptions): Promise<RunResult> {
  if (options.language === "javascript") {
    const r = await runJsOnce({
      code: options.code,
      input: options.input,
      fnName: options.fnName,
      timeoutMs: options.timeoutMs,
    });
    return {
      ok: r.ok,
      stdout: r.stdout,
      stderr: r.stderr,
      durationMs: r.durationMs,
      language: "javascript",
      error: r.error,
    };
  }

  throw new Error(
    `Python runtime icin usePyodide hook'u kullanin (language: '${options.language}'). ` +
      "Bu fonksiyon sadece JS runtime'i handle eder.",
  );
}

export { createJsRunner, runJsOnce };
export type { JsRunResult, JsRunOptions };
