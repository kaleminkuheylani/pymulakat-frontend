"use client";

// WorkspaceClient — orchestrator component
// State management + 3 sub-components (Header, Sidebar, Editor)
// 1040 satırdan 380 satıra düşürüldü (refactor: 2026-06-30)

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "../../../../hooks/useUser";
import { usePyodide, TestRunResult } from "../../../../hooks/usePyodide";
import { CodeEditorRef } from "../../../../components/Monaco";
import { GuestBanner } from "../../../../components/GuestBanner";
import { questionsAPI, Question, QuestionTests } from "../../../../api/v2/questions";
import CodeShareModal from "../../../../components/CodeShareModal";
import TestCaseDrawer from "../../../../components/TestCaseDrawer";
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
  seoQuestion?: {
    explanation?: string;
    complexity?: string;
    related_concepts?: string[];
    related_questions?: Array<{ id: number; title: string; category: string; level: string }>;
    tutorial_slug?: string;
    hints?: string[];
  };
}

interface AttemptPayload {
  user_id?: string;
  question_id: number;
  user_code: string;
  passed_tests: number;
  total_tests: number;
  success: boolean;
  execution_time_ms: number;
  hints_used: number;
}

// ─── Main Component ───────────────────────────────────────
export default function WorkspaceClient({ initialParams, seoQuestion }: Props) {
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
  const questionId = parseInt(id, 10);

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
  const [revealedHints, setRevealedHints] = useState(0);
  const [hintsList, setHintsList] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [attemptSubmitted, setAttemptSubmitted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTestDrawer, setShowTestDrawer] = useState(false);
  const [hasAutoOpenedDrawer, setHasAutoOpenedDrawer] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
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
        if (!cancelled && tc) {
          setTestCases(tc);
          const hintList = extractHints(q.description || "");
          setHintsList(hintList);
        }
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

  // Auto-open drawer on mobile after first load
  useEffect(() => {
    if (hasAutoOpenedDrawer) return;
    if (!testCases) return;
    if (typeof window === "undefined") return;
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setShowTestDrawer(true);
      setHasAutoOpenedDrawer(true);
    }
  }, [testCases, hasAutoOpenedDrawer]);

  // Submit attempt when all tests pass
  const submitAttempt = useCallback(
    async (success: boolean, passedTests: number, totalTests: number, executionMs: number) => {
      if (attemptSubmitted) return;
      const payload: AttemptPayload = {
        question_id: questionId,
        user_code: code,
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
          setShowSuccessModal(true);
          // 1.5s sonra share modal'i ac (kullanici basari hisseder)
          setTimeout(() => {
            setShowSuccessModal(false);
            setShowShareModal(true);
          }, 1500);
        } else {
          toast.error("❌ Bazı testler başarısız", {
            description: "Kodunu gözden geçirip tekrar dene.",
          });
        }
      } catch (e) {
        console.warn("Attempt submission failed", e);
        toast.error("Attempt gönderilemedi");
      }
    },
    [attemptSubmitted, questionId, code, revealedHints]
  );

  // Run tests
  const handleRun = useCallback(async () => {
    if (isRunning || pyStatus !== "ready" || !testCases) return;
    setIsRunning(true);
    setTestResults([]);
    try {
      const result = await runTests(code, testCases.function_name, testCases.test_cases);
      setTestResults(result.results);
      const passed = result.results.filter((r) => r.passed).length;
      const total = result.results.length;
      const success = total > 0 && passed === total;
      await submitAttempt(success, passed, total, result.duration_ms);
    } catch (e: any) {
      toast.error("Çalıştırma hatası", { description: e?.message });
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, pyStatus, testCases, code, runTests, submitAttempt]);

  const revealNextHint = () => {
    if (revealedHints < hintsList.length) {
      setRevealedHints((n) => n + 1);
    }
  };

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
  const allPassed = totalCount > 0 && passedCount === totalCount;
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
        {/* Sidebar — collapse animasyonu (margin-left ile) */}
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
            seoQuestion={seoQuestion}
            isGuest={isGuest}
            hintsList={hintsList}
            revealedHints={revealedHints}
            onRevealHint={revealNextHint}
          />
        </div>

        {/* Sidebar toggle — aside dışında, her zaman görünür */}
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
          pyStatus={pyStatus}
          isGuest={isGuest}
          category={category}
          id={id}
          onRun={handleRun}
          onOpenDrawer={() => setShowTestDrawer(true)}
        />
      </div>

      {/* Modals */}
      <TestCaseDrawer
        open={showTestDrawer}
        onClose={() => setShowTestDrawer(false)}
        results={testResults}
        showExamples={true}
        examples={testCases?.test_cases || []}
      />

      <CodeShareModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        code={code}
        language="python"
        title={interview.title}
        category={category}
        passedCount={testResults.filter((r) => r.passed).length}
        totalCount={testResults.length}
      />
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────

function extractHints(description: string): string[] {
  if (!description) return [];
  const matches = description.match(/💡\s*İpucu\s*\d+:.*?(?=💡|$)/g);
  return matches ? matches.map((m) => m.trim()) : [];
}

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
}