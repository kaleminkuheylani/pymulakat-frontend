// /python-egitimi — Rehber hub landing page.
// Mevcut /guides verisini kategorize edip "öğrenme yol haritası" sunar.
// SEO target: "python eğitimi" (Ubersuggest 1.3K vol, SEO 18).

import type { Metadata } from "next";
import Link from "next/link";
import { tutorialsAPI, type Tutorial } from "../../api/v2/tutorials";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Python Eğitimi — Sıfırdan İleri Seviyeye Ücretsiz Rehberler",
  description:
    "Python eğitimi için ücretsiz Türkçe rehberler: başlangıç, orta, ileri seviye. Mülakat odaklı algoritma ve veri yapıları eğitimi, interaktif örnekler.",
  keywords: [
    "python eğitimi",
    "python öğren",
    "python dersleri",
    "python tutorial türkçe",
    "sıfırdan python",
    "python mülakat hazırlık",
  ],
  alternates: {
    canonical: "https://pythonmulakat.com/python-egitimi",
  },
  openGraph: {
    title: "Python Eğitimi — Ücretsiz Türkçe Rehberler",
    description: "Sıfırdan ileri seviyeye, mülakat odaklı Python eğitimi.",
    url: "https://pythonmulakat.com/python-egitimi",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Python Eğitimi — Ücretsiz Rehberler",
    description: "Sıfırdan ileri seviyeye, mülakat odaklı Python eğitimi.",
  },
};

// ─── Tutorial kategorize yardımcısı ──────────────────────────
function categorizeTutorials(tutorials: Tutorial[]) {
  const groups = {
    beginner: [] as Tutorial[],
    intermediate: [] as Tutorial[],
    advanced: [] as Tutorial[],
  };
  for (const t of tutorials) {
    const diff = (t.difficulty || "beginner").toLowerCase();
    if (diff === "advanced" || diff === "ileri") {
      groups.advanced.push(t);
    } else if (diff === "intermediate" || diff === "orta") {
      groups.intermediate.push(t);
    } else {
      groups.beginner.push(t);
    }
  }
  return groups;
}

const LEARNING_PATH: Array<{
  level: "beginner" | "intermediate" | "advanced";
  title: string;
  description: string;
  topics: string[];
  icon: string;
}> = [
  {
    level: "beginner",
    title: "Başlangıç",
    description: "Sıfırdan Python temelleri. Veri tipleri, kontrol yapıları, fonksiyonlar.",
    topics: ["String işlemleri", "Liste / Dict / Tuple", "Koşullar", "Döngüler"],
    icon: "🌱",
  },
  {
    level: "intermediate",
    title: "Orta",
    description: "Algoritma ve veri yapıları. Mülakatların çoğu bu seviyede.",
    topics: ["Two pointers", "Hash map", "Sorting", "Recursion"],
    icon: "🚀",
  },
  {
    level: "advanced",
    title: "İleri",
    description: "Optimizasyon, sistem tasarımı temelleri, performans analizi.",
    topics: ["Big O analizi", "Memoization", "Tree / Graph", "Concurrency"],
    icon: "⚡",
  },
];

