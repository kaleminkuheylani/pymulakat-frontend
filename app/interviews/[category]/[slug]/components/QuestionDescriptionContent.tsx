"use client";
import { Eye, Lightbulb, MessageSquare, CheckCircle } from "lucide-react";
import { getCategoryUrl } from "@/lib/categorySlug";
import { slugifyCategory } from "@/lib/questionMeta";

// QuestionDescriptionContent — desktop sidebar + mobile "Soru" tab'ı için
// TEK KAYNAK. Aynı data, aynı görsel hiyerarşi; sadece parent'ta padding/spacing farkı var.

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Question, QuestionTests } from "@/lib/api/types";
import { toQuestionMetaView } from "@/lib/questionMeta";
import MarkdownLite from "./MarkdownLite";
import ReportBugButton from "./workspace/ReportBugButton";

interface Props {
  interview: Question;
  testCases?: QuestionTests | null;
  isGuest: boolean;
  category: string;
  id: string;
  hintsList: string[];
  revealedHints: number;
  onRevealHint: () => void;
  hasStudy?: boolean;
}

export default function QuestionDescriptionContent({
  interview,
  testCases,
  isGuest,
  category,
  id,
  hintsList,
  revealedHints,
  onRevealHint,
  hasStudy = false,
}: Props) {
  const questionMeta = toQuestionMetaView(interview);

  // Related — sadece DB (interview.related_question_ids)
  const relatedIds = interview.related_question_ids || [];
  const metaRelated = relatedIds.map((rid) => ({
    id: rid,
    title: `Soru #${rid}`, // Title DB'den linked fetch ile gelir (ileride batch)
    category: interview.category || "python-basics",
    level: interview.level || "beginner",
    slug: String(rid),
  }));

  const relatedToShow = metaRelated.length > 0 ? metaRelated : null;

  return (
    <div className="space-y-5">
      {/* ─── Title + Meta ──────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2 leading-tight">
          {interview.title}
        </h1>
        <div className="flex items-center gap-2 text-xs text-white/40 flex-wrap">
          {/* 2026-07-14: "Yapay zeka denetiminden geçmiştir" vurgusu.
              Sorular AI tarafından denetlenmiş (kalite + müfredat uyumu),
              insan editörler tarafından onaylanmış. Yasal dayanak: Terms
              Bölüm 4.1. */}
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-300"
            title="Bu soru yapay zeka denetiminden geçirilmiş ve insan editörler tarafından onaylanmıştır."
          >
            <CheckCircle className="w-3 h-3" />
            Yapay zeka denetiminden geçmiştir
          </span>
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
          {interview.level && (
            <span className="px-1.5 py-0.5 rounded bg-white/5 text-white/50 uppercase text-[10px]">
              {interview.level}
            </span>
          )}
        </div>
        {/* 2026-07-17: Soru hataliysa bildir butonu (sadece authenticated user) */}
        <div className="mt-2">
          <ReportBugButton
            questionId={interview.id}
            questionSlug={interview.slug || id}
            category={category}
            isGuest={isGuest}
          />
        </div>
      </div>

      {/* ─── Description ───────────────────────────────── */}
      <p className="text-white/70 leading-relaxed whitespace-pre-wrap text-sm">
        {interview.description}
      </p>

      {/* ─── 📖 Detaylı Etüt CTA — sadece guide (DB analiz) varsa ─── */}
      {hasStudy && (
      <Link
        href={`/interviews/${category}/${id}/study`}
        className="group block p-3.5 rounded-xl bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent border border-purple-500/25 hover:border-purple-400/50 transition-all"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="text-sm font-bold text-white">Detaylı Etüt</h4>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-purple-200 font-semibold">
                DERİN ANALİZ
              </span>
            </div>
            <p className="text-[11px] text-white/65 leading-relaxed">
              Bu sorunun 3 farklı çözüm yaklaşımını (brute force → optimize → optimal) ve karşılaşılan edge case'leri öğren.
            </p>
            <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-purple-300 group-hover:text-purple-200 font-semibold">
              Etüdü Oku
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>
      </Link>
      )}

      {/* ─── Complexity + Tags + related_concepts ──────── */}
      {(interview.complexity ||
        interview.related_concepts?.length ||
        interview.tags?.length) && (
        <div className="flex flex-wrap items-center gap-2">
          {interview.complexity && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono bg-indigo-500/10 border border-indigo-500/25 text-indigo-300">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {interview.complexity}
            </span>
          )}
          {interview.related_concepts?.map((c) => (
            <span
              key={c}
              className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/5 border border-white/10 text-white/60"
            >
              {c}
            </span>
          ))}
          {interview.tags?.map((t) => (
            <span
              key={t}
              className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/5 border border-white/10 text-white/60"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* ─── Beklenen Fonksiyon ────────────────────────── */}
      {testCases && (
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1.5">
            Beklenen Fonksiyon
          </div>
          <code className="text-amber-400 text-sm font-mono">
            def {testCases.function_name}(...)
          </code>
          <p className="text-[10px] text-white/40 mt-2 leading-relaxed">
            {/* 📌 Misafirler de test case'leri okuyabilsin (Input/Expected/Actual). */}
            Örnek input / expected çıktılar için{" "}
            Testler tab'ına, istediğin input ile denemek için{" "}
            Konsol tab'ına bak.
          </p>
        </div>
      )}

      {/* ─── Hints ─────────────────────────────────────── */}
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
                #{idx + 1}
                {hint.replace(/^💡\s*İpucu\s*\d+:\s*/i, "")}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ─── Misafir CTA ───────────────────────────────── */}
      {isGuest && (
        <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
          <div className="text-[10px] uppercase tracking-wider text-indigo-300 mb-1.5">
            <Eye className="w-3.5 h-3.5 inline" /> Misafir Modu
          </div>
          <p className="text-xs text-indigo-200/80 leading-relaxed">
            Soru açıklamasını ve{" "}
            <span className="font-semibold text-indigo-200">test case'leri (input / expected / actual)</span>{" "}
            okuyabilirsin. Kodu{" "}
            <span className="font-semibold text-indigo-200">çalıştırmak</span> için{" "}
            <a
              href={`/login?returnUrl=${encodeURIComponent(`/interviews/${category}/${id}`)}`}
              className="underline font-semibold text-indigo-300 hover:text-indigo-200"
            >
              giriş yap
            </a>
            .
          </p>
        </div>
      )}

      {/* ─── Explanation (Markdown) ─────────────────────── */}
      {interview.explanation && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Yaklaşım & Açıklama
          </h3>
          <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-sm text-white/75 leading-relaxed">
            <MarkdownLite content={interview.explanation} />
          </div>
        </div>
      )}

      {/* 📌 Rehberler kaldırıldı — tutorial_slug cross-link devre dışı.
          Bunun yerine explanation ve related_concepts aşağıda gösteriliyor. */}

      {/* ─── Toplulukta Sor — question-aware CTA ─────── */}
      <AskCommunityButton
        questionId={interview.id}
        questionTitle={interview.title}
        category={category}
        isLoggedIn={!isGuest}
      />

      {/* ─── Related questions ──────────────────────────── */}
      {relatedToShow && relatedToShow.length > 0 && (
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
                href={`/interviews/${slugifyCategory(rq.category || "python-basics")}/${rq.slug || String(rq.id)}`}
                className="flex items-center gap-2.5 p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-cyan-500/30 transition-all group"
              >
                <span className="flex-1 text-sm text-white/80 group-hover:text-white line-clamp-2">
                  {rq.title}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/50 uppercase tracking-wide flex-shrink-0">
                  {rq.level}
                </span>
                <svg
                  className="w-3.5 h-3.5 text-white/30 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Toplulukta Sor — question-aware CTA ────────────
// Tıklanınca dashboard'a login required yönlendirir, modal pre-fill olur:
//   ?question_id=7&title=...&category=...
// Auth varsa direkt /dashboard/forms?question_id=... gider
// Değilse /login?returnUrl=... üzerinden dashboard'a
function AskCommunityButton({
  questionId,
  questionTitle,
  category,
  isLoggedIn,
}: {
  questionId: number;
  questionTitle: string;
  category: string;
  isLoggedIn: boolean;
}) {
  const target = `/dashboard/forms?question_id=${questionId}&title=${encodeURIComponent(questionTitle)}&category=${encodeURIComponent(category)}`;
  const href = isLoggedIn
    ? target
    : `/login?returnUrl=${encodeURIComponent(target)}`;

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-3.5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1m6-10a2 2 0 012 2v6a2 2 0 01-2 2H9l-4 4V8a2 2 0 014-4h6a2 2 0 014 4z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white">Takıldın mı?</h3>
          <p className="text-[11px] text-white/60 mt-0.5 leading-relaxed">
            Topluluktan bu soruya yardım iste — kod parçan, test case'in veya hatanı paylaş.
          </p>
          <a
            href={href}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold rounded-lg transition-all shadow-md shadow-emerald-500/30 active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Toplulukta Sor
            →
          </a>
        </div>
      </div>
    </div>
  );
}
