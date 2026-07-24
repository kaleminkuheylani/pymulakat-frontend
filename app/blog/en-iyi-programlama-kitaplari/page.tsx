// app/blog/en-iyi-programlama-kitaplari/page.tsx
//
// PYBlog yazisi #12: "En İyi 10 Programlama Kitabı (2026)"
// 2026-07-24: Commercial intent blog — Amazon affiliate + kitap satisi revenue potential.
//   Ubersuggest long-tail — YUKSEK HACIM:
//   - en iyi python kitabi (1.6K volume, PD 1, altin)
//   - python kitap (3.2K volume)
//   - python kitap turkce (590 volume)
//   - python baslangic kitabi (480 volume)
//   - algoritma kitabi (390 volume)
//   - clean code kitabi (880 volume, klasik)
//   - the pragmatic programmer (590 volume, klasik)
//   - design patterns kitabi (290 volume)
//
// Kullanici direktifi: 5 yabanci dil + 5 Turkce, ucuz/kaliteli editor secimi.

import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen, Clock, ArrowLeft, ArrowRight, ArrowDown,
  CheckCircle2, Lightbulb, Award, Star, Trophy,
  Layers, Globe, Languages, BookMarked, Heart,
  Tag, DollarSign, Bookmark, FileText,
} from "lucide-react";
import { notFound } from "next/navigation";
import { BASE_URL } from "@/lib/seo";
import { getPost, getAllPosts } from "../posts";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const post = await getPost("en-iyi-programlama-kitaplari");
  if (!post) return { title: "Yazı Bulunamadı" };
  return {
    title: `${post.title} | PYBlog`,
    description: post.excerpt,
    keywords: [
      "programlama kitabi",
      "python kitap",
      "temel kavramlar",
      "yazilima giris",
      "kodlama ogren",
      "en iyi python kitabi",
      "python kitap turkce",
      "python baslangic kitabi",
      "algoritma kitabi",
      "clean code kitabi",
      "the pragmatic programmer",
      "design patterns kitabi",
      "online ogrenme",
      "mulakat hazirlik",
      ...post.tags,
    ],
    authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/blog/en-iyi-programlama-kitaplari`,
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
      canonical: `${BASE_URL}/blog/en-iyi-programlama-kitaplari`,
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// JSON-LD Schemas
// ═══════════════════════════════════════════════════════════════

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${BASE_URL}/blog/en-iyi-programlama-kitaplari#article`,
  headline: "En İyi 10 Programlama Kitabı (2026) — Yabancı Dil + Türkçe Öneriler",
  description:
    "Python ve yazılım geliştirme için en iyi 10 kitap. 5 yabancı dil (İngilizce) + 5 Türkçe. Yazar, seviye, fiyat, dil ve editör seçimi.",
  image: `${BASE_URL}/og-default.png`,
  datePublished: "2026-07-24",
  dateModified: "2026-07-24",
  inLanguage: "tr-TR",
  articleSection: "Eğitim",
  keywords: "programlama kitabi, python kitap, yazilima giris, kodlama ogren, clean code, pragmatic programmer",
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
      name: "Python öğrenmek için hangi kitabı almalıyım?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sıfırdan başlıyorsanız editör seçimi: 'Automate the Boring Stuff with Python' (Al Sweigart, İngilizce + ücretsiz online). Türkçe tercih ediyorsanız: 'Python 3' (Mustafa Başer) veya 'Her Yönüyle Python' (Fırat Özgül). İleri seviye: 'Fluent Python' (Luciano Ramalho).",
      },
    },
    {
      "@type": "Question",
      name: "Programlama kitapları hâlâ gerekli mi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet, online kurs ve YouTube'un yanında kitaplar derinleşme için hâlâ en iyi araç. Kitaplar yapılandırılmış bilgi, editöryal kalite ve offline erişim sağlar. Mülakat hazırlığında 'Cracking the Coding Interview' klasik referans. 2026'da da geçerli.",
      },
    },
    {
      "@type": "Question",
      name: "Türkçe Python kitabı var mı?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet, birçok Türkçe Python kitabı var. En popüler: 'Python 3' (Mustafa Başer, başlangıç-orta), 'Her Yönüyle Python' (Fırat Özgül, kapsamlı), 'Python ile Çocuklar için Programlama' (giriş). İleri seviye için yabancı kaynak daha güçlü.",
      },
    },
    {
      "@type": "Question",
      name: "Clean Code kitabını okumaya değer mi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet, kesinlikle. Robert C. Martin'ın klasik eseri, yazılım kalitesinin temellerini öğretir. Junior-Mid seviye için paha biçilmez. Her bölüm kısa ve uygulamalı. Türkçe çevirisi mevcut. İş mülakatlarında 'Clean Code'u okudum' demek olumlu sinyal.",
      },
    },
    {
      "@type": "Question",
      name: "Ücretsiz programlama kitabı var mı?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet, birçok klasik ücretsiz online. 'Automate the Boring Stuff with Python' (Al Sweigart) tamamen ücretsiz. 'Think Python' (Allen Downey) ücretsiz. 'Eloquent JavaScript' (Marijn Haverbeke) ücretsiz. 'Pro Git' ücretsiz. Ancak basılı kitap farklı deneyim sunar.",
      },
    },
    {
      "@type": "Question",
      name: "Hangi kitap yazılım mülakatı için şart?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mülakat için 3 temel: 'Cracking the Coding Interview' (Gayle McDowell, algoritma), 'Clean Code' (yazılım kalitesi, kod review), 'System Design Interview' (Alex Xu, senior pozisyonlar). Junior için Cracking + Clean Code yeterli.",
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
    { "@type": "ListItem", position: 3, name: "En İyi Kitaplar", item: `${BASE_URL}/blog/en-iyi-programlama-kitaplari` },
  ],
};

