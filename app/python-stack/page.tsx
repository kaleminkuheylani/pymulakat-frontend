// /python-stack — Python Stack soruları.

import type { Metadata } from "next";
import CategoryPageTemplate, { type RelatedCategory } from "../../components/CategoryPageTemplate";
import ServerQuestionList from "../../components/ServerQuestionList";
import CategoryContext, { type ContextBlock } from "../../components/CategoryContext";

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

export const revalidate = 3600;

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

const contextBlocks: ContextBlock[] = [
  {
    heading: "Stack (Yığın) Nedir?",
    paragraphs: [
      <>
        <strong className="text-amber-400">Stack</strong>, <strong>LIFO</strong> (Last-In, First-Out — son giren ilk çıkar) prensibiyle çalışan bir veri yapısıdır. İki temel işlemi vardır: <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">push</code> (yığına ekle) ve <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">pop</code> (yığının tepesinden çıkar). Python&apos;da <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">list</code> doğal olarak stack olarak kullanılabilir: <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">append</code> push, <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">pop</code> pop işlemi yapar.
      </>,
      <>
        Stack&apos;in klasik kullanım alanları: <strong>parantez dengesi kontrolü</strong>, <strong>undo/redo</strong>, <strong>DFS (derinlik öncelikli arama)</strong>, <strong>expression evaluation</strong> (RPN), <strong>call stack</strong> (programlama dillerinde fonksiyon çağrı zinciri), <strong>string reverse</strong> (karakterleri yığına at, sonra çek). Mülakatlarda en sık sorulan soru &quot;parantezleri dengeli mi?&quot; problemidir.
      </>,
    ],
    code: {
      label: "temel_stack.py",
      content: `# Stack — list ile
stack = []
stack.append("a")    # push
stack.append("b")
stack.append("c")
print(stack)         # ['a', 'b', 'c']

top = stack.pop()    # pop → 'c'
print(stack)         # ['a', 'b']

# peek (sadece göster, çıkarma)
if stack:
    print(stack[-1])   # 'b'

# Parantez dengesi örneği
def is_balanced(s: str) -> bool:
    stack = []
    pairs = {")": "(", "]": "[", "}": "{"}
    for c in s:
        if c in "([{":
            stack.append(c)
        elif c in ")]}":
            if not stack or stack.pop() != pairs[c]:
                return False
    return not stack

print(is_balanced("({[]})"))   # True
print(is_balanced("({[})"))    # False`,
    },
  },
  {
    heading: "Stack vs Queue vs Deque",
    paragraphs: [
      <>
        Stack&apos;in LIFO yapısının tersi queue&apos;nun FIFO (First-In, First-Out) yapısıdır. İkisi de sıralı veri saklar ama çıkarma sırası farklıdır. <strong>Doubly-ended queue (deque)</strong> ise her iki uçtan da ekleme/çıkarma yapabilen hibrit bir yapıdır — Python&apos;da <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">collections.deque</code> ile kullanılır. Çok yönlü bir yapı gerektiğinde <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">deque</code>, basit LIFO için <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">list</code> tercih edilir.
      </>,
    ],
    tip: {
      title: "Stack Mülakat İpuçları",
      text: (
        <>
          &quot;Parantez dengesi&quot; sorusunda stack&apos;i manuel implement et, Python&apos;ın <code className="px-1 py-0.5 rounded bg-white/5 text-amber-300 text-xs">list</code>&apos;ini kullan. Edge case&apos;leri unutma: sadece açılış parantez varsa (kapanmamış), sadece kapanış varsa, içiçe birden fazla tip parantez.
        </>
      ),
    },
    whenToUse: {
      title: "Stack Ne Zaman Kullanılır?",
      items: [
        "Parantez dengesi kontrolü: derleyici/interpreter doğrulama",
        "Undo/redo: editör, IDE, grafik uygulamalar",
        "DFS (depth-first search): graf/tree dolaşma",
        "Call stack: programlama dili fonksiyon çağrı yönetimi",
        "RPN calculator: ters Polonyalı ifade değerlendirme",
        "String reverse: karakterleri sırayla push, sonra pop",
      ],
    },
  },
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
        beforeRelated={
          <CategoryContext
            category="Python Stack"
            blocks={contextBlocks}
            furtherReading={[
              { label: "Python Queue", href: "/python-queue" },
              { label: "Veri Yapıları", href: "/python-veri-yapilari" },
            ]}
          />
        }
      >
        <ServerQuestionList category="stack" urlSlug="python-stack" displaySlug="stack" skeletonCount={5} />
      </CategoryPageTemplate>
    </>
  );
}
