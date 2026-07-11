// /python-heap — Python Heap / Priority Queue soruları.

import type { Metadata } from "next";
import CategoryPageTemplate, { type RelatedCategory } from "../../components/CategoryPageTemplate";
import ServerQuestionList from "../../components/ServerQuestionList";
import CategoryContext, { type ContextBlock } from "../../components/CategoryContext";

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
    "python mülakat soruları",
    "python mülakat hazırlık",
    "python online test çöz",
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

export const revalidate = 3600;

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

const contextBlocks: ContextBlock[] = [
  {
    heading: "Heap / Priority Queue Nedir?",
    paragraphs: [
      <>
        <strong className="text-amber-400">Heap</strong>, her düğümün çocuklarından büyük (veya küçük) olduğu özel bir binary tree veri yapısıdır. En yaygın kullanımı <strong>priority queue</strong>: en yüksek (veya en düşük) öncelikli elemanın O(1) veya O(log n) sürede alınması. Python&apos;da <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">heapq</code> modülü <strong>min-heap</strong> implementasyonu sağlar; max-heap için değerlerin negatifi kullanılır.
      </>,
      <>
        Mülakatlarda en sık sorulan heap soruları: <strong>K&apos;th largest/smallest</strong> elemanı bul, <strong>top K frequent</strong>, <strong>median maintenance</strong> (veri akışından medyan tut), <strong>Dijkstra&apos;nın kısa yol</strong> algoritması. Heap&apos;in asıl gücü, sıralanmamış bir veri yapısından <strong>en iyi/en kötü elemanı sürekli çekme</strong> işleminde ortaya çıkar.
      </>,
    ],
    code: {
      label: "temel_heap.py",
      content: `import heapq

# Min-heap oluşturma
heap = []
heapq.heappush(heap, 5)
heapq.heappush(heap, 1)
heapq.heappush(heap, 3)
heapq.heappush(heap, 7)

# En küçük elemanı çek (O(log n))
print(heapq.heappop(heap))   # 1
print(heap)                   # [3, 5, 7]

# Max-heap trick: negatif değerler
maxh = []
heapq.heappush(maxh, -5)
heapq.heappush(maxh, -1)
heapq.heappush(maxh, -3)
print(-heapq.heappop(maxh))   # 5

# n largest / n smallest
nums = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
print(heapq.nlargest(3, nums))   # [9, 6, 5]
print(heapq.nsmallest(3, nums))  # [1, 1, 2]`,
    },
  },
  {
    heading: "Heap Ne Zaman Kullanılır?",
    paragraphs: [
      <>
        Heap, <strong>en iyi/en kötü elemanı sürekli çekmen</strong> gereken durumlarda idealdir. Sıralı erişim gerekmiyorsa (O(1) peek + O(log n) pop), <strong>Dijkstra</strong> ve <strong>A*</strong> gibi graf algoritmalarında, <strong>median maintenance</strong> (iki heap&apos;le çalışan trick), <strong>task scheduler</strong> (en yüksek öncelikli görev önce), ve <strong>K&apos;th largest</strong> problemlerinde kullanılır. Sıralı iterasyon gerekirse heap yerine sorted set veya balanced BST tercih edilir.
      </>,
    ],
    tip: {
      title: "Sık Yapılan Hata",
      text: (
        <>
          Max-heap için <code className="px-1 py-0.5 rounded bg-white/5 text-amber-300 text-xs">heapq</code> doğrudan desteklemez. Negatif değer trick&apos;ini unutma veya <code className="px-1 py-0.5 rounded bg-white/5 text-amber-300 text-xs">sortedcontainers</code> gibi üçüncü parti kütüphane kullan.
        </>
      ),
    },
    whenToUse: {
      title: "Heap Kullanım Senaryoları",
      items: [
        "K'th largest/smallest eleman: O(n log k)",
        "Top K frequent: O(n log k)",
        "Median maintenance: iki heap ile O(1) ekleme, O(1) medyan",
        "Dijkstra/A* kısa yol algoritması: öncelik kuyruğu",
        "Task scheduler: en öncelikli işi önce al",
        "Stream medyan: veri akışından medyanı tut",
      ],
    },
  },
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
        beforeRelated={
          <CategoryContext
            category="Python Heap"
            blocks={contextBlocks}
            furtherReading={[
              { label: "Veri Yapıları", href: "/python-veri-yapilari" },
              { label: "Algoritma Soruları", href: "/python-algoritma-sorulari" },
            ]}
          />
        }
      >
        <ServerQuestionList category="heap" urlSlug="python-heap" displaySlug="heap" skeletonCount={6} />
      </CategoryPageTemplate>
    </>
  );
}
