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
import { questionsAPI, Question, QuestionTests } from "../../../../api/v2/questions";
import { getQuestionMeta, getIdFromSlug, slugifyTitle } from "../../../../lib/questionMeta";
import { WorkspaceSidebarMobile } from "./components/WorkspaceSidebarMobile";
import { WorkspaceTestResults } from "./components/WorkspaceTestResults";

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
  const { status: pyStatus, runTests } = usePyodide();
  const editorRef = useRef<any>(null);

  // ─── State ──
  const [code, setCode] = useState<string>("");
  const [interview, setInterview] = useState<Question | null>(null);
  const [testCases, setTestCases] = useState<QuestionTests | null>(null);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  // 📌 Default "workspace" — kullanıcı soruyu açar açmaz editörle başlar,
  //     test case'ler Testler tab'ında ayrıca erişilebilir.
  const [tab, setTab] = useState<"question" | "workspace" | "tests">("workspace");
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
    const resolvedId = getIdFromSlug(id);
    if (resolvedId) {
      questionId = resolvedId;
    } else {
      return (
        <div className="h-screen bg-[#050816] flex items-center justify-center">
          <p className="text-red-400 text-sm">Geçersiz soru ID</p>
        </div>
      );
    }
  }

  // ─── Effects ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const q = await questionsAPI.getById(questionId, { includeStarter: true });
        if (cancelled) return;
        setInterview(q);
        setCode(q.starter_code || "");
      } catch (e: any) {
        toast.error("Soru yüklenemedi", { description: e?.message });
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
        toast.error("Test caseleri yüklenemedi", { description: e?.message });
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
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v2/attempts`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question_id: questionId,
              passed_tests: passed,
              total_tests: total,
              success,
              execution_time_ms: durationMs,
              user_code: code,
            }),
          }
        );
      } catch (e) {
        // Sessizce yoksay
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
    if (!testCases || running || pyStatus !== "ready") return;
    setRunning(true);
    setResults([]);
    try {
      const result = await runTests(code, testCases.function_name, testCases.test_cases);
      setResults(result.results);
      const passed = result.results.filter((r: any) => r.passed).length;
      const total = result.results.length;
      const success = total > 0 && passed === total;
      await submitAttempt(success, passed, total, result.duration_ms);
      setTab("tests");
      if (success) {
        setTimeout(() => setShowShareModal(true), 1500);
      }
    } catch (e: any) {
      toast.error("Çalıştırma hatası", { description: e?.message });
    } finally {
      setRunning(false);
    }
  }, [readonly, user, testCases, running, pyStatus, runTests, code, submitAttempt, router, category, interview, id]);

  const handleNextQuestion = useCallback(() => {
    if (!category || !interview) return;
    const nextId = (interview.id || 0) + 1;
    const qSlug = (interview as any).slug
      || getQuestionMeta(nextId)?.slug
      || (interview.title ? slugifyTitle(interview.title) : String(nextId));
    router.push(`/interviews/${category}/${qSlug}`);
  }, [router, category, interview]);

  const handleBackToList = useCallback(() => {
    if (category) {
      router.push(`/interviews/${category}`);
    } else {
      router.push("/interviews");
    }
  }, [router, category]);

  // ─── Render: Loading — sadece interview beklenir, test case yoksa
  //              WorkspaceTestResults kendi loading state'ini gösterir (default tab = tests).
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
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-white/5 bg-[#0a0e1a]">
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
            onClick={() => setTab("tests")}
            className={`px-2 py-1 rounded text-[10px] font-semibold ${
              tab === "tests" ? "bg-white/10 text-white" : "text-white/40"
            }`}
            aria-label="Testler"
          >
            🧪 {results.length > 0 && <span className="ml-0.5">{results.length}</span>}
          </button>
        </div>
        {readonly ? (
          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/40 text-[10px] font-semibold uppercase tracking-wider" title="Salt okunur önizleme">
            👁 Önizleme
          </span>
        ) : (
          <button
            onClick={handleRun}
            disabled={running || pyStatus !== "ready"}
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
            <CodeEditor ref={editorRef} value={code} onChange={setCode} height="100%" language="python" readOnly={readonly || isGuest} />
          </div>
        )}

        {tab === "tests" && (
          <WorkspaceTestResults results={results} isRunning={running} testCases={testCases} />
        )}
      </div>

      {/* Bottom tab bar — SADECE workspace tab'indayken gizle (editor tam ekran kullanir) */}
      {tab !== "workspace" && (
        <div className="flex border-t border-white/5 bg-[#0a0e1a]">
          {(["question", "workspace", "tests"] as const).map((k) => (
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
                : `Testler (${testCases?.test_cases.length ?? 0})`}
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
  const slug = getQuestionMeta(questionId)?.slug || slugifyTitle(title);
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