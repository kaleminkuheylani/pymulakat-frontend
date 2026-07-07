// /python-egitimi — Öğrenme yol haritası (rehberler kaldırıldı, konsept bazlı).
// SEO target: "python eğitimi" (Ubersuggest 1.3K vol, SEO 18, ₺61 CPC).

import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Python Eğitimi — Sıfırdan İleri Seviyeye Yol Haritası",
  description:
    "Python eğitimi için yapılandırılmış öğrenme yol haritası. Başlangıç, orta ve ileri seviye konular — sıfırdan mülakata hazırlık.",
  keywords: [
    "python eğitimi",
    "python öğren",
    "python dersleri",
    "python tutorial türkçe",
    "sıfırdan python",
    "python mülakat hazırlık",
    "python öğrenme yolu",
  ],
  alternates: {
    canonical: "https://pythonmulakat.com/python-egitimi",
  },
  openGraph: {
    title: "Python Eğitimi — Sıfırdan İleri Seviyeye",
    description: "Yapılandırılmış Python öğrenme yol haritası.",
    url: "https://pythonmulakat.com/python-egitimi",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
  },
};

// ─── Statik öğrenme yol haritası — rehber verisine bağlı değil ──────
const LEARNING_PATH: Array<{
  level: "beginner" | "intermediate" | "advanced";
  title: string;
  description: string;
  topics: string[];
  href: string;
  icon: string;
}> = [
  {
    level: "beginner",
    title: "Başlangıç",
    description: "Sıfırdan Python temelleri. Veri tipleri, kontrol yapıları, fonksiyonlar.",
    topics: ["String işlemleri", "Liste / Dict / Tuple", "Koşullar", "Döngüler"],
    href: "/interviews/python-basics",
    icon: "🌱",
  },
  {
    level: "intermediate",
    title: "Orta",
    description: "Algoritma ve veri yapıları. Mülakatların çoğu bu seviyede.",
    topics: ["Two pointers", "Hash map", "Sorting", "Recursion"],
    href: "/interviews/algorithms",
    icon: "🚀",
  },
  {
    level: "advanced",
    title: "İleri",
    description: "Optimizasyon, performans analizi, kütüphane kullanımı.",
    topics: ["Big O analizi", "Memoization", "Pandas", "Concurrency"],
    href: "/interviews/pandas",
    icon: "⚡",
  },
];

// ─── Modül listesi — kategorileri bağımsız öğrenme adımları olarak sun ──
const MODULES: Array<{ title: string; description: string; href: string; icon: string }> = [
  {
    title: "Python Temelleri",
    description: "Değişkenler, veri tipleri, operatörler, string işlemleri.",
    href: "/interviews/python-basics",
    icon: "📘",
  },
  {
    title: "Liste, Sözlük, Tuple, Set",
    description: "Veri yapıları üzerinde iteration, comprehension, mutation.",
    href: "/interviews/list-dict",
    icon: "📚",
  },
  {
    title: "Algoritmalar",
    description: "Two pointer, sliding window, sorting, searching, recursion.",
    href: "/interviews/algorithms",
    icon: "🧠",
  },
  {
    title: "Pandas & Veri Bilimi",
    description: "DataFrame, groupby, merge, apply — gerçek veri setleri üzerinde pratik.",
    href: "/interviews/pandas",
    icon: "🐼",
  },
  {
    title: "Online Pratik",
    description: "Soruya bağlı olmadan, kurulumsuz Python yaz ve çalıştır.",
    href: "/python-online",
    icon: "🧪",
  },
  {
    title: "Kod Örnekleri",
    description: "Kategorize edilmiş starter kodlar — kopyala, çalıştır, öğren.",
    href: "/python-kodlari",
    icon: "💻",
  },
];

export default function PythonEgitimiPage() {
  // 📌 FAQ JSON-LD — page-specific FAQ for rich results
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Python eğitimi için en iyi yöntem hangisidir?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Python eğitimi için en etkili yöntem interaktif pratiktir: önce konuyu kavramsal öğren, hemen ardından tarayıcıdaki editörde kod yaz, test case'lerle doğrula. pythonmulakat.com bu yapıyı ücretsiz sağlar — başlangıç soruları, orta seviye algoritmalar, ileri veri bilimi konuları ve online editör.",
        },
      },
      {
        "@type": "Question",
        name: "Sıfırdan Python nasıl öğrenilir?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sıfırdan başlayanlar için önerilen sıra: (1) değişkenler ve veri tipleri, (2) kontrol yapıları (if/else), (3) döngüler (for/while), (4) fonksiyonlar, (5) liste ve sözlük. Her adımı küçük kod örnekleriyle pekiştirin. pythonmulakat.com/python-egitimi sayfasındaki 'Başlangıç' modülü bu sırayı takip eder.",
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
              Yapılandırılmış öğrenme yol haritası. Her seviyede gerçek
              sorularla pratik yap — kurulum yok, doğrudan tarayıcıda.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/interviews/python-basics"
                className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#050816] font-bold text-sm"
              >
                🌱 Başlangıçtan Başla
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
            {LEARNING_PATH.map((step) => (
              <Link
                key={step.level}
                href={step.href}
                className="block p-5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-indigo-500/30 transition-all group"
              >
                <div className="text-3xl mb-2">{step.icon}</div>
                <h3 className="text-lg font-bold mb-1 group-hover:text-amber-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-white/60 mb-3">{step.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {step.topics.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-amber-300 font-semibold mt-3 group-hover:translate-x-1 transition-transform">
                  Bu seviyeye geç →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Modüller */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold mb-2">📚 Modüller</h2>
          <p className="text-sm text-white/50 mb-6">
            Her modül ilgili soru kategorisine bağlı. Birinden başla, diğerlerine geç.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MODULES.map((m) => (
              <Link
                key={m.title}
                href={m.href}
                className="block p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.07] hover:border-indigo-500/30 transition-all group"
              >
                <div className="text-2xl mb-2">{m.icon}</div>
                <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  {m.description}
                </p>
                <span className="text-[11px] text-amber-300/70 mt-2 inline-block group-hover:translate-x-1 transition-transform">
                  Modüle git →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA alt */}
        <section className="border-t border-white/10 bg-gradient-to-b from-transparent to-indigo-500/5">
          <div className="max-w-5xl mx-auto px-4 py-12 text-center">
            <h2 className="text-2xl font-bold mb-3">Pratik Yapmaya Hazır mısın?</h2>
            <p className="text-white/60 mb-6 max-w-2xl mx-auto">
              Yüzlerce mülakat sorusu, online editör ve yapay zekâ destekli
              geri bildirim ile Python'unu geliştir.
            </p>
            <Link
              href="/interviews"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#050816] font-bold"
            >
              Tüm Sorulara Göz At →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}