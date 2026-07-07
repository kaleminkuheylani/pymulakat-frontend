"use client";

// LessonRunner — Ders sayfasında kod örneklerini çalıştırmak için mini editör + runner.

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";

const CodeEditor = dynamic(
  () => import("../../../components/CodeEditor").then((m) => m.CodeEditorMonaco),
  { ssr: false, loading: () => <div className="h-[200px] bg-[#0a0e1a] rounded-lg animate-pulse" /> }
);

const PYODIDE_VERSION = "v0.27.7";
const PYODIDE_BASE = `/pyodide/${PYODIDE_VERSION}/full/`;

export default function LessonRunner({ code: initialCode, label = "kod.py" }: { code: string; label?: string }) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const pyRef = useRef<any>(null);
  const pyReadyRef = useRef<Promise<any> | null>(null);

  const ensurePyodide = useCallback(async () => {
    if (pyRef.current) return pyRef.current;
    if (pyReadyRef.current) return pyReadyRef.current;
    setLoading(true);
    pyReadyRef.current = (async () => {
      await new Promise<void>((resolve, reject) => {
        if (typeof document === "undefined") return reject(new Error("SSR"));
        const existing = document.querySelector(`script[src="${PYODIDE_BASE}pyodide.js"]`);
        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(new Error("Pyodide script yüklenemedi")), { once: true });
          return;
        }
        const s = document.createElement("script");
        s.src = `${PYODIDE_BASE}pyodide.js`;
        s.async = true;
        s.crossOrigin = "anonymous";
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Pyodide script yüklenemedi"));
        document.head.appendChild(s);
      });
      const w = window as any;
      if (typeof w.loadPyodide !== "function") throw new Error("loadPyodide yüklenemedi");
      const py = await w.loadPyodide({ indexURL: PYODIDE_BASE, fullStdLib: true });
      pyRef.current = py;
      setLoading(false);
      return py;
    })();
    return pyReadyRef.current;
  }, []);

  const handleRun = useCallback(async () => {
    setRunning(true);
    setOutput("");
    setErr(null);
    try {
      const py = await ensurePyodide();
      const captured: string[] = [];
      py.setStdout({ batched: (s: string) => captured.push(s.endsWith("\n") ? s.slice(0, -1) : s) });
      py.setStderr({ batched: (s: string) => captured.push("[stderr] " + (s.endsWith("\n") ? s.slice(0, -1) : s)) });
      await py.runPythonAsync(code);
      setOutput(captured.join("\n"));
    } catch (e: any) {
      const raw = String(e?.message || e || "");
      const lastLine = raw.split("\n").filter(Boolean).pop() || "Çalıştırma hatası";
      setErr(lastLine);
    } finally {
      setRunning(false);
    }
  }, [code, ensurePyodide]);

  return (
    <div className="rounded-lg border border-white/10 overflow-hidden bg-[#0a0e1a]">
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.03] border-b border-white/10">
        <span className="text-[11px] text-white/50 font-mono">{label}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCode(initialCode)}
            className="text-[10px] text-white/40 hover:text-white/70"
          >
            ↻ sıfırla
          </button>
          <button
            onClick={handleRun}
            disabled={running || loading}
            className="text-[10px] px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#050816] font-bold"
          >
            {loading ? "..." : running ? "..." : "▶ Çalıştır"}
          </button>
        </div>
      </div>
      <div className="h-[200px]">
        <CodeEditor value={code} onChange={setCode} height="100%" language="python" />
      </div>
      {(output || err) && (
        <div className="border-t border-white/10 p-3 max-h-[180px] overflow-y-auto font-mono text-[11px] leading-relaxed">
          {output && <pre className="whitespace-pre-wrap text-emerald-200">{output}</pre>}
          {err && <pre className="whitespace-pre-wrap text-rose-300 mt-1">⚠ {err}</pre>}
        </div>
      )}
    </div>
  );
}