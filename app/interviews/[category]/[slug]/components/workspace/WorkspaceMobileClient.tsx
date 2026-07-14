"use client";
import { Lock, Printer, Rocket, PartyPopper, ListTree, BookOpen, AlertTriangle, Code2, TestTube, Terminal, Sparkles } from "lucide-react";
import { errorMessage } from "@/lib/errorMessage";
import { getCategoryUrl } from "@/lib/categorySlug";

// WorkspaceMobileClient — Mobile workspace orchestrator (refactored).
//
// 📌 Code splitting (2026-07-11) sonrası bu dosya artık SADECE orchestrator.
//   - State yönetimi (interview, testCases, code, results, vs.)
//   - Side-effect'ler (data fetch, attempt submit, editor layout, hydration fix)
//   - 3 modülü compose (CodeEditor, TestPanel, QuestionDescriptionPanel)
//
//   Eski inline ConsoleTab/ResultModal/ExamplesTab → components/workspace/TestPanel'e taşındı.
//   CodeEditor → lazy load (Pyodide ağırlığı izole).

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import { usePyodide } from "@/hooks/usePyodide";
import { questionsAPI, Question, QuestionTests } from "@/lib/api";
import { slugifyTitle } from "@/lib/questionMeta";
import { GuestBanner } from "@/components/GuestBanner";
import { submitAttempt as submitAttemptAPI, incrementPlayCount } from "@/lib/api/authAPI";
import type { CodeEditorRef } from "@/components/CodeEditor";
import CodeEditorPanel from "./CodeEditor";
import QuestionDescriptionPanel from "./QuestionDescriptionPanel";
import TestPanel, { ConsoleView } from "./TestPanel";
import AiFeedbackView from "./AiFeedbackView";

export const dynamic_ = "force-dynamic";

type Tab = "question" | "editor" | "examples" | "customInput" | "feedback";

interface Props {
  initialParams?: { category: string; id: string };
  readonly?: boolean;
  initialInterview?: Question | null;
  initialTestCases?: QuestionTests | null;
  hasStudy?: boolean;
  categoryLabel?: string;
}

