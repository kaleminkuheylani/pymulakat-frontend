import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { getPublicQuestions } from "@/lib/api/questionAPI";
import { getAllCategories } from "@/lib/api/categoryAPI";
import QuestionListItem from "@/components/QuestionListItem";

/**
 * /interviews/public — Herkese açık soruların listelendiği sayfa.
 * Hero'daki "Hemen Dene" linki buraya yönlendirir.
 */
export default async function PublicQuestionsPage() {
  const [questions, categories] = await Promise.all([
    getPublicQuestions(36),
    getAllCategories(),
  ]);

  const categoryLabelMap = new Map(categories.map((c) => [c.slug, c.label]));

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Public Sorular
            </h1>
          </div>
          <p className="text-white/60 text-sm md:text-base max-w-2xl leading-relaxed">
            Üye olmadan çözebileceğin herkese açık Python ve JavaScript
            mülakat soruları.
          </p>
        </header>

        {questions.length === 0 ? (
          <p className="text-white/50 text-sm py-8 text-center">
            Henüz public soru yok.
          </p>
        ) : (
          <ul className="space-y-3 mb-10">
            {questions.map((q) => (
              <QuestionListItem
                key={q.id}
                question={q}
                categorySlug={q.category || ""}
                categoryLabel={
                  categoryLabelMap.get(q.category || "") ||
                  q.category ||
                  ""
                }
                showAccessIcon={false}
              />
            ))}
          </ul>
        )}

        <div className="text-center">
          <Link
            href="/interviews"
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
          >
            Tüm kategorileri gör
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
