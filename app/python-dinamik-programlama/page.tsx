// /python-dinamik-programlama — Python dinamik programlama soruları kataloğu sayfası.
// Paylaşılan CategoryPageTemplate + QuestionListClient kullanır.
// CSV-FIRST: server-side CSV fetch, initialQuestions ile SSR HTML'e 22 DP basılıyor
// (Googlebot + no-JS kullanıcı için).

import type { Metadata } from "next";
import CategoryPageTemplate, { type RelatedCategory } from "../../components/CategoryPageTemplate";
import ServerQuestionList from "../../components/ServerQuestionList";

// Sayfa her istekte yeniden CSV çeker (1 saat Next cache'li).
// Yeni eklenen sorular max 1 saat gecikmeyle görünür.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Python Dinamik Programlama Soruları ve Çözümleri",
  description:
    "Python dinamik programlama soruları: Fibonacci, Knapsack, Coin Change, Edit Distance, LCS. Tarayıcıda çöz, AI geri bildirim al.",
  keywords: [
    "python dinamik programlama",
    "python dp",
    "python dynamic programming",
    "python memoization",
    "python tabulation",
    "python fibonacci memoization",
    "python knapsack problemi",
    "python coin change",
    "python edit distance",
    "python longest common subsequence",
    "python climbing stairs",
    "python house robber",
    "python dp soruları",
    "python mülakat soruları",
    "python mülakat hazırlık",
    "python online test çöz",
    "python dp alıştırma",
    "python dinamik programlama soruları çözümlü"

  ],
  authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
  creator: "Python Mülakat",
  publisher: "Python Mülakat",
  alternates: {
    canonical: "https://pythonmulakat.com/python-dinamik-programlama",
    languages: {
      "tr-TR": "https://pythonmulakat.com/python-dinamik-programlama",
      "x-default": "https://pythonmulakat.com/python-dinamik-programlama",
    },
  },
  openGraph: {
    title: "Python Dinamik Programlama Soruları ve Çözümleri",
    description:
      "Python dinamik programlama — Fibonacci, Knapsack, Coin Change, LCS. Tarayıcıda interaktif pratik, AI feedback.",
    url: "https://pythonmulakat.com/python-dinamik-programlama",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "https://pythonmulakat.com/og-default.png",
        width: 1200,
        height: 630,
        alt: "Python Dinamik Programlama — pythonmulakat.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Python Dinamik Programlama — İnteraktif Pratik",
    description: "Fibonacci, knapsack, edit distance, LCS. Memoization + tabulation örnekleri.",
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
    { "@type": "ListItem", position: 4, name: "Python Dinamik Programlama", item: "https://pythonmulakat.com/python-dinamik-programlama" },
  ],
};

const learningResourceJsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "@id": "https://pythonmulakat.com/python-dinamik-programlama#learning-resource",
  name: "Python Dinamik Programlama — İnteraktif Pratik Koleksiyonu",
  description:
    "Python dinamik programlama soruları için tarayıcı tabanlı, otomatik puanlanan, AI geri bildirimli interaktif pratik koleksiyonu. Memoization ve tabulation teknikleri, klasik DP problemleri.",
  url: "https://pythonmulakat.com/python-dinamik-programlama",
  educationalUse: "practice",
  learningResourceType: "interactive tutorial",
  audience: {
    "@type": "Audience",
    audienceType: "Python dinamik programlama soruları ile mülakata hazırlananlar",
  },
  teaches: [
    "Memoization (top-down DP)",
    "Tabulation (bottom-up DP)",
    "Fibonacci memoization",
    "0/1 Knapsack problemi",
    "Coin Change",
    "Edit Distance (Levenshtein)",
    "Longest Common Subsequence (LCS)",
    "Climbing Stairs, House Robber",
  ],
  isAccessibleForFree: true,
  inLanguage: "tr-TR",
};