export default async function PythonEgitimiPage() {
  let tutorials: Tutorial[] = [];
  try {
    tutorials = await tutorialsAPI.list();
  } catch {
    tutorials = [];
  }

  const grouped = categorizeTutorials(tutorials);
  const totalCount = tutorials.length;

  // 📌 FAQ JSON-LD — page-specific FAQ for rich results
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Python eğitimi için en iyi kaynak hangisidir?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Python eğitimi için en etkili yöntem interaktif pratiktir. pythonmulakat.com'daki rehberler algoritma, veri yapıları ve mülakat sorularına odaklanır; her rehberin yanında tarayıcıda çalışan interaktif editör ve test case'ler vardır. Ücretsiz hesap açıp ilerlemenizi takip edebilirsiniz.",
        },
      },
      {
        "@type": "Question",
        name: "Sıfırdan Python nasıl öğrenilir?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sıfırdan başlayanlar için önerilen yol: (1) değişkenler ve veri tipleri, (2) kontrol yapıları (if/else), (3) döngüler (for/while), (4) fonksiyonlar, (5) liste ve sözlük. Her adımı küçük kod örnekleriyle pekiştirin. pythonmulakat.com'daki Başlangıç kategorisindeki rehberler bu sırayı takip eder.",
        },
      },
      {
        "@type": "Question",
        name: "Python mülakatına kaç ayda hazırlanılır?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Temel bilgisi olan biri için 4-8 hafta yeterli. Yeni başlayanlar için 3-6 ay önerilir. Günde 1-2 saat pratik + haftada 5-10 algoritma sorusu çözmek sağlıklı bir tempodur. Platformumuzdaki 'Orta' seviye kategorisi tam bu süreç için tasarlandı.",
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
        <header className="border-b border-white/10 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent">
          <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
            <nav className="text-xs text-white/40 mb-3">
              <Link href="/" className="hover:text-white/70">Ana Sayfa</Link>
              <span className="mx-2">/</span>
              <span className="text-white/60">Python Eğitimi</span>
            </nav>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
              Python Eğitimi
              <br />
              <span className="text-amber-400">Sıfırdan İleri Seviyeye</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed">
              Mülakat odaklı, ücretsiz, Türkçe Python eğitimi rehberleri.
              Her konuda interaktif kod örnekleri, test case'leri ve gerçek
              mülakat sorularıyla pratik yap.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/interviews"
                className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#050816] font-bold text-sm"
              >
                📚 {totalCount}+ Soruyla Pratik Yap
              </Link>
              <Link
                href="/python-online"
                className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/10"
              >
                🧪 Python Online Editör
              </Link>
              <Link
                href="/python-kodlari"
                className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/10"
              >
                💻 Python Kodları
              </Link>
            </div>
          </div>
        </header>

        {/* Öğrenme yol haritası */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">📍 Öğrenme Yol Haritası</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LEARNING_PATH.map((step) => {
              const count = grouped[step.level].length;
              return (
                <div
                  key={step.level}
                  className="p-5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                >
                  <div className="text-3xl mb-2">{step.icon}</div>
                  <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                  <p className="text-sm text-white/60 mb-3">{step.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {step.topics.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-amber-300 font-semibold">
                    {count} rehber mevcut
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Rehberler listesi */}
        {totalCount > 0 ? (
          <section className="max-w-5xl mx-auto px-4 pb-16">
            <h2 className="text-2xl font-bold mb-6">📚 Tüm Rehberler</h2>
            <div className="space-y-3">
              {tutorials.map((t) => (
                <Link
                  key={t.id}
                  href={`/guides/${t.slug}`}
                  className="block p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-indigo-500/30 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white group-hover:text-amber-300 transition-colors">
                        {t.title}
                      </h3>
                      <p className="text-sm text-white/60 mt-1 line-clamp-2">
                        {t.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-white/40">
                        <span>{t.reading_time_minutes || 5} dk okuma</span>
                        {t.category && <span>· {t.category}</span>}
                        {t.difficulty && (
                          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase tracking-wider text-[10px]">
                            {t.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-white/30 group-hover:text-amber-300 group-hover:translate-x-1 transition-all">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section className="max-w-5xl mx-auto px-4 pb-16 text-center">
            <p className="text-white/50">Rehberler yükleniyor...</p>
            <Link href="/guides" className="text-amber-300 underline text-sm mt-2 inline-block">
              Rehberler sayfasını aç →
            </Link>
          </section>
        )}

        {/* CTA alt */}
        <section className="border-t border-white/10 bg-gradient-to-b from-transparent to-indigo-500/5">
          <div className="max-w-5xl mx-auto px-4 py-12 text-center">
            <h2 className="text-2xl font-bold mb-3">Pratik Yapmaya Hazır mısın?</h2>
            <p className="text-white/60 mb-6 max-w-2xl mx-auto">
              {totalCount}+ mülakat sorusu, online editör ve yapay zekâ destekli
              geri bildirim ile Python'unu geliştir.
            </p>
            <Link
              href="/interviews"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#050816] font-bold"
            >
              Sorulara Başla →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}