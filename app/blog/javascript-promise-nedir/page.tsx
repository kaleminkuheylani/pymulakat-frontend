// app/blog/javascript-promise-nedir/page.tsx
//
// PYBlog yazisi #9: "JavaScript Promise Nedir?"
// 2026-07-22: async/await'ten once gelir (Promise, async/await'in temeli).
//   Ubersuggest long-tail — EN YUKSEK HACIM Promise sorgulari:
//   - javascript promise nedir (3.2K volume, PD 1, altin)
//   - javascript then catch (1.4K)
//   - javascript promise all (1.1K)
//   - javascript promise chain (480)
//   - javascript fetch promise (590)
//   - javascript async await promise farki (720)
//   - javascript callback promise (320)
//   - javascript promise resolve reject (390)
//
// Mulakatta closure + hoisting + promise + async/await dortgeni en cok sorulan.

import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen, Clock, ArrowLeft, ArrowRight, ArrowDown,
  CheckCircle2, Lightbulb, Code2, AlertTriangle, KeyRound,
  Layers, Repeat, Coffee,
} from "lucide-react";
import { notFound } from "next/navigation";
import { BASE_URL } from "@/lib/seo";
import { getPost, getAllPosts } from "../posts";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const post = await getPost("javascript-promise-nedir");
  if (!post) return { title: "Yazı Bulunamadı" };
  return {
    title: `${post.title} | PYBlog`,
    description: post.excerpt,
    keywords: [
      // 2026-07-22 keyword stuffing temizligi: 17+ → 9 unique phrase.
      "promise nedir",
      "then catch",
      "promise all",
      "promise chain",
      "async await promise farki",
      "callback hell",
      "promise allsettled",
      "promise race",
      "javascript mulakat",
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
      url: `${BASE_URL}/blog/javascript-promise-nedir`,
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
      canonical: `${BASE_URL}/blog/javascript-promise-nedir`,
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// JSON-LD Schemas
// ═══════════════════════════════════════════════════════════════

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${BASE_URL}/blog/javascript-promise-nedir#article`,
  headline: "JavaScript Promise Nedir? — Söz Dilim, .then(), .catch() ve Promise.all (Örneklerle)",
  description:
    "JavaScript Promise kavramı temelden: sözcük anlamı, üç durumu (pending/fulfilled/rejected), .then().catch() zinciri, Promise.all/Promise.race, callback hell'den kurtuluş. SSS, benzetmeler, mülakat tuzakları.",
  image: `${BASE_URL}/og-default.png`,
  datePublished: "2026-07-22",
  dateModified: "2026-07-22",
  inLanguage: "tr-TR",
  articleSection: "Eğitim",
  keywords: "promise nedir, then catch, promise all, promise chain, asenkron, callback hell",
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
      name: "JavaScript'te Promise nedir, en basit şekilde nasıl açıklanır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Promise, henüz hazır olmayan ama ileride hazır olacak bir değeri temsil eden nesnedir. 'Söz' gibi: şimdi veremiyorum ama birazdan vereceğim. Üç durumu vardır: pending (bekliyor), fulfilled (başarılı, değer geldi), rejected (hata). Promise, JavaScript'te asenkron (eşzamansız) işleri düz ve okunabilir kodla yazmayı sağlar.",
      },
    },
    {
      "@type": "Question",
      name: "Promise'in üç durumu (state) nelerdir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pending: henüz tamamlanmamış, ne resolve ne reject olmuş. Fulfilled: başarıyla tamamlandı, bir değer var (resolve()). Rejected: hata oldu, bir hata mesajı var (reject()). Bir Promise yalnızca bir kez state değiştirebilir: pending → fulfilled VEYA pending → rejected. Sonra değişmez (immutable).",
      },
    },
    {
      "@type": "Question",
      name: "Promise ile callback arasındaki fark nedir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Callback: bir fonksiyonu başka fonksiyona 'bitince bunu çağır' diye geçirirsin, iç içe geçtiğinde okunamaz (callback hell). Promise: asenkron sonucu bir nesne olarak temsil eder, .then().catch() ile düz zincir kurarsın. Promise, callback hell'i çözer ve hata yönetimini standartlaştırır.",
      },
    },
    {
      "@type": "Question",
      name: "Promise.all ve Promise.race farkı nedir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Promise.all([p1, p2, p3]): hepsi başarılı olursa tüm sonuçları verir, biri bile hata verirse hemen reject olur. Promise.race([p1, p2, p3]): hangisi önce biterse onun sonucunu verir (ilk fulfilled veya ilk rejected). Tüm paralel işler için all, 'en hızlı olan kazansın' için race.",
      },
    },
    {
      "@type": "Question",
      name: "Promise zinciri (chaining) nasıl çalışır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: ".then() her zaman yeni bir Promise döner. Bu sayede zincir kurabilirsin: onceA().then(onceB).then(onceC). Her .then() bir öncekinin sonucunu alır, dönüştürür, sonrakine geçirir. Hata olursa zincirin herhangi bir yerinde .catch() yakalar. Zincir, iç içe callback'lerin yerini alan düz (linear) bir yapıdır.",
      },
    },
    {
      "@type": "Question",
      name: "Mulakat sorusu: 'Promise.all bir elemani reddederse ne olur?'",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Promise.all, bir eleman reject olursa hemen kendisi de reject olur (fail-fast). Diğer hâlâ devam eden Promise'lerin sonucu yine de gelir ama .then() çağrılmaz, sadece .catch() çalışır. Bu yüzden 'bağımsız işlerden biri bile başarısızsa tüm operasyon iptal' senaryolarında Promise.all idealdir.",
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
    { "@type": "ListItem", position: 3, name: "JavaScript Promise", item: `${BASE_URL}/blog/javascript-promise-nedir` },
  ],
};

