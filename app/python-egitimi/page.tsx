// /python-egitimi — Python eğitim rehberi index sayfası.
// Statik; her lesson ayrı component. Auth gerektirmez.
import { Lightbulb, Target } from "lucide-react";
import { getTotalQuestionCount } from "@/lib/api/questionAPI";

import type { Metadata } from "next";
import Link from "next/link";
import { LESSONS, getLesson } from "./lessons";
import { DEFAULT_RELATED_CATEGORIES } from "../../components/defaultRelatedCategories";

export const metadata: Metadata = {
  title: "Python Eğitimi — Başlangıçtan İleri Seviye Türkçe Rehber",
  description:
    "Python öğren — Türkçe, ücretsiz eğitim. Değişkenler, OOP, async, veri yapıları. Her ders kod örnekleri ve online editör.",
  keywords: [
    "python eğitimi",
    "python dersleri",
    "türkçe python",
    "python öğren",
    "python başlangıç",
    "python oop",
    "python async",
    "python veri yapıları",
    "python generator",
    "python dekoratör",
    "python pratik soruları",
    "python sınav soruları",
    "python örnekleri",
    "python playground",
    "python ne işe yarar",
    "python öğrenme",
    "python bootcamp",
    "python mülakat bootcamp",
    "python mülakat hazırlık",
    "python online test çöz",
    "python online mülakat",
    "python online sınav",
    "python pratik soruları",
    "python sınav soruları"

  ],
  authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
  creator: "Python Mülakat",
  publisher: "Python Mülakat",
  alternates: {
    canonical: "https://pythonmulakat.com/python-egitimi",
    languages: {
      "tr-TR": "https://pythonmulakat.com/python-egitimi",
      "x-default": "https://pythonmulakat.com/python-egitimi",
    },
  },
  openGraph: {
    title: "Python Eğitimi — Türkçe, Ücretsiz, Kapsamlı",
    description: "Python öğren — Türkçe, ücretsiz kapsamlı eğitim. 6 ders, kod örnekleri, online editör.",
    url: "https://pythonmulakat.com/python-egitimi",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "https://pythonmulakat.com/og-default.png",
        width: 1200,
        height: 630,
        alt: "Python Eğitimi — Türkçe Rehber",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Python Eğitimi — Türkçe, Ücretsiz",
    description: "Türkçe Python dersleri: başlangıç, orta, ileri. 6 ders, kod örnekleri, online editör.",
    images: ["https://pythonmulakat.com/og-default.png"],
    creator: "@pythonmulakat",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://pythonmulakat.com/" },
    { "@type": "ListItem", position: 2, name: "Python Eğitimi", item: "https://pythonmulakat.com/python-egitimi" },
  ],
};

const courseJsonLd = {
  "@context": "https://schema.org",
  // Course şeması Google tarafından May 2026'da deprecated edildi.
  // LearningResource kullanıyoruz — schema.org standardı + Google geçerli.
  "@type": "LearningResource",
  "@id": "https://pythonmulakat.com/python-egitimi#learning-resource",
  name: "Python Eğitimi — Başlangıçtan İleri Seviye",
  description: "Türkçe, ücretsiz, kapsamlı Python dersleri. Sıfırdan async/await'a kadar 6 dersten oluşan sıralı yol haritası. Her ders çalıştırılabilir kod örneği içerir.",
  url: "https://pythonmulakat.com/python-egitimi",
  provider: {
    "@type": "Organization",
    "@id": "https://pythonmulakat.com/#organization",
    name: "Python Mülakat",
    url: "https://pythonmulakat.com",
  },
  inLanguage: "tr-TR",
  isAccessibleForFree: true,
  educationalLevel: "Beginner",
  learningResourceType: "course",
  teaches: [
    "Python temel kavramlar (değişkenler, tipler, operatörler)",
    "Kontrol yapıları (if/elif/else, for, while)",
    "Fonksiyonlar (def, parametreler, return, lambda)",
    "Veri yapıları (list, dict, tuple, set, comprehension)",
    "Nesne yönelimli programlama (class, inheritance, polymorphism)",
    "İleri konular (generator, decorator, context manager, async/await)",
  ],
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "student",
  },
  hasPart: LESSONS.map((l, i) => ({
    "@type": "LearningResource",
    "@id": `https://pythonmulakat.com/python-egitimi/${l.slug}#lesson`,
    name: l.title,
    description: l.description,
    url: `https://pythonmulakat.com/python-egitimi/${l.slug}`,
    educationalLevel: l.level,
    learningResourceType: "lesson",
    position: i + 1,
    timeRequired: l.duration,
    teaches: l.topics.join(", "),
    inLanguage: "tr-TR",
    isAccessibleForFree: true,
  })),
};

