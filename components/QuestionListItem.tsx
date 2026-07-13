// components/QuestionListItem.tsx
//
// TEK KAYNAK — kategori landing ve ana /interviews liste sayfası
// aynı zengin kart component'ini kullanır.
//
// Gösterilen alanlar (DB-FIRST, tüm alanlar opsiyonel):
//   - title (zorunlu)
//   - description (ilk 2 satır, clamp)
//   - level (beginner | intermediate | advanced) — renk kodlu
//   - complexity (varsa, e.g. "O(n log n)") — badge
//   - tags (varsa) — chip'ler
//   - category label (sadece /interviews ana listede görünür)
//   - function_name (varsa) — önizleme
//
// Lucide icon, no emoji, no span (memory kuralı).

import Link from "next/link";
import { Code2, ArrowRight, Clock, Tag, Sparkles } from "lucide-react";
import type { ApiQuestion } from "@/lib/api/types";

export interface QuestionListItemProps {
  question: ApiQuestion;
  /** Kategori label'ı (DB'den). /interviews ana sayfada gösterilir. */
  categoryLabel?: string;
  /** Kategori slug'ı (URL için). */
  categorySlug: string;
  /** Compact mod — function_name / tags gizli, daha sıkı kart. */
  compact?: boolean;
}

const LEVEL_STYLES: Record<string, string> = {
  beginner: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  başlangıç: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  intermediate: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  orta: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  advanced: "text-rose-300 bg-rose-500/10 border-rose-500/20",
  ileri: "text-rose-300 bg-rose-500/10 border-rose-500/20",
};

function levelClass(level: string | null | undefined): string {
  if (!level) return "text-white/60 bg-white/5 border-white/10";
  return LEVEL_STYLES[level.toLowerCase()] ?? "text-white/60 bg-white/5 border-white/10";
}

export default function QuestionListItem({
  question,
  categoryLabel,
  categorySlug,
  compact = false,
}: QuestionListItemProps) {
  const href = `/interviews/${categorySlug}/${question.slug ?? question.id}`;
  const desc = question.description?.split("\n").slice(0, 2).join("\n").trim();
  const showTags = !compact && question.tags && question.tags.length > 0;
  const showComplexity = !compact && question.complexity;

  return (
    <li>
      <Link
        href={href}
        className="block bg-white/[0.03] border border-white/10 rounded-lg p-4 hover:bg-white/[0.06] hover:border-white/20 transition-colors group"
      >
        <div className="flex items-start gap-3">
          <Code2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <h2 className="text-base font-semibold text-white truncate group-hover:text-amber-200 transition-colors">
                {question.title}
              </h2>
              <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
            </div>

            {desc && (
              <p className="text-xs text-white/50 line-clamp-2 mb-2 leading-relaxed">
                {desc}
              </p>
            )}

            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Level — renk kodlu */}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-medium ${levelClass(question.level)}`}
              >
                {question.level || "unknown"}
              </span>

              {/* Complexity — O(n) tarzı */}
              {showComplexity && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 inline-flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {question.complexity}
                </span>
              )}

              {/* Topic — tek kelime konu */}
              {!compact && question.topic && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 inline-flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  {question.topic}
                </span>
              )}

              {/* Category label — sadece /interviews ana listede */}
              {categoryLabel && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">
                  {categoryLabel}
                </span>
              )}

              {/* Tags — en fazla 3 */}
              {showTags &&
                (question.tags ?? []).slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 inline-flex items-center gap-0.5"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {t}
                  </span>
                ))}
              {showTags && (question.tags?.length ?? 0) > 3 && (
                <span className="text-[10px] text-white/40">
                  +{question.tags!.length - 3}
                </span>
              )}
            </div>

            {/* Function signature preview (opsiyonel) */}
            {!compact && question.function_name && (
              <div className="mt-2 text-[10px] text-white/40 font-mono">
                def <strong className="text-white/60">{question.function_name}</strong>(...)
              </div>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}
