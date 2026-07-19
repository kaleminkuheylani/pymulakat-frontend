// app/blog/javascript-async-await/page.tsx
//
// PYBlog yazisi #8: "JavaScript async/await ve Promise"
// 2026-07-19: Ubersuggest long-tail — EN YUKSEK HACIM
//   - javascript async await (2.4K volume, PD 1, altin)
//   - javascript promise nedir (1.6K)
//   - javascript asenkron programlama (590)
//   - javascript callback hell (320)
//   - javascript fetch api (880)
//   - javascript try catch async (480)
//   - javascript paralel await (260)
//
// Mulakatta closure + hoisting + async await ucgeni en cok sorulan.

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
  const post = await getPost("javascript-async-await");
  if (!post) return { title: "Yazı Bulunamadı" };
  return {
    title: `${post.title} | PYBlog`,
    description: post.excerpt,
    keywords: [
      // Ana long-tail (en yuksek hacim)
      "javascript async await",
      "javascript promise nedir",
      "javascript asenkron programlama",
      "javascript callback hell",
      // Spesifik
      "javascript fetch api",
      "javascript try catch async",
      "javascript paralel await",
      "javascript async await ornekleri",
      "javascript promise all",
      "javascript event loop",
      "javascript microtask",
      "javascript setTimeout",
      "javascript callback function",
      // Closure + hoisting iliskili
      "javascript async closure",
      "javascript hoisting async",
      // Genel
      "javascript mülakat soruları",
      "frontend developer mülakat",
      "javascript ileri seviye",
      "yazılım mülakat hazırlık",
      ...post.tags,
    ],
    authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/blog/javascript-async-await`,
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
      canonical: `${BASE_URL}/blog/javascript-async-await`,
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// JSON-LD Schemas
// ═══════════════════════════════════════════════════════════════

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${BASE_URL}/blog/javascript-async-await#article`,
  headline: "JavaScript async/await ve Promise Nedir? — Asenkron Programlama (Örneklerle)",
  description:
    "JavaScript async/await, Promise ve event loop kavramı net açıklamayla: callback hell'den promise chain'e, .then().catch()'den async/await'e, paralel-await sıralı-await farkı, mulakat tuzakları.",
  image: `${BASE_URL}/og-default.png`,
  datePublished: "2026-07-19",
  dateModified: "2026-07-19",
  inLanguage: "tr-TR",
  articleSection: "Eğitim",
  keywords: "javascript async await, promise nedir, asenkron programlama, callback hell, javascript event loop",
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
  mainEntityOfPage: `${BASE_URL}/blog/javascript-async-await`,
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${BASE_URL}/blog/javascript-async-await#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "JavaScript'te async/await nedir, en basit şekilde nasıl açıklanır?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "async/await, JavaScript'te asenkron (eşzamansız) kod yazmanın modern yoludur. Bir fonksiyonun başına 'async' yazarsan, içinde 'await' kullanabilirsin. await, bir Promise'in sonuçlanmasını bekler ama bu sırada JavaScript motoru diğer işleri yapmaya devam eder (event loop). Sonuç: senkron gibi görünen, ama aslında bloklamayan kod.",
      },
    },
    {
      "@type": "Question",
      name: "Promise ile async/await arasındaki fark nedir?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Promise, asenkron bir sonucu temsil eden nesnedir. async/await ise Promise'leri kullanmanın söz dilidir (syntactic sugar). async fonksiyon her zaman bir Promise döner. await ise sadece async fonksiyonlar içinde çalışır ve bir Promise'in resolve olmasını bekler. İkisi de aynı işi yapar; async/await kodu okumayı kolaylaştırır.",
      },
    },
    {
      "@type": "Question",
      name: "JavaScript'te 'callback hell' nedir?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Callback hell, birbirinin içine geçmiş iç içe callback fonksiyonlarından oluşan kodun okunamaz hale gelmesidir. Promise'ler ve async/await bu sorunu çözer: asenkron akışı düz (linear) bir kod gibi yazabilirsin, iç içe callback yığını yerine.",
      },
    },
    {
      "@type": "Question",
      name: "Promise.all ve sıralı await arasındaki fark nedir?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Sıralı await: A işi bitmeden B başlamaz, toplam süre = A + B. Promise.all([A, B]): A ve B paralel başlar, toplam süre = max(A, B). Bağımsız işler için Promise.all kullan, bağımlı işler için sıralı await.",
      },
    },
    {
      "@type": "Question",
      name: "JavaScript'te event loop nedir?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Event loop, JavaScript'in tek iş parçacıklı (single-threaded) yapısında asenkron işleri sıraya koyup yöneten mekanizmadır. Call stack boşaldığında, microtask queue (Promise'ler) önce, sonra macrotask queue (setTimeout, I/O) işlenir. Bu yüzden await'ler setTimeout'tan önce çalışır.",
      },
    },
    {
      "@type": "Question",
      name: "Mulakat sorusu: 'console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4);' ne yazdırır?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Çıktı: 1, 4, 3, 2. Çünkü: 1 senkron yazılır. setTimeout macrotask, en sona kalır. Promise.then microtask, call stack boşalınca hemen çalışır. 4 senkron yazılır. Call stack boşalınca microtask (3) çalışır, sonra macrotask (2). Bu klasik event loop sorusudur.",
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
    { "@type": "ListItem", position: 3, name: "JavaScript async/await", item: `${BASE_URL}/blog/javascript-async-await` },
  ],
};

