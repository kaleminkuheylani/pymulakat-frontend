"use client";
import { Printer, Lightbulb, Download, Lock, TestTube, Eye, Loader2, Play, Sparkles } from "lucide-react";
import { errorMessage } from "@/lib/errorMessage";

// TestPanel.tsx — test case'leri göster + çalıştır + custom input + geç/kal durumu.
//
// Mevcut components/WorkspaceEditor.tsx'teki ExamplesTab + ConsoleTab'ı
// bu modülde BİRLEŞTİRİR. Prop-based API ile workspace orchestrator'a
// bağlanır. State'ler (param input, custom run sonucu, active tab,
// showHidden toggle) bu modülde izole.
//
// Hidden testler: client-side toggle. Veri kaynağında `is_hidden` alanı
// yoksa hepsi görünür; varsa default gizli, toggle ile gösterilir.
// (Mevcut işlevsellik korunur — toggle off default'ta davranış değişmez.)

import { useCallback, useEffect, useState } from "react";
import { QuestionTests, TestCase } from "@/lib/api/types";
import { TestRunResult, PyodideStatus } from "@/hooks/usePyodide";
import { getErrorLabel } from "@/lib/errorClassifier";
import {
  parseFunctionSignature,
  parseUserInput,
  formatValue,
  ParamInfo,
} from "@/components/parsePython";

// ─── Panel-height (resize) — localStorage'da saklanır ─────
const PANEL_HEIGHT_KEY = "pymulakat_console_height";
const DEFAULT_PANEL_HEIGHT = 448;
const MIN_PANEL_HEIGHT = 160;
const MAX_PANEL_HEIGHT_RATIO = 0.7;

type Tab = "examples" | "console";
type Variant = "desktop" | "mobile";

export interface TestPanelProps {
  variant: Variant;
  testCases: QuestionTests | null;
  testResults: TestRunResult[];
  isRunning: boolean;
  pyStatus: PyodideStatus;
  isGuest: boolean;
  category: string;
  id: string;
  /** Run Tests butonuna basıldığında tetiklenir */
  onRun: () => void;
  /** Fonksiyon imzası parse etmek için */
  starterCode?: string;
  /** Custom input runner — parent'tan (code + functionName kapatılmış) */
  onCustomRun?: (args: any[]) => Promise<{ actual: any; errorLine?: string; errorCategory?: string }>;
  /** Hata traceback satırları (Run Tests sonucu) */
  errorLines: string[];
}

