// components/Breadcrumb.tsx
// Görsel breadcrumb — soru detay sayfasında H1 üstünde.
//
// MİMARİ (KESİN):
// - Display URL kullanır (canonical), internal slug değil
// - lib/categorySlug.ts truth of source
// - 3 seviye: Ana Sayfa > Kategori > Soru
// - Lucide icon (span yok, emoji yok)

import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { getCategoryDisplayUrl, getCategoryLabel } from "@/lib/categorySlug";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface BreadcrumbProps {
  category: string; // internal slug (örn. "python-basics")
  slug: string; // soru slug
  title: string; // soru title
}

export default function Breadcrumb({ category, slug, title }: BreadcrumbProps) {
  const displayCat = getCategoryDisplayUrl(category);
  const categoryLabel = getCategoryLabel(category);
  const questionUrl = `${displayCat}/${slug}`;

  const items: BreadcrumbItem[] = [
    { label: "Ana Sayfa", href: "/" },
    { label: categoryLabel, href: displayCat },
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
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
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
