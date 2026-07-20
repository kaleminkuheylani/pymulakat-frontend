// /skill-agaci — Skill tree view.
// Client-side dynamic: questions + attempts fetched by SkillProgress.

import type { Metadata } from "next";
import Link from "next/link";
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

export default function SkillTreePage() {
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
        <SkillProgress />
      </main>
    </div>
  );
}
