// app/blog/algoritma-labirenti/page.tsx
//
// 2026-07-18: "Algoritma Labirenti" — 30 dakikalık interaktif blog.
// 6 seviye, 12 test case (her seviyede kolay + edge).
// Iki test de gecmeli, sonraki seviye acilir.
// SEO: Course + HowTo (6 step) + FAQPage (5 SSS) + BreadcrumbList JSON-LD.

import type { Metadata } from "next";
import Link from "next/link";
import SectionsList from "./SectionsList";
import { BASE_URL } from "@/lib/seo";
import { SECTIONS, TOTAL_MINUTES, TOTAL_SECTIONS } from "./data/sections";

const PAGE_URL = `${BASE_URL}/blog/algoritma-labirenti`;

// ─── SEO Metadata ──────────────────────────────────────
export const metadata: Metadata = {
  title: "Algoritma Labirenti — 30 Dakikada 6 Problemi Çöz | PYBlog",
  description:
    "6 seviyeli interaktif algoritma kasabası: filtrele, max bul, palindrom, iki sayı toplamı, anagram. Her seviyede 2 test case (kolay + edge), ikisi de geçmeli. 30 dakikada tamamla.",
  keywords: [
    // Ana long-tail
    "algoritma soruları",
    "algoritma problemleri",
    "algoritma çözme",
    "interaktif algoritma dersi",
    "algoritma egzersizleri",
    // Spesifik konular
    "filtreleme algoritması",
    "max bulma algoritması",
    "palindrom kontrolü",
    "iki sayı toplamı",
    "anagram kontrolü",
    "string ters çevirme",
    // Format
    "tarayıcıda algoritma",
    "30 dakikada algoritma",
    "python algoritma pratiği",
    "kodlama egzersizi",
    "programlama mülakat hazırlık",
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
    title: "Algoritma Labirenti — 30 Dakikada 6 Problemi Çöz",
    description:
      "6 seviye, 12 test case, kilit-aç sistemi. Filtrele, max bul, palindrom, iki toplam, anagram. Tarayıcıda Python yaz, anında test et.",
    url: PAGE_URL,
    type: "article",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    images: [
      {
        url: `${BASE_URL}/og-default.png`,
        width: 1200,
        height: 630,
        alt: "Algoritma Labirenti — 6 seviye, 12 test case, 30 dakika",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Algoritma Labirenti — 30 Dakikada 6 Problemi Çöz",
    description:
      "6 seviye, 12 test case, kilit-aç sistemi. Filtrele, max bul, palindrom, iki toplam, anagram. Tarayıcıda Python yaz, anında test et.",
    images: [`${BASE_URL}/og-default.png`],
  },
};

// ═══════════════════════════════════════════════════════
// JSON-LD: Course + HowTo + FAQPage + BreadcrumbList
// ═══════════════════════════════════════════════════════

// ─── JSON-LD: Article (Course + Article birlikte) ─────────────
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${PAGE_URL}#article`,
  headline: "Algoritma Labirenti — 30 Dakikada 6 Problemi Çöz",
  description:
    "6 seviyeli interaktif algoritma kasabası: filtrele, max bul, palindrom, iki sayı toplamı, anagram. Her seviyede 2 test case (kolay + edge), ikisi de geçmeli. 30 dakikada tamamla.",
  image: `${BASE_URL}/og-default.png`,
  datePublished: "2026-07-18",
  dateModified: "2026-07-18",
  inLanguage: "tr-TR",
  articleSection: "Eğitim",
  keywords: "algoritma soruları, interaktif algoritma dersi, python algoritma pratiği, 30 dakikada algoritma, kodlama egzersizi",
  author: {
    "@type": "Organization",
    name: "Python Mülakat",
    url: BASE_URL,
  },
  publisher: {
    "@type": "Organization",
    name: "Python Mülakat",
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/og-default.png`,
    },
  },
  mainEntityOfPage: PAGE_URL,
};

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "@id": `${PAGE_URL}#course`,
  name: "Algoritma Labirenti — 30 Dakikada 6 Problemi Çöz",
  description:
    "İnteraktif algoritma kasabası: 6 seviye, 12 test case. Her seviyede 2 test (kolay + edge), ikisi de geçmeli, sonraki açılır. Filtrele, max bul, ters çevir, palindrom, iki sayı toplamı, anagram.",
  provider: {
    "@type": "Organization",
    name: "Python Mülakat",
    url: BASE_URL,
  },
  educationalLevel: "Beginner",
  inLanguage: "tr-TR",
  isAccessibleForFree: true,
  timeRequired: `PT${TOTAL_MINUTES}M`,
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: `PT${TOTAL_MINUTES}M`,
    instructor: {
      "@type": "Organization",
      name: "Python Mülakat",
    },
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "TRY",
    availability: "https://schema.org/InStock",
  },
  teaches: [
    "Liste filtreleme",
    "Maksimum bulma",
    "String ters çevirme",
    "Palindrom kontrolü",
    "İki sayı toplamı (hash map)",
    "Anagram kontrolü",
    "Test odaklı geliştirme",
  ],
};

const howtoSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": `${PAGE_URL}#howto`,
  name: "Algoritma Labirenti — 6 Seviyeyi 30 Dakikada Geçmek",
  description:
    "Her seviyede 2 test case (kolay + edge) geçmen gereken interaktif labirent. Tüm seviyeleri geçince labirenti tamamlamış olursun.",
  totalTime: `PT${TOTAL_MINUTES}M`,
  estimatedCost: { "@type": "MonetaryAmount", value: "0", currency: "TRY" },
  step: SECTIONS.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.title,
    text: `${s.exercise.problem.replace(/<[^>]+>/g, "")} İki test case var: kolay ve edge. İkisini de geçmen gerek.`,
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${PAGE_URL}#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "Algoritma labirentinde kaç seviye var?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "6 seviye: Filtrele, Max Bul, Ters Çevir, Palindrom, İki Sayı Toplamı ve Anagram. Her seviye 5 dakika, toplam 30 dakika.",
      },
    },
    {
      "@type": "Question",
      name: "Bir sonraki seviyeye nasıl geçerim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Her seviyede 2 test case var (kolay + edge). İkisini de geçmen gerekir. Biri geçer, diğeri kalmazsa seviye kilitli kalır ve ilerleyemezsin.",
      },
    },
    {
      "@type": "Question",
      name: "Labirent için Python bilmem gerekiyor mu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Temel Python bilgisi yeterli: değişken, liste, döngü (for), if/else. İleri konular (dictionary, lambda) gerekmez. Sıfırdan Zirveye yazımızla başlayabilirsin.",
      },
    },
    {
      "@type": "Question",
      name: "Test case'ler ne anlama geliyor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Her seviyede 2 test var: Kolay (tipik input, hata yok) ve Edge (uç durum, boş liste, negatif sayı, tek karakter gibi). Edge case'leri yakalayabilen kod = sağlam kod.",
      },
    },
    {
      "@type": "Question",
      name: "Progress kaydediliyor mu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet, tarayıcının localStorage'ında saklanır. Sayfayı kapatıp açsan bile kaldığın yerden devam edersin. Farklı tarayıcı veya gizli modda progress sıfırlanır.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "PYBlog", item: `${BASE_URL}/blog/sifirdan-zirveye` },
    { "@type": "ListItem", position: 3, name: "Algoritma Labirenti", item: PAGE_URL },
  ],
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) } as any}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) } as any}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howtoSchema) } as any}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) } as any}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) } as any}
      />

      <SectionsList />
    </div>
  );
}
