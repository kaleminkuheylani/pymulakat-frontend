// /python-kodlari — Kod örnekleri koleksiyonu.
// Backend'den soru listesini çekip starter_code + örnek test case'leri
// gösterir. Tıklanınca ilgili soruya gider. SEO target: "python kodları".

import type { Metadata } from "next";
import Link from "next/link";
import { questionsAPI, categoriesAPI, type Question, type Category } from "../../api/v2/questions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Python Kodları — Örnekler ve Mülakat Soruları | PythonMulakat",
  description:
    "Python kodları örnekleri: başlangıçtan ileri seviyeye algoritmalar, veri yapıları, OOP. Her örnek için interaktif editör, açıklama ve test case'leri.",
  keywords: [
    "python kodları",
    "python kod örnekleri",
    "python örnek kod",
    "python basit kod örnekleri",
    "python algoritma kodları",
  ],
  alternates: {
    canonical: "https://pythonmulakat.com/python-kodlari",
  },
  openGraph: {
    title: "Python Kodları — Örnekler ve Mülakat Soruları",
    description: "Kategorize edilmiş Python kod örnekleri — interaktif editör + test case.",
    url: "https://pythonmulakat.com/python-kodlari",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
  },
};

// ─── Helpers ──────────────────────────────────────────────────

function difficultyColor(level: string | null | undefined): string {
  const l = (level || "").toLowerCase();
  if (l === "beginner" || l === "başlangıç") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
  if (l === "intermediate" || l === "orta") return "bg-amber-500/15 text-amber-300 border-amber-500/30";
  if (l === "advanced" || l === "ileri") return "bg-rose-500/15 text-rose-300 border-rose-500/30";
  return "bg-white/5 text-white/60 border-white/10";
}

function difficultyLabel(level: string | null | undefined): string {
  const l = (level || "").toLowerCase();
  if (l === "beginner" || l === "başlangıç") return "Başlangıç";
  if (l === "intermediate" || l === "orta") return "Orta";
  if (l === "advanced" || l === "ileri") return "İleri";
  return level || "Genel";
}

