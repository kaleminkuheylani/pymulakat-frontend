// /skill-agaci — Skill tree view.
// DB-first: categories + questions from backend, related_concepts from Supabase.

import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/api/categoryAPI";
import { listQuestionsByCategory } from "@/lib/api/questionAPI";
import { getCategoryLabel } from "@/lib/categorySlug";
import type { ApiQuestion } from "@/lib/api/types";
import SkillProgress from "@/components/SkillProgress";

export const metadata: Metadata = {
  title: "Skill Ağacı — Python Mülakat Konu Haritası",
  description:
    "Python mülakat konularını ve kavramlar arası ilişkileri keşfet. Hangi soru hangi kategoriyle bağlantılı, öğrenme yolunu gör.",
  alternates: {
    canonical: "https://pythonmulakat.com/skill-agaci",
  },
  openGraph: {
    title: "Skill Ağacı — Python Mülakat Konu Haritası",
    description: "Kategoriler ve kavramlar arası ilişkileri keşfet.",
    url: "https://pythonmulakat.com/skill-agaci",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
  },
};

export const revalidate = 3600;

interface CategoryWithQuestions {
  slug: string;
  label: string;
  description: string;
  icon: string;
  question_count: number;
  questions: ApiQuestion[];
}

export default async function SkillTreePage() {
  const categories = await getAllCategories();

  const categoryData: CategoryWithQuestions[] = await Promise.all(
    categories.map(async (cat) => {
      const questions = await listQuestionsByCategory(cat.slug).catch(() => []);
      return {
        slug: cat.slug,
        label: cat.label,
        description: cat.description,
        icon: cat.icon,
        question_count: cat.question_count,
        questions: questions || [],
      };
    })
  );

  // Flattened list for the client-side progress component
  const allQuestions = categoryData.flatMap((c) => c.questions);

  // Build concept -> categories map and id -> category map
  const conceptToCategories = new Map<string, Set<string>>();
  const idToCategory = new Map<number | string, string>();

  for (const cat of categoryData) {
    for (const q of cat.questions) {
      idToCategory.set(q.id, cat.slug);
      for (const concept of q.related_concepts || []) {
        const set = conceptToCategories.get(concept) ?? new Set<string>();
        set.add(cat.slug);
        conceptToCategories.set(concept, set);
      }
    }
  }

  function relatedCategoriesFor(q: ApiQuestion, ownSlug: string): string[] {
    const cats = new Set<string>();
    for (const concept of q.related_concepts || []) {
      const set = conceptToCategories.get(concept);
      if (set) {
        for (const cat of set) {
          if (cat !== ownSlug) cats.add(cat);
        }
      }
    }
    for (const rid of q.related_question_ids || []) {
      const cat = idToCategory.get(rid);
      if (cat && cat !== ownSlug) cats.add(cat);
    }
    return Array.from(cats).sort();
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <header className="bg-[#0a0e1a]/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-3 transition-colors"
          >
            ← Ana Sayfa
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Skill Ağacı</h1>
          <p className="text-white/70 text-base md:text-lg max-w-3xl leading-relaxed">
            Konuları ve sorular arası ilişkileri keşfet. Her kategori için
            kavramlar ve bağlantılı kategorileri gör.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid gap-6">
          <SkillProgress questions={allQuestions} />
          {categoryData.map((cat) => (
            <section
              key={cat.slug}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl" aria-hidden>
                  {cat.icon || "📘"}
                </span>
                <h2 className="text-xl md:text-2xl font-bold">{cat.label}</h2>
                <span className="ml-auto text-xs px-2 py-1 rounded-full bg-white/5 text-white/50">
                  {cat.questions.length} soru
                </span>
              </div>
              <p className="text-sm text-white/50 mb-4">{cat.description}</p>

              <div className="grid gap-3">
                {cat.questions.map((q) => {
                  const relCats = relatedCategoriesFor(q, cat.slug);
                  const href = `/interviews/${q.category}/${q.slug || q.id}`;
                  return (
                    <div
                      key={q.id}
                      className="rounded-xl border border-white/5 p-4 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Link
                          href={href}
                          className="font-semibold text-white hover:text-amber-300 transition-colors"
                        >
                          {q.title}
                        </Link>
                        <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-white/5 text-white/50">
                          {q.level}
                        </span>
                      </div>

                      {q.related_concepts && q.related_concepts.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {q.related_concepts.map((concept) => (
                            <span
                              key={concept}
                              className="text-[10px] px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      )}

                      {relCats.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/40">
                          <span>İlgili kategoriler:</span>
                          {relCats.map((slug) => (
                            <Link
                              key={slug}
                              href={`/interviews/${slug}`}
                              className="text-amber-300/80 hover:text-amber-300 underline underline-offset-2"
                            >
                              {getCategoryLabel(slug)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
