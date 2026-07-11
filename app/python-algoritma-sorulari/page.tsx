// /python-algoritma-sorulari — Python algoritma soruları kataloğu sayfası.
// Paylaşılan CategoryPageTemplate + QuestionListClient kullanır.

import type { Metadata } from "next";
import CategoryPageTemplate, { type RelatedCategory } from "../../components/CategoryPageTemplate";
import ServerQuestionList from "../../components/ServerQuestionList";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Python Algoritma Soruları — Pratik Yap, Anında Geri Bildirim Al",
  description:
    "Python algoritma soruları kataloğu. Sıralama, arama, dinamik programlama, graf ve string algoritmaları için 26+ interaktif soru. Tarayıcıda kod yaz, otomatik test et, yapay zekâdan geri bildirim al.",
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
  ],
  authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
  creator: "Python Mülakat",
  publisher: "Python Mülakat",
  alternates: {
    canonical: "https://pythonmulakat.com/python-algoritma-sorulari",
    languages: {
      "tr-TR": "https://pythonmulakat.com/python-algoritma-sorulari",
      "x-default": "https://pythonmulakat.com/python-algoritma-sorulari",
    },
  },
  openGraph: {
    title: "Python Algoritma Soruları — Pratik Yap, Anında Geri Bildirim Al",
    description:
      "Python algoritma soruları: sıralama, arama, DP, graf, string algoritmaları için 26+ interaktif soru. Tarayıcıda kod yaz, otomatik test et.",
    url: "https://pythonmulakat.com/python-algoritma-sorulari",
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
    description: "Sıralama, arama, DP, graf, string algoritmaları için 26+ soru. Tarayıcıda çöz.",
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
    { "@type": "ListItem", position: 3, name: "Python Algoritma Soruları", item: "https://pythonmulakat.com/python-algoritma-sorulari" },
  ],
};

const learningResourceJsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "@id": "https://pythonmulakat.com/python-algoritma-sorulari#learning-resource",
  name: "Python Algoritma Soruları — İnteraktif Pratik Koleksiyonu",
  description:
    "Python algoritma soruları için tarayıcı tabanlı, otomatik puanlanan, AI geri bildirimli interaktif pratik koleksiyonu. Sıralama, arama, dinamik programlama, graf ve string algoritmalarını kapsar.",
  url: "https://pythonmulakat.com/python-algoritma-sorulari",
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
    href: "/python-dinamik-programlama",
    icon: "🧠",
    title: "Python Dinamik Programlama",
    description:
      "Dinamik programlama soruları: fibonacci memoization, knapsack, edit distance, longest common subsequence.",
    gradient: "amber-indigo",
  },
  {
    href: "/interviews",
    icon: "📚",
    title: "Tüm Mülakat Kategorileri",
    description:
      "Python mülakat soruları kataloğu: OOP, SQLite, Pandas, veri yapıları ve daha fazlası.",
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
];

export default function PythonAlgoritmaSorulariPage() {
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
            <strong className="text-amber-400">26+ interaktif soru</strong>. Tarayıcıda kod yaz, otomatik test
            et, yapay zekâdan anında geri bildirim al.
          </>
        }
        tags={["Sıralama", "Arama", "Dinamik Programlama", "Graf", "String", "Matris"]}
        backHref="/interviews"
        backLabel="Tüm Kategoriler"
        related={related}
      >
        {/* algorithms + dynamic-programming — iki kategorinin tamamı algoritma kapsamında */}
        <ServerQuestionList
          category="algorithms"
          urlSlug="python-algoritma-sorulari"
          displaySlug="algorithms"
          skeletonCount={9}
        />
        <div className="mt-8 pt-8 border-t border-white/10">
          <ServerQuestionList
            category="dynamic-programming"
            urlSlug="python-dinamik-programlama"
            displaySlug="dynamic-programming"
            skeletonCount={6}
          />
        </div>
      </CategoryPageTemplate>
    </>
  );
}
