"use client";

import { useState, memo } from "react";
import { getQuestionMeta, getIdFromSlug } from "../../../../../lib/questionMeta";
import type { Question } from "../../../../../api/v2/questions";

// ═══════════════════════════════════════════════════════════
// MobileSidebar — Soru detaylari, hints, related questions
// (Desktop'taki WorkspaceSidebar'in mobile versiyonu)
// ═══════════════════════════════════════════════════════════

interface Interview extends Question {}

interface WorkspaceSidebarMobileProps {
  interview: Interview;
  isGuest: boolean;
  onLogin: () => void;
  testCases?: {
    function_name: string;
    test_cases: Array<{ input: any; expected: any; description?: string }>;
  } | null;
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
export function WorkspaceSidebarMobile({ interview, isGuest, onLogin, testCases }: WorkspaceSidebarMobileProps) {
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

      {/* Beklenen Fonksiyon */}
      {testCases && (
        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
          <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">
            Beklenen Fonksiyon
          </div>
          <code className="text-amber-400 text-[13px] font-mono">
            def {testCases.function_name}(...)
          </code>
        </div>
      )}

      {/* Örnek Test Caseler — misafir + giriş yapmıs herkes görebilir */}
      {testCases && testCases.test_cases.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-semibold text-white/80">Test Örnekleri</h3>
            <span className="text-[10px] text-white/40">({testCases.test_cases.length})</span>
          </div>
          {testCases.test_cases.slice(0, 3).map((tc, i) => (
            <details
              key={i}
              className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden"
            >
              <summary className="cursor-pointer px-3 py-2 text-[11px] font-semibold text-white/70 hover:bg-white/5 select-none flex items-center justify-between">
                <span>Örnek #{i + 1}</span>
                <span className="text-white/30 text-[10px]">▾ aç</span>
              </summary>
              <div className="px-3 py-2 space-y-1.5 border-t border-white/5">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-white/40 mb-0.5 font-bold">İnput</div>
                  <pre className="text-[10px] font-mono text-white/70 bg-black/30 p-1.5 rounded overflow-x-auto">{JSON.stringify(tc.input)}</pre>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-white/40 mb-0.5 font-bold">Beklenen</div>
                  <pre className="text-[10px] font-mono text-green-400/80 bg-black/30 p-1.5 rounded overflow-x-auto">{JSON.stringify(tc.expected)}</pre>
                </div>
              </div>
            </details>
          ))}
          {testCases.test_cases.length > 3 && (
            <p className="text-[10px] text-white/40 text-center">
              +{testCases.test_cases.length - 3} örnek daha — çalıştırmak için giriş yapın
            </p>
          )}
        </div>
      )}

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

      {/* Misafir info banner */}
      {isGuest && (
        <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
          <div className="text-[10px] uppercase tracking-wider text-indigo-300 mb-1.5 font-bold">
            👁 Misafir Modu
          </div>
          <p className="text-[11px] text-indigo-200/80 leading-relaxed mb-2">
            Test caseleri görünür, kodu <span className="font-semibold text-indigo-200">inceleyebilirsin</span>. Çalıştırmak için giriş yap.
          </p>
          <a
            href={`/login?returnUrl=${encodeURIComponent(`/interviews/${slugifyCat(interview.category || "python-basics")}/${interview.slug || getQuestionMeta(interview.id)?.slug || String(interview.id)}`)}`}
            onClick={(e) => {
              e.preventDefault();
              onLogin();
            }}
            className="inline-block px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-200 font-semibold text-[11px] hover:bg-indigo-500/30"
          >
            Giriş Yap →
          </a>
        </div>
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