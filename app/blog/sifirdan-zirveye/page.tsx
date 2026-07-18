// app/blog/sifirdan-zirveye/page.tsx
//
// 2026-07-18: Sıfırdan Zirveye — tek sayfa interaktif blog yazısı.
// SEO v2: Title 60 char, Description 155 char, 3 JSON-LD schema
// (Course + HowTo + FAQPage), zengin long-tail keywords, internal links.

import type { Metadata } from "next";
import Link from "next/link";
import SectionsRenderer from "./SectionsRenderer";
import { BASE_URL } from "@/lib/seo";
import { SECTIONS, TOTAL_MINUTES } from "./data/sections";

const PAGE_URL = `${BASE_URL}/blog/sifirdan-zirveye`;

// ─── SEO Metadata (Title 60 char, Description 155 char) ─────
export const metadata: Metadata = {
  // 58 char — Google snippet genişliği
  title: "Sıfırdan Zirveye: 30 Dakikada Programlama Öğren | PYBlog",
  // 153 char — CTA + sayı + long-tail
  description:
    "Hiç kod yazmamış biri için 8 görevli Python dersi (30 dk). Print, değişken, if/else, for/while, fonksiyon. Tarayıcıda yaz, anında test et. Ücretsiz.",
  keywords: [
    // Ana long-tail (yüksek hacim)
    "programlama temelleri",
    "sıfırdan programlama öğren",
    "python başlangıç dersleri",
    "kod yazmayı öğren",
    "yazılıma nasıl başlanır",
    // Sorgu niyeti
    "python nasıl öğrenilir",
    "kodlama temelleri",
    "ilk programlama dili",
    // Spesifik kavramlar
    "print fonksiyonu",
    "if else örnekleri",
    "for döngüsü örnekleri",
    "while döngüsü",
    "fonksiyon tanımlama python",
    // Format
    "interaktif python dersi",
    "tarayıcıda python",
    "30 dakikada python",
  ],
  alternates: { canonical: PAGE_URL },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  authors: [{ name: "Python Mülakat", url: BASE_URL }],
  openGraph: {
    title: "Sıfırdan Zirveye: 30 Dakikada Programlama Öğren",
    description:
      "8 görev, 30 dakika, sıfır kurulum. Tarayıcıda Python yaz — sonraki ders kilidi açılsın.",
    url: PAGE_URL,
    type: "article",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    images: [
      {
        url: `${BASE_URL}/og-default.png`,
        width: 1200,
        height: 630,
        alt: "Sıfırdan Zirveye — 30 Dakikada Programlama Öğren",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sıfırdan Zirveye: 30 Dakikada Programlama Öğren",
    description:
      "8 görev, 30 dakika, sıfır kurulum. Tarayıcıda Python yaz — sonraki ders kilidi açılsın.",
    images: [`${BASE_URL}/og-default.png`],
  },
};

// ─── JSON-LD: Course (eğitim içeriği) ───────────────────────
const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Sıfırdan Zirveye: 30 Dakikada Programlama Temelleri",
  description:
    "Hiç kod yazmamış biri için 8 kısa görev. Print, değişkenler, if/else, for/while, fonksiyonlar. Tarayıcıda Python — kurulum yok.",
  provider: {
    "@type": "Organization",
    name: "Python Mülakat",
    sameAs: BASE_URL,
  },
  url: PAGE_URL,
  inLanguage: "tr-TR",
  isAccessibleForFree: true,
  educationalLevel: "Beginner",
  learningResourceType: "Interactive Tutorial",
  timeRequired: `PT${TOTAL_MINUTES}M`,
  teaches: [
    "Programlama Temelleri",
    "Python Sözdizimi",
    "Değişkenler ve Veri Tipleri",
    "Koşul İfadeleri (if/else)",
    "Döngüler (for, while)",
    "Fonksiyon Tanımlama",
    "Parametreler",
  ],
  coursePrerequisites: "Yok — sıfırdan başla",
  numberOfLessons: SECTIONS.length,
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: `PT${TOTAL_MINUTES}M`,
  },
};

// ─── JSON-LD: HowTo (8 adımda öğren) ────────────────────────
const howtoSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "30 Dakikada Programlama Nasıl Öğrenilir?",
  description:
    "Sıfırdan başlayanlar için 8 adımda Python temelleri. Her adım kısa görev + test.",
  totalTime: `PT${TOTAL_MINUTES}M`,
  estimatedCost: { "@type": "MonetaryAmount", currency: "TRY", value: "0" },
  tool: [
    { "@type": "HowToTool", name: "Web tarayıcı (Chrome, Firefox, Safari)" },
    { "@type": "HowToTool", name: "İnternet bağlantısı" },
  ],
  step: SECTIONS.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: `${s.title}`,
    text: `${s.anlatim[0]} ${s.exercise.prompt}`,
    url: `${PAGE_URL}#${s.id}`,
  })),
};

