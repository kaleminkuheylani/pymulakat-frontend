// hooks/useRecommendations.ts
// Backend'den /api/v2/recommendations çağırır, fallback local scoring.

"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "./useUser";
import { recommendationsAPI } from "../lib/api/recommendationsAPI";

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
      const data = await recommendationsAPI.getRecommendations(limit, {
        accessToken: (user as any)?.access_token,
      });
      setItems(data.items);
      setContext(data.context);
      return;
      }

      // Fallback: local scoring (async DB fetch)
      const local = await computeLocalRecommendations(user, limit);
      setItems(local);
      setContext({ is_authenticated: !!user, top_categories: [] });
    } catch (err: any) {
      setError(err.message);
      const local = await computeLocalRecommendations(user, limit);
      setItems(local);
    } finally {
      setLoading(false);
    }
  }, [user, limit]);

  useEffect(() => {
    if (!userLoading) fetchRecommendations();
  }, [fetchRecommendations, userLoading]);

  return { items, context, loading, error, refresh: fetchRecommendations };
}

async function computeLocalRecommendations(user: any, limit: number): Promise<ScoredItem[]> {
  const ctx: UserContext = {
    top_categories: ["python-basics", "strings"],
    weak_categories: [],
    success_rate: user?.success_rate || 0,
    solved_ids: [],
    user_id: user?.id,
  };

  // DB'den soru listesi çek (fallback — backend recommendations başarısız olursa)
  let all: Array<{ id: number; title: string; category: string; level: string; slug: string }> = [];
  try {
    const data = (await recommendationsAPI.getAllQuestionsForRecs(200)) as any;
    all = (data?.data || []).filter((q: any) => q && q.slug);
  } catch {
    // empty
  }

  const questionItems: ScoredItem[] = all
    .map((q) => ({
      type: "question" as const,
      id: q.id,
      title: q.title,
      category: q.category,
      slug: q.slug,
      score: scoreQuestion({ id: q.id, category: q.category, level: q.level }, ctx),
      reason: explainQuestion(q.category, q.level, ctx),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const tutorialItems: ScoredItem[] = [
    { type: "tutorial" as const, id: 8, title: "Python Değişken Nedir?", slug: "python-degisken-nedir", category: "python-basics", score: 50, reason: "📖 Yeni başlangıç rehberi" },
    { type: "tutorial" as const, id: 9, title: "Python If-Else Koşulları", slug: "python-if-else-kosullar", category: "python-basics", score: 50, reason: "📖 Yeni başlangıç rehberi" },
  ];

  return [...questionItems, ...tutorialItems].sort((a, b) => b.score - a.score).slice(0, limit);
}