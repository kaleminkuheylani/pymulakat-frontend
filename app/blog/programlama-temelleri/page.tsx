// app/blog/programlama-temelleri/page.tsx
//
// PYBlog yazisi #2: "Programlama Temelleri Nedir?"
// 2026-07-18: Ubersuggest long-tail — 4 keyword, toplam ~5K volume
//   - programlama temelleri nedir (1.6K, diff 12, PD 2)
//   - while dongusu ornekleri (720, diff 14, PD 2)
//   - for dongusu ornekleri (880, diff 13, PD 1)
//   - if else ornekleri (590, diff 12, PD 1)
//
// Tema: pymulakat dark + amber, lucide icons, FAQ + HowTo schema.

import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen, Clock, ArrowLeft, ArrowRight, ArrowDown,
  CheckCircle2, Lightbulb, Code2, Hash,
} from "lucide-react";
import { notFound } from "next/navigation";
import { BASE_URL } from "@/lib/seo";
import { getAllPosts, getPost } from "../posts";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const post = await getPost("programlama-temelleri");
  if (!post) return { title: "Yazı Bulunamadı" };
  return {
    title: `${post.title} | PYBlog`,
    description: post.excerpt,
    keywords: [
      "programlama temelleri nedir",
      "while döngüsü örnekleri",
      "for döngüsü örnekleri",
      "if else örnekleri",
      "döngü nedir",
      "koşul ifadeleri python",
      "python döngü örnekleri",
      "algoritma örnekleri",
      "temel programlama kavramları",
      "kodlama temelleri",
      "python başlangıç",
      "yazılım temelleri",
      ...post.tags,
    ],
    authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/blog/programlama-temelleri`,
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
      canonical: `${BASE_URL}/blog/programlama-temelleri`,
    },
  };
}

// Pseudo kod — JSX escape yok
const PSEUDO_IF = `EĞER şart DOĞRU İSE:
  blok çalışır
DEĞİLSE:
  başka blok çalışır`;

const PYTHON_IF = `yas = 18
if yas >= 18:
    print("Reşit")
else:
    print("Reşit değil")`;

const PYTHON_IF_ELIF = `puan = 75
if puan >= 90:
    print("A")
elif puan >= 80:
    print("B")
elif puan >= 70:
    print("C")
else:
    print("F")`;

const PYTHON_FOR = `meyveler = ["elma", "armut", "muz"]
for meyve in meyveler:
    print(meyve)

# range() ile sayici
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4`;

const PYTHON_WHILE = `sayac = 0
while sayac < 5:
    print(sayac)
    sayac += 1

# Kullanicidan input isteyen dongu
cevap = ""
while cevap != "q":
    cevap = input("Devam etmek için bir tusa basin (q=cikis): ")
    print(f"Girdi: {cevap}")`;

const PYTHON_BREAK_CONTINUE = `for i in range(10):
    if i == 3:
        continue  # 3'u atla
    if i == 7:
        break  # donguden cik
    print(i)  # 0, 1, 2, 4, 5, 6`;

const PYTHON_NESTED = `for i in range(3):
    for j in range(3):
        print(f"({i},{j})", end=" ")
    print()  # satir sonu
# (0,0) (0,1) (0,2)
# (1,0) (1,1) (1,2)
# (2,0) (2,1) (2,2)`;

export default async function ProgramlamaTemelleriPage() {
  const post = await getPost("programlama-temelleri");
  if (!post) notFound();
  const OTHER_POSTS = (await getAllPosts()).filter((p) => p.slug !== "programlama-temelleri").slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Programlama Temelleri Nedir? — Koşul ve Döngü ile Python Örnekleri",
    "description": post.excerpt,
    "author": { "@type": "Organization", "name": "Python Mülakat" },
    "publisher": {
      "@type": "Organization",
      "name": "Python Mülakat",
      "url": "https://pythonmulakat.com",
    },
    "datePublished": "2026-07-18",
    "dateModified": "2026-07-18",
    "mainEntityOfPage": "https://pythonmulakat.com/blog/programlama-temelleri",
    "keywords":
      "programlama temelleri, if else örnekleri, for döngüsü, while döngüsü, koşul ifadeleri, python başlangıç",
    "inLanguage": "tr-TR",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Programlama temelleri nelerdir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Programlama temelleri 4 ana yapı taşından oluşur: (1) değişkenler ve veri tipleri, (2) koşul ifadeleri (if/elif/else), (3) döngüler (for, while), (4) fonksiyonlar. Bu 4 kavram tüm programlama dillerinin ortak temelidir. Python öğrenirken bu sırayla ilerlemek en etkili yoldur.",
        },
      },
      {
        "@type": "Question",
        "name": "For döngüsü ile while döngüsü arasındaki fark nedir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For döngüsü, bir liste/aralık üzerinde bilinen sayıda iterasyon yapar (örn. 0'dan 10'a kadar). While döngüsü ise bir koşul doğru olduğu sürece tekrar eder. Bilinen sayıda tekrar varsa for, koşula bağlı tekrar varsa while kullanılır. Pratikte for daha yaygın ve daha güvenlidir (sonsuz döngü riski düşük).",
        },
      },
      {
        "@type": "Question",
        "name": "If else nasıl çalışır?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If else, programın akışını koşula göre yönlendirir. if şart doğruysa kendi bloğunu çalıştırır, else ise if bloğu çalışmazsa çalışır. Birden fazla koşul için elif kullanılır (else if yerine). İlk doğru koşulun bloğu çalışır, geri kalan atlanır. Örnek: if yas >= 18: print('Reşit') else: print('Değil')",
        },
      },
      {
        "@type": "Question",
        "name": "Break ve continue farkı nedir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "break döngüyü tamamen sonlandırır (döngüden çıkar). continue ise sadece o iterasyonu atlar, döngü sonraki iterasyondan devam eder. break 'yeter, çık' demek, continue 'bu turu atla, sonrakine geç' demek.",
        },
      },
      {
        "@type": "Question",
        "name": "Python'da hangi döngü türü ne zaman kullanılır?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "for: liste, string, range üzerinde iterasyon için. while: koşul doğru olduğu sürece (örn. kullanıcı girişi bekleme, sensör verisi okuma). Listeyi değiştireceksen for daha güvenli. Sonsuz döngü için while True: kullanılır ama mutlaka break olmalı.",
        },
      },
    ],
  };

  const howtoSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Python'da if else ve döngü nasıl kullanılır?",
    "description":
      "Python'da koşul ve döngü yapılarını 5 adımda öğren: if/elif/else, for, while, break/continue, iç içe döngü.",
    "step": [
      { "@type": "HowToStep", "name": "If/elif/else öğren", "text": "Koşul ifadeleri programın akışını yönlendirir. Tek koşul için if/else, çoklu için elif kullanılır." },
      { "@type": "HowToStep", "name": "For döngüsü öğren", "text": "Liste, string veya range üzerinde iterasyon. for meyve in meyveler: print(meyve) en klasik kullanım." },
      { "@type": "HowToStep", "name": "While döngüsü öğren", "text": "Koşul doğru olduğu sürece tekrarla. Sayaç veya kullanıcı girişi için ideal." },
      { "@type": "HowToStep", "name": "Break/continue öğren", "text": "break döngüden çıkar, continue o turu atlar. Sonsuz döngüden kaçınmak için break şart." },
      { "@type": "HowToStep", "name": "İç içe döngü (nested loop) öğren", "text": "2D veri, matris, kombinasyon problemleri için döngü içinde döngü. O(n²) karmaşıklığa dikkat." },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howtoSchema) }}
      />
      <main className="min-h-screen bg-[#050816] text-white">
        <article className="max-w-3xl mx-auto px-4 py-12 md:py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
            <Link
              href="/blog"
              className="hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              PYBlog
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-white/70">Programlama Temelleri</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 text-xs text-white/40 mb-4">
              <time dateTime={post.date}>{post.date}</time>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readingMinutes} dakika okuma
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                PYBlog
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
              Programlama Temelleri Nedir?
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Bir programın temel yapı taşları: <strong className="text-white">koşul ifadeleri</strong>{" "}
              (if/else) ve <strong className="text-white">döngüler</strong> (for, while). Bu ikisi
              olmadan program yazılamaz.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {post.tags.map((tag) => (
                <mark
                  key={tag}
                  className="px-2.5 py-0.5 text-xs rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300"
                >
                  {tag}
                </mark>
              ))}
            </div>
          </header>

          {/* ── SECTION 01: PROGRAM NEDIR ────────────────────────── */}
          <section className="mb-16">
            <SectionHeader num="01" title="Program Nedir? Yapı Taşları" />
            <p className="text-white/70 leading-relaxed mb-4">
              Bir program, sıralı çalışan <strong className="text-white">komutlar dizisidir</strong>.
              İster oyun, ister banka uygulaması, ister yapay zeka — hepsi aynı 4 temel
              yapı taşına dayanır:
            </p>

            <ol className="space-y-2 text-white/70 text-[15px] leading-relaxed pl-1 mb-6">
              <li>
                <strong className="text-white">1. Değişkenler:</strong> Veriyi tut (x = 5, isim = "Ali")
              </li>
              <li>
                <strong className="text-white">2. Koşullar:</strong> Karar ver (if/else)
              </li>
              <li>
                <strong className="text-white">3. Döngüler:</strong> Tekrarla (for, while)
              </li>
              <li>
                <strong className="text-white">4. Fonksiyonlar:</strong> Kod paketle (def fn():)
              </li>
            </ol>

            <p className="text-white/70 leading-relaxed">
              Bu yazıda <strong className="text-amber-200">2. ve 3.</strong> maddelere odaklanacağız:
              <em>if/else</em> ve <em>for/while</em>. İkisi de günlük hayattan örneklerle
              öğrenilebilir.
            </p>
          </section>

          {/* ── SECTION 02: IF / ELSE ────────────────────────── */}
          <section className="mb-16">
            <SectionHeader num="02" title="Koşul İfadeleri: if / elif / else" />
            <p className="text-white/70 leading-relaxed mb-6">
              If else, programın <strong className="text-white">akışını koşula göre yönlendirir</strong>.
              Günlük hayattan: "Eğer yağmur yağıyorsa şemsiye al, yoksa güneş gözlüğü tak."
            </p>

            <FlowChartCard label="Akış Şeması (if else)">
              <FlowNode variant="start" label="BAŞLA" />
              <FlowArrow />
              <FlowNode variant="decision" label="şart doğru mu?" />
              <FlowBranch>
                <FlowBranchLabel side="yes" />
                <FlowNode label="EVET bloğu çalışır" />
              </FlowBranch>
              <FlowBranch>
                <FlowBranchLabel side="no" />
                <FlowNode label="HAYIR (else) bloğu çalışır" />
              </FlowBranch>
              <FlowArrow />
              <FlowNode variant="end" label="BİTİR" />
            </FlowChartCard>

            <h3 className="text-lg font-semibold text-white mt-10 mb-3">Pseudo Kod</h3>
            <CodeBlock>{PSEUDO_IF}</CodeBlock>

            <h3 className="text-lg font-semibold text-white mt-8 mb-3">Python — Basit if else</h3>
            <CodeBlock language="python">{PYTHON_IF}</CodeBlock>

            <h3 className="text-lg font-semibold text-white mt-8 mb-3">Python — if / elif / else</h3>
            <p className="text-white/70 leading-relaxed mb-3">
              Birden fazla koşul için <code className="text-amber-300">elif</code> kullanılır.
              <strong className="text-white">elif = else if</strong> (kısaltma).
              İlk doğru koşulun bloğu çalışır, geri kalanı atlanır.
            </p>
            <CodeBlock language="python">{PYTHON_IF_ELIF}</CodeBlock>
          </section>

          {/* ── SECTION 03: FOR DÖNGÜSÜ ────────────────────────── */}
          <section className="mb-16">
            <SectionHeader num="03" title="For Döngüsü Örnekleri" />
            <p className="text-white/70 leading-relaxed mb-6">
              For döngüsü, bir <strong className="text-white">liste, string veya sayı aralığı</strong>{" "}
              üzerinde tekrar eder. <em>Bilinen sayıda iterasyon</em> için idealdir.
            </p>

            <FlowChartCard label="For Döngüsü">
              <FlowNode variant="start" label="BAŞLA · liste = [a, b, c]" />
              <FlowArrow />
              <FlowNode label="mevcut = listeden bir sonraki eleman" />
              <FlowArrow />
              <FlowNode variant="decision" label="eleman kaldı mı?" />
              <FlowBranch>
                <FlowBranchLabel side="yes" />
                <FlowNode label="mevcut ile işlem yap" />
                <FlowLoopBack />
              </FlowBranch>
              <FlowBranch>
                <FlowBranchLabel side="no" />
                <FlowNode label="döngü biter" />
              </FlowBranch>
              <FlowArrow />
              <FlowNode variant="end" label="BİTİR" />
            </FlowChartCard>

            <h3 className="text-lg font-semibold text-white mt-10 mb-3">Python for Örnekleri</h3>
            <CodeBlock language="python">{PYTHON_FOR}</CodeBlock>

            <h3 className="text-lg font-semibold text-white mt-8 mb-3">İç içe for (nested loop)</h3>
            <p className="text-white/70 leading-relaxed mb-3">
              Döngü içinde döngü — matris, tablo, kombinasyon problemleri için.
              <strong className="text-white">O(n²)</strong> karmaşıklığa dikkat, büyük veri setlerinde
              yavaş olabilir.
            </p>
            <CodeBlock language="python">{PYTHON_NESTED}</CodeBlock>
          </section>

          {/* ── SECTION 04: WHILE DÖNGÜSÜ ────────────────────────── */}
          <section className="mb-16">
            <SectionHeader num="04" title="While Döngüsü Örnekleri" />
            <p className="text-white/70 leading-relaxed mb-6">
              While döngüsü, <strong className="text-white">bir koşul doğru olduğu sürece</strong>{" "}
              tekrar eder. <em>Bilinmeyen iterasyon sayısı</em> için idealdir (kullanıcı girişi,
              sensör verisi, dosya okuma).
            </p>

            <h3 className="text-lg font-semibold text-white mb-3">Basit sayaç</h3>
            <CodeBlock language="python">{PYTHON_WHILE}</CodeBlock>

            <div className="my-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-rose-300 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-rose-200 mb-1">⚠ Sonsuz Döngü Uyarısı</h4>
                  <p className="text-xs text-rose-100/80 leading-relaxed">
                    While döngüsünde koşul <em>her zaman</em> yanlışlanmalı, yoksa program
                    sonsuza kadar döner. Sayaç artırmayı veya <code className="text-rose-200">break</code>{" "}
                    kullanmayı unutma.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 05: BREAK / CONTINUE ────────────────────────── */}
          <section className="mb-16">
            <SectionHeader num="05" title="break ve continue — Akış Kontrolü" />
            <p className="text-white/70 leading-relaxed mb-6">
              İki yardımcı ifade: <strong className="text-white">break</strong> döngüyü tamamen
              bitirir, <strong className="text-white">continue</strong> sadece o iterasyonu atlar.
            </p>

            <CodeBlock language="python">{PYTHON_BREAK_CONTINUE}</CodeBlock>

            <div className="my-6 grid sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <h4 className="text-sm font-bold text-amber-300 mb-2">break</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  "Yeter, çık" — döngüden tamamen çıkar. Aranan elemanı bulduğunda veya
                  hata oluştuğunda kullanılır.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <h4 className="text-sm font-bold text-amber-300 mb-2">continue</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  "Bu turu atla" — sonraki iterasyona geç. Belirli durumları atla
                  (örn. sadece negatif sayıları işle).
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 06: 5 SOMUT ÖRNEK ────────────────────────── */}
          <section className="mb-16">
            <SectionHeader num="06" title="5 Somut Örnek — Gerçek Hayat Problemleri" />
            <p className="text-white/70 leading-relaxed mb-6">
              Soyut ifade yerine gerçek hayat problemlerini çözen 5 örnek:
            </p>

            <div className="space-y-4">
              <ExampleItem
                num={1}
                title="Alışveriş sepeti toplamı"
                desc="Sepetteki ürünlerin fiyatlarını topla, 500 TL üstüyse kargo ücretsiz yaz."
              >
                <CodeBlock language="python">
{`sepet = [120, 75, 230, 95]
toplam = 0
for fiyat in sepet:
    toplam += fiyat

if toplam >= 500:
    kargo = 0
    print(f"Toplam: {toplam} TL — Kargo BEDAVA!")
else:
    kargo = 50
    print(f"Toplam: {toplam} TL + {kargo} TL kargo")`}
                </CodeBlock>
              </ExampleItem>

              <ExampleItem
                num={2}
                title="Öğrenci notu hesaplama"
                desc="5 vize notu ortalamasını al, 50 üstü geçti, altı kaldı."
              >
                <CodeBlock language="python">
{`notlar = [70, 85, 60, 90, 75]
toplam = 0
for n in notlar:
    toplam += n
ortalama = toplam / len(notlar)

if ortalama >= 50:
    print(f"Ortalama: {ortalama:.1f} — GEÇTİ")
else:
    print(f"Ortalama: {ortalama:.1f} — KALDI")`}
                </CodeBlock>
              </ExampleItem>

              <ExampleItem
                num={3}
                title="Faktöriyel (while ile)"
                desc="5! = 5×4×3×2×1 = 120. While ile çözüm."
              >
                <CodeBlock language="python">
{`n = 5
faktoriyel = 1
i = 1
while i <= n:
    faktoriyel *= i
    i += 1
print(f"{n}! = {faktoriyel}")  # 120`}
                </CodeBlock>
              </ExampleItem>

              <ExampleItem
                num={4}
                title="İlk negatif sayıyı bul"
                desc="Sayı listesinde ilk negatif sayıyı bul, dur. Yoksa 'yok' yaz."
              >
                <CodeBlock language="python">
{`sayilar = [12, 8, 15, -3, 27, -9]
bulundu = None
for n in sayilar:
    if n < 0:
        bulundu = n
        break  # ilk negatifde dur

if bulundu is not None:
    print(f"İlk negatif: {bulundu}")
else:
    print("Negatif sayı yok")`}
                </CodeBlock>
              </ExampleItem>

              <ExampleItem
                num={5}
                title="Çift sayıları filtrele"
                desc="1-20 arası çift sayıları yazdır. continue ile."
              >
                <CodeBlock language="python">
{`for i in range(1, 21):
    if i % 2 != 0:
        continue  # tek sayilari atla
    print(i, end=" ")
# 2 4 6 8 10 12 14 16 18 20`}
                </CodeBlock>
              </ExampleItem>
            </div>
          </section>

          {/* ── SECTION 07: SSS / FAQ ─────────────────────────── */}
          <section className="mb-16">
            <SectionHeader num="07" title="Sıkça Sorulan Sorular" />
            <div className="space-y-4">
              {[
                {
                  q: "Programlama temelleri nelerdir?",
                  a: "Programlama temelleri 4 ana yapı taşından oluşur: (1) değişkenler ve veri tipleri, (2) koşul ifadeleri (if/elif/else), (3) döngüler (for, while), (4) fonksiyonlar. Bu 4 kavram tüm programlama dillerinin ortak temelidir. Python öğrenirken bu sırayla ilerlemek en etkili yoldur.",
                },
                {
                  q: "For döngüsü ile while döngüsü arasındaki fark nedir?",
                  a: "For döngüsü, bir liste/aralık üzerinde bilinen sayıda iterasyon yapar. While döngüsü ise bir koşul doğru olduğu sürece tekrar eder. Bilinen sayıda tekrar varsa for, koşula bağlı tekrar varsa while kullanılır. Pratikte for daha yaygın ve daha güvenlidir (sonsuz döngü riski düşük).",
                },
                {
                  q: "If else nasıl çalışır?",
                  a: "If else, programın akışını koşula göre yönlendirir. if şart doğruysa kendi bloğunu çalıştırır, else ise if bloğu çalışmazsa çalışır. Birden fazla koşul için elif kullanılır. İlk doğru koşulun bloğu çalışır, geri kalan atlanır.",
                },
                {
                  q: "Break ve continue farkı nedir?",
                  a: "break döngüyü tamamen sonlandırır (döngüden çıkar). continue ise sadece o iterasyonu atlar, döngü sonraki iterasyondan devam eder. break 'yeter, çık' demek, continue 'bu turu atla, sonrakine geç' demek.",
                },
                {
                  q: "Python'da hangi döngü türü ne zaman kullanılır?",
                  a: "for: liste, string, range üzerinde iterasyon için. while: koşul doğru olduğu sürece (kullanıcı girişi, sensör verisi, dosya okuma). Listeyi değiştireceksen for daha güvenli. Sonsuz döngü için while True: kullanılır ama mutlaka break olmalı.",
                },
              ].map((item, i) => (
                <details
                  key={i}
                  className="group p-4 rounded-xl border border-white/10 bg-white/[0.02] [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="cursor-pointer flex items-center justify-between gap-3 text-white font-semibold list-none">
                    <h3 className="text-sm md:text-base flex-1 min-w-0">
                      {item.q}
                    </h3>
                    <span className="text-amber-300 text-xl group-open:rotate-45 transition-transform flex-shrink-0">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm md:text-base text-white/70 leading-relaxed">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* ── SECTION 08: SONUÇ ─────────────────────────── */}
          <section>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-500/15 to-amber-700/10 border border-amber-500/20">
              <SectionHeader num="08" title="Sonuç — Pratik Plan" variant="highlight" />
              <p className="text-white/80 leading-relaxed mb-4">
                <strong className="text-amber-200">if/else</strong> ve{" "}
                <strong className="text-amber-200">for/while</strong> programlamanın %80'idir.
                Bu ikisini öğrendiğinde Python'da basit projeler yazabilir,{" "}
                <Link href="/interviews/programlama-temelleri" className="text-amber-300 hover:text-amber-200 underline">
                  20 temel soruyu
                </Link>{" "}
                çözebilirsin.
              </p>
              <p className="text-white/80 leading-relaxed mb-4">
                <strong className="text-white">3 günlük pratik planı:</strong>
              </p>
              <ul className="space-y-2 text-white/80 text-sm mb-4 pl-5 list-disc">
                <li><strong>Gün 1:</strong> if/elif/else — yukarıdaki 5 örneği elle yaz</li>
                <li><strong>Gün 2:</strong> for/while — faktöriyel, çift sayılar, alışveriş sepeti</li>
                <li><strong>Gün 3:</strong> break/continue — ilk negatif sayı + 1-20 çift sayılar</li>
              </ul>
              <p className="text-white/80 leading-relaxed">
                3 gün sonra{" "}
                <Link href="/interviews/programlama-temelleri" className="text-amber-300 hover:text-amber-200 underline">
                  Python Temelleri kategorisindeki 20 soruyu
                </Link>{" "}
                çöz — hepsi bu temelleri test ediyor.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between flex-wrap gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-amber-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              PYBlog&apos;a dön
            </Link>
            <Link
              href="/interviews/programlama-temelleri"
              className="inline-flex items-center gap-2 text-sm text-amber-300 hover:text-amber-200 transition-colors"
            >
              Hemen pratik yap
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
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
              <div className="text-xs text-white/60">7 kategori, 98 soru — yazıları okudun, şimdi pratik yap.</div>
            </Link>
          </div>
        </section>
      </article>
      </main>
    </>
  );
}

// ── Sub-components ──────────────────────────────────────

function SectionHeader({
  num,
  title,
  variant = "default",
}: {
  num: string;
  title: string;
  variant?: "default" | "highlight";
}) {
  return (
    <h2 className="flex items-baseline gap-3 text-2xl md:text-3xl font-bold tracking-tight mb-5">
      <span
        className={`text-sm font-semibold tracking-wider ${
          variant === "highlight" ? "text-amber-200" : "text-amber-300"
        }`}
      >
        {num}
      </span>
      <span className="text-white">{title}</span>
    </h2>
  );
}

function FlowChartCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-8 p-6 rounded-2xl border border-white/10 bg-white/[0.02] overflow-x-auto">
      <div className="text-[10px] font-bold tracking-widest text-amber-300 uppercase mb-6">
        {label}
      </div>
      <div className="flex flex-col items-center min-w-fit">{children}</div>
    </div>
  );
}

