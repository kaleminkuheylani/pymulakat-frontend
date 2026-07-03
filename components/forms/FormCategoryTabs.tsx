// components/forms/FormCategoryTabs.tsx

"use client";

import { useState, useEffect } from "react";

interface Category {
  slug: string;
  label: string;
  description: string;
  icon: string;
  color: string;
}

interface Props {
  active: string | null;
  onChange: (slug: string | null) => void;
}

const FALLBACK: Category[] = [
  { slug: "feedback", label: "Geri Bildirim", description: "Platform hakkında öneri", icon: "💬", color: "amber" },
  { slug: "question_help", label: "Soru Yardımı", description: "Soruda takıldığın yer", icon: "❓", color: "indigo" },
  { slug: "code_help", label: "Kod Yardımı", description: "Kod review, refactoring", icon: "🐛", color: "rose" },
  { slug: "share", label: "Yazılım Paylaşımı", description: "Proje, kaynak, deneyim", icon: "🚀", color: "emerald" },
];

export default function FormCategoryTabs({ active, onChange }: Props) {
  const [cats, setCats] = useState<Category[]>(FALLBACK);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v2/forms/categories`)
      .then((r) => r.json())
      .then((d) => d?.data && setCats(d.data))
      .catch(() => {});
  }, []);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-6 border-b border-white/5">
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
          active === null
            ? "bg-white/10 text-white"
            : "bg-white/5 text-white/60 hover:bg-white/10"
        }`}
      >
        🌐 Tümü
      </button>
      {cats.map((c) => (
        <button
          key={c.slug}
          onClick={() => onChange(c.slug)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            active === c.slug
              ? "bg-white/10 text-white"
              : "bg-white/5 text-white/60 hover:bg-white/10"
          }`}
          title={c.description}
        >
          <span>{c.icon}</span>
          <span>{c.label}</span>
        </button>
      ))}
    </div>
  );
}