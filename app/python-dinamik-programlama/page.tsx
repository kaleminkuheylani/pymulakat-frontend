// /python-dinamik-programlama — Dinamik programlama soruları kataloğu sayfası.
// ACİL #1: Hedef keyword "Python dinamik programlama" için pillar-cluster sayfa.

import type { Metadata } from "next";
import Link from "next/link";
import DynamicProgrammingQuestionList from "./DynamicProgrammingQuestionList";

export const metadata: Metadata = {
  title: "Python Dinamik Programlama Soruları ve Çözümleri",
  description:
    "Python dinamik programlama soruları: Fibonacci memoization, 0/1 Knapsack, Coin Change, Edit Distance, Longest Common Subsequence, Climbing Stairs, House Robber. Tarayıcıda kod yaz, otomatik test et, yapay zekâdan geri bildirim al.",
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
      "Python dinamik programlama soruları: fibonacci, knapsack, edit distance, LCS, climbing stairs. Tarayıcıda interaktif pratik.",
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

export default function PythonDinamikProgramlamaPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* JSON-LD: BreadcrumbList + LearningResource */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }}
      />

      {/* ─── HEADER ──────────────────────────────────────── */}
      <header className="bg-[#0a0e1a]/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link
            href="/python-algoritma-sorulari"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-3 transition-colors"
          >
            ← Python Algoritma Soruları
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            Python Dinamik Programlama
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-3xl leading-relaxed">
            Python dinamik programlama soruları ile mülakata hazırlan. Memoization (top-down) ve tabulation
            (bottom-up) teknikleriyle klasik DP problemlerini çöz:{" "}
            <strong className="text-amber-400">Fibonacci, 0/1 Knapsack, Coin Change, Edit Distance,
            Longest Common Subsequence, Climbing Stairs, House Robber</strong>. Tarayıcıda kod yaz, otomatik
            test et, yapay zekâdan anında geri bildirim al.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Memoization", "Tabulation", "Fibonacci", "Knapsack", "Edit Distance", "LCS", "Climbing Stairs", "House Robber"].map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ─── SORU LİSTESİ ──────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <DynamicProgrammingQuestionList />

        {/* ─── DP NEDİR? — Kısa Açıklama (SEO içerik) ────────── */}
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

        {/* ─── İLGİLİ KATEGORİLER (İç linkleme) ──────────────── */}
        <section className="mt-12 pt-10 border-t border-white/10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">İlgili Kategoriler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Link
              href="/python-algoritma-sorulari"
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-indigo-400/40 transition-all"
            >
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-amber-400 transition-colors">
                Python Algoritma Soruları
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Sıralama, arama, DP, graf ve string algoritmaları için 26+ interaktif soru.
              </p>
            </Link>
            <Link
              href="/interviews"
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-indigo-400/40 transition-all"
            >
              <div className="text-3xl mb-3">📚</div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-amber-400 transition-colors">
                Tüm Kategoriler
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Python mülakat soruları kataloğu: OOP, SQLite, Pandas, veri yapıları.
              </p>
            </Link>
            <Link
              href="/python-kodlari"
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-indigo-400/40 transition-all"
            >
              <div className="text-3xl mb-3">📖</div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-amber-400 transition-colors">
                Python Kodları
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Hazır Python kodu örnekleri: liste, dict, OOP, Pandas, Algoritmalar.
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