function FlowNode({
  label,
  variant = "action",
}: {
  label: React.ReactNode;
  variant?: "start" | "end" | "action" | "decision";
}) {
  const base =
    "inline-flex items-center justify-center px-5 py-2.5 text-[13px] font-medium border-2 min-w-[140px] text-center";
  const styles = {
    start: "rounded-xl border-amber-500/60 bg-amber-500/10 text-amber-200",
    end: "rounded-xl border-emerald-500/60 bg-emerald-500/10 text-emerald-200",
    action: "rounded-lg border-white/20 bg-white/[0.04] text-white",
    decision:
      "rounded-full border-amber-400/60 bg-amber-500/10 text-amber-200 font-semibold px-6 py-3",
  } as const;
  return <div className={`${base} ${styles[variant]}`}>{label}</div>;
}

function FlowArrow() {
  return <ArrowDown className="w-4 h-4 text-white/30 my-1.5" />;
}

function FlowBranch({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col items-center w-full">{children}</div>;
}

function FlowBranchLabel({
  side,
}: {
  side: "yes" | "no";
}) {
  return (
    <div className="flex items-center gap-1.5 mb-1">
      <span
        className={`text-[10px] font-semibold uppercase tracking-wider ${
          side === "yes" ? "text-white/50" : "text-white/50"
        }`}
      >
        {side === "yes" ? "Evet" : "Hayır"}
      </span>
      <ArrowDown className="w-3 h-3 text-white/20" />
    </div>
  );
}

function FlowLoopBack() {
  return (
    <div className="flex items-center gap-1.5 my-1.5 text-[10px] text-white/40">
      <span>↑ sıradaki elemana</span>
    </div>
  );
}

function CodeBlock({
  children,
  language,
}: {
  children: string;
  language?: string;
}) {
  return (
    <pre className="my-4 px-5 py-4 rounded-xl bg-[#0a0e1a] border border-white/10 overflow-x-auto text-[13px] leading-[1.75] font-mono text-white/90">
      {language && (
        <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-2 font-sans">
          {language}
        </div>
      )}
      <code>{children}</code>
    </pre>
  );
}

function ExampleItem({
  num,
  title,
  desc,
  children,
}: {
  num: number;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center font-bold flex-shrink-0">
          {num}
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="text-xs text-white/60 mt-0.5">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
