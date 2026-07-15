"use client";
import { Lock } from "lucide-react";
import { errorMessage } from "@/lib/errorMessage";
import { getCategoryUrl } from "@/lib/categorySlug";

// WorkspaceClient — desktop orchestrator (refactored).
//
// 📌 Code splitting (2026-07-11) sonrası bu dosya artık SADECE orchestrator:
//   - State yönetimi (interview, testCases, code, testResults, vs.)
//   - Side-effect'ler (data fetch, attempt submit, timer)
//   - 3 modülü compose (CodeEditor, TestPanel, QuestionDescriptionPanel)
//
// Asıl UI render modüllerde → components/workspace/*
// Mobil için: ./WorkspaceMobileClient

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import { useCodeRunner } from "@/hooks/useCodeRunner";
import { CodeEditorRef } from "@/components/CodeEditor";
import { GuestBanner } from "@/components/GuestBanner";
import { questionsAPI, Question, QuestionTests } from "@/lib/api";
import { useHints } from "@/lib/hints";
import CodeShareModal from "@/components/CodeShareModal";
import WorkspaceHeader from "../WorkspaceHeader";
import CodeEditorPanel from "./CodeEditor";
import QuestionDescriptionPanel from "./QuestionDescriptionPanel";
import TestPanel from "./TestPanel";
import { submitAttempt as submitAttemptAPI, incrementPlayCount } from "@/lib/api/authAPI";

// ─── Constants ────────────────────────────────────────────
const LEVEL_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  beginner: { label: "Başlangıç", color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.25)" },
  intermediate: { label: "Orta", color: "#facc15", bg: "rgba(250,204,21,0.08)", border: "rgba(250,204,21,0.25)" },
  advanced: { label: "İleri", color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)" },
  başlangıç: { label: "Başlangıç", color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.25)" },
  orta: { label: "Orta", color: "#facc15", bg: "rgba(250,204,21,0.08)", border: "rgba(250,204,21,0.25)" },
  ileri: { label: "İleri", color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)" },
};

interface Props {
  initialParams: { category: string; id: string };
  readonly?: boolean;
  initialInterview?: Question | null;
  initialTestCases?: QuestionTests | null;
  hasStudy?: boolean;
  categoryLabel?: string;
}

interface AttemptPayload {
  question_id: number;
  // 📌 user_code KALDIRILDI — KVKK uyumu
  // Sandbox client-side (Pyodide), kod server'a gonderilmiyor
  passed_tests: number;
  total_tests: number;
  success: boolean;
  execution_time_ms: number;
  hints_used: number;
}