// 📌 FAQPage JSON-LD — sayfada render edilen FAQ'lar zengin sonuç için sema ile eşle
// DEPRECATED Google rich result (May 2026 itibarıyla SERP'te gösterilmiyor). Schema.org tipi valid; sayfada bırakılıyor (Bing/Perplexity/LLM crawler için). Yeni geliştirmede Article/TechArticle + LearningResource + Course + BreadcrumbList kullan.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://pythonmulakat.com/python-egitimi#faq",
  mainEntity: [
    {
      "@type": "Question",
      name: "Python öğrenmek için önceden programlama bilmem gerekiyor mu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayır. İlk dersler hiç programlama deneyimi olmayanlar için tasarlandı. Sırayla ilerleyerek başlangıçtan ileri seviyeye ulaşabilirsin.",
      },
    },
    {
      "@type": "Question",
      name: "Bu eğitim sertifika veriyor mu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayır, sertifika programımız yok. Odak noktası pratik yapabilme ve gerçek Python kodu yazabilme.",
      },
    },
    {
      "@type": "Question",
      name: "Hangi Python sürümünü kullanıyorsunuz?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tüm örnekler Python 3.12 ile test edilmiştir ve tarayıcıda Pyodide üzerinden doğrudan çalışır.",
      },
    },
    {
      "@type": "Question",
      name: "Python'u ne kadar sürede öğrenebilirim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Haftada 5-7 saat ayırırsan başlangıçtan (değişkenler, döngüler) veri yapılarına kadar 8-10 hafta. Günde 1 saat düzenli pratik ile 3 ayda junior seviyeye ulaşabilirsin. Her ders sonunda 'Ödev' bölümü seni pratik yapmaya yönlendirir; bunları atlamamak en kritik adımdır.",
      },
    },
    {
      "@type": "Question",
      name: "Hangi editör/IDE kullanmalıyım?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yeni başlayanlar için VS Code (Community sürümü, ücretsiz) öneriyoruz. Türkçe arayüz desteği, Python extension ve hata ayıklayıcı ile birlikte geliyor. Alternatif: PyCharm Community. Kurulum istemiyorsan bu sitedeki /python-online sayfası Pyodide üzerinden tarayıcıda direkt çalışır.",
      },
    },
    {
      "@type": "Question",
      name: "Mülakat hazırlığı için hangi sırayla ilerlemeliyim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Önerilen sıra: 1) Temel Kavramlar 2) Kontrol Yapıları 3) Fonksiyonlar 4) Veri Yapıları 5) OOP 6) İleri Konular. Her dersin sonunda mülakat sorularına geçiş için /interviews sayfasına git. En etkili yol: dersi oku → ödevi yap → 5 ilgili mülakat sorusunu çöz.",
      },
    },
    {
      "@type": "Question",
      name: "Python ile ne yapabilirim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Python ile yapabileceklerin: web geliştirme (Django, Flask, FastAPI), veri bilimi (Pandas, NumPy, scikit-learn), makine öğrenmesi (PyTorch, TensorFlow), otomasyon ve scripting (dosya işlemleri, web scraping), veri analizi (Jupyter notebook), DevOps, oyun geliştirme (Pygame). Hangi alana yönelirsen yönel, bu eğitimin temelleri geçerli.",
      },
    },
    {
      "@type": "Question",
      name: "Eğitimden sonra ne yapmalıyım?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Üç adım: 1) /interviews sayfasındaki ${totalCount} sorudan kendi seviyene uygun olanları çöz (başlangıç: python-basics). 2) Bir mini proje yap (örn: hava durumu CLI, todo API, basit web scraper). 3) GitHub'da paylaş ve açık kaynak projelere katkıda bulunmaya başla. Junior pozisyonu için 3-6 aylık pratik yeterli olabilir.",
      },
    },
  ],
};

