// app/guides/page.tsx
// Tüm rehberlerin listesi

import type { Metadata } from "next";
import Link from "next/link";
import { tutorialsAPI, type Tutorial } from "../../api/v2/tutorials";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Python Rehberleri — Mülakat Hazırlık Kılavuzları | PythonMulakat",
  description:
    "Python mülakat soruları için uzun form rehberler: palindrome, FizzBuzz, binary search, pandas groupby ve daha fazlası. Türkçe, derinlemesine açıklamalar.",
  keywords: "python rehber, python mülakat, python tutorial, türkçe python",
  alternates: {
    canonical: "https://pythonmulakat.com/guides",
  },
  openGraph: {
    title: "Python Rehberleri — PythonMulakat",
    description: "Python mülakat soruları için uzun form Türkçe rehberler.",
    url: "https://pythonmulakat.com/guides",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
  },
};

// ─── Fallback tutorial listesi (DB'den çekilemezse) ───────
const FALLBACK_TUTORIALS: Tutorial[] = [
  {
    id: 1,
    slug: "python-palindrome-cozum",
    title: "Python'da Palindrome Kontrolü — 3 Farklı Yaklaşım",
    description:
      "String slicing, iki pointer ve regex yaklaşımlarıyla palindrome kontrolü. Python mülakatlarının en sık sorulan sorusudur.",
    content_md: "",
    category: "python-basics",
    difficulty: "beginner",
    reading_time_minutes: 8,
    related_question_ids: [1, 3, 51],
    faq: [],
    view_count: 0,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    slug: "python-fizzbuzz-algoritma",
    title: "FizzBuzz Algoritması — Python'da Junior Mülakat Sorusu",
    description:
      "FizzBuzz, programlama dünyasının 'Hello World'üdür. Sıralama önemi, tek satır çözüm ve edge case'ler.",
    content_md: "",
    category: "python-basics",
    difficulty: "beginner",
    reading_time_minutes: 6,
    related_question_ids: [2, 53],
    faq: [],
    view_count: 0,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    slug: "python-binary-search",
    title: "İkili Arama (Binary Search) — O(log n) Performans",
    description:
      "Sıralı dizide hedef bulmanın en hızlı yolu. Algoritma mantığı, recursion vs iteration, gerçek dünya kullanımı.",
    content_md: "",
    category: "algorithms",
    difficulty: "intermediate",
    reading_time_minutes: 10,
    related_question_ids: [14, 302, 23],
    faq: [],
    view_count: 0,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    slug: "python-asal-sayi-algoritma",
    title: "Asal Sayı Algoritmaları — Naive'den Eratosthenes'e",
    description:
      "Asal sayı kontrolü, Eratosthenes eleği ve performans optimizasyonu. Kriptografi temeli.",
    content_md: "",
    category: "algorithms",
    difficulty: "intermediate",
    reading_time_minutes: 12,
    related_question_ids: [9, 11],
    faq: [],
    view_count: 0,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    slug: "python-obeb-oklid",
    title: "Öklid Algoritması — OBEB (EBOB) Hesaplama",
    description:
      "İki sayının en büyük ortak bölenini O(log n) sürede hesaplayın. Kriptografi ve matematik temeli.",
    content_md: "",
    category: "algorithms",
    difficulty: "intermediate",
    reading_time_minutes: 8,
    related_question_ids: [11, 16],
    faq: [],
    view_count: 0,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    slug: "python-two-sum",
    title: "Two Sum — En Klasik Mülakat Sorusu",
    description:
      "Brute force'dan hash map'e. O(n²)'den O(n)'ye nasıl düşürülür? Three Sum, Four Sum varyasyonları.",
    content_md: "",
    category: "algorithms",
    difficulty: "beginner",
    reading_time_minutes: 7,
    related_question_ids: [301, 303],
    faq: [],
    view_count: 0,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 7,
    slug: "pandas-groupby-rehberi",
    title: "Pandas GroupBy — Split-Apply-Combine Deseni",
    description:
      "Pandas'ın en güçlü fonksiyonu. SQL GROUP BY karşılığı, çoklu aggregation, transform vs aggregate.",
    content_md: "",
    category: "pandas",
    difficulty: "intermediate",
    reading_time_minutes: 15,
    related_question_ids: [202, 205, 207],
    faq: [],
    view_count: 0,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

async function fetchTutorials(): Promise<Tutorial[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";
    const res = await fetch(`${apiUrl}/api/v2/tutorials`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return FALLBACK_TUTORIALS;
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.data || [];
    return list.length > 0 ? list : FALLBACK_TUTORIALS;
  } catch {
    return FALLBACK_TUTORIALS;
  }
}

export default async function GuidesPage() {
  const tutorials = await fetchTutorials();

  // Kategoriye göre grupla
  const byCategory = tutorials.reduce<Record<string, Tutorial[]>>((acc, t) => {
    const cat = t.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {});

  const categoryOrder = ["python-basics", "data-structures", "list-dict", "algorithms", "pandas", "other"];
  const categoryLabels: Record<string, { name: string; icon: string; color: string }> = {
    "python-basics": { name: "Python Temelleri", icon: "🐍", color: "text-emerald-400" },
    "data-structures": { name: "Veri Yapıları", icon: "🗂️", color: "text-amber-400" },
    "list-dict": { name: "Liste & Sözlük", icon: "📋", color: "text-purple-400" },
    algorithms: { name: "Algoritmalar", icon: "🧮", color: "text-orange-400" },
    pandas: { name: "Pandas", icon: "🐼", color: "text-pink-400" },
    other: { name: "Diğer", icon: "📚", color: "text-white/60" },
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0e1a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">
            🐍 PythonMulakat
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/interviews" className="text-white/60 hover:text-white transition-colors">
              Sorular
            </Link>
            <Link href="/guides" className="text-indigo-400 font-semibold">
              Rehberler
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Python Mülakat Rehberleri
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Her rehber, bir algoritma veya konuyu derinlemesine anlatır.
            <br />
            Kod örnekleri, performans analizi, gerçek dünya kullanımı ve{" "}
            <span className="text-indigo-400">ilgili mülakat soruları</span> ile pratik.
          </p>
        </div>

        {/* Kategori grupları */}
        {categoryOrder.map((cat) => {
          const items = byCategory[cat];
          if (!items?.length) return null;
          const meta = categoryLabels[cat];
          return (
            <section key={cat} className="mb-12">
              <h2 className="text-2xl font-bold mb-5 flex items-center gap-2.5">
                <span>{meta.icon}</span>
                <span className={meta.color}>{meta.name}</span>
                <span className="text-sm font-normal text-white/40">
                  ({items.length})
                </span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/guides/${t.slug}`}
                    className="group p-5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-indigo-500/40 transition-all"
                  >
                    <h3 className="font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors leading-snug">
                      {t.title}
                    </h3>
                    <p className="text-sm text-white/60 line-clamp-2 leading-relaxed mb-3">
                      {t.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-white/40">
                      <span>⏱️ {t.reading_time_minutes} dk</span>
                      {t.difficulty && (
                        <span className="px-2 py-0.5 rounded bg-white/5 capitalize">
                          {t.difficulty}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <section className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-indigo-500/30 text-center">
          <h3 className="text-2xl font-bold mb-3">Hazır mısın?</h3>
          <p className="text-white/70 mb-5 max-w-xl mx-auto">
            Rehberlerden öğrendiklerini {tutorials.length}+ mülakat sorusu üzerinde pekiştir.
          </p>
          <Link
            href="/interviews"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors"
          >
            Sorulara Başla →
          </Link>
        </section>
      </main>
    </div>
  );
}