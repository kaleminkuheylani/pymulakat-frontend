// /python-pandas — Pandas soruları kataloğu sayfası.

import type { Metadata } from "next";
import CategoryPageTemplate, { type RelatedCategory } from "../../components/CategoryPageTemplate";
import QuestionListClient from "../../components/QuestionListClient";

export const metadata: Metadata = {
  title: "Python Pandas Soruları ve Çözümleri",
  description:
    "Python pandas soruları: DataFrame, Series, groupby, merge, filter, agg. 13+ interaktif soru. Tarayıcıda kod yaz, otomatik test et, yapay zekâdan geri bildirim al.",
  keywords: [
    "python pandas",
    "pandas soruları",
    "pandas mülakat",
    "python dataframe",
    "pandas groupby",
    "pandas merge",
    "pandas alıştırma",
    "python veri bilimi",
  ],
  authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
  creator: "Python Mülakat",
  publisher: "Python Mülakat",
  alternates: {
    canonical: "https://pythonmulakat.com/python-pandas",
    languages: { "tr-TR": "https://pythonmulakat.com/python-pandas", "x-default": "https://pythonmulakat.com/python-pandas" },
  },
  openGraph: {
    title: "Python Pandas Soruları ve Çözümleri",
    description: "DataFrame, Series, groupby, merge — 13+ interaktif soru.",
    url: "https://pythonmulakat.com/python-pandas",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "https://pythonmulakat.com/og-default.png", width: 1200, height: 630, alt: "Python Pandas — pythonmulakat.com" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Python Pandas — İnteraktif Pratik",
    description: "DataFrame, Series, groupby, merge. 13+ soru.",
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
    { "@type": "ListItem", position: 3, name: "Python Pandas", item: "https://pythonmulakat.com/python-pandas" },
  ],
};

const related: RelatedCategory[] = [
  { href: "/python-temelleri", icon: "🐍", title: "Python Temelleri", description: "Değişkenler, veri tipleri, döngüler, fonksiyonlar.", gradient: "indigo-amber" },
  { href: "/python-liste-sozluk", icon: "📋", title: "Liste & Sözlük", description: "List, dict, tuple, set işlemleri.", gradient: "amber-indigo" },
  { href: "/interviews", icon: "📚", title: "Tüm Mülakat Kategorileri", description: "9 kategori, 132 soru.", gradient: "indigo-amber" },
  { href: "/python-kodlari", icon: "📖", title: "Python Kodları", description: "Pandas dahil hazır kod örnekleri.", gradient: "amber-indigo" },
  { href: "/python-online", icon: "🖥️", title: "Python Online", description: "Tarayıcıda Python 3.12 çalıştır.", gradient: "indigo-amber" },
  { href: "/python-egitimi", icon: "🎓", title: "Python Eğitimi", description: "Sıfırdan ileri seviyeye Türkçe dersler.", gradient: "amber-indigo" },
];

export default function PythonPandasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <CategoryPageTemplate
        title="Python Pandas"
        subtitle={
          <>
            Python pandas soruları ile mülakata hazırlan. DataFrame, Series, groupby, merge, filter, agg için{" "}
            <strong className="text-amber-400">13+ interaktif soru</strong>. Tarayıcıda kod yaz, otomatik test et, yapay zekâdan anında geri bildirim al.
          </>
        }
        tags={["DataFrame", "Series", "groupby", "merge", "filter", "agg", "apply"]}
        backHref="/interviews"
        backLabel="Tüm Kategoriler"
        related={related}
      >
        <QuestionListClient category="pandas" urlSlug="python-pandas" displaySlug="pandas" skeletonCount={6} />
      </CategoryPageTemplate>
    </>
  );
}