// ─── TestPanel ───────────────────────────────────────────
export default function TestPanel({
  variant,
  testCases,
  testResults,
  isRunning,
  pyStatus,
  isGuest,
  category,
  id,
  onRun,
  starterCode,
  onCustomRun,
  errorLines,
}: TestPanelProps) {
  // Tab state — sadece desktop'ta tab var, mobile'da tabs ayrı render edilir
  const isDesktop = variant === "desktop";
  const [activeTab, setActiveTab] = useState<Tab>("examples");
  const [showHidden, setShowHidden] = useState(false);

  // Resize — sadece desktop'ta console panel resizable
  const [panelHeight, setPanelHeight] = useState<number>(() => {
    if (typeof window === "undefined") return DEFAULT_PANEL_HEIGHT;
    try {
      const saved = localStorage.getItem(PANEL_HEIGHT_KEY);
      const n = saved ? parseInt(saved, 10) : NaN;
      return Number.isFinite(n) && n >= MIN_PANEL_HEIGHT ? n : DEFAULT_PANEL_HEIGHT;
    } catch {
      return DEFAULT_PANEL_HEIGHT;
    }
  });

  useEffect(() => {
    // İlk mount'ta panel height'i set et
  }, []);

  const onResizeStart = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    target.setPointerCapture(e.pointerId);
    (target as any).__dragStart = { y: e.clientY, h: panelHeight, pid: e.pointerId };
  }, [panelHeight]);

  const onResizeMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const data = (e.target as any).__dragStart as { y: number; h: number; pid: number } | undefined;
    if (!data || e.pointerId !== data.pid) return;
    const delta = data.y - e.clientY;
    const maxH = Math.floor(window.innerHeight * MAX_PANEL_HEIGHT_RATIO);
    const next = Math.max(MIN_PANEL_HEIGHT, Math.min(maxH, data.h + delta));
    setPanelHeight(next);
  }, []);

  const onResizeEnd = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const data = (e.target as any).__dragStart;
    if (!data) return;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    try { localStorage.setItem(PANEL_HEIGHT_KEY, String(panelHeight)); } catch { /* ignore */ }
    (e.target as any).__dragStart = null;
  }, [panelHeight]);

  const onResizeReset = useCallback(() => {
    setPanelHeight(DEFAULT_PANEL_HEIGHT);
    try { localStorage.setItem(PANEL_HEIGHT_KEY, String(DEFAULT_PANEL_HEIGHT)); } catch { /* ignore */ }
  }, []);

  // Hidden test filter
  const visibleTestCases = (testCases?.test_cases || []).filter((tc: any) => {
    if (!tc.is_hidden) return true; // hidden değilse göster
    return showHidden; // hidden ise sadece toggle on ise göster
  });
  const hiddenCount = (testCases?.test_cases || []).filter((tc: any) => tc.is_hidden).length;

  // ── Mobile render (sadece içerik, tab bar parent'ta) ──
  if (!isDesktop) {
    return (
      <ExamplesView
        testCases={{ ...testCases, test_cases: visibleTestCases } as QuestionTests}
        testResults={testResults}
        isGuest={isGuest}
        category={category}
        id={id}
        hiddenCount={hiddenCount}
        showHidden={showHidden}
        onToggleHidden={() => setShowHidden((v) => !v)}
      />
    );
  }

  // ── Desktop render: Examples + Console tab + Run butonu ──
  return (
    <>
      {/* Resize handle — yukarı sürükle = büyüt, dblclick = reset */}
      <div
        className="h-1.5 -mt-1 bg-white/5 hover:bg-indigo-500/40 active:bg-indigo-500/70 cursor-row-resize flex-shrink-0 transition-colors relative group"
        onPointerDown={onResizeStart}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeEnd}
        onPointerCancel={onResizeEnd}
        onDoubleClick={onResizeReset}
        title="Sürükle: panel yüksekliğini ayarla · Çift tık: varsayılana dön"
        role="separator"
        aria-orientation="horizontal"
        aria-valuenow={panelHeight}
        aria-valuemin={MIN_PANEL_HEIGHT}
      >
        <div className="absolute inset-x-0 -top-1 -bottom-1" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-0.5 rounded-full bg-white/30 group-hover:bg-indigo-300 transition-colors pointer-events-none" />
      </div>

      <div
        className="bg-[#0a0e1a] flex flex-col flex-shrink-0"
        style={{ height: panelHeight }}
      >
        <div className="h-10 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-1">
            {(["examples", "console"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeTab === tab ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                {tab === "examples" ? (
                  <span className="flex items-center gap-2">
                    Örnekler
                    {testCases && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                        {visibleTestCases.length}
                      </span>
                    )}
                    {hiddenCount > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHidden((v) => !v);
                        }}
                        className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                          showHidden
                            ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                            : "bg-white/5 border-white/10 text-white/40"
                        }`}
                        title={showHidden ? "Hidden testleri gizle" : `${hiddenCount} hidden testi göster`}
                      >
                        {showHidden ? "👁 Hidden" : `🔒 ${hiddenCount} Hidden`}
                      </button>
                    )}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Printer className="w-3.5 h-3.5 inline" /> Konsol
                    {errorLines.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    )}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mr-2">
            {/* 2026-07-14: AI Feedback placeholder — "very soon" rozeti ile.
                Konsol/Örnekler tabs'in yanında, Çalıştır butonundan önce.
                Disabled: henüz arka uç LLM entegrasyonu yok, sadece UI beklentisi.
                Conversion: 'cok yakinda' sinyali + gelen user 'bu urun gelisiyor' görür. */}
            <button
              type="button"
              disabled
              aria-label="AI Geri Bildirim (çok yakında)"
              title="AI Geri Bildirim — çok yakında"
              className="px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 bg-white/[0.03] border border-white/10 text-white/40 cursor-not-allowed"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300/70" />
              <span>AI Feedback</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/20">
                very soon
              </span>
            </button>
          </div>

          <button
            onClick={() => {
              setActiveTab("examples");
              onRun();
            }}
            disabled={isRunning || (pyStatus !== "ready" && pyStatus !== "idle")}
            className={`px-5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
              isRunning || (pyStatus !== "ready" && pyStatus !== "idle")
                ? "bg-white/5 text-white/30 cursor-not-allowed"
                : isGuest
                ? "bg-amber-500/10 border border-amber-400/40 text-amber-400 hover:bg-amber-500/20"
                : "bg-amber-500 hover:bg-amber-400 text-[#050816] hover:shadow-lg hover:shadow-amber-500/30"
            }`}
          >
            {isRunning ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
                Çalışıyor...
              </>
            ) : isGuest ? (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2" />
                </svg>
                Giriş Yap & Çalıştır
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Çalıştır
              </>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {activeTab === "examples" && (
            <ExamplesView
              testCases={{ ...testCases, test_cases: visibleTestCases } as QuestionTests}
              testResults={testResults}
              isGuest={isGuest}
              category={category}
              id={id}
              hiddenCount={hiddenCount}
              showHidden={showHidden}
              onToggleHidden={() => setShowHidden((v) => !v)}
            />
          )}

          {activeTab === "console" && (
            <ConsoleView
              errorLines={errorLines}
              starterCode={starterCode}
              functionName={testCases?.function_name}
              isRunning={isRunning}
              onCustomRun={onCustomRun}
            />
          )}
        </div>
      </div>
    </>
  );
}

// ─── ExamplesView: her test case'i kart olarak göster ─────
function ExamplesView({
  testCases,
  testResults,
  isGuest,
  category,
  id,
  hiddenCount,
  showHidden,
  onToggleHidden,
}: {
  testCases: QuestionTests | null;
  testResults: TestRunResult[];
  isGuest: boolean;
  category: string;
  id: string;
  hiddenCount: number;
  showHidden: boolean;
  onToggleHidden: () => void;
}) {
  if (!testCases || testCases.test_cases.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 text-white/30 p-4 text-center">
        <p className="text-xs">Bu soru için örnek test case bulunmuyor.</p>
        {hiddenCount > 0 && !showHidden && (
          <button
            onClick={onToggleHidden}
            className="text-[11px] px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            🔒 {hiddenCount} Hidden Testi Göster
          </button>
        )}
        {isGuest && (
          <a
            href={`/login?returnUrl=${encodeURIComponent(`/interviews/${category}/${id}`)}`}
            className="text-[11px] px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            Giriş Yap (Kodu çalıştırmak için)
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3">
      {testCases.test_cases.map((tc: TestCase, idx: number) => {
        const result = testResults[idx];
        const hasRun = result !== undefined;
        const isError = hasRun && !!result.errorCategory;
        const isLogicFail = hasRun && !result.passed && !isError;
        const referenceActual = tc.actual !== undefined && tc.actual !== null ? tc.actual : null;
        const isHidden = (tc as any).is_hidden === true;

        return (
          <div
            key={idx}
            className={`p-4 rounded-lg border ${
              hasRun
                ? result.passed
                  ? "bg-green-500/5 border-green-500/30"
                  : "bg-red-500/5 border-red-500/30"
                : "bg-white/5 border-white/10"
            } ${isHidden ? "ring-1 ring-amber-500/20" : ""}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Örnek #{idx + 1}
                </span>
                {isHidden && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold uppercase">
                    🔒 Hidden
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {hasRun && result.execution_ms != null && (
                  <span className="text-[10px] text-white/40 font-mono">
                    {result.execution_ms}ms
                  </span>
                )}
                {hasRun && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    result.passed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}>
                    {result.passed ? "✓ Geçti" : isError ? "✗ Hata" : "✗ Yanlış"}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              {/* Input */}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1 font-bold">
                  <Download className="w-3.5 h-3.5 inline" /> Input
                </div>
                <pre className="text-xs font-mono text-white/80 bg-black/30 p-2 rounded overflow-x-auto border">
                  {formatValue(tc.input)}
                </pre>
              </div>

              {/* Expected */}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-emerald-400/80 mb-1 font-bold">
                  ✓ Expected
                </div>
                <pre className="text-xs font-mono text-emerald-300 bg-emerald-500/5 p-2 rounded overflow-x-auto border border-emerald-500/20 min-h-[2.5rem]">
                  {formatValue(tc.expected)}
                </pre>
              </div>

              {/* Misafirlere: DB'deki referans çıktı (actual) önizleme */}
              {!hasRun && referenceActual !== null && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-cyan-300/70 mb-1 font-bold">
                    <Eye className="w-3.5 h-3.5 inline" /> Actual (referans çıktı)
                  </div>
                  <pre className="text-xs font-mono text-cyan-200 bg-cyan-500/5 p-2 rounded overflow-x-auto border border-cyan-500/20 min-h-[2.5rem]">
                    {formatValue(referenceActual)}
                  </pre>
                </div>
              )}

              {/* Hata: traceback */}
              {isError && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-rose-400/80 mb-1 font-bold">
                    ⚠ Traceback
                  </div>
                  <pre className="text-xs font-mono text-rose-300 bg-rose-500/10 p-2 rounded overflow-x-auto border border-rose-500/30 min-h-[2.5rem]">
                    {result.errorLine || getErrorLabel(result.errorCategory!) || "Bilinmeyen hata"}
                  </pre>
                </div>
              )}

              {/* Logic fail: Actual karşılaştırması */}
              {isLogicFail && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-rose-400/80 mb-1 font-bold">
                    ✗ Actual (senin kodun)
                  </div>
                  <pre className="text-xs font-mono text-rose-300 bg-rose-500/5 p-2 rounded overflow-x-auto border border-rose-500/20 min-h-[2.5rem]">
                    {formatValue(result.actual)}
                  </pre>
                  <div className="text-[10px] text-amber-300/80 italic px-1 mt-1">
                    <Lightbulb className="w-3.5 h-3.5 inline" /> Return değeri beklenenle eşleşmiyor — yukarıdaki Actual, senin kodun bu test için ne döndüğü.
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── ConsoleView: Custom Input + Hata Traceback ───────────
function ConsoleView({
  errorLines,
  starterCode,
  functionName,
  isRunning,
  onCustomRun,
}: {
  errorLines: string[];
  starterCode?: string;
  functionName?: string;
  isRunning?: boolean;
  onCustomRun?: (args: any[]) => Promise<{ actual: any; errorLine?: string; errorCategory?: string }>;
}) {
  const params = parseFunctionSignature(starterCode || "", functionName || "");
  const [inputs, setInputs] = useState<string[]>(
    Array.from({ length: params.length }, () => "")
  );
  const [result, setResult] = useState<any>(undefined);
  const [resultError, setResultError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    if (!onCustomRun) return;
    setRunning(true);
    setResult(undefined);
    setResultError(null);
    try {
      const parsed = inputs.map((s) => parseUserInput(s));
      const r = await onCustomRun(parsed);
      setResult(r.actual);
      setResultError(r.errorLine || null);
    } catch (e) {
      setResultError(errorMessage(e) || "Çalıştırma hatası");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="p-3 space-y-3 overflow-y-auto h-full">
      {params.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-white/60 font-bold">
              <TestTube className="w-3.5 h-3.5 inline" /> Kendi Input'unla Dene
            </span>
            <span className="text-[10px] text-white/40">{params.length} parametre</span>
          </div>

          {params.map((p, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono text-white/70">
                  {p.name}
                  <span className="text-[10px] text-white/40 ml-2">: {p.type}</span>
                </label>
                <span className="text-[9px] text-white/30 font-mono">{p.type}</span>
              </div>
              <input
                type="text"
                value={inputs[idx] || ""}
                placeholder={p.placeholder}
                onChange={(e) => {
                  const next = [...inputs];
                  next[idx] = e.target.value;
                  setInputs(next);
                }}
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-black/30 border border-white/10 rounded text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          ))}

          <button
            onClick={handleRun}
            disabled={running || isRunning}
            className="w-full px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-indigo-500/20"
          >
            {running ? "⏳ Çalışıyor..." : "▶ Kendi Input'umla Çalıştır"}
          </button>
        </div>
      ) : (
        <div className="text-[10px] text-white/30 text-center py-4">
          Fonksiyon imzası bulunamadı
        </div>
      )}

      {result !== undefined && (
        <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/30">
          <div className="text-[10px] uppercase tracking-wider text-green-400/80 mb-1 font-bold">
            ✓ Sonuç
          </div>
          <pre className="text-xs font-mono text-green-200 whitespace-pre-wrap break-all">
            {formatValue(result)}
          </pre>
        </div>
      )}

      {errorLines.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] uppercase tracking-wider text-rose-400/80 font-bold">
              ⚠ Son Çalıştırma Hatası
            </span>
            <span className="text-[10px] text-white/30 font-mono">
              {errorLines.length} satır
            </span>
          </div>
          <pre className="text-xs text-rose-200 font-mono whitespace-pre-wrap leading-relaxed">
            {errorLines.map((line, i) => (
              <div key={i} className="text-rose-300/90 font-semibold">
                {line}
              </div>
            ))}
          </pre>
        </div>
      )}

      {resultError && !errorLines.length && (
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
          <div className="text-[10px] uppercase tracking-wider text-rose-400/80 mb-1 font-bold">
            ⚠ Çalıştırma Hatası
          </div>
          <pre className="text-xs font-mono text-rose-200 whitespace-pre-wrap">
            {resultError}
          </pre>
        </div>
      )}
    </div>
  );
}
