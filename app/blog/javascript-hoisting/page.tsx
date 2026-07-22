// app/blog/javascript-hoisting/page.tsx
//
// PYBlog yazisi #7: "JavaScript Hoisting Nedir?"
// 2026-07-19: Ubersuggest long-tail — golden keyword
//   - javascript hoisting (1.3K volume, PD 1, golden)
//   - javascript var let const farkı (590)
//   - javascript hoisting örnekleri (320)
//   - javascript function hoisting (480)
//   - temporal dead zone javascript (210)
//
// Mulakatta closure'den sonra en cok sorulan ikinci konu.
// Closure yazisiyla ayni yapi — FAQ + Article + CodeBlock.

import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen, Clock, ArrowLeft, ArrowRight, ArrowDown,
  CheckCircle2, Lightbulb, Code2, AlertTriangle, KeyRound,
  Layers, Repeat,
} from "lucide-react";
import { notFound } from "next/navigation";
import { BASE_URL } from "@/lib/seo";
import { getPost, getAllPosts } from "../posts";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const post = await getPost("javascript-hoisting");
  if (!post) return { title: "Yazı Bulunamadı" };
  return {
    title: `${post.title} | PYBlog`,
    description: post.excerpt,
    keywords: [
      // 2026-07-22 keyword stuffing temizligi: 13+ → 8 unique phrase.
      "hoisting nedir",
      "var let const farki",
      "function hoisting",
      "temporal dead zone",
      "degisken yukseltme",
      "tdz javascript",
      "javascript kapsam",
      "javascript mulakat",
      // Genel
      "javascript mülakat soruları",
      "javascript ileri seviye",
      "yazılım mülakat hazırlık",
      ...post.tags,
    ],
    authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/blog/javascript-hoisting`,
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
      canonical: `${BASE_URL}/blog/javascript-hoisting`,
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// JSON-LD Schemas
// ═══════════════════════════════════════════════════════════════

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${BASE_URL}/blog/javascript-hoisting#article`,
  headline: "JavaScript Hoisting Nedir? — var, let, const ve Fonksiyon Yükseltme (Örneklerle)",
  description:
    "JavaScript hoisting kavramı net açıklamayla: değişkenler nasıl yukarı çekilir, var-let-const farkı, fonksiyon deklarasyonu vs ifadesi, temporal dead zone ve mulakat tuzakları.",
  image: `${BASE_URL}/og-default.png`,
  datePublished: "2026-07-19",
  dateModified: "2026-07-19",
  inLanguage: "tr-TR",
  articleSection: "Eğitim",
  keywords: "hoisting nedir, var let const farki, temporal dead zone, function hoisting, mulakat",
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
  mainEntityOfPage: `${BASE_URL}/blog/javascript-hoisting`,
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${BASE_URL}/blog/javascript-hoisting#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "JavaScript hoisting nedir, en basit şekilde nasıl açıklanır?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Hoisting, JavaScript motorunun kodu çalıştırmadan önce değişken ve fonksiyon deklarasyonlarını kapsamın en üstüne 'çekmesi' (yükseltmesi) işlemidir. Bu fiziksel bir taşıma değil, motorun derleme aşamasında yaptığı bir hazırlıktır. var, function declaration ve class declaration farklı şekilde yükseltilir; let ve const ise yükseltilir ama kullanılamaz (temporal dead zone).",
      },
    },
    {
      "@type": "Question",
      name: "var, let ve const hoisting açısından nasıl farklı?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "var: Hem deklarasyon hem atama undefined olarak yükseltilir. Kullanmadan önce değer undefined olur. let ve const: Sadece deklarasyon yükseltilir (TDZ — Temporal Dead Zone), değer atanmaz. Kullanmaya çalışırsan ReferenceError alırsın. const için ayrıca atama zorunluluğu vardır.",
      },
    },
    {
      "@type": "Question",
      name: "Function declaration ve function expression hoisting farkı nedir?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Function declaration (function foo() {}) tam olarak yükseltilir — hem deklarasyon hem gövde scope'un en üstüne çıkar. Function expression (const foo = function() {}) ise sadece const davranışı gösterir: değişken yükseltilir ama değer atanmaz, TDZ'dedir. Kullanmadan önce tanımlanmalıdır.",
      },
    },
    {
      "@type": "Question",
      name: "Temporal dead zone (TDZ) ne demek?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "TDZ, let ve const değişkenlerinin hoisting sonrasında değer atanana kadar geçtiği 'erişilemez bölge'dir. Değişken scope'un en üstüne çekilir ama atanmamış olduğu için erişmeye çalışmak ReferenceError fırlatır. Atama yapıldığı an TDZ biter, değişken kullanılabilir hale gelir.",
      },
    },
    {
      "@type": "Question",
      name: "Hoisting performansı etkiler mi?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Hayır, performans üzerinde ölçülebilir bir etkisi yoktur. Hoisting sadece derleme (parse) aşamasında bir kez yapılan bir işlemdir, çalışma zamanında ekstra maliyet getirmez. Ancak hoisting nedeniyle oluşan kod karmaşıklığı, bakım maliyetini artırabilir — bu yüzden modern kodda let/const tercih edilir.",
      },
    },
    {
      "@type": "Question",
      name: "JavaScript mülakatında 'console.log(a); var a = 5;' ne yazdırır?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Çıktı: 'undefined'. Çünkü var a deklarasyonu kapsamın en üstüne çekilir (a = undefined), sonra console.log çalışır, sonra a = 5 atanır. let ve const ile yazsaydın, console.log sırasında 'ReferenceError: Cannot access 'a' before initialization' hatası alırdın (TDZ).",
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
    { "@type": "ListItem", position: 3, name: "JavaScript Hoisting", item: `${BASE_URL}/blog/javascript-hoisting` },
  ],
};

