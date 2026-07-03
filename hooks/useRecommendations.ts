// hooks/useRecommendations.ts
// Backend'den /api/v2/recommendations çağırır, fallback local scoring.

"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "./useUser";
import { QUESTION_META, getQuestionMeta } from "../lib/questionMeta";
import {
  scoreQuestion,
  scoreTutorial,
  explainQuestion,
  explainTutorial,
  type ScoredItem,
  type UserContext,
} from "../lib/recommendation-engine";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export function useRecommendations(limit: number = 10) {
  const { user, loading: userLoading } = useUser();
  const [items, setItems] = useState<ScoredItem[]>([]);
  const [context, setContext] = useState<{ is_authenticated: boolean; top_categories: string[] }>({
    is_authenticated: false,
    top_categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/v2/recommendations?limit=${limit}`, {
        credentials: "include",
        headers: user ? { Authorization: `Bearer ${(user as any).access_token || ""}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        setItems(data.data || []);
        setContext(data.context || { is_authenticated: false, top_categories: [] });
        return;
      }

      // Fallback: local scoring
      setItems(computeLocalRecommendations(user, limit));
      setContext({ is_authenticated: !!user, top_categories: [] });
    } catch (err: any) {
      setError(err.message);
      setItems(computeLocalRecommendations(user, limit));
    } finally {
      setLoading(false);
    }
  }, [user, limit]);

  useEffect(() => {
    if (!userLoading) fetchRecommendations();
  }, [fetchRecommendations, userLoading]);

  return { items, context, loading, error, refresh: fetchRecommendations };
}

function computeLocalRecommendations(user: any, limit: number): ScoredItem[] {
  const ctx: UserContext = {
    top_categories: ["python-basics", "strings"],
    weak_categories: [],
    success_rate: user?.success_rate || 0,
    solved_ids: [],
    user_id: user?.id,
  };

  const all = Object.values(QUESTION_META).filter((q) => q && q.slug);

  const questionItems: ScoredItem[] = all
    .map((q) => ({
      type: "question" as const,
      id: q.id,
      title: q.title,
      category: q.topic,
      slug: q.slug,
      score: scoreQuestion({ id: q.id, category: q.topic, level: q.difficulty_note.includes("intermediate") ? "intermediate" : "beginner" }, ctx),
      reason: explainQuestion(q.topic, q.difficulty_note.includes("intermediate") ? "intermediate" : "beginner", ctx),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const tutorialItems: ScoredItem[] = [
    { type: "tutorial" as const, id: 8, title: "Python Değişken Nedir?", slug: "python-degisken-nedir", category: "python-basics", score: 50, reason: "📖 Yeni başlangıç rehberi" },
    { type: "tutorial" as const, id: 9, title: "Python If-Else Koşulları", slug: "python-if-else-kosullar", category: "python-basics", score: 50, reason: "📖 Yeni başlangıç rehberi" },
  ];

  return [...questionItems, ...tutorialItems].sort((a, b) => b.score - a.score).slice(0, limit);
}