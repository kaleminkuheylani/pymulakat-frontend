"use client";

// WorkspaceClient — desktop orchestrator.
// State + 3 sub-components: Header, Sidebar, Editor.

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "../../../../hooks/useUser";
import { usePyodide, TestRunResult } from "../../../../hooks/usePyodide";
import { CodeEditorRef } from "../../../../components/Monaco";
import { GuestBanner } from "../../../../components/GuestBanner";
import { questionsAPI, Question, QuestionTests } from "../../../../api/v2/questions";
import { getIdFromSlug } from "../../../../lib/questionMeta";
import { useHints } from "../../../../lib/hints";
import CodeShareModal from "../../../../components/CodeShareModal";
import WorkspaceHeader from "./components/WorkspaceHeader";
import WorkspaceSidebar from "./components/WorkspaceSidebar";
import WorkspaceEditor from "./components/WorkspaceEditor";

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
export default function WorkspaceClient({ initialParams }: Props) {
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
  // Slug → ID donusumu (sayfa slug ile gelebilir)
  let questionId = parseInt(id, 10);
  if (isNaN(questionId)) {
    const resolvedId = getIdFromSlug(id);
    if (resolvedId) questionId = resolvedId;
  }

  // Hooks
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { status: pyStatus, runTests } = usePyodide();
  const editorRef = useRef<CodeEditorRef>(null);

  // State
  const [interview, setInterview] = useState<Question | null>(null);
  const [testCases, setTestCases] = useState<QuestionTests | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [testResults, setTestResults] = useState<TestRunResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [attemptSubmitted, setAttemptSubmitted] = useState(false);
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

  // Hydration sonrasinda SSR content blogunu kaldir (duplicate onlemi)
  useEffect(() => {
    const els = document.querySelectorAll('[data-ssr-question]');
    els.forEach((el) => el.remove());
  }, []);

  // Cleanup share modal timer on unmount (React strict mode + route change)
  useEffect(() => {
    return () => {
      if (shareTimerRef.current) clearTimeout(shareTimerRef.current);
    };
  }, []);

  // Load question + test cases
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const q = await questionsAPI.getById(questionId, { includeStarter: true });
        if (cancelled) return;

        if (!q) {
          setError("Soru bulunamadı");
          return;
        }
        setInterview(q);
        if (q.starter_code) setCode(q.starter_code);

        const tc = await questionsAPI.getTests(questionId);
        if (!cancelled && tc) setTestCases(tc);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Soru yüklenemedi");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [questionId, category]);

  // Submit attempt when all tests pass
  const submitAttempt = useCallback(
    async (success: boolean, passedTests: number, totalTests: number, executionMs: number) => {
      if (attemptSubmitted) return;
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
          toast.error("❌ Bazı testler başarısız", {
            description: "Kodunu gözden geçirip tekrar dene.",
          });
        }
      } catch (e) {
        console.warn("Attempt submission failed", e);
        toast.error("Attempt gönderilemedi");
      } finally {
        inFlightRef.current = false;
      }
    },
    [attemptSubmitted, questionId, code, revealedHints]
  );

  // Run tests
  const handleRun = useCallback(async () => {
    if (!user) {
      router.push(`/login?returnUrl=${encodeURIComponent(`/interviews/${category}/${id}`)}`);
      return;
    }
    if (isRunning || (pyStatus !== "ready" && pyStatus !== "idle") || !testCases) return;
    setIsRunning(true);
    setTestResults([]);
    setConsoleOutput("");
    try {
      const result = await runTests(code, testCases.function_name, testCases.test_cases);
      setTestResults(result.results);
      setConsoleOutput(result.console_output || "");
      const passed = result.results.filter((r) => r.passed).length;
      const total = result.results.length;
      const success = total > 0 && passed === total;
      await submitAttempt(success, passed, total, result.execution_ms);
    } catch (e: any) {
      // 📌 Raw error sızmaz — sabit hardcoded mesaj
      toast.error("Çalıştırma hatası", { description: "Kodunu gözden geçirip tekrar dene." });
    } finally {
      setIsRunning(false);
    }
  }, [user, isRunning, pyStatus, testCases, code, runTests, submitAttempt, router, category, id]);

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

  // ─── Normal Render ─────────────────────────────────────
  const levelCfg = LEVEL_CONFIG[(interview.level || "").toLowerCase()] || LEVEL_CONFIG.beginner;
  const passedCount = testResults.filter((r) => r.passed).length;
  const totalCount = testResults.length;
  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");
  const formattedTime = `${mm}:${ss}`;
  const isGuest = !user && !userLoading;

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col">
      {isGuest && <GuestBanner feature="kod çalıştırma" />}

      <WorkspaceHeader
        interview={interview}
        category={category}
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
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar — collapse animasyonu */}
        <div
          className={`flex-shrink-0 h-full transition-all duration-200 overflow-hidden ${
            sidebarOpen ? "w-[420px]" : "w-0"
          }`}
        >
          <WorkspaceSidebar
            interview={interview}
            category={category}
            id={id}
            testCases={testCases}
            isGuest={isGuest}
            hintsList={hintsList}
            revealedHints={revealedHints}
            onRevealHint={onRevealHint}
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

        <WorkspaceEditor
          editorRef={editorRef}
          code={code}
          onCodeChange={setCode}
          testCases={testCases}
          testResults={testResults}
          isRunning={isRunning}
          consoleOutput={consoleOutput}
          pyStatus={pyStatus}
          isGuest={isGuest}
          category={category}
          id={id}
          onRun={handleRun}
        />
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

// ─── Helpers ──────────────────────────────────────────────

async function sendAttempt(payload: AttemptPayload): Promise<void> {
  // Token'i Supabase storage'dan al (sb-pymulakat-auth-token) veya fallback plain
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
  if (!token) {
    console.warn("[Attempt] Token yok, attempt gönderilmedi");
    return;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v2/attempts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error(`Attempt gönderilemedi: ${res.status}`);
  }

  // 📌 Flow sayfası dinliyor — otomatik yenileme tetikler
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("pm:attempt-submitted"));
  }
}