const related: RelatedCategory[] = [
  {
    href: "/python-algoritma-sorulari",
    icon: "⚡",
    title: "Python Algoritma Soruları",
    description:
      "Sıralama, arama, DP, graf ve string algoritmaları için 26+ interaktif soru.",
    gradient: "indigo-amber",
  },
  {
    href: "/interviews",
    icon: "📚",
    title: "Tüm Mülakat Kategorileri",
    description:
      "Python mülakat soruları kataloğu: OOP, SQLite, Pandas, veri yapıları.",
    gradient: "amber-indigo",
  },
  {
    href: "/python-kodlari",
    icon: "📖",
    title: "Python Kodları",
    description:
      "Hazır Python kodu örnekleri: liste, dict, OOP, Pandas, Algoritmalar.",
    gradient: "indigo-amber",
  },
];

export default function PythonDinamikProgramlamaPage() {
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
        title="Python Dinamik Programlama"
        subtitle={
          <>
            Python dinamik programlama soruları ile mülakata hazırlan. Memoization (top-down) ve tabulation
            (bottom-up) teknikleriyle klasik DP problemlerini çöz:{" "}
            <strong className="text-amber-400">Fibonacci, 0/1 Knapsack, Coin Change, Edit Distance,
            Longest Common Subsequence, Climbing Stairs, House Robber</strong>. Tarayıcıda kod yaz, otomatik
            test et, yapay zekâdan anında geri bildirim al.
          </>
        }
        tags={["Memoization", "Tabulation", "Fibonacci", "Knapsack", "Edit Distance", "LCS", "Climbing Stairs", "House Robber"]}
        backHref="/python-algoritma-sorulari"
        backLabel="Python Algoritma Soruları"
        tagStyle="amber"
        related={related}
        beforeRelated={
          <section className="mt-16 pt-10 border-t border-white/10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Dinamik Programlama Nedir?</h2>
            <div className="prose prose-invert max-w-3xl text-white/70 leading-relaxed space-y-4">
              <p>
                <strong className="text-amber-400">Dinamik programlama (DP)</strong>, karmaşık problemleri
                daha küçük, örtüşen alt problemlere ayırarak çözen bir algoritma tekniğidir. Her alt problem
                yalnızca bir kez çözülür ve sonucu bir yerde saklanır (cache / memoization), böylece aynı
                alt problem tekrar hesaplanmaz. Bu yaklaşım, üssel zaman karmaşıklığına sahip problemleri
                polinom zamana indirgeyebilir.
              </p>
              <p>
                Python&apos;da dinamik programlama iki temel yaklaşımla uygulanır:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-white/70">
                <li>
                  <strong className="text-indigo-300">Memoization (top-down):</strong> Rekürsif çözüm,
                  sonuçları bir sözlükte (dict) saklar. Aynı alt problem tekrar geldiğinde sözlükten döner.
                  <code className="ml-2 px-2 py-0.5 rounded bg-white/5 text-amber-300">@lru_cache</code>{" "}
                  decorator&apos;ı ile tek satırda uygulanabilir.
                </li>
                <li>
                  <strong className="text-indigo-300">Tabulation (bottom-up):</strong> Yinelemeli (iterative)
                  çözüm, küçük alt problemlerden büyüğe doğru bir tablo doldurur. Genellikle bellek açısından
                  daha verimlidir.
                </li>
              </ul>
              <p>
                Klasik dinamik programlama problemleri arasında <em>Fibonacci</em>, <em>0/1 Knapsack</em>,
                <em>Coin Change</em>, <em>Edit Distance</em>, <em>Longest Common Subsequence</em> (LCS) ve
                <em>Longest Increasing Subsequence</em> (LIS) sayılabilir. Mülakatlarda en sık sorulan DP
                sorularından birkaçını yukarıda interaktif olarak çözebilirsin.
              </p>
            </div>
          </section>
        }
      >
        <ServerQuestionList
          category="dynamic-programming"
          urlSlug="python-dinamik-programlama"
          displaySlug="dynamic-programming"
          skeletonCount={6}
        />
      </CategoryPageTemplate>
    </>
  );
}
