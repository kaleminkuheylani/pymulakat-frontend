"use client";

import type { Question, QuestionTests } from "../../../../api/v2/questions";
import { useHints } from "@/lib/hints";
import QuestionDescriptionContent from "./QuestionDescriptionContent";

interface WorkspaceSidebarMobileProps {
  interview: Question;
  isGuest: boolean;
  onLogin: () => void;
  testCases?: QuestionTests | null;
  hasStudy?: boolean;
}

// ═══════════════════════════════════════════════════════════
// MobileSidebar — "Soru" tab içeriği.
//
// Sadece styled wrapper. İçerik ortak <QuestionDescriptionContent />'dan.
// Hint state: paylaşılan useHints hook'u (desktop ile aynı davranış).
// ═══════════════════════════════════════════════════════════

export function WorkspaceSidebarMobile({
  interview,
  isGuest,
  testCases,
  hasStudy = false,
}: WorkspaceSidebarMobileProps) {
  const { hintsList, revealedHints, onRevealHint } = useHints(interview);

  return (
    <div className="p-4">
      <QuestionDescriptionContent
        interview={interview}
        testCases={testCases}
        isGuest={isGuest}
        category={interview.category || "python-basics"}
        id={String(interview.id)}
        hintsList={hintsList}
        revealedHints={revealedHints}
        onRevealHint={onRevealHint}
        hasStudy={hasStudy}
      />
    </div>
  );
}
