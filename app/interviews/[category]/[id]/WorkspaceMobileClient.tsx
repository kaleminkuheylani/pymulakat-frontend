"use client";

// WorkspaceMobileClient — Mobile workspace orchestrator
// Sub-components: MobileSidebar, MobileTestResults

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useUser } from "../../../../hooks/useUser";
import { usePyodide } from "../../../../hooks/usePyodide";
import { parseFunctionSignature, parseUserInput, formatValue } from "../../../../components/parsePython";
import { questionsAPI, Question, QuestionTests, TestCase } from "../../../../api/v2/questions";
import { slugifyTitle } from "../../../../lib/questionMeta";
import { WorkspaceSidebarMobile } from "./components/WorkspaceSidebarMobile";


// Code editor sadece client-side
const CodeEditor = dynamic(
  () => import("../../../../components/Monaco").then((m) => m.CodeEditorMonaco),
  { ssr: false }
);

export const dynamic_ = "force-dynamic";

interface Props {
  initialParams?: { category: string; id: string };
  readonly?: boolean;
}
export default function WorkspaceMobileClient({ initialParams, readonly = false }: Props) {
  const router = useRouter();
  const { user } = useUser();
  const { status: pyStatus, runTests, runWithCustomInput } = usePyodide();
  const editorRef = useRef<any>(null);

  // ─── State ──
  const [code, setCode] = useState<string>("");

  // 📌 Her kod değişikliğinde backend'e play_count increment gönder (debounced 2s)
  const playCountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleCodeChange = useCallback((next: string) => {
    setCode(next);
    if (typeof window === "undefined") return;
    if (playCountTimerRef.current) clearTimeout(playCountTimerRef.current);
    playCountTimerRef.current = setTimeout(() => {
      const token = localStorage.getItem("token");
      if (!token) return;
      fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v2/users/me/play-count`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }, 2000);
  }, []);
  useEffect(() => {
    return () => {
      if (playCountTimerRef.current) clearTimeout(playCountTimerRef.current);
    };
  }, []);
  const [interview, setInterview] = useState<Question | null>(null);
  const [testCases, setTestCases] = useState<QuestionTests | null>(null);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  
  const [errorLines, setErrorLines] = useState<string[]>([]);
  // 📌 Default "workspace" — kullanıcı soruyu açar açmaz editörle başlar,
  //     test case'ler Testler tab'ında ayrıca erişilebilir.
  const [tab, setTab] = useState<"question" | "workspace" | "examples" | "console">("workspace");
  const [showShareModal, setShowShareModal] = useState(false);

  // ─── Guards ──
  if (!initialParams || !initialParams.category || !initialParams.id) {
    return (
      <div className="h-screen bg-[#050816] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-white/40 text-xs">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const { category, id } = initialParams;

  // Slug → ID donusumu
  let questionId = parseInt(id, 10);
  if (isNaN(questionId)) {
    // Slug ise: server page.tsx zaten ID'ye resolve etmiş olmalı (middleware de yapar)
    // Backend by-slug API zaten slug destekliyor, ID gerekmiyor
    questionId = NaN;
  }

  // ─── Effects ──
  // Hydration sonrasinda SSR content blogunu kaldir (duplicate onlemi)
  useEffect(() => {
    const els = document.querySelectorAll('[data-ssr-question]');
    els.forEach((el) => el.remove());
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const q = await questionsAPI.getById(questionId, { includeStarter: true });
        if (cancelled) return;
        setInterview(q);
        setCode(q.starter_code || "");
      } catch (e: any) {
        toast.error("Soru yüklenemedi", { description: "Bağlantını kontrol et." });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [questionId]);

  useEffect(() => {
    if (!questionId || isNaN(questionId)) return;
    let cancelled = false;
    (async () => {
      try {
        const tc = await questionsAPI.getTests(questionId);
        if (!cancelled) setTestCases(tc);
      } catch (e: any) {
        toast.error("Test caseleri yüklenemedi", { description: "Bağlantını kontrol et." });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [questionId]);

  // ─── Handlers ──
  const submitAttempt = useCallback(
    async (success: boolean, passed: number, total: number, durationMs: number) => {
      if (!user || !interview) return;
      // Supabase token'ı al (desktop sendAttempt ile aynı mantık)
      const getToken = (): string | null => {
        if (typeof window === "undefined") return null;
        try {
          const raw = localStorage.getItem("sb-pymulakat-auth-token");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.access_token) return parsed.access_token;
          }
        } catch {
          // ignore
        }
        return localStorage.getItem("token");
      };
      const token = getToken();
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v2/attempts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              question_id: questionId,
              passed_tests: passed,
              total_tests: total,
              success,
              execution_time_ms: durationMs,
              // user_code gonderilmiyor — KVKK
            }),
          }
        );
        if (!res.ok) {
          const txt = await res.text();
          console.warn("[attempt] non-2xx:", res.status, txt);
        }
      } catch (e) {
        console.warn("[attempt] fetch error:", e);
      }
    },
    [user, interview, questionId, code]
  );

  const handleRun = useCallback(async () => {
    if (readonly) return; // Salt okunur önizleme — çalıştırma yok
    if (!user) {
      const qSlug = (interview as any)?.slug || (interview?.title ? slugifyTitle(interview.title) : id);
      const redirect = encodeURIComponent(`/interviews/${category}/${qSlug}`);
      router.push(`/login?returnUrl=${redirect}&reason=guest_run_code`);
      return;
    }
    if (!testCases || running || (pyStatus !== "ready" && pyStatus !== "idle")) return;
    setRunning(true);
    setResults([]);
    setErrorLines([]);
    try {
      const result = await runTests(code, testCases.function_name, testCases.test_cases);
      setResults(result.results);
      setErrorLines(result.error_lines || []);
      const passed = result.results.filter((r: any) => r.passed).length;
      const total = result.results.length;
      const success = total > 0 && passed === total;
      await submitAttempt(success, passed, total, result.execution_ms);
      if (success) {
        setTimeout(() => setShowShareModal(true), 1500);
      }
    } catch (e: any) {
      // 📌 Raw error sızmaz — sabit hardcoded mesaj
      toast.error("Çalıştırma hatası", { description: "Kodunu gözden geçirip tekrar dene." });
    } finally {
      setRunning(false);
    }
  }, [readonly, user, testCases, running, pyStatus, runTests, code, submitAttempt, router, category, interview, id]);

  // Custom input runner — code + functionName'i kapatır, sadece args[] alır
  const handleCustomRun = useCallback(
    async (args: any[]) =>
      runWithCustomInput(code, testCases?.function_name || "", args),
    [runWithCustomInput, code, testCases?.function_name]
  );

  const handleNextQuestion = useCallback(() => {
    if (!category || !interview) return;
    const nextId = (interview.id || 0) + 1;
    const qSlug = (interview as any).slug
      || (nextId as any)?.slug
      || (interview.title ? slugifyTitle(interview.title) : String(nextId));
    router.push(`/interviews/${category}/${qSlug}`);
  }, [router, category, interview]);

  const handleBackToList = useCallback(() => {
    // 📌 SPA navigation: history varsa geri git, yoksa kategoriye dön
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    if (category) {
      router.push(`/interviews/${category}`);
    } else {
      router.push("/interviews");
    }
  }, [router, category]);

  // ─── Render: Loading — sadece interview beklenir
  if (!interview) {
    return (
      <div className="h-screen bg-[#050816] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-white/40 text-xs">Soru yükleniyor...</p>
        </div>
      </div>
    );
  }

  const isGuest = !user;

  return (
    <div className="h-screen flex flex-col bg-[#050816]">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-[#0a0e1a]">
        <button onClick={handleBackToList} className="text-[10px] text-white/60 hover:text-white">
          ← Geri
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] text-white/40 truncate">{category}</div>
          <div className="text-xs font-bold text-white truncate">{interview.title}</div>
        </div>
        {/* Tab degistirme butonlari (header'da) */}
        <div className="flex items-center gap-1 mr-1">
          <button
            onClick={() => setTab("question")}
            className={`px-2 py-1 rounded text-[10px] font-semibold ${
              tab === "question" ? "bg-white/10 text-white" : "text-white/40"
            }`}
            aria-label="Soru"
          >
            📖
          </button>
          <button
            onClick={() => setTab("examples")}
            className={`px-2 py-1 rounded text-[10px] font-semibold ${
              tab === "examples" ? "bg-white/10 text-white" : "text-white/40"
            }`}
            aria-label="Örnekler"
          >
            📋
          </button>
          <button
            onClick={() => setTab("console")}
            className={`px-2 py-1 rounded text-[10px] font-semibold ${
              tab === "console" ? "bg-white/10 text-white" : "text-white/40"
            }`}
            aria-label="Konsol"
          >
            🖨️
          </button>
        </div>
        {readonly ? (
          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/40 text-[10px] font-semibold uppercase tracking-wider" title="Salt okunur önizleme">
            👁 Önizleme
          </span>
        ) : (
          <button
            onClick={handleRun}
            disabled={running || (pyStatus !== "ready" && pyStatus !== "idle")}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-900 text-[11px] font-bold disabled:opacity-50"
          >
            {running ? "..." : "▶ Çalıştır"}
          </button>
        )}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {tab === "question" && (
          <WorkspaceSidebarMobile interview={interview} isGuest={isGuest} onLogin={handleBackToList} testCases={testCases} />
        )}

        {tab === "workspace" && (
          <div className="h-full pb-20">
            <CodeEditor ref={editorRef} value={code} onChange={handleCodeChange} height="100%" language="python" readOnly={readonly || isGuest} />
          </div>
        )}

        {tab === "console" && (
          <ConsoleTabMobile
            errorLines={errorLines}
            starterCode={interview?.starter_code || undefined}
            functionName={testCases?.function_name || undefined}
            isRunning={running}
            onCustomRun={handleCustomRun}
          />
        )}

        {tab === "examples" && (
          <ExamplesTabMobile
            testCases={testCases}
            results={results}
            isGuest={isGuest}
            category={category}
            id={id}
          />
        )}
      </div>

      {/* Bottom tab bar — SADECE workspace tab'indayken gizle (editor tam ekran kullanir) */}
      {tab !== "workspace" && (
        <div className="flex bg-[#0a0e1a]">
          {(["question", "workspace", "examples", "console"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`flex-1 py-2 text-[10px] font-semibold ${
                tab === k ? "text-white border-t-2 border-amber-500" : "text-white/40"
              }`}
            >
              {k === "question"
                ? "Soru"
                : k === "workspace"
                ? "Editör"
                : k === "examples"
                ? `Örnekler (${testCases?.test_cases.length ?? 0})`
                : "🖨️ Konsol"}
            </button>
          ))}
        </div>
      )}

      {/* Share modal placeholder */}
      {showShareModal && (
        <ShareModal
          title={interview.title}
          code={code}
          questionId={questionId}
          category={category}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Share Modal (basit versiyon)
// ═══════════════════════════════════════════════════════════

function ShareModal({
  title,
  code,
  questionId,
  category,
  onClose,
}: {
  title: string;
  code: string;
  questionId: number;
  category: string;
  onClose: () => void;
}) {
  const slug = (questionId as any)?.slug || slugifyTitle(title);
  const shareUrl = `https://pythonmulakat.com/interviews/${category}/${slug}`;

  const tweetText = `✅ ${title} çözdüm!\n\n${code.split("\n").slice(0, 6).join("\n")}\n\n${shareUrl} #python #mülakat`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#0a0e1a] border border-white/10 rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-2">Çözümünü Paylaş!</h3>
        <p className="text-white/60 text-sm mb-4">{title}</p>
        <div className="space-y-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full p-3 rounded-lg bg-[#1DA1F2] text-white text-center font-bold"
          >
            Twitter'da Paylaş
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              toast.success("Link kopyalandı!");
            }}
            className="block w-full p-3 rounded-lg bg-white/5 text-white text-center"
          >
            Linki Kopyala
          </button>
        </div>
        <button onClick={onClose} className="mt-3 w-full text-white/40 text-sm">
          Kapat
        </button>
      </motion.div>
    </motion.div>
  );
}
function ConsoleTabMobile({
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
  // ── Yardımcılar (desktop ConsoleTab ile aynı parser) ──
  const params = parseFunctionSignature(starterCode || "", functionName || "");
  const [inputs, setInputs] = useState<string[]>(
    Array.from({ length: params.length }, () => "")
  );
  const [result, setResult] = useState<any>(undefined);
  const [resultError, setResultError] = useState<string | null>(null);
  const [localRunning, setLocalRunning] = useState(false);

  const handleRun = async () => {
    if (!onCustomRun) return;
    setLocalRunning(true);
    setResult(undefined);
    setResultError(null);
    try {
      const parsed = inputs.map((raw) => parseUserInput(raw));
      const r = await onCustomRun(parsed);
      setResult(r.actual);
      setResultError(r.errorLine || null);
    } catch {
      setResultError("Çalıştırma hatası");
    } finally {
      setLocalRunning(false);
    }
  };

  return (
    <div className="p-3 space-y-3 h-full overflow-y-auto">
      {/* ── Custom Input paneli (mobil) ── */}
      {params.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] uppercase tracking-wider text-white/60 font-bold">
              🧪 Kendi Input'unla Dene
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
                <span className="text-[9px] text-white/30 font-mono">{p.placeholder}</span>
              </div>
              <input
                type="text"
                value={inputs[idx] || ""}
                onChange={(e) => {
                  const next = [...inputs];
                  next[idx] = e.target.value;
                  setInputs(next);
                }}
                placeholder={p.placeholder}
                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs font-mono text-white placeholder-white/20 focus:border-indigo-500/50 outline-none"
              />
            </div>
          ))}
          <button
            onClick={handleRun}
            disabled={localRunning || isRunning || !onCustomRun}
            className="w-full mt-1 py-2 rounded bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold hover:bg-indigo-500/30 disabled:opacity-40"
          >
            {localRunning ? "⏳ Çalışıyor..." : "▶ Çalıştır"}
          </button>

          {/* ── Sonuç ── */}
          {result !== undefined && (
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-emerald-400/80 font-bold">
                ✓ Sonuç
              </div>
              <pre className="text-xs font-mono text-emerald-300 bg-emerald-500/5 p-2 rounded border border-emerald-500/20 overflow-x-auto">
                {formatValue(result)}
              </pre>
            </div>
          )}
          {resultError && (
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-rose-400/80 font-bold">
                ✗ Hata
              </div>
              <pre className="text-xs font-mono text-rose-300 bg-rose-500/10 p-2 rounded border border-rose-500/30 overflow-x-auto">
                {resultError}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* ── Run Tests'ten gelen traceback ── */}
      {errorLines.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] uppercase tracking-wider text-rose-400/80 font-bold">
              ⚠ Traceback
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

      {/* Boş durum (parametre yok + hata yok) */}
      {params.length === 0 && errorLines.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 text-white/30 py-12">
          <div className="text-3xl">✅</div>
          <p className="text-sm">Kodun hatasız çalışıyor.</p>
          <p className="text-[10px] text-white/20 text-center px-4">
            Buraya Custom Input sonuçları veya hata traceback düşer.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Examples Tab (mobil) — Input | Expected | Actual + 3 modlu render ───
function ExamplesTabMobile({
  testCases,
  results,
  isGuest,
  category,
  id,
}: {
  testCases: QuestionTests | null;
  results: any[];
  isGuest: boolean;
  category: string;
  id: string;
}) {
  if (!testCases || testCases.test_cases.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 text-white/30 px-4 py-12">
        {isGuest ? (
          <>
            <p className="text-xs">Test caseleri üyelikle erişilebilir.</p>
            <a
              href={`/login?returnUrl=${encodeURIComponent(`/interviews/${category}/${id}`)}`}
              className="text-xs px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              Giriş Yap
            </a>
          </>
        ) : (
          <p className="text-xs">Bu soru için örnek test case bulunmuyor.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3 pb-20 overflow-y-auto h-full">
      {testCases.test_cases.map((tc: TestCase, idx: number) => {
        const result = results[idx];
        const hasRun = result !== undefined;
        const isError = hasRun && !!result.errorCategory;
        const isLogicFail = hasRun && !result.passed && !isError;

        return (
          <div
            key={idx}
            className={`p-3 rounded-lg border ${
              hasRun
                ? result.passed
                  ? "bg-green-500/5 border-green-500/30"
                  : "bg-red-500/5 border-red-500/30"
                : "bg-white/5 border-white/10"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                Örnek #{idx + 1}
              </span>
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
                    {result.passed ? "✓" : isError ? "✗ Hata" : "✗ Yanlış"}
                  </span>
                )}
              </div>
            </div>

            {/* Input */}
            <div className="mb-2">
              <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1 font-bold">
                📥 Input
              </div>
              <pre className="text-[11px] font-mono text-white/80 bg-black/30 p-2 rounded overflow-x-auto border">
                {formatValue(tc.input)}
              </pre>
            </div>

            {/* HATA: traceback son satırı */}
            {isError && (
              <div className="mb-2">
                <div className="text-[10px] uppercase tracking-wider text-rose-400/80 mb-1 font-bold">
                  ⚠ Traceback
                </div>
                <pre className="text-[11px] font-mono text-rose-300 bg-rose-500/10 p-2 rounded overflow-x-auto border border-rose-500/30">
                  {result.errorLine || "Bilinmeyen hata"}
                </pre>
              </div>
            )}

            {/* Expected (her zaman gösterilir) */}
            <div>
              <div className="text-[10px] uppercase tracking-wider text-emerald-400/80 mb-1 font-bold">
                ✓ Expected
              </div>
              <pre className="text-[11px] font-mono text-emerald-300 bg-emerald-500/5 p-2 rounded overflow-x-auto border border-emerald-500/20 min-h-[2rem]">
                {formatValue(tc.expected)}
              </pre>
            </div>

            {isLogicFail && (
              <div className="mt-2 space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-rose-400/80 font-bold">
                  ✗ Actual (senin kodun)
                </div>
                <pre className="text-[11px] font-mono text-rose-300 bg-rose-500/5 p-2 rounded overflow-x-auto border border-rose-500/20 min-h-[2rem]">
                  {formatValue(result.actual)}
                </pre>
                <div className="text-[10px] text-amber-300/80 italic px-1">
                  💡 Return değeri beklenenle eşleşmiyor — yukarıdaki Actual, senin kodun bu test için ne döndüğü.
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
// (formatValue + parseUserInput + parseFunctionSignature components/parsePython.ts'ten import)
