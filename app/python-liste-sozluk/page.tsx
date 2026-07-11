// /python-liste-sozluk — Liste & Sözlük soruları kataloğu sayfası.

import type { Metadata } from "next";
import CategoryPageTemplate, { type RelatedCategory } from "../../components/CategoryPageTemplate";
import ServerQuestionList from "../../components/ServerQuestionList";
import CategoryContext, { type ContextBlock } from "../../components/CategoryContext";

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
    "python mülakat soruları",
    "python mülakat hazırlık",
    "python online test çöz",
    "python liste soruları",
    "python sözlük soruları"

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

export const revalidate = 3600;

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

const contextBlocks: ContextBlock[] = [
  {
    heading: "Liste & Sözlük Nedir?",
    paragraphs: [
      <>
        <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">list</code> (liste) ve <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">dict</code> (sözlük) Python&apos;ın en sık kullanılan iki veri yapısıdır. <strong>Liste</strong> sıralı (ordered), değiştirilebilir (mutable), tekrar eden elemanlara izin veren bir koleksiyondur — <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">liste = [1, 2, 3]</code>. <strong>Sözlük</strong> anahtar-değer (key-value) çiftlerinden oluşur, anahtarlar unique olmalıdır — <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">sozluk = {"{"}"a": 1{"}"}</code>.
      </>,
      <>
        Bunlara ek olarak <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">tuple</code> (değiştirilemez liste) ve <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">set</code> (benzersiz eleman kümesi) de sıkça kullanılır. Tuple&apos;lar dictionary key olarak kullanılabilir (hash&apos;lenebilir olduğu için), set&apos;ler ise <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">in</code> operatörü ile O(1) arama sağlar — listedeki O(n) aramadan çok daha hızlıdır.
      </>,
    ],
    code: {
      label: "temel_liste_sozluk.py",
      content: `# Liste
sayilar = [3, 1, 4, 1, 5, 9, 2, 6]
sayilar.append(7)              # sona ekle
sayilar.sort()                  # sırala (in-place)
sayilar[0]                      # ilk eleman → 1
sayilar[1:4]                    # dilim [1, 2, 3]

# Sözlük
kisi = {"ad": "Ali", "yas": 28}
kisi["email"] = "ali@x.com"    # ekle/güncelle
kisi.get("sehir", "Bilinmiyor")  # güvenli erişim

# Comprehension
ciftler = [x for x in sayilar if x % 2 == 0]
kareler = {x: x**2 for x in range(5)}

# Set
benzersiz = set([1, 2, 2, 3, 3, 3])
# {1, 2, 3}`,
    },
  },
  {
    heading: "Hangi Yapıyı Ne Zaman Kullanmalısın?",
    paragraphs: [
      <>
        Mülakatlarda &quot;neden sözlük yerine liste?&quot; veya &quot;neden set yerine liste?&quot; gibi sorular sıklıkla gelir. Cevap, <strong>arama hızına</strong> bağlıdır. Liste O(n), set/dict O(1) — milyonlarca eleman için bu fark dakikalar mertebesinde olur. <strong>Sıra koruma</strong> gerekiyorsa liste, <strong>benzersizlik</strong> gerekiyorsa set, <strong>anahtar-değer eşlemesi</strong> gerekiyorsa dict kullan.
      </>,
    ],
    whenToUse: {
      title: "Hangi Yapıyı Ne Zaman?",
      items: [
        "List: sıralı veri, sık insert/delete (sona), tekrarlı elemanlar",
        "Tuple: değişmeyecek veri, dictionary key, fonksiyon birden fazla değer döndürürken",
        "Dict: anahtar-değer eşleme, hızlı arama (O(1)), sayaç, cache",
        "Set: benzersiz elemanlar, küme işlemleri (birleşim, kesişim, fark)",
      ],
    },
    tip: {
      title: "Mülakatlarda Sık Sorulan İpuçları",
      text: (
        <>
          &quot;Bir listedeki tekrar eden elemanları bul&quot; sorusunda <code className="px-1 py-0.5 rounded bg-white/5 text-amber-300 text-xs">set</code> + <code className="px-1 py-0.5 rounded bg-white/5 text-amber-300 text-xs">len()</code> karşılaştırması, O(n) çözüm sunar. &quot;İki liste ortak eleman&quot; sorusunda <code className="px-1 py-0.5 rounded bg-white/5 text-amber-300 text-xs">set(a) &amp; set(b)</code> küme kesişimi en zarif çözüm.
        </>
      ),
    },
  },
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
        beforeRelated={
          <CategoryContext
            category="Python Liste & Sözlük"
            blocks={contextBlocks}
            furtherReading={[
              { label: "Python Temelleri", href: "/python-temelleri" },
              { label: "Python Veri Yapıları", href: "/python-veri-yapilari" },
              { label: "Python Pandas", href: "/python-pandas" },
            ]}
          />
        }
      >
        <ServerQuestionList category="list-dict" urlSlug="python-liste-sozluk" displaySlug="list-dict" skeletonCount={6} />
      </CategoryPageTemplate>
    </>
  );
}
