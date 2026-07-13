"use client";

// QuestionDescriptionPanel.tsx — workspace'in sol paneli (soru açıklaması).
//
// Mevcut components/QuestionDescriptionContent.tsx'i sarmalayıp
// workspace orchestrator'larına ortak prop-based API sağlar.
// - Desktop: WorkspaceSidebar (sarmalanmış)
// - Mobile:  WorkspaceSidebarMobile (sarmalanmış)
//
// 📌 Kural: Her modül kendi state'ini izole etsin → burada hiçbir state yok,
//   sadece prop passthrough. Hints/içerik state'i parent'ta (useHints hook'u).

import { Question, QuestionTests } from "@/lib/api/types";
import QuestionDescriptionContent from "../QuestionDescriptionContent";
import WorkspaceSidebar from "../WorkspaceSidebar";
import { WorkspaceSidebarMobile } from "../WorkspaceSidebarMobile";

export interface QuestionDescriptionPanelProps {
  interview: Question;
  category: string;
  id: string;
  testCases?: QuestionTests | null;
  isGuest: boolean;
  /** Hints listesi (parent'taki useHints hook'undan gelir) */
  hintsList: string[];
  /** Kaç ipucu açıldı */
  revealedHints: number;
  /** İpucu gösterme callback'i */
  onRevealHint: () => void;
  hasStudy?: boolean;
  /** "desktop" → aside layout, "mobile" → content padding */
  variant: "desktop" | "mobile";
}

// ─── QuestionDescriptionPanel ────────────────────────────
// variant prop'u desktop/mobile farkını sarmalayıcıda tutar —
// QuestionDescriptionContent (içerik) her iki tarafta BİREBİR aynı.
export default function QuestionDescriptionPanel({
  interview,
  category,
  id,
  testCases,
  isGuest,
  hintsList,
  revealedHints,
  onRevealHint,
  hasStudy = false,
  variant,
}: QuestionDescriptionPanelProps) {
  if (variant === "desktop") {
    return (
      <WorkspaceSidebar
        interview={interview}
        category={category}
        id={id}
        testCases={testCases ?? null}
        isGuest={isGuest}
        hintsList={hintsList}
        revealedHints={revealedHints}
        onRevealHint={onRevealHint}
        hasStudy={hasStudy}
      />
    );
  }

  return (
    <WorkspaceSidebarMobile
      interview={interview}
      isGuest={isGuest}
      onLogin={() => undefined}
      testCases={testCases ?? null}
      hasStudy={hasStudy}
    />
  );
}