export default async function Page() {
  const post = await getPost("javascript-promise-nedir");
  if (!post) notFound();
  const OTHER_POSTS = (await getAllPosts())
    .filter((p) => p.slug !== "javascript-promise-nedir")
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
            JavaScript Promise Nedir?
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
              <ArrowDown className="w-3 h-3 text-white/30" />1. Benzetme: kahve siparisi
            </a>
            <a href="#seviye-2" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />2. Promise'in uc durumu
            </a>
            <a href="#seviye-3" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />3. Callback → Promise evrimi
            </a>
            <a href="#seviye-4" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />4. .then() / .catch() / .finally()
            </a>
            <a href="#seviye-5" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />5. Promise zinciri (chaining)
            </a>
            <a href="#seviye-6" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />6. Promise.all, race, allSettled
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
            <strong>Promise</strong> JavaScript'in asenkron programlama dünyasının kapısı. async/await ne kadar konuşulursa konuşulsun, Promise olmadan anlamı kalmaz. Çünkü <code>async/await</code> sadece Promise'leri yazmanın "daha temiz" bir yolu. Önce Promise'i anlamadan async/await "sihir gibi" kalır.
          </p>
          <p className="text-white/80 leading-relaxed">
            Mulakatlarda Promise denince akla 4-5 farklı soru gelir: <em>Promise nedir, callback hell'den farkı ne, .then() nasıl çalışır, Promise.all ne zaman kullanılır, hata yönetimi nasıl yapılır.</em> Bu yazıda hepsini <strong>temelden, örneklerle, benzetmelerle</strong> anlatıyoruz. Once yalin ifadeyle: <strong>Promise, "şimdi veremiyorum ama söz veriyorum, birazdan vereceğim" diyen bir nesnedir.</strong>
          </p>
        </section>

        {/* ════════════════════════════════════════════════════
            1. Benzetme: Kahve siparisi
        ════════════════════════════════════════════════════ */}
        <section id="seviye-1" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 1</div>
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Coffee className="w-7 h-7" />
              Benzetme: Kahve siparişi
            </h2>
          </header>
          <p className="text-white/80 leading-relaxed">
            Promise'i bir kahveci düşünerek anlatayım. Sen kafeye girdin, sırada bekliyorsun, kasiyer sana <strong>bir fiş numarası</strong> verdi. "Numaran 42, kahven hazır olunca ekranda görünecek." Sen bu fiş numarasıyla masaya oturdun, başka iş yaptın (telefona baktın, konuştun). 5 dakika sonra ekranda <strong>"42 numara hazır"</strong> yandı. Kalkıp kahveni aldın.
          </p>
          <p className="text-white/80 leading-relaxed">
            İşte <strong>Promise</strong> tam olarak bu fiş numarası:
          </p>
          <ul className="space-y-2 text-white/80">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Fiş numarası</strong> = <code>new Promise(...)</code> — henüz kahve yok ama söz var.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>"42 hazır" yandı</strong> = <code>resolve(kahve)</code> — söz tutuldu, değer geldi.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>"Süt bitti, kahve yok"</strong> = <code>reject(hata)</code> — söz tutulamadı, hata oldu.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Ekranı kontrol etmek</strong> = <code>.then(...)</code> veya <code>.catch(...)</code> — sonucu almak için yapılan çağrı.</span>
            </li>
          </ul>
          <p className="text-white/80 leading-relaxed">
            Sen fiş numarasını alıp oturduğunda, kasiyer <strong>seni beklemiyor</strong> (JavaScript tek iş parçacıklı çalışıyor, bloklanamaz). Başka müşterilere bakıyor. Senin kahven hazır olunca ekrana yansıtıyor. Sen de "hazır olunca" diye bir kod yazdın, sistem otomatik çalıştırdı. İşte <strong>asenkron programlamanın özü</strong> bu.
          </p>
        </section>

        {/* ════════════════════════════════════════════════════
            2. Promise'in uc durumu
        ════════════════════════════════════════════════════ */}
        <section id="seviye-2" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 2</div>
            <h2 className="text-2xl md:text-3xl font-bold">Promise'in üç durumu (state)</h2>
          </header>
          <p className="text-white/80 leading-relaxed">
            Her Promise yaşamı boyunca <strong>üç durumdan</strong> birinde olur. Bu durumlar Promise'in iç dünyasıdır, dışarıdan sadece sonucu (değer veya hata) görürsün:
          </p>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.05] p-4 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300">Pending</div>
              <div className="text-sm text-white/70">Henüz tamamlanmamış. Henüz resolve ya da reject olmamış. "Kahven hazırlanıyor."</div>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] p-4 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">Fulfilled</div>
              <div className="text-sm text-white/70">Başarıyla tamamlandı, bir değer var. <code>resolve(değer)</code> çağrıldı. "Kahven hazır, afiyet olsun."</div>
            </div>
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.05] p-4 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-300">Rejected</div>
              <div className="text-sm text-white/70">Hata oldu, bir hata mesajı var. <code>reject(hata)</code> çağrıldı. "Süt bitti, kahve yok."</div>
            </div>
          </div>

          <p className="text-white/80 leading-relaxed">
            <strong>Önemli kural</strong>: Bir Promise yalnızca <strong>bir kez</strong> state değiştirebilir. <code>pending → fulfilled</code> VEYA <code>pending → rejected</code>. Sonra bir daha değişmez (immutable). Yani bir Promise hem başarılı hem hatalı olamaz, sadece biri.
          </p>

          <h3 className="text-xl font-bold mt-6">İlk Promise'in</h3>
          <p className="text-white/80 leading-relaxed">
            En basit Promise'i yazalım: 1 saniye sonra "Merhaba" diyen bir söz.
          </p>
          <CodeBlock>{`const mesaj = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Merhaba dünya!"); // 1 saniye sonra "söz tutuldu"
  }, 1000);
});

console.log(mesaj); // Promise { <pending> }
// 1 saniye sonra:
mesaj.then((sonuc) => console.log(sonuc)); // "Merhaba dünya!"`}</CodeBlock>

          <p className="text-white/80 leading-relaxed">
            Gördüğün gibi: <code>new Promise((resolve, reject) =&gt; ...)</code> bir nesne yaratır. İçine verdiğin fonksiyon <em>executor</em> denir. <strong>resolve</strong> başarı durumunu temsil eder (değerle çağrılır), <strong>reject</strong> hata durumunu temsil eder (hata objesiyle çağrılır). Henüz hiçbiri çağrılmadığı için Promise <code>pending</code> durumunda.
          </p>
        </section>

        {/* ════════════════════════════════════════════════════
            3. Callback → Promise evrimi
        ════════════════════════════════════════════════════ */}
        <section id="seviye-3" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 3</div>
            <h2 className="text-2xl md:text-3xl font-bold">Callback → Promise evrimi (callback hell'den kurtuluş)</h2>
          </header>
          <p className="text-white/80 leading-relaxed">
            Promise'den önce asenkron kod <strong>callback fonksiyonlarıyla</strong> yazılıyordu. Bu özellikle "3-4 asenkron iş art arda" yapıldığında içinden çıkılmaz bir hal alıyordu. Buna <strong>callback hell</strong> (callback cehennemi) denir.
          </p>

          <h3 className="text-xl font-bold mt-6">Önce: Callback hell</h3>
          <p className="text-white/80 leading-relaxed">
            Diyelim: kullanıcı ID'si var → kullanıcı bilgisi çek → o kullanıcının siparişlerini çek → ilk siparişin detayını çek. Callback ile:
          </p>
          <CodeBlock>{`// ❌ Callback hell — sağa doğru kayıyor, okunamaz
kullaniciGetir(42, (hata, kullanici) => {
  if (hata) return console.log(hata);
  siparisleriGetir(kullanici.id, (hata, siparisler) => {
    if (hata) return console.log(hata);
    siparisDetay(siparisler[0].id, (hata, detay) => {
      if (hata) return console.log(hata);
      console.log(detay);
      // 3 seviye iç içe, hâlâ devam edebilir...
    });
  });
});`}</CodeBlock>

          <h3 className="text-xl font-bold mt-6">Sonra: Promise zinciri (düz, okunabilir)</h3>
          <p className="text-white/80 leading-relaxed">
            Aynı iş, Promise ile <strong>sağa değil aşağı</strong> uzanır. Her adım düz bir satır:
          </p>
          <CodeBlock>{`// ✅ Promise zinciri — aşağı doğru, okunabilir
kullaniciGetir(42)
  .then((kullanici) => siparisleriGetir(kullanici.id))
  .then((siparisler) => siparisDetay(siparisler[0].id))
  .then((detay) => console.log(detay))
  .catch((hata) => console.log(hata)); // tek bir catch, tüm zinciri korur`}</CodeBlock>

          <p className="text-white/80 leading-relaxed">
            Farkı gördün mü? Callback'de her adım için ayrı hata kontrolü vardı, iç içe geçmişti. Promise'de <strong>tek bir .catch()</strong> tüm zincirdeki hatayı yakalar. Bu, "bir hata olursa tüm zincir durur" demektir. Mülakatlarda bu pattern'i bilmek büyük artı.
          </p>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.05] p-4 space-y-2 mt-4">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> İpucu
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Modern projelerde artık <code>async/await</code> kullanılıyor (Promise'in syntactic sugar'ı). Ama Promise mantığını anlamadan async/await "sihir" gibi kalır. Bu yüzden önce Promise, sonra async/await öğren.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            4. .then() / .catch() / .finally()
        ════════════════════════════════════════════════════ */}
        <section id="seviye-4" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 4</div>
            <h2 className="text-2xl md:text-3xl font-bold">.then() / .catch() / .finally() — üçlü</h2>
          </header>
          <p className="text-white/80 leading-relaxed">
            Promise'in sonucunu almak için 3 metod var. Hepsi <strong>birer fonksiyon</strong> alır, hepsi <strong>yeni bir Promise</strong> döner (zincir kurabilirsin).
          </p>

          <div className="space-y-4 mt-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
              <h3 className="text-lg font-bold text-emerald-300">.then(başarı, hata?)</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Promise <strong>resolve</strong> olduğunda çalışır. Veriyi alırsın. İstersen ikinci parametre olarak hata fonksiyonu da geçebilirsin ama tavsiye edilmez, .catch() daha temiz.
              </p>
              <CodeBlock>{`fetch("/api/user")
  .then((cevap) => cevap.json())
  .then((user) => console.log("Kullanıcı:", user));`}</CodeBlock>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
              <h3 className="text-lg font-bold text-rose-300">.catch(hata)</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Promise <strong>reject</strong> olduğunda veya zincirde herhangi bir .then() hata fırlattığında çalışır. Tüm hataları tek noktada yakalar. JavaScript'te standart hata yönetimi.
              </p>
              <CodeBlock>{`fetch("/api/user")
  .then((c) => c.json())
  .catch((hata) => console.error("Bir şeyler ters gitti:", hata));`}</CodeBlock>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
              <h3 className="text-lg font-bold text-cyan-300">.finally(cleanup)</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Başarı veya hata fark etmez, <strong>her durumda</strong> çalışır. Genelde "yükleniyor" göstergesini kapatmak, bağlantıyı sonlandırmak gibi temizlik işleri için kullanılır.
              </p>
              <CodeBlock>{`fetch("/api/user")
  .then((c) => c.json())
  .catch((hata) => console.error(hata))
  .finally(() => {
    yukleniyorGizle(); // her durumda çalışır
    baglantiKapat();    // her durumda çalışır
  });`}</CodeBlock>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-6">Pratik örnek: fetch + Promise</h3>
          <p className="text-white/80 leading-relaxed">
            Gerçek bir örnek: bir kullanıcı bilgisi çekiyoruz. Hata olursa mesaj gösteriyoruz, her durumda "yükleniyor"u kapatıyoruz:
          </p>
          <CodeBlock>{`function kullaniciGoster(id) {
  yukleniyorGoster();

  fetch(\`/api/users/\${id}\`)
    .then((cevap) => {
      if (!cevap.ok) throw new Error("HTTP " + cevap.status);
      return cevap.json(); // yeni Promise, JSON parse
    })
    .then((user) => {
      isimYaz(user.name);
      emailYaz(user.email);
    })
    .catch((hata) => {
      hataGoster("Kullanıcı yüklenemedi: " + hata.message);
    })
    .finally(() => {
      yukleniyorGizle();
    });
}`}</CodeBlock>
        </section>

        {/* ════════════════════════════════════════════════════
            5. Promise zinciri
        ════════════════════════════════════════════════════ */}
        <section id="seviye-5" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 5</div>
            <h2 className="text-2xl md:text-3xl font-bold">Promise zinciri (chaining) — .then()'in sihri</h2>
          </header>
          <p className="text-white/80 leading-relaxed">
            <code>.then()</code> her zaman <strong>yeni bir Promise</strong> döner. Bu sayede zincir kurabilirsin. Bir adımın çıktısı, sonraki adımın girdisi olur.
          </p>

          <h3 className="text-xl font-bold mt-6">Veri dönüşümü zinciri</h3>
          <p className="text-white/80 leading-relaxed">
            Bir kullanıcı listesi çekip, sadece aktif olanları filtreleyip, isimleri büyük harfe çevirip, ilk 3'ünü alalım:
          </p>
          <CodeBlock>{`fetch("/api/users")
  .then((c) => c.json())           // [user, user, ...]
  .then((users) => users.filter((u) => u.aktif)) // sadece aktif
  .then((aktif) => aktif.map((u) => u.name.toUpperCase())) // BUYUK HARF
  .then((isimler) => isimler.slice(0, 3)) // ilk 3
  .then((ilkUc) => console.log(ilkUc));
// ["AYŞE", "MEHMET", "ZEYNEP"]`}</CodeBlock>

          <h3 className="text-xl font-bold mt-6">Sık yapılan hata: zincir kırmak</h3>
          <p className="text-white/80 leading-relaxed">
            Yeni başlayanlar sık şu hatayı yapar: zincirde bir yerde Promise döndürmeyi unuturlar. Bu durumda <code>.then()</code> "undefined" alır ve hata fırlatır:
          </p>
          <CodeBlock>{`// ❌ Hatalı: .then() içinde Promise DÖNDÜRMEDİN
fetch("/api/users")
  .then((c) => c.json())
  .then((users) => {
    users.filter((u) => u.aktif); // sadece filtreledin, döndürmedin
  })
  .then((sonuc) => console.log(sonuc)); // undefined!

// ✅ Doğru: return ile döndür
fetch("/api/users")
  .then((c) => c.json())
  .then((users) => users.filter((u) => u.aktif)) // return otomatik
  .then((aktif) => console.log(aktif.length));`}</CodeBlock>

          <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.05] p-4 space-y-2 mt-4">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Anti-pattern
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Süslü parantez kullanıyorsan <strong>return</strong> şart. Ok fonksiyonu (<code>=&gt;</code>) tek satırsa return otomatik. Süslü parantez açtıysan return yazmayı unutma.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            6. Promise.all, race, allSettled
        ════════════════════════════════════════════════════ */}
        <section id="seviye-6" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 6</div>
            <h2 className="text-2xl md:text-3xl font-bold">Promise.all, race, allSettled — paralel asenkron</h2>
          </header>
          <p className="text-white/80 leading-relaxed">
            Bazen <strong>birden fazla asenkron işi paralel</strong> çalıştırmak istersin. Tek tek await etmek yerine toplu metotlar var. Üçü de farklı senaryolarda kullanılır:
          </p>

          <div className="space-y-4 mt-4">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.05] p-4 space-y-2">
              <h3 className="text-lg font-bold text-amber-300">Promise.all — hepsi başarılı olmalı</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Tüm Promise'ler başarılı olursa sonuçları dizi olarak verir. <strong>Bir tanesi bile hata verirse hemen reject</strong> olur (fail-fast). En sık kullanılan metot.
              </p>
              <CodeBlock>{`// 3 kullanıcıyı paralel çek, hepsi gelince devam et
const [u1, u2, u3] = await Promise.all([
  fetch("/api/user/1").then((c) => c.json()),
  fetch("/api/user/2").then((c) => c.json()),
  fetch("/api/user/3").then((c) => c.json()),
]);
// Toplam süre: en yavaş istek (paralel)
// 3 ayrı await etseydin: 1+2+3 (sıralı)`}</CodeBlock>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] p-4 space-y-2">
              <h3 className="text-lg font-bold text-emerald-300">Promise.race — ilk biten kazanır</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Hangi Promise ilk <code>resolve</code> veya <code>reject</code> olursa onu döner. "Yarış" gibi. Genelde timeout senaryolarında kullanılır.
              </p>
              <CodeBlock>{`// 3 saniye içinde cevap gelmezse iptal et
const veri = await Promise.race([
  fetch("/api/yavas-endpoint").then((c) => c.json()),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Zaman aşımı")), 3000)
  ),
]);`}</CodeBlock>
            </div>

            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/[0.05] p-4 space-y-2">
              <h3 className="text-lg font-bold text-cyan-300">Promise.allSettled — hepsini bekle</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Tüm Promise'ler bitene kadar bekler, sonuçları <strong>dizi olarak</strong> verir (başarılı + hatalı). Hata olsa bile diğerlerini kaçırmazsın. Yeni (ES2020) metot.
              </p>
              <CodeBlock>{`// 3 endpoint'i dene, hangisi başarılı hangisi hatalı öğren
const sonuclar = await Promise.allSettled([
  fetch("/api/a"),
  fetch("/api/b"),
  fetch("/api/c"),
]);
sonuclar.forEach((s) => {
  if (s.status === "fulfilled") console.log("OK:", s.value);
  else console.log("HATA:", s.reason);
});`}</CodeBlock>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-6">Hangisini ne zaman kullan?</h3>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-2 text-white/80 font-semibold">Metot</th>
                  <th className="text-left p-2 text-white/80 font-semibold">Davranış</th>
                  <th className="text-left p-2 text-white/80 font-semibold">Kullanım</th>
                </tr>
              </thead>
              <tbody className="text-white/70">
                <tr className="border-b border-white/5">
                  <td className="p-2"><code className="text-amber-300">Promise.all</code></td>
                  <td className="p-2">Hepsi başarılı → sonuçlar. Biri hata → reject</td>
                  <td className="p-2">Bağımsız işler, hepsi gerekli</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-2"><code className="text-emerald-300">Promise.race</code></td>
                  <td className="p-2">İlk biten → onun sonucu</td>
                  <td className="p-2">Timeout, en hızlı kaynak</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-2"><code className="text-cyan-300">Promise.allSettled</code></td>
                  <td className="p-2">Hepsi biter → hepsinin sonucu (başarı + hata)</td>
                  <td className="p-2">Hata olsa bile hepsini istiyorum</td>
                </tr>
              </tbody>
            </table>
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
            q="JavaScript'te Promise nedir, en basit şekilde nasıl açıklanır?"
            a="Promise, henüz hazır olmayan ama ileride hazır olacak bir değeri temsil eden nesnedir. 'Söz' gibi: şimdi veremiyorum ama birazdan vereceğim. Üç durumu vardır: pending (bekliyor), fulfilled (başarılı, değer geldi), rejected (hata). Promise, JavaScript'te asenkron (eşzamansız) işleri düz ve okunabilir kodla yazmayı sağlar."
          />
          <FaqItem
            q="Promise'in üç durumu (state) nelerdir?"
            a="Pending: henüz tamamlanmamış, ne resolve ne reject olmuş. Fulfilled: başarıyla tamamlandı, bir değer var (resolve()). Rejected: hata oldu, bir hata mesajı var (reject()). Bir Promise yalnızca bir kez state değiştirebilir: pending → fulfilled VEYA pending → rejected. Sonra değişmez (immutable)."
          />
          <FaqItem
            q="Promise ile callback arasındaki fark nedir?"
            a="Callback: bir fonksiyonu başka fonksiyona 'bitince bunu çağır' diye geçirirsin, iç içe geçtiğinde okunamaz (callback hell). Promise: asenkron sonucu bir nesne olarak temsil eder, .then().catch() ile düz zincir kurarsın. Promise, callback hell'i çözer ve hata yönetimini standartlaştırır."
          />
          <FaqItem
            q="Promise.all ve Promise.race farkı nedir?"
            a="Promise.all([p1, p2, p3]): hepsi başarılı olursa tüm sonuçları verir, biri bile hata verirse hemen reject olur. Promise.race([p1, p2, p3]): hangisi önce biterse onun sonucunu verir (ilk fulfilled veya ilk rejected). Tüm paralel işler için all, 'en hızlı olan kazansın' için race."
          />
          <FaqItem
            q="Promise zinciri (chaining) nasıl çalışır?"
            a=".then() her zaman yeni bir Promise döner. Bu sayede zincir kurabilirsin: onceA().then(onceB).then(onceC). Her .then() bir öncekinin sonucunu alır, dönüştürür, sonrakine geçirir. Hata olursa zincirin herhangi bir yerinde .catch() yakalar. Zincir, iç içe callback'lerin yerini alan düz (linear) bir yapıdır."
          />
          <FaqItem
            q="Mulakat sorusu: 'Promise.all bir elemani reddederse ne olur?'"
            a="Promise.all, bir eleman reject olursa hemen kendisi de reject olur (fail-fast). Diğer hâlâ devam eden Promise'lerin sonucu yine de gelir ama .then() çağrılmaz, sadece .catch() çalışır. Bu yüzden 'bağımsız işlerden biri bile başarısızsa tüm operasyon iptal' senaryolarında Promise.all idealdir."
          />
        </section>

        {/* Sonuç */}
        <section className="space-y-4 scroll-mt-20">
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.05] to-transparent p-6 space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-amber-200">Bir cümlede özet</h2>
            <p className="text-white/90 text-lg leading-relaxed">
              <strong className="text-amber-300">Promise, "henüz hazır olmayan ama ileride hazır olacak değer" nesnesidir.</strong> Üç durumu vardır (pending/fulfilled/rejected), <code>.then().catch().finally()</code> ile sonucu alırsın, callback hell'den kurtarır, paralel işler için <code>Promise.all/race/allSettled</code> sunar.
            </p>
            <p className="text-white/70 text-sm">
              Modern projelerde Promise, async/await'in temeli. fetch, axios, dosya işlemleri, veritabanı sorguları — hepsi Promise tabanlı. Bu dört yazıyı (closure, hoisting, Promise, async/await) bir oturuşta oku — JavaScript mülakatlarının %80'ini geçersin.
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
              <div className="text-xs text-white/60">Promise dahil tüm konuları pratik et.</div>
            </Link>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.05] to-transparent p-8 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">Promise öğrendin, dörtlü tamam</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            JavaScript'in en çok sorulan 4 mülakat konusunu (closure, hoisting, Promise, async/await) tamamladın. Sıradaki: this, prototype, event loop.
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
              href="/blog/javascript-async-await"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/15 transition-colors"
            >
              <Code2 className="w-4 h-4" />
              async/await Nedir?
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


