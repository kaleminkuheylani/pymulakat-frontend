// /python-veri-yapilari — Veri yapıları soruları kataloğu sayfası.
import { Code2, GraduationCap, Layers, ListOrdered, Mountain } from "lucide-react";
import { getTotalQuestionCount } from "@/lib/api/questionAPI";

import type { Metadata } from "next";
import CategoryPageTemplate, { type RelatedCategory } from "../../components/CategoryPageTemplate";
import ServerQuestionList from "../../components/ServerQuestionList";
import CategoryContext, { type ContextBlock } from "../../components/CategoryContext";

export const metadata: Metadata = {
  title: "Python Veri Yapıları Soruları",
  description:
    "Python veri yapıları soruları: stack, queue, linked list, tree, graph, hash table. 21+ interaktif soru, AI feedback.",
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
    "python mülakat soruları",
    "python mülakat hazırlık",
    "python online test çöz",
    "python veri yapıları soruları",
    "python zor sorular"

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

export const revalidate = 3600;

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://pythonmulakat.com/" },
    { "@type": "ListItem", position: 2, name: "Mülakat Soruları", item: "https://pythonmulakat.com/interviews" },
    { "@type": "ListItem", position: 3, name: "Python Veri Yapıları", item: "https://pythonmulakat.com/python-veri-yapilari" },
  ],
};


const contextBlocks: ContextBlock[] = [
  {
    heading: "Veri Yapıları Nedir?",
    paragraphs: [
      <>
        <strong className="text-amber-400">Veri yapıları</strong>, veriyi organize etmenin, depolamanın ve üzerinde işlem yapmanın yollarıdır. Doğru veri yapısı seçimi, algoritmanın hızını ve bellek kullanımını doğrudan etkiler. Mülakatlarda en sık sorulan veri yapıları: <strong>stack (yığın)</strong>, <strong>queue (kuyruk)</strong>, <strong>linked list (bağlı liste)</strong>, <strong>tree (ağaç)</strong>, <strong>graph (çizge)</strong>, <strong>heap</strong> ve <strong>hash table (sözlük)</strong>.
      </>,
      <>
        Python&apos;da yerleşik veri yapıları <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">list</code>, <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">dict</code>, <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">set</code> ve <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">tuple</code> ile başlar. <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">collections</code> modülünde ise <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">deque</code>, <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">Counter</code>, <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">OrderedDict</code>, <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">defaultdict</code> gibi gelişmiş yapılar yer alır.
      </>,
    ],
    code: {
      label: "temel_veri_yapilari.py",
      content: `from collections import deque, Counter, defaultdict

# Stack (LIFO) — list.append/pop
stack = []
stack.append(1)        # push
stack.append(2)
stack.pop()            # pop → 2

# Queue (FIFO) — deque
q = deque()
q.append(1)            # enqueue (sağdan ekle)
q.append(2)
q.popleft()            # dequeue (soldan çıkar) → 1

# Counter — sayım
sayim = Counter("abracadabra")
print(sayim.most_common(3))   # [('a', 5), ('b', 2), ('r', 2)]

# defaultdict — varsayılan değerli dict
graph = defaultdict(list)
graph["a"].append("b")`,
    },
  },
  {
    heading: "Big-O Karmaşıklık ve Doğru Yapı Seçimi",
    paragraphs: [
      <>
        Her veri yapısının ekleme, silme, arama işlemleri için farklı zaman karmaşıklıkları vardır. <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">list</code> araması O(n), <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">dict</code> araması O(1) ortalamadır. Bu yüzden sık arama yapılacaksa <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">dict</code>, sıralı veri veya benzersizlik gerekiyorsa <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">set</code>, LIFO gerekiyorsa <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">list</code> (append/pop), FIFO gerekiyorsa <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">deque</code> tercih edilir.
      </>,
      <>
        Mülakatlarda "neden bu veri yapısını seçtin?" sorusu sıklıkla gelir. Cevabını bil: O(1) mi O(n) mi, hangi edge case&apos;lerde bozulur, hangi senaryolarda alternatif daha iyi olur.
      </>,
    ],
    whenToUse: {
      title: "Hangi Yapıyı Ne Zaman Kullanmalısın?",
      items: [
        "Stack (LIFO): undo/redo, parantez dengesi, DFS, expression evaluation",
        "Queue (FIFO): BFS, task scheduling, printer queue, message queue",
        "Linked List: sık insert/delete (ortada), bellek tasarrufu, dynamic size",
        "Tree (BST/Heap): sıralı erişim, range query, priority queue",
        "Graph: ağ yapıları, shortest path, dependency, sosyal ağ",
        "Hash Table (dict): O(1) arama, sayaç, memoization, cache",
      ],
    },
    tip: {
      title: "Sıralı Çalışma Önerisi",
      text: (
        <>
          Stack → Queue → Linked List → Tree → Heap → Graph sırasıyla ilerle. Her yapı için önce manuel implementasyon yap, sonra Python&apos;ın yerleşik <code className="px-1 py-0.5 rounded bg-white/5 text-amber-300 text-xs">collections</code> modülünü kullan.
        </>
      ),
    },
  },
];

export default async function PythonVeriYapilariPage() {
  const totalCount = await getTotalQuestionCount();

  const related: RelatedCategory[] = [
    { href: "/python-stack", icon: Layers, title: "Python Stack", description: "Stack veri yapısı için 5+ soru.", gradient: "indigo-amber" },
    { href: "/python-queue", icon: ListOrdered, title: "Python Queue", description: "Queue veri yapısı için 5+ soru.", gradient: "amber-indigo" },
    { href: "/python-heap", icon: Mountain, title: "Python Heap", description: "Heap / priority queue için 8+ soru.", gradient: "indigo-amber" },
    { href: "/interviews", icon: Layers, title: "Tüm Mülakat Kategorileri", description: `9 kategori, ${totalCount} soru.`, gradient: "amber-indigo" },
    { href: "/python-egitimi", icon: GraduationCap, title: "Python Eğitimi", description: "Sıfırdan ileri seviyeye Türkçe dersler.", gradient: "indigo-amber" },
    { href: "/python-temelleri", icon: Code2, title: "Python Temelleri", description: "Değişkenler, veri tipleri, döngüler, fonksiyonlar.", gradient: "amber-indigo" },
  ];
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
        beforeRelated={
          <CategoryContext
            category="Python Veri Yapıları"
            blocks={contextBlocks}
            furtherReading={[
              { label: "Python Stack", href: "/python-stack" },
              { label: "Python Queue", href: "/python-queue" },
              { label: "Python Heap", href: "/python-heap" },
            ]}
          />
        }
      >
        <ServerQuestionList category="data-structures" urlSlug="python-veri-yapilari" displaySlug="veri-yapilari" skeletonCount={9} />
      </CategoryPageTemplate>
    </>
  );
}
