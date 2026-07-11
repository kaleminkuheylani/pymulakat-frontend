// components/forms/FormCategoryTabs.tsx

"use client";

import { useState, useEffect } from "react";
import { formAPI } from "../../lib/api/formAPI";

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

export default function FormCategoryTabs({ active, onChange }: Props) {
  // 📌 Metadata KAYNAĞI: Backend `/api/v2/forms/categories` (hardcoded fallback yok)
  const [cats, setCats] = useState<Category[]>([]);

  useEffect(() => {
    formAPI
      .listFormCategories()
      .then((d) => d && setCats(d))
      .catch(() => setCats([]));
  }, []);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
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