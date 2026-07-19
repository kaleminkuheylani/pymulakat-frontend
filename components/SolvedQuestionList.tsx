"use client";

// components/SolvedQuestionList.tsx
// Client wrapper: solved_ids cekip QuestionListItem'lara solved prop verir.

import { useEffect, useState } from "react";
import QuestionListItem from "@/components/QuestionListItem";
import { getSolvedQuestionIds } from "@/lib/api/questionAPI";
import type { ApiQuestion } from "@/lib/api/types";
import { isAuthenticatedClient } from "@/lib/auth";

export default function SolvedQuestionList({
  questions,
  categorySlug,
  categoryLabel,
}: {
  questions: ApiQuestion[];
  categorySlug: string;
  categoryLabel: string;
}) {
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
        questions.map((q) => (
          <QuestionListItem
            key={q.id}
            question={q}
            categorySlug={categorySlug}
            categoryLabel={categoryLabel}
            solved={solved.has(q.id)}
          />
        ))
      )}
    </ul>
  );
}
