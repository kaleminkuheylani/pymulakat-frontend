// /python-pandas — Pandas soruları kataloğu sayfası.

import type { Metadata } from "next";
import CategoryPageTemplate, { type RelatedCategory } from "../../components/CategoryPageTemplate";
import ServerQuestionList from "../../components/ServerQuestionList";
import CategoryContext, { type ContextBlock } from "../../components/CategoryContext";

export const metadata: Metadata = {
  title: "Python Pandas Soruları ve Çözümleri",
  description:
    "Python pandas soruları: DataFrame, Series, groupby, merge, filter, agg. 13+ interaktif soru, AI feedback.",
  keywords: [
    "python pandas",
    "pandas soruları",
    "pandas mülakat",
    "python dataframe",
    "pandas groupby",
    "pandas merge",
    "pandas alıştırma",
    "python veri bilimi",
    "python mülakat soruları",
    "python mülakat hazırlık",
    "python online test çöz",
  ],
  authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
  creator: "Python Mülakat",
  publisher: "Python Mülakat",
  alternates: {
    canonical: "https://pythonmulakat.com/python-pandas",
    languages: { "tr-TR": "https://pythonmulakat.com/python-pandas", "x-default": "https://pythonmulakat.com/python-pandas" },
  },
  openGraph: {
    title: "Python Pandas Soruları ve Çözümleri",
    description: "DataFrame, Series, groupby, merge — 13+ interaktif soru.",
    url: "https://pythonmulakat.com/python-pandas",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "https://pythonmulakat.com/og-default.png", width: 1200, height: 630, alt: "Python Pandas — pythonmulakat.com" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Python Pandas — İnteraktif Pratik",
    description: "DataFrame, Series, groupby, merge. 13+ soru.",
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
    { "@type": "ListItem", position: 3, name: "Python Pandas", item: "https://pythonmulakat.com/python-pandas" },
  ],
};

const related: RelatedCategory[] = [
  { href: "/python-temelleri", icon: "🐍", title: "Python Temelleri", description: "Değişkenler, veri tipleri, döngüler, fonksiyonlar.", gradient: "indigo-amber" },
  { href: "/python-liste-sozluk", icon: "📋", title: "Liste & Sözlük", description: "List, dict, tuple, set işlemleri.", gradient: "amber-indigo" },
  { href: "/interviews", icon: "📚", title: "Tüm Mülakat Kategorileri", description: "9 kategori, 132 soru.", gradient: "indigo-amber" },
  { href: "/python-kodlari", icon: "📖", title: "Python Kodları", description: "Pandas dahil hazır kod örnekleri.", gradient: "amber-indigo" },
  { href: "/python-online", icon: "🖥️", title: "Python Online", description: "Tarayıcıda Python 3.12 çalıştır.", gradient: "indigo-amber" },
  { href: "/python-egitimi", icon: "🎓", title: "Python Eğitimi", description: "Sıfırdan ileri seviyeye Türkçe dersler.", gradient: "amber-indigo" },
];

