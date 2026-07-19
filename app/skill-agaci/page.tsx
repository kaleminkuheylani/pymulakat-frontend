// /skill-agaci — Skill tree view.
// DB-first: categories + questions from backend, related_concepts from Supabase.

import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/api/categoryAPI";
import { listQuestionsByCategory } from "@/lib/api/questionAPI";
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
        <SkillProgress questions={allQuestions} />
      </main>
    </div>
  );
}