// ─── JSON-LD: FAQPage (5 SSS) ────────────────────────────────
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Programlama öğrenmek ne kadar sürer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Temel kavramları (değişkenler, koşullar, döngüler, fonksiyonlar) 30 dakikada öğrenebilirsin. Bu rehber 8 görevle tam olarak bunu yapıyor. Daha ileri konular (veri yapıları, algoritmalar, OOP) için birkaç hafta pratik gerekir.",
      },
    },
    {
      "@type": "Question",
      name: "Python nasıl öğrenilir? Sıfırdan başlayanlar için en iyi yol nedir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sıfırdan başlayanlar için en iyi yol: (1) Kurulum yok — tarayıcıda Python çalıştır. (2) Kısa görevler — 30 dk'dan fazla oturma. (3) Anında test — her görevin cevabını kontrol et. (4) Sıralı ilerle — sonraki ders kilidi açılsın. Bu rehberdeki 8 görev bu yöntemi izliyor.",
      },
    },
    {
      "@type": "Question",
      name: "Kod yazmayı öğrenmek için bilgisayar programı kurmam gerekiyor mu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayır. Bu rehberde tüm Python kodu tarayıcıda çalışır — kurulum yok, hesap açmadan bile deneyebilirsin. Pyodide adlı WebAssembly motoru sayesinde Python tarayıcının içinde çalışıyor.",
      },
    },
    {
      "@type": "Question",
      name: "Sıfırdan programlama öğrenen biri hangi konularla başlamalı?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sıralama: (1) print() ile ekrana yazdırma, (2) değişkenler, (3) if/else koşulları, (4) for döngüsü, (5) while döngüsü, (6) fonksiyon tanımlama (def), (7) parametreli fonksiyonlar. Bu sıra yapı taşlarını sırayla öğretir — her biri sonraki için temel olur.",
      },
    },
    {
      "@type": "Question",
      name: "Programlama temellerini öğrendikten sonra ne yapmalıyım?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "8 görevi tamamladıktan sonra gerçek mülakat sorularıyla pratik yap: /interviews/programlama-temelleri (18 soru), /interviews/data-structures (11 soru). Tarayıcıda kod yaz, AI geri bildirim al. Bu sorular gerçek mülakat senaryolarından alınmış ve yapı taşlarını pekiştirir.",
      },
    },
  ],
};

// ─── JSON-LD: BreadcrumbList ────────────────────────────────
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "PYBlog", item: `${BASE_URL}/blog` },
    { "@type": "ListItem", position: 3, name: "Sıfırdan Zirveye", item: PAGE_URL },
  ],
};

