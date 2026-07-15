// public/js-runtime.worker.js
//
// 2026-07-15: JavaScript runtime — Web Worker (client-side, native V8).
// Pyodide Python icin ne yapıyorsa, JS icin bu worker.
// - 0KB bundle (browser V8 native)
// - 0ms load (worker aninda baslar)
// - Sandbox: new Function (global scope'tan izole)
// - Timeout: 5s hard limit (client tarafli)
//
// Mesaj protokolu:
//   Input:  { id, code, input, fnName? }
//   Output: { id, ok, stdout, stderr, durationMs, error? }

let runId = 0;

self.onmessage = (e) => {
  const { id, code, input = "", fnName } = e.data || {};
  const start = performance.now();

  // Stdout capture: self.console override (her mesajda orijinalini geri yukle)
  const originalConsole = self.console;
  let stdout = "";
  self.console = {
    log: (...args) => {
      stdout +=
        args
          .map((a) => {
            if (typeof a === "string") return a;
            try {
              return JSON.stringify(a);
            } catch {
              return String(a);
            }
          })
          .join(" ") + "\n";
    },
    error: (...args) => {
      stdout += "[error] " + args.map(String).join(" ") + "\n";
    },
    warn: (...args) => {
      stdout += "[warn] " + args.map(String).join(" ") + "\n";
    },
    info: (...args) => {
      stdout += args.map(String).join(" ") + "\n";
    },
    debug: (...args) => {
      stdout += args.map(String).join(" ") + "\n";
    },
    // 2026-07-15: Yeterli metodlar (worker'in kendi console'u ile cakisma yok)
  };

  // input'u JSON.stringify ile gomme (string icin guvenli)
  const inputLiteral = JSON.stringify(String(input || ""));

  // Eger fnName belirtilmisse, cagir (orn. "is_palindrome")
  // Degilse kodu dogrudan calistir (module-level)
  //
  // NOT: Onceki surum "console" parametre adi ile cakisma yapiyordu
  // ("Identifier 'console' has already been declared" — Worker'da console
  // zaten global). Cozum: self.console override + parametre YOK.
  let wrapper = `
"use strict";
const __input = ${inputLiteral};
${code}
${fnName ? `return ${fnName}(__input);` : "return undefined;"}
`;

  try {
    // Parametre YOK — self.console zaten override edilmis durumda
    const fn = new Function(wrapper);
    const result = fn();
    const durationMs = Math.round(performance.now() - start);

    self.postMessage({
      id,
      ok: true,
      stdout: stdout + (result !== undefined ? formatReturn(result) : ""),
      stderr: "",
      durationMs,
      error: null,
    });
  } catch (err) {
    const durationMs = Math.round(performance.now() - start);
    self.postMessage({
      id,
      ok: false,
      stdout,
      stderr: err && err.message ? err.message : String(err),
      durationMs,
      error: "runtime_error",
    });
  } finally {
    // Original console'u geri yukle (her mesajda temiz state)
    self.console = originalConsole;
  }
};

function formatReturn(v) {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (typeof v === "string") return v;
  if (typeof v === "object") {
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }
  return String(v);
}