// ─── Main Component ───────────────────────────────────────
// 📌 Code splitting sonrası: sadece state + orchestration. UI modüllerde.
export default function WorkspaceClient({
  initialParams,
  initialInterview: initialInterviewProp,
  initialTestCases: initialTestCasesProp,
  hasStudy = false,
  categoryLabel,
}: Props) {
  // ✅ Guard
  if (!initialParams || !initialParams.category || !initialParams.id) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const { category, id } = initialParams;
  // Slug veya ID — slug ise önce by-slug API ile soruyu çek (ID'yi oradan al)
  const isNumericId = /^\d+$/.test(id);
  const questionSlugOrId = isNumericId ? null : id;
  let questionId = isNumericId ? parseInt(id, 10) : 0;

  // Hooks
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  // 2026-07-15: useCodeRunner — language dispatch (Pyodide Python + Web Worker JS)
  const runner = useCodeRunner();
  const {
    language,
    setLanguage,
    status: pyStatus,
    runTests,
    runWithCustomInput,
  } = runner;
  const editorRef = useRef<CodeEditorRef>(null);

  // State
  // 📌 SSR'dan gelen initial değerlerle başlat — misafirler de test case'leri görsün,
  //    ilk fetch'te flicker olmasın.
  const [interview, setInterview] = useState<Question | null>(initialInterviewProp ?? null);
  const [testCases, setTestCases] = useState<QuestionTests | null>(initialTestCasesProp ?? null);
  const [code, setCode] = useState(initialInterviewProp?.starter_code || "");

  // Custom input runner — EditorProps args[] veriyor, onu string'e cevirip
  // useCodeRunner.runWithCustomInput(code, input, functionName) signature'ina
  // uygun hale getiriyoruz.
  const handleCustomRun = useCallback(
    async (args: any[]) =>
      runWithCustomInput(code, testCases?.function_name || "", Array.isArray(args) ? args.join(" ") : String(args ?? "")),
    [runWithCustomInput, code, testCases?.function_name]
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const [testResults, setTestResults] = useState<TestRunResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [errorLines, setErrorLines] = useState<string[]>([]);
  const [attemptSubmitted, setAttemptSubmitted] = useState(false);
  // 2026-07-14: Run en az 1 kez çağrıldı mı? (AI Feedback trigger)
  const [hasRunOnce, setHasRunOnce] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Hint state (paylaşılan hook)
  const { hintsList, revealedHints, onRevealHint } = useHints(interview);

  // Refs — race-safe attempt submit + cleanup-able share modal timer
  const inFlightRef = useRef(false);
  const shareTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Hydration sonrasinda SSR content blogunu kaldir (duplicate onlemi).
  // 📌 Scroll sıfırla: SSR block başta yer aldığı için kullanıcı scroll konumu
  //    editörün koordinatlarıyla eşleşmeyebiliyor; cursor yerleşimi kayıyordu.
  useEffect(() => {
    const els = document.querySelectorAll('[data-ssr-question]');
    els.forEach((el) => el.remove());
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  // Cleanup share modal timer on unmount (React strict mode + route change)
  useEffect(() => {
    return () => {
      if (shareTimerRef.current) clearTimeout(shareTimerRef.current);
    };
  }, []);

  // Load question + test cases
  // 📌 DB-FIRST mimari: initialInterview SSR'dan geldiyse (API'den) skip et.
  //    Backend by-slug 404 dönerse client-side fetch'e düş.
  useEffect(() => {
    // DB-FIRST: initial data zaten varsa backend'e gitme
    if (initialInterviewProp || initialTestCasesProp) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        // Slug ise by-slug API, ID ise by-id API kullan
        const q = questionSlugOrId
          ? await questionsAPI.getBySlug(category, questionSlugOrId, { includeStarter: true })
          : await questionsAPI.getById(questionId, { includeStarter: true });
        if (cancelled) return;

        if (!q) {
          setError("Soru bulunamadı");
          return;
        }
        setInterview(q);
        if (q.starter_code) setCode(q.starter_code);
        // ID'yi sonradan set et ki submitAttempt'ta kullanabilelim
        if (q.id) questionId = q.id;

        // Test case'leri arka planda yükle (crash etmesin, soru zaten geldi)
        try {
          const tc = await questionsAPI.getTests(questionId);
          if (!cancelled && tc) setTestCases(tc);
        } catch (tcErr) {;
        }
      } catch (e) {
        if (!cancelled) setError("Soru yüklenemedi — bağlantını kontrol et.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [questionId, category, questionSlugOrId]);

  // Submit attempt when all tests pass
  const submitAttempt = useCallback(
    async (success: boolean, passedTests: number, totalTests: number, executionMs: number) => {
      // 🚦 Race-safe: eş zamanlı çift submit engeli (in-flight ref)
      if (inFlightRef.current) return;
      inFlightRef.current = true;

      const payload: AttemptPayload = {
        question_id: questionId,
        // user_code gonderilmiyor — KVKK
        passed_tests: passedTests,
        total_tests: totalTests,
        success,
        execution_time_ms: executionMs,
        hints_used: revealedHints,
      };
      try {
        await sendAttempt(payload);
        setAttemptSubmitted(true);
        if (success) {
          // Önceki timer varsa iptal et, yenisi kur
          if (shareTimerRef.current) clearTimeout(shareTimerRef.current);
          shareTimerRef.current = setTimeout(() => setShowShareModal(true), 1500);
        } else {
          toast.error("Bazı testler başarısız", {
            description: "Kodunu gözden geçirip tekrar dene.",
          });
        }
      } catch (e) {;
        toast.error("Attempt kaydedilemedi", {
          description: errorMessage(e) || "Token veya sunucu hatası olabilir.",
        });
      } finally {
        inFlightRef.current = false;
      }
    },
    [attemptSubmitted, questionId, code, revealedHints]
  );

  // Run tests
  const handleRun = useCallback(async () => {
    // 📌 Misafire kod çalıştırma yok — GuestEditorGate zaten editor'i gizliyor;
    // burasi son savunma. Return-ile sessizce cik, redirect yapma (state tutarliligi).
    if (!user) return;
    if (isRunning || (pyStatus !== "ready" && pyStatus !== "idle") || !testCases) return;
    setIsRunning(true);
    setTestResults([]);
    setErrorLines([]);
    setAttemptSubmitted(false); // her Run'da sıfırla — eski attempt state'i yutmasın
    setHasRunOnce(true); // AI Feedback butonu enable olsun
    try {
      const result = await runTests(code, testCases.function_name, testCases.test_cases);
      setTestResults(result.results);
      setErrorLines(result.error_lines || []);
      const passed = result.results.filter((r) => r.passed).length;
      const total = result.results.length;
      const success = total > 0 && passed === total;
      await submitAttempt(success, passed, total, result.execution_ms);
      if (success) {
        // Tüm testler geçti → paylaşım modalı (1.5 sn gecikmeyle daha okunaklı)
        setTimeout(() => setShowShareModal(true), 1500);
      }
    } catch (e) {
      // 📌 Raw error sızmaz — sabit hardcoded mesaj
      toast.error("Çalıştırma hatası", { description: "Kodunu gözden geçirip tekrar dene." });
    } finally {
      setIsRunning(false);
    }
  }, [user, isRunning, pyStatus, testCases, code, runTests, submitAttempt, category, id]);

  const handleBackToList = () => {
    router.push(`/interviews/${category}`);
  };

  // ─── Render Guards ─────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-white/40 text-sm animate-pulse">Soru yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error || "Soru bulunamadı."}</p>
          <button
            onClick={handleBackToList}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
          >
            Listeye Dön
          </button>
        </div>
      </div>
    );
  }

  // ─── Normal Render: modülleri compose et ─────────────────
  // 📌 Crash guard: interview henüz yüklenmediyse skeleton göster (null dönme,
  //    SSR initialInterview undefined ise boş sayfa yaratıyordu).
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
  const levelCfg = LEVEL_CONFIG[(interview.level || "").toLowerCase()] || LEVEL_CONFIG.beginner;
  const passedCount = testResults.filter((r) => r.passed).length;
  const totalCount = testResults.length;
  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");
  const formattedTime = `${mm}:${ss}`;
  // 📌 isGuest mantığı (güçlendirildi, 2026-07-13):
  //   - user yüklü ve set edilmiş → kesinlikle misafir DEĞİL (gate KAPALI)
  //   - user null ama userLoading true → hâlâ yükleniyor, gate GÖSTERME (flash önleme)
  //   - user null + userLoading false + localStorage'da token VAR → token
  //     var ama /auth/me henüz cevap vermedi, "yüklüyor gibi" davran
  //   - user null + userLoading false + localStorage'da token YOK → gerçek misafir
  const isGuest = (() => {
    if (user) return false; // Kesinlikle login
    if (userLoading) return false; // Hâlâ yükleniyor
    if (typeof window !== "undefined") {
      try {
        const tokenKeys = ["sb-pymulakat-auth-token"];
        for (const k of tokenKeys) {
          const raw = localStorage.getItem(k);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.access_token) return false; // Token var, yüklüyor
          }
        }
      } catch { /* ignore */ }
    }
    return true; // Gerçekten misafir
  })();

  return (
    <div className="h-screen bg-[#050816] text-white flex flex-col overflow-hidden">
      {isGuest && <GuestBanner feature="kod çalıştırma" />}

      <WorkspaceHeader
        interview={interview}
        category={category}
        categoryLabel={categoryLabel}
        levelLabel={levelCfg.label}
        levelBg={levelCfg.bg}
        levelColor={levelCfg.color}
        levelBorder={levelCfg.border}
        formattedTime={formattedTime}
        seconds={seconds}
        pyStatus={pyStatus}
        user={user}
        isGuest={isGuest}
        onBack={handleBackToList}
        language={language}
        onLanguageChange={setLanguage}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar — collapse animasyonu (QuestionDescriptionPanel sarmalayıcı) */}
        <div
          className={`flex-shrink-0 h-full transition-all duration-200 overflow-hidden ${
            sidebarOpen ? "w-[420px]" : "w-0"
          }`}
        >
          <QuestionDescriptionPanel
            interview={interview}
            category={category}
            id={id}
            testCases={testCases}
            isGuest={isGuest}
            hintsList={hintsList}
            revealedHints={revealedHints}
            onRevealHint={onRevealHint}
            hasStudy={hasStudy}
            variant="desktop"
          />
        </div>

        {/* Sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute top-1/2 -translate-y-1/2 z-20 w-6 h-12 bg-white/5 hover:bg-white/15 border border-white/10 rounded-r-lg flex items-center justify-center transition-all ${
            sidebarOpen ? "left-[420px]" : "left-0"
          }`}
          title={sidebarOpen ? "Sidebar'ı daralt" : "Sidebar'ı genişlet"}
        >
          <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
          </svg>
        </button>

        {/* Sağ panel: CodeEditor (lazy) + TestPanel */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 relative">
            {isGuest ? (
              <GuestEditorFallback category={category ?? ""} id={id ?? ""} starterCode={interview?.starter_code ?? undefined} />
            ) : (
              <CodeEditorPanel
                editorRef={editorRef}
                value={code}
                onChange={handleCodeChange}
                language="python"
                height="100%"
              />
            )}
          </div>

          <TestPanel
            variant="desktop"
            testCases={testCases}
            testResults={testResults}
            isRunning={isRunning}
            pyStatus={pyStatus}
            isGuest={isGuest}
            category={category}
            id={id}
            onRun={handleRun}
            starterCode={interview?.starter_code || undefined}
            onCustomRun={handleCustomRun}
            errorLines={errorLines}
            hasRunOnce={hasRunOnce}
            questionTitle={interview?.title}
            questionDescription={interview?.description}
          />
        </main>
      </div>

      {/* Modals */}
      <CodeShareModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        code={code}
        language="python"
        title={interview.title}
        category={category}
        slug={interview.slug}
        passedCount={passedCount}
        totalCount={totalCount}
      />
    </div>
  );
}

// ─── Misafir için editör yerine CTA — modülden bağımsız inline
// (Eski GuestEditorGate bağımlılığı bu refactor'da modülden çıkarıldı;
// inline fallback aynı görsel/UX'i korur.)
function GuestEditorFallback({
  category,
  id,
  starterCode,
}: {
  category: string;
  id: string;
  starterCode?: string;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6 bg-[#050816]">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/30 flex items-center justify-center">
          <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white">Kodu çalıştırmak için giriş yap</h3>
        <p className="text-sm text-white/60 leading-relaxed">
          Soru açıklamasını ve test case'leri okuyabilirsin. Kodu yazıp{" "}
          <span className="font-semibold text-amber-400">çalıştırmak</span> için üye girişi gerekiyor.
        </p>
        {starterCode && (
          <pre className="text-[11px] font-mono text-amber-300/70 bg-amber-500/5 border border-amber-500/20 p-3 rounded-lg text-left overflow-x-auto">
            {starterCode}
          </pre>
        )}
        <a
          href={`/login?returnUrl=${encodeURIComponent(`/interviews/${category}/${id}`)}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-sm font-bold hover:from-amber-400 hover:to-amber-300 transition-all shadow-md shadow-amber-500/20"
        >
          <Lock className="w-4 h-4" /> Giriş Yap
        </a>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────

async function sendAttempt(payload: AttemptPayload): Promise<void> {
  // authAPI.submitAttempt — typed + auth header otomatik (lib/api/authAPI.ts)
  // Token varlığını lib/auth.ts üzerinden kontrol et
  const { getAccessToken } = await import("@/lib/auth");
  const token = getAccessToken();
  if (!token) {;
    return;
  }
  try {
    await submitAttemptAPI({
      question_id: payload.question_id,
      passed_tests: payload.passed_tests,
      total_tests: payload.total_tests,
      success: payload.success,
      execution_time_ms: payload.execution_time_ms,
      hints_used: payload.hints_used,
    });
  } catch (e) {
    throw new Error(`Attempt gönderilemedi: ${errorMessage(e) || "bilinmeyen hata"}`);
  }

  // 📌 Flow sayfası dinliyor — otomatik yenileme tetikler
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("pm:attempt-submitted"));
  }
}
