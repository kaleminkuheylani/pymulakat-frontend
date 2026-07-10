// /python-stack — Python Stack soruları.

import type { Metadata } from "next";
import CategoryPageTemplate, { type RelatedCategory } from "../../components/CategoryPageTemplate";
import QuestionListClient from "../../components/QuestionListClient";

export const metadata: Metadata = {
  title: "Python Stack Soruları — LIFO, Parantez Dengesi",
  description:
    "Python stack soruları: LIFO, parantez dengesi, undo/redo, eval. 5+ interaktif soru. Tarayıcıda kod yaz, otomatik test et, yapay zekâdan geri bildirim al.",
  keywords: [
    "python stack",
    "python yığın",
    "python lifo",
    "python parantez dengesi",
    "python mülakat stack",
  ],
  authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
  creator: "Python Mülakat",
  publisher: "Python Mülakat",
  alternates: {
    canonical: "https://pythonmulakat.com/python-stack",
    languages: { "tr-TR": "https://pythonmulakat.com/python-stack", "x-default": "https://pythonmulakat.com/python-stack" },
  },
  openGraph: {
    title: "Python Stack Soruları — LIFO, Parantez Dengesi",
    description: "LIFO, parantez dengesi, undo/redo — 5+ interaktif soru.",
    url: "https://pythonmulakat.com/python-stack",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "https://pythonmulakat.com/og-default.png", width: 1200, height: 630, alt: "Python Stack — pythonmulakat.com" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Python Stack",
    description: "LIFO, parantez dengesi. 5+ soru.",
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
    { "@type": "ListItem", position: 3, name: "Python Stack", item: "https://pythonmulakat.com/python-stack" },
  ],
};

const related: RelatedCategory[] = [
  { href: "/python-veri-yapilari", icon: "🗂️", title: "Veri Yapıları", description: "Tüm veri yapıları.", gradient: "indigo-amber" },
  { href: "/python-queue", icon: "🚶", title: "Python Queue", description: "FIFO queue için 5+ soru.", gradient: "amber-indigo" },
  { href: "/python-heap", icon: "⛰️", title: "Python Heap", description: "heapq, priority queue için 8+ soru.", gradient: "indigo-amber" },
  { href: "/python-algoritma-sorulari", icon: "⚡", title: "Python Algoritma Soruları", description: "Sıralama, arama, DP, graf.", gradient: "amber-indigo" },
  { href: "/interviews", icon: "📚", title: "Tüm Mülakat Kategorileri", description: "9 kategori, 132 soru.", gradient: "indigo-amber" },
  { href: "/python-egitimi", icon: "🎓", title: "Python Eğitimi", description: "Sıfırdan ileri seviyeye Türkçe dersler.", gradient: "amber-indigo" },
];

export default function PythonStackPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <CategoryPageTemplate
        title="Python Stack"
        subtitle={
          <>
            Python stack (yığın) soruları ile mülakata hazırlan. LIFO prensibi, parantez dengesi, undo/redo, expression evaluation için{" "}
            <strong className="text-amber-400">5+ interaktif soru</strong>. Tarayıcıda kod yaz, otomatik test et, yapay zekâdan anında geri bildirim al.
          </>
        }
        tags={["LIFO", "push", "pop", "parantez dengesi", "undo/redo"]}
        backHref="/python-veri-yapilari"
        backLabel="Veri Yapıları"
        related={related}
      >
        <QuestionListClient category="stack" urlSlug="python-stack" displaySlug="stack" skeletonCount={5} />
      </CategoryPageTemplate>
    </>
  );
}
