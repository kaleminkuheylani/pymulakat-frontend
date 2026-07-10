// /python-algoritma-sorulari — Algoritma soruları kataloğu sayfası.
// ACİL #2: Hedef keyword "Python algoritma soruları" için pillar-cluster sayfa.
// Server-side fetch (next/headers cache) — en iyi SEO + Lighthouse.

import type { Metadata } from "next";
import Link from "next/link";
import AlgorithmQuestionList from "./AlgorithmQuestionList";

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

export default function PythonAlgoritmaSorulariPage() {
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
            href="/interviews"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-3 transition-colors"
          >
            ← Tüm Kategoriler
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            Python Algoritma Soruları
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-3xl leading-relaxed">
            Python algoritma soruları ile mülakata hazırlan. Sıralama, arama, dinamik programlama, graf ve string
            algoritmaları için{" "}
            <strong className="text-amber-400">26+ interaktif soru</strong>. Tarayıcıda kod yaz, otomatik test
            et, yapay zekâdan anında geri bildirim al.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Sıralama", "Arama", "Dinamik Programlama", "Graf", "String", "Matris"].map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ─── SORU LİSTESİ ──────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <AlgorithmQuestionList />

        {/* ─── İLGİLİ KATEGORİLER (İç linkleme) ──────────────── */}
        <section className="mt-16 pt-10 border-t border-white/10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">İlgili Kategoriler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Link
              href="/python-dinamik-programlama"
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-amber-400/40 transition-all"
            >
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-amber-400 transition-colors">
                Python Dinamik Programlama
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Dinamik programlama soruları: fibonacci memoization, knapsack, edit distance, longest common subsequence.
              </p>
            </Link>
            <Link
              href="/interviews"
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-amber-400/40 transition-all"
            >
              <div className="text-3xl mb-3">📚</div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-amber-400 transition-colors">
                Tüm Kategoriler
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Python mülakat soruları kataloğu: OOP, SQLite, Pandas, veri yapıları ve daha fazlası.
              </p>
            </Link>
            <Link
              href="/python-kodlari"
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-amber-400/40 transition-all"
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
