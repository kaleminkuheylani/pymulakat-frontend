// /junior-python-mulakat — Junior Python Developer mülakat hazırlık landing page
// SEO: "junior python developer mülakat soruları" keyword cluster

import type { Metadata } from "next";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";

export const metadata: Metadata = {
  title: "Junior Python Developer Mülakat Soruları 2026 — Türkçe Pratik",
  description:
    "Junior Python developer mülakat soruları ve cevapları. 132 gerçek sınav sorusu, 9 kategori, tarayıcıda pratik. İlk iş ilanına 2-3 ay.",
  keywords: [
    "junior python developer mülakat soruları",
    "python junior mülakat hazırlık",
    "python başlangıç mülakat",
    "junior python interview questions",
    "python mülakat soruları türkçe",
  ],
  alternates: {
    canonical: "https://pythonmulakat.com/junior-python-mulakat",
  },
  openGraph: {
    title: "Junior Python Developer Mülakat Soruları 2026",
    description: "132 gerçek sınav sorusu, 9 kategori. Tarayıcıda pratik.",
    url: "https://pythonmulakat.com/junior-python-mulakat",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "https://pythonmulakat.com/og-default.png",
        width: 1200,
        height: 630,
        alt: "Junior Python Developer Mülakat Hazırlık Platformu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Junior Python Mülakat Hazırlık",
    description: "132 gerçek sınav sorusu, tarayıcıda pratik. Ücretsiz.",
    images: ["https://pythonmulakat.com/og-default.png"],
  },
};

// Junior-specific kategori seti
const JUNIOR_CATEGORIES = [
  {
    slug: "python-basics",
    label: "Python Temelleri",
    icon: "🐍",
    desc: "Değişkenler, döngüler, koşullar, fonksiyonlar.",
    count: 34,
    difficulty: "Başlangıç",
  },
  {
    slug: "data-structures",
    label: "Veri Yapıları",
    icon: "🗂️",
    desc: "List, dict, tuple, set — veri yapısını sen seç.",
    count: 21,
    difficulty: "Başlangıç",
  },
  {
    slug: "list-dict",
    label: "Liste & Sözlük",
    icon: "📋",
    desc: "Liste ve sözlük ile günlük problem çözümleri.",
    count: 8,
    difficulty: "Başlangıç",
  },
  {
    slug: "pandas",
    label: "Pandas Temelleri",
    icon: "🐼",
    desc: "Veri analizi, groupby, merge, temel pandas.",
    count: 13,
    difficulty: "Orta",
  },
  {
    slug: "oop",
    label: "Nesne Yönelimli Python",
    icon: "🧬",
    desc: "Class, __init__, inheritance, encapsulation.",
    count: 12,
    difficulty: "Orta",
  },
];

const FAQ_ITEMS = [
  {
    q: "Junior Python mülakatında hangi konular soruluyor?",
    a: "Junior pozisyonları için en sık sorulan 5 konu: (1) Python temelleri (değişkenler, döngüler, fonksiyonlar), (2) veri yapıları (list, dict, tuple, set), (3) string işlemleri (ters çevirme, palindrom kontrolü), (4) temel algoritmalar (sıralama, arama), (5) dosya okuma/yazma ve JSON işlemleri. Platformumuzda 9 kategoride toplam 132 soru var, hepsi tarayıcıda pratik yapılabilir.",
  },
  {
    q: "Junior Python developer olarak iş bulmak ne kadar sürer?",
    a: "3-6 aylık düzenli pratik genelde yeterli. Önerilen plan: (1) python-basics (34 soru) + data-structures (21 soru) kategorilerini bitir. (2) Pandas'a geç. (3) Mini proje yap (örn: CLI todo uygulaması). (4) GitHub'da paylaş. Platformumuzdaki 132 soruyu haftada 10-15 çözerek 2-3 ayda tamamlanır.",
  },
  {
    q: "Python mülakatında Python bilgisi mi yoksa algoritma mı soruluyor?",
    a: "Junior pozisyonlarında Python bilgisi ağırlıklı (%60-70) soruluyor: list/dict kullanımı, comprehension, OOP temelleri. Algoritma soruları ise başlangıç düzeyinde: sıralama, arama, basit string işlemleri. İleri algoritma (DP, heap, graph) genelde orta ve senior pozisyonlar için. Yeni başlayanlar /interviews/python-basics ve /interviews/data-structures ile başlamalı.",
  },
  {
    q: "Kurulum gerekiyor mu? Tarayıcıda direkt pratik yapabilir miyim?",
    a: "Hayır. Python, Pyodide, pip veya herhangi bir kütüphane kurmana gerek yok. pythonmulakat.com tamamen tarayıcı tabanlı. /python-online sayfasındaki editörde Python 3.12 kodu yazıp anında çalıştırabilirsin. Çıktıyı, hata varsa traceback'i aynı sayfada görürsün. Misafir olarak bile pratik yapabilirsin (kodu çalıştırmak için giriş gerekir, ama test case'leri okuyabilirsin).",
  },
];