export default async function PythonEgitimiPage() {
  const totalCount = await getTotalQuestionCount();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="min-h-screen bg-[#050816] text-white">
        <header className="bg-[#0a0e1a]/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-3 transition-colors"
            >
              ← Ana Sayfa
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Python Eğitimi</h1>
            <p className="text-white/70 text-base md:text-lg max-w-3xl leading-relaxed">
              Başlangıçtan ileri seviyeye, Türkçe ve ücretsiz Python dersleri.
              Her ders çalıştırılabilir kod örneği, kısa açıklama ve pratik ödev içerir.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["✓ Ücretsiz", "✓ Üyelik gerektirmez", "✓ Tarayıcıda çalışır", `${LESSONS.length} ders`].map((t) => (
                <span
                  key={t}
                  className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════
            YENİ BAŞLAYANLAR İÇİN — neden bu sayfa önemli? (uzun paragraf)
           ═══════════════════════════════════════════════════════ */}
        <section className="max-w-4xl mx-auto px-4 -mt-4 mb-12">
          <article className="p-6 md:p-8 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/8 via-amber-500/3 to-transparent">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-6 h-6 text-amber-300" />
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Yeni başlıyorsan bu sayfa neden önemli?
              </h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-white/75 leading-relaxed">
              <p>
                İnternetteki Python derslerinin çoğu ya çok kuramsal kalıp “şu kavramı öğren” deyip geçiyor, ya da tam tersine parça parça YouTube videolarına dağılmış olduğu için başlangıçtan ileri seviyeye <strong className="text-amber-300">düzenli bir yol</strong> çizemiyorsun. Bu sayfa o iki uç arasındaki boşluğu doldurmak için tasarlandı: altı dersten oluşan, sıralı, kapsamlı bir yol haritası. <em>Temel Kavramlar</em>’dan başlayıp değişkenleri, kontrol yapılarını, fonksiyonları, veri yapılarını, nesne yönelimli programlamayı öğreniyor; son olarak <em>İleri Konular</em>’da generator, dekoratör, context manager ve async/await gibi profesyonel Python araçlarıyla tanışıyorsun. Yani bir yerde “öğrendim” diyebileceğin somut bir çerçeve sunuyoruz — büyük resmi kafanda kurmadan tek tek StackOverflow cevaplarında boğulmak zorunda kalmıyorsun.
              </p>
              <p>
                Her dersin sonunda sadece okumakla yetinmemen için bir <strong className="text-amber-300">pratik ödevi</strong> var ve o ödevin çözümünü tarayıcıda, kurulum yapmadan, Pyodide ile anında yazıp çalıştırabilirsin. “Merhaba Dünya” örneğinin aksine burada her örnek <em>gerçek bir sorunu çözen kısa bir betik</em>: bir string ters çevirme, palindrom kontrolü, GCD hesaplama, binary search, fibonacci’nin memoization versiyonu, dekoratörle fonksiyon zamanlama, dataclass ile model tanımı, async görev çalıştırma. Bu yüzden dersleri okurken bir yandan kendi çözümünü yazıyor, hata aldığında neden hata aldığını anlıyor, sonra da doğru cevabı görüp <em>o anki kavramı gerçekten sindirmiş</em> oluyorsun. Görsel okuyucu değil, ellerini klavyeye atmış bir geliştirici olarak ilerliyorsun — bu da öğrendiğin her şeyin ertesi gün hâlâ aklında kalmasını sağlıyor.
              </p>
              <p>
                Mülakata hazırlanan bir adaysan, kendi başına Python öğrenen bir öğrenciysen veya bootcamp sonrası “boşlukları doldurayım” diyorsan: bu eğitim formatı, dağınık kaynaklarla tek başına uğraşırken harcadığın saatleri sana geri veriyor. Her dersin üstünde <em>Başlangıç / Orta / İleri</em> etiketi var, böylece zamanın azsa doğrudan kendi seviyenden başlıyorsun; eğer temelin varsa ileri konulara atlayıp o konuyu oradan takip edebiliyorsun. Üstelik her dersten sonra pratik alıştırmanın çözümünü ilgili mülakat sorusu sayfasında gösteriyoruz, yani öğrendiğin teori <strong className="text-amber-300">gerçek mülakat bağlamında</strong> test ediliyor — bu sayede “öğrendim sandığım şeyi gerçekten yapabiliyor muyum?” sorusunun cevabını eğitimin içinde alıyorsun.
              </p>
            </div>
          </article>
        </section>

        <main className="max-w-5xl mx-auto px-4 py-10">
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-5">Dersler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {LESSONS.map((l) => (
                <Link
                  key={l.slug}
                  href={`/python-egitimi/${l.slug}`}
                  className="group p-5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-amber-500/30 hover:bg-white/[0.05] transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{l.icon}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                      l.level === "Başlangıç" ? "bg-emerald-500/15 text-emerald-300" :
                      l.level === "Orta" ? "bg-amber-500/15 text-amber-300" :
                      "bg-rose-500/15 text-rose-300"
                    }`}>
                      {l.level}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-1.5 group-hover:text-amber-300 transition-colors">
                    {l.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed line-clamp-3">{l.description}</p>
                  <div className="mt-3 flex items-center gap-3 text-[11px] text-white/40">
                    ⏱ {l.duration}
                    •
                    {l.topics.length} konu
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 📌 SEO: Sıfırdan Python Yol Haritası — 4 haftalık plan + internal link */}
          <section className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20">
            <h2 className="text-xl font-bold mb-4 text-white">🗺️ Sıfırdan Python Yol Haritası (4 Hafta)</h2>
            <p className="text-sm text-white/65 mb-5">
              Haftada 5-7 saat ayırarak 1 ayda temel Python'dan veri yapılarına ulaşan pratik plan:
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-300">1</div>
                <div>
                  <h3 className="font-bold text-white mb-1">1. Hafta — Temel Kavramlar</h3>
                  <p className="text-sm text-white/65">Değişkenler, veri tipleri, operatörler, print/input. Her gün 1 saat. Çıktı: "Merhaba Dünya" + basit hesap makinesi.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-300">2</div>
                <div>
                  <h3 className="font-bold text-white mb-1">2. Hafta — Kontrol Yapıları + Fonksiyonlar</h3>
                  <p className="text-sm text-white/65">if/else, for/while, fonksiyon tanımı, parametreler, return. Çıktı: palindrom kontrolü, EBOB hesaplayıcı.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-300">3</div>
                <div>
                  <h3 className="font-bold text-white mb-1">3. Hafta — Veri Yapıları</h3>
                  <p className="text-sm text-white/65">List, dict, set, tuple. Comprehension, slicing, mutability. Çıktı: kelime sayacı, veri tekilleştirme.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center font-bold text-rose-300">4</div>
                <div>
                  <h3 className="font-bold text-white mb-1">4. Hafta — OOP + Mülakat Pratiği</h3>
                  <p className="text-sm text-white/65">Class, __init__, inheritance. Sonra <Link href="/interviews" className="text-amber-300 hover:underline">/interviews</Link>'da başlangıç sorularını çöz (python-basics, list-dict).</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-white/45 mt-5 italic">
              💡 Her hafta sonunda o haftanın dersinin "Ödev" bölümünü kendi başına yap. <Link href="/python-online" className="text-amber-300 hover:underline">/python-online</Link>'da Pyodide ile tarayıcıda test et.
            </p>
          </section>

          <section className="prose prose-invert max-w-none">
            <h2 className="text-xl font-bold text-white mb-3">Sık Sorulan Sorular</h2>
            <div className="space-y-3 text-sm">
              <FaqItem q="Python öğrenmek için önceden programlama bilmem gerekiyor mu?" a="Hayır. İlk dersler hiç programlama deneyimi olmayanlar için tasarlandı. Sırayla ilerleyerek başlangıçtan ileri seviyeye ulaşabilirsin." />
              <FaqItem q="Bu eğitim sertifika veriyor mu?" a="Hayır, sertifika programımız yok. Odak noktası pratik yapabilme ve gerçek Python kodu yazabilme." />
              <FaqItem q="Hangi Python sürümünü kullanıyorsunuz?" a="Tüm örnekler Python 3.12 ile test edilmiştir ve tarayıcıda Pyodide üzerinden doğrudan çalışır." />
              <FaqItem q="Python'u ne kadar sürede öğrenebilirim?" a="Haftada 5-7 saat ile 8-10 haftada başlangıçtan veri yapılarına. Düzenli pratik ile 3 ayda junior seviye." />
              <FaqItem q="Hangi editör/IDE kullanmalıyım?" a="VS Code (ücretsiz, Python extension ile) veya PyCharm Community. Kurulum istemiyorsan bu sitedeki /python-online tarayıcıda çalışır." />
              <FaqItem q="Mülakat hazırlığı için hangi sırayla ilerlemeliyim?" a="6 dersi sırayla bitir → /interviews'da 5 ilgili soruyu çöz. Her ders + pratik döngüsü en etkili yol." />
              <FaqItem q="Python ile ne yapabilirim?" a="Web (Django, FastAPI), veri bilimi (Pandas, NumPy), ML (PyTorch), otomasyon, scraping, DevOps, oyun. Hangi alan olursa olsun temeller aynı." />
              <FaqItem q="Eğitimden sonra ne yapmalıyım?" a="1) /interviews'da ${totalCount} sorudan seviyene uygun olanları çöz. 2) Mini proje yap. 3) GitHub'da paylaş." />
            </div>
          </section>

          {/* 📌 Ilgili Konular — CategoryPageTemplate ile eş */}
          <section className="mt-16 pt-10 border-t border-white/10">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">İlgili Kategoriler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {DEFAULT_RELATED_CATEGORIES.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-amber-400/40 transition-all"
                >
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center text-amber-400 bg-amber-500/10 border border-amber-500/20 mb-3">
                    <r.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-amber-400 transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">{r.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="p-3 rounded-lg bg-white/[0.03] border border-white/10 group">
      <summary className="cursor-pointer text-white/90 font-medium list-none flex items-center justify-between">
        {q}
        ▾
      </summary>
      <p className="mt-2 text-white/70 leading-relaxed">{a}</p>
    </details>
  );
}
