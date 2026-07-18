// app/blog/teknik-terimler/page.tsx
//
// PYBlog yazisi #3: "Programlamanin Temel Teknik Terimleri"
// 2026-07-18: Ubersuggest long-tail hedef
//   - yazilim teknik terimler (~2.4K, diff 9, PD 1)
//   - programlama terimleri sozluk (~1.6K, diff 10, PD 1)
//   - binary ne demek (~2.1K, diff 6, PD 1)
//   - machine code nedir (~1.3K, diff 8, PD 1)
//   - interpreter nedir (~1.7K, diff 11, PD 1)
//   - derleyici nedir (~1.4K, diff 12, PD 1)
//
// Tema: pymulakat dark + amber, lucide icons, FAQ + DefinedTerm JSON-LD.
// Benzetmeler: bilgisayar = mutfak, binary = elektrik anahtari,
//   interpreter = tercuman, IDE = tam donanimli yazar odasi.

import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen, Clock, ArrowLeft, ArrowRight, ArrowDown,
  CheckCircle2, Lightbulb, Code2, Hash, Cpu, Zap,
  Database, Brain, FileCode, Layers, GitBranch, Terminal,
  Settings, Box, AlertTriangle, Repeat, Workflow, KeyRound,
} from "lucide-react";
import { notFound } from "next/navigation";
import { BASE_URL } from "@/lib/seo";
import { getPost } from "../posts";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const post = await getPost("teknik-terimler");
  if (!post) return { title: "Yazı Bulunamadı" };
  return {
    title: `${post.title} | PYBlog — Python Mülakat`,
    description: post.excerpt,
    keywords: [
      "yazılım teknik terimler",
      "programlama terimleri sözlük",
      "yazılım terimleri",
      "teknik terimler ne demek",
      "binary ne demek",
      "machine code nedir",
      "interpreter nedir",
      "derleyici nedir",
      "compiler vs interpreter",
      "IDE nedir",
      "syntax ne demek",
      "runtime nedir",
      "memory nedir programlama",
      "stack heap farkı",
      "thread nedir",
      "garbage collector nedir",
      "API nedir basit",
      "debug nedir",
      "veri yapısı nedir",
      "algoritma nedir",
      "yazılıma yeni başlayanlar için terimler",
      "temel programlama kavramları",
      ...post.tags,
    ],
    authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/blog/teknik-terimler`,
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
      canonical: `${BASE_URL}/blog/teknik-terimler`,
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// JSON-LD Schemas
// ═══════════════════════════════════════════════════════════════

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${BASE_URL}/blog/teknik-terimler#article`,
  headline: "Programlamanın Temel Teknik Terimleri — Binary, Machine Code, Interpreter ve Daha Fazlası",
  description:
    "Yazılımda sık duyulan ama kimsenin düzgün anlatmadığı 20+ teknik terim: binary, machine code, interpreter, derleyici, IDE, runtime. Mutfak, restoran, elektrik ve tercüman benzetmeleriyle.",
  image: `${BASE_URL}/og-default.png`,
  datePublished: "2026-07-18",
  dateModified: "2026-07-18",
  inLanguage: "tr-TR",
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
  mainEntityOfPage: `${BASE_URL}/blog/teknik-terimler`,
  keywords:
    "yazılım teknik terimler, programlama terimleri sözlük, binary ne demek, machine code nedir, interpreter nedir, derleyici nedir",
};

// DefinedTerm — 12 temel terim, schema.org Sozluk benzeri yapı
const definedTermsSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "Yazılımın Temel Teknik Terimleri Sözlüğü",
  description:
    "Yazılıma yeni başlayanlar için 20+ temel teknik terimin benzetmelerle açıklaması.",
  inLanguage: "tr-TR",
  hasDefinedTerm: [
    { "@type": "DefinedTerm", name: "Binary (İkili Sayı Sistemi)", alternateName: "binary ne demek" },
    { "@type": "DefinedTerm", name: "Machine Code (Makine Kodu)", alternateName: "machine code nedir" },
    { "@type": "DefinedTerm", name: "Source Code (Kaynak Kod)", alternateName: "kaynak kodu nedir" },
    { "@type": "DefinedTerm", name: "Compiler (Derleyici)", alternateName: "derleyici nedir" },
    { "@type": "DefinedTerm", name: "Interpreter (Yorumlayıcı)", alternateName: "interpreter nedir" },
    { "@type": "DefinedTerm", name: "IDE (Tümleşik Geliştirme Ortamı)", alternateName: "IDE nedir" },
    { "@type": "DefinedTerm", name: "Syntax (Sözdizimi)", alternateName: "syntax ne demek" },
    { "@type": "DefinedTerm", name: "Runtime (Çalışma Zamanı)", alternateName: "runtime nedir" },
    { "@type": "DefinedTerm", name: "Memory (Bellek)", alternateName: "memory nedir programlama" },
    { "@type": "DefinedTerm", name: "Stack ve Heap", alternateName: "stack heap farkı" },
    { "@type": "DefinedTerm", name: "Thread (İş Parçacığı)", alternateName: "thread nedir" },
    { "@type": "DefinedTerm", name: "Garbage Collector (Çöp Toplayıcı)", alternateName: "garbage collector nedir" },
    { "@type": "DefinedTerm", name: "API (Uygulama Programlama Arayüzü)", alternateName: "API nedir basit" },
    { "@type": "DefinedTerm", name: "Debug (Hata Ayıklama)", alternateName: "debug nedir" },
    { "@type": "DefinedTerm", name: "Veri Yapısı (Data Structure)", alternateName: "veri yapısı nedir" },
    { "@type": "DefinedTerm", name: "Algoritma (Algorithm)", alternateName: "algoritma nedir" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Binary ile makine kodu aynı şey mi?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Hayır, ikisi farklı kavramlar. Binary sayı sistemi 0 ve 1'den oluşan bir sayma yöntemidir. Makine kodu ise işlemcinin doğrudan anladığı komutlardır ve binary ile yazılır. Yani makine kodu, binary'nin bilgisayarın anladığı dile uygulanmış halidir.",
      },
    },
    {
      "@type": "Question",
      name: "Python yorumlayıcı mı derleyici mi?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Python yorumlayıcı (interpreter) kullanır. Yazdığın kodu satır satır okur ve anında çalıştırır. Bu yüzden hataları kod çalışırken görürsün. C, C++ ve Java ise önce derlenir; kodun tamamı makine koduna çevrilir, sonra çalışır.",
      },
    },
    {
      "@type": "Question",
      name: "IDE ile metin editörü arasındaki fark nedir?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Metin editörü sadece yazı yazmanı sağlar (Not Defteri gibi). IDE ise yazma, çalıştırma, hata ayıklama, otomatik tamamlama, versiyon kontrol ve test etme özelliklerini tek bir programda birleştirir. Yeni başlayanlar için VS Code veya PyCharm idealdir.",
      },
    },
    {
      "@type": "Question",
      name: "Stack ve heap bellek ne demek?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Stack, programın anlık olarak kullandığı küçük ve düzenli bellek alanıdır (fonksiyon çağrıları, yerel değişkenler). Heap ise büyük ve esnek bellek alanıdır (büyük objeler, diziler). Stack LIFO (son giren ilk çıkar), heap ise rastgele erişimli çalışır.",
      },
    },
    {
      "@type": "Question",
      name: "Programlamaya yeni başlayan biri hangi terimleri önce öğrenmeli?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Şu sırayla git: source code → syntax → IDE → interpreter/derleyici → runtime → memory → debug → veri yapısı → algoritma. Bu terimler birbirinin üstüne kuruludur; öncekini anlamadan sonrakini anlamak zor olur.",
      },
    },
    {
      "@type": "Question",
      name: "Garbage collector ne işe yarar?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Garbage collector, programın artık kullanmadığı bellek alanlarını otomatik olarak temizler. Java, Python ve JavaScript gibi dillerde çalışır. C ve C++'ta bu görevi programcı yapar (malloc/free). Garbage collector sayesinde bellek sızıntısı (memory leak) riski azalır.",
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
    { "@type": "ListItem", position: 3, name: "Teknik Terimler", item: `${BASE_URL}/blog/teknik-terimler` },
  ],
};

