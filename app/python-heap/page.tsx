// /python-heap — Python Heap / Priority Queue soruları.

import type { Metadata } from "next";
import CategoryPageTemplate, { type RelatedCategory } from "../../components/CategoryPageTemplate";
import QuestionListClient from "../../components/QuestionListClient";

export const metadata: Metadata = {
  title: "Python Heap Soruları — heapq, Priority Queue",
  description:
    "Python heap soruları: heapq, min-heap, max-heap, priority queue. 8+ interaktif soru. Tarayıcıda kod yaz, otomatik test et, yapay zekâdan geri bildirim al.",
  keywords: [
    "python heap",
    "python heapq",
    "python priority queue",
    "python min heap",
    "python max heap",
    "python mülakat heap",
  ],
  authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
  creator: "Python Mülakat",
  publisher: "Python Mülakat",
  alternates: {
    canonical: "https://pythonmulakat.com/python-heap",
    languages: { "tr-TR": "https://pythonmulakat.com/python-heap", "x-default": "https://pythonmulakat.com/python-heap" },
  },
  openGraph: {
    title: "Python Heap Soruları — heapq, Priority Queue",
    description: "heapq, min-heap, max-heap — 8+ interaktif soru.",
    url: "https://pythonmulakat.com/python-heap",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "https://pythonmulakat.com/og-default.png", width: 1200, height: 630, alt: "Python Heap — pythonmulakat.com" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Python Heap",
    description: "heapq, min-heap, max-heap. 8+ soru.",
    images: ["https://pythonmulakat.com/og-default.png"],
    creator: "@pythonmulakat",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://pythonmulakat.com/" },
    { "@type": "ListItem", position: 2, name: "Veri Yapıları", item: "https://pythonmulakat.com/python-veri-yapilari" },
    { "@type": "ListItem", position: 3, name: "Python Heap", item: "https://pythonmulakat.com/python-heap" },
  ],
};

const related: RelatedCategory[] = [
  { href: "/python-veri-yapilari", icon: "🗂️", title: "Veri Yapıları", description: "Tüm veri yapıları: stack, queue, tree, linked list.", gradient: "indigo-amber" },
  { href: "/python-stack", icon: "📚", title: "Python Stack", description: "Stack veri yapısı için 5+ soru.", gradient: "amber-indigo" },
  { href: "/python-queue", icon: "🚶", title: "Python Queue", description: "Queue veri yapısı için 5+ soru.", gradient: "indigo-amber" },
  { href: "/python-algoritma-sorulari", icon: "⚡", title: "Python Algoritma Soruları", description: "Sıralama, arama, DP, graf.", gradient: "amber-indigo" },
  { href: "/interviews", icon: "📚", title: "Tüm Mülakat Kategorileri", description: "9 kategori, 132 soru.", gradient: "indigo-amber" },
  { href: "/python-egitimi", icon: "🎓", title: "Python Eğitimi", description: "Sıfırdan ileri seviyeye Türkçe dersler.", gradient: "amber-indigo" },
];

export default function PythonHeapPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <CategoryPageTemplate
        title="Python Heap / Priority Queue"
        subtitle={
          <>
            Python heap soruları ile mülakata hazırlan. <code className="text-amber-300">heapq</code> modülü, min-heap, max-heap, priority queue için{" "}
            <strong className="text-amber-400">8+ interaktif soru</strong>. Tarayıcıda kod yaz, otomatik test et, yapay zekâdan anında geri bildirim al.
          </>
        }
        tags={["heapq", "min-heap", "max-heap", "priority queue", "heappush", "heappop"]}
        backHref="/python-veri-yapilari"
        backLabel="Veri Yapıları"
        related={related}
      >
        <QuestionListClient category="heap" urlSlug="python-heap" displaySlug="heap" skeletonCount={6} />
      </CategoryPageTemplate>
    </>
  );
}
