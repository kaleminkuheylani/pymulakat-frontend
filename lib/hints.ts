// hooks/useHints — soruya ait ipuçlarını yönet.
//
// Kaynak önceliği:
//   1. API'den gelen `interview.hints[]` (temiz)
//   2. Description içindeki "💡 İpucu N: …" kalıpları (geriye uyumluluk)
//
// Counter + reveal-next pattern (desktop + mobile aynı).

import { useCallback, useMemo, useState } from "react";
import type { Question } from "../api/v2/questions";

const HINT_RE = /💡\s*İpucu\s*\d+:.*?(?=💡|$)/g;

export function extractHintsFromDescription(description: string): string[] {
  if (!description) return [];
  const matches = description.match(HINT_RE);
  return matches ? matches.map((m) => m.trim()) : [];
}

export function getHintsForQuestion(interview: Question | null | undefined): string[] {
  if (!interview) return [];
  if (interview.hints && interview.hints.length > 0) return interview.hints;
  return extractHintsFromDescription(interview.description || "");
}

export interface UseHintsReturn {
  hintsList: string[];
  revealedHints: number;
  onRevealHint: () => void;
  reset: () => void;
}

export function useHints(interview: Question | null | undefined): UseHintsReturn {
  const hintsList = useMemo(() => getHintsForQuestion(interview), [interview]);
  const [revealedHints, setRevealedHints] = useState(0);

  const onRevealHint = useCallback(() => {
    setRevealedHints((n) => (n < hintsList.length ? n + 1 : n));
  }, [hintsList.length]);

  const reset = useCallback(() => setRevealedHints(0), []);

  return { hintsList, revealedHints, onRevealHint, reset };
}
