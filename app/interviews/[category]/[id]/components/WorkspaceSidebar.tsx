// WorkspaceSidebar — desktop sol panel.
//
// Bu component sadece STYLED WRAPPER. Asıl içerik
// (title, description, complexity, hints, explanation, related...)
// ortak <QuestionDescriptionContent />'dan gelir — mobile ile birebir aynı.

import { Question, QuestionTests } from "../../../../../api/v2/questions";
import QuestionDescriptionContent from "./QuestionDescriptionContent";

interface SidebarProps {
  interview: Question;
  category: string;
  id: string;
  testCases: QuestionTests | null;
  isGuest: boolean;
  hintsList: string[];
  revealedHints: number;
  onRevealHint: () => void;
}

export default function WorkspaceSidebar({
  interview,
  category,
  id,
  testCases,
  isGuest,
  hintsList,
  revealedHints,
  onRevealHint,
}: SidebarProps) {
  return (
    <aside className="w-[420px] flex-shrink-0 bg-[#0a0e1a] h-full overflow-y-auto relative">
        <div className="p-6">
          <QuestionDescriptionContent
            interview={interview}
            testCases={testCases}
            isGuest={isGuest}
            category={category}
            id={id}
            hintsList={hintsList}
            revealedHints={revealedHints}
            onRevealHint={onRevealHint}
          />
        </div>
    </aside>
  );
}