export default function SifirdanZirveyePage() {
  return (
    <>
      {/* Structured Data — 4 JSON-LD schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howtoSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* SEO Content — görünür H1, hero, içerik, FAQ (Google için server-rendered text) */}
      <div className="sr-only">
        <h1>Sıfırdan Zirveye: 30 Dakikada Programlama Öğren</h1>
        <p>
          Hiç kod yazmamış biri için 8 kısa Python görevi: print, değişkenler,
          if/else, for/while, fonksiyonlar. Tarayıcıda çalışır, kurulum yok.
          Her görevin testi var, geçince sonraki açılır. Toplam 30 dakika,
          tamamen ücretsiz.
        </p>
      </div>

      <SectionsRenderer />

      {/* ─── SEO Content Block ─── */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-white mb-4 mt-12">
          Programlama Öğrenmek İçin Bu Rehber Kimin İçin?
        </h2>
        <div className="space-y-3 text-white/75 leading-relaxed text-[15px] mb-10">
          <p>
            Bu rehber <strong className="text-white">hiç kod yazmamış</strong> ya
            da <strong className="text-white">temelleri sağlamlaştırmak isteyen</strong>{" "}
            herkes için tasarlandı. Bilgisayar mühendisliği öğrencisi, kendi
            alanında yazılım kullanmak isteyen bir profesyonel, ya da sadece
            merak — farketmez. 8 görev, 30 dakika, sıfır kurulum.
          </p>
          <p>
            Eğer daha önce Python veya JavaScript ile az da olsa kod yazdıysan
            bazı görevler çok kolay gelecek. Yine de hızlıca geçip kendine
            olan güveni tazeleyebilirsin. Mülakata hazırlanan biri için en
            değerli bölüm <strong className="text-white">Fonksiyonlar</strong>{" "}
            ve <strong className="text-white">Parametrize Fonksiyonlar</strong>{" "}
            — çünkü çoğu mülakat sorusu bu yapıyı varsayar.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4 mt-10">
          30 Dakikada Ne Öğreneceksin?
        </h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-10">
          {SECTIONS.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-xl border border-white/10 bg-white/[0.02]"
            >
              <div className="text-xs text-amber-300 font-bold mb-1">
                {s.estimatedMinutes} dakika
              </div>
              <div className="text-sm font-semibold text-white mb-1">{s.title}</div>
              <div className="text-xs text-white/60 line-clamp-2">
                {s.exercise.prompt}
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mb-4 mt-10">
          Sıkça Sorulan Sorular
        </h2>
        <div className="space-y-3 mb-10">
          {[
            {
              q: "Programlama öğrenmek ne kadar sürer?",
              a: "Temel kavramları (değişkenler, koşullar, döngüler, fonksiyonlar) 30 dakikada öğrenebilirsin. Bu rehber 8 görevle tam olarak bunu yapıyor. İleri konular (veri yapıları, algoritmalar, OOP) için birkaç hafta pratik gerekir.",
            },
            {
              q: "Python nasıl öğrenilir? Sıfırdan başlayanlar için en iyi yol nedir?",
              a: "Sıfırdan başlayanlar için en iyi yol: (1) Kurulum yok — tarayıcıda Python çalıştır. (2) Kısa görevler — 30 dk'dan fazla oturma. (3) Anında test — her görevin cevabını kontrol et. (4) Sıralı ilerle — sonraki ders kilidi açılsın. Bu rehberdeki 8 görev bu yöntemi izliyor.",
            },
            {
              q: "Kod yazmayı öğrenmek için bilgisayar programı kurmam gerekiyor mu?",
              a: "Hayır. Bu rehberde tüm Python kodu tarayıcıda çalışır — kurulum yok, hesap açmadan bile deneyebilirsin. Pyodide adlı WebAssembly motoru sayesinde Python tarayıcının içinde çalışıyor.",
            },
            {
              q: "Sıfırdan programlama öğrenen biri hangi konularla başlamalı?",
              a: "Sıralama: print, değişkenler, if/else, for döngüsü, while döngüsü, fonksiyon tanımlama (def), parametreli fonksiyonlar. Bu sıra yapı taşlarını sırayla öğretir — her biri sonraki için temel olur.",
            },
            {
              q: "Programlama temellerini öğrendikten sonra ne yapmalıyım?",
              a: "8 görevi tamamladıktan sonra gerçek mülakat sorularıyla pratik yap. Programlama Temelleri (18 soru), Veri Yapıları (11 soru) ve diğer kategorilerde 70+ soru seni bekliyor.",
            },
          ].map((item, i) => (
            <details
              key={i}
              className="group p-4 rounded-xl border border-white/10 bg-white/[0.02] [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="cursor-pointer flex items-center justify-between gap-3 font-semibold text-white list-none">
                <h3 className="text-[15px] flex-1 min-w-0">{item.q}</h3>
                <span className="text-amber-300 text-xl group-open:rotate-45 transition-transform flex-shrink-0">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-white/75 leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        {/* Internal links — SEO için internal link juice */}
        <h2 className="text-2xl font-bold text-white mb-4 mt-10">
          Sıfırdan Zirveye&apos;yi Bitirdikten Sonra
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href="/interviews/programlama-temelleri"
            className="block p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-amber-500/30 transition-colors"
          >
            <div className="text-sm font-semibold text-white mb-1">
              Programlama Temelleri Soruları
            </div>
            <div className="text-xs text-white/60">
              18 gerçek mülakat sorusu — öğrendiklerini pekiştir
            </div>
          </Link>
          <Link
            href="/interviews"
            className="block p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-amber-500/30 transition-colors"
          >
            <div className="text-sm font-semibold text-white mb-1">
              Tüm Mülakat Kategorileri
            </div>
            <div className="text-xs text-white/60">
              70+ soru: Veri Yapıları, Algoritmalar, Heap, Stack, DP
            </div>
          </Link>
          <Link
            href="/blog/algoritma-nedir"
            className="block p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-amber-500/30 transition-colors"
          >
            <div className="text-sm font-semibold text-white mb-1">
              Algoritma Nedir?
            </div>
            <div className="text-xs text-white/60">
              Akış şeması, günlük hayattan örnekler
            </div>
          </Link>
          <Link
            href="/blog/programlama-temelleri"
            className="block p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-amber-500/30 transition-colors"
          >
            <div className="text-sm font-semibold text-white mb-1">
              Programlama Temelleri Rehberi
            </div>
            <div className="text-xs text-white/60">
              if/else, for/while, örneklerle açıklama
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
