// components/defaultRelatedCategories.ts
// 5 kategori sayfasında paylaşılan "İlgili Kategoriler" listesi.

import type { RelatedCategory } from "./CategoryPageTemplate";

export const DEFAULT_RELATED_CATEGORIES: RelatedCategory[] = [
  {
    href: "/python-algoritma-sorulari",
    icon: "⚡",
    title: "Python Algoritma Soruları",
    description:
      "Sıralama, arama, dinamik programlama, graf ve string algoritmaları için 26+ interaktif soru.",
    gradient: "indigo-amber",
  },
  {
    href: "/python-dinamik-programlama",
    icon: "🧠",
    title: "Python Dinamik Programlama",
    description:
      "Fibonacci memoization, 0/1 Knapsack, Coin Change, Edit Distance, LCS — 12+ klasik DP sorusu.",
    gradient: "amber-indigo",
  },
  {
    href: "/interviews",
    icon: "📚",
    title: "Tüm Mülakat Kategorileri",
    description:
      "Python mülakat soruları kataloğu: OOP, SQLite, Pandas, veri yapıları, dinamik programlama ve daha fazlası.",
    gradient: "indigo-amber",
  },
  {
    href: "/python-kodlari",
    icon: "📖",
    title: "Python Kodları",
    description:
      "Hazır Python kodu örnekleri: liste, dict, OOP, Pandas, Algoritmalar. Kopyala, çalıştır, öğren.",
    gradient: "amber-indigo",
  },
  {
    href: "/python-egitimi",
    icon: "🎓",
    title: "Python Eğitimi",
    description:
      "Sıfırdan ileri seviyeye, 6 ders + 6 rehber. İnteraktif editörde pratik yaparak öğren.",
    gradient: "indigo-amber",
  },
  {
    href: "/python-online",
    icon: "🖥️",
    title: "Python Online Editör",
    description:
      "Kurulum yok, hesap yok. Tarayıcıda Python 3.12 kodu yaz, Pyodide ile anında çalıştır.",
    gradient: "amber-indigo",
  },
];
