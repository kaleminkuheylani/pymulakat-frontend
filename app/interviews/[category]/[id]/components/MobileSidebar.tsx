"use client";

import { useState, memo } from "react";
import { getQuestionMeta, getIdFromSlug } from "../../../../../lib/questionMeta";
import type { Question } from "../../../../../api/v2/questions";

// ═══════════════════════════════════════════════════════════
// MobileSidebar — Soru detaylari, hints, related questions
// (Desktop'taki WorkspaceSidebar'in mobile versiyonu)
// ═══════════════════════════════════════════════════════════

interface Interview extends Question {}

interface MobileSidebarProps {
  interview: Interview;
  isGuest: boolean;
  onLogin: () => void;
}

// ── Helpers ──
const slugifyCat = (cat: string): string => {
  const map: Record<string, string> = {
    "python-basics": "python-basics",
    "strings": "strings",
    "list-dict": "list-dict",
    "pandas": "pandas",
    "algorithms": "algorithms",
  };
  return map[cat] || cat.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
};

// ── Hint Card ──
const HintCard = memo(function HintCard({ hint, revealed, onReveal }: { hint: string; revealed: boolean; onReveal: () => void }) {
  if (revealed) {
    return (
      <div className="p-2 rounded bg-indigo-500/5 border border-indigo-500/20">
        <span className="text-[11px] text-white/90">{hint}</span>
      </div>
    );
  }
  return (
    <button
      onClick={onReveal}
      className="block w-full p-2 rounded bg-amber-500/5 border border-amber-500/20 text-amber-300 text-[11px] text-left hover:bg-amber-500/10"
    >
      🔒 İpucu göster (1 hak)
    </button>
  );
});

// ── Main ──
export function MobileSidebar({ interview, isGuest, onLogin }: MobileSidebarProps) {
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());
  const meta = getQuestionMeta(interview.id);
  const hintsList = interview.hints && interview.hints.length > 0 ? interview.hints : [];

  // Related questions — DB + QuestionMeta fallback
  let related = interview.related_questions;
  if (!related || related.length === 0) {
    if (meta.related_questions?.length) {
      related = meta.related_questions.map((rid) => {
        const m = getQuestionMeta(rid);
        return {
          id: rid,
          title: m.title,
          category: m.topic || "python-basics",
          level: "beginner",
          slug: m.slug,
        };
      });
    }
  }

  const revealHint = (idx: number) => {
    setRevealedHints((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Title + Meta */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/50 uppercase">
            #{interview.id}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">
            {interview.level}
          </span>
        </div>
        <h1 className="text-base font-bold text-white leading-tight">{interview.title}</h1>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1">Soru</h3>
        <p className="text-[12px] text-white/80 whitespace-pre-line">{interview.description}</p>
      </div>

      {/* Complexity */}
      {interview.complexity && (
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-white/40">Zaman Karmaşıklığı:</span>
          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-mono">
            {interview.complexity}
          </span>
        </div>
      )}

      {/* Hints */}
      {hintsList.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-white/5">
          <span className="text-xs text-amber-400 font-semibold">İpuçları</span>
          {hintsList.map((h, i) => (
            <HintCard key={i} hint={h} revealed={revealedHints.has(i)} onReveal={() => revealHint(i)} />
          ))}
        </div>
      )}

      {/* Test cases CTA (misafir) */}
      {isGuest && (
        <a
          href={`/login?returnUrl=${encodeURIComponent(`/interviews/${slugifyCat(interview.category || "python-basics")}/${interview.slug || getQuestionMeta(interview.id)?.slug || String(interview.id)}`)}`}
          onClick={(e) => {
            e.preventDefault();
            onLogin();
          }}
          className="flex items-center justify-between gap-2 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
        >
          <span className="text-[11px] text-indigo-200/80">🔒 Test caseleri görmek için</span>
          <span className="text-indigo-300 font-semibold text-[11px]">Giriş Yap →</span>
        </a>
      )}

      {/* Tutorial */}
      {interview.tutorial_slug && (
        <a
          href={`/guides/${interview.tutorial_slug}`}
          className="flex items-center justify-between gap-2 p-2 rounded bg-white/[0.03] border border-white/10 hover:border-indigo-500/30"
        >
          <span className="text-[11px] text-white/85">📘 Detaylı Rehber</span>
          <span className="text-indigo-300">→</span>
        </a>
      )}

      {/* Related questions */}
      {related && related.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-white/5">
          <span className="text-xs text-cyan-400 font-semibold">Benzer Sorular</span>
          {related.map((rq) => (
            <a
              key={rq.id}
              href={`/interviews/${slugifyCat(rq.category || "python-basics")}/${rq.slug || getQuestionMeta(rq.id)?.slug || String(rq.id)}`}
              className="block p-2 rounded bg-white/[0.03] border border-white/10 hover:border-cyan-500/30"
            >
              <span className="text-[11px] text-white/80 line-clamp-1">{rq.title}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}