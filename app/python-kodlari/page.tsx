// /python-kodlari — Python kod örnekleri kataloğu.
// Statik snippet'ler; her biri tarayıcıda çalıştırılabilir.

import type { Metadata } from "next";
import Link from "next/link";
import { CODE_SAMPLES, CATEGORIES, getCategory } from "./samples";
import CopyButton from "./CopyButton";

export const metadata: Metadata = {
  title: "Python Kodları — Hazır Örnekler ve Şablonlar",
  description:
    "Python kodları kataloğu — sık kullanılan algoritmalar, veri yapıları, dosya işlemleri, web scraping, API çağrıları. Kopyala, çalıştır, öğren.",
  keywords: [
    "python kodları",
    "python örnekleri",
    "python kod örnekleri",
    "python snippets",
    "python algoritmaları",
    "python şablonları",
    "python veri yapıları",
    "python string işlemleri",
    "python liste örnekleri",
    "python dosya işlemleri",
    "python api çağrısı",
    "python regex örnekleri",
  ],
  authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
  creator: "Python Mülakat",
  publisher: "Python Mülakat",
  alternates: {
    canonical: "https://pythonmulakat.com/python-kodlari",
    languages: {
      "tr-TR": "https://pythonmulakat.com/python-kodlari",
      "x-default": "https://pythonmulakat.com/python-kodlari",
    },
  },
  openGraph: {
    title: "Python Kodları — Hazır Örnekler ve Şablonlar",
    description: "Sık kullanılan Python kodları, kategorize, çalıştırılabilir.",
    url: "https://pythonmulakat.com/python-kodlari",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "https://pythonmulakat.com/og-default.png",
        width: 1200,
        height: 630,
        alt: "Python Kodları — Hazır Örnekler ve Şablonlar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Python Kodları — Hazır Örnekler ve Şablonlar",
    description: "Algoritmalar, veri yapıları, dosya işlemleri, API çağrıları. Kopyala, çalıştır.",
    images: ["https://pythonmulakat.com/og-default.png"],
    creator: "@pythonmulakat",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://pythonmulakat.com/" },
    { "@type": "ListItem", position: 2, name: "Python Kodları", item: "https://pythonmulakat.com/python-kodlari" },
  ],
};

// ItemList — 6 kategori × toplam 17 snippet için arama sonuçlarında liste çıksın
const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": "https://pythonmulakat.com/python-kodlari#snippets",
  name: "Python Kodları Kataloğu",
  description: "Sık kullanılan Python kod örnekleri ve şablonları — 6 kategoride 17 snippet.",
  numberOfItems: CODE_SAMPLES.length,
  itemListElement: CATEGORIES.map((cat, catIdx) => {
    const items = CODE_SAMPLES.filter((s) => s.category === cat.slug);
    return {
      "@type": "ListItem",
      position: catIdx + 1,
      name: cat.name,
      description: cat.description,
      numberOfItems: items.length,
      itemListElement: items.map((s, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `https://pythonmulakat.com/python-kodlari#${s.slug}`,
        name: s.title,
        description: s.description,
      })),
    };
  }),
};

// Code Snippets için HowTo + FAQPage
const howtoJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": "https://pythonmulakat.com/python-kodlari#how-to",
  name: "Python Kodlarını Tarayıcıda Çalıştırma",
  description: "Bu kütüphaneden aldığın Python kodlarını kurulum yapmadan nasıl çalıştırırsın?",
  totalTime: "PT2M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "İstediğin snippeti seç",
      text: "6 kategoriden birini seç (Başlangıç, Algoritmalar, Veri Yapıları, Dosya İşlemleri, Web/API, OOP & Patterns). Seviye etiketinden zorluk görünür.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Kodu görüntüle",
      text: "Her snippet kartında 'Kodu görüntüle' yazısına tıkla. Kod inline açılır, kopyalayabilir veya inceleyebilirsin.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Online editörde çalıştır",
      text: "Kart içindeki 'Online editörde çalıştır' butonuna bas. Kod yeni sekmede /python-online sayfasına snippet parametresiyle açılır ve Pyodide üzerinden tarayıcıda doğrudan çalışır. Kurulum gerekmez.",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://pythonmulakat.com/python-kodlari#faq",
  mainEntity: [
    {
      "@type": "Question",
      name: "Bu Python kodlarını çalıştırmak için kurulum yapmam gerekiyor mu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayır. /python-online sayfasındaki editörde Pyodide üzerinden tarayıcıda direkt çalışır. Python kurmana gerek yok. İstediğin snippeti seçip 'Online editörde çalıştır' butonuna bas, kod otomatik yüklenir.",
      },
    },
    {
      "@type": "Question",
      name: "Kodları kendi projeme kopyalayıp kullanabilir miyim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet. Tüm snippetler eğitim amaçlı paylaşılmıştır, kendi projelerinde özgürce kullanabilirsin. Her snippetin yanındaki 'Kopyala' butonu tek tıkla kodu panoya alır.",
      },
    },
    {
      "@type": "Question",
      name: "Hangi seviyeden başlamalıyım?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Her snippetin sağ üstünde seviye etiketi var (Başlangıç / Orta / İleri). Programlamaya yeniysen Başlangıç kategorisinden başla; temelin varsa doğrudan Algoritmalar veya OOP & Patterns'a geçebilirsin.",
      },
    },
    {
      "@type": "Question",
      name: "Mülakat hazırlığında bu snippetler yeterli mi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bu snippetler referans ve pratik başlangıcıdır. Kapsamlı mülakat hazırlığı için /interviews sayfasındaki 100+ gerçek dünya sorusunu çözmeni, her birinde test case'leri geçmeni öneriyoruz.",
      },
    },
  ],
};

