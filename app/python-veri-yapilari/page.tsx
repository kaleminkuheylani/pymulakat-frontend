// /python-veri-yapilari — Veri yapıları soruları kataloğu sayfası.

import type { Metadata } from "next";
import CategoryPageTemplate, { type RelatedCategory } from "../../components/CategoryPageTemplate";
import QuestionListClient from "../../components/QuestionListClient";

export const metadata: Metadata = {
  title: "Python Veri Yapıları Soruları — Stack, Queue, Tree, Linked List",
  description:
    "Python veri yapıları soruları: stack, queue, linked list, tree, graph, hash table. 21+ interaktif soru. Tarayıcıda kod yaz, otomatik test et, yapay zekâdan geri bildirim al.",
  keywords: [
    "python veri yapıları",
    "python data structures",
    "python stack",
    "python queue",
    "python linked list",
    "python tree",
    "python graph",
    "python hash table",
    "python mülakat veri yapıları",
  ],
  authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
  creator: "Python Mülakat",
  publisher: "Python Mülakat",
  alternates: {
    canonical: "https://pythonmulakat.com/python-veri-yapilari",
    languages: { "tr-TR": "https://pythonmulakat.com/python-veri-yapilari", "x-default": "https://pythonmulakat.com/python-veri-yapilari" },
  },
  openGraph: {
    title: "Python Veri Yapıları Soruları — Stack, Queue, Tree, Linked List",
    description: "Stack, queue, linked list, tree, graph — 21+ interaktif soru.",
    url: "https://pythonmulakat.com/python-veri-yapilari",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "https://pythonmulakat.com/og-default.png", width: 1200, height: 630, alt: "Python Veri Yapıları — pythonmulakat.com" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Python Veri Yapıları — İnteraktif Pratik",
    description: "Stack, queue, linked list, tree. 21+ soru.",
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
    { "@type": "ListItem", position: 3, name: "Python Veri Yapıları", item: "https://pythonmulakat.com/python-veri-yapilari" },
  ],
};

const related: RelatedCategory[] = [
  { href: "/python-stack", icon: "📚", title: "Python Stack", description: "Stack veri yapısı için 5+ soru.", gradient: "indigo-amber" },
  { href: "/python-queue", icon: "🚶", title: "Python Queue", description: "Queue veri yapısı için 5+ soru.", gradient: "amber-indigo" },
  { href: "/python-heap", icon: "⛰️", title: "Python Heap", description: "Heap / priority queue için 8+ soru.", gradient: "indigo-amber" },
  { href: "/interviews", icon: "📚", title: "Tüm Mülakat Kategorileri", description: "9 kategori, 132 soru.", gradient: "amber-indigo" },
  { href: "/python-egitimi", icon: "🎓", title: "Python Eğitimi", description: "Sıfırdan ileri seviyeye Türkçe dersler.", gradient: "indigo-amber" },
  { href: "/python-temelleri", icon: "🐍", title: "Python Temelleri", description: "Değişkenler, veri tipleri, döngüler, fonksiyonlar.", gradient: "amber-indigo" },
];

export default function PythonVeriYapilariPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <CategoryPageTemplate
        title="Python Veri Yapıları"
        subtitle={
          <>
            Python veri yapıları soruları ile mülakata hazırlan. Stack, queue, linked list, tree, graph için{" "}
            <strong className="text-amber-400">21+ interaktif soru</strong>. Tarayıcıda kod yaz, otomatik test et, yapay zekâdan anında geri bildirim al.
          </>
        }
        tags={["Stack", "Queue", "Linked List", "Tree", "Graph", "Hash Table"]}
        backHref="/interviews"
        backLabel="Tüm Kategoriler"
        related={related}
      >
        <QuestionListClient category="data-structures" urlSlug="python-veri-yapilari" displaySlug="veri-yapilari" skeletonCount={9} />
      </CategoryPageTemplate>
    </>
  );
}
