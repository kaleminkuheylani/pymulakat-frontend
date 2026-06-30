// WorkspaceSidebar — sol panel: progress, başlık, description, complexity, hints, explanation, related questions

import { ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Question, QuestionTests } from "../../../../../api/v2/questions";
import { getQuestionMeta } from "../../../../../lib/questionMeta";
import MarkdownLite from "./MarkdownLite";
import SolvedBadge from "./SolvedBadge";

interface SidebarProps {
  interview: Question;
  category: string;
  id: string;
  testCases: QuestionTests | null;
  seoQuestion: {
    explanation?: string;
    complexity?: string;
    related_concepts?: string[];
    related_questions?: Array<{ id: number; title: string; category: string; level: string }>;
    tutorial_slug?: string;
  } | undefined;
  isGuest: boolean;
  hintsList: string[];
  revealedHints: number;
  onRevealHint: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const slugifyCategory = (cat: string): string => {
  const map: Record<string, string> = {
    "python-basics": "python-basics",
    "strings": "strings",
    "list-dict": "list-dict",
    "pandas": "pandas",
    "algorithms": "algorithms",
  };
  return map[cat] || cat.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
};

export default function WorkspaceSidebar({
  interview,
  category,
  id,
  testCases,
  seoQuestion,
  isGuest,
  hintsList,
  revealedHints,
  onRevealHint,
  sidebarOpen,
  onToggleSidebar,
}: SidebarProps) {
  const questionMeta = getQuestionMeta(interview.id);

  // Related questions — DB öncelikli, fallback QuestionMeta
  const dbRelated = seoQuestion?.related_questions && seoQuestion.related_questions.length > 0
    ? seoQuestion.related_questions
    : null;

  const metaRelated = questionMeta.related_questions && questionMeta.related_questions.length > 0
    ? questionMeta.related_questions.map((rid) => {
        const m = getQuestionMeta(rid);
        return {
          id: rid,
          title: m.title,
          category: m.topic || "python-basics",
          level: "beginner",
        };
      })
    : [];

  const relatedToShow = dbRelated || metaRelated;

  return (
    <aside
      className={`${sidebarOpen ? "w-[420px]" : "w-0"} border-r border-white/5 bg-[#0a0e1a] flex flex-col overflow-hidden transition-all duration-200 relative`}
    >
      {/* Collapse toggle */}
      <button
        onClick={onToggleSidebar}
        className="absolute top-1/2 -translate-y-1/2 -right-3 z-10 w-6 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-r-lg flex items-center justify-center transition-all"
        title={sidebarOpen ? "Sidebar'ı daralt" : "Sidebar'ı genişlet"}
      >
        <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
        </svg>
      </button>

      <div className="w-[420px] h-full overflow-y-auto">
        <div className="p-6 space-y-5">
          {/* Title + Meta */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{interview.title}</h1>
              {/* 🆕 Solved Badge (client-side, token gerekli) */}
              <SolvedBadge questionId={interview.id} />
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40 flex-wrap">
              {questionMeta.topic && questionMeta.topic !== "Genel" && (
                <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/25 text-indigo-300">
                  {questionMeta.topic}
                </span>
              )}
              {questionMeta.function_name && questionMeta.function_name !== "solution" && (
                <code className="font-mono text-amber-300/80 text-[11px]">
                  def {questionMeta.function_name}(...)
                </code>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
            {interview.description}
          </p>

          {/* Complexity + Tags */}
          {(seoQuestion?.complexity || seoQuestion?.related_concepts?.length || interview.tags?.length) && (
            <div className="flex flex-wrap items-center gap-2">
              {seoQuestion?.complexity && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono bg-indigo-500/10 border border-indigo-500/25 text-indigo-300">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {seoQuestion.complexity}
                </span>
              )}
              {seoQuestion?.related_concepts?.map((c) => (
                <span key={c} className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/5 border border-white/10 text-white/60">
                  {c}
                </span>
              ))}
              {interview.tags?.map((t) => (
                <span key={t} className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/5 border border-white/10 text-white/60">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Beklenen Fonksiyon */}
          {testCases && (
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1.5">
                Beklenen Fonksiyon
              </div>
              <code className="text-amber-400 text-sm font-mono">
                def {testCases.function_name}(...)
              </code>
            </div>
          )}

          {/* Misafir CTA */}
          {!testCases && isGuest && (
            <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
              <div className="text-[10px] uppercase tracking-wider text-indigo-300 mb-1.5">
                Test Caseler
              </div>
              <p className="text-xs text-indigo-200/80">
                Test caseleri görmek ve kodu çalıştırmak için{" "}
                <a
                  href={`/login?returnUrl=${encodeURIComponent(`/interviews/${category}/${id}`)}`}
                  className="underline font-semibold text-indigo-300 hover:text-indigo-200"
                >
                  giriş yap
                </a>.
              </p>
            </div>
          )}

          {/* Hints */}
          {hintsList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white/80">
                  İpuçları
                  <span className="ml-2 text-xs text-white/40 font-normal">
                    ({revealedHints}/{hintsList.length})
                  </span>
                </h3>
                {revealedHints < hintsList.length && (
                  <button
                    onClick={onRevealHint}
                    className="text-xs px-3 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 transition-colors"
                  >
                    İpucu Göster
                  </button>
                )}
              </div>

              <AnimatePresence>
                {hintsList.slice(0, revealedHints).map((hint, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-sm text-amber-100/80 leading-relaxed"
                  >
                    <span className="text-amber-400 font-semibold mr-1.5">#{idx + 1}</span>
                    {hint.replace(/^💡\s*İpucu\s*\d+:\s*/i, "")}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Explanation */}
          {seoQuestion?.explanation && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Yaklaşım & Açıklama
              </h3>
              <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-sm text-white/75 leading-relaxed">
                <MarkdownLite content={seoQuestion.explanation} />
              </div>
            </div>
          )}

          {/* Tutorial cross-link */}
          {seoQuestion?.tutorial_slug && (
            <Link
              href={`/guides/${seoQuestion.tutorial_slug}`}
              className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/25 hover:border-indigo-400/50 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">📘</span>
                <div>
                  <div className="text-sm font-semibold text-white/90 group-hover:text-white">Detaylı Rehber</div>
                  <div className="text-[11px] text-white/50">Bu sorunun uzun form açıklaması</div>
                </div>
              </div>
              <svg className="w-4 h-4 text-indigo-300 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}

          {/* Related questions */}
          {relatedToShow.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Benzer Sorular
              </h3>
              <div className="space-y-2">
                {relatedToShow.map((rq) => (
                  <Link
                    key={rq.id}
                    href={`/interviews/${slugifyCategory(rq.category || "python-basics")}/${rq.id}`}
                    className="flex items-center gap-2.5 p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-cyan-500/30 transition-all group"
                  >
                    <span className="flex-1 text-sm text-white/80 group-hover:text-white line-clamp-2">{rq.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/50 uppercase tracking-wide flex-shrink-0">
                      {rq.level}
                    </span>
                    <svg className="w-3.5 h-3.5 text-white/30 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}