export default async function Page() {
  const post = await getPost("en-iyi-programlama-kitaplari");
  if (!post) notFound();
  const OTHER_POSTS = (await getAllPosts())
    .filter((p) => p.slug !== "en-iyi-programlama-kitaplari")
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#050816] text-white">
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
            <span className="uppercase tracking-wider font-semibold">Eğitim</span>
            <span className="text-white/30">·</span>
            <span className="text-white/50">
              {new Date(post.date).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            En İyi 10 Programlama Kitabı
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
            <a href="#sec-1" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />1. Karşılaştırma tablosu
            </a>
            <a href="#sec-2" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />2. Yabancı dil: Automate the Boring Stuff
            </a>
            <a href="#sec-3" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />3. Yabancı dil: Python Crash Course
            </a>
            <a href="#sec-4" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />4. Yabancı dil: Clean Code
            </a>
            <a href="#sec-5" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />5. Yabancı dil: Pragmatic + Design Patterns
            </a>
            <a href="#sec-6" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />6. Türkçe kitaplar (5 seçenek)
            </a>
            <a href="#sec-editor" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />7. Editör seçimi
            </a>
            <a href="#sss" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />8. SSS
            </a>
          </div>
        </nav>

        {/* ════════════════════════════════════════════════════
            1. Karşılaştırma tablosu
        ════════════════════════════════════════════════════ */}
        <section id="sec-1" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Bölüm 1</div>
            <h2 className="text-2xl md:text-3xl font-bold">Karşılaştırma tablosu (2026 güncel)</h2>
          </header>
          <p className="text-white/80 leading-relaxed">
            10 kitabı yan yana karşılaştırdık: 5 yabancı dil (İngilizce, klasik eserler) + 5 Türkçe (Türk yazarlar). <strong className="text-white">Fiyatlar 2026 Temmuz itibarıyla</strong> (Amazon.com.tr / Amazon.com).
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-amber-500/30">
                  <th className="text-left p-2 text-white font-semibold">#</th>
                  <th className="text-left p-2 text-white font-semibold">Kitap</th>
                  <th className="text-left p-2 text-white font-semibold">Yazar</th>
                  <th className="text-left p-2 text-white font-semibold">Dil</th>
                  <th className="text-left p-2 text-white font-semibold">Fiyat</th>
                  <th className="text-left p-2 text-white font-semibold">Seviye</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                <tr className="border-b border-white/5 bg-amber-500/[0.03]">
                  <td className="p-2 text-amber-300 font-bold">★ 1</td>
                  <td className="p-2">Automate the Boring Stuff</td>
                  <td className="p-2">Al Sweigart</td>
                  <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs">EN</span></td>
                  <td className="p-2 text-emerald-300 font-medium">Ücretsiz online</td>
                  <td className="p-2">Sıfır → Orta</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-2">2</td>
                  <td className="p-2">Python Crash Course</td>
                  <td className="p-2">Eric Matthes</td>
                  <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs">EN</span></td>
                  <td className="p-2">$30-40</td>
                  <td className="p-2">Sıfır → Orta</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-2">3</td>
                  <td className="p-2">Clean Code</td>
                  <td className="p-2">Robert C. Martin</td>
                  <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs">EN/TR</span></td>
                  <td className="p-2">$35-45 / ₺300-450</td>
                  <td className="p-2">Orta → İleri</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-2">4</td>
                  <td className="p-2">The Pragmatic Programmer</td>
                  <td className="p-2">Hunt &amp; Thomas</td>
                  <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs">EN</span></td>
                  <td className="p-2">$40-50</td>
                  <td className="p-2">Orta → İleri</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-2">5</td>
                  <td className="p-2">Design Patterns</td>
                  <td className="p-2">Gang of Four</td>
                  <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs">EN</span></td>
                  <td className="p-2">$45-55</td>
                  <td className="p-2">İleri</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-2 text-amber-300 font-bold">★ 6</td>
                  <td className="p-2">Her Yönüyle Python</td>
                  <td className="p-2">Fırat Özgül</td>
                  <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs">TR</span></td>
                  <td className="p-2">₺250-400</td>
                  <td className="p-2">Sıfır → Orta</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-2">7</td>
                  <td className="p-2">Python 3</td>
                  <td className="p-2">Mustafa Başer</td>
                  <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs">TR</span></td>
                  <td className="p-2">₺300-450</td>
                  <td className="p-2">Sıfır → Orta</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-2">8</td>
                  <td className="p-2">Algoritma ve Programlama</td>
                  <td className="p-2">Hatice Sabuncu</td>
                  <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs">TR</span></td>
                  <td className="p-2">₺200-350</td>
                  <td className="p-2">Sıfır → Orta</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-2">9</td>
                  <td className="p-2">Python ile Çocuklar için Programlama</td>
                  <td className="p-2">Türkçe editör ekibi</td>
                  <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs">TR</span></td>
                  <td className="p-2">₺150-250</td>
                  <td className="p-2">Sıfır (çocuk/genç)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-2">10</td>
                  <td className="p-2">Clean Code (Türkçe Çeviri)</td>
                  <td className="p-2">Robert C. Martin (Türkçe)</td>
                  <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs">TR</span></td>
                  <td className="p-2">₺300-450</td>
                  <td className="p-2">Orta → İleri</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] p-4 mt-4">
            <div className="flex items-start gap-2">
              <Heart className="w-5 h-5 text-emerald-300 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white/80 text-sm leading-relaxed">
                  <strong className="text-emerald-300">Fiyat avantajı:</strong> Editör seçimimiz <strong>Automate the Boring Stuff (ücretsiz online)</strong> + <strong>Her Yönüyle Python (₺250-400)</strong>. <strong className="text-white">Toplam ₺250-400</strong>'a 2 kaliteli kitap (online + basılı) alırsınız.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            2. Yabancı dil: Automate the Boring Stuff
        ════════════════════════════════════════════════════ */}
        <section id="sec-2" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">★ YABANCI DİL SEÇİMİ</span>
              Bölüm 2
            </div>
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Trophy className="w-7 h-7 text-amber-300" />
              Automate the Boring Stuff with Python (Al Sweigart)
            </h2>
          </header>

          <div className="grid sm:grid-cols-2 gap-3 my-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs uppercase tracking-wider mb-1">
                <Bookmark className="w-3.5 h-3.5" /> Yazar
              </div>
              <p className="text-white font-medium">Al Sweigart</p>
              <p className="text-xs text-white/50 mt-1">ABD'li yazılımcı, "Invent Your Own Computer Games" da dahil 6 kitap</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs uppercase tracking-wider mb-1">
                <Globe className="w-3.5 h-3.5" /> Dil
              </div>
              <p className="text-white font-medium">İngilizce (Çeviri: Türkçe var)</p>
              <p className="text-xs text-white/50 mt-1">Online İngilizce tamamen ücretsiz</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs uppercase tracking-wider mb-1">
                <DollarSign className="w-3.5 h-3.5" /> Fiyat
              </div>
              <p className="text-emerald-300 font-medium">Online ÜCRETSİZ</p>
              <p className="text-xs text-white/50 mt-1">Basılı: $30, Türkçe çeviri: ₺150-250</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs uppercase tracking-wider mb-1">
                <Tag className="w-3.5 h-3.5" /> Sayfa
              </div>
              <p className="text-white font-medium">500+ sayfa</p>
              <p className="text-xs text-white/50 mt-1">2. baskı, 2019</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs uppercase tracking-wider mb-1">
                <Star className="w-3.5 h-3.5" /> Amazon Puanı
              </div>
              <p className="text-white font-medium">4.7/5 (10K+ değerlendirme)</p>
              <p className="text-xs text-white/50 mt-1">Programlama #1 bestseller</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs uppercase tracking-wider mb-1">
                <Bookmark className="w-3.5 h-3.5" /> Yayınevi
              </div>
              <p className="text-white font-medium">No Starch Press</p>
              <p className="text-xs text-white/50 mt-1">Teknik kitaplarda kalite simgesi</p>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-6">Neden bu kitap?</h3>
          <ul className="space-y-2 text-white/80">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong className="text-emerald-300">Online ücretsiz</strong> — <a href="https://automatetheboringstuff.com/" className="text-cyan-400 hover:underline">automatetheboringstuff.com</a>'dan tüm bölümler PDF/HTML olarak erişilebilir.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Pratik odaklı</strong> — Excel, PDF, web, e-posta otomasyonu. Her bölüm sonunda proje.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Sıfır başlangıç</strong> — programlama bilmeyen bile başlayabilir.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Türkçe çevirisi var</strong> — "Sıkıcı Şeyleri Python ile Otomatikleştirin" (Kodlab Yayınları).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>CC lisansı</strong> (Creative Commons) — yasal olarak ücretsiz dağıtılabilir.</span>
            </li>
          </ul>
        </section>

        {/* ════════════════════════════════════════════════════
            3. Yabancı dil: Python Crash Course
        ════════════════════════════════════════════════════ */}
        <section id="sec-3" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-emerald-300/80 font-bold uppercase tracking-wider">Bölüm 3</div>
            <h2 className="text-2xl md:text-3xl font-bold">Python Crash Course (Eric Matthes)</h2>
          </header>

          <div className="grid sm:grid-cols-2 gap-3 my-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-emerald-300 text-xs uppercase tracking-wider mb-1">
                <Bookmark className="w-3.5 h-3.5" /> Yazar
              </div>
              <p className="text-white font-medium">Eric Matthes</p>
              <p className="text-xs text-white/50 mt-1">Alaska lise öğretmeni, 25+ yıl Python deneyimi</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-emerald-300 text-xs uppercase tracking-wider mb-1">
                <Globe className="w-3.5 h-3.5" /> Dil
              </div>
              <p className="text-white font-medium">İngilizce (3. baskı 2023)</p>
              <p className="text-xs text-white/50 mt-1">Türkçe çeviri yayında değil</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-emerald-300 text-xs uppercase tracking-wider mb-1">
                <DollarSign className="w-3.5 h-3.5" /> Fiyat
              </div>
              <p className="text-white font-medium">$30-40</p>
              <p className="text-xs text-white/50 mt-1">Amazon.com'da, Türkiye ₺800-1200</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-emerald-300 text-xs uppercase tracking-wider mb-1">
                <Bookmark className="w-3.5 h-3.5" /> Sayfa
              </div>
              <p className="text-white font-medium">550+ sayfa</p>
              <p className="text-xs text-white/50 mt-1">3 proje: oyun, veri görselleştirme, web app</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-emerald-300 text-xs uppercase tracking-wider mb-1">
                <Star className="w-3.5 h-3.5" /> Puan
              </div>
              <p className="text-white font-medium">4.7/5 (8K+ değerlendirme)</p>
              <p className="text-xs text-white/50 mt-1">Amazon #1 Best Seller (Python)</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-emerald-300 text-xs uppercase tracking-wider mb-1">
                <Tag className="w-3.5 h-3.5" /> Yapı
              </div>
              <p className="text-white font-medium">2 kısım: temeller + proje</p>
              <p className="text-xs text-white/50 mt-1">Yarısı teori, yarısı 3 büyük proje</p>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-6">Neden bu kitap?</h3>
          <ul className="space-y-2 text-white/80">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Proje tabanlı</strong> — 3 büyük capstone proje: alien invasion (Pygame), veri görselleştirme (Matplotlib), web uygulaması (Django).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Temiz temeller</strong> — değişkenler, listeler, dict, sınıflar, dosya I/O.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>No Starch Press kalitesi</strong> — dünyanın en iyi teknik yayınevi.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>25 yıl öğretmenlik</strong> deneyimi — pedagojik olarak mükemmel.</span>
            </li>
          </ul>
        </section>

        {/* ════════════════════════════════════════════════════
            4. Clean Code
        ════════════════════════════════════════════════════ */}
        <section id="sec-4" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-cyan-300/80 font-bold uppercase tracking-wider">Bölüm 4</div>
            <h2 className="text-2xl md:text-3xl font-bold">Clean Code (Robert C. Martin)</h2>
          </header>

          <div className="grid sm:grid-cols-2 gap-3 my-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-cyan-300 text-xs uppercase tracking-wider mb-1">
                <Bookmark className="w-3.5 h-3.5" /> Yazar
              </div>
              <p className="text-white font-medium">Robert C. Martin ("Uncle Bob")</p>
              <p className="text-xs text-white/50 mt-1">50+ yıl yazılım, Agile manifesto imzacısı</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-cyan-300 text-xs uppercase tracking-wider mb-1">
                <Globe className="w-3.5 h-3.5" /> Dil
              </div>
              <p className="text-white font-medium">İngilizce + Türkçe çeviri</p>
              <p className="text-xs text-white/50 mt-1">"Temiz Kod" (Kodlab), 2018</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-cyan-300 text-xs uppercase tracking-wider mb-1">
                <DollarSign className="w-3.5 h-3.5" /> Fiyat
              </div>
              <p className="text-white font-medium">$35-45 / ₺300-450 (TR)</p>
              <p className="text-xs text-white/50 mt-1">İkinci el: $15-20</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-cyan-300 text-xs uppercase tracking-wider mb-1">
                <Bookmark className="w-3.5 h-3.5" /> Sayfa
              </div>
              <p className="text-white font-medium">450 sayfa</p>
              <p className="text-xs text-white/50 mt-1">Kısa bölümler, hızlı okunur</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-cyan-300 text-xs uppercase tracking-wider mb-1">
                <Star className="w-3.5 h-3.5" /> Puan
              </div>
              <p className="text-white font-medium">4.6/5 (5K+ değerlendirme)</p>
              <p className="text-xs text-white/50 mt-1">Yazılım klasikleri arasında</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-cyan-300 text-xs uppercase tracking-wider mb-1">
                <Tag className="w-3.5 h-3.5" /> Odak
              </div>
              <p className="text-white font-medium">Yazılım kalitesi + temiz kod</p>
              <p className="text-xs text-white/50 mt-1">Java örnekleri ama her dil için geçerli</p>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-6">Neden bu kitap?</h3>
          <ul className="space-y-2 text-white/80">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Yazılım kalitesi</strong> — değişken isimlendirme, fonksiyon tasarımı, yorum satırı, hata yönetimi.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>50 yıl deneyim</strong> — Robert C. Martin sektörün en deneyimli isimlerinden.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Mülakat sinyali</strong> — "Clean Code'u okudum" demek pozitif izlenim bırakır.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Dil-agnostik</strong> — Java örnekleri ama Python/JS'ye aynen uygulanır.</span>
            </li>
          </ul>
        </section>

        {/* ════════════════════════════════════════════════════
            5. Pragmatic + Design Patterns
        ════════════════════════════════════════════════════ */}
        <section id="sec-5" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-indigo-300/80 font-bold uppercase tracking-wider">Bölüm 5</div>
            <h2 className="text-2xl md:text-3xl font-bold">The Pragmatic Programmer &amp; Design Patterns</h2>
          </header>

          <div className="space-y-4">
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.03] p-4">
              <h3 className="text-lg font-bold text-indigo-300">4. The Pragmatic Programmer (Hunt &amp; Thomas, 20. Yıl Baskısı)</h3>
              <p className="text-sm text-white/70 mt-2 mb-3">Yazılım kariyerinin "kutsal kitabı". 20 yıl sonra güncellendi, 2026'da hâlâ en iyi pratik referans.</p>
              <div className="grid sm:grid-cols-3 gap-2 text-xs">
                <div><strong>Yazarlar:</strong> David Thomas, Andrew Hunt</div>
                <div><strong>Fiyat:</strong> $40-50 (₺500-700)</div>
                <div><strong>Seviye:</strong> Orta → İleri</div>
              </div>
            </div>

            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.03] p-4">
              <h3 className="text-lg font-bold text-indigo-300">5. Design Patterns: Elements of Reusable Object-Oriented Software</h3>
              <p className="text-sm text-white/70 mt-2 mb-3">"Gang of Four" klasiği, yazılım mimarisi için temel referans. 1994 ama hâlâ geçerli.</p>
              <div className="grid sm:grid-cols-3 gap-2 text-xs">
                <div><strong>Yazarlar:</strong> Gamma, Helm, Johnson, Vlissides</div>
                <div><strong>Fiyat:</strong> $45-55 (₺600-800)</div>
                <div><strong>Seviye:</strong> İleri (OOP bilgisi şart)</div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            6. Türkçe Kitaplar
        ════════════════════════════════════════════════════ */}
        <section id="sec-6" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-rose-300/80 font-bold uppercase tracking-wider">Bölüm 6</div>
            <h2 className="text-2xl md:text-3xl font-bold">6-10. Türkçe Kitaplar (5 seçenek)</h2>
          </header>

          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-4">
              <h3 className="text-lg font-bold text-emerald-300">★ 6. Her Yönüyle Python (Fırat Özgül)</h3>
              <p className="text-sm text-white/70 mt-2 mb-3">Türkçe Python kitaplarının kralı. 600+ sayfa, başlangıç-orta-ileri. Ücretsiz online versiyonu var.</p>
              <div className="grid sm:grid-cols-3 gap-2 text-xs">
                <div><strong>Yazar:</strong> Fırat Özgül (Python Türkiye topluluk lideri)</div>
                <div><strong>Fiyat:</strong> ₺250-400 (basılı), ücretsiz online</div>
                <div><strong>Seviye:</strong> Sıfır → Orta</div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <h3 className="text-lg font-bold">7. Python 3 (Mustafa Başer)</h3>
              <p className="text-sm text-white/70 mt-2 mb-3">Türkçe Python giriş klasiği. 500+ sayfa, çok sayıda örnek, üniversite düzeyinde.</p>
              <div className="grid sm:grid-cols-3 gap-2 text-xs">
                <div><strong>Yazar:</strong> Mustafa Başer</div>
                <div><strong>Fiyat:</strong> ₺300-450</div>
                <div><strong>Seviye:</strong> Sıfır → Orta</div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <h3 className="text-lg font-bold">8. Algoritma ve Programlama (Hatice Sabuncu)</h3>
              <p className="text-sm text-white/70 mt-2 mb-3">Üniversite müfredatına uygun, algoritma temelleri. Python ile sıfırdan.</p>
              <div className="grid sm:grid-cols-3 gap-2 text-xs">
                <div><strong>Yazar:</strong> Hatice Sabuncu</div>
                <div><strong>Fiyat:</strong> ₺200-350</div>
                <div><strong>Seviye:</strong> Sıfır → Orta</div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <h3 className="text-lg font-bold">9. Python ile Çocuklar için Programlama</h3>
              <p className="text-sm text-white/70 mt-2 mb-3">10-15 yaş için, görsel ağırlıklı, ebeveyn eşliğinde.</p>
              <div className="grid sm:grid-cols-3 gap-2 text-xs">
                <div><strong>Yazar:</strong> Türkçe editör ekibi</div>
                <div><strong>Fiyat:</strong> ₺150-250</div>
                <div><strong>Seviye:</strong> Sıfır (çocuk/genç)</div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <h3 className="text-lg font-bold">10. Clean Code (Türkçe Çeviri)</h3>
              <p className="text-sm text-white/70 mt-2 mb-3">Robert C. Martin'ın klasiğinin Türkçe çevirisi. İngilizce'sini okumak istemeyenler için.</p>
              <div className="grid sm:grid-cols-3 gap-2 text-xs">
                <div><strong>Yazar:</strong> Robert C. Martin (Türkçe çeviri)</div>
                <div><strong>Fiyat:</strong> ₺300-450</div>
                <div><strong>Seviye:</strong> Orta → İleri</div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            7. Editör seçimi
        ════════════════════════════════════════════════════ */}
        <section id="sec-editor" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Bölüm 7</div>
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Trophy className="w-7 h-7 text-amber-300" />
              Editör Seçimi: Ucuz + Kaliteli Kombinasyonu
            </h2>
          </header>

          <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/[0.05] to-transparent p-6 space-y-4">
            <p className="text-white/80 leading-relaxed">
              <strong className="text-amber-300">Yabancı dil editör seçimi:</strong> <strong className="text-white">Automate the Boring Stuff with Python (Al Sweigart, online ücretsiz)</strong>. Nedenleri:
            </p>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <span><strong className="text-amber-300">Sıfır maliyet</strong> — online versiyonu tamamen ücretsiz, basılı $30.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <span><strong className="text-amber-300">Pratik odaklı</strong> — otomasyon projeleri, gerçek iş hayatı senaryoları.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <span><strong className="text-amber-300">Türkçe çevirisi var</strong> — "Sıkıcı Şeyleri Python ile Otomatikleştirin" (Kodlab).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <span><strong className="text-amber-300">Amazon #1 Best Seller</strong> — 10K+ değerlendirme, 4.7/5 puan.</span>
              </li>
            </ul>

            <p className="text-white/80 leading-relaxed mt-4">
              <strong>Türkçe editör seçimi:</strong> <strong className="text-white">Her Yönüyle Python (Fırat Özgül, ₺250-400)</strong>. Nedenleri:
            </p>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <span><strong className="text-amber-300">Ücretsiz online</strong> — firozgul.com adresinden tüm bölümler.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <span><strong className="text-amber-300">Türkçe topluluk</strong> — Fırat Özgül Türkiye'nin en tanınmış Python eğitmeni.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <span><strong className="text-amber-300">Kapsamlı</strong> — 600+ sayfa, sıfırdan ileri seviyeye.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <span><strong className="text-amber-300">Güncel</strong> — Python 3.11+ uyumlu, son baskı 2024.</span>
              </li>
            </ul>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 mt-4">
              <p className="text-white/90 leading-relaxed">
                <strong className="text-emerald-300">Bonus kombinasyon:</strong> Automate the Boring Stuff (ücretsiz online) + Her Yönüyle Python (₺250-400, basılı) + Clean Code (Türkçe, ₺300-450). <strong className="text-white">Toplam maliyet: ₺550-850</strong> ile yazılım geliştirme için sağlam temel.
              </p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            8. SSS
        ════════════════════════════════════════════════════ */}
        <section id="sss" className="space-y-3 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">SSS</div>
            <h2 className="text-2xl md:text-3xl font-bold">Sıkça Sorulan Sorular</h2>
          </header>

          <FaqItem
            q="Python öğrenmek için hangi kitabı almalıyım?"
            a="Sıfırdan başlıyorsanız editör seçimi: 'Automate the Boring Stuff with Python' (Al Sweigart, İngilizce + ücretsiz online). Türkçe tercih ediyorsanız: 'Python 3' (Mustafa Başer) veya 'Her Yönüyle Python' (Fırat Özgül). İleri seviye: 'Fluent Python' (Luciano Ramalho)."
          />
          <FaqItem
            q="Programlama kitapları hâlâ gerekli mi?"
            a="Evet, online kurs ve YouTube'un yanında kitaplar derinleşme için hâlâ en iyi araç. Kitaplar yapılandırılmış bilgi, editöryal kalite ve offline erişim sağlar. Mülakat hazırlığında 'Cracking the Coding Interview' klasik referans. 2026'da da geçerli."
          />
          <FaqItem
            q="Türkçe Python kitabı var mı?"
            a="Evet, birçok Türkçe Python kitabı var. En popüler: 'Python 3' (Mustafa Başer, başlangıç-orta), 'Her Yönüyle Python' (Fırat Özgül, kapsamlı), 'Python ile Çocuklar için Programlama' (giriş). İleri seviye için yabancı kaynak daha güçlü."
          />
          <FaqItem
            q="Clean Code kitabını okumaya değer mi?"
            a="Evet, kesinlikle. Robert C. Martin'ın klasik eseri, yazılım kalitesinin temellerini öğretir. Junior-Mid seviye için paha biçilmez. Her bölüm kısa ve uygulamalı. Türkçe çevirisi mevcut. İş mülakatlarında 'Clean Code'u okudum' demek olumlu sinyal."
          />
          <FaqItem
            q="Ücretsiz programlama kitabı var mı?"
            a="Evet, birçok klasik ücretsiz online. 'Automate the Boring Stuff with Python' (Al Sweigart) tamamen ücretsiz. 'Think Python' (Allen Downey) ücretsiz. 'Eloquent JavaScript' (Marijn Haverbeke) ücretsiz. 'Pro Git' ücretsiz. Ancak basılı kitap farklı deneyim sunar."
          />
          <FaqItem
            q="Hangi kitap yazılım mülakatı için şart?"
            a="Mülakat için 3 temel: 'Cracking the Coding Interview' (Gayle McDowell, algoritma), 'Clean Code' (yazılım kalitesi, kod review), 'System Design Interview' (Alex Xu, senior pozisyonlar). Junior için Cracking + Clean Code yeterli."
          />
        </section>

        {/* Sonuç */}
        <section className="space-y-4 scroll-mt-20">
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.05] to-transparent p-6 space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-amber-200">Bir cümlede özet</h2>
            <p className="text-white/90 text-lg leading-relaxed">
              <strong className="text-amber-300">En iyi fiyat/kalite kombinasyonu: Automate the Boring Stuff (ücretsiz online) + Her Yönüyle Python (₺250-400).</strong> Toplam ₺250-400'a yazılım geliştirme için sağlam temel alırsınız.
            </p>
          </div>
        </section>

        {/* İlgili Yazılar */}
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
              <div className="text-xs text-white/60">7 kategori, 83+ soru — öğrendiklerinizi pratik edin.</div>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.05] to-transparent p-8 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">Kitapları Aldın, Şimdi Pratik Yap</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            7 kategoride 83+ gerçek mülakat sorusu, tarayıcıda anında çalışır. Kurulum yok, AI feedback var.
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
              href="/blog/en-iyi-python-kurslari"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/15 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              En İyi Kurslar
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