// ─── Main Component ───────────────────────────────────────
// 📌 Code splitting sonrası: sadece state + orchestration. UI modüllerde.
export default function WorkspaceMobileClient({
  initialParams,
  readonly = false,
  initialInterview = null,
  initialTestCases = null,
  hasStudy = false,
  categoryLabel,
}: Props) {
  const router = useRouter();
  const { user } = useUser();
  const { status: pyStatus, runTests, runWithCustomInput } = usePyodide();
  // 📌 Ref pattern — Monaco.tsx'teki stabil versiyonla uyumlu.
  // CodeEditorRef typed ref + son bilinen kodu tutan fallback ref.
  // Imperative API çağrıları (layout/focus) için stabil referans.
  const editorRef = useRef<CodeEditorRef | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const lastExternalCodeRef = useRef<string>(initialInterview?.starter_code || "");

  // ─── State ──
  const [code, setCode] = useState<string>(initialInterview?.starter_code || "");

  // 📌 Her kod değişikliğinde backend'e play_count increment gönder (debounced 2s)
  const playCountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleCodeChange = useCallback((next: string) => {
    setCode(next);
    if (typeof window === "undefined") return;
    if (playCountTimerRef.current) clearTimeout(playCountTimerRef.current);
    playCountTimerRef.current = setTimeout(() => {
      // authAPI.incrementPlayCount — typed + auth header otomatik (lib/api/authAPI.ts)
      incrementPlayCount().catch(() => {/* silent fail */});
    }, 2000);
  }, []);
  useEffect(() => {
    return () => {
      if (playCountTimerRef.current) clearTimeout(playCountTimerRef.current);
    };
  }, []);
  // 📌 lastExternalCodeRef'i code state ile senkronla — imperative API fallback.
  useEffect(() => {
    lastExternalCodeRef.current = code;
  }, [code]);

  const [interview, setInterview] = useState<Question | null>(initialInterview);
  const [testCases, setTestCases] = useState<QuestionTests | null>(initialTestCases);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [errorLines, setErrorLines] = useState<string[]>([]);
  // 2026-07-14: AI Feedback trigger — ilk Run sonrası enable olur
  const [hasRunOnce, setHasRunOnce] = useState(false);
  // 📌 Default "editor" — kullanıcı soruyu açar açmaz editörle başlar,
  //     test/feedback ayrı alt tab'larda.
  const [tab, setTab] = useState<Tab>("editor");
  const [resultModal, setResultModal] = useState<{ results: any[]; errorLines: string[]; passed: number; total: number } | null>(null);

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
  // Slug veya ID — slug ise by-slug API, ID ise by-id API kullan
  const isNumericId = /^\d+$/.test(id);
  const questionSlugOrId = isNumericId ? null : id;
  let questionId = isNumericId ? parseInt(id, 10) : 0;

  // ─── Effects ──
  // Hydration sonrasinda SSR content blogunu kaldir (duplicate onlemi).
  // 📌 Android cursor fix: SSR block sayfanın başında yer aldığı için scroll
  //    konumu eski yerinde kalabiliyor — kullanıcı farklı yere tıklıyor.
  //    Scroll'u sıfırla, editör konumuyla tıklama koordinatı eşleşsin.
  useEffect(() => {
    const els = document.querySelectorAll('[data-ssr-question]');
    els.forEach((el) => el.remove());
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  // 📌 Monaco cursor/tıklama konumu fix: container boyutu her değiştiğinde
  //    (klavye aç/kapa, tab değişimi, orientation change) editor.layout()
  //    çağırarak Monaco'nun iç hit-test tablosunu güncel tut. layout()
  //    çağrılmazsa Monaco eski boyutlara göre koordinat hesaplayıp cursor'ı
  //    kullanıcının dokunduğu yerden farklı bir satır/sütuna koyabiliyor.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = editorContainerRef.current;
    if (!container) return;

    let rafId = 0;
    const relayout = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        try {
          if (editorRef.current && typeof editorRef.current.layout === "function") {
            editorRef.current.layout();
          }
        } catch {
          // Monaco henüz mount olmamış olabilir — sessizce yut
        }
      });
    };

    const ro = new ResizeObserver(() => relayout());
    ro.observe(container);
    window.addEventListener("orientationchange", relayout);
    window.visualViewport?.addEventListener("resize", relayout);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("orientationchange", relayout);
      window.visualViewport?.removeEventListener("resize", relayout);
    };
  }, [tab]);

  useEffect(() => {
    // DB-FIRST mimari: SSR'dan gelen initial data varsa skip
    if (initialInterview) return;
    let cancelled = false;
    (async () => {
      try {
        // Slug ise by-slug API, ID ise by-id API kullan
        const q = questionSlugOrId
          ? await questionsAPI.getBySlug(category, questionSlugOrId, { includeStarter: true })
          : await questionsAPI.getById(questionId, { includeStarter: true });
        if (cancelled) return;
        if (!q) {
          toast.error("Soru bulunamadı");
          return;
        }
        setInterview(q);
        setCode(q.starter_code || "");
        if (q.id) questionId = q.id;
      } catch (e) {
        if (!cancelled) toast.error("Soru yüklenemedi", { description: "Bağlantını kontrol et." });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [questionId, category, questionSlugOrId]);

  useEffect(() => {
    // DB-FIRST mimari: SSR'dan gelen initial testCases varsa skip
    if (initialTestCases) return;
    if (!questionId || isNaN(questionId)) return;
    let cancelled = false;
    (async () => {
      try {
        const tc = await questionsAPI.getTests(questionId);
        if (!cancelled) setTestCases(tc);
      } catch (e) {
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
      // authAPI.submitAttempt — typed + auth header otomatik (lib/api/authAPI.ts)
      // Token varlığını lib/auth.ts üzerinden kontrol et
      const { getAccessToken } = await import("@/lib/auth");
      const token = getAccessToken();
      if (!token) return;
      try {
        await submitAttemptAPI({
          question_id: questionId,
          passed_tests: passed,
          total_tests: total,
          success,
          execution_time_ms: durationMs,
        });
      } catch (e) {;
      }
    },
    [user, interview, questionId, code]
  );

  const handleRun = useCallback(async () => {
    if (readonly) return; // Salt okunur önizleme — çalıştırma yok
    // 📌 Misafire kod çalıştırma yok — GuestEditorGate zaten editor'i gizliyor.
    if (!user) return;  // hard stop (UI'da misafir Run butonunu bile görmez)
    if (!testCases || running || (pyStatus !== "ready" && pyStatus !== "idle")) return;
    setRunning(true);
    setResults([]);
    setErrorLines([]);
    setHasRunOnce(true); // AI Feedback butonu enable
    try {
      const result = await runTests(code, testCases.function_name, testCases.test_cases);
      setResults(result.results);
      setErrorLines(result.error_lines || []);
      const passed = result.results.filter((r: any) => r.passed).length;
      const total = result.results.length;
      const success = total > 0 && passed === total;
      await submitAttempt(success, passed, total, result.execution_ms);
      // Sonuç modal'ı aç (success/fail comparison)
      setResultModal({ results: result.results, errorLines: result.error_lines || [], passed, total });
    } catch (e) {
      // 📌 Raw error sızmaz — sabit hardcoded mesaj
      toast.error("Çalıştırma hatası", { description: "Kodunu gözden geçirip tekrar dene." });
    } finally {
      setRunning(false);
    }
  }, [readonly, user, testCases, running, pyStatus, runTests, code, submitAttempt, category, interview, id]);

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
    // 📌 Android soft keyboard fix: 100dvh (dynamic viewport height), 100vh fallback.
    //    100vh layout viewport'a sabit — soft keyboard açılınca görsel alan
    //    küçülüyor ama container aynı kalıyor; Monaco hit-test'i yanlış
    //    koordinata düşüp cursor'ü istenmeyen yere koyuyordu.
    <div className="h-[100dvh] flex flex-col bg-[#050816] overflow-hidden">
      {(readonly || isGuest) && <GuestBanner feature="kod çalıştırma" />}

      {/* 📌 Gerçek SSR içerik bloğu — crawler/SEO için ilk HTML'de mevcut,
          hydration sonrası yukarıdaki useEffect tarafından kaldırılır. */}
      {initialInterview && (
        <div data-ssr-question className="sr-only" aria-hidden="true">
          <h1>{initialInterview.title}</h1>
          {(initialInterview as any).description && (
            <p>{(initialInterview as any).description}</p>
          )}
        </div>
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-[#0a0e1a]">
        <button onClick={handleBackToList} className="text-[10px] text-white/60 hover:text-white">
          ← Geri
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] text-white/40 truncate">{category}</div>
          <div className="text-xs font-bold text-white truncate">{interview.title}</div>
        </div>
        {/* Üst toggle: Soru (📖) ↔ Editör (🖥️). Diğer 3 tab alt nav'da. */}
        <div className="flex items-center gap-1 mr-1">
          <button
            onClick={() => setTab("question")}
            className={`px-2 py-1 rounded text-[10px] font-semibold ${
              tab === "question" ? "bg-white/10 text-white" : "text-white/40"
            }`}
            aria-label="Soru"
            title="Soru açıklaması"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTab("editor")}
            className={`px-2 py-1 rounded text-[10px] font-semibold ${
              tab === "editor" ? "bg-white/10 text-white" : "text-white/40"
            }`}
            aria-label="Editör"
            title="Kod editörü"
          >
            <Code2 className="w-3.5 h-3.5" />
          </button>
        </div>
        {readonly ? null : isGuest ? (
          <Link
            href={`/login?returnUrl=${encodeURIComponent(`/interviews/${category}/${id}`)}`}
            className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-[11px] font-bold hover:bg-indigo-400 transition-colors"
            title="Giriş yapıp kodu çalıştır"
          >
            <Lock className="w-4 h-4 inline" /> Giriş Yap & Çalıştır
          </Link>
        ) : (
          <button
            onClick={handleRun}
            disabled={running || pyStatus === "loading" || (pyStatus !== "ready" && pyStatus !== "idle")}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-900 text-[11px] font-bold disabled:opacity-50 flex items-center gap-1.5"
          >
            {pyStatus === "loading" ? (
              <>
                <span className="w-3 h-3 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                Yükleniyor…
              </>
            ) : running ? (
              "..."
            ) : (
              "▶ Çalıştır"
            )}
          </button>
        )}
      </div>

      {/* Tab content — modülleri compose */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {tab === "question" && (
          <div className="flex-1 overflow-y-auto">
            <QuestionDescriptionPanel
              interview={interview}
              category={category}
              id={id}
              testCases={testCases}
              isGuest={isGuest}
              hintsList={[]}
              revealedHints={0}
              onRevealHint={() => undefined}
              hasStudy={hasStudy}
              variant="mobile"
            />
          </div>
        )}

        {tab === "editor" && (
          <>
            {/* Mobilde editör — kalan tüm dikey alan, Pyodide yüklenene kadar
                placeholder spinner göster. min-h 320px kaldırıldı, ekrana tam
                sığması için flex-1 + min-h-0. */}
            <div
              ref={editorContainerRef}
              className="flex-1 min-h-0 flex-shrink min-w-0 overflow-hidden relative"
              style={{ touchAction: "manipulation" }}
            >
              {/* 2026-07-14 fix v2: Pyodide placeholder KALDIRILDI.
                  Önceki placeholder opak/yarı saydam olunca editör + starter code
                  görünmüyordu. Şimdi:
                  - Editör her zaman mount olur, code her zaman görünür
                  - Pyodide runtime 'Run Tests' için gerekli, ayrı yüklenir
                  - Loading state Run butonunda (pyStatus === "loading" iken spinner)
                  - Starter code her zaman editöre yüklenir (Pyodide'dan bağımsız) */}
              <CodeEditorPanel
                editorRef={editorRef}
                value={code}
                onChange={handleCodeChange}
                language="python"
                height="100%"
                readOnly={readonly || isGuest}
              />
            </div>
            {/* 2026-07-14 v3: Test paneli editör sayfasında YOK.
                Örnekler/Custom Input/Feedback alt tab'lardan erişilir. */}
          </>
        )}

        {tab === "examples" && (
          <div className="flex-1 overflow-y-auto">
            <TestPanel
              variant="mobile"
              testCases={testCases}
              testResults={results}
              isRunning={running}
              pyStatus={pyStatus}
              isGuest={isGuest}
              category={category}
              id={id}
              onRun={handleRun}
              starterCode={interview?.starter_code || undefined}
              onCustomRun={handleCustomRun}
              errorLines={errorLines}
            />
          </div>
        )}

        {tab === "customInput" && (
          <div className="flex-1 overflow-y-auto">
            {interview?.starter_code ? (
              <ConsoleView
                errorLines={errorLines}
                starterCode={interview.starter_code}
                functionName={testCases?.function_name}
                isRunning={running}
                onCustomRun={handleCustomRun}
              />
            ) : (
              <div className="p-4 text-center text-white/50 text-xs">
                Bu soru için custom input mevcut değil.
              </div>
            )}
          </div>
        )}

        {tab === "feedback" && (
          <div className="flex-1 overflow-y-auto p-3">
            <AiFeedbackView
              isGuest={isGuest}
              hasRunOnce={hasRunOnce}
              code={code}
              questionTitle={interview?.title || ""}
              questionDescription={interview?.description}
              testResults={results}
            />
          </div>
        )}
      </div>

      {/* Bottom tab bar — SADECE workspace tab'indayken gizle (editor tam ekran kullanir) */}
      {/* 2026-07-14 v3: Alt nav — 4 tab: Editör / Örnekler / Custom Input / Feedback.
          Soru üst bar'da (header toggle). Alt nav sabit, viewport'un altında. */}
      <div className="flex bg-[#0a0e1a] border-t border-white/10 flex-shrink-0">
        <button
          onClick={() => setTab("editor")}
          className={`flex-1 py-2.5 text-[10px] font-semibold flex flex-col items-center gap-0.5 transition-colors ${
            tab === "editor" ? "text-amber-300 border-t-2 border-amber-500 -mt-px" : "text-white/40"
          }`}
        >
          <Code2 className="w-4 h-4" />
          Editör
        </button>
        <button
          onClick={() => setTab("examples")}
          className={`flex-1 py-2.5 text-[10px] font-semibold flex flex-col items-center gap-0.5 transition-colors ${
            tab === "examples" ? "text-amber-300 border-t-2 border-amber-500 -mt-px" : "text-white/40"
          }`}
        >
          <TestTube className="w-4 h-4" />
          Örnekler
        </button>
        <button
          onClick={() => setTab("customInput")}
          className={`flex-1 py-2.5 text-[10px] font-semibold flex flex-col items-center gap-0.5 transition-colors ${
            tab === "customInput" ? "text-amber-300 border-t-2 border-amber-500 -mt-px" : "text-white/40"
          }`}
        >
          <Terminal className="w-4 h-4" />
          Custom Input
        </button>
        <button
          onClick={() => setTab("feedback")}
          // 2026-07-14 v5: AI feedback geçici disabled (backend deploy).
          //   Akşam geri açılacak. Tab görünür ama tıklanamaz.
          disabled
          title="AI feedback geçici olarak devre dışı (akşam açılacak)"
          className={`flex-1 py-2.5 text-[10px] font-semibold flex flex-col items-center gap-0.5 transition-colors opacity-40 cursor-not-allowed ${
            tab === "feedback" ? "text-amber-300 border-t-2 border-amber-500 -mt-px" : "text-white/40"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Feedback
        </button>
      </div>

      {/* Sonuç Modalı — success/fail + comparison */}
      {resultModal && (
        <ResultModal
          results={resultModal.results}
          errorLines={resultModal.errorLines}
          passed={resultModal.passed}
          total={resultModal.total}
          onClose={() => setResultModal(null)}
        />
      )}
    </div>
  );
}

// ─── Sonuç Modal — success/fail + comparison ────────────────
// Mobil-specific — desktop'taki modallar farklı. Test panel sonuçlarını
// mobil için full-screen modal'da göster.
function ResultModal({
  results,
  errorLines,
  passed,
  total,
  onClose,
}: {
  results: any[];
  errorLines: string[];
  passed: number;
  total: number;
  onClose: () => void;
}) {
  const success = total > 0 && passed === total;
  const failedCases = results.filter((r: any) => !r.passed);
  // formatValue parsePython'dan — import etmek yerine inline minimal versiyon
  const fmt = (v: any): string => {
    if (v === undefined) return "undefined";
    if (v === null) return "null";
    if (typeof v === "string") return v;
    try { return JSON.stringify(v, null, 2); } catch { return String(v); }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className={`bg-[#0a0e1a] border ${success ? "border-emerald-500/30" : "border-rose-500/30"} rounded-2xl p-5 max-w-md w-full max-h-[85vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <div className="text-5xl mb-2">{success ? "🎉" : "⚠️"}</div>
          <h3 className={`text-xl font-bold ${success ? "text-emerald-300" : "text-rose-300"}`}>
            {success ? "Tebrikler!" : "Testler Başarısız"}
          </h3>
          <p className="text-sm text-white/60 mt-1">
            {passed}/{total} test geçti
          </p>
        </div>

        {failedCases.length > 0 && (
          <div className="space-y-2 mb-4">
            <div className="text-[10px] uppercase tracking-wider text-white/40 font-bold">
              Başarısız Testler ({failedCases.length})
            </div>
            {failedCases.map((r, idx) => (
              <div key={idx} className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 text-xs space-y-1">
                <div className="text-white/80 font-mono">{r.description || `Test #${idx + 1}`}</div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <div className="text-[9px] text-emerald-300/70 font-bold uppercase">Beklenen</div>
                    <pre className="text-emerald-300 bg-emerald-500/5 p-1.5 rounded overflow-x-auto font-mono">
                      {fmt(r.expected)}
                    </pre>
                  </div>
                  <div>
                    <div className="text-[9px] text-rose-300/70 font-bold uppercase">Çıktın</div>
                    <pre className="text-rose-300 bg-rose-500/10 p-1.5 rounded overflow-x-auto font-mono">
                      {r.error || (r.actual === undefined ? "(boş)" : fmt(r.actual))}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {errorLines.length > 0 && (
          <div className="space-y-2 mb-4">
            <div className="text-[10px] uppercase tracking-wider text-rose-400/80 font-bold">
              ⚠ Hata Traceback
            </div>
            <pre className="text-[11px] font-mono text-rose-200 bg-rose-500/10 border border-rose-500/30 p-2 rounded overflow-x-auto whitespace-pre-wrap">
              {errorLines.join("\n")}
            </pre>
          </div>
        )}

        <button
          onClick={onClose}
          className={`w-full py-2.5 rounded-lg font-bold text-sm ${success ? "bg-emerald-500 text-slate-950" : "bg-white/10 text-white hover:bg-white/20"}`}
        >
          {success ? "Harika, devam et 🚀" : "Tekrar Dene"}
        </button>
      </div>
    </div>
  );
}
