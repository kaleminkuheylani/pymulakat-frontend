// components/Breadcrumb.tsx
// Görsel breadcrumb — soru detay sayfasında H1 üstünde.
//
// MİMARİ (KESİN, 2026-07-13):
// - URL: /interviews/{db_category}/{slug} (DB category slug)
// - DB-FIRST: kategori label'ı DB'den (lib/api/categoryAPI.ts)
// - 4 seviye: Ana Sayfa > Sorular > Kategori > Soru
//   1) Ana Sayfa  → /
//   2) Sorular    → /interviews (tüm sorular listesi — Dynamic, çalışır)
//   3) {Kategori} → /{display} (top-level canonical, ISR)
//   4) {Soru}     → current page (no link)
// - Lucide icon (span yok, emoji yok)

import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { getCategoryMeta } from "@/lib/api/categoryAPI";
import { getCategoryUrl } from "@/lib/categorySlug";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface BreadcrumbProps {
  category: string; // DB category (örn. "python-basics")
  slug: string; // soru slug
  title: string; // soru title
}

export default async function Breadcrumb({ category, slug, title }: BreadcrumbProps) {
  // DB'den label (kullanici direktifi 2026-07-13: hardcoded YOK)
  const meta = await getCategoryMeta(category);
  const categoryLabel = meta?.label ?? category;
  // Canonical category: /{display} (top-level, ISR pre-rendered)
  // Question detail: /interviews/{db_category}/{slug} (canonical)
  const categoryUrl = getCategoryUrl(category);
  const questionUrl = `/interviews/${category}/${slug}`;

  // 4 seviye: Ana Sayfa > Sorular > {Kategori} > {Soru}
  // "Sorular" → /interviews (tüm sorular listesi, page.tsx, revalidate=3600)
  const items: BreadcrumbItem[] = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Sorular", href: "/interviews" },
    { label: categoryLabel, href: categoryUrl },
    { label: title, href: questionUrl },
  ];

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-white/60">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1">
              {i === 0 ? (
                <Link
                  href={item.href}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                  aria-label="Ana Sayfa"
                >
                  <Home className="w-3.5 h-3.5" />
                </Link>
              ) : isLast ? (
                <strong className="text-white font-medium truncate max-w-[200px] sm:max-w-[400px]">
                  {item.label}
                </strong>
              ) : (
                <Link href={item.href} className="hover:text-white transition-colors">
                  {item.label}
                </Link>
              )}
              {!isLast && <ChevronRight className="w-3 h-3 text-white/30" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
