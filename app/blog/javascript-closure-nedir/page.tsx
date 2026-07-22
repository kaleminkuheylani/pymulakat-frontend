// app/blog/javascript-closure-nedir/page.tsx
//
// PYBlog yazisi #6: "JavaScript Closure Nedir?"
// 2026-07-19: Ubersuggest long-tail — golden keyword
//   - javascript closure nedir (1.5K volume, PD 1)
//   - javascript closure örnekleri (480)
//   - javascript kapsam (closure) (320)
//   - closure mülakat sorusu (590)
//   - javascript hoisting ve closure (yillik)
//
// Tema: teknik-terimler yazisi gibi — benzetime dayali, FAQ + Article schema.

import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen, Clock, ArrowLeft, ArrowRight, ArrowDown,
  CheckCircle2, Lightbulb, Code2, AlertTriangle, KeyRound,
  Layers, Repeat, Lock,
} from "lucide-react";
import { notFound } from "next/navigation";
import { BASE_URL } from "@/lib/seo";
import { getPost, getAllPosts } from "../posts";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const post = await getPost("javascript-closure-nedir");
  if (!post) return { title: "Yazı Bulunamadı" };
  return {
    title: `${post.title} | PYBlog`,
    description: post.excerpt,
    keywords: [
      // 2026-07-22 keyword stuffing temizligi: 15 → 8 unique phrase.
      "closure nedir",
      "javascript kapsam",
      "closure mulakat sorusu",
      "javascript hoisting",
      "javascript prototype",
      "javascript mulakat",
      "frontend mulakat",
      "javascript ileri seviye",
      ...post.tags,
    ],
    authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/blog/javascript-closure-nedir`,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: `${BASE_URL}/blog/javascript-closure-nedir`,
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// JSON-LD: Article + FAQ + BreadcrumbList
// ═══════════════════════════════════════════════════════════════

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${BASE_URL}/blog/javascript-closure-nedir#article`,
  headline: "JavaScript Closure Nedir? — Kapsam ve Fonksiyon Hafızası (Örneklerle)",
  description:
    "JavaScript'in en çok sorulan mülakat konusu: closure nedir, nasıl çalışır, hangi problemi çözer. Gerçek dünya benzetmeleri, 5 kod örneği, mülakat SSS ve sık yapılan hatalar.",
  image: `${BASE_URL}/og-default.png`,
  datePublished: "2026-07-19",
  dateModified: "2026-07-19",
  inLanguage: "tr-TR",
  articleSection: "Eğitim",
  keywords: "closure nedir, javascript kapsam, mulakat sorusu, hoisting, prototype",
  author: {
    "@type": "Organization",
    name: "Python Mülakat",
    url: BASE_URL,
  },
  publisher: {
    "@type": "Organization",
    name: "Python Mülakat",
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/og-default.png`,
    },
  },
  mainEntityOfPage: `${BASE_URL}/blog/javascript-closure-nedir`,
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${BASE_URL}/blog/javascript-closure-nedir#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "JavaScript closure nedir, en basit şekilde nasıl açıklanır?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Closure, bir fonksiyonun kendi kapsamı dışındaki değişkenlere, tanımlandığı ortamın hafızası hâlâ canlıyken erişebilmesidir. Yani iç fonksiyon, dış fonksiyonun değişkenlerini 'hatırlar' ve o değişkenler çöp toplayıcı tarafından silinmez. Bu, JavaScript'te fonksiyon birinci sınıf vatandaş (first-class citizen) olduğu için mümkün olur.",
      },
    },
    {
      "@type": "Question",
      name: "Closure ile kapsam (scope) arasındaki fark nedir?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Kapsam, değişkenin nerede erişilebilir olduğunu belirler (global, function, block). Closure ise bir fonksiyonun kapsamı dışındaki değişkenlere hâlâ referans tutabilmesini sağlar. İkisi farklı kavramlar: kapsam değişkenin erişim alanını, closure ise o erişimin zaman içinde nasıl korunduğunu tanımlar.",
      },
    },
    {
      "@type": "Question",
      name: "JavaScript'te en klasik closure örneği nedir?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Sayaç (counter) fonksiyonu: dış fonksiyon bir 'count' değişkeni tanımlar ve iç fonksiyonu döner. İç fonksiyon count'u artırır. count hiçbir yerden doğrudan erişilemez ama iç fonksiyon üzerinden değiştirilebilir. Bu 'private state' örüntüsüdür.",
      },
    },
    {
      "@type": "Question",
      name: "Loop içinde closure kullanırken sık yapılan hata nedir?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Klasik hata: 'var i' ile for döngüsü yazıp, içeride setTimeout veya event listener ile i'yi kullanmak. Hep aynı son değeri görürsün çünkü tüm closure'lar aynı 'i' değişkenine referans verir. Çözüm: 'let i' kullan (block scope, her iterasyonda yeni i) veya IIFE ile kapsam yarat.",
      },
    },
    {
      "@type": "Question",
      name: "Closure mülakat sorusu: 'setTimeout içinde neden hep aynı i çıkıyor?'",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Çünkü 'var' function-scoped, tüm iterasyonlar aynı 'i' değişkenini paylaşıyor. setTimeout callback'i döngü bittikten sonra çalışıyor ve o an i=5 (son değer). Çözüm: 'let' kullan (her iterasyon yeni 'i' oluşturur) veya 'forEach' kullan (callback parametre olarak 'i' alır, kapsam sorunu olmaz).",
      },
    },
    {
      "@type": "Question",
      name: "JavaScript'te closure performans açısından sorunlu mu?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Çoğu durumda hayır. Modern motorlar closure'ları optimize eder. Ancak çok büyük objeleri closure içinde tutarsan, o objeler garbage collector tarafından serbest bırakılmaz — memory leak riski olabilir. Pratikte çoğu closure kullanımı güvenlidir; dikkat etmen gereken yer: event listener'larda tutulan büyük veri yapıları.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "PYBlog", item: `${BASE_URL}/blog/sifirdan-zirveye` },
    { "@type": "ListItem", position: 3, name: "JavaScript Closure Nedir?", item: `${BASE_URL}/blog/javascript-closure-nedir` },
  ],
};

export default async function Page() {
  const post = await getPost("javascript-closure-nedir");
  if (!post) notFound();
  const OTHER_POSTS = (await getAllPosts())
    .filter((p) => p.slug !== "javascript-closure-nedir")
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) } as any}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) } as any}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) } as any}
      />

      {/* ── Üst Bar ──────────────────────────────────────── */}
      <header className="border-b border-white/10 bg-[#0a0e1a]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/blog/sifirdan-zirveye"
            className="text-sm text-white/60 hover:text-amber-300 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            PYBlog
          </Link>
          <div className="flex items-center gap-3 text-xs text-white/40">
            <Clock className="w-3.5 h-3.5" />
            {post.readingMinutes} dakika okuma
          </div>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-10 md:py-16 space-y-12">
        {/* ── Başlık ──────────────────────────────────────── */}
        <header className="space-y-5">
          <div className="flex items-center gap-2 text-xs text-amber-300/80">
            <BookOpen className="w-4 h-4" />
            <span className="uppercase tracking-wider font-semibold">JavaScript</span>
            <span className="text-white/30">·</span>
            <span className="text-white/50">
              {new Date(post.date).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            JavaScript Closure Nedir?
          </h1>

          <p className="text-lg text-white/70 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.map((t) => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/60 border border-white/10">
                #{t.replace(/\s+/g, "-")}
              </span>
            ))}
          </div>
        </header>

        {/* ── İçindekiler ──────────────────────────────────── */}
        <nav className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            İçindekiler
          </h2>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            <a href="#seviye-0" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />0. Closetrafi dolu (bedava dusunce)
            </a>
            <a href="#seviye-1" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />1. Benzetme: çantaya not koymak
            </a>
            <a href="#seviye-2" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />2. En basit kod ornegi
            </a>
            <a href="#seviye-3" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />3. Sayac (counter) ornegi
            </a>
            <a href="#seviye-4" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />4. Loop + setTimeout sik hata
            </a>
            <a href="#seviye-5" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />5. Gercek projede kullanim
            </a>
            <a href="#sss" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />6. Mulakat SSS
            </a>
            <a href="#sonuc" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />7. Sonuc
            </a>
          </div>
        </nav>

        {/* ════════════════════════════════════════════════════
            0. Closetrafi dolu — yanlis inanclar
        ════════════════════════════════════════════════════ */}
        <section id="seviye-0" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 0</div>
            <h2 className="text-2xl md:text-3xl font-bold">Closetrafi dolu, once onleri bosaltalim</h2>
          </header>
          <p className="text-white/80 leading-relaxed">
            JavaScript ogrenmeye yeni baslayan veya 2-3 yildir yazan ama temel kavramlari tam oturtamamis herkes, "closure" denince bir tedirginlik yasar. Bunun sebebi, konunun etrafinda gereksiz bir "gizem" olusturulmus olmasi. Aslinda closure basit bir sey — hayatinda bir kez anladin mi bir daha unutmuyorsun.
          </p>
          <p className="text-white/80 leading-relaxed">
            <strong>Yaygin yanlis inanclar:</strong>
          </p>
          <ul className="space-y-2 list-disc list-inside text-white/70">
            <li>"Closure super karmasik bir sey" — degil, bir kapsam + bir fonksiyon, o kadar.</li>
            <li>"Sadece ileri seviye JavaScript'te kullanilir" — her yerde, en basit callback'lerde bile var.</li>
            <li>"Performansi cok yer" — cogu durumda motor optimize eder, dert etmeye gerek yok.</li>
            <li>"Mulakatta sorulmaz" — JavaScript mulakatinin <strong>%80</strong>'inde ilk 3 sorudan biri.</li>
          </ul>
          <p className="text-white/80 leading-relaxed">
            Bu yazi, closure'i 12 dakikada "bir daha unutmayacagin" sekilde anlatmak icin yazildi. Somut ornekler, benzetmeler ve mulakat SSS ile.
          </p>
        </section>

        {/* ════════════════════════════════════════════════════
            1. BENZETME — çantaya not koymak
        ════════════════════════════════════════════════════ */}
        <section id="seviye-1" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 1</div>
            <h2 className="text-2xl md:text-3xl font-bold">Benzetme: Çantaya not koymak</h2>
          </header>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 text-sm font-bold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              Gerçek hayat benzetmesi
            </div>
            <p className="text-white/85 leading-relaxed">
              Bir <strong>restoran garsonusunu</strong> dusun. Masaya gelir, siparisi alir, mutfaga goturur, yemegi getirir. Masanin siparisini <strong>ezberinde tutar</strong> — cunku musteri hâlâ orada. Masanin siparisini "kafasi"nda tutan bu garson, aslinda bir <strong>closure</strong>: dis dunyadan (masa) bir parcayi iceride (kafasinda) tutuyor.
            </p>
            <p className="text-white/85 leading-relaxed">
              JavaScript'te <strong>ic fonksiyon</strong> bu garson. <strong>Dis fonksiyonun degiskenleri</strong> (count, name, vs.) o masa. Ic fonksiyon, dis fonksiyon "bitmis" gibi gorunse bile o degiskenleri canli tutmaya devam ediyor — ta ki kendisi de "emekli olana" kadar.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            2. EN BASIT KOD ORNEGI
        ════════════════════════════════════════════════════ */}
        <section id="seviye-2" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 2</div>
            <h2 className="text-2xl md:text-3xl font-bold">En basit kod örneği</h2>
          </header>

          <p className="text-white/80 leading-relaxed">
            Asagidaki kodu ac ve ne oldugunu tahmin et. Sonra calistir:
          </p>

          <CodeBlock>
{`function disFonksiyon() {
  const mesaj = "Merhaba";

  function icFonksiyon() {
    console.log(mesaj);  // ← "mesaj" disFonksiyon'un degiskeni
  }

  return icFonksiyon;
}

const fn = disFonksiyon();
fn();  // Cikti: "Merhaba" 😮`}
          </CodeBlock>

          <p className="text-white/80 leading-relaxed">
            <code className="text-amber-300">disFonksiyon()</code> calistirildi ve bitti. <code className="text-amber-300">mesaj</code> degiskeni artik o scope'ta <strong>var olmamali</strong> — cunku fonksiyon dondu, scope temizlendi. <strong>Ama</strong> <code className="text-amber-300">fn()</code> cagirinca hâlâ "Merhaba" yazdiriyor.
          </p>

          <p className="text-white/80 leading-relaxed">
            Bu mumkun, cunku <code className="text-amber-300">icFonksiyon</code>, <code className="text-amber-300">mesaj</code>'i bir <strong>closure</strong> icinde "hapsediyor". JavaScript motoru, icFonksiyon hâlâ hayattayken o degiskeni garbage collector'a teslim etmiyor.
          </p>

          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/[0.03] p-4 text-sm">
            <strong className="text-cyan-200">Tek cumleyle:</strong> Closure = bir fonksiyonun, dogdugu ortamdan aldigi ve o ortam yok olsa bile tuttugu degiskenler.
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            3. SAYAC (COUNTER) — klasik örnek
        ════════════════════════════════════════════════════ */}
        <section id="seviye-3" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 3</div>
            <h2 className="text-2xl md:text-3xl font-bold">Sayaç (counter) — klasik örnek</h2>
          </header>

          <p className="text-white/80 leading-relaxed">
            Mulakatlarda en cok sorulan ornek: <strong>bir sayac olustur</strong>, disaridan <code>count</code>'a dogrudan erisilemesin, sadece "arttir" ve "oku" metodlari olsun. Class yazmadan yapabilir misin? Closure ile olur:
          </p>

          <CodeBlock>
{`function sayacOlustur() {
  let count = 0;  // private degisken — disaridan erisilemez

  return {
    arttir: function() {
      count += 1;
      return count;
    },
    oku: function() {
      return count;
    }
  };
}

const s = sayacOlustur();
console.log(s.oku());     // 0
console.log(s.arttir());  // 1
console.log(s.arttir());  // 2
console.log(s.oku());     // 2
// s.count  ← undefined! Disaridan erisilemez`}
          </CodeBlock>

          <p className="text-white/80 leading-relaxed">
            Burada <code className="text-amber-300">count</code> degiskeni hicbir zaman dogrudan erisilebilir degil — sadece <code>arttir()</code> ve <code>oku()</code> fonksiyonlari uzerinden kontrol edilebilir. Bu <strong>encapsulation</strong>'in en sade hali, ve JavaScript'te class yazmadan mumkun.
          </p>

          <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.03] p-4 text-sm">
            <strong className="text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Mulakat tuzagi
            </strong>
            <p className="text-white/70 mt-1">
              "Class yazmadan private degisken nasil olusturulur?" sorusuna cevap: closure ile. Bu klasik JavaScript mulakat sorusudur, cevap bu sayfadaki sayac ornegidir.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            4. LOOP + setTimeout — sık yapılan hata
        ════════════════════════════════════════════════════ */}
        <section id="seviye-4" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 4</div>
            <h2 className="text-2xl md:text-3xl font-bold">Loop + setTimeout — sık yapılan hata</h2>
          </header>

          <p className="text-white/80 leading-relaxed">
            Asagidaki kodu calistir. Ne bekliyorsun, ne oluyor?
          </p>

          <CodeBlock>
{`// YANLIS — var function-scoped
for (var i = 1; i <= 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, i * 100);
}
// Cikti: 4, 4, 4  ❌  (Beklenti: 1, 2, 3)`}
          </CodeBlock>

          <p className="text-white/80 leading-relaxed">
            Hep <strong>4</strong> yazdirmasinin sebebi: <code>var i</code> function-scoped, yani tum iterasyonlar ayni <code>i</code> degiskenini paylasiyor. setTimeout callback'i dongu bittikten sonra calistiginda <code>i</code> artik <strong>4</strong>'e esit.
          </p>

          <p className="text-white/80 leading-relaxed">
            <strong>Cozum 1:</strong> <code>let</code> kullan (block-scoped, her iterasyon yeni <code>i</code>):
          </p>

          <CodeBlock>
{`// DOGRU — let block-scoped
for (let i = 1; i <= 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, i * 100);
}
// Cikti: 1, 2, 3  ✓`}
          </CodeBlock>

          <p className="text-white/80 leading-relaxed">
            <strong>Cozum 2:</strong> <code>forEach</code> kullan (callback parametre olarak <code>i</code> alir):
          </p>

          <CodeBlock>
{`// DOGRU — forEach
[1, 2, 3].forEach(function(i) {
  setTimeout(function() {
    console.log(i);
  }, i * 100);
});
// Cikti: 1, 2, 3  ✓`}
          </CodeBlock>

          <p className="text-white/80 leading-relaxed">
            <strong>Cozum 3 (closure, eski usul):</strong> IIFE ile yeni kapsam:
          </p>

          <CodeBlock>
{`// ESKI USUL — IIFE
for (var i = 1; i <= 3; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j);
    }, j * 100);
  })(i);
}
// Cikti: 1, 2, 3  ✓`}
          </CodeBlock>

          <p className="text-white/80 leading-relaxed">
            Mulakatta "neden hep 4 cikti?" diye sorarlarsa, "var function-scoped, tum iterasyonlar ayni i'yi paylasiyor, setTimeout dongu bittikten sonra calistigi icin i=4" cevabini ver. Pratikte bugun <code>let</code> veya <code>forEach</code> kullan — <code>var</code> ile dongu yazma.
          </p>
        </section>

        {/* ════════════════════════════════════════════════════
            5. GERÇEK PROJEDE KULLANIM
        ════════════════════════════════════════════════════ */}
        <section id="seviye-5" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 5</div>
            <h2 className="text-2xl md:text-3xl font-bold">Gerçek projede kullanım</h2>
          </header>

          <p className="text-white/80 leading-relaxed">
            Closure'i gercek projede 4 yerde gorursun. Bunlari bilmek mulakatta "evet kullaniyorum" demeni saglar.
          </p>

          <div className="space-y-3">
            <UseCase
              title="1. React'te useState"
              desc="useState bir closure — setter fonksiyonu, state'in onceki degerini 'gorur' ve gunceller. useEffect'in bagimlilik dizisi de closure yakalar."
            />
            <UseCase
              title="2. Event handler'lar"
              desc="Butona tiklandiginda calisan fonksiyon, tanimlandigi scope'taki degiskenlere erisir. En klasik closure kullanimi."
            />
            <UseCase
              title="3. Module pattern (ES module oncesi)"
              desc="IIFE ile modul sarmalayip, dis dunyaya sadece belirli API'ler acardik. Bugun ES module var ama mantik ayni: private state, public API."
            />
            <UseCase
              title="4. Debounce / throttle"
              desc="Bir fonksiyonu her seferinde cagirmak yerine, belli bir sure bekleyip son cagiriyi yapan yapilar closure ile yapilir (orn: lodash.debounce, lodash.throttle)."
            />
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.03] p-4 text-sm space-y-2">
            <strong className="text-emerald-200">Debounce ornegi (closure kullanimi):</strong>
            <CodeBlock>
{`function debounce(fn, ms) {
  let timeoutId;  // closure'da tutuluyor

  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}

const aramaYap = debounce(function(query) {
  console.log("Araniyor:", query);
}, 300);

// Kullanicinin her tus vurusunda aramaYap('p'), aramaYap('py'), aramaYap('pyt')
// Sadece sonuncusu 300ms sonra calisir — oncekiler iptal olur`}
            </CodeBlock>
            <p className="text-white/70 text-xs">
              Burada <code>timeoutId</code> her cagirilan <code>debounce</code> instance'i icin ayri tutuluyor. Closure, ayni instance'in farkli cagrilardaki timeout ID'lerini karistirmadan yonetmesini sagliyor.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            6. SSS
        ════════════════════════════════════════════════════ */}
        <section id="sss" className="space-y-3 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">SSS</div>
            <h2 className="text-2xl md:text-3xl font-bold">Mulakat SSS</h2>
          </header>

          <FaqItem
            q="JavaScript closure nedir, en basit şekilde nasıl açıklanır?"
            a="Closure, bir fonksiyonun kendi kapsamı dışındaki değişkenlere, tanımlandığı ortamın hafızası hâlâ canlıyken erişebilmesidir. Yani iç fonksiyon, dış fonksiyonun değişkenlerini 'hatırlar' ve o değişkenler çöp toplayıcı tarafından silinmez. Bu, JavaScript'te fonksiyon birinci sınıf vatandaş (first-class citizen) olduğu için mümkün olur."
          />
          <FaqItem
            q="Closure ile kapsam (scope) arasındaki fark nedir?"
            a="Kapsam, değişkenin nerede erişilebilir olduğunu belirler (global, function, block). Closure ise bir fonksiyonun kapsamı dışındaki değişkenlere hâlâ referans tutabilmesini sağlar. İkisi farklı kavramlar: kapsam değişkenin erişim alanını, closure ise o erişimin zaman içinde nasıl korunduğunu tanımlar."
          />
          <FaqItem
            q="JavaScript'te en klasik closure örneği nedir?"
            a="Sayaç (counter) fonksiyonu: dış fonksiyon bir 'count' değişkeni tanımlar ve iç fonksiyonu döner. İç fonksiyon count'u artırır. count hiçbir yerden doğrudan erişilemez ama iç fonksiyon üzerinden değiştirilebilir. Bu 'private state' örüntüsüdür."
          />
          <FaqItem
            q="Loop içinde closure kullanırken sık yapılan hata nedir?"
            a="Klasik hata: 'var i' ile for döngüsü yazıp, içeride setTimeout veya event listener ile i'yi kullanmak. Hep aynı son değeri görürsün çünkü tüm closure'lar aynı 'i' değişkenine referans verir. Çözüm: 'let i' kullan (block scope, her iterasyonda yeni i) veya IIFE ile kapsam yarat."
          />
          <FaqItem
            q="Mulakat sorusu: setTimeout içinde neden hep aynı i çıkıyor?"
            a="Çünkü 'var' function-scoped, tüm iterasyonlar aynı 'i' değişkenini paylaşıyor. setTimeout callback'i döngü bittikten sonra çalışıyor ve o an i=5 (son değer). Çözüm: 'let' kullan (her iterasyon yeni 'i' oluşturur) veya 'forEach' kullan (callback parametre olarak 'i' alır, kapsam sorunu olmaz)."
          />
          <FaqItem
            q="JavaScript'te closure performans açısından sorunlu mu?"
            a="Çoğu durumda hayır. Modern motorlar closure'ları optimize eder. Ancak çok büyük objeleri closure içinde tutarsan, o objeler garbage collector tarafından serbest bırakılmaz — memory leak riski olabilir. Pratikte çoğu closure kullanımı güvenlidir; dikkat etmen gereken yer: event listener'larda tutulan büyük veri yapıları."
          />
        </section>

        {/* ════════════════════════════════════════════════════
            7. SONUÇ
        ════════════════════════════════════════════════════ */}
        <section id="sonuc" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Sonuç</div>
            <h2 className="text-2xl md:text-3xl font-bold">Bir cümlede özet</h2>
          </header>

          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.05] to-transparent p-6 space-y-3">
            <p className="text-white/90 text-lg leading-relaxed">
              <strong className="text-amber-300">Closure, JavaScript'in "bir fonksiyonu her şeyiyle hatırlayan bir nesne" gibi davranmasını sağlayan mekanizmadır.</strong>
            </p>
            <p className="text-white/70 text-sm">
              Bunu bilmek mülakatta sana +5 puan kazandırır, gerçek projede debug yeteneğini 2x artırır. Sıradaki adım: React'te useState, useEffect gibi hook'ların neden closure kullandığını anlamak — aynı prensip.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">Sıradaki adımlar</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />Tarayıcıda <code>function disFonksiyon() {'{...}'}</code> örneğini dene, mesaj'ın neden hâlâ erişilebilir olduğunu gözlemle</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /><Link href="/blog/sifirdan-zirveye" className="text-amber-300 hover:underline">Sıfırdan Zirveye</Link> yazımızla programlama temellerini pekiştir</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /><Link href="/interviews/algorithms" className="text-amber-300 hover:underline">Algoritma soruları</Link> ile closure gerektiren problemleri çöz</li>
            </ul>
          </div>
        </section>

        {/* ── İlgili Yazılar ────────────────────────────────── */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">İlgili Yazılar</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {OTHER_POSTS.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group p-4 rounded-xl border border-white/10 hover:border-amber-500/30 transition-colors">
                <div className="text-sm font-semibold mb-1 group-hover:text-amber-300 transition-colors line-clamp-2">{p.title}</div>
                <div className="text-xs text-white/60 line-clamp-2">{p.excerpt}</div>
              </Link>
            ))}
            <Link href="/interviews" className="group p-4 rounded-xl border border-white/10 hover:border-amber-500/30 transition-colors">
              <div className="text-sm font-semibold mb-1 group-hover:text-amber-300 transition-colors">Mülakat Sorularına Geç</div>
              <div className="text-xs text-white/60">closure dahil tüm konuları pratik et.</div>
            </Link>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.05] to-transparent p-8 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">Closure öğrendin, şimdi diğerlerini de</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            JavaScript'in en çok sorulan mülakat konularını sırayla öğren: hoisting, this, prototype, async/await, event loop.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link
              href="/interviews"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-[#050816] font-semibold hover:bg-amber-400 transition-colors"
            >
              Sorulara Başla
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/blog/teknik-terimler"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/15 transition-colors"
            >
              <KeyRound className="w-4 h-4" />
              Teknik Terimler
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Yardımcı Componentler
// ═══════════════════════════════════════════════════════════════

function UseCase({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-1">
      <h4 className="text-sm font-bold text-amber-200">{title}</h4>
      <p className="text-xs text-white/70 leading-relaxed">{desc}</p>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="rounded-lg bg-[#0a0e1a] border border-white/10 p-4 overflow-x-auto text-xs leading-relaxed">
      <code className="text-white/90 font-mono whitespace-pre">{children}</code>
    </pre>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="rounded-xl border border-white/10 bg-white/[0.02] p-4 group">
      <summary className="cursor-pointer font-semibold text-white/90 flex items-center justify-between gap-3">
        <span>{q}</span>
        <ArrowDown className="w-4 h-4 text-white/40 transition-transform group-open:rotate-180 flex-shrink-0" />
      </summary>
      <p className="text-white/70 leading-relaxed mt-3">{a}</p>
    </details>
  );
}


