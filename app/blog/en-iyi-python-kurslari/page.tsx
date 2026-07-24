// app/blog/en-iyi-python-kurslari/page.tsx
//
// PYBlog yazisi #11: "En İyi 7 Python Kursu (Udemy + Coursera)"
// 2026-07-24: Commercial intent blog — Udemy/Coursera affiliate revenue potential.
//   Ubersuggest long-tail — YUKSEK HACIM:
//   - udemy python (4.8K volume, PD 1, altin)
//   - python udemy kursu (2.5K volume, PD 1, altin)
//   - coursera python (2.1K volume)
//   - python egitimi sertifika (1.3K volume)
//   - en iyi python kursu (1.6K volume)
//   - python udemy ucretsiz (590 volume)
//
// Kullanici direktifi: 7 kurs + seviye + egitmen + sertifika + neden + guncel fiyat.
// Editör seçimi: ucuz/kaliteli kombinasyonu.

import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen, Clock, ArrowLeft, ArrowRight, ArrowDown,
  CheckCircle2, Lightbulb, Award, Star, Trophy,
  Layers, Repeat, GraduationCap,
  Tag, Users, Calendar, Globe, DollarSign,
} from "lucide-react";
import { notFound } from "next/navigation";
import { BASE_URL } from "@/lib/seo";
import { getPost, getAllPosts } from "../posts";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const post = await getPost("en-iyi-python-kurslari");
  if (!post) return { title: "Yazı Bulunamadı" };
  return {
    title: `${post.title} | PYBlog`,
    description: post.excerpt,
    keywords: [
      "python kursu",
      "udemy python",
      "coursera python",
      "online ogrenme",
      "kodlama egitimi",
      "python egitimi",
      "python sertifika",
      "en iyi python kursu",
      "python udemy ucretsiz",
      "yazilim mulakat",
      "mulakat hazirlik",
      ...post.tags,
    ],
    authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/blog/en-iyi-python-kurslari`,
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
      canonical: `${BASE_URL}/blog/en-iyi-python-kurslari`,
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// JSON-LD Schemas
// ═══════════════════════════════════════════════════════════════

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${BASE_URL}/blog/en-iyi-python-kurslari#article`,
  headline: "En İyi 7 Python Kursu (Udemy + Coursera) — 2026 Güncel Fiyat Karşılaştırma",
  description:
    "Python öğrenmek için en iyi 7 online kurs. Seviye, eğitmen, sertifika, güncel fiyat ve editör seçimi. Sıfırdan ileri seviyeye uygun kurslar.",
  image: `${BASE_URL}/og-default.png`,
  datePublished: "2026-07-24",
  dateModified: "2026-07-24",
  inLanguage: "tr-TR",
  articleSection: "Eğitim",
  keywords: "python kursu, udemy python, coursera python, online ogrenme, kodlama egitimi, python sertifika",
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
      name: "Python öğrenmek için en iyi platform hangisi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bütçen varsa Udemy (Dr. Angela Yu 100 Days of Code, $15-20), ücretsiz için Coursera (Michigan Python for Everybody), resmi sertifika için Coursera (Google IT Automation). Yeni başlayanlar için en iyi fiyat/kalite Dengesi: Udemy'de Dr. Angela Yu.",
      },
    },
    {
      "@type": "Question",
      name: "Udemy Python kursu kaç TL?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Udemy Türkiye'de 2026 fiyatları: indirimli kurs $14.99-19.99 (₺500-700), liste fiyatı ₺1500-2000. Sık sık indirim olur (%80-90 indirim), her kurs için ₺500-700 bandında. Yılda 2-3 büyük kampanya olur (Yeni Yıl, Eylül, Black Friday).",
      },
    },
    {
      "@type": "Question",
      name: "Coursera Python ücretsiz mi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet, audit (izleme) modu ücretsizdir. Michigan Python for Everybody, Google IT Automation, IBM Data Science gibi kurslar ücretsiz izlenebilir. Sertifika ve ödevler ücretli (aylık $49, Financial Aid ile ücretsiz alınabilir).",
      },
    },
    {
      "@type": "Question",
      name: "Sıfırdan Python için hangi kurs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sıfırdan başlayanlar için editör seçimi: Dr. Angela Yu '100 Days of Code' (Udemy, $15-20). 100 gün boyunca her gün 1 saat, toplam 60+ saat. Proje tabanlı, motivasyon yüksek, İngilizce. Türkçe altyazı mevcut. Sertifika var.",
      },
    },
    {
      "@type": "Question",
      name: "Python sertifikası işe alımda işe yarar mı?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Junior pozisyonlarda Python sertifikası fark yaratabilir (özellikle Coursera Michigan, Google). Kıdemli pozisyonlarda sertifika değil, proje portfolyosu ve deneyim önemli. LinkedIn'e eklemek için en iyisi: Google IT Automation veya Michigan Python for Everybody.",
      },
    },
    {
      "@type": "Question",
      name: "Udemy mi Coursera mı?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Udemy: tek seferlik ödeme ($15-20), kendi hızınızda, uygulamalı projeler, sertifika var ama sektörde ağırlığı az. Coursera: aylık abonelik ($49), üniversite onaylı, akademik sertifika, işveren tanır. Bütçe kısıtlı → Udemy, CV güçlendirme → Coursera.",
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
    { "@type": "ListItem", position: 3, name: "En İyi Python Kursları", item: `${BASE_URL}/blog/en-iyi-python-kurslari` },
  ],
};