export default async function Page() {
  const post = await getPost("javascript-hoisting");
  if (!post) notFound();
  const OTHER_POSTS = (await getAllPosts())
    .filter((p) => p.slug !== "javascript-hoisting")
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
            JavaScript Hoisting Nedir?
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
              <ArrowDown className="w-3 h-3 text-white/30" />1. Benzetme: iskele
            </a>
            <a href="#seviye-2" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />2. var vs let vs const
            </a>
            <a href="#seviye-3" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />3. Fonksiyon deklarasyonu vs ifadesi
            </a>
            <a href="#seviye-4" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />4. Temporal Dead Zone
            </a>
            <a href="#seviye-5" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />5. Mulakat tuzaklari
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
            0. Closetrafi bosalt
        ════════════════════════════════════════════════════ */}
        <section id="seviye-0" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 0</div>
            <h2 className="text-2xl md:text-3xl font-bold">Closetrafi bosalt, once yanlis inanclar</h2>
          </header>
          <p className="text-white/80 leading-relaxed">
            <strong>Hoisting</strong> (türkce: kaldirma, yükseltme), JavaScript'in en cok korkulan ve en cok yanlis anlatilan kavramlarindan biri. Aslinda kavram basit — ama JavaScript'in "kod calistir" sekli C'den, Java'dan farkli oldugu icin isler karisiyor.
          </p>
          <p className="text-white/80 leading-relaxed">
            Bu yazi boyunca 3 seyi anlatacagim: (1) Hoisting gercekte ne, (2) var/let/const farki, (3) Mulakatta nasil cevaplanir. 11 dakikada bitmis olacaksin.
          </p>
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.03] p-4 text-sm">
            <strong className="text-rose-300">Yaygin yanlis inanc:</strong> "JavaScript degiskenleri fiziksel olarak yukarı tasinir." Hayir. Motor sadece <em>kayit yapar</em>, fiziksel tasima yok. Bu, derleme (parse) asamasinda olur, calisma zamaninda ekstra maliyet getirmez.
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            1. BENZETME — iskele
        ════════════════════════════════════════════════════ */}
        <section id="seviye-1" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 1</div>
            <h2 className="text-2xl md:text-3xl font-bold">Benzetme: İskele kurmak</h2>
          </header>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 text-sm font-bold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              Gerçek hayat benzetmesi
            </div>
            <p className="text-white/85 leading-relaxed">
              Bir <strong>bina insa ediyorsun</strong>. Önce iskele kurarsin — temel atmadan önce bile iskele hazir olur. Sonra temeli atarsin, kolonlari dikersin, duvarlari örersin. <strong>Iskele = hoisting</strong>. JavaScript motoru, kodu calistirmaya baslamadan önce "iskele"yi kurar: degisken ve fonksiyonlari kapsam (scope) icinde kayit eder. Sonra sirayla atama yapar, calistirir.
            </p>
            <p className="text-white/85 leading-relaxed">
              <strong>Onemli:</strong> Iskele <em>yer acar</em> ama icine henüz sey koymaz. Yani <code>var a</code> yazdiginda motor <code>a</code> icin "iskele" kurar, ama <code>a = 5</code> yazana kadar <code>a</code>'nin degeri <code>undefined</code>'dir. <code>let a</code> yazdiginda da iskele kurulur ama icerisi kapiyla kapatilir — sen atama yapana kadar kimse giremez (TDZ).
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            2. VAR vs LET vs CONST
        ════════════════════════════════════════════════════ */}
        <section id="seviye-2" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 2</div>
            <h2 className="text-2xl md:text-3xl font-bold">var, let, const farkı</h2>
          </header>

          <p className="text-white/80 leading-relaxed">
            Asagidaki kodu calistirmadan once ne olacagini tahmin et:
          </p>

          <CodeBlock>
{`// SENARYO 1: var
console.log("var:", x);  // ?
var x = 5;
console.log("var sonra:", x);  // ?`}
          </CodeBlock>

          <p className="text-white/80 leading-relaxed">
            Cikti: <code>undefined</code> ve <code>5</code>. Motor, <code>var x</code>'i kapsam basina alir ama degeri <code>undefined</code>'dir. Atama satirina gelince <code>x = 5</code> olur.
          </p>

          <CodeBlock>
{`// SENARYO 2: let
console.log("let:", y);  // ?
let y = 10;
console.log("let sonra:", y);  // ?`}
          </CodeBlock>

          <p className="text-white/80 leading-relaxed">
            Cikti: <code>ReferenceError: Cannot access 'y' before initialization</code>. Motor <code>let y</code>'yi kapsam basina alir ama TDZ (Temporal Dead Zone) icinde oldugu icin erisilemez. Atama satirina gelince TDZ biter.
          </p>

          <CodeBlock>
{`// SENARYO 3: const
console.log("const:", z);  // ?
const z = 15;  // atama zorunlu!
console.log("const sonra:", z);  // ?`}
          </CodeBlock>

          <p className="text-white/80 leading-relaxed">
            Cikti: <code>ReferenceError</code> (TDZ), sonra <code>15</code>. const icin <em>atama zorunlu</em> — sadece <code>const z;</code> yazarsan yine ReferenceError alirsin.
          </p>

          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/[0.03] p-4 text-sm space-y-2">
            <strong className="text-cyan-200">Tek tabloda özet:</strong>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-cyan-200">
                    <th className="py-1 pr-4">Anahtar kelime</th>
                    <th className="py-1 pr-4">Yükseltilir mi?</th>
                    <th className="py-1 pr-4">Atama öncesi erişim</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr><td className="py-1 pr-4 font-mono text-amber-200">var</td><td className="py-1 pr-4">Evet, undefined</td><td className="py-1 pr-4">undefined döner</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-amber-200">let</td><td className="py-1 pr-4">Evet, ama TDZ</td><td className="py-1 pr-4">ReferenceError</td></tr>
                  <tr><td className="py-1 pr-4 font-mono text-amber-200">const</td><td className="py-1 pr-4">Evet, ama TDZ + atama zorunlu</td><td className="py-1 pr-4">ReferenceError</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            3. FONKSIYON DEKLARASYONU vs IFADESI
        ════════════════════════════════════════════════════ */}
        <section id="seviye-3" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 3</div>
            <h2 className="text-2xl md:text-3xl font-bold">Fonksiyon deklarasyonu vs ifadesi</h2>
          </header>

          <p className="text-white/80 leading-relaxed">
            Mulakatlarda en cok sorulan 2. konu: <strong>function declaration</strong> ve <strong>function expression</strong> nasil farkli yükseltilir?
          </p>

          <CodeBlock>
{`// Function declaration — TAM yükseltilir (deklarasyon + gövde)
console.log(selamla("Ali"));  // "Selam Ali" ✓

function selamla(isim) {
  return "Selam " + isim;
}

// Function expression — sadece const ismi yükseltilir, deger atanmaz
console.log(hosgeldin("Ayşe"));  // ReferenceError ❌

const hosgeldin = function(isim) {
  return "Hoş geldin " + isim;
};`}
          </CodeBlock>

          <p className="text-white/80 leading-relaxed">
            <strong>Function declaration</strong> (<code>function foo() {}</code>) — hem deklarasyon hem gövde scope'un en üstüne çekilir. Cagirildiginda hazir.
          </p>
          <p className="text-white/80 leading-relaxed">
            <strong>Function expression</strong> (<code>const foo = function() {}</code>) — sadece <code>const</code> değişken ismi yükseltilir (TDZ'de), deger atanmaz. Cagirildiginda henüz undefined, ReferenceError.
          </p>

          <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.03] p-4 text-sm">
            <strong className="text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Mulakat tuzagi
            </strong>
            <p className="text-white/70 mt-1">
              "Yukaridaki kodda selamla calisir ama hosgeldin calismaz, neden?" Cevap: function declaration tamamen yükseltilir, function expression sadece const ismini yükseltir (TDZ'de kalir). Bu kucuk fark, JavaScript mülakatlarinda <strong>3-4 farkli soruyu</strong> dogurur.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            4. TEMPORAL DEAD ZONE
        ════════════════════════════════════════════════════ */}
        <section id="seviye-4" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 4</div>
            <h2 className="text-2xl md:text-3xl font-bold">Temporal Dead Zone (TDZ)</h2>
          </header>

          <p className="text-white/80 leading-relaxed">
            TDZ, "zamansal ölü bölge" demek. <code>let</code> ve <code>const</code> değişkenleri <strong>deklarasyondan atamaya kadar</strong> olan sürede erişilemez.
          </p>

          <CodeBlock>
{`function tdziGoster() {
  console.log(basla());  // ReferenceError ❌ (TDZ)

  const selamla = function() {
    return "Merhaba";
  };

  function basla() {
    return "Başla!";
  }
}

tdziGoster();`}
          </CodeBlock>

          <p className="text-white/80 leading-relaxed">
            Burada <code>selamla</code> bir const function expression. <code>basla</code> ise function declaration. <code>console.log(basla())</code> satırında <code>selamla</code> henüz atanmamis (TDZ) ama <code>basla</code> yükseltilmis. Ancak hata alirsin cünkü JS satir sirayla calisir, "TDZ'deki <code>selamla</code>" hatasi daha once firlatilir.
          </p>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.03] p-4 text-sm">
            <strong className="text-amber-300">Neden var, let, const farkli?</strong>
            <p className="text-white/70 mt-1">
              ES6 (2015) öncesi sadece <code>var</code> vardi. <code>var</code>'in <code>undefined</code> davranisi kafa karistiriciydi. ES6 ile gelen <code>let</code> ve <code>const</code> "block scope" kavramini ve TDZ'yi ekledi — boylece hata yapmak yerine aninda uyari aliyorsun.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            5. MULAKAT TUZAKLARI
        ════════════════════════════════════════════════════ */}
        <section id="seviye-5" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 5</div>
            <h2 className="text-2xl md:text-3xl font-bold">Mulakat tuzakları</h2>
          </header>

          <p className="text-white/80 leading-relaxed">
            Asagidaki 3 örnek, mulakatta en cok sorulan ve en cok yanlis cevaplanan tuzaklardir.
          </p>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
            <h4 className="font-bold text-white">Tuzak 1: Sira karisik console.log'lar</h4>
            <CodeBlock>
{`var a = 1;
let b = 2;
const c = 3;

{
  console.log(a, b, c);  // ?
  var a = 10;
  let b = 20;
  const c = 30;
}

console.log(a, b, c);  // ?`}
            </CodeBlock>
            <p className="text-sm text-white/70">
              <strong>Ilk console.log</strong>: <code>ReferenceError</code> (TDZ). <code>b</code> ve <code>c</code> yeni scope'ta TDZ'de. <code>a</code> var ama yeni scope'ta da var, undefined (var her yere yükselir). <strong>Ikinci console.log</strong>: <code>10, 2, 3</code>. Dış <code>a</code> degisti (10), <code>b</code> ve <code>c</code> kendi scope'larinda degisti.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
            <h4 className="font-bold text-white">Tuzak 2: Function expression icinde fonksiyon cagir</h4>
            <CodeBlock>
{`var x = 1;

function test() {
  console.log(x);
  var x = 2;
  console.log(x);
}

test();`}
            </CodeBlock>
            <p className="text-sm text-white/70">
              Cikti: <code>undefined</code> ve <code>2</code>. <code>test</code> icinde <code>var x</code> scope'un en üstüne yükseltilir ve undefined olur. Ilk <code>console.log(x)</code> bu local x'i yazdirir, sonra atama yapilir.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
            <h4 className="font-bold text-white">Tuzak 3: typeof ile TDZ</h4>
            <CodeBlock>
{`console.log(typeof degisken);  // ?
let degisken = "selam";`}
            </CodeBlock>
            <p className="text-sm text-white/70">
              Cikti: <code>ReferenceError</code>. <code>typeof</code> bile TDZ'deki degiskene erisemez. <code>typeof undefinedDegisken</code> yazsaydin "undefined" donerdi — ama <code>let/const</code> ile tanimli degisken icin TDZ aktif, ReferenceError.
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
            q="JavaScript hoisting nedir, en basit şekilde nasıl açıklanır?"
            a="Hoisting, JavaScript motorunun kodu çalıştırmadan önce değişken ve fonksiyon deklarasyonlarını kapsamın en üstüne 'çekmesi' işlemidir. Bu fiziksel bir taşıma değil, motorun derleme aşamasında yaptığı bir hazırlıktır. var, function declaration ve class declaration farklı şekilde yükseltilir; let ve const ise yükseltilir ama kullanılamaz (temporal dead zone)."
          />
          <FaqItem
            q="var, let ve const hoisting açısından nasıl farklı?"
            a="var: Hem deklarasyon hem atama undefined olarak yükseltilir. Kullanmadan önce değer undefined olur. let ve const: Sadece deklarasyon yükseltilir (TDZ — Temporal Dead Zone), değer atanmaz. Kullanmaya çalışırsan ReferenceError alırsın. const için ayrıca atama zorunluluğu vardır."
          />
          <FaqItem
            q="Function declaration ve function expression hoisting farkı nedir?"
            a="Function declaration (function foo() {}) tam olarak yükseltilir — hem deklarasyon hem gövde scope'un en üstüne çıkar. Function expression (const foo = function() {}) ise sadece const davranışı gösterir: değişken yükseltilir ama değer atanmaz, TDZ'dedir. Kullanmadan önce tanımlanmalıdır."
          />
          <FaqItem
            q="Temporal dead zone (TDZ) ne demek?"
            a="TDZ, let ve const değişkenlerinin hoisting sonrasında değer atanana kadar geçtiği 'erişilemez bölge'dir. Değişken scope'un en üstüne çekilir ama atanmamış olduğu için erişmeye çalışmak ReferenceError fırlatır. Atama yapıldığı an TDZ biter, değişken kullanılabilir hale gelir."
          />
          <FaqItem
            q="Hoisting performansı etkiler mi?"
            a="Hayır, performans üzerinde ölçülebilir bir etkisi yoktur. Hoisting sadece derleme (parse) aşamasında bir kez yapılan bir işlemdir, çalışma zamanında ekstra maliyet getirmez. Ancak hoisting nedeniyle oluşan kod karmaşıklığı, bakım maliyetini artırabilir — bu yüzden modern kodda let/const tercih edilir."
          />
          <FaqItem
            q="Mulakat sorusu: console.log(a); var a = 5; ne yazdırır?"
            a="Çıktı: 'undefined'. Çünkü var a deklarasyonu kapsamın en üstüne çekilir (a = undefined), sonra console.log çalışır, sonra a = 5 atanır. let ve const ile yazsaydın, console.log sırasında 'ReferenceError: Cannot access 'a' before initialization' hatası alırdın (TDZ)."
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
              <strong className="text-amber-300">Hoisting, JavaScript'in "kod çalışmadan önce deklarasyonları kapsamın tepesine koyması" işlemidir.</strong> var için bu yumuşaktır (undefined döner), let/const için serttir (TDZ, ReferenceError).
            </p>
            <p className="text-white/70 text-sm">
              Modern JavaScript'te her zaman <code>let</code> veya <code>const</code> kullan, <code>var</code>'dan kaçın. Bu hem hataları erken yakalar hem de kodu okunabilir yapar.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">Sıradaki adımlar</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /><Link href="/blog/javascript-closure-nedir" className="text-amber-300 hover:underline">JavaScript Closure</Link> yazımızla ilgili kavramı pekiştir</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /><Link href="/blog/sifirdan-zirveye" className="text-amber-300 hover:underline">Sıfırdan Zirveye</Link> ile programlama temellerini öğren</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /><Link href="/interviews" className="text-amber-300 hover:underline">Mülakat soruları</Link> ile hoisting gerektiren problemleri çöz</li>
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
              <div className="text-xs text-white/60">7 kategori, 98 soru — hoisting dahil tüm konuları pratik et.</div>
            </Link>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.05] to-transparent p-8 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">Hoisting öğrendin, diğerleri de sırada</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            JavaScript'in en çok sorulan mülakat konularını sırayla öğren: closure, this, prototype, async/await, event loop.
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
              href="/blog/javascript-closure-nedir"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/15 transition-colors"
            >
              <KeyRound className="w-4 h-4" />
              Closure Nedir?
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