export default async function PythonKodlariPage() {
  let categories: Category[] = [];
  let featuredQuestions: Question[] = [];

  try {
    [categories, featuredQuestions] = await Promise.all([
      categoriesAPI.list().then((r) => r.data || []),
      questionsAPI.list({ limit: 30, page: 1 }).then((r) => {
        const data = Array.isArray(r) ? r : (r as any).items || (r as any).data || [];
        return data as Question[];
      }),
    ]);
  } catch (e) {
    console.warn("[python-kodlari] initial fetch failed", e);
  }

  // Slug fallback
  const slugOf = (q: Question): string =>
    q.slug || (q.title ? slugify(q.title) : String(q.id));

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/[çğıöşü]/g, (c) => ({ ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" }[c] || c))
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  // Group by category
  const byCategory = new Map<string, Question[]>();
  for (const q of featuredQuestions) {
    const cat = q.category || "python-basics";
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(q);
  }

  // 📌 FAQ JSON-LD — page-specific
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Python kodları örnekleri nereden bulunur?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "pythonmulakat.com/python-kodlari sayfasında kategorize edilmiş Python kod örneklerini bulabilirsiniz: başlangıç seviyesi string/liste işlemleri, orta seviye algoritmalar (two pointer, hash map), ileri seviye veri yapıları. Her örnek için starter kod, açıklama ve test case mevcuttur.",
        },
      },
      {
        "@type": "Question",
        name: "Python basit kod örnekleri nasıl çalışılır?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sayfadaki her soruyu tıklayın, interaktif editörde başlangıç kodunu inceleyin, istediğiniz gibi değiştirin ve ▶ Çalıştır'a basın. Kodunuz test case'lerle doğrulanır, sonuç anında ekranda görünür.",
        },
      },
      {
        "@type": "Question",
        name: "Mülakat için hangi Python algoritmaları bilinmeli?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mülakatlarda en sık sorulan algoritmalar: string işleme (palindrome, anagram), dizi işlemleri (two pointer, sliding window), arama (binary search), sıralama, hash map kullanımı, recursion ve temel dinamik programlama. Platformumuz bu kategorilerin hepsini kapsar.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen bg-[#050816] text-white">
        {/* Hero */}
        <header className="border-b border-white/10 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent">
          <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
            <nav className="text-xs text-white/40 mb-3">
              <Link href="/" className="hover:text-white/70">Ana Sayfa</Link>
              <span className="mx-2">/</span>
              <span className="text-white/60">Python Kodları</span>
            </nav>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
              Python Kodları
              <br />
              <span className="text-purple-400">Örneklerle Öğren</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed">
              Kategorize edilmiş Python kod örnekleri. Her örnek için starter
              kod, açıklama, zorluk seviyesi ve interaktif editör mevcut.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/interviews"
                className="px-5 py-2.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-white font-bold text-sm"
              >
                Tüm Sorular →
              </Link>
              <Link
                href="/python-online"
                className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/10"
              >
                🧪 Online Editör
              </Link>
              <Link
                href="/python-egitimi"
                className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/10"
              >
                🎓 Eğitim
              </Link>
            </div>
          </div>
        </header>

        {/* Kategori kartları */}
        {categories.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold mb-6">📂 Kategoriler</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/interviews/${c.slug}`}
                  className="block p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.07] hover:border-purple-500/30 transition-all group"
                >
                  <div
                    className="w-9 h-9 rounded-lg mb-2 flex items-center justify-center text-lg"
                    style={{
                      background: c.color ? `${c.color}25` : "rgba(168,85,247,0.15)",
                      borderColor: c.color || "rgba(168,85,247,0.3)",
                      border: "1px solid",
                    }}
                  >
                    {c.icon || "📘"}
                  </div>
                  <div className="font-bold text-white text-sm group-hover:text-purple-300">
                    {c.name}
                  </div>
                  <div className="text-[11px] text-white/40 mt-0.5">
                    {c.count} soru
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Öne çıkan kodlar */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold mb-2">💻 Öne Çıkan Kodlar</h2>
          <p className="text-sm text-white/50 mb-6">
            Her soruda başlangıç kodu (starter_code), açıklama ve test case'leri gör, tıkla ve interaktif editörde dene.
          </p>

          {featuredQuestions.length === 0 ? (
            <p className="text-white/50 py-8 text-center">
              Şu anda örnek yüklenemedi.{" "}
              <Link href="/interviews" className="text-purple-300 underline">
                Tüm sorulara göz at →
              </Link>
            </p>
          ) : (
            <div className="space-y-4">
              {featuredQuestions.map((q) => {
                const cat = q.category || "python-basics";
                const catName =
                  categories.find((c) => c.slug === cat)?.name || cat;
                const starterPreview = (q.starter_code || "")
                  .split("\n")
                  .slice(0, 4)
                  .join("\n");
                return (
                  <Link
                    key={q.id}
                    href={`/interviews/${cat}/${slugOf(q)}`}
                    className="block p-5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-purple-500/30 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                          {q.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-white/50">
                          <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                            {catName}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded border ${difficultyColor(q.level)}`}
                          >
                            {difficultyLabel(q.level)}
                          </span>
                          {q.test_count > 0 && (
                            <span className="text-white/40">{q.test_count} test</span>
                          )}
                        </div>
                      </div>
                      <span className="text-white/30 group-hover:text-purple-300 group-hover:translate-x-1 transition-all text-xl flex-shrink-0">→</span>
                    </div>
                    {q.description && (
                      <p className="text-sm text-white/60 line-clamp-2 mb-3">
                        {q.description}
                      </p>
                    )}
                    {starterPreview && (
                      <pre className="text-[11px] font-mono text-emerald-200 bg-black/30 border border-white/5 rounded-lg p-3 overflow-hidden">
                        <code>{starterPreview}{q.starter_code && q.starter_code.split("\n").length > 4 ? "\n..." : ""}</code>
                      </pre>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}