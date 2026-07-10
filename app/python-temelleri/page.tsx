// /python-temelleri — Python temelleri soruları kataloğu sayfası.

import type { Metadata } from "next";
import CategoryPageTemplate, { type RelatedCategory } from "../../components/CategoryPageTemplate";
import QuestionListClient from "../../components/QuestionListClient";
import CategoryContext, { type ContextBlock } from "../../components/CategoryContext";

export const metadata: Metadata = {
  title: "Python Temelleri Soruları ve Çözümleri",
  description:
    "Python temelleri soruları: değişkenler, veri tipleri, string işlemleri, kontrol yapıları, döngüler, fonksiyonlar. 34+ interaktif soru. Tarayıcıda kod yaz, otomatik test et, yapay zekâdan geri bildirim al.",
  keywords: [
    "python temelleri",
    "python temel konular",
    "python başlangıç",
    "python değişkenler",
    "python veri tipleri",
    "python string işlemleri",
    "python kontrol yapıları",
    "python döngüler",
    "python fonksiyonlar",
    "python yeni başlayanlar",
  ],
  authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
  creator: "Python Mülakat",
  publisher: "Python Mülakat",
  alternates: {
    canonical: "https://pythonmulakat.com/python-temelleri",
    languages: {
      "tr-TR": "https://pythonmulakat.com/python-temelleri",
      "x-default": "https://pythonmulakat.com/python-temelleri",
    },
  },
  openGraph: {
    title: "Python Temelleri Soruları ve Çözümleri",
    description: "Değişkenler, veri tipleri, string, döngüler, fonksiyonlar — 34+ interaktif soru.",
    url: "https://pythonmulakat.com/python-temelleri",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "https://pythonmulakat.com/og-default.png",
        width: 1200,
        height: 630,
        alt: "Python Temelleri — pythonmulakat.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Python Temelleri — İnteraktif Pratik",
    description: "Değişkenler, veri tipleri, string, döngüler, fonksiyonlar. 34+ soru.",
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
    { "@type": "ListItem", position: 3, name: "Python Temelleri", item: "https://pythonmulakat.com/python-temelleri" },
  ],
};

const related: RelatedCategory[] = [
  { href: "/python-liste-sozluk", icon: "📋", title: "Liste & Sözlük", description: "Python list, dict, tuple, set işlemleri için 8+ soru.", gradient: "indigo-amber" },
  { href: "/python-veri-yapilari", icon: "🗂️", title: "Veri Yapıları", description: "Stack, queue, linked list, tree için 21+ soru.", gradient: "amber-indigo" },
  { href: "/interviews", icon: "📚", title: "Tüm Mülakat Kategorileri", description: "9 kategori, 132 soru. Otomatik test + AI koç.", gradient: "indigo-amber" },
  { href: "/python-kodlari", icon: "📖", title: "Python Kodları", description: "Hazır Python kodu örnekleri. Kopyala, çalıştır, öğren.", gradient: "amber-indigo" },
  { href: "/python-egitimi", icon: "🎓", title: "Python Eğitimi", description: "Sıfırdan ileri seviyeye Türkçe dersler.", gradient: "indigo-amber" },
  { href: "/python-algoritma-sorulari", icon: "⚡", title: "Python Algoritma Soruları", description: "Sıralama, arama, DP, graf algoritmaları.", gradient: "amber-indigo" },
];

const contextBlocks: ContextBlock[] = [
  {
    heading: "Python Temelleri Nedir?",
    paragraphs: [
      <>
        <strong className="text-amber-400">Python temelleri</strong>, Python programlama dilinin en temel yapı taşlarını kapsar: değişkenler, veri tipleri, operatörler, string işlemleri, kontrol yapıları (if/else), döngüler (for/while) ve fonksiyonlar. Bu konular mülakatlarda ve günlük programlama görevlerinde en sık karşılaşılan konulardır — iyi bir temel, ileri konulara geçişin ön koşuludur.
      </>,
      <>
        Python&apos;da tip bildirimi yapılmaz; değişkenler doğrudan atama ile oluşturulur. Yerleşik veri tipleri <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">int</code>, <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">float</code>, <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">str</code>, <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">bool</code>, <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">list</code>, <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">dict</code>, <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">tuple</code> ve <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">set</code> ile başlar. Tip dönüşümü için <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">int()</code>, <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">str()</code> gibi fonksiyonlar kullanılır.
      </>,
    ],
    code: {
      label: "temel_degiskenler.py",
      content: `isim = "Ali"        # str
yas = 28             # int
pi = 3.14            # float
aktif = True         # bool
liste = [1, 2, 3]    # list
sozluk = {"a": 1}    # dict

# Tip dönüşümü
sayi = int("42")     # str → int
metin = str(123)     # int → str

# Çoklu atama
x, y, z = 1, 2, 3`,
    },
  },
  {
    heading: "Mülakatlarda En Sık Sorulan Temel Konular",
    paragraphs: [
      <>
        Junior Python mülakatlarında en sık karşılaşılan soru tipleri şunlardır: palindrom kontrolü, anagram tespiti, liste üzerinde filtreleme/map/reduce, string tersine çevirme, FizzBuzz, asal sayı kontrolü, fibonacci dizisi, iki sayının toplamı, listedeki tekrar eden elemanları bulma. Bu sorular algoritmik düşünmeyi ölçer; veri yapılarına veya ileri konulara geçmeden önce bu kategoride en az 15-20 soru çözmeni öneriyoruz.
      </>,
      <>
        Bu kategorideki soruların hepsi tarayıcıda interaktif olarak çalışır: kodu yaz, otomatik test case&apos;lerini geç, yapay zekâdan anında geri bildirim al. Kurulum gerekmez. <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">def</code> ile fonksiyon tanımla, parametrelerle oyna, edge case&apos;leri dene.
      </>,
    ],
    tip: {
      title: "Başlangıç İçin Sıra Önerisi",
      text: (
        <>
          Önce <strong>palindrom + anagram + FizzBuzz</strong> üçlüsü ile başla (string işlemleri temel), sonra <strong>asal sayı + fibonacci + iki sayının toplamı</strong> üçlüsüne geç (algoritmik düşünme), ardından <strong>liste filtreleme + dict işlemleri + comprehension</strong> ile veri tiplerini pekiştir.
        </>
      ),
    },
    whenToUse: {
      title: "Python Temellerini Ne Zaman Çalışmalısın?",
      items: [
        "Python'a yeni başlıyorsan ve ilk işini arıyorsan (junior pozisyonu)",
        "Üniversitede Python gördüysen ama unuttuklarını tazelemek istiyorsan",
        "OOP veya Pandas gibi ileri konulara geçmeden önce temeli sağlamlaştırmak istiyorsan",
        "Mülakat öncesi 2-3 günlük hızlı tekrar yapmak istiyorsan",
      ],
    },
  },
];

export default function PythonTemelleriPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <CategoryPageTemplate
        title="Python Temelleri"
        subtitle={
          <>
            Python temelleri soruları ile mülakata hazırlan. Değişkenler, veri tipleri, string işlemleri, kontrol yapıları, döngüler, fonksiyonlar için{" "}
            <strong className="text-amber-400">34+ interaktif soru</strong>. Tarayıcıda kod yaz, otomatik test et, yapay zekâdan anında geri bildirim al.
          </>
        }
        tags={["Değişkenler", "Veri Tipleri", "String", "Döngüler", "Fonksiyonlar", "Kontrol Yapıları"]}
        backHref="/interviews"
        backLabel="Tüm Kategoriler"
        related={related}
        beforeRelated={
          <CategoryContext
            category="Python Temelleri"
            blocks={contextBlocks}
            furtherReading={[
              { label: "Python Liste & Sözlük", href: "/python-liste-sozluk" },
              { label: "Python Eğitimi", href: "/python-egitimi" },
              { label: "Python Kodları", href: "/python-kodlari" },
            ]}
          />
        }
      >
        <QuestionListClient
          category="python-basics"
          urlSlug="python-temelleri"
          displaySlug="python-basics"
          skeletonCount={9}
        />
      </CategoryPageTemplate>
    </>
  );
}
