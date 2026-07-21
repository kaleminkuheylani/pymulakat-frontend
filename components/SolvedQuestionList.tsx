"use client";

// components/SolvedQuestionList.tsx
// Client wrapper: solved_ids cekip QuestionListItem'lara solved prop verir.
// In-Feed reklam ayri server component (SolvedListInFeed) — server-render.
//   2026-07-21, kullanici direktifi: "ctr prank en yuksek planlarim ekle".

import { useEffect, useState } from "react";
import QuestionListItem from "@/components/QuestionListItem";
import SolvedListInFeed from "./SolvedListInFeed";
import { getSolvedQuestionIds } from "@/lib/api/questionAPI";
import type { ApiQuestion } from "@/lib/api/types";
import { isAuthenticatedClient } from "@/lib/auth";

interface SolvedQuestionListProps {
  questions: ApiQuestion[];
  categorySlug: string;
  categoryLabel: string;
  /** In-Feed reklam kacinci elemandan sonra (default 3, 4. pozisyon). */
  inFeedAfter?: number;
}

export default function SolvedQuestionList({
  questions,
  categorySlug,
  categoryLabel,
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

  // In-Feed reklam server component olarak mount (server-render).
  // 3. elemandan sonra eklenir.
  const insertInFeedAt = inFeedAfter;

  return (
    <ul className="space-y-3" data-ssr-interviews-list>
      {questions.length === 0 ? (
        <li className="text-white/50 text-sm py-8 text-center">
          Bu kategoride henüz soru yok.
        </li>
      ) : (
        questions.map((q, idx) => (
          <Fragment key={q.id}>
            <QuestionListItem
              question={q}
              categorySlug={categorySlug}
              categoryLabel={categoryLabel}
              solved={solved.has(q.id)}
            />
            {/* 3. sorudan sonra in-feed reklam (server-render) */}
            {idx === insertInFeedAt - 1 && idx < questions.length - 1 && (
              <SolvedListInFeed />
            )}
          </Fragment>
        ))
      )}
    </ul>
  );
}

import { Fragment } from "react";