export default async function Page() {
  const post = await getPost("teknik-terimler");
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) } as any} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermsSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) } as any} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) } as any} />

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
            <span className="uppercase tracking-wider font-semibold">Sözlük</span>
            <span className="text-white/30">·</span>
            <span className="text-white/50">{new Date(post.date).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Programlamanın Temel Teknik Terimleri
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

        {/* ── Giriş: Bu yazı kimin için? ─────────────────────── */}
        <section className="prose prose-invert max-w-none">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-6 md:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-amber-300 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold mb-2 text-amber-200">Bu yazı kimin için?</h2>
                <p className="text-white/80 leading-relaxed">
                  Eğer bir yazılımcıyla konuşurken <em>"memory ne demek ya, thread de ne?"</em> diye içinden geçirdiysen, bu yazı tam sana göre. Burada <strong>20+ temel teknik terimi</strong> günlük hayattan benzetmelerle açıklıyorum. Amaç: <strong>"bu adam bana ne anlatıyor?"</strong> dediğin an sayısını sıfıra indirmek.
                </p>
                <p className="text-white/70 leading-relaxed mt-3">
                  Terimleri rastgele sırayla değil, <strong>mantıksal sırayla</strong> anlatıyorum: önce bilgisayar ne anlıyor (binary, machine code), sonra sen ne yazıyorsun (source code, syntax), sonra araçlar (IDE, compiler, interpreter), sonra çalışma sırasında olan şeyler (runtime, memory, stack/heap), sonra da programcının işleri (debug, API, veri yapısı, algoritma).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── İçindekiler ──────────────────────────────────── */}
        <nav className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            İçindekiler
          </h2>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            <a href="#seviye-1" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />
              1. Bilgisayar ne anlıyor?
            </a>
            <a href="#seviye-2" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />
              2. Sen ne yazıyorsun?
            </a>
            <a href="#seviye-3" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />
              3. Araçlar ve ortam
            </a>
            <a href="#seviye-4" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />
              4. Çalışma sırasında olanlar
            </a>
            <a href="#seviye-5" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />
              5. Programcının günlük işleri
            </a>
            <a href="#seviye-6" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />
              6. Soyut kavramlar
            </a>
            <a href="#sss" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />
              Sıkça Sorulan Sorular
            </a>
            <a href="#sonuc" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />
              Sonuç: Hangi terimi ne zaman öğrenmeli?
            </a>
          </div>
        </nav>

        {/* ════════════════════════════════════════════════════
            SEVIYE 1: BILGISAYAR NE ANLIYOR?
        ════════════════════════════════════════════════════ */}
        <section id="seviye-1" className="space-y-8 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 1</div>
            <h2 className="text-2xl md:text-3xl font-bold">Bilgisayar ne anlıyor?</h2>
            <p className="text-white/60">
              Yazılımın en temel katmanı. Buradan başlamak önemli çünkü bilgisayar aslında <strong>hiçbir şey "anlamaz"</strong> — sadece elektrik var veya yok.
            </p>
          </header>

          {/* TERIM 1: BINARY */}
          <TermBlock
            id="binary"
            icon={<Zap className="w-6 h-6" />}
            color="amber"
            name="Binary (İkili Sayı Sistemi)"
            question="Bilgisayar neden sadece 0 ve 1 anlıyor?"
            analogy="Elektrik Anahtarı"
            analogyText={
              <>
                Bir <strong> elektrik anahtarını</strong> düşün. Ya açıktır (ışık yanar) ya kapalıdır (ışık yanmaz). Arada bir şey yok. Bilgisayarın içinde milyarlarca minik anahtar var (transistör) ve her biri ya "açık" ya "kapalı". <code className="text-amber-300">1</code> = açık (elektrik var), <code className="text-amber-300">0</code> = kapalı (elektrik yok). İşte bu yüzden bilgisayar her şeyi 0 ve 1 ile ifade eder: <strong>elektriğin varlığı ve yokluğu.</strong>
              </>
            }
            explanation={
              <>
                <p>
                  Binary (ikili sayı sistemi) sadece iki rakam kullanır: 0 ve 1. Biz günlük hayatta 10 rakam kullanırız (0-9, onlu sistem). Ama bilgisayar için "elektrik var" ve "elektrik yok" olmak üzere sadece iki durum var.
                </p>
                <p>
                  Peki "merhaba" nasıl binary olur? Her harfe bir sayı karşılık gelir. Örneğin ASCII'de <code className="text-amber-300">A</code> = 65 = binary <code className="text-amber-300">01000001</code>. Bir fotoğraf, bir video, bir müzik, hepsi binary'ye dönüşür. <strong>İçeride her şey 0 ve 1.</strong>
                </p>
                <CodeBlock>
                  {`# 65 sayısı binary'ye nasıl çevrilir?
65 = 64 + 1
   = 2^6 + 2^0
   = 01000001 (binary)

# Python'da kontrol
>>> bin(65)
'0b1000001'

# "A" harfinin binary karşılığı
>>> ''.join(format(ord(c), '08b') for c in 'A')
'01000001'`}
                </CodeBlock>
                <p>
                  Yani binary bir "şifre" değil, <strong>sayma yöntemi</strong>. Bilgisayarın anladığı tek dil bu.
                </p>
              </>
            }
            realLife="Bir LED ekranda pixel yanıyorsa 1, yanmıyorsa 0. Milyarlarca pixel bir araya gelince senin izlediğin film oluşuyor."
            antiPattern="Binary = programlama dili değildir. Bilgisayar binary ile çalışır ama sen binary yazmazsın — onun yerine Python, JavaScript gibi diller yazarsın."
          />

          {/* TERIM 2: MACHINE CODE */}
          <TermBlock
            id="machine-code"
            icon={<Cpu className="w-6 h-6" />}
            color="amber"
            name="Machine Code (Makine Kodu)"
            question="Bilgisayarın anladığı tek dil hangisi?"
            analogy="Aşçının Tarif Kitabı"
            analogyText={
              <>
                Bir <strong>aşçının mutfaktaki tarif kitabını</strong> düşün. İçinde sadece şunlar yazıyor: "Tencereyi ocağa koy", "Tuz ekle", "10 dakika pişir". Aşçı başka bir şey anlamaz; sadece bu komutları uygular. İşte bilgisayarın "tarif kitabı" <strong>machine code</strong>'dur: sadece işlemcinin anladığı, son derece basit komutlar.
              </>
            }
            explanation={
              <>
                <p>
                  Machine code, işlemcinin (CPU) doğrudan çalıştırabildiği komutlardır. Her komut çok basit bir şey yapar: "iki sayıyı topla", "bu veriyi belleğe yaz", "şuraya zıpla". Bunlar binary olarak yazılır.
                </p>
                <p>
                  Örnek: x86 işlemcisinde <code className="text-amber-300">10110000 01100001</code> komutu "97 sayısını AL register'ına yükle" demektir. Bir insanın bunu okuması neredeyse imkânsız, ama CPU saniyede <strong>milyarlarca</strong> komutu işler.
                </p>
                <CodeBlock>
                  {`# Machine code örneği (x86 assembly karşılığı ile)
# Hex:    B0 61       B0 64       04 01
# Binary: 10110000    10110000    00000100
#         01100001    01100010    00000001
# Anlamı: 97'yi AL'e   100'ü AL'e  AL+bl yap
#         yükle         yükle       (=198)

# Modern programcılar machine code yazmaz.
# Çünkü: CPU'ya özel, okunması imkânsız, taşınabilir değil.
# Bunun yerine yüksek seviye dil (Python, C, JS) yazıp
# compiler veya interpreter'a çevirtirsin.`}
                </CodeBlock>
              </>
            }
            realLife="Mikrodenetleyici veya işletim sistemi çekirdeği yazarken (kernel) machine code'a çok yakın assembly ile çalışılır. Günlük uygulama geliştirirsen hayatında machine code yazmazsın."
            antiPattern="Machine code ile programlama = sıfırdan her şeyi yazmak değil. Bilgisayar mühendisliği, gömülü sistemler veya performans kritik yerlerde kullanılır. Web sitesi, mobil uygulama yazıyorsan görmezsin bile."
          />
        </section>

        {/* ════════════════════════════════════════════════════
            SEVIYE 2: SEN NE YAZYORSUN?
        ════════════════════════════════════════════════════ */}
        <section id="seviye-2" className="space-y-8 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 2</div>
            <h2 className="text-2xl md:text-3xl font-bold">Sen ne yazıyorsun?</h2>
            <p className="text-white/60">
              Machine code yazmak imkânsız olduğu için insanların anladığı diller var. Bunlar "kaynak kod" olarak başlıyor.
            </p>
          </header>

          {/* TERIM 3: SOURCE CODE */}
          <TermBlock
            id="source-code"
            icon={<FileCode className="w-6 h-6" />}
            color="cyan"
            name="Source Code (Kaynak Kod)"
            question="Sen ne yazıyorsun?"
            analogy="Yemek Tarifi"
            analogyText={
              <>
                <strong>Yemek tarifi</strong> düşün. "2 yemek kaşığı tereyağı, 1 soğan, 3 domates" gibi adımlar var. Bu, aşçının anladığı basit bir form. İşte source code da bilgisayara verdiğin "tarif". Sen yazarsın, bilgisayar (compiler veya interpreter aracılığıyla) uygular.
              </>
            }
            explanation={
              <>
                <p>
                  Source code (kaynak kod), bir programlama dilinde yazdığın <code>.py</code>, <code>.js</code>, <code>.java</code> gibi dosyalardaki komutlardır. İnsanların okuyabildiği, anladığı, üzerinde tartışabildiği form.
                </p>
                <CodeBlock>
                  {`# Bu bir source code (Python)
def selam(isim):
    return f"Merhaba, {isim}!"

print(selam("Dünya"))
# Çıktı: Merhaba, Dünya!`}
                </CodeBlock>
                <p>
                  Source code düz metin dosyasıdır. Not Defteri'yle bile yazabilirsin (yazsan da çalışır, ama zor olur). Önemli olan: <strong>sen yazarsın, araç çalıştırır.</strong>
                </p>
              </>
            }
            realLife="GitHub'a girdiğinde gördüğün her şey source code. Açık kaynak projelerin tamamı source code olarak paylaşılır — istediğin gibi oku, değiştir, öğren."
            antiPattern="Source code = gizli şifre değil. Düz metindir, herkes okur. Senin kodun ne kadar değerli? — Genelde fikrin ve problemi çözme biçimin değerli, kodun kendisi değil."
          />

          {/* TERIM 4: SYNTAX */}
          <TermBlock
            id="syntax"
            icon={<Code2 className="w-6 h-6" />}
            color="cyan"
            name="Syntax (Sözdizimi)"
            question="Neden her dilin kuralları farklı?"
            analogy="Dilbilgisi"
            analogyText={
              <>
                Türkçede "Ben <strong>okula gidiyorum</strong>" dersin, "Ben gidiyorum okula" dersen anlarsın ama tuhaf olur. İngilizcede "I <strong>am going</strong> to school" denir. Her dilin <strong>kelime sırası ve çekim kuralları</strong> var. Programlama dillerinde de bu kurallara <strong>syntax</strong> denir.
              </>
            }
            explanation={
              <>
                <p>
                  Syntax, programlama dilinin gramer kurallarıdır. Yanlış syntax = kod çalışmaz, "SyntaxError" hatası alırsın.
                </p>
                <CodeBlock>
                  {`# ✅ Doğru Python syntax
if yas >= 18:
    print("Reşit")

# ❌ Yanlış syntax (girinti eksik)
if yas >= 18:
print("Reşit")  # IndentationError

# ❌ Yanlış syntax (iki nokta üst üste eksik)
if yas >= 18
    print("Reşit")  # SyntaxError`}
                </CodeBlock>
                <p>
                  Her dilin syntax'ı farklı: Python'da girinti önemli, JavaScript'te süslü parantez önemli, SQL'de noktalı virgül önemli. <strong>Syntax kuralı çiğnenirse hata alırsın, mantık hatası olmaz.</strong>
                </p>
              </>
            }
            realLife="Yabancı dil öğrenirken dilbilgisi ezberlemek gibi. İlk zamanlar zor ama pratikle oturur. Editörler genelde hatalı syntax'ı renklendirir."
            antiPattern="Syntax hatası = mantık hatası değildir. Kodun doğru çalışıp yanlış sonuç vermesi başka bir kategori: logic error. Syntax kurtulunur, logic kurtulunmaz."
          />
        </section>

        {/* ════════════════════════════════════════════════════
            SEVIYE 3: ARAÇLAR VE ORTAM
        ════════════════════════════════════════════════════ */}
        <section id="seviye-3" className="space-y-8 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 3</div>
            <h2 className="text-2xl md:text-3xl font-bold">Araçlar ve ortam</h2>
            <p className="text-white/60">
              Source code yazdın, şimdi bilgisayara nasıl anlatacaksın? İşte burada compiler, interpreter ve IDE devreye girer.
            </p>
          </header>

          {/* TERIM 5: COMPILER */}
          <TermBlock
            id="compiler"
            icon={<Repeat className="w-6 h-6" />}
            color="indigo"
            name="Compiler (Derleyici)"
            question="Kaynak kodu makine koduna kim çevirir?"
            analogy="Tercüman — Kitap Çevirisi"
            analogyText={
              <>
                Bir <strong>kitap çevirmeni</strong> düşün. Kitabın tamamını önce İngilizceden Türkçeye çevirir, basılı hale getirir, sonra dağıtır. Okuyucu çeviriyi alır ve okur. Hiçbir zaman İngilizce orijinali görmez. İşte <strong>compiler</strong> (derleyici) tam böyle çalışır: <strong>tüm source code'u bir kerede makine koduna çevirir</strong>, sonra çalıştırır.
              </>
            }
            explanation={
              <>
                <p>
                  Compiler, yazdığın source code'un tamamını okur, kontrol eder, makine koduna (veya ara bir form olan bytecode'a) çevirir ve <strong>çalıştırılabilir dosya</strong> üretir. Bu üretim bir kere olur; aynı dosyayı binlerce kişi çalıştırabilir.
                </p>
                <CodeBlock>
                  {`# C dili örneği — derlenir
# Kaynak: selam.c
#include <stdio.h>
int main() {
    printf("Merhaba Dünya\\n");
    return 0;
}

# Derleme
$ gcc selam.c -o selam
# → 'selam' adında çalıştırılabilir dosya üretildi

# Çalıştırma
$ ./selam
Merhaba Dünya

# Avantaj: Hızlı çalışır (zaten makine kodu)
# Dezavantaj: Her işletim sistemi için ayrı derleme gerekir
#             (Windows'ta derlenen .exe Mac'te çalışmaz)`}
                </CodeBlock>
                <p>
                  <strong>Derlenen diller:</strong> C, C++, Rust, Go, Swift, Java (kısmen).
                </p>
              </>
            }
            realLife="Telefonundaki uygulamalar derlenmiş kod. Bir oyun indirdiğinde .exe veya .app dosyası alırsın — bu zaten makine koduna çevrilmiş hali."
            antiPattern="Derleme = hata bulmaktır denemez. Compiler sadece syntax ve basit tip hatalarını yakalar. Mantık hatalarını yakalamaz — onu test ve debug yakalar."
          />

          {/* TERIM 6: INTERPRETER */}
          <TermBlock
            id="interpreter"
            icon={<Workflow className="w-6 h-6" />}
            color="indigo"
            name="Interpreter (Yorumlayıcı)"
            question="Satır satır çalıştıran dil nedir?"
            analogy="Simültane Tercüman"
            analogyText={
              <>
                Bir <strong>konferansta simültane tercüman</strong> düşün. Konuşmacı İngilizce konuşur, tercüman <strong>anında</strong> cümle cümle Türkçeye çevirir. Kitap çevirmeni gibi önceden çevirip basmaz; <strong>anlık, satır satır</strong> çevirir. İşte <strong>interpreter</strong> (yorumlayıcı) böyle çalışır.
              </>
            }
            explanation={
              <>
                <p>
                  Interpreter, source code'u <strong>satır satır</strong> okur ve anında çalıştırır. Önce çevirip saklama yok; her çalıştırmada yeniden yorumlar.
                </p>
                <CodeBlock>
                  {`# Python yorumlayıcı örneği
# Kaynak: selam.py
def selam(isim):
    return f"Merhaba, {isim}!"

print(selam("Dünya"))

# Çalıştırma
$ python selam.py
# Python interpreter:
#   1. satırı oku → fonksiyon tanımı, hafızaya al
#   2. satırı oku → fonksiyon tanımı, hafızaya al
#   3. satırı oku → fonksiyonu çağır, çalıştır
#   4. satırı oku → print çalıştır
# Çıktı: Merhaba, Dünya!

# Avantaj: Hızlı geliştirme (kaydet, çalıştır, gör)
# Dezavantaj: Yavaş çalışır (her seferinde yeniden yorumlar)`}
                </CodeBlock>
                <p>
                  <strong>Yorumlanan diller:</strong> Python, JavaScript (tarayıcıda), Ruby, PHP. <em>Not: Modern motorlar hibrit çalışır (Python'da .pyc bytecode, JavaScript'te JIT), ama temel mantık aynıdır.</em>
                </p>
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/[0.05] p-4 text-sm">
                  <strong className="text-indigo-300">Compiler vs Interpreter:</strong> Compiler bir kere çevirip defalarca çalıştırır (hızlı çalışma, yavaş geliştirme). Interpreter her seferinde yeniden yorumlar (yavaş çalışma, hızlı geliştirme). Yeni başlayanlar için interpreter daha kolaydır.
                </div>
              </>
            }
            realLife="Tarayıcıda JavaScript yazdığında, tarayıcının içindeki JavaScript engine (V8, SpiderMonkey) interpreter+JIT ile çalışır. pythonmulakat.com'da sen de tarayıcıda Python yazıp yorumlatabilirsin."
            antiPattern="Python yavaştır denemez. Yorumlama hızı uygulamaya göre değişir. Modern Python (CPython 3.11+) eski sürümlere göre 2x daha hızlı, ayrıca Cython, PyPy gibi seçenekler var."
          />

          {/* TERIM 7: IDE */}
          <TermBlock
            id="ide"
            icon={<Settings className="w-6 h-6" />}
            color="indigo"
            name="IDE (Tümleşik Geliştirme Ortamı)"
            question="Kod yazmak için ne kullanılır?"
            analogy="Tam Donanımlı Yazar Odası"
            analogyText={
              <>
                Bir <strong>yazar odası</strong> düşün: bilgisayar, kahve makinesi, sözlükler, raflar dolusu kitap, not defterleri, kalemler, daktilo. Hepsini bir araya getirmişler ki yazar sadece yazmaya odaklansın. <strong>IDE</strong> (Integrated Development Environment) de programcının "yazar odası"dır: yazma, çalıştırma, hata ayıklama, otomatik tamamlama, versiyon kontrol — hepsi tek programda.
              </>
            }
            explanation={
              <>
                <p>
                  IDE, sadece metin yazma değil, <strong>kod yazma sürecinin tamamı</strong> için tasarlanmış bir programdır. Bir metin editörünün (Not Defteri) üstüne çok şey ekler:
                </p>
                <ul className="space-y-2 list-none">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />Sözdizimi renklendirme (syntax highlighting)</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />Otomatik tamamlama (IntelliSense)</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />Hata ayıklayıcı (debugger) — satır satır çalıştırma</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />Terminal / komut satırı entegrasyonu</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />Git versiyon kontrol entegrasyonu</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />Eklenti sistemi (plugin)</li>
                </ul>
                <p>
                  <strong>Popüler IDE'ler:</strong> VS Code (ücretsiz, çok yönlü), PyCharm (Python'a özel), IntelliJ (Java'ya özel), Xcode (macOS/iOS), Android Studio (mobil).
                </p>
                <p>
                  Yeni başlayanlar için <strong>VS Code</strong> en iyi seçim: hafif, hızlı, binlerce eklenti, topluluk çok büyük. pythonmulakat.com üzerinde de tarayıcı tabanlı bir editör var — kurulum yok, anında başla.
                </p>
              </>
            }
            realLife="Yazılım şirketlerinde programcılar işe başlarken ilk kurdukları şey IDE + Git + terminal. Bu üçlü = yazılımcının temel çantası."
            antiPattern="IDE öğrenmek = programlama öğrenmek değil. IDE sadece araç, asıl mesele problemi çözebilmek. Not Defteri ile de program yazabilirsin, sadece zor olur."
          />
        </section>

        {/* ════════════════════════════════════════════════════
            SEVIYE 4: ÇALIŞMA SIRASINDA OLANLAR
        ════════════════════════════════════════════════════ */}
        <section id="seviye-4" className="space-y-8 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 4</div>
            <h2 className="text-2xl md:text-3xl font-bold">Çalışma sırasında olanlar</h2>
            <p className="text-white/60">
              Kodun çalışmaya başladı. Şimdi bilgisayar arka planda ne yapıyor? İşte program çalışırken olan şeyler.
            </p>
          </header>

          {/* TERIM 8: RUNTIME */}
          <TermBlock
            id="runtime"
            icon={<Terminal className="w-6 h-6" />}
            color="emerald"
            name="Runtime (Çalışma Zamanı)"
            question="Program çalışırken neler oluyor?"
            analogy="Sahne Gösterisi"
            analogyText={
              <>
                Bir <strong>sahne gösterisi</strong> düşün. Prova (test) bitti, perde açıldı, oyuncular sahneye çıktı. <strong>Perde açıkken olan her şey</strong> = runtime. Oyuncular (program), dekor (veri), ışıklandırma (kaynaklar) — hepsi o anda canlı. İşte "runtime" da programın çalıştığı o "canlı an" demek.
              </>
            }
            explanation={
              <>
                <p>
                  Runtime, programın <strong>fiilen çalıştığı süre</strong>. Kod dosyada duruyorken runtime değil, çalıştırılıp sonuç ürettiği an runtime.
                </p>
                <p>
                  "Runtime error" dendiğinde, kodun syntax'ı doğru, derleme/parse aşamasını geçti ama <strong>çalışırken</strong> bir şey ters gitti demektir. Örneğin sıfıra bölme, olmayan dosyayı açma, olmayan indekse erişim.
                </p>
                <CodeBlock>
                  {`# Syntax error — runtime'dan ÖNCE yakalanır
if x = 5:  # = atama, == karşılaştırma olmalıydı
    print(x)
# SyntaxError: invalid syntax

# Runtime error — program BAŞLAR, sonra hata verir
sayilar = [1, 2, 3]
print(sayilar[10])
# IndexError: list index out of range
# Bu satıra kadar program çalıştı, runtime'da patladı

# Runtime environment: Python yorumlayıcısı + sistem kütüphaneleri
# Tarayıcıda JavaScript çalıştırırken: V8 engine + DOM + Web APIs
# Hepsi "runtime environment"ı oluşturur.`}
                </CodeBlock>
              </>
            }
            realLife="Bir uygulama açıldığında, arka planda runtime environment hazırlanır: interpreter veya VM, gerekli kütüphaneler yüklenir, bellek ayrılır, sonra kod çalışmaya başlar. Bu süre = startup time."
            antiPattern="Runtime = sadece hata anlamına gelmez. Runtime aynı zamanda programın tüm yaşam döngüsünü kapsar. Runtime overhead, runtime environment, runtime library gibi pek çok kullanımı var."
          />

          {/* TERIM 9: MEMORY */}
          <TermBlock
            id="memory"
            icon={<Database className="w-6 h-6" />}
            color="emerald"
            name="Memory (Bellek / RAM)"
            question="Değişkenler nereye kaydediliyor?"
            analogy="Çalışma Masası"
            analogyText={
              <>
                Bir <strong>masaüstü bilgisayar</strong> düşün. Üzerine kâğıtlar, defterler, kalemler koyarsın. Çalışırken masadaki her şey elinin altında, hızlıca erişirsin. İşi bitince kalkıp kütüphaneye (diske) kaldırırsın. İşte <strong>RAM</strong> = masa (hızlı, geçici, sınırlı), <strong>Disk/SSD</strong> = kütüphane (yavaş, kalıcı, büyük). Program çalışırken tüm "çalışma verisi" RAM'de durur.
              </>
            }
            explanation={
              <>
                <p>
                  Memory (RAM), programın <strong>çalışırken kullandığı verilerin tutulduğu</strong> alan. Değişkenlerin, fonksiyon çağrılarının, ara sonuçların hepsi burada yaşar. Bilgisayarı kapatınca RAM'deki her şey silinir (geçici).
                </p>
                <CodeBlock>
                  {`# Bellekte neler oluyor?
x = 10        # x adres 0x7fff5 sayısında 10 tutulur
y = "merhaba" # y adresinde "merhaba" string'i tutulur
liste = [1,2,3] # liste değişkeni de bir bellek adresine bağlanır

# Python'da id() ile adresi görebilirsin
x = 10
print(id(x))  # Örn: 140234567890432

# Bellek sızıntısı (memory leak):
# Sürekli yeni veri atayıp eskisini temizlemiyorsan
# RAM dolar, program yavaşlar, sonunda çöker.`}
                </CodeBlock>
                <p>
                  Bellek sınırlı bir kaynaktır. Yüzlerce MB RAM'in var; 1 GB'lık bir resmi açtığında hepsini tek seferde koyamıyorsun. Bu yüzden programcı belleği yönetir: "bu veri artık lazım değil, sil" der.
                </p>
              </>
            }
            realLife={"Telefonun uygulamaları arasında geçiş yapınca bazı uygulamalar arka planda \"öldürülür\" — işte bu RAM sıkıntısından. Android ve iOS en çok RAM kullanan uygulamaları otomatik kapatır."}
            antiPattern="Memory = disk değil. Disk kalıcı (verilerin kaybolmaz), RAM geçici (kapatınca silinir). 16 GB RAM'in olması, 16 GB dosya kaydedebileceğin anlamına gelmez."
          />

          {/* TERIM 10: STACK VE HEAP */}
          <TermBlock
            id="stack-heap"
            icon={<Layers className="w-6 h-6" />}
            color="emerald"
            name="Stack ve Heap"
            question="Bellek nasıl bölünüyor?"
            analogy="Tabak Yığını vs Ambar"
            analogyText={
              <>
                Bir <strong>restoran mutfağını</strong> düşün. Kirli tabaklar <strong>üst üste yığılır</strong> (stack): en üsttekini alırsın, sonra alttakine ulaşırsın. Düzenli, hızlı, küçük. Ama <strong>ambarda</strong> (heap) her şey serbestçe durur: koli, çuval, kasa — büyük, esnek, ama bir şey bulmak daha yavaş. Bellekte de <strong>stack</strong> = hızlı küçük alan (yerel değişkenler, fonksiyon çağrıları), <strong>heap</strong> = büyük esnek alan (objeler, diziler).
              </>
            }
            explanation={
              <>
                <p>
                  Bellek iki ana bölgeye ayrılır: <strong>stack</strong> ve <strong>heap</strong>. Çoğu dilde bu ayrım programcıdan gizlidir ama neyin nereye gittiğini bilmek debug'ı kolaylaştırır.
                </p>
                <CodeBlock>
                  {`def toplam(a, b):
    sonuc = a + b   # 'a', 'b', 'sonuc' → STACK'te
    return sonuc

x = 10
y = 20
z = toplam(x, y)   # 'z' → STACK'te (basit int)

# Stack: küçük, hızlı, LIFO (son giren ilk çıkar)
# Heap:  büyük, esnek, karmaşık yapılar için

buyuk_liste = [1] * 1_000_000
# ↑ Bu liste HEAP'te durur (çok büyük)
# 'buyuk_liste' değişkeninin kendisi STACK'te,
# ama gösterdiği veri HEAP'te`}
                </CodeBlock>
                <p>
                  <strong>Stack overflow</strong> (yığın taşması): Çok derin fonksiyon çağrısı yaparsan stack dolarsa Python <code>RecursionError</code> verir. <strong>Memory leak</strong>: Heap'teki objeler temizlenmezse bellek dolar.
                </p>
              </>
            }
            realLife="Tarayıcıda bir sekme crash olduğunda çoğunlukla heap'teki JavaScript objeleri şişmiştir. Chrome DevTools'ta Memory sekmesi stack/heap kullanımını gösterir."
            antiPattern="Stack = heap değildir. İkisi farklı yönetilir, farklı hızdadır, farklı şeyler depolar. Detaylar dil runtime'ına göre değişir ama ayrım her zaman var."
          />

          {/* TERIM 11: THREAD */}
          <TermBlock
            id="thread"
            icon={<GitBranch className="w-6 h-6" />}
            color="emerald"
            name="Thread (İş Parçacığı)"
            question="Program aynı anda birden fazla iş yapabilir mi?"
            analogy="Restoran Garsonları"
            analogyText={
              <>
                Bir <strong>restoran</strong> düşün. Tek garson olsa, masalar sırayla bekler. İki garson olsa paralel hizmet verirler. Üç garson daha hızlı ama siparişleri karıştırmamak için koordinasyon gerekir. İşte her <strong>garson = bir thread</strong>. Programda paralel çalışan yürütme birimleri.
              </>
            }
            explanation={
              <>
                <p>
                  Thread, bir program içinde <strong>bağımsız çalışan yürütme birimi</strong>. Tek thread'li programda her şey sırayla yapılır. Çok thread'li programda işler paralel yürütülebilir.
                </p>
                <p>
                  Modern uygulamalar çoğunlukla çok thread'li: bir thread ekranı çizerken diğeri ağ üzerinden veri çeker, bir diğeri kullanıcı girdisini dinler.
                </p>
                <p>
                  <strong>JavaScript'in özel durumu:</strong> JavaScript tek thread'li (single-threaded) çalışır. Ama <strong>async/await</strong> ve <strong>Web Workers</strong> ile sanki paralel çalışıyormuş gibi yapar. Tarayıcıda UI donmasını engellemek için olmazsa olmaz.
                </p>
                <CodeBlock>
                  {`# Python'da thread (basit)
import threading

def indir(url):
    print(f"{url} indiriliyor...")
    # ... indirme işlemi

t1 = threading.Thread(target=indir, args=("a.com",))
t2 = threading.Thread(target=indir, args=("b.com",))
t1.start()  # paralel başla
t2.start()
t1.join()   # bitmesini bekle
t2.join()`}
                </CodeBlock>
              </>
            }
            realLife="Chrome'da her sekme ayrı process/thread. Biri donarsa diğerleri etkilenmez. Video oyunları: render thread + ses thread + ağ thread + AI thread aynı anda çalışır."
            antiPattern="Thread = hızlandırma değil. Çok thread bazen yavaşlatır (thread yönetimi maliyeti). Yanlış kullanımı: race condition, deadlock. Yeni başlayanlar single-thread ile başlamalı."
          />

          {/* TERIM 12: GARBAGE COLLECTOR */}
          <TermBlock
            id="garbage-collector"
            icon={<Box className="w-6 h-6" />}
            color="emerald"
            name="Garbage Collector (Çöp Toplayıcı)"
            question="Kullanılmayan bellek ne zaman temizlenir?"
            analogy="Temizlik Görevlisi"
            analogyText={
              <>
                Bir <strong>kafeterya</strong> düşün. Müşteriler bırakır, masalar dolar. Ama bir <strong>temizlik görevlisi</strong> sürekli tur atar, boş bardakları alır, masayı siler. Eğer görevli olmasa kafeterya çöplüğe döner. İşte <strong>garbage collector</strong> da programdaki "temizlik görevlisi": artık kimsenin kullanmadığı belleği otomatik toplar.
              </>
            }
            explanation={
              <>
                <p>
                  Garbage collector (GC), programda <strong>kimsenin artık erişmediği objeleri</strong> bulur ve belleği serbest bırakır. Manuel temizlik derdi ortadan kalkar.
                </p>
                <p>
                  <strong>GC olan diller:</strong> Python, Java, JavaScript, C#, Go, Ruby. Programcı <code>malloc</code>/<code>free</code> ile uğraşmaz.
                </p>
                <p>
                  <strong>GC olmayan diller:</strong> C, C++ (Rust da otomatik ama farklı mekanizmayla). Belleği programcı yönetir. Yanlış yönetirsen: <strong>memory leak</strong> (sızıntı), <strong>use-after-free</strong> (serbest bırakılan belleğe erişim — güvenlik açığı).
                </p>
                <CodeBlock>
                  {`# Python'da GC otomatik
def fonk():
    a = [1, 2, 3, 4, 5]  # heap'te liste oluşur
    return a

sonuc = fonk()
# 'a' artık kimsenin erişemeyeceği yerde
# → GC tarafından toplanır (bir sonraki turda)

# Manuel bellek yönetimi (C örneği — Python'da yok)
# int* p = malloc(sizeof(int) * 100);
# ... kullan ...
# free(p);  // UNUTSAN memory leak

# Python'da bu dert yok. Ama GC pause (duraklaması) olabilir
# büyük objelerde. Performans kritikse C/C++/Rust tercih edilir.`}
                </CodeBlock>
              </>
            }
            realLife="Bir web uygulamasında sürekli kullanıcı verisi işlersen, GC olmadan bellek şişer ve sunucu çöker. GC sayesinde sunucu günlerce çalışabilir."
            antiPattern="GC = sıfır memory leak değildir. Döngüsel referans (a→b, b→a) bazı dillerde GC tarafından yakalanmaz. Bu durumda yine leak olur."
          />
        </section>

        {/* ════════════════════════════════════════════════════
            SEVIYE 5: PROGRAMCININ GÜNLÜK İŞLERİ
        ════════════════════════════════════════════════════ */}
        <section id="seviye-5" className="space-y-8 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 5</div>
            <h2 className="text-2xl md:text-3xl font-bold">Programcının günlük işleri</h2>
            <p className="text-white/60">
              Günlük hayatta sürekli duyacağın terimler. Bunları bilmek artık seni "yazılımcı gibi" konuşturur.
            </p>
          </header>

          {/* TERIM 13: API */}
          <TermBlock
            id="api"
            icon={<KeyRound className="w-6 h-6" />}
            color="rose"
            name="API (Uygulama Programlama Arayüzü)"
            question="Programlar birbiriyle nasıl konuşur?"
            analogy="Restoran Menüsü"
            analogyText={
              <>
                Bir <strong>restorandasın</strong>. Garsonla konuşursun, garson mutfağa (aşçıya) iletir, yemek gelir. Sen mutfağa girmezsin, aşçıyla doğrudan konuşmazsın. <strong>Menü</strong> = API. Neyi sipariş edebileceğini (fonksiyonları), nasıl söyleyeceğini (parametreleri), ne alacağını (dönüş değerini) gösterir.
              </>
            }
            explanation={
              <>
                <p>
                  API (Application Programming Interface), <strong>iki yazılımın birbiriyle konuşma kuralları</strong>. Bir program başka bir programa "şunu yap" der, API üzerinden yapar.
                </p>
                <CodeBlock>
                  {`# Bir API'yi çağırmak — örnek: hava durumu servisi
import requests

# OpenWeatherMap API'si
yanit = requests.get(
    "https://api.openweathermap.org/data/2.5/weather",
    params={"q": "Istanbul", "appid": "API_KEY"}
)

veri = yanit.json()
# {
#   "sicaklik": 18,
#   "nem": 65,
#   "sehir": "Istanbul"
# }

# API'yi sen çağırıyorsun (müşteri)
# OpenWeatherMap servisi yanıtlıyor (aşçı)
# Aradaki kurallar = API (menü)`}
                </CodeBlock>
                <p>
                  <strong>Web API</strong>, <strong>OS API</strong>, <strong>kütüphane API'si</strong> gibi türleri var. Hep aynı mantık: "şu komutu ver, şu sonucu al."
                </p>
              </>
            }
            realLife={"Telefonundaki hava durumu uygulaması bir API'den veri çeker. Google Maps üzerinden \"restoran bul\" dediğinde Google'ın Places API'si çalışır. Her yerde API var."}
            antiPattern={"API = sadece web demek değil. Bir Python fonksiyonu bile API'dir. API genel olarak \"bir yazılımın dışarıya açtığı arayüz\" demek. print(), input() bile Python'un API'si."}
          />

          {/* TERIM 14: DEBUG */}
          <TermBlock
            id="debug"
            icon={<AlertTriangle className="w-6 h-6" />}
            color="rose"
            name="Debug (Hata Ayıklama)"
            question="Hatalı kodu nasıl bulurum?"
            analogy="Dedektiflik"
            analogyText={
              <>
                Bir <strong>dedektif</strong> düşün. Olay yerinde iz sürer, şüphelileri sorgular, kanıt toplar, "cinayet nasıl işlendi?" sorusunu yanıtlar. <strong>Debug</strong> da aynısı: kodun neden yanlış çalıştığını bulmak için iz sürmek. Bug = böcek, ilk bilgisayar hatalarından biri gerçekten bir güvenin bilgisayara girmesinden geldiği için bu isim kalmış.
              </>
            }
            explanation={
              <>
                <p>
                  Debug (hata ayıklama), kodundaki hataları bulma ve düzeltme süreci. <strong>Bug</strong> = hata, <strong>debug</strong> = hatayı yakalama. Her programcının en çok zaman harcadığı iş.
                </p>
                <p>
                  Modern IDE'ler <strong>debugger</strong> (hata ayıklayıcı) içerir: kodunu satır satır çalıştırabilir, değişkenlerin o anki değerini görebilir, durma noktaları (breakpoint) koyabilirsin.
                </p>
                <CodeBlock>
                  {`# Bug'lı kod
def ortalama(sayilar):
    toplam = 0
    for s in sayilar:
        toplam = toplam + s
    return toplam / len(sayilar)  # ← sıfıra bölme hatası!

print(ortalama([]))
# ZeroDivisionError: division by zero

# Debug stratejileri:
# 1. print() ile ara değerleri yazdır
# 2. IDE debugger ile satır satır ilerle
# 3. Hata mesajını oku (Python genelde açık söyler)
# 4. Google'a hata mesajını yapıştır
# 5. Bir arkadaşına açıkla (rubber duck debugging — ördek)`}
                </CodeBlock>
              </>
            }
            realLife="Kod yazmanın %20'si yazma, %80'i debug. Profesyonel programcılar bile günde saatlerini debug'a harcar. Hata yapmak doğal, önemli olan sistematik şekilde bulmak."
            antiPattern="Debug = sadece hata düzeltmek değil. Bazen kod doğru çalışıyor ama yanlış sonuç veriyor (logic error). O zaman da debug gerekir — print bile yeterli olmaz, düşünmek gerekir."
          />
        </section>

        {/* ════════════════════════════════════════════════════
            SEVIYE 6: SOYUT KAVRAMLAR
        ════════════════════════════════════════════════════ */}
        <section id="seviye-6" className="space-y-8 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Seviye 6</div>
            <h2 className="text-2xl md:text-3xl font-bold">Soyut kavramlar</h2>
            <p className="text-white/60">
              Bunlar elle tutulmaz ama programcılık mülakatlarının, mühendislik konuşmalarının temel taşları. Anladıysan seviye atlamışsın demektir.
            </p>
          </header>

          {/* TERIM 15: VERI YAPISI */}
          <TermBlock
            id="data-structure"
            icon={<Database className="w-6 h-6" />}
            color="purple"
            name="Veri Yapısı (Data Structure)"
            question="Veriyi nasıl düzenleriz?"
            analogy="Dolap Düzeni"
            analogyText={
              <>
                Bir <strong>mutfak dolabı</strong> düşün. Tabaklar üst üste (stack), bardaklar yan yana (queue), çatal-bıçaklar çekmecede gruplanmış (dict), baharatlar sıralı (sorted list). Her eşya için en uygun düzen farklı. İşte <strong>veri yapısı</strong> da programda veriyi en verimli şekilde düzenleme biçimi.
              </>
            }
            explanation={
              <>
                <p>
                  Veri yapısı, verileri <strong>belirli bir düzende</strong> saklama ve erişme yöntemi. Her veri yapısının avantajı ve dezavantajı var: biri hızlı arama yapar, diğeri hızlı ekleme.
                </p>
                <p>
                  <strong>Temel veri yapıları:</strong>
                </p>
                <ul className="space-y-1.5 list-none">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" /><strong>List (dizi):</strong> sıralı erişim, yavaş arama, hızlı ekleme sona</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" /><strong>Dict (sözlük):</strong> anahtar-değer, çok hızlı arama</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" /><strong>Set (küme):</strong> tekrar yok, hızlı üyelik kontrolü</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" /><strong>Stack (yığın):</strong> LIFO, son giren ilk çıkar</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" /><strong>Queue (kuyruk):</strong> FIFO, ilk giren ilk çıkar</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" /><strong>Tree (ağaç):</strong> hiyerarşik, dosya sistemi, DOM</li>
                </ul>
                <CodeBlock>
                  {`# Python'da temel veri yapıları
liste = [1, 2, 3]           # list — sıralı, değiştirilebilir
sozluk = {"ad": "Ali", "yas": 30}  # dict — anahtar-değer
kume = {1, 2, 3}            # set — tekrar yok
demet = (1, 2)              # tuple — değiştirilemez liste

# Hangisini ne zaman?
# Sıralı veri → list
# Hızlı arama → dict
# Tekrarsız → set
# Değişmeyen sabit → tuple`}
                </CodeBlock>
              </>
            }
            realLife="Veritabanları aslında çok gelişmiş veri yapılarıdır (B-tree, hash table). Telefonundaki kişi listesi: ad-soyad ile arama (dict), alfabetik sıralama (sorted list)."
            antiPattern="Her şeyi list ile yapma. Doğru veri yapısı = performans farkı. 1M öğede arama: list O(n) = 1M adım, dict O(1) = 1 adım."
          />

          {/* TERIM 16: ALGORITMA */}
          <TermBlock
            id="algorithm"
            icon={<Brain className="w-6 h-6" />}
            color="purple"
            name="Algoritma (Algorithm)"
            question="Bir problemi nasıl çözeriz?"
            analogy="Yemek Tarifi (Adım Adım)"
            analogyText={
              <>
                Yine <strong>yemek tarifi</strong>. "Yemek yap" demek yetmez; adımlar olmalı: 1) soğanı doğra, 2) yağı koy, 3) soğanı kavur, 4) domatesi ekle, 5) tuz at, 6) 20 dk pişir. <strong>Algoritma</strong> da bir problemi çözmek için adım adım talimatlar dizisi.
              </>
            }
            explanation={
              <>
                <p>
                  Algoritma, bir problemi çözmek için <strong>sonlu, net, uygulanabilir adımlar dizisi</strong>. Her program bir algoritmadır ama her algoritma program değildir (tarifler, yön tarifleri de algoritmadır).
                </p>
                <p>
                  <strong>Algoritma analizi (Big-O):</strong> Bir algoritmanın ne kadar hızlı çalıştığını ölçer. Veri büyüdükçe performans nasıl değişir?
                </p>
                <ul className="space-y-1.5 list-none">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" /><strong>O(1):</strong> sabit süre — dizi[5]</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" /><strong>O(log n):</strong> logaritmik — binary search</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" /><strong>O(n):</strong> doğrusal — liste taraması</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" /><strong>O(n²):</strong> karesel — iç içe iki döngü</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" /><strong>O(2ⁿ):</strong> üstel — brute force recursion</li>
                </ul>
                <CodeBlock>
                  {`# Algoritma örneği: listede en büyük sayıyı bul
def en_buyuk(liste):
    en_b = liste[0]               # O(1)
    for sayi in liste:            # n kere döner
        if sayi > en_b:           # O(1)
            en_b = sayi
    return en_b

# Bu algoritma O(n) — 1M elemanlı listede 1M karşılaştırma
# Sıralı listede O(1) — son elemana bak yeter

# Algoritma = problemi çözme yöntemi
# Veri yapısı = veriyi saklama yöntemi
# İkisi el ele çalışır`}
                </CodeBlock>
              </>
            }
            realLife="Google Maps'te rota bulmak, en kısa yol algoritması (Dijkstra) kullanır. Netflix önerisi collaborative filtering algoritmasıdır. Hava durumu tahmini simülasyon algoritmasıdır."
            antiPattern="Algoritma = kod yazmak değil. Bir problemi kağıt üstünde, akış şemasıyla, sözde kodla (pseudocode) da çözebilirsin. Algoritma fikirdir, kod onun gerçekleştirmesidir."
          />
        </section>

        {/* ════════════════════════════════════════════════════
            SSS
        ════════════════════════════════════════════════════ */}
        <section id="sss" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">SSS</div>
            <h2 className="text-2xl md:text-3xl font-bold">Sıkça Sorulan Sorular</h2>
          </header>

          <div className="space-y-3">
            <FaqItem
              q="Binary ile makine kodu aynı şey mi?"
              a="Hayır. Binary bir sayma yöntemi (0 ve 1); makine kodu bilgisayarın anladığı komutlar. Makine kodu binary ile yazılır ama tüm binary'ler makine kodu değildir. Bir fotoğraf da binary olarak saklanır ama makine kodu değildir."
            />
            <FaqItem
              q="Python yorumlayıcı mı derleyici mi?"
              a="Python yorumlayıcı (interpreter) kullanır — kodu satır satır çalıştırır. C, C++, Rust gibi diller ise derlenir — kod tamamen makine koduna çevrilir, sonra çalışır. Java ve C# ikisinin arasında: önce bytecode'a derlenir, sonra JVM/.NET üzerinde yorumlanır."
            />
            <FaqItem
              q="IDE ile metin editörü arasındaki fark nedir?"
              a="Metin editörü sadece yazı yazarsın (VS Code, Notepad++, Sublime). IDE ise yazma + çalıştırma + hata ayıklama + test etme + versiyon kontrol hepsi tek programda. Yeni başlayanlar için VS Code yeterli; ileri seviyede PyCharm / IntelliJ gibi tam IDE'lere geçilebilir."
            />
            <FaqItem
              q="Stack ve heap bellek ne demek?"
              a="Stack, küçük ve düzenli bellek alanıdır (yerel değişkenler, fonksiyon çağrıları, LIFO). Heap, büyük ve esnek alan (büyük objeler, diziler). Stack hızlıdır, heap yavaş ama geniş. Programcı doğrudan yönetmez ama hata ayıklamada bilmek işe yarar."
            />
            <FaqItem
              q="Programlamaya yeni başlayan biri hangi terimleri önce öğrenmeli?"
              a="Şu sırayla: 1) Source code (kaynak kodu) → 2) Syntax (sözdizimi) → 3) IDE → 4) Interpreter/Derleyici → 5) Runtime → 6) Memory (Stack/Heap) → 7) Debug → 8) Veri yapısı → 9) Algoritma. Bu sırayla öğrenirsen her terim bir sonrakine zemin hazırlar."
            />
            <FaqItem
              q="Garbage collector ne işe yarar?"
              a="Kullanılmayan belleği otomatik temizler. Python, Java, JavaScript'te var. C, C++'ta yok (programcı yönetir). Avantajı: programcı rahatlar, memory leak riski azalır. Dezavantajı: ara sıra duraklama yaratır (GC pause)."
            />
            <FaqItem
              q="Thread ve process arasındaki fark nedir?"
              a="Process = bağımsız çalışan program (kendi bellek alanı var). Thread = bir process içinde paralel çalışan iş parçacığı (aynı belleği paylaşır). Chrome'da her sekme ayrı process; bir sekmedeki sekmeler (tab) thread olabilir. Process ağır, thread hafif."
            />
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            SONUÇ
        ════════════════════════════════════════════════════ */}
        <section id="sonuc" className="space-y-6 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Sonuç</div>
            <h2 className="text-2xl md:text-3xl font-bold">Hangi terimi ne zaman öğrenmeli?</h2>
          </header>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-6 space-y-4">
            <h3 className="text-lg font-bold text-emerald-300">Sana özel 30 günlük plan</h3>
            <p className="text-white/80">
              Hepsini aynı anda öğrenmeye çalışma. Aşağıdaki sırayla git, her hafta 1-2 kavram:
            </p>
            <ol className="space-y-2 list-decimal list-inside text-white/80">
              <li><strong>Hafta 1:</strong> Source code, syntax, IDE — temel araç seti</li>
              <li><strong>Hafta 2:</strong> Interpreter vs derleyici, runtime — nasıl çalışır</li>
              <li><strong>Hafta 3:</strong> Memory, stack/heap — veri nereye gidiyor</li>
              <li><strong>Hafta 4:</strong> Debug, API — günlük programcı işleri</li>
              <li><strong>Hafta 5+:</strong> Thread, garbage collector, veri yapısı, algoritma — ileri konular</li>
            </ol>
            <p className="text-white/70 text-sm pt-2">
              Bu terimleri gerçek projelerde kullanırken öğrenmek en iyisi. <Link href="/blog/sifirdan-zirveye" className="text-amber-300 hover:underline">Sıfırdan Zirveye</Link> yazımızla başlayabilir, sonra <Link href="/interviews/programlama-temelleri" className="text-amber-300 hover:underline">Programlama Temelleri sorularıyla</Link> pratik yapabilirsin.
            </p>
          </div>
        </section>

        {/* ── İlgili Yazılar ────────────────────────────────── */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">İlgili Yazılar</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/blog/sifirdan-zirveye" className="group p-4 rounded-xl border border-white/10 hover:border-amber-500/30 transition-colors">
              <div className="text-sm font-semibold mb-1 group-hover:text-amber-300 transition-colors">Sıfırdan Zirveye: 30 Dakikada Programlama</div>
              <div className="text-xs text-white/60">8 bölüm, interaktif Pyodide editörü, kilit-aç sistemi.</div>
            </Link>
            <Link href="/blog/programlama-temelleri" className="group p-4 rounded-xl border border-white/10 hover:border-amber-500/30 transition-colors">
              <div className="text-sm font-semibold mb-1 group-hover:text-amber-300 transition-colors">Programlama Temelleri Nedir?</div>
              <div className="text-xs text-white/60">if/else, for, while — 5 somut örnek, akış şeması, FAQ.</div>
            </Link>
            <Link href="/blog/algoritma-nedir" className="group p-4 rounded-xl border border-white/10 hover:border-amber-500/30 transition-colors">
              <div className="text-sm font-semibold mb-1 group-hover:text-amber-300 transition-colors">Algoritma Nedir?</div>
              <div className="text-xs text-white/60">Sandviçten kodlamaya bir yolculuk — günlük hayattan algoritmalar.</div>
            </Link>
            <Link href="/interviews" className="group p-4 rounded-xl border border-white/10 hover:border-amber-500/30 transition-colors">
              <div className="text-sm font-semibold mb-1 group-hover:text-amber-300 transition-colors">Mülakat Soruları</div>
              <div className="text-xs text-white/60">7 kategori, 98 soru — terimleri pratiğe dök.</div>
            </Link>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.05] to-transparent p-8 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">Terimleri öğrendin, şimdi pratiğe dök</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Tarayıcıda Python ve JavaScript yaz, anlık sonuç al. AI destekli geri bildirim ile her soruda yeni bir şey öğren.
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
              href="/python-online"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/15 transition-colors"
            >
              <Terminal className="w-4 h-4" />
              Online Compiler
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

