// /python-queue — Python Queue soruları.
import { Cpu, GraduationCap, Layers, Mountain } from "lucide-react";
import { getTotalQuestionCount } from "@/lib/api/questionAPI";

import type { Metadata } from "next";
import CategoryPageTemplate, { type RelatedCategory } from "../../components/CategoryPageTemplate";
import ServerQuestionList from "../../components/ServerQuestionList";
import CategoryContext, { type ContextBlock } from "../../components/CategoryContext";

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
    "python mülakat soruları",
    "python mülakat hazırlık",
    "python online test çöz",
    "python kuyruk soruları",
    "python stack queue soruları"

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

export const revalidate = 3600;

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://pythonmulakat.com/" },
    { "@type": "ListItem", position: 2, name: "Veri Yapıları", item: "https://pythonmulakat.com/python-veri-yapilari" },
    { "@type": "ListItem", position: 3, name: "Python Queue", item: "https://pythonmulakat.com/python-queue" },
  ],
};


const contextBlocks: ContextBlock[] = [
  {
    heading: "Queue (Kuyruk) Nedir?",
    paragraphs: [
      <>
        <strong className="text-amber-400">Queue</strong>, <strong>FIFO</strong> (First-In, First-Out — ilk giren ilk çıkar) prensibiyle çalışan bir veri yapısıdır. İki temel işlemi vardır: <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">enqueue</code> (kuyruğun sonuna ekle) ve <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">dequeue</code> (kuyruğun başından çıkar). Python&apos;da <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">list</code> ile queue yapılabilir ama baştan çıkarma O(n) olduğu için yavaştır; bu yüzden <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">collections.deque</code> tercih edilir.
      </>,
      <>
        Queue&apos;nun klasik kullanım alanları: <strong>BFS (genişlik öncelikli arama)</strong>, <strong>task scheduling</strong> (işletim sistemi, mesaj kuyruğu), <strong>printer queue</strong>, <strong>cache&apos;lerde FIFO eviction</strong>, <strong>producer-consumer problemi</strong>. Mülakatlarda en sık sorulan: &quot;kuyruğu kullanarak seviye seviye binary tree dolaşma&quot; (BFS).
      </>,
    ],
    code: {
      label: "temel_queue.py",
      content: `from collections import deque

# Queue — deque ile (O(1) her iki uç)
q = deque()
q.append(1)         # enqueue (sağdan)
q.append(2)
q.append(3)
print(q)            # deque([1, 2, 3])

front = q.popleft()  # dequeue (soldan) → 1
print(q)             # deque([2, 3])

# BFS örneği (seviye seviye tree dolaşma)
def bfs(root):
    if not root:
        return []
    result = []
    q = deque([root])
    while q:
        node = q.popleft()
        result.append(node.val)
        if node.left:  q.append(node.left)
        if node.right: q.append(node.right)
    return result

# Circular queue (sabit boyutlu)
class CircularQueue:
    def __init__(self, k: int):
        self.q = deque(maxlen=k)

    def enqueue(self, val: int) -> bool:
        if len(self.q) == self.q.maxlen:
            return False
        self.q.append(val)
        return True

    def dequeue(self) -> bool:
        if not self.q:
            return False
        self.q.popleft()
        return True

    def front(self) -> int:
        return -1 if not self.q else self.q[0]

    def rear(self) -> int:
        return -1 if not self.q else self.q[-1]

    def is_empty(self) -> bool:
        return not self.q

    def is_full(self) -> bool:
        return len(self.q) == self.q.maxlen`,
    },
  },
  {
    heading: "Queue Ne Zaman Kullanılır?",
    paragraphs: [
      <>
        BFS, producer-consumer, scheduling, rate limiting gibi <strong>sıra koruma gerektiren</strong> durumlarda queue idealdir. <strong>Priority queue</strong> (heap) ise &quot;en yüksek öncelikli önce&quot; senaryolarında tercih edilir. <strong>Circular queue</strong> sabit boyutlu buffer gerektiren yerlerde (örneğin producer-consumer&apos;da bounded buffer) kullanılır.
      </>,
    ],
    tip: {
      title: "Sık Yapılan Hata",
      text: (
        <>
          <code className="px-1 py-0.5 rounded bg-white/5 text-amber-300 text-xs">list.pop(0)</code> kullanma — O(n) maliyeti var. Her zaman <code className="px-1 py-0.5 rounded bg-white/5 text-amber-300 text-xs">deque.popleft()</code> tercih et.
        </>
      ),
    },
    whenToUse: {
      title: "Queue Kullanım Senaryoları",
      items: [
        "BFS (breadth-first search): ağaç veya graf seviye seviye dolaşma",
        "Task scheduling: işletim sistemi, mesaj kuyruğu (Celery, RabbitMQ)",
        "Cache eviction: FIFO cache, ring buffer",
        "Producer-consumer: sınırlı buffer, multi-threading",
        "Print queue, request queue: sıralı işlem",
        "Stream processing: akan veriden sliding window",
      ],
    },
  },
];

export default async function PythonQueuePage() {
  const totalCount = await getTotalQuestionCount();

  const related: RelatedCategory[] = [
    { href: "/python-veri-yapilari", icon: Layers, title: "Veri Yapıları", description: "Tüm veri yapıları.", gradient: "indigo-amber" },
    { href: "/python-stack", icon: Layers, title: "Python Stack", description: "LIFO stack için 5+ soru.", gradient: "amber-indigo" },
    { href: "/python-heap", icon: Mountain, title: "Python Heap", description: "heapq, priority queue için 8+ soru.", gradient: "indigo-amber" },
    { href: "/python-algoritma-sorulari", icon: Cpu, title: "Python Algoritma Soruları", description: "Sıralama, arama, DP, graf.", gradient: "amber-indigo" },
    { href: "/interviews", icon: Layers, title: "Tüm Mülakat Kategorileri", description: `9 kategori, ${totalCount} soru.`, gradient: "indigo-amber" },
    { href: "/python-egitimi", icon: GraduationCap, title: "Python Eğitimi", description: "Sıfırdan ileri seviyeye Türkçe dersler.", gradient: "amber-indigo" },
  ];
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
        beforeRelated={
          <CategoryContext
            category="Python Queue"
            blocks={contextBlocks}
            furtherReading={[
              { label: "Python Stack", href: "/python-stack" },
              { label: "Veri Yapıları", href: "/python-veri-yapilari" },
              { label: "Algoritma Soruları", href: "/python-algoritma-sorulari" },
            ]}
          />
        }
      >
        <ServerQuestionList category="queue" urlSlug="python-queue" displaySlug="queue" skeletonCount={5} />
      </CategoryPageTemplate>
    </>
  );
}
