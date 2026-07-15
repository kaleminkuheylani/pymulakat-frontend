// lib/codeRunners/jsRunner.ts
//
// 2026-07-15: JavaScript runtime wrapper — Web Worker (client-side, native V8).
// Pyodide (Python) ile ayni pattern, JS versiyonu.
//
// Kullanim:
//   const runner = createJsRunner();
//   const result = await runner.run({
//     code: "function is_palindrome(s) { ... }",
//     input: "racecar",
//     fnName: "is_palindrome",  // opsiyonel, cagirilacak fn
//   });
//   // { ok, stdout, stderr, durationMs }

export interface JsRunOptions {
  code: string;
  input?: string;
  /** Calistirilacak fonksiyon adi (orn. "is_palindrome"). Verilmezse module-level calistirilir. */
  fnName?: string;
  /** Timeout ms (default 5000) */
  timeoutMs?: number;
}

export interface JsRunResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
  error?: string | null;
}

interface PendingResolve {
  resolve: (r: JsRunResult) => void;
  reject: (e: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

const workerState: {
  worker: Worker | null;
  nextId: number;
  pending: Map<number, PendingResolve>;
} = {
  worker: null,
  nextId: 1,
  pending: new Map(),
};

function getWorker(): Worker {
  if (workerState.worker) return workerState.worker;
  if (typeof window === "undefined") {
    throw new Error("JS runtime sadece browser'da calisir (SSR degil)");
  }
  const w = new Worker("/js-runtime.worker.js");
  w.onmessage = (e) => {
    const { id, ok, stdout, stderr, durationMs, error } = e.data || {};
    const p = workerState.pending.get(id);
    if (!p) return;
    workerState.pending.delete(id);
    clearTimeout(p.timer);
    p.resolve({ ok, stdout, stderr, durationMs, error });
  };
  w.onerror = (err) => {
    // Tum bekleyen istekleri hata ile cozumle
    for (const p of workerState.pending.values()) {
      clearTimeout(p.timer);
      p.reject(new Error(err.message || "Worker hatasi"));
    }
    workerState.pending.clear();
    workerState.worker = null; // yeniden olusturulsun sonraki cagrida
  };
  workerState.worker = w;
  return w;
}

function runOnce(options: JsRunOptions): Promise<JsRunResult> {
  const worker = getWorker();
  const id = workerState.nextId++;
  const timeoutMs = options.timeoutMs ?? 5_000;

  return new Promise<JsRunResult>((resolve, reject) => {
    const timer = setTimeout(() => {
      workerState.pending.delete(id);
      // Worker'i terminate et (sonsuz dongu kuyrugunu temizle)
      worker.terminate();
      workerState.worker = null;
      reject(new Error(`JS calistirma zaman asimi (${timeoutMs}ms)`));
    }, timeoutMs);

    workerState.pending.set(id, { resolve, reject, timer });

    worker.postMessage({
      id,
      code: options.code,
      input: options.input ?? "",
      fnName: options.fnName,
    });
  });
}

export interface JsRunner {
  run(options: JsRunOptions): Promise<JsRunResult>;
  destroy(): void;
}

export function createJsRunner(): JsRunner {
  return {
    run: runOnce,
    destroy() {
      if (workerState.worker) {
        workerState.worker.terminate();
        workerState.worker = null;
      }
      for (const p of workerState.pending.values()) {
        clearTimeout(p.timer);
        p.reject(new Error("Runner destroyed"));
      }
      workerState.pending.clear();
    },
  };
}

/** Tek seferlik kullanim (otomatik cleanup). */
export async function runJsOnce(options: JsRunOptions): Promise<JsRunResult> {
  return runOnce(options);
}