export default function JuniorPythonPage() {
  // JSON-LD: FAQPage + EducationalOrganization
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const landingSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Junior Python Developer Mülakat Hazırlığı",
    description:
      "Junior Python developer pozisyonları için sıfırdan kapsamlı mülakat hazırlık kursu. 132 gerçek dünya sorusu, 9 kategori, tarayıcı tabanlı pratik.",
    provider: { "@type": "Organization", name: "PythonMulakat", url: "https://pythonmulakat.com" },
    educationalLevel: "Beginner",
    inLanguage: "tr-TR",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      location: { "@type": "VirtualLocation", url: "https://pythonmulakat.com/junior-python-mulakat" },
    },
  };

  const totalCount = JUNIOR_CATEGORIES.reduce((acc, c) => acc + c.count, 0);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingSchema) }} />

      <div className="min-h-screen bg-[#050816] text-white">
        {/* Hero */}
        <header className="border-b border-white/10 bg-[#0a0e1a]/80 backdrop-blur">
          <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
            <div className="text-sm uppercase tracking-wider text-purple-400 mb-3 font-semibold">
              JUNIOR PYTHON HAZIRLIK
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
              Junior Python Developer Mülakatına{" "}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                2-3 Ayda Hazırlan
              </span>
            </h1>
            <p className="text-lg text-white/70 mb-6 leading-relaxed max-w-2xl">
              Gerçek mülakatlardan derlenmiş {totalCount}+ soru. Tarayıcıda direkt çalıştır.
              Kurulum yok, hesap açmadan başla.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/interviews/python-basics"
                className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold rounded-lg transition-all shadow-lg shadow-purple-500/30"
              >
                🚀 Hemen Başla
              </Link>
              <Link
                href="/python-egitimi"
                className="px-5 py-2.5 border border-white/20 text-white/80 hover:border-white/40 hover:text-white font-medium rounded-lg transition-all"
              >
                📚 Önce Eğitimi Tamamla
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-10 space-y-12">
          {/* Stats banner */}
          <section className="grid grid-cols-3 gap-4 text-center">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-3xl font-bold text-purple-400">{totalCount}+</div>
              <div className="text-xs text-white/60 mt-1">Soru</div>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-3xl font-bold text-indigo-400">9</div>
              <div className="text-xs text-white/60 mt-1">Kategori</div>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-3xl font-bold text-emerald-400">%100</div>
              <div className="text-xs text-white/60 mt-1">Ücretsiz</div>
            </div>
          </section>

          {/* Junior Kategoriler */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Junior İçin Kritik Kategoriler</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {JUNIOR_CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/interviews/${c.slug}`}
                  className="p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20 hover:border-purple-400/40 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{c.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">
                          {c.label}
                        </h3>
                        <span className="text-xs text-white/40">{c.count} soru</span>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed mb-1.5">{c.desc}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-200">
                        {c.difficulty}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Plan */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Önerilen 3 Aylık Plan</h2>
            <div className="space-y-3">
              {[
                {
                  week: "Hafta 1-2",
                  title: "Python Temelleri",
                  desc: "python-basics (34 soru). Değişkenler, döngüler, fonksiyonlar.",
                  color: "emerald",
                },
                {
                  week: "Hafta 3-4",
                  title: "Veri Yapıları",
                  desc: "data-structures (21 soru) + list-dict (8 soru). List/dict operasyonları.",
                  color: "indigo",
                },
                {
                  week: "Hafta 5-6",
                  title: "OOP ve Pandas",
                  desc: "OOP (12 soru) + pandas (13 soru). Nesne yönelimli programlama, veri analizi.",
                  color: "purple",
                },
                {
                  week: "Hafta 7-8",
                  title: "Algoritmalar — Başlangıç",
                  desc: "algorithms (26 soru). Sıralama, arama, string işlemleri.",
                  color: "amber",
                },
                {
                  week: "Hafta 9-12",
                  title: "Mini Proje + Mülakat",
                  desc: "Kendi projen (todo, scraper, hesap makinesi) ve gerçek mülakat simülasyonu.",
                  color: "rose",
                },
              ].map((step, i) => (
                <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-bold text-white">{step.title}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/50">
                        {step.week}
                      </span>
                    </div>
                    <p className="text-sm text-white/65">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Cross-links */}
          <section className="grid sm:grid-cols-3 gap-3">
            <Link
              href="/python-egitimi"
              className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:border-indigo-400/40 transition-all"
            >
              <div className="text-2xl mb-1">📚</div>
              <h3 className="font-bold text-white mb-1">Eğitim</h3>
              <p className="text-xs text-white/60">6 derslik sıralı yol haritası</p>
            </Link>
            <Link
              href="/python-kodlari"
              className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:border-amber-400/40 transition-all"
            >
              <div className="text-2xl mb-1">💻</div>
              <h3 className="font-bold text-white mb-1">21 Snippet</h3>
              <p className="text-xs text-white/60">Kopyala-yapıştır şablonlar</p>
            </Link>
            <Link
              href="/python-online"
              className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-400/40 transition-all"
            >
              <div className="text-2xl mb-1">🌐</div>
              <h3 className="font-bold text-white mb-1">Online Editör</h3>
              <p className="text-xs text-white/60">Tarayıcıda direkt çalıştır</p>
            </Link>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Sık Sorulan Sorular</h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <details
                  key={i}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/10 group"
                >
                  <summary className="cursor-pointer font-semibold text-white/90 list-none flex items-start gap-2">
                    <span className="text-purple-400 font-mono text-sm">Q{i + 1}</span>
                    <span className="flex-1">{item.q}</span>
                    <span className="text-white/40 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <p className="mt-3 text-sm text-white/65 leading-relaxed pl-7">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
