// /python-liste-sozluk — Liste & Sözlük soruları kataloğu sayfası.

import type { Metadata } from "next";
import CategoryPageTemplate, { type RelatedCategory } from "../../components/CategoryPageTemplate";
import QuestionListClient from "../../components/QuestionListClient";

export const metadata: Metadata = {
  title: "Python Liste ve Sözlük Soruları — List, Dict, Tuple, Set",
  description:
    "Python liste ve sözlük soruları: list, dict, tuple, set işlemleri. 8+ interaktif soru. Tarayıcıda kod yaz, otomatik test et, yapay zekâdan geri bildirim al.",
  keywords: [
    "python liste sözlük",
    "python list",
    "python dict",
    "python tuple",
    "python set",
    "python liste soruları",
    "python sözlük soruları",
  ],
  authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
  creator: "Python Mülakat",
  publisher: "Python Mülakat",
  alternates: {
    canonical: "https://pythonmulakat.com/python-liste-sozluk",
    languages: { "tr-TR": "https://pythonmulakat.com/python-liste-sozluk", "x-default": "https://pythonmulakat.com/python-liste-sozluk" },
  },
  openGraph: {
    title: "Python Liste ve Sözlük Soruları",
    description: "List, dict, tuple, set — 8+ interaktif soru.",
    url: "https://pythonmulakat.com/python-liste-sozluk",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "https://pythonmulakat.com/og-default.png", width: 1200, height: 630, alt: "Python Liste & Sözlük — pythonmulakat.com" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Python Liste & Sözlük",
    description: "List, dict, tuple, set. 8+ soru.",
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
    { "@type": "ListItem", position: 3, name: "Python Liste & Sözlük", item: "https://pythonmulakat.com/python-liste-sozluk" },
  ],
};

const related: RelatedCategory[] = [
  { href: "/python-temelleri", icon: "🐍", title: "Python Temelleri", description: "Değişkenler, veri tipleri, döngüler, fonksiyonlar.", gradient: "indigo-amber" },
  { href: "/python-veri-yapilari", icon: "🗂️", title: "Veri Yapıları", description: "Stack, queue, linked list, tree.", gradient: "amber-indigo" },
  { href: "/python-pandas", icon: "🐼", title: "Python Pandas", description: "DataFrame, Series, groupby, merge.", gradient: "indigo-amber" },
  { href: "/interviews", icon: "📚", title: "Tüm Mülakat Kategorileri", description: "9 kategori, 132 soru.", gradient: "amber-indigo" },
  { href: "/python-kodlari", icon: "📖", title: "Python Kodları", description: "Hazır Python kodu örnekleri.", gradient: "indigo-amber" },
  { href: "/python-egitimi", icon: "🎓", title: "Python Eğitimi", description: "Sıfırdan ileri seviyeye Türkçe dersler.", gradient: "amber-indigo" },
];

export default function PythonListeSozlukPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <CategoryPageTemplate
        title="Python Liste & Sözlük"
        subtitle={
          <>
            Python liste ve sözlük soruları ile mülakata hazırlan. List, dict, tuple, set işlemleri için{" "}
            <strong className="text-amber-400">8+ interaktif soru</strong>. Tarayıcıda kod yaz, otomatik test et, yapay zekâdan anında geri bildirim al.
          </>
        }
        tags={["list", "dict", "tuple", "set", "comprehension", "sorting"]}
        backHref="/interviews"
        backLabel="Tüm Kategoriler"
        related={related}
      >
        <QuestionListClient category="list-dict" urlSlug="python-liste-sozluk" displaySlug="list-dict" skeletonCount={6} />
      </CategoryPageTemplate>
    </>
  );
}
