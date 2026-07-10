// /python-temelleri — Python temelleri soruları kataloğu sayfası.

import type { Metadata } from "next";
import CategoryPageTemplate, { type RelatedCategory } from "../../components/CategoryPageTemplate";
import QuestionListClient from "../../components/QuestionListClient";

export const metadata: Metadata = {
  title: "Python Temelleri Soruları ve Çözümleri",
  description:
    "Python temelleri soruları: değişkenler, veri tipleri, string işlemleri, kontrol yapıları, döngüler, fonksiyonlar. 34+ interaktif soru. Tarayıcıda kod yaz, otomatik test et, yapay zekâdan geri bildirim al.",
  keywords: [
    "python temelleri",
    "python temel konular",
    "python başlangıç",
    "python değişkenler",
    "python veri tipleri",
    "python string işlemleri",
    "python kontrol yapıları",
    "python döngüler",
    "python fonksiyonlar",
    "python yeni başlayanlar",
  ],
  authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
  creator: "Python Mülakat",
  publisher: "Python Mülakat",
  alternates: {
    canonical: "https://pythonmulakat.com/python-temelleri",
    languages: {
      "tr-TR": "https://pythonmulakat.com/python-temelleri",
      "x-default": "https://pythonmulakat.com/python-temelleri",
    },
  },
  openGraph: {
    title: "Python Temelleri Soruları ve Çözümleri",
    description: "Değişkenler, veri tipleri, string, döngüler, fonksiyonlar — 34+ interaktif soru.",
    url: "https://pythonmulakat.com/python-temelleri",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "https://pythonmulakat.com/og-default.png",
        width: 1200,
        height: 630,
        alt: "Python Temelleri — pythonmulakat.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Python Temelleri — İnteraktif Pratik",
    description: "Değişkenler, veri tipleri, string, döngüler, fonksiyonlar. 34+ soru.",
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
    { "@type": "ListItem", position: 3, name: "Python Temelleri", item: "https://pythonmulakat.com/python-temelleri" },
  ],
};

const related: RelatedCategory[] = [
  { href: "/python-liste-sozluk", icon: "📋", title: "Liste & Sözlük", description: "Python list, dict, tuple, set işlemleri için 8+ soru.", gradient: "indigo-amber" },
  { href: "/python-veri-yapilari", icon: "🗂️", title: "Veri Yapıları", description: "Stack, queue, linked list, tree için 21+ soru.", gradient: "amber-indigo" },
  { href: "/interviews", icon: "📚", title: "Tüm Mülakat Kategorileri", description: "9 kategori, 132 soru. Otomatik test + AI koç.", gradient: "indigo-amber" },
  { href: "/python-kodlari", icon: "📖", title: "Python Kodları", description: "Hazır Python kodu örnekleri. Kopyala, çalıştır, öğren.", gradient: "amber-indigo" },
  { href: "/python-egitimi", icon: "🎓", title: "Python Eğitimi", description: "Sıfırdan ileri seviyeye Türkçe dersler.", gradient: "indigo-amber" },
  { href: "/python-algoritma-sorulari", icon: "⚡", title: "Python Algoritma Soruları", description: "Sıralama, arama, DP, graf algoritmaları.", gradient: "amber-indigo" },
];

export default function PythonTemelleriPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <CategoryPageTemplate
        title="Python Temelleri"
        subtitle={
          <>
            Python temelleri soruları ile mülakata hazırlan. Değişkenler, veri tipleri, string işlemleri, kontrol yapıları, döngüler, fonksiyonlar için{" "}
            <strong className="text-amber-400">34+ interaktif soru</strong>. Tarayıcıda kod yaz, otomatik test et, yapay zekâdan anında geri bildirim al.
          </>
        }
        tags={["Değişkenler", "Veri Tipleri", "String", "Döngüler", "Fonksiyonlar", "Kontrol Yapıları"]}
        backHref="/interviews"
        backLabel="Tüm Kategoriler"
        related={related}
      >
        <QuestionListClient
          category="python-basics"
          urlSlug="python-temelleri"
          displaySlug="python-basics"
          skeletonCount={9}
        />
      </CategoryPageTemplate>
    </>
  );
}