export default function PythonKodlariPage() {
  const total = CODE_SAMPLES.length;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howtoJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="min-h-screen bg-[#050816] text-white">
        <header className="border-b border-white/10 bg-[#0a0e1a]/80 backdrop-blur">
          <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
            <div className="flex items-center gap-2 text-[10px] text-white/40 mb-3">
              <Link href="/" className="hover:text-white/70">Ana Sayfa</Link>
              <span>/</span>
              <span className="text-white/60">Python Kodları</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              Python Kodları
            </h1>
            <p className="text-base sm:text-lg text-white/70 max-w-3xl">
              Sık kullanılan <span className="text-amber-300">Python kod örnekleri</span>.
              Kopyala, tarayıcıda çalıştır, öğren. Toplam <span className="font-bold text-white">{total}</span> örnek.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 text-xs">
              {CATEGORIES.map((c) => (
                <a
                  key={c.slug}
                  href={`#${c.slug}`}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                >
                  {c.icon} {c.name} ({CODE_SAMPLES.filter(s => s.category === c.slug).length})
                </a>
              ))}
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════
            YENİ BAŞLAYANLAR İÇİN — neden bu sayfa önemli? (uzun paragraf)
           ═══════════════════════════════════════════════════════ */}
        <section className="max-w-4xl mx-auto px-4 -mt-4 mb-12">
          <article className="p-6 md:p-8 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/8 via-indigo-500/3 to-transparent">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📚</span>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Yeni başlıyorsan bu sayfa neden önemli?
              </h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-white/75 leading-relaxed">
              <p>
                Python öğrenmeye yeni başlayan birinin en büyük sorunu şudur: “<strong className="text-purple-300">Kendi başıma ne yazacağımı bilemiyorum.</strong>” Bir tutorial’ı okuyup bitiriyorsun, ekranın başına geçiyorsun, ama ne yapacağını bilmiyorsun — çünkü tutorial sana <em>başkasının</em> yazdığı kodu gösterdi, <em>sen yazmayı</em> öğretmedi. Bu sayfa o boşluğu kapatmak için hazırlandı: altı kategoride düzenlenmiş, derlenmiş, üzerinde uzun uzun düşünülmüş <strong className="text-purple-300">kısa ve net 17 snippet</strong> burada. Başlangıç kategorisinden başlayıp string ters çevirme, palindrom kontrolü, EBOB hesaplama, listedeki tekrar eden elemanları kaldırma gibi <em>günlük hayatta gerçekten işine yarayacak</em> küçük kodlarla başlıyorsun. Bunlar sırf “akademik egzersiz” değil, gerçek bir veri yapısı, gerçek bir problem: yani bunları bir yarışma çözümünde, bir otomasyon betiğinde, bir web projesinde <em>kopyala-yapıştır</em> ile değil, gerçek bir ihtiyaç karşısında yazacak hâle geliyorsun.
              </p>
              <p>
                İkinci adımda Algoritmalar kategorisinde binary search, quick sort, fibonacci’nin memoization’lı versiyonu, “iki sayının toplamı” klasikleri var. Bu snippetler <strong className="text-purple-300">mülakatlarda ve teknik görüşmelerde</strong> sürekli sorulan problemler — burada görmüş olmak, ileride bu algoritmaları duyduğunda “onu nereden biliyorum” diye düşünmeni sağlıyor. Veri Yapıları kategorisinde stack, queue ve linked list var; bu kodlar soyut veri yapısının <em>gerçek Python’da nasıl göründüğünü</em> gözüne sokuyor — üniversitede gördüğün “kavramsal” bilgi yerine, “ben şu sınıfı yazıp push/pop yaptığımda arka planda gerçekten şu oluyor” diye somut karşılığını alıyorsun. Dosya İşlemleri, Web/API ve OOP & Patterns kategorileri de <em>iş dünyasında her gün kullandığın araçları</em> gösteriyor: JSON okuma/yazma, CSV ayrıştırma, URL parametreleri ile çalışma, regex ile email doğrulama, dekoratörle fonksiyon zamanlama, dataclass ile veri modeli, context manager ile kaynak yönetimi. Bunların <em>her biri</em> çalışan projede karşına çıkacak pratik bilgiler.
              </p>
              <p>
                Bu kütüphanenin en büyük avantajı <strong className="text-purple-300">okumaya teşvik etmesi</strong>: her snippetin üstünde bir <em>seviye etiketi</em> var (Başlangıç / Orta / İleri), kısa bir açıklama var, kodu görmek için “Kodu görüntüle”ye tıklamak gerekiyor — yani önce kodu kendin yazmayı deniyorsun, sonra tıklayıp doğru cevabı inceliyorsun. Bir adım daha ileri gitmek istersen snippetin altındaki <em>“Online editörde çalıştır”</em> butonuna basıp kodu tarayıcıda açıp üzerinde oynayarak davranışını gözlemliyorsun. Bu da <strong className="text-purple-300">referans defterin</strong> olmuş oluyor: bir algoritmayı, bir kalıbı, bir standart kütüphane kullanımını unuttuğunda buraya dönüp 30 saniyede doğru yazılışını bulabiliyorsun. Yeni başlayan biri olarak en kritik şey yalıtılmış syntax bilgisi değil, <em>“bu kalıbı şurada kullanacağım”</em> içgüdüsü — ve bu içgüdü, başkalarının yazdığı temiz ve çalışan kodu art arda okumaktan geçiyor.
              </p>
            </div>
          </article>
        </section>

        <main className="max-w-5xl mx-auto px-4 py-10 space-y-12">
          {CATEGORIES.map((cat) => {
            const items = CODE_SAMPLES.filter((s) => s.category === cat.slug);
            if (items.length === 0) return null;
            return (
              <section key={cat.slug} id={cat.slug} className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl">{cat.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold">{cat.name}</h2>
                    <p className="text-sm text-white/60">{cat.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {items.map((s) => (
                    <article key={s.slug} id={s.slug} className="p-5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-colors scroll-mt-20">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{s.title}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex-shrink-0 ${
                          s.level === "Başlangıç" ? "bg-emerald-500/15 text-emerald-300" :
                          s.level === "Orta" ? "bg-amber-500/15 text-amber-300" :
                          "bg-rose-500/15 text-rose-300"
                        }`}>
                          {s.level}
                        </span>
                      </div>
                      <p className="text-sm text-white/60 mb-3 leading-relaxed">{s.description}</p>
                      <details className="group">
                        <summary className="cursor-pointer text-xs text-amber-300 hover:text-amber-200 list-none flex items-center gap-1.5">
                          <span className="group-open:rotate-90 transition-transform">▶</span>
                          Kodu görüntüle
                        </summary>
                        <pre className="mt-3 p-3 rounded-lg bg-[#0a0e1a] border border-white/5 overflow-x-auto font-mono text-[12px] leading-relaxed text-white/85">
                          <code>{s.code}</code>
                        </pre>
                        <div className="mt-2 flex items-center gap-2 text-[10px] text-white/40">
                          <a
                            href={`/python-online?snippet=${encodeURIComponent(s.slug)}`}
                            className="px-2 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25"
                          >
                            ▶ Online editörde çalıştır
                          </a>
                          <CopyButton code={s.code} />
                        </div>
                      </details>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}

          <section className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20">
            <h2 className="text-xl font-bold mb-3">💡 Öneri</h2>
            <p className="text-sm text-white/70 leading-relaxed mb-3">
              Bu örnekleri sadece kopyalama. Her birini <Link href="/python-online" className="text-amber-300 hover:underline">online editörde</Link> aç,
              değiştir, boz, tekrar dene. Bir hatayla karşılaşmak, gerçek öğrenmenin başladığı yerdir.
            </p>
            <p className="text-sm text-white/70 leading-relaxed">
              Kapsamlı öğrenmek istiyorsan <Link href="/python-egitimi" className="text-amber-300 hover:underline">Python eğitimi</Link>ne,
              gerçek problemlerle pratik için <Link href="/interviews" className="text-amber-300 hover:underline">mülakat soruları</Link>na bak.
            </p>
          </section>
        </main>
      </div>
    </>
  );
}