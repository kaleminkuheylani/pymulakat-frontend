// app/interviews/FilterButtons.tsx
// Client component — kategori filtre butonlari + URL sync.

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface Category {
  slug: string;
  label: string;
  count: number;
}

interface FilterButtonsProps {
  categories: Category[];
  active: string;
}

export default function FilterButtons({ categories, active }: FilterButtonsProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleClick = (slug: string) => {
    startTransition(() => {
      if (slug === "all") {
        router.push("/interviews");
      } else {
        router.push(`/interviews?category=${slug}`);
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Kategori filtresi">
      <button
        type="button"
        onClick={() => handleClick("all")}
        aria-pressed={active === "all"}
        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
          active === "all"
            ? "bg-amber-500 text-slate-950 border-amber-500"
            : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
        }`}
      >
        Tümü
      </button>
      {categories.map((c) => (
        <button
          key={c.slug}
          type="button"
          onClick={() => handleClick(c.slug)}
          aria-pressed={active === c.slug}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            active === c.slug
              ? "bg-amber-500 text-slate-950 border-amber-500"
              : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
          }`}
        >
          {c.label}
          <span className="ml-1.5 text-[10px] opacity-70">{c.count}</span>
        </button>
      ))}
    </div>
  );
}