const contextBlocks: ContextBlock[] = [
  {
    heading: "Pandas Nedir?",
    paragraphs: [
      <>
        <strong className="text-amber-400">Pandas</strong>, Python&apos;ın en popüler veri analizi kütüphanesidir. İki temel veri yapısı vardır: <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">Series</code> (1 boyutlu, etiketli dizi) ve <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">DataFrame</code> (2 boyutlu, etiketli tablo — satır ve sütun). Pandas ile CSV/Excel okuma, veri temizleme, filtreleme, gruplama, birleştirme ve zaman serisi analizi yapılır.
      </>,
      <>
        Mülakatlarda en sık sorulan Pandas soruları: <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">groupby</code> ile gruplama, <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">merge/join</code> ile birleştirme, <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">apply</code> ile özel fonksiyon, <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">pivot_table</code>, eksik veri yönetimi (<code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">fillna/dropna</code>), string işlemleri (<code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">.str</code>), <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">loc/iloc</code> ile seçim.
      </>,
    ],
    code: {
      label: "temel_pandas.py",
      content: `import pandas as pd

# DataFrame oluşturma
df = pd.DataFrame({
    "isim": ["Ali", "Ayşe", "Mehmet"],
    "yas":  [28, 24, 32],
    "sehir": ["İstanbul", "Ankara", "İzmir"],
})

# Filtreleme
genc = df[df["yas"] < 30]

# GroupBy
df.groupby("sehir")["yas"].mean()

# Merge
left = pd.DataFrame({"id": [1, 2], "ad": ["A", "B"]})
right = pd.DataFrame({"id": [1, 2], "yas": [28, 24]})
merged = left.merge(right, on="id")

# Eksik veri
df["yas"].fillna(df["yas"].mean())`,
    },
  },
  {
    heading: "Pandas vs SQL vs Excel",
    paragraphs: [
      <>
        Pandas, SQL&apos;e göre daha esnek ve in-process&apos;tir; Excel&apos;e göre ise milyonlarca satıra ölçeklenebilir ve tekrarlanabilir (reproducible). Veri bilimi mülakatlarında "şu SQL sorgusunu Pandas&apos;la yaz" veya "şu Excel işlemini kod ile yap" tipi sorular sıklıkla gelir. Pandas ile <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">read_csv</code>, <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">read_excel</code>, <code className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 text-sm">read_sql</code> ile farklı kaynaklardan veri okuyabilirsin.
      </>,
    ],
    tip: {
      title: "Mülakat Öncesi Bilmen Gereken 5 Şey",
      text: (
        <ol className="list-decimal pl-5 space-y-1 mt-1">
          <li><code className="px-1 py-0.5 rounded bg-white/5 text-amber-300 text-xs">loc</code> (label-based) vs <code className="px-1 py-0.5 rounded bg-white/5 text-amber-300 text-xs">iloc</code> (integer-based) farkı</li>
          <li><code className="px-1 py-0.5 rounded bg-white/5 text-amber-300 text-xs">groupby().agg()</code> ile çoklu agregasyon</li>
          <li><code className="px-1 py-0.5 rounded bg-white/5 text-amber-300 text-xs">merge</code> tipleri (inner, left, right, outer)</li>
          <li>Chained indexing&apos;den kaçın (<code className="px-1 py-0.5 rounded bg-white/5 text-amber-300 text-xs">SettingWithCopyWarning</code>)</li>
          <li>Vectorized operations vs <code className="px-1 py-0.5 rounded bg-white/5 text-amber-300 text-xs">apply</code> performans farkı</li>
        </ol>
      ),
    },
    whenToUse: {
      title: "Pandas Ne Zaman Kullanılır?",
      items: [
        "CSV/Excel/JSON veri kaynaklarını analiz etmek için",
        "Veri temizleme: eksik değer, tekrar, tip dönüşümü",
        "İstatistiksel analiz: ortalama, korelasyon, dağılım",
        "Veri görselleştirme öncesi hazırlık (Matplotlib/Seaborn)",
        "Feature engineering: makine öğrenmesi için veri hazırlama",
      ],
    },
  },
];

export default function PythonPandasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <CategoryPageTemplate
        title="Python Pandas"
        subtitle={
          <>
            Python pandas soruları ile mülakata hazırlan. DataFrame, Series, groupby, merge, filter, agg için{" "}
            <strong className="text-amber-400">13+ interaktif soru</strong>. Tarayıcıda kod yaz, otomatik test et, yapay zekâdan anında geri bildirim al.
          </>
        }
        tags={["DataFrame", "Series", "groupby", "merge", "filter", "agg", "apply"]}
        backHref="/interviews"
        backLabel="Tüm Kategoriler"
        related={related}
        beforeRelated={
          <CategoryContext
            category="Python Pandas"
            blocks={contextBlocks}
            furtherReading={[
              { label: "Python Temelleri", href: "/python-temelleri" },
              { label: "Python Liste & Sözlük", href: "/python-liste-sozluk" },
              { label: "Python Kodları", href: "/python-kodlari" },
            ]}
          />
        }
      >
        <ServerQuestionList category="pandas" urlSlug="python-pandas" displaySlug="pandas" skeletonCount={6} />
      </CategoryPageTemplate>
    </>
  );
}
