"use client";

// PythonOnlineEditor — Free-style Python editor (CodeMirror 6 + Pyodide).

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { installSandboxPolicy } from "../../lib/sandboxPolicy";

// CodeMirror client-only
const CodeEditor = dynamic(
  () => import("../../components/CodeEditor").then((m) => m.CodeEditorMonaco),
  { ssr: false, loading: () => <EditorSkeleton /> }
);

const DEFAULT_CODE = `# Python Online — Tarayıcıda Python çalıştır
# Kodunu yaz, Çalıştır'a bas, sağdaki konsolda çıktıyı gör.

def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print([fibonacci(i) for i in range(10)])
`;

const PYODIDE_VERSION = "v0.27.7";
const PYODIDE_BASE = `/pyodide/${PYODIDE_VERSION}/full/`;

export default function PythonOnlineEditor() {
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [output, setOutput] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pyStatus, setPyStatus] = useState<"idle" | "loading" | "ready" | "running" | "error">("idle");
  const pyodideRef = useRef<any>(null);
  const pyodideReadyRef = useRef<Promise<any> | null>(null);

  const ensurePyodide = useCallback(async () => {
    try {
      if (pyodideRef.current) return pyodideRef.current;
      if (pyodideReadyRef.current) return pyodideReadyRef.current;
      setPyStatus("loading");
      pyodideReadyRef.current = (async () => {
        await loadScript(`${PYODIDE_BASE}pyodide.js`);
        const w = window as any;
        if (typeof w.loadPyodide !== "function") {
          throw new Error("loadPyodide yüklenemedi");
        }
        const py = await w.loadPyodide({ indexURL: PYODIDE_BASE, fullStdLib: true });
        if (!py) throw new Error("Pyodide null döndü");
        // Sandbox policy — requests/os/sys/urllib/socket gibi dış dünyaya
        // erişim modülleri import edilemez hale getirilir.
        try {
          await installSandboxPolicy(py);
        } catch (policyErr) {
          console.error("[PythonOnline] sandbox policy yüklenemedi:", policyErr);
          // Kullanıcıyı bloklamadan devam et (degraded mode); hata konsola düşer
        }
        pyodideRef.current = py;
        setPyStatus("ready");
        return py;
      })();
      return pyodideReadyRef.current;
    } catch (e: any) {
      console.error("[ensurePyodide]", e);
      setPyStatus("error");
      setErrorMsg("Python yüklenemedi. Sayfayı yenile.");
      throw e;
    }
  }, []);

  const handleRun = useCallback(async () => {
    setOutput("");
    setErrorMsg(null);
    setPyStatus("running");
    try {
      const py = await ensurePyodide();
      if (!py) throw new Error("Pyodide yüklenemedi");

      const captured: string[] = [];
      // Pyodide proxy bazen tanımsız davranıyor — setStdout her zaman
      // güvenli bir noop stub ile sar.
      const safeBatched = (prefix: string) => (s: string) => {
        try {
          const clean = s.endsWith("\n") ? s.slice(0, -1) : s;
          captured.push(prefix ? prefix + clean : clean);
        } catch {
          /* capture hatasını yut */
        }
      };

      try {
        if (typeof py.setStdout === "function") {
          py.setStdout({ batched: safeBatched("") });
        }
      } catch { /* ignore */ }
      try {
        if (typeof py.setStderr === "function") {
          py.setStderr({ batched: safeBatched("[stderr] ") });
        }
      } catch { /* ignore */ }

      // Kullanıcı kodu — exception'ı handleRun catch'i yakalıyor
      await py.runPythonAsync(code);
      setOutput(captured.join("\n"));
      setPyStatus("ready");
    } catch (e: any) {
      // Tüm hata yolları: Pyodide error, network, parse, vs.
      let raw: string;
      try {
        raw = String(e?.message || e || "");
      } catch {
        raw = "Çalıştırma hatası";
      }
      const lastLine = raw.split("\n").filter(Boolean).pop() || "Çalıştırma hatası";
      setErrorMsg(lastLine);
      setPyStatus("ready");
    }
  }, [code, ensurePyodide]);

  const handleReset = () => {
    setCode(DEFAULT_CODE);
    setOutput("");
    setErrorMsg(null);
  };

  const handleClearOutput = () => {
    setOutput("");
    setErrorMsg(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleRun]);

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <header className="border-b border-white/10 bg-[#0a0e1a]/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] text-white/40">
              <Link href="/" className="hover:text-white/70">Ana Sayfa</Link>
              /
              Python Online
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mt-0.5 leading-tight truncate">
              Python Online — Tarayıcıda Kod Yaz, Çalıştır
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-0.5 hidden sm:block">
              Kurulum yok, hesap açmadan Python kodu yaz ve anında sonucu gör.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <PyodideBadge status={pyStatus} />
            <button
              onClick={handleRun}
              disabled={pyStatus === "loading" || pyStatus === "running"}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#050816] font-bold text-sm flex items-center gap-2"
            >
              {pyStatus === "loading" ? (
                <><Spinner /> Yükleniyor...</>
              ) : pyStatus === "running" ? (
                <><Spinner /> Çalışıyor...</>
              ) : (
                <>▶ Çalıştır <kbd className="ml-1 text-[10px] opacity-70">⌘↵</kbd></>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4">
          <section className="rounded-xl border border-white/10 overflow-hidden bg-[#0a0e1a] h-[60vh] min-h-[400px]">
            <CodeEditor value={code} onChange={setCode} height="100%" language="python" />
          </section>
          <aside className="space-y-4">
            <Console output={output} error={errorMsg} onClear={handleClearOutput} />
            <TipsAndLinks onReset={handleReset} />
          </aside>
        </div>

        <section className="mt-12 prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-white mb-4">
            Python Online Editör ile Ne Yapabilirsin?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard title="Kodunu test et" description="Algoritmanı çalıştır, hataları gör, iteratif şekilde geliştir." icon="🧪" />
            <FeatureCard title="Python öğren" description="Başlangıç kodlarını çalıştır, sonuçları gör, kodu değiştir, tekrar dene." icon="🎓" />
            <FeatureCard title="Snippet paylaş" description="Çalışan kodu referans olarak kullan veya arkadaşlarınla paylaş." icon="🔗" />
          </div>

          <h3 className="text-xl font-bold text-white mt-10 mb-3">Sık Sorulan Sorular</h3>
          <div className="space-y-3 text-sm text-white/70">
            <FaqItem q="Hangi Python sürümü kullanılıyor?" a="Python 3.12 (CPython) WebAssembly üzerinden çalışır. Standart kütüphane ve numpy, pandas gibi paketler kullanılabilir." />
            <FaqItem q="Kodum sunucuya gönderiliyor mu?" a="Hayır. Pyodide tamamen tarayıcında çalışır. Kodun veya verilerin hiçbiri sunucuya iletilmez." />
            <FaqItem q="Üye olmam gerekiyor mu?" a="Hayır. Sayfayı aç, kod yaz, çalıştır. Hesap zorunluluğu yok." />
          </div>
        </section>
      </main>
    </div>
  );
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("Document not available (SSR)"));
      return;
    }
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Script yüklenemedi: ${src}`)), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.crossOrigin = "anonymous";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Script yüklenemedi: ${src}`));
    document.head.appendChild(s);
  });
}

function PyodideBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; color: string }> = {
    idle: { label: "Hazır", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
    loading: { label: "Yükleniyor", color: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
    ready: { label: "Hazır", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
    running: { label: "Çalışıyor", color: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" },
    error: { label: "Hata", color: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
  };
  const c = cfg[status] || cfg.idle;
  return (
    <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${c.color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      Python {c.label}
    </span>
  );
}

function Console({ output, error, onClear }: { output: string; error: string | null; onClear: () => void }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0a0e1a] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-white/[0.02]">
        <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">🖨️ Konsol Çıktısı</span>
        <button onClick={onClear} className="text-[11px] text-white/40 hover:text-white/70">Temizle</button>
      </div>
      <div className="p-3 min-h-[140px] max-h-[40vh] overflow-y-auto font-mono text-[12px] leading-relaxed">
        {!output && !error && (
          <div className="text-white/30">
            <p>Çıktı burada görünecek.</p>
            <p className="mt-2 text-white/20">
              İpucu: <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Enter</kbd> ile çalıştır.
            </p>
          </div>
        )}
        {output && <pre className="whitespace-pre-wrap text-emerald-200">{output}</pre>}
        {error && <pre className="whitespace-pre-wrap text-rose-300 mt-2">⚠ {error}</pre>}
      </div>
    </div>
  );
}

function TipsAndLinks({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-4">
      <h3 className="text-sm font-bold text-white mb-2">💡 İpuçları</h3>
      <ul className="text-xs text-white/60 space-y-1.5 leading-relaxed">
        <li>• <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10">Ctrl+Enter</kbd> hızlı çalıştırma</li>
        <li>• <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10">print()</kbd> çıktısı konsola düşer</li>
        <li>• Son satırdaki ifade otomatik döndürülür</li>
        <li>• <code className="text-amber-300">import math, random, json</code> gibi stdlib modülleri çalışır</li>
      </ul>
      <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
        <Link href="/interviews" className="block text-xs px-3 py-2 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 hover:bg-indigo-500/25 transition-colors">
          📚 Mülakat sorularıyla pratik yap →
        </Link>
        <Link href="/python-egitimi" className="block text-xs px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 hover:bg-amber-500/20 transition-colors">
          🎓 Python eğitimi rehberleri →
        </Link>
        <button onClick={onReset} className="block w-full text-left text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10">
          ↻ Kodu sıfırla
        </button>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
      <div className="text-2xl mb-2">{icon}</div>
      <h4 className="text-base font-bold text-white mb-1">{title}</h4>
      <p className="text-sm text-white/60 leading-relaxed">{description}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="p-3 rounded-lg bg-white/[0.03] border border-white/10 group">
      <summary className="cursor-pointer text-white/90 font-medium list-none flex items-center justify-between">
        {q}
        ▾
      </summary>
      <p className="mt-2 text-white/70 leading-relaxed">{a}</p>
    </details>
  );
}

function EditorSkeleton() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-[#0a0e1a] text-white/40 text-sm">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-[3px] border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        Editör yükleniyor...
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
  );
}