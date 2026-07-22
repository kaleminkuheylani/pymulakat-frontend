// app/blog/javascript-this-keyword/page.tsx
//
// PYBlog yazisi #10: "JavaScript this Keyword Nedir?"
// 2026-07-22: Mulakatlarin en kafa karistirici konusu.
//   Ubersuggest long-tail — EN YUKSEK HACIM this sorgulari:
//   - javascript this keyword (4.8K volume, PD 1, altin)
//   - javascript this nedir (2.1K)
//   - javascript this arrow function (1.6K)
//   - javascript call apply bind (1.3K)
//   - javascript this context (980)
//   - javascript bind nedir (720)
//   - javascript this strict mode (480)
//   - javascript this farki (590)
//
// Mulakatta closure + hoisting + promise + async/await + this beslisi.

import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen, Clock, ArrowLeft, ArrowRight, ArrowDown,
  CheckCircle2, Lightbulb, Code2, AlertTriangle, KeyRound,
  Layers, Repeat, User, Users,
} from "lucide-react";
import { notFound } from "next/navigation";
import { BASE_URL } from "@/lib/seo";
import { getPost, getAllPosts } from "../posts";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const post = await getPost("javascript-this-keyword");
  if (!post) return { title: "Yazı Bulunamadı" };
  return {
    title: `${post.title} | PYBlog`,
    description: post.excerpt,
    keywords: [
      // 2026-07-22 keyword stuffing temizligi: 20 → 8 unique phrase.
      // Google modern SEO'da meta keywords'a bakmaz ama negatif sinyal
      //   olarak degerlendirebilir. Tekrarli "javascript this X" yerine
      //   essiz, dogal arama niyetlerine odaklanildi.
      "this keyword nedir",
      "call apply bind farkı",
      "arrow function this",
      "javascript context",
      "javascript mulakat sorulari",
      "frontend mulakat",
      "javascript ileri seviye",
      "yazilim mulakat hazirlik",
      ...post.tags,
    ],
    authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/blog/javascript-this-keyword`,
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
      canonical: `${BASE_URL}/blog/javascript-this-keyword`,
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// JSON-LD Schemas
// ═══════════════════════════════════════════════════════════════

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${BASE_URL}/blog/javascript-this-keyword#article`,
  headline: "JavaScript this Keyword Nedir? — Bağlam (Context), Call, Apply, Bind (Örneklerle)",
  description:
    "this kavramı temelden: dört bağlam kuralı, arrow function farkı, call/apply/bind ile bağlam değiştirme ve sık yapılan hatalar. Mülakat odaklı örneklerle.",
  image: `${BASE_URL}/og-default.png`,
  datePublished: "2026-07-22",
  dateModified: "2026-07-22",
  inLanguage: "tr-TR",
  articleSection: "Eğitim",
  keywords: "this keyword, call apply bind, arrow function this, javascript context, javascript mulakat",
  author: {
    "@type": "Organization",
    name: "Python Mülakat",
    url: BASE_URL,
  },
  publisher: {
    "@type": "Organization",
    name: "Python Mülakat",
    logo: { "@type": "ImageObject", url: `${BASE_URL}/og-default.png` },
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "JavaScript'te this nedir, en basit şekilde nasıl açıklanır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "this, fonksiyonun çalıştırıldığı bağlamı (context) temsil eden anahtar kelimedir. 'Kim çağırdı?' sorusunun cevabıdır. Bir method objenin içinde çağrıldıysa this=o obje, global alanda çağrıldıysa this=window, new ile çağrıldıysa this=yeni oluşan obje. this, fonksiyon tanımlandığında değil çağrıldığında belirlenir.",
      },
    },
    {
      "@type": "Question",
      name: "this'in dört bağlam kuralı nedir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1) Global bağlam: this = window (tarayıcı) veya global (Node). 2) Fonksiyon: normal çağrıda this = window (strict mode'da undefined). 3) Method: obje.method() çağrısında this = obje. 4) new: new Fonksiyon() ile this = yeni oluşan obje. Bu dört kural hangi durumda ne olduğunu belirler. Arrow function ise kendi this'ini oluşturmaz, dışarıdakini miras alır.",
      },
    },
    {
      "@type": "Question",
      name: "call, apply, bind arasındaki fark nedir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Üçü de this'i manuel olarak değiştirir. call: fonksiyonu hemen çağırır, argümanları tek tek alır. apply: fonksiyonu hemen çağırır, argümanları dizi olarak alır. bind: fonksiyonu hemen çağırmaz, yeni bir fonksiyon döner (sonra çağırırsın). Pratik: call/apply tek seferlik, bind kalıcı bağlama için.",
      },
    },
    {
      "@type": "Question",
      name: "Arrow function'da this nasıl çalışır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Arrow function kendi this'ini oluşturmaz (lexical this). Tanımlandığı yerdeki dış this'i miras alır. Örneğin bir obje methodu içinde arrow function varsa, o arrow'un this'i methodun this'ine eşittir. Bu yüzden callback'lerde çok kullanışlıdır — normal function'da this'i kaybedersin ama arrow'da korursun.",
      },
    },
    {
      "@type": "Question",
      name: "Mulakat sorusu: 'setTimeout içindeki this neden window oluyor?'",
      acceptedAnswer: {
        "@type": "Answer",
        text: "setTimeout(callback, ms) callback'i global scope'ta çalıştırır. Normal function kullanırsan this=window olur. Çözüm 1: arrow function kullan (setTimeout(() => { console.log(this) }, 100) — this dışarıdaki this'i korur). Çözüm 2: bind ile bağla. Çözüm 3: const self = this; self.timeout = setTimeout(function() { console.log(self) }, 100) eski yöntem.",
      },
    },
    {
      "@type": "Question",
      name: "Class içinde this nasıl davranır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Class methodları normal fonksiyon gibi this bağlamına sahiptir. Yani class.method() çağrısında this=class instance olur AMA methodu başka yere atarsan (örn. setTimeout callback'i olarak), this'i kaybedersin. Modern class'larda sorun: arrow function olarak tanımla (ör. handleClick = () => {}) veya constructor'da bind et.",
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
    { "@type": "ListItem", position: 3, name: "this Keyword", item: `${BASE_URL}/blog/javascript-this-keyword` },
  ],
};

export default async function Page() {
  const post = await getPost("javascript-this-keyword");
  if (!post) notFound();
  const OTHER_POSTS = (await getAllPosts())
    .filter((p) => p.slug !== "javascript-this-keyword")
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
            JavaScript this Keyword Nedir?
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

        {/* İçindekiler */}
        <nav className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            İçindekiler
          </h2>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            <a href="#seviye-0" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />0. Closetrafi bosalt
            </a>
            <a href="#seviye-1" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />1. Benzetme: garson kim?
            </a>
            <a href="#seviye-2" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />2. Dort baglam kurali
            </a>
            <a href="#seviye-3" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />3. Arrow function: farkli kural
            </a>
            <a href="#seviye-4" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />4. call, apply, bind
            </a>
            <a href="#seviye-5" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />5. Class ve constructor
            </a>
            <a href="#seviye-6" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />6. Sik yapilan hatalar
            </a>
            <a href="#sss" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />7. Mulakat SSS
            </a>
          </div>
        </nav>

        {/* ════════════════════════════════════════════════════
            0. Closetrafi bosalt
        ════════════════════════════════════════════════════ */}
        <section id="seviye-0" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 0</div>
            <h2 className="text-2xl md:text-3xl font-bold">Closetrafi bosalt</h2>
          </header>
          <p className="text-white/80 leading-relaxed">
            <strong>this</strong> JavaScript'in en cok yanlis anlasilan ozelligi. Mulakatlarda "this nedir?" diye soruldugunda cogu aday ya yanlis cevap verir ya da "bilmiyorum" der. Ama aslinda basit bir kural var: <strong>this, fonksiyonun "kim tarafindan cagirildigini" gosterir.</strong> Tanimlandigi anda degil, <em>calistirildigi anda</em> belirlenir.
          </p>
          <p className="text-white/80 leading-relaxed">
            Mulakatlarda this denince akla 4-5 farkli soru gelir: <em>global this nedir, method icinde this, arrow function farki, call/apply/bind, class constructor, setTimeout'ta this neden kaybolur.</em> Bu yazida hepsini <strong>temelden, orneklerle, benzetmelerle</strong> anlatiyoruz. Once yalin ifadeyle: <strong>this bir "kendini tanitma" mekanizmasi — "ben bu objenin parcasiyim" diyen bir isaret.</strong>
          </p>
        </section>

        {/* ════════════════════════════════════════════════════
            1. Benzetme: Garson kim?
        ════════════════════════════════════════════════════ */}
        <section id="seviye-1" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 1</div>
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <User className="w-7 h-7" />
              Benzetme: Garson kim?
            </h2>
          </header>
          <p className="text-white/80 leading-relaxed">
            this'i bir restoranda <strong>garson</strong> gibi dusun. Garsonun "bu siparis kime?" sorusuna verdigi cevap, o an <strong>kim icin calistigina</strong> baglidir. Ayni insan farkli restoranlarda farkli "kime hizmet ediyor?" cevabi verir.
          </p>
          <p className="text-white/80 leading-relaxed">
            JavaScript'te <code>this</code> de ayni sekilde: <strong>bir fonksiyonun this'i, o an kim tarafindan cagirildigina baglidir</strong>, nerede tanimlandigina degil. Bir fonksiyonu <em>farkli objelerden</em> cagirirsan, this her seferinde farkli olur.
          </p>
          <ul className="space-y-2 text-white/80">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Method icinde this</strong> = obje (garson kendi lokantasinda calisiyor)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Global fonksiyonda this</strong> = window (garson sahipsiz, genel alanda calisiyor)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>new ile cagirildiginda this</strong> = yeni olusan obje (garson yeni bir musteriye hizmet vermeye basliyor)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>call/apply/bind</strong> = garsonu zorla baskasinin lokantasinda calistirmak</span>
            </li>
          </ul>
        </section>

        {/* ════════════════════════════════════════════════════
            2. Dort baglam kurali
        ════════════════════════════════════════════════════ */}
        <section id="seviye-2" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 2</div>
            <h2 className="text-2xl md:text-3xl font-bold">Dort baglam kurali</h2>
          </header>
          <p className="text-white/80 leading-relaxed">
            JavaScript'te this'in davranisini belirleyen dort temel kural var. Hangi kural devrede, o an <strong>nasil cagirildigina</strong> bagli.
          </p>

          <h3 className="text-xl font-bold mt-6">1) Global baglam</h3>
          <p className="text-white/80 leading-relaxed">
            Bir fonksiyon "duzgun" sekilde cagirildiginda (obje uzerinden degil), this <strong>window</strong> (tarayici) veya <strong>global</strong> (Node.js) olur. <em>Strict mode</em>da ise <code>undefined</code> olur.
          </p>
          <CodeBlock>{`function kim() {
  console.log(this);
}

kim(); // window (tarayici)
// veya undefined (strict mode)

"use strict";
function kim2() {
  console.log(this);
}
kim2(); // undefined`}</CodeBlock>

          <h3 className="text-xl font-bold mt-6">2) Method baglami (obje uzerinden)</h3>
          <p className="text-white/80 leading-relaxed">
            Bir fonksiyon bir objenin methodu olarak cagirildiginda, this = <strong>o obje</strong> olur. En sik karsilasilan ve en sezgisel durum.
          </p>
          <CodeBlock>{`const user = {
  isim: "Ali",
  yas: 25,
  tanit() {
    return \`Ben \${this.isim}, \${this.yas} yasindayim.\`;
  },
};

user.tanit(); // "Ben Ali, 25 yasindayim."
// this = user objesi`}</CodeBlock>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.05] p-4 space-y-2 mt-4">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> Altin kural
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              <code>obj.method()</code> gordugunde this = obj. <code>method()</code> (obje olmadan) gordugunde this = window. Bu kadar basit. Once noktaya (.) bak, solundaki obje ne ise this odur.
            </p>
          </div>

          <h3 className="text-xl font-bold mt-6">3) Constructor baglami (new ile)</h3>
          <p className="text-white/80 leading-relaxed">
            Bir fonksiyon <code>new</code> ile cagirildiginda JavaScript 4 sey yapar: yeni bos obje olusturur, fonksiyonu o objenin this'iyle calistirir, objeyi otomatik doner, eger acikca donuyorsan onu doner.
          </p>
          <CodeBlock>{`function Ogrenci(isim, sinif) {
  this.isim = isim;
  this.sinif = sinif;
}

const ali = new Ogrenci("Ali", "10-A");
console.log(ali.isim); // "Ali"
console.log(ali.sinif); // "10-A"
// this = ali (yeni olusan obje)`}</CodeBlock>

          <h3 className="text-xl font-bold mt-6">4) call/apply/bind ile manuel baglam</h3>
          <p className="text-white/80 leading-relaxed">
            this'i manuel olarak degistirmek icin uc fonksiyon var. Bunlar Seviye 4'te detayli anlatilacak.
          </p>
        </section>

        {/* ════════════════════════════════════════════════════
            3. Arrow function farkli kural
        ════════════════════════════════════════════════════ */}
        <section id="seviye-3" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 3</div>
            <h2 className="text-2xl md:text-3xl font-bold">Arrow function: farkli kural (lexical this)</h2>
          </header>
          <p className="text-white/80 leading-relaxed">
            ES6 ile gelen <strong>arrow function</strong>, dort baglam kuralinin <strong>disindadir</strong>. Kendi this'ini olusturmaz, <strong>tanimlandigi yerdeki this'i miras alir</strong> (lexical this). Bu cok onemli ve mulakatlarda sik sorulan bir fark.
          </p>

          <h3 className="text-xl font-bold mt-6">Normal function: this kaybolur</h3>
          <p className="text-white/80 leading-relaxed">
            Asagidaki ornekte, <code>setTimeout</code> callback'i normal function, this'i kaybeder ve window'a baglanir.
          </p>
          <CodeBlock>{`const user = {
  isim: "Ali",
  selamVer() {
    setTimeout(function() {
      console.log("Merhaba " + this.isim); // ❌ this = window
    }, 100);
  },
};

user.selamVer(); // "Merhaba undefined"`}</CodeBlock>

          <h3 className="text-xl font-bold mt-6">Arrow function: this korunur</h3>
          <p className="text-white/80 leading-relaxed">
            Ayni ornek arrow function ile yazildiginda this, methodun this'ini (yani user) miras alir.
          </p>
          <CodeBlock>{`const user = {
  isim: "Ali",
  selamVer() {
    setTimeout(() => {
      console.log("Merhaba " + this.isim); // ✅ this = user
    }, 100);
  },
};

user.selamVer(); // "Merhaba Ali"`}</CodeBlock>

          <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.05] p-4 space-y-2 mt-4">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Anti-pattern
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Arrow function'i obje methodu olarak kullanma. <code>const user = &#123; tanit: () =&gt; console.log(this) &#125;</code> — burada this user degil, lexical (dis) this. Callback'lerde kullan, methodlarda normal function kullan.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            4. call, apply, bind
        ════════════════════════════════════════════════════ */}
        <section id="seviye-4" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 4</div>
            <h2 className="text-2xl md:text-3xl font-bold">call, apply, bind — this'i manuel degistir</h2>
          </header>
          <p className="text-white/80 leading-relaxed">
            Bazen bir fonksiyonun this'ini "zorla" degistirmek istersin. Uc yardimci metod var: <strong>call, apply, bind</strong>. Ucusunde benzer ama kullanim farkli.
          </p>

          <div className="space-y-4 mt-4">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.05] p-4 space-y-2">
              <h3 className="text-lg font-bold text-amber-300">.call(thisArg, arg1, arg2, ...)</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Fonksiyonu <strong>hemen cagirir</strong>, this'i ve argumanlari tek tek alir. En yaygin kullanim this'i baglamak.
              </p>
              <CodeBlock>{`function tanit(sehir) {
  return \`\${this.isim}, \${sehir} yasamaktadir.\`;
}

const user = { isim: "Ali" };

tanit.call(user, "Istanbul");
// "Ali, Istanbul yasamaktadir."
// this = user (call ile baglandi)`}</CodeBlock>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] p-4 space-y-2">
              <h3 className="text-lg font-bold text-emerald-300">.apply(thisArg, [arg1, arg2])</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                call ile ayni ama argumanlari <strong>dizi olarak</strong> alir. Dinamik sayida arguman gondermek icin ideal.
              </p>
              <CodeBlock>{`const sayilar = [5, 2, 9, 1, 7];

// Math.max normalde dizi almaz
Math.max.apply(null, sayilar); // 9 (dizi olarak gonderildi)
// ES6+: Math.max(...sayilar)`}</CodeBlock>
            </div>

            <div className="rounded-xl border border-cyan-300/30 bg-cyan-300/[0.05] p-4 space-y-2">
              <h3 className="text-lg font-bold text-cyan-300">.bind(thisArg, arg1, ...)</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Fonksiyonu <strong>hemen cagirmaz</strong>, yeni bir fonksiyon doner. Kalici baglama icin kullanilir (event handler, callback).
              </p>
              <CodeBlock>{`class Tiklayici {
  constructor() {
    this.sayac = 0;
    // bind: this'i kalici olarak bagla
    this.arttir = this.arttir.bind(this);
  }

  arttir() {
    this.sayac++;
    console.log(this.sayac);
  }
}

const t = new Tiklayici();
document.querySelector("button").addEventListener("click", t.arttir);
// Tiklama: 1, 2, 3...
// bind sayesinde this kaybolmaz`}</CodeBlock>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-6">Karsilastirma tablosu</h3>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-2 text-white/80 font-semibold">Metot</th>
                  <th className="text-left p-2 text-white/80 font-semibold">Cagri</th>
                  <th className="text-left p-2 text-white/80 font-semibold">Argumanlar</th>
                  <th className="text-left p-2 text-white/80 font-semibold">Kullanim</th>
                </tr>
              </thead>
              <tbody className="text-white/70">
                <tr className="border-b border-white/5">
                  <td className="p-2"><code className="text-amber-300">call</code></td>
                  <td className="p-2">Hemen cagirir</td>
                  <td className="p-2">Tek tek (a, b, c)</td>
                  <td className="p-2">Tek seferlik this baglamasi</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-2"><code className="text-emerald-300">apply</code></td>
                  <td className="p-2">Hemen cagirir</td>
                  <td className="p-2">Dizi olarak ([a, b, c])</td>
                  <td className="p-2">Dinamik arguman listesi</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-2"><code className="text-cyan-300">bind</code></td>
                  <td className="p-2">Cagirmaz, doner</td>
                  <td className="p-2">Tek tek (a, b, c)</td>
                  <td className="p-2">Kalici baglama (event handler)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            5. Class ve constructor
        ════════════════════════════════════════════════════ */}
        <section id="seviye-5" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 5</div>
            <h2 className="text-2xl md:text-3xl font-bold">Class ve constructor — this kaybolur</h2>
          </header>
          <p className="text-white/80 leading-relaxed">
            ES6 class'lari aslinda <em>constructor function</em>'larin uzerine kurulu sentaks sekeri. Methodlardaki this normal function gibidir: this = instance, <strong>AMA</strong> methodu baska yere atarsan this'i kaybedersin.
          </p>

          <h3 className="text-xl font-bold mt-6">Tipik hata: event handler this'i</h3>
          <p className="text-white/80 leading-relaxed">
            Asagidaki ornek klasik mulakat tuzagi: class methodu event listener olarak verilince this'i kaybeder.
          </p>
          <CodeBlock>{`class Saya {
  constructor() {
    this.sayac = 0;
  }
  arttir() {
    this.sayac++;
    console.log("Sayac:", this.sayac);
  }
}

const s = new Saya();
document.querySelector("button").addEventListener("click", s.arttir);
// ❌ Sayac: NaN (this artik saya degil, button elemani)`}</CodeBlock>

          <h3 className="text-xl font-bold mt-6">3 cozum</h3>
          <div className="space-y-3 mt-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
              <h4 className="text-base font-bold text-amber-300">Cozum 1: constructor'da bind</h4>
              <CodeBlock>{`constructor() {
  this.arttir = this.arttir.bind(this);
}`}</CodeBlock>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
              <h4 className="text-base font-bold text-emerald-300">Cozum 2: arrow function class field</h4>
              <CodeBlock>{`class Saya {
  sayac = 0;
  arttir = () => {
    this.sayac++;
    console.log("Sayac:", this.sayac);
  };
}
// this lexically bagli, hic kaybolmaz`}</CodeBlock>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
              <h4 className="text-base font-bold text-cyan-300">Cozum 3: inline arrow callback</h4>
              <CodeBlock>{`btn.addEventListener("click", () => s.arttir());
// arrow function this'i s'den alir`}</CodeBlock>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            6. Sik yapilan hatalar
        ════════════════════════════════════════════════════ */}
        <section id="seviye-6" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 6</div>
            <h2 className="text-2xl md:text-3xl font-bold">Sik yapilan hatalar ve tuzaklar</h2>
          </header>

          <div className="space-y-4 mt-4">
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.05] p-4 space-y-2">
              <h3 className="text-lg font-bold text-rose-300">Hata 1: this'i saklamadan nested function</h3>
              <CodeBlock>{`const user = {
  isim: "Ali",
  arkadaslar: ["Veli", "Ayse"],
  goster() {
    this.arkadaslar.forEach(function(f) {
      // ❌ this = window, user.isim undefined
      console.log(this.isim + " arkadasi: " + f);
    });
  },
};`}</CodeBlock>
              <p className="text-white/80 text-sm"><strong>Cozum</strong>: forEach'in ikinci argumani olarak this bagla veya arrow function kullan.</p>
              <CodeBlock>{`// ✅ Cozum A: forEach(thisArg)
this.arkadaslar.forEach(function(f) {
  console.log(this.isim + " arkadasi: " + f);
}, this); // forEach'e this'i ver

// ✅ Cozum B: arrow function
this.arkadaslar.forEach((f) => {
  console.log(this.isim + " arkadasi: " + f);
});`}</CodeBlock>
            </div>

            <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.05] p-4 space-y-2">
              <h3 className="text-lg font-bold text-rose-300">Hata 2: obje method'unu referans olarak vermek</h3>
              <CodeBlock>{`const user = {
  isim: "Ali",
  selam() { return "Merhaba " + this.isim; }
};

const selamci = user.selam;
selamci(); // ❌ "Merhaba undefined" (this = window)`}</CodeBlock>
              <p className="text-white/80 text-sm"><strong>Cozum</strong>: bind ile bagla veya <code>user.selam()</code> seklinde obje uzerinden cagir.</p>
              <CodeBlock>{`const selamci = user.selam.bind(user);
selamci(); // ✅ "Merhaba Ali"`}</CodeBlock>
            </div>

            <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.05] p-4 space-y-2">
              <h3 className="text-lg font-bold text-rose-300">Hata 3: arrow method objede</h3>
              <CodeBlock>{`const user = {
  isim: "Ali",
  selam: () => "Merhaba " + this.isim,
};
user.selam(); // ❌ "Merhaba undefined"
// arrow function lexical this, user degil`}</CodeBlock>
              <p className="text-white/80 text-sm"><strong>Cozum</strong>: Obje methodu olarak normal function kullan, arrow function sadece callback'lerde.</p>
              <CodeBlock>{`const user = {
  isim: "Ali",
  selam() { return "Merhaba " + this.isim; },
};
user.selam(); // ✅ "Merhaba Ali"`}</CodeBlock>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            7. SSS
        ════════════════════════════════════════════════════ */}
        <section id="sss" className="space-y-3 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">SSS</div>
            <h2 className="text-2xl md:text-3xl font-bold">Mulakat SSS</h2>
          </header>

          <FaqItem
            q="JavaScript'te this nedir, en basit şekilde nasıl açıklanır?"
            a="this, fonksiyonun çalıştırıldığı bağlamı (context) temsil eden anahtar kelimedir. 'Kim çağırdı?' sorusunun cevabıdır. Bir method objenin içinde çağrıldıysa this=o obje, global alanda çağrıldıysa this=window, new ile çağrıldıysa this=yeni oluşan obje. this, fonksiyon tanımlandığında değil çağrıldığında belirlenir."
          />
          <FaqItem
            q="this'in dört bağlam kuralı nedir?"
            a="1) Global bağlam: this = window (tarayıcı) veya global (Node). 2) Fonksiyon: normal çağrıda this = window (strict mode'da undefined). 3) Method: obje.method() çağrısında this = obje. 4) new: new Fonksiyon() ile this = yeni oluşan obje. Bu dört kural hangi durumda ne olduğunu belirler. Arrow function ise kendi this'ini oluşturmaz, dışarıdakini miras alır."
          />
          <FaqItem
            q="call, apply, bind arasındaki fark nedir?"
            a="Üçü de this'i manuel olarak değiştirir. call: fonksiyonu hemen çağırır, argümanları tek tek alır. apply: fonksiyonu hemen çağırır, argümanları dizi olarak alır. bind: fonksiyonu hemen çağırmaz, yeni bir fonksiyon döner (sonra çağırırsın). Pratik: call/apply tek seferlik, bind kalıcı bağlama için."
          />
          <FaqItem
            q="Arrow function'da this nasıl çalışır?"
            a="Arrow function kendi this'ini oluşturmaz (lexical this). Tanımlandığı yerdeki dış this'i miras alır. Örneğin bir obje methodu içinde arrow function varsa, o arrow'un this'i methodun this'ine eşittir. Bu yüzden callback'lerde çok kullanışlıdır — normal function'da this'i kaybedersin ama arrow'da korursun."
          />
          <FaqItem
            q="Mulakat sorusu: 'setTimeout içindeki this neden window oluyor?'"
            a="setTimeout(callback, ms) callback'i global scope'ta çalıştırır. Normal function kullanırsan this=window olur. Çözüm 1: arrow function kullan (setTimeout(() => { console.log(this) }, 100) — this dışarıdaki this'i korur). Çözüm 2: bind ile bağla. Çözüm 3: const self = this; self.timeout = setTimeout(function() { console.log(self) }, 100) eski yöntem."
          />
          <FaqItem
            q="Class içinde this nasıl davranır?"
            a="Class methodları normal fonksiyon gibi this bağlamına sahiptir. Yani class.method() çağrısında this=class instance olur AMA methodu başka yere atarsan (örn. setTimeout callback'i olarak), this'i kaybedersin. Modern class'larda sorun: arrow function olarak tanımla (ör. handleClick = () => {}) veya constructor'da bind et."
          />
        </section>

        {/* Sonuç */}
        <section className="space-y-4 scroll-mt-20">
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.05] to-transparent p-6 space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-amber-200">Bir cümlede özet</h2>
            <p className="text-white/90 text-lg leading-relaxed">
              <strong className="text-amber-300">this, fonksiyonun "kim tarafından çağrıldığını" gösteren anahtar kelimedir.</strong> Dört bağlam kuralı (global/function/method/new) + arrow function lexical this + call/apply/bind ile manuel bağlama. Mulakatlarda en çok sorulan 5 konudan biri.
            </p>
            <p className="text-white/70 text-sm">
              Modern projelerde class field arrow function veya bind ile this sorunu çözülür. Bu beş yazıyı (closure, hoisting, Promise, async/await, this) bir oturuşta oku — JavaScript mülakatlarının %90'ını geçersin.
            </p>
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
              <div className="text-xs text-white/60">7 kategori, 98 soru — this dahil tüm konuları pratik et.</div>
            </Link>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.05] to-transparent p-8 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">this öğrendin, beşli tamam</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            JavaScript'in en çok sorulan 5 mülakat konusunu (closure, hoisting, Promise, async/await, this) tamamladın. Sıradaki: prototype, event loop, prototype chain.
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
              href="/blog/javascript-promise-nedir"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/15 transition-colors"
            >
              <KeyRound className="w-4 h-4" />
              Promise Nedir?
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