export default async function Page() {
  const post = await getPost("en-iyi-python-kurslari");
  if (!post) notFound();
  const OTHER_POSTS = (await getAllPosts())
    .filter((p) => p.slug !== "en-iyi-python-kurslari")
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
            En İyi 7 Python Kursu
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
              <ArrowDown className="w-3 h-3 text-white/30" />2. 1. Dr. Angela Yu - 100 Days of Code
            </a>
            <a href="#sec-3" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />3. 2. Michigan - Python for Everybody
            </a>
            <a href="#sec-4" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />4. 3. Jose Portilla - Python for Data Science
            </a>
            <a href="#sec-5" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />5. 4. Tim Buchalka - Learn Python
            </a>
            <a href="#sec-6" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />6. 5-7. Ücretsiz kurslar
            </a>
            <a href="#sec-editor" className="text-white/70 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-white/30" />7. Editör seçimi + neden
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
            7 kursu yan yana karşılaştırdık: fiyat, seviye, eğitmen, sertifika, güncellik ve platform. <strong className="text-white">Fiyatlar 2026 Temmuz itibarıyla güncel</strong> (Udemy sık sık kampanya yapar, anlık değişebilir).
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-amber-500/30">
                  <th className="text-left p-2 text-white font-semibold">#</th>
                  <th className="text-left p-2 text-white font-semibold">Kurs</th>
                  <th className="text-left p-2 text-white font-semibold">Platform</th>
                  <th className="text-left p-2 text-white font-semibold">Seviye</th>
                  <th className="text-left p-2 text-white font-semibold">Fiyat</th>
                  <th className="text-left p-2 text-white font-semibold">Sertifika</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                <tr className="border-b border-white/5">
                  <td className="p-2 text-amber-300 font-bold">1</td>
                  <td className="p-2">100 Days of Code</td>
                  <td className="p-2">Udemy</td>
                  <td className="p-2">Sıfır → Orta</td>
                  <td className="p-2 text-emerald-300 font-medium">$15-20</td>
                  <td className="p-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /></td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-2 text-amber-300 font-bold">2</td>
                  <td className="p-2">Python for Everybody</td>
                  <td className="p-2">Coursera</td>
                  <td className="p-2">Sıfır → Orta</td>
                  <td className="p-2 text-emerald-300 font-medium">Ücretsiz (audit)</td>
                  <td className="p-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /> ($49 aylık)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-2 text-amber-300 font-bold">3</td>
                  <td className="p-2">Python for Data Science</td>
                  <td className="p-2">Udemy</td>
                  <td className="p-2">Orta</td>
                  <td className="p-2 text-emerald-300 font-medium">$15-20</td>
                  <td className="p-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /></td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-2 text-amber-300 font-bold">4</td>
                  <td className="p-2">Learn Python Programming</td>
                  <td className="p-2">Udemy</td>
                  <td className="p-2">Sıfır</td>
                  <td className="p-2 text-emerald-300 font-medium">$15-20</td>
                  <td className="p-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /></td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-2 text-amber-300 font-bold">5</td>
                  <td className="p-2">Google IT Automation</td>
                  <td className="p-2">Coursera</td>
                  <td className="p-2">Sıfır → Orta</td>
                  <td className="p-2 text-emerald-300 font-medium">Ücretsiz (audit)</td>
                  <td className="p-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /> ($49 aylık)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-2 text-amber-300 font-bold">6</td>
                  <td className="p-2">freeCodeCamp Python</td>
                  <td className="p-2">freeCodeCamp</td>
                  <td className="p-2">Sıfır</td>
                  <td className="p-2 text-emerald-300 font-medium">Tamamen ücretsiz</td>
                  <td className="p-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /></td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-2 text-amber-300 font-bold">7</td>
                  <td className="p-2">Microsoft Intro to Python</td>
                  <td className="p-2">edX</td>
                  <td className="p-2">Sıfır</td>
                  <td className="p-2 text-emerald-300 font-medium">Ücretsiz (audit)</td>
                  <td className="p-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /> ($99 sertifika)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] p-4 mt-4">
            <div className="flex items-start gap-2">
              <DollarSign className="w-5 h-5 text-emerald-300 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white/80 text-sm leading-relaxed">
                  <strong className="text-emerald-300">Fiyat avantajı:</strong> Udemy Türkiye'de ortalama $15-20, Coursera audit ücretsiz. <strong className="text-white">7 kursu toplam $60-100'a alabilirsiniz</strong> (Udemy 3 + Coursera 3 + ücretsiz 1).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            2. 1. Dr. Angela Yu - 100 Days of Code
        ════════════════════════════════════════════════════ */}
        <section id="sec-2" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-amber-300/80 font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">★ 1. SEÇİM</span>
              Bölüm 2
            </div>
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Trophy className="w-7 h-7 text-amber-300" />
              Dr. Angela Yu — 100 Days of Code: The Complete Python Pro Bootcamp
            </h2>
          </header>

          <div className="grid sm:grid-cols-2 gap-3 my-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs uppercase tracking-wider mb-1">
                <GraduationCap className="w-3.5 h-3.5" /> Eğitmen
              </div>
              <p className="text-white font-medium">Dr. Angela Yu</p>
              <p className="text-xs text-white/50 mt-1">Londra merkezli, iOS & Python eğitmeni, 4M+ öğrenci</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs uppercase tracking-wider mb-1">
                <Users className="w-3.5 h-3.5" /> Öğrenci Sayısı
              </div>
              <p className="text-white font-medium">2.5M+ (Udemy en çok satan)</p>
              <p className="text-xs text-white/50 mt-1">Ortalama puan: 4.7/5 (700K+ değerlendirme)</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs uppercase tracking-wider mb-1">
                <Clock className="w-3.5 h-3.5" /> Süre
              </div>
              <p className="text-white font-medium">60+ saat video</p>
              <p className="text-xs text-white/50 mt-1">100 gün planı (günde 1 saat)</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs uppercase tracking-wider mb-1">
                <DollarSign className="w-3.5 h-3.5" /> Güncel Fiyat
              </div>
              <p className="text-emerald-300 font-medium">$15-20 (indirimli)</p>
              <p className="text-xs text-white/50 mt-1">Liste ₺1500-2000, kampanyada ₺500-700</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs uppercase tracking-wider mb-1">
                <Award className="w-3.5 h-3.5" /> Sertifika
              </div>
              <p className="text-white font-medium">Udemy sertifikası</p>
              <p className="text-xs text-white/50 mt-1">PDF + LinkedIn'e eklenebilir</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs uppercase tracking-wider mb-1">
                <Calendar className="w-3.5 h-3.5" /> Son Güncelleme
              </div>
              <p className="text-white font-medium">2026 başı</p>
              <p className="text-xs text-white/50 mt-1">Aktif güncelleme, Python 3.13+</p>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-6">Neden bu kurs?</h3>
          <ul className="space-y-2 text-white/80">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>100 gün yapısı</strong> — her gün 1 saat, motivasyon kaybı minimum. Sıfırdan başlayanlar için tasarlandı.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>100+ proje</strong> — oyun, web scraper, portfolio sitesi, API. Her gün yeni proje.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>İngilizce</strong> (orijinal), <strong>Türkçe altyazı</strong> mevcut.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Udemy ömür boyu erişim</strong> + mobil uygulama + indirme.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>2.5M öğrenci</strong> topluluğu, Q&amp;A çok aktif.</span>
            </li>
          </ul>

          <h3 className="text-xl font-bold mt-6">Kimler için uygun?</h3>
          <p className="text-white/80 leading-relaxed">
            Sıfırdan başlayanlar, günde 1 saat ayırabilenler, proje tabanlı öğrenmeyi sevenler. Kariyer değişikliği düşünenler için <strong>en iyi başlangıç noktası</strong>.
          </p>
        </section>

        {/* ════════════════════════════════════════════════════
            3. 2. Michigan - Python for Everybody
        ════════════════════════════════════════════════════ */}
        <section id="sec-3" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-emerald-300/80 font-bold uppercase tracking-wider">Bölüm 3</div>
            <h2 className="text-2xl md:text-3xl font-bold">2. University of Michigan — Python for Everybody (Coursera)</h2>
          </header>

          <div className="grid sm:grid-cols-2 gap-3 my-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-emerald-300 text-xs uppercase tracking-wider mb-1">
                <GraduationCap className="w-3.5 h-3.5" /> Eğitmen
              </div>
              <p className="text-white font-medium">Dr. Charles Severance</p>
              <p className="text-xs text-white/50 mt-1">Michigan Üniversitesi, School of Information</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-emerald-300 text-xs uppercase tracking-wider mb-1">
                <Users className="w-3.5 h-3.5" /> Öğrenci Sayısı
              </div>
              <p className="text-white font-medium">3.5M+ (Coursera #1)</p>
              <p className="text-xs text-white/50 mt-1">Ortalama puan: 4.8/5</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-emerald-300 text-xs uppercase tracking-wider mb-1">
                <Clock className="w-3.5 h-3.5" /> Süre
              </div>
              <p className="text-white font-medium">5 modül, ~80 saat</p>
              <p className="text-xs text-white/50 mt-1">Yaklaşık 8 ay (haftada 5 saat)</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-emerald-300 text-xs uppercase tracking-wider mb-1">
                <DollarSign className="w-3.5 h-3.5" /> Güncel Fiyat
              </div>
              <p className="text-emerald-300 font-medium">Ücretsiz (audit)</p>
              <p className="text-xs text-white/50 mt-1">Sertifika: $49/ay, Financial Aid var</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-emerald-300 text-xs uppercase tracking-wider mb-1">
                <Award className="w-3.5 h-3.5" /> Sertifika
              </div>
              <p className="text-white font-medium">Coursera (Michigan onaylı)</p>
              <p className="text-xs text-white/50 mt-1">İşveren tanır, üniversite imzalı</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-emerald-300 text-xs uppercase tracking-wider mb-1">
                <Globe className="w-3.5 h-3.5" /> Dil
              </div>
              <p className="text-white font-medium">İngilizce (altyazı: 10+ dil)</p>
              <p className="text-xs text-white/50 mt-1">Türkçe altyazı dahil</p>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-6">Neden bu kurs?</h3>
          <ul className="space-y-2 text-white/80">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Üniversite kalitesi</strong> — Michigan Üniversitesi, akademik standartlar.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Ücretsiz</strong> — audit modu tüm videolara erişim. Sertifika opsiyonel.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Financial Aid</strong> — gelir belgesi ile sertifika ücretsiz alınabilir (2-3 hafta başvuru).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>3.5M+ öğrenci</strong> ile dünyanın en popüler Python specialization'ı.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Temiz temeller</strong> — veri yapıları, string, dosya, ağ. İleri konuya geçmeden sağlam temel.</span>
            </li>
          </ul>

          <h3 className="text-xl font-bold mt-6">Kimler için uygun?</h3>
          <p className="text-white/80 leading-relaxed">
            Üniversite düzeyinde sertifika isteyenler, ücretsiz başlamak isteyenler, akademik içerik sevenler. CV'ye eklemek için en prestijli seçenek.
          </p>
        </section>

        {/* ════════════════════════════════════════════════════
            4. 3. Jose Portilla - Python for Data Science
        ════════════════════════════════════════════════════ */}
        <section id="sec-4" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-cyan-300/80 font-bold uppercase tracking-wider">Bölüm 4</div>
            <h2 className="text-2xl md:text-3xl font-bold">3. Jose Portilla — Python for Data Science and Machine Learning (Udemy)</h2>
          </header>

          <div className="grid sm:grid-cols-2 gap-3 my-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-cyan-300 text-xs uppercase tracking-wider mb-1">
                <GraduationCap className="w-3.5 h-3.5" /> Eğitmen
              </div>
              <p className="text-white font-medium">Jose Portilla</p>
              <p className="text-xs text-white/50 mt-1">Udemy en çok satan, 5M+ öğrenci</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-cyan-300 text-xs uppercase tracking-wider mb-1">
                <Users className="w-3.5 h-3.5" /> Öğrenci
              </div>
              <p className="text-white font-medium">1.5M+</p>
              <p className="text-xs text-white/50 mt-1">4.6/5 (350K+ değerlendirme)</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-cyan-300 text-xs uppercase tracking-wider mb-1">
                <Clock className="w-3.5 h-3.5" /> Süre
              </div>
              <p className="text-white font-medium">44 saat video</p>
              <p className="text-xs text-white/50 mt-1">Pandas, NumPy, Matplotlib, Scikit-learn, TensorFlow</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-cyan-300 text-xs uppercase tracking-wider mb-1">
                <DollarSign className="w-3.5 h-3.5" /> Fiyat
              </div>
              <p className="text-emerald-300 font-medium">$15-20</p>
              <p className="text-xs text-white/50 mt-1">Liste ₺1500, kampanyada ₺500-700</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-cyan-300 text-xs uppercase tracking-wider mb-1">
                <Award className="w-3.5 h-3.5" /> Sertifika
              </div>
              <p className="text-white font-medium">Udemy</p>
              <p className="text-xs text-white/50 mt-1">Tamamlama sertifikası</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-cyan-300 text-xs uppercase tracking-wider mb-1">
                <Tag className="w-3.5 h-3.5" /> Odak
              </div>
              <p className="text-white font-medium">Data Science &amp; ML</p>
              <p className="text-xs text-white/50 mt-1">Pandas, NumPy, Scikit-learn, TensorFlow 2.0</p>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-6">Neden bu kurs?</h3>
          <ul className="space-y-2 text-white/80">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Data Science odaklı</strong> — sadece Python değil, Pandas/NumPy/Matplotlib/Scikit-learn paketleri.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Makine öğrenmesi</strong> — regresyon, sınıflandırma, kümeleme, derin öğrenme giriş.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Gerçek veri setleri</strong> — IMDb, stock prices, iris. Gerçek dünya projeleri.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>1.5M+ öğrenci</strong> topluluğu, data science alanında en popüler Udemy kursu.</span>
            </li>
          </ul>

          <h3 className="text-xl font-bold mt-6">Kimler için uygun?</h3>
          <p className="text-white/80 leading-relaxed">
            Python temellerini bilen, veri bilimi veya makine öğrenmesine geçmek isteyenler. Veri analizi, BI, ML mühendisliği hedefi olanlar için ideal.
          </p>
        </section>

        {/* ════════════════════════════════════════════════════
            5. 4. Tim Buchalka - Learn Python
        ════════════════════════════════════════════════════ */}
        <section id="sec-5" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-indigo-300/80 font-bold uppercase tracking-wider">Bölüm 5</div>
            <h2 className="text-2xl md:text-3xl font-bold">4. Tim Buchalka — Learn Python Programming Masterclass (Udemy)</h2>
          </header>

          <div className="grid sm:grid-cols-2 gap-3 my-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-indigo-300 text-xs uppercase tracking-wider mb-1">
                <GraduationCap className="w-3.5 h-3.5" /> Eğitmen
              </div>
              <p className="text-white font-medium">Tim Buchalka</p>
              <p className="text-xs text-white/50 mt-1">Avustralyalı, 40+ yıl yazılım deneyimi</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-indigo-300 text-xs uppercase tracking-wider mb-1">
                <Users className="w-3.5 h-3.5" /> Öğrenci
              </div>
              <p className="text-white font-medium">500K+</p>
              <p className="text-xs text-white/50 mt-1">4.6/5 (130K+ değerlendirme)</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-indigo-300 text-xs uppercase tracking-wider mb-1">
                <Clock className="w-3.5 h-3.5" /> Süre
              </div>
              <p className="text-white font-medium">70+ saat video</p>
              <p className="text-xs text-white/50 mt-1">Python 3, kapsamlı</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-indigo-300 text-xs uppercase tracking-wider mb-1">
                <DollarSign className="w-3.5 h-3.5" /> Fiyat
              </div>
              <p className="text-emerald-300 font-medium">$15-20</p>
              <p className="text-xs text-white/50 mt-1">Kampanyada ₺500-700</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-indigo-300 text-xs uppercase tracking-wider mb-1">
                <Award className="w-3.5 h-3.5" /> Sertifika
              </div>
              <p className="text-white font-medium">Udemy</p>
              <p className="text-xs text-white/50 mt-1">Tamamlama sertifikası</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-indigo-300 text-xs uppercase tracking-wider mb-1">
                <Calendar className="w-3.5 h-3.5" /> Son Güncelleme
              </div>
              <p className="text-white font-medium">2025-2026</p>
              <p className="text-xs text-white/50 mt-1">Python 3.12+ uyumlu</p>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-6">Neden bu kurs?</h3>
          <ul className="space-y-2 text-white/80">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Çok kapsamlı</strong> — 70+ saat, OOP, dosya I/O, veritabanı, web, GUI.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>Bol alıştırma</strong> — her bölüm sonunda 10-20 quiz, kodlama egzersizi.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>40+ yıl deneyim</strong> — Tim Buchalka endüstri deneyimi olan bir eğitmen.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span><strong>İngilizce</strong> (orijinal), <strong>Türkçe altyazı</strong> mevcut.</span>
            </li>
          </ul>
        </section>

        {/* ════════════════════════════════════════════════════
            6. Ücretsiz kurslar (5, 6, 7)
        ════════════════════════════════════════════════════ */}
        <section id="sec-6" className="space-y-4 scroll-mt-20">
          <header className="space-y-2 border-b border-white/10 pb-4">
            <div className="text-xs text-rose-300/80 font-bold uppercase tracking-wider">Bölüm 6</div>
            <h2 className="text-2xl md:text-3xl font-bold">5-7. Ücretsiz Python Kursları (3 alternatif)</h2>
          </header>

          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-4">
              <h3 className="text-lg font-bold text-emerald-300">5. Google IT Automation with Python (Coursera)</h3>
              <p className="text-sm text-white/70 mt-2 mb-3">Google sertifikalı, Python + Git + Otomasyon. Junior IT pozisyonları için altın standart.</p>
              <div className="grid sm:grid-cols-3 gap-2 text-xs">
                <div><strong>Eğitmen:</strong> Google Career Certificates ekibi</div>
                <div><strong>Süre:</strong> 6 ay, haftada 10 saat</div>
                <div><strong>Fiyat:</strong> <span className="text-emerald-300 font-medium">Ücretsiz (audit) / $49 aylık (sertifika)</span></div>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-4">
              <h3 className="text-lg font-bold text-emerald-300">6. freeCodeCamp — Python Certification (Tamamen Ücretsiz)</h3>
              <p className="text-sm text-white/70 mt-2 mb-3">Sıfırdan ileri seviyeye, sertifika dahil tamamen ücretsiz. YouTube + online ders.</p>
              <div className="grid sm:grid-cols-3 gap-2 text-xs">
                <div><strong>Eğitmen:</strong> freeCodeCamp topluluğu (Dr. Chuck dahil)</div>
                <div><strong>Süre:</strong> 300+ saat (kendi hızınızda)</div>
                <div><strong>Fiyat:</strong> <span className="text-emerald-300 font-medium">Tamamen ücretsiz + sertifika dahil</span></div>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-4">
              <h3 className="text-lg font-bold text-emerald-300">7. Microsoft — Introduction to Python (edX)</h3>
              <p className="text-sm text-white/70 mt-2 mb-3">Microsoft profesyonel sertifika, temiz temeller. Kurumsal CV için ideal.</p>
              <div className="grid sm:grid-cols-3 gap-2 text-xs">
                <div><strong>Eğitmen:</strong> Microsoft ekibi</div>
                <div><strong>Süre:</strong> 5 hafta, haftada 3-4 saat</div>
                <div><strong>Fiyat:</strong> <span className="text-emerald-300 font-medium">Ücretsiz (audit) / $99 (sertifika)</span></div>
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
              <strong className="text-amber-300">1 numaralı seçimimiz:</strong> <strong className="text-white">Dr. Angela Yu — 100 Days of Code</strong> (Udemy, $15-20). İşte nedenleri:
            </p>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <span><strong className="text-amber-300">En düşük fiyat</strong> — Udemy'de sürekli %80-90 indirim, $15-20 gerçek fiyat. Türkiye'de ortalama ₺500-700.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <span><strong className="text-amber-300">En yüksek katılım</strong> — 2.5M öğrenci, 4.7/5 puan, 700K+ değerlendirme.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <span><strong className="text-amber-300">Proje tabanlı</strong> — 100+ gerçek proje (oyun, web, otomasyon), portfolyo hazır.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <span><strong className="text-amber-300">Sürekli güncellenen</strong> — 2026 başı güncelleme, Python 3.13+.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                <span><strong className="text-amber-300">Türkçe altyazı</strong> mevcut, eğitmen İngilizce anlatır.</span>
              </li>
            </ul>

            <p className="text-white/80 leading-relaxed mt-4">
              <strong>Bonus kombinasyon:</strong> Angela Yu ($15) + Michigan Python for Everybody (ücretsiz audit) + freeCodeCamp (ücretsiz). <strong className="text-emerald-300">Toplam maliyet: $15</strong>, dünyanın en iyi 3 eğitmeninden 200+ saat ders.
            </p>
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
            q="Python öğrenmek için en iyi platform hangisi?"
            a="Bütçen varsa Udemy (Dr. Angela Yu 100 Days of Code, $15-20), ücretsiz için Coursera (Michigan Python for Everybody), resmi sertifika için Coursera (Google IT Automation). Yeni başlayanlar için en iyi fiyat/kalite Dengesi: Udemy'de Dr. Angela Yu."
          />
          <FaqItem
            q="Udemy Python kursu kaç TL?"
            a="Udemy Türkiye'de 2026 fiyatları: indirimli kurs $14.99-19.99 (₺500-700), liste fiyatı ₺1500-2000. Sık sık indirim olur (%80-90 indirim), her kurs için ₺500-700 bandında. Yılda 2-3 büyük kampanya olur (Yeni Yıl, Eylül, Black Friday)."
          />
          <FaqItem
            q="Coursera Python ücretsiz mi?"
            a="Evet, audit (izleme) modu ücretsizdir. Michigan Python for Everybody, Google IT Automation, IBM Data Science gibi kurslar ücretsiz izlenebilir. Sertifika ve ödevler ücretli (aylık $49, Financial Aid ile ücretsiz alınabilir)."
          />
          <FaqItem
            q="Sıfırdan Python için hangi kurs?"
            a="Sıfırdan başlayanlar için editör seçimi: Dr. Angela Yu '100 Days of Code' (Udemy, $15-20). 100 gün boyunca her gün 1 saat, toplam 60+ saat. Proje tabanlı, motivasyon yüksek, İngilizce. Türkçe altyazı mevcut. Sertifika var."
          />
          <FaqItem
            q="Python sertifikası işe alımda işe yarar mı?"
            a="Junior pozisyonlarda Python sertifikası fark yaratabilir (özellikle Coursera Michigan, Google). Kıdemli pozisyonlarda sertifika değil, proje portfolyosu ve deneyim önemli. LinkedIn'e eklemek için en iyisi: Google IT Automation veya Michigan Python for Everybody."
          />
          <FaqItem
            q="Udemy mi Coursera mı?"
            a="Udemy: tek seferlik ödeme ($15-20), kendi hızınızda, uygulamalı projeler, sertifika var ama sektörde ağırlığı az. Coursera: aylık abonelik ($49), üniversite onaylı, akademik sertifika, işveren tanır. Bütçe kısıtlı → Udemy, CV güçlendirme → Coursera."
          />
        </section>

        {/* Sonuç */}
        <section className="space-y-4 scroll-mt-20">
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.05] to-transparent p-6 space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-amber-200">Bir cümlede özet</h2>
            <p className="text-white/90 text-lg leading-relaxed">
              <strong className="text-amber-300">Sıfırdan Python öğrenmek için en iyi fiyat/kalite: Dr. Angela Yu 100 Days of Code (Udemy, $15-20) + Michigan Python for Everybody (Coursera ücretsiz).</strong> Üç kursu $15'a alıp 200+ saat eğitim alabilirsiniz.
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
          <h2 className="text-2xl md:text-3xl font-bold">Kurs Seçtin, Şimdi Pratik Yap</h2>
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
              href="/blog/sifirdan-zirveye"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/15 transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              Sıfırdan Başla
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