function TermBlock({
  id, icon, color, name, question, analogy, analogyText, explanation, realLife, antiPattern,
}: {
  id: string;
  icon: React.ReactNode;
  color: "amber" | "cyan" | "indigo" | "emerald" | "rose" | "purple";
  name: string;
  question: string;
  analogy: string;
  analogyText: React.ReactNode;
  explanation: React.ReactNode;
  realLife: string;
  antiPattern: string;
}) {
  const colorMap = {
    amber: "border-amber-500/30 bg-amber-500/[0.03] text-amber-300",
    cyan: "border-cyan-500/30 bg-cyan-500/[0.03] text-cyan-300",
    indigo: "border-indigo-500/30 bg-indigo-500/[0.03] text-indigo-300",
    emerald: "border-emerald-500/30 bg-emerald-500/[0.03] text-emerald-300",
    rose: "border-rose-500/30 bg-rose-500/[0.03] text-rose-300",
    purple: "border-purple-500/30 bg-purple-500/[0.03] text-purple-300",
  };
  return (
    <article id={id} className={`rounded-2xl border ${colorMap[color].split(" ")[0]} ${colorMap[color].split(" ")[1]} p-6 space-y-4 scroll-mt-20`}>
      <header className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color].split(" ")[2]} bg-white/5`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-bold text-white">{name}</h3>
          <p className="text-sm text-white/60 mt-1">{question}</p>
        </div>
      </header>

      {/* Benzetme kutusu */}
      <div className="rounded-xl bg-[#0a0e1a] border border-white/10 p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
          <Lightbulb className="w-4 h-4" />
          Benzetme: {analogy}
        </div>
        <div className="text-sm text-white/80 leading-relaxed">{analogyText}</div>
      </div>

      <div className="space-y-3 text-white/80 leading-relaxed">
        {explanation}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg bg-[#0a0e1a] border border-white/10 p-3">
          <div className="text-emerald-300 font-bold mb-1">Gerçek hayatta nerede?</div>
          <div className="text-white/70">{realLife}</div>
        </div>
        <div className="rounded-lg bg-[#0a0e1a] border border-white/10 p-3">
          <div className="text-rose-300 font-bold mb-1">Sık yapılan hata</div>
          <div className="text-white/70">{antiPattern}</div>
        </div>
      </div>
    </article>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="rounded-lg bg-[#0a0e1a] border border-white/10 p-4 overflow-x-auto text-xs leading-relaxed">
      <code className="text-white/90 font-mono">{children}</code>
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
