// app/blog/sifirdan-zirveye/hooks/useProgress.ts
//
// 2026-07-18: Sıfırdan Zirveye — localStorage progress tracking.
// Çözülen bölümlerin listesi, sonraki bölümü belirlemek için.

"use client";

import { useState, useEffect, useCallback } from "react";
import type { SectionId } from "../data/sections";

const STORAGE_KEY = "pm_sifir_zirveye_progress";

/** Hook: progress'i oku, güncelle, temizle */
export function useSifirProgress() {
  const [completed, setCompleted] = useState<SectionId[]>([]);
  const [mounted, setMounted] = useState(false);

  // Mount'ta localStorage'dan oku
  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SectionId[];
        if (Array.isArray(parsed)) {
          setCompleted(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Bölümü tamamlandı işaretle
  const markComplete = useCallback((id: SectionId) => {
    setCompleted((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
      }
      return next;
    });
  }, []);

  // İlerlemeyi sıfırla (debug/test için)
  const reset = useCallback(() => {
    setCompleted([]);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, []);

  /** Verilen bölümün kilidi açık mı? */
  const isUnlocked = useCallback(
    (id: SectionId, allIds: SectionId[]): boolean => {
      const idx = allIds.indexOf(id);
      if (idx === 0) return true; // İlk bölüm her zaman açık
      // Önceki bölüm tamamlandıysa açık
      const prevId = allIds[idx - 1];
      return completed.includes(prevId);
    },
    [completed]
  );

  return { completed, mounted, markComplete, reset, isUnlocked };
}
