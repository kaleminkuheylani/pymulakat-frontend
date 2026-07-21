"use client";

// components/SolvedQuestionList.tsx
// Client wrapper: solved_ids cekip QuestionListItem'lara solved prop verir.
// + In-Feed AdSense reklam (CTR optimizasyonu, 3. sorudan sonra).
//   2026-07-21, kullanici direktifi: "ctr prank en yuksek planlarim ekle".

import { useEffect, useState } from "react";
import QuestionListItem from "@/components/QuestionListItem";
import AdSense from "./AdSense";
import { getSolvedQuestionIds } from "@/lib/api/questionAPI";
import type { ApiQuestion } from "@/lib/api/types";
import { isAuthenticatedClient } from "@/lib/auth";

interface SolvedQuestionListProps {
  questions: ApiQuestion[];
  categorySlug: string;
  categoryLabel: string;
  /** AdSense in-feed slot (CTR optimizasyonu). Opsiyonel. */
  inFeedSlot?: string;
  /** Kacinci sorudan sonra reklam (default 3). */
  inFeedAfter?: number;
}

export default function SolvedQuestionList({
  questions,
  categorySlug,
  categoryLabel,
  inFeedSlot,
  inFeedAfter = 3,
}: SolvedQuestionListProps) {
  const [solved, setSolved] = useState<Set<number>>(new Set());

  useEffect(() => {
    let cancelled = false;
    if (!isAuthenticatedClient()) return;
    getSolvedQuestionIds()
      .then((ids) => {
        if (!cancelled) setSolved(new Set(ids));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ul className="space-y-3" data-ssr-interviews-list>
      {questions.length === 0 ? (
        <li className="text-white/50 text-sm py-8 text-center">
          Bu kategoride henüz soru yok.
        </li>
      ) : (
        questions.map((q, idx) => (
          <QuestionListItem
            key={q.id}
            question={q}
            categorySlug={categorySlug}
            categoryLabel={categoryLabel}
            solved={solved.has(q.id)}
          />
        ))
      )}
      {/* In-Feed reklam — soru listesinin altinda (4. pozisyon) */}
      {inFeedSlot && questions.length >= inFeedAfter && (
        <li className="list-none">
          <AdSense slot={inFeedSlot} format="in-feed" />
        </li>
      )}
    </ul>
  );
}
