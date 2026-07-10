// /python-queue — Python Queue soruları.

import type { Metadata } from "next";
import CategoryPageTemplate, { type RelatedCategory } from "../../components/CategoryPageTemplate";
import QuestionListClient from "../../components/QuestionListClient";

export const metadata: Metadata = {
  title: "Python Queue Soruları — FIFO, BFS, Circular Queue",
  description:
    "Python queue soruları: FIFO, BFS, circular queue, deque. 5+ interaktif soru. Tarayıcıda kod yaz, otomatik test et, yapay zekâdan geri bildirim al.",
  keywords: [
    "python queue",
    "python kuyruk",
    "python fifo",
    "python bfs",
    "python deque",
    "python mülakat queue",
  ],
  authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
  creator: "Python Mülakat",
  publisher: "Python Mülakat",
  alternates: {
    canonical: "https://pythonmulakat.com/python-queue",
    languages: { "tr-TR": "https://pythonmulakat.com/python-queue", "x-default": "https://pythonmulakat.com/python-queue" },
  },
  openGraph: {
    title: "Python Queue Soruları — FIFO, BFS, Circular Queue",
    description: "FIFO, BFS, circular queue, deque — 5+ interaktif soru.",
    url: "https://pythonmulakat.com/python-queue",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "https://pythonmulakat.com/og-default.png", width: 1200, height: 630, alt: "Python Queue — pythonmulakat.com" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Python Queue",
    description: "FIFO, BFS, circular queue. 5+ soru.",
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
    { "@type": "ListItem", position: 3, name: "Python Queue", item: "https://pythonmulakat.com/python-queue" },
  ],
};

const related: RelatedCategory[] = [
  { href: "/python-veri-yapilari", icon: "🗂️", title: "Veri Yapıları", description: "Tüm veri yapıları.", gradient: "indigo-amber" },
  { href: "/python-stack", icon: "📚", title: "Python Stack", description: "LIFO stack için 5+ soru.", gradient: "amber-indigo" },
  { href: "/python-heap", icon: "⛰️", title: "Python Heap", description: "heapq, priority queue için 8+ soru.", gradient: "indigo-amber" },
  { href: "/python-algoritma-sorulari", icon: "⚡", title: "Python Algoritma Soruları", description: "Sıralama, arama, DP, graf.", gradient: "amber-indigo" },
  { href: "/interviews", icon: "📚", title: "Tüm Mülakat Kategorileri", description: "9 kategori, 132 soru.", gradient: "indigo-amber" },
  { href: "/python-egitimi", icon: "🎓", title: "Python Eğitimi", description: "Sıfırdan ileri seviyeye Türkçe dersler.", gradient: "amber-indigo" },
];

export default function PythonQueuePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <CategoryPageTemplate
        title="Python Queue"
        subtitle={
          <>
            Python queue (kuyruk) soruları ile mülakata hazırlan. FIFO prensibi, BFS, circular queue, deque için{" "}
            <strong className="text-amber-400">5+ interaktif soru</strong>. Tarayıcıda kod yaz, otomatik test et, yapay zekâdan anında geri bildirim al.
          </>
        }
        tags={["FIFO", "enqueue", "dequeue", "BFS", "deque", "circular"]}
        backHref="/python-veri-yapilari"
        backLabel="Veri Yapıları"
        related={related}
      >
        <QuestionListClient category="queue" urlSlug="python-queue" displaySlug="queue" skeletonCount={5} />
      </CategoryPageTemplate>
    </>
  );
}
