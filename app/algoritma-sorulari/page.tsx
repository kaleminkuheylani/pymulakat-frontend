// /algoritma-sorulari — Python algoritma soruları kataloğu sayfası.
// Paylaşılan CategoryPageTemplate + QuestionListClient kullanır.
import { BookOpen, Brain, Layers } from "lucide-react";
import { getTotalQuestionCount, getCategoryCount } from "@/lib/api/questionAPI";

import type { Metadata } from "next";
import CategoryPageTemplate, { type RelatedCategory } from "../../components/CategoryPageTemplate";
import ServerQuestionList from "../../components/ServerQuestionList";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Python Algoritma Soruları ve Çözümleri",
  description:
    "Python algoritma soruları: sıralama, arama, dinamik programlama, graf, string. Tarayıcıda interaktif çöz, AI feedback.",
  keywords: [
    "python algoritma soruları",
    "python algoritma",
    "python algoritmaları",
    "python sıralama algoritmaları",
    "python arama algoritmaları",
    "python bubble sort",
    "python merge sort",
    "python quick sort",
    "python binary search",
    "python graf algoritmaları",
    "python string algoritmaları",
    "python mülakat algoritma",
    "python mülakat soruları",
    "python mülakat hazırlık",
    "python online test çöz",
    "python pratik soruları",
    "python alıştırma soruları"

  ],
  authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
  creator: "Python Mülakat",
  publisher: "Python Mülakat",
  alternates: {
    canonical: "https://pythonmulakat.com/algoritma-sorulari",
    languages: {
      "tr-TR": "https://pythonmulakat.com/algoritma-sorulari",
      "x-default": "https://pythonmulakat.com/algoritma-sorulari",
    },
  },
  openGraph: {
    title: "Python Algoritma Soruları — Pratik Yap, Anında Geri Bildirim Al",
    description:
      "Python algoritma soruları — tarayıcı tabanlı, AI feedback'li interaktif pratik.",
    url: "https://pythonmulakat.com/algoritma-sorulari",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "https://pythonmulakat.com/og-default.png",
        width: 1200,
        height: 630,
        alt: "Python Algoritma Soruları — pythonmulakat.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Python Algoritma Soruları — İnteraktif Pratik",
    description: "Sıralama, arama, DP, graf, string algoritmaları için {countAlgorithms} soru. Tarayıcıda çöz.",
    images: ["https://pythonmulakat.com/og-default.png"],
    creator: "@pythonmulakat",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://pythonmulakat.com/" },
    { "@type": "ListItem", position: 2, name: "Mülakat Soruları", item: "https://pythonmulakat.com/interviews" },
    { "@type": "ListItem", position: 3, name: "Python Algoritma Soruları", item: "https://pythonmulakat.com/algoritma-sorulari" },
  ],
};

const learningResourceJsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "@id": "https://pythonmulakat.com/algoritma-sorulari#learning-resource",
  name: "Python Algoritma Soruları — İnteraktif Pratik Koleksiyonu",
  description:
    "Python algoritma soruları için tarayıcı tabanlı, otomatik puanlanan, AI geri bildirimli interaktif pratik koleksiyonu. Sıralama, arama, dinamik programlama, graf ve string algoritmalarını kapsar.",
  url: "https://pythonmulakat.com/algoritma-sorulari",
  educationalUse: "practice",
  learningResourceType: "interactive tutorial",
  audience: {
    "@type": "Audience",
    audienceType: "Python algoritma soruları ile mülakata hazırlananlar",
  },
  teaches: [
    "Sıralama algoritmaları (bubble, merge, quick sort)",
    "Arama algoritmaları (linear, binary search)",
    "Dinamik programlama (memoization, tabulation)",
    "Graf algoritmaları (BFS, DFS, shortest path)",
    "String algoritmaları (anagram, palindrome, edit distance)",
  ],
  isAccessibleForFree: true,
  inLanguage: "tr-TR",
};

// Bu sayfada gösterilecek ilgili kategoriler — DP, tüm kategoriler, kodlar
const related: RelatedCategory[] = [
  {
    href: "/dinamik-programlama",
    icon: Brain,
    title: "Python Dinamik Programlama",
    description:
      "Dinamik programlama soruları: fibonacci memoization, knapsack, edit distance, longest common subsequence.",
    gradient: "amber-indigo",
  },
  {
    href: "/interviews",
    icon: Layers,
    title: "Tüm Mülakat Kategorileri",
    description:
      "Python mülakat soruları kataloğu: OOP, SQLite, Pandas, veri yapıları ve daha fazlası.",
    gradient: "indigo-amber",
  },
  {
    href: "/python-kodlari",
    icon: BookOpen,
    title: "Python Kodları",
    description:
      "Hazır Python kodu örnekleri: liste, dict, OOP, Pandas, Algoritmalar. Kopyala, çalıştır, öğren.",
    gradient: "amber-indigo",
  },
];

export default async function PythonAlgoritmaSorulariPage() {
  const totalCount = await getTotalQuestionCount();
  const countAlgorithms = await getCategoryCount("algorithms");
  const countDynamicProgramming = await getCategoryCount("dynamic-programming");

  return (
    <>
      {/* JSON-LD: BreadcrumbList + LearningResource */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }}
      />

      <CategoryPageTemplate
        title="Python Algoritma Soruları"
        subtitle={
          <>
            Python algoritma soruları ile mülakata hazırlan. Sıralama, arama, dinamik programlama, graf ve string
            algoritmaları için{" "}
            <strong className="text-amber-400">{countAlgorithms}+ interaktif soru</strong>. Tarayıcıda kod yaz, otomatik test
            et, yapay zekâdan anında geri bildirim al.
          </>
        }
        tags={["Sıralama", "Arama", "Dinamik Programlama", "Graf", "String", "Matris"]}
        backHref="/interviews"
        backLabel="Tüm Kategoriler"
        related={related}
      >
        {/* algorithms — bu sayfa sadece algorithms kategorisini gösterir (26 soru).
            dynamic-programming ayrı /dinamik-programlama sayfasında. */}
        <ServerQuestionList
          category="algorithms"
          urlSlug="algoritma-sorulari"
          displaySlug="algorithms"
          skeletonCount={9}
        />
      </CategoryPageTemplate>
    </>
  );
}
