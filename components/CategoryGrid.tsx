// components/CategoryGrid.tsx
//
// Anasayfa + landing sayfaları için 8 kategori grid component'i.
//
// DB-FIRST:
//   - listCategories() → label, description, question_count, slug
//   - CATEGORY_ICONS (lib/icons.ts) → her slug için Lucide icon
//   - Canonical URL: /{display} (lib/categorySlug.ts → getCategoryUrl)
//
// Kurallar (2026-07-12):
//   - Lucide icon, no emoji, no span
//   - Hover: amber accent + icon scale
//   - Grid: 1 col (mobile) / 2 col (md) / 3 col (lg)
//   - Question count badge (DB'den)
//   - SSR: pre-render, cache'li

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getAllCategories } from "@/lib/api/categoryAPI";
import { CATEGORY_ICONS } from "@/lib/icons";
import { getCategoryUrl } from "@/lib/categorySlug";
import type { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  slug: string;
  label: string;
  description: string;
  questionCount: number;
  icon: LucideIcon;
}

function CategoryCard({ slug, label, description, questionCount, icon: Icon }: CategoryCardProps) {
  const href = getCategoryUrl(slug);
  return (
    <Link
      href={href}
      className="group block bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:bg-white/[0.06] hover:border-amber-500/40 transition-all"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white group-hover:text-amber-200 transition-colors truncate">
            {label}
          </h3>
          <div className="text-[11px] text-white/40 mt-0.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {questionCount} soru
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
      </div>
      <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
        {description || `${label} konusunda yapay zeka destekli Python mülakat soruları ve çözümleri.`}
      </p>
    </Link>
  );
}

export default async function CategoryGrid() {
  // DB'den kategoriler (8 pillar, queue kaldırıldı)
  const allCategories = await getAllCategories();
  const categories = allCategories.filter((c) => c.slug !== "queue" && c.slug);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">8 Kategori</h2>
        <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto">
          Seviyene uygun kategoriyi seç, tarayıcıda kod yaz, anında test et.
        </p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" data-ssr-category-grid>
        {categories.length === 0 ? (
          <li className="text-white/50 text-sm py-8 text-center col-span-full">
            Kategoriler yükleniyor...
          </li>
        ) : (
          categories.map((c: Awaited<ReturnType<typeof getAllCategories>>[number]) => {
            // Icon mapping: DB slug → Lucide component
            // Bulunamazsa fallback Sparkles (ama tüm 8 pillar map'li)
            const Icon = CATEGORY_ICONS[c.slug] ?? Sparkles;
            return (
              <CategoryCard
                key={c.slug}
                slug={c.slug}
                label={c.label ?? c.slug}
                description={c.description ?? ""}
                questionCount={c.question_count ?? 0}
                icon={Icon}
              />
            );
          })
        )}
      </ul>

      <div className="text-center mt-8">
        <Link
          href="/interviews"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-amber-300 transition-colors"
        >
          Tüm soruları tek listede gör
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
