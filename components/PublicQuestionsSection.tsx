import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getPublicQuestions } from "@/lib/api/questionAPI";
import QuestionListItem from "@/components/QuestionListItem";
import SectionHeader from "@/components/SectionHeader";

/**
 * PublicQuestionsSection
 *
 * DB'deki question_type = public olan sorulari ana sayfada listeler.
 * Server component: build/ISR sirasinda backend'den ceker.
 */
export default async function PublicQuestionsSection() {
  const questions = await getPublicQuestions(6);

  if (questions.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-[#050816]">
      <div className="max-w-5xl mx-auto px-4">
        <SectionHeader
          icon={BookOpen}
          title="Public Sorular"
          subtitle="Herkese açık Python ve JavaScript mülakat soruları"
        />

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {questions.map((q) => (
            <QuestionListItem
              key={q.id}
              question={q}
              categorySlug={q.category || ""}
            />
          ))}
        </ul>

        <div className="text-center">
          <Link
            href="/interviews"
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
          >
            Tüm soruları gör
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