export default async function Page() {
  const post = await getPost("javascript-async-await");
  if (!post) notFound();
  const OTHER_POSTS = (await getAllPosts())
    .filter((p) => p.slug !== "javascript-async-await")
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
            JavaScript async/await ve Promise Nedir?
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
              <ArrowDown className="w-3 h-3 text-white/30" />1. Benzetme: restoran siparisi
            </a>
            <a href="#seviye-2" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />2. Callback → Promise → async/await evrimi
            </a>
            <a href="#seviye-3" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />3. async/await temelleri
            </a>
            <a href="#seviye-4" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />4. Hata yonetimi
            </a>
            <a href="#seviye-5" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />5. Promise.all — paralel vs sirali
            </a>
            <a href="#seviye-6" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />6. Event loop — siralama sihri
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
            <strong>Asenkron programlama</strong> JavaScript'in en can alici konusu. Closure ve hoisting ne kadar kafa karistiriyorsa, async/await da o kadar. Mulakatlarda "asenkron" denince 4-5 farkli soru gelir: callback hell, Promise, async/await, event loop, microtask queue. Bu yazida hepsini toparliyoruz.
          </p>
          <p className="text-white/80 leading-relaxed">
            Once yalin ifadeyle: <strong>JavaScript tek is parcacikli (single-threaded) calisir</strong>. Yani bir anda sadece tek sey yapabilir. Peki tarayicimiz nasil yuzlerce seyi ayni anda yapiyor? Cevap: asenkron programlama. Fonksiyonu cagir, "bitince haber ver" de, arada baska is yap. Iste <code>async/await</code> ve <code>Promise</code> bu "haber ver" mekanizmasini duzgun bir sekilde yazmamizi saglar.
          </p>
        </section>

        {/* ════════════════════════════════════════════════════
            1. BENZETME — restoran siparisi
        ════════════════════════════════════════════════════ */}
        <section id="seviye-1" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 1</div>
            <h2 className="text-2xl md:text-3xl font-bold">Benzetme: Restoranda sipariş</h2>
          </header>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 text-sm font-bold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              Gerçek hayat benzetmesi
            </div>
            <p className="text-white/85 leading-relaxed">
              Bir <strong>restorandasın</strong>. Garson siparişi alır, mutfağa götürür (uzun süren iş), sen bu sirada başka masalara da bakar, yemek gelince tabağı alırsın. <strong>Asenkron programlama bu</strong>: uzun süren bir iş başlat, bitmesini bekle, arada başka şeyler yap.
            </p>
            <p className="text-white/85 leading-relaxed">
              JavaScript'te bu "uzun süren iş" genelde:
            </p>
            <ul className="list-disc list-inside text-white/75 space-y-1 ml-2">
              <li>API çağrısı (fetch, axios)</li>
              <li>Veritabanı sorgusu</li>
              <li>Dosya okuma/yazma</li>
              <li>setTimeout, setInterval</li>
              <li>Event listener'lar</li>
            </ul>
            <p className="text-white/85 leading-relaxed">
              Bu işler "biter" ve sonuç döner — ya da hata verir. <code>Promise</code> bu sonucu temsil eden nesne, <code>async/await</code> ise onu "bekleyen" söz dizimi.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            2. CALLBACK → PROMISE → ASYNC/AWAIT
        ════════════════════════════════════════════════════ */}
        <section id="seviye-2" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 2</div>
            <h2 className="text-2xl md:text-3xl font-bold">Callback → Promise → async/await evrimi</h2>
          </header>

          <p className="text-white/80 leading-relaxed">
            Asenkron JavaScript 3 evreden gecti. Hepsini gormek lazim — mulakatlarda "callback hell nedir" diye sorarlar.
          </p>

          {/* Callback */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
            <h4 className="font-bold text-amber-200">1. Callback (eski stil — 2010 öncesi)</h4>
            <CodeBlock>
{`// Kullanici getir, sonra o kullanicinin postlarini getir
getUser(userId, function(user) {
  getPosts(user.id, function(posts) {
    renderUI(user, posts);
  });
});

// 3-4 ic ice callback → "callback hell" (kayisifa kroniklesmesi)
// Kod okunamaz, hata yonetimi zor (her callback icin ayri try/catch)`}
            </CodeBlock>
            <p className="text-sm text-white/70">
              <strong>Sorun:</strong> ic ice callback → kod sagdan sola uzayan piramit, hata yonetimi zor.
            </p>
          </div>

          {/* Promise */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
            <h4 className="font-bold text-amber-200">2. Promise (ES6 — 2015)</h4>
            <CodeBlock>
{`// Ayni is — Promise zinciri
getUser(userId)
  .then(user => getPosts(user.id))
  .then(posts => renderUI(user, posts))
  .catch(err => console.error(err));

// Daha iyi: zincir dikey, tek catch`}
            </CodeBlock>
            <p className="text-sm text-white/70">
              <strong>Iyilesme:</strong> zincir dikey (piramit yok), tek <code>.catch()</code> ile merkezi hata yonetimi.
            </p>
          </div>

          {/* async/await */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
            <h4 className="font-bold text-amber-200">3. async/await (ES8 — 2017, modern standart)</h4>
            <CodeBlock>
{`// Ayni is — async/await ile senkron gibi yazilir
async function kullaniciGoster(userId) {
  try {
    const user = await getUser(userId);
    const posts = await getPosts(user.id);
    renderUI(user, posts);
  } catch (err) {
    console.error(err);
  }
}

kullaniciGoster(42);`}
            </CodeBlock>
            <p className="text-sm text-white/70">
              <strong>En iyi:</strong> senkron koda benziyor, try/catch ile klasik hata yonetimi, okumasi en kolay.
            </p>
          </div>

          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/[0.03] p-4 text-sm">
            <strong className="text-cyan-200">Tek cumleyle:</strong> async/await, Promise'lerin uzerine yazilmis bir "daha guzel syntax" — derleme asamasinda Promise'e donusur, calisma mantigi ayni.
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            3. ASYNC/AWAIT TEMELLERİ
        ════════════════════════════════════════════════════ */}
        <section id="seviye-3" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 3</div>
            <h2 className="text-2xl md:text-3xl font-bold">async/await temelleri</h2>
          </header>

          <p className="text-white/80 leading-relaxed">
            Iki kelime oyunu: <code>async</code> ve <code>await</code>. Birlikte calisirlar.
          </p>

          <CodeBlock>
{`// async: fonksiyonu "asenkron" olarak isaretle
// Her async fonksiyon bir Promise doner
async function selamVer(isim) {
  return "Merhaba " + isim;
}

// Kullanim: iki yol var
selamVer("Ali").then(mesaj => console.log(mesaj));  // Promise gibi
const mesaj = await selamVer("Ali");                   // await ile
console.log(mesaj);  // "Merhaba Ali"`}
          </CodeBlock>

          <CodeBlock>
{`// await: Promise'in bitmesini bekle
// SADECE async fonksiyon icinde calisir
async function kullanicininPostlari(userId) {
  const user = await getUser(userId);        // once user gelsin
  const posts = await getPosts(user.id);     // sonra posts
  return { user, posts };
}

// await olmadan:
function kullanicininPostlari(userId) {
  return getUser(userId)
    .then(user => getPosts(user.id).then(posts => ({ user, posts })));
}`}
          </CodeBlock>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.03] p-4 text-sm space-y-2">
            <strong className="text-emerald-200">3 kural:</strong>
            <ol className="list-decimal list-inside text-white/75 space-y-1 ml-2 mt-1">
              <li><code>async</code> fonksiyon her zaman bir Promise doner</li>
              <li><code>await</code> SADECE <code>async</code> fonksiyon icinde calisir</li>
              <li><code>await</code>, Promise'in <code>resolve</code> olmasini bekler, sonra degeri doner</li>
            </ol>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            4. HATA YÖNETIMI
        ════════════════════════════════════════════════════ */}
        <section id="seviye-4" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 4</div>
            <h2 className="text-2xl md:text-3xl font-bold">Hata yönetimi (try/catch)</h2>
          </header>

          <p className="text-white/80 leading-relaxed">
            <code>async/await</code>'in en buyuk avantaji: <strong>klasik try/catch</strong> ile hata yakalama. Promise'lerdeki <code>.catch()</code> zincirinden daha temiz.
          </p>

          <CodeBlock>
{`// DOGRU — async/await + try/catch
async function kullanicininVerileri(userId) {
  try {
    const user = await getUser(userId);
    const posts = await getPosts(user.id);
    return { user, posts, hata: null };
  } catch (err) {
    console.error("API hatasi:", err);
    return { user: null, posts: [], hata: err.message };
  }
}`}
          </CodeBlock>

          <CodeBlock>
{`// BIRDEN FAZLA await — bir hata tum zinciri durdurur
async function a() { await getA(); }
async function b() { await getB(); }
async function hepsi() {
  try {
    const aData = await a();
    const bData = await b();  // a() hata verirse b() calismaz
  } catch (err) {
    // a() veya b() hatasi buraya dusuyor
  }
}

// COZUM: Promise.allSettled — hepsini bekle, hatta varsa devam et
async function hepsiBagimsiz() {
  const sonuclar = await Promise.allSettled([a(), b()]);
  // [fulfilled, rejected] veya [fulfilled, fulfilled] gibi doner
  // Hata olsa bile hepsi beklenir
}`}
          </CodeBlock>

          <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.03] p-4 text-sm">
            <strong className="text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Mulakat tuzagi
            </strong>
            <p className="text-white/70 mt-1">
              "3 paralel API cagir, biri hata verse ne olur?" Cevap: <code>Promise.all</code> hatayla tum zinciri durdurur. <code>Promise.allSettled</code> hata olsa bile hepsini bekler, hata durumunu <code>{'{status: "rejected"}'}</code> olarak doner. Hangisini ne zaman kullanacagini bilmek mulakatta +3 puan.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            5. PARALEL vs SIRALI
        ════════════════════════════════════════════════════ */}
        <section id="seviye-5" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 5</div>
            <h2 className="text-2xl md:text-3xl font-bold">Promise.all — paralel vs sıralı</h2>
          </header>

          <p className="text-white/80 leading-relaxed">
            3 API cagiracaksin. Nasil yazarsin?
          </p>

          <CodeBlock>
{`// YANLIS — sirali, yavas (1sn + 1sn + 1sn = 3sn)
const a = await apiA();  // 1sn
const b = await apiB();  // 1sn (a bittikten sonra)
const c = await apiC();  // 1sn (b bittikten sonra)

// DOGRU — paralel, hizli (max(1,1,1) = 1sn)
const [a, b, c] = await Promise.all([apiA(), apiB(), apiC()]);

// Promise.all hepsini ayni anda baslatir, hepsinin bitmesini bekler
// Bir hata olursa tum zincir durur (reject)`}
          </CodeBlock>

          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/[0.03] p-4 text-sm">
            <strong className="text-cyan-200">Ne zaman hangisi?</strong>
            <ul className="list-disc list-inside text-white/75 space-y-1 ml-2 mt-1">
              <li><strong>Sirali await</strong>: B sonucu A'ya bagliysa (B = A + 1 islem)</li>
              <li><strong>Promise.all</strong>: B, C A'dan bagimsiz (ayri tablolar, paralel API)</li>
              <li><strong>Promise.race</strong>: En hizli biteni istiyorsan (timeout pattern)</li>
            </ul>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            6. EVENT LOOP
        ════════════════════════════════════════════════════ */}
        <section id="seviye-6" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 6</div>
            <h2 className="text-2xl md:text-3xl font-bold">Event loop — sıralama sihri</h2>
          </header>

          <p className="text-white/80 leading-relaxed">
            Bu JavaScript mulakatinin <strong>en klasik tuzagi</strong>. Sadece oku, sonra calistir:
          </p>

          <CodeBlock>
{`console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");

// Cikti: 1, 4, 3, 2 — neden?`}
          </CodeBlock>

          <p className="text-white/80 leading-relaxed">
            <strong>Neden 1, 4, 3, 2?</strong>
          </p>

          <ol className="list-decimal list-inside text-white/75 space-y-2 ml-2">
            <li><code>console.log("1")</code> senkron → ekrana <strong>1</strong></li>
            <li><code>setTimeout</code> macrotask kuyruguna eklenir (en sona kalir)</li>
            <li><code>Promise.then</code> microtask kuyruguna eklenir</li>
            <li><code>console.log("4")</code> senkron → ekrana <strong>4</strong></li>
            <li>Call stack bosalinca: once microtask (<strong>3</strong>), sonra macrotask (<strong>2</strong>)</li>
          </ol>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.03] p-4 text-sm">
            <strong className="text-amber-300">Event loop sirasi:</strong>
            <ol className="list-decimal list-inside text-white/75 space-y-1 ml-2 mt-1">
              <li>Senkron kod (call stack)</li>
              <li>Microtask queue (Promise'ler, queueMicrotask)</li>
              <li>Macrotask queue (setTimeout, setInterval, I/O)</li>
              <li>Render (ekran ciz)</li>
            </ol>
            <p className="text-white/70 mt-2">
              Her macrotask arasinda microtask'lerin hepsi bitirilir. Bu yuzden <code>await</code> / <code>.then()</code> <code>setTimeout</code>'tan once calisir.
            </p>
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
            q="JavaScript'te async/await nedir, en basit şekilde nasıl açıklanır?"
            a="async/await, JavaScript'te asenkron (eşzamansız) kod yazmanın modern yoludur. Bir fonksiyonun başına 'async' yazarsan, içinde 'await' kullanabilirsin. await, bir Promise'in sonuçlanmasını bekler ama bu sırada JavaScript motoru diğer işleri yapmaya devam eder (event loop). Sonuç: senkron gibi görünen, ama aslında bloklamayan kod."
          />
          <FaqItem
            q="Promise ile async/await arasındaki fark nedir?"
            a="Promise, asenkron bir sonucu temsil eden nesnedir. async/await ise Promise'leri kullanmanın söz dilidir (syntactic sugar). async fonksiyon her zaman bir Promise döner. await ise sadece async fonksiyonlar içinde çalışır ve bir Promise'in resolve olmasını bekler. İkisi de aynı işi yapar; async/await kodu okumayı kolaylaştırır."
          />
          <FaqItem
            q="JavaScript'te 'callback hell' nedir?"
            a="Callback hell, birbirinin içine geçmiş iç içe callback fonksiyonlarından oluşan kodun okunamaz hale gelmesidir. Promise'ler ve async/await bu sorunu çözer: asenkron akışı düz (linear) bir kod gibi yazabilirsin, iç içe callback yığını yerine."
          />
          <FaqItem
            q="Promise.all ve sıralı await arasındaki fark nedir?"
            a="Sıralı await: A işi bitmeden B başlamaz, toplam süre = A + B. Promise.all([A, B]): A ve B paralel başlar, toplam süre = max(A, B). Bağımsız işler için Promise.all kullan, bağımlı işler için sıralı await."
          />
          <FaqItem
            q="JavaScript'te event loop nedir?"
            a="Event loop, JavaScript'in tek iş parçacıklı (single-threaded) yapısında asenkron işleri sıraya koyup yöneten mekanizmadır. Call stack boşaldığında, microtask queue (Promise'ler) önce, sonra macrotask queue (setTimeout, I/O) işlenir. Bu yüzden await'ler setTimeout'tan önce çalışır."
          />
          <FaqItem
            q="Mulakat sorusu: '1, setTimeout 0, Promise.then, 4' çıktısı ne olur?"
            a="Çıktı: 1, 4, 3, 2. Çünkü: 1 senkron yazılır. setTimeout macrotask, en sona kalır. Promise.then microtask, call stack boşalınca hemen çalışır. 4 senkron yazılır. Call stack boşalınca microtask (3) çalışır, sonra macrotask (2). Bu klasik event loop sorusudur."
          />
        </section>

        {/* Sonuç */}
        <section className="space-y-4 scroll-mt-20">
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.05] to-transparent p-6 space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-amber-200">Bir cümlede özet</h2>
            <p className="text-white/90 text-lg leading-relaxed">
              <strong className="text-amber-300">async/await, JavaScript'in "uzun süren işleri beklerken diğer işleri yapmaya devam etmesini sağlayan" söz dizimi.</strong> Callback hell'den kurtarır, kodu senkron gibi gösterir ama aslında asenkrondur.
            </p>
            <p className="text-white/70 text-sm">
              Modern projelerde async/await standart. fetch, axios, veritabanı sorguları, dosya işlemleri — hepsi Promise tabanlı, hepsi async/await ile yazılır. Bu üç yazıyı (closure, hoisting, async/await) bir oturuşta oku — JavaScript mülakatlarının %80'ini geçersin.
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
              <div className="text-xs text-white/60">7 kategori, 98 soru — async/await dahil tüm konuları pratik et.</div>
            </Link>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.05] to-transparent p-8 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">async/await öğrendin, üçlü tamam</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            JavaScript'in en çok sorulan 3 mülakat konusunu (closure, hoisting, async/await) tamamladın. Sıradaki: this, prototype, event loop.
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
              href="/blog/javascript-hoisting"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/15 transition-colors"
            >
              <KeyRound className="w-4 h-4" />
              Hoisting Nedir?
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
