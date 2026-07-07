// /python-egitimi — Python eğitim rehberi index sayfası.
// Statik; her lesson ayrı component. Auth gerektirmez.

import type { Metadata } from "next";
import Link from "next/link";
import { LESSONS, getLesson } from "./lessons";

export const metadata: Metadata = {
  title: "Python Eğitimi — Başlangıçtan İleri Seviye Türkçe Rehber",
  description:
    "Python eğitimi — Türkçe, ücretsiz ve kapsamlı. Değişkenler, döngüler, fonksiyonlar, OOP, async, veri yapıları. Her ders kod örnekleri ve online editör içerir.",
  keywords: [
    "python eğitimi",
    "python dersleri",
    "türkçe python",
    "python öğren",
    "python başlangıç",
    "python oop",
    "python async",
  ],
  alternates: { canonical: "https://pythonmulakat.com/python-egitimi" },
  openGraph: {
    title: "Python Eğitimi — Türkçe, Ücretsiz, Kapsamlı",
    description: "Başlangıçtan ileri seviyeye Python öğren. Her ders kod örnekleriyle.",
    url: "https://pythonmulakat.com/python-egitimi",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Python Eğitimi — Türkçe, Ücretsiz",
    description: "Türkçe Python dersleri: başlangıç, orta, ileri.",
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
  "@type": "Course",
  name: "Python Eğitimi — Başlangıçtan İleri Seviye",
  description: "Türkçe Python dersleri. Ücretsiz, kapsamlı, kod örnekleriyle.",
  provider: { "@type": "Organization", name: "PythonMulakat", url: "https://pythonmulakat.com" },
  inLanguage: "tr",
  isAccessibleForFree: true,
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT10H",
  },
};

export default function PythonEgitimiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />

      <div className="min-h-screen bg-[#050816] text-white">
        <header className="border-b border-white/10 bg-[#0a0e1a]/80 backdrop-blur">
          <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
            <div className="flex items-center gap-2 text-[10px] text-white/40 mb-3">
              <Link href="/" className="hover:text-white/70">Ana Sayfa</Link>
              <span>/</span>
              <span className="text-white/60">Python Eğitimi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              Python Eğitimi
            </h1>
            <p className="text-base sm:text-lg text-white/70 max-w-3xl">
              Başlangıçtan ileri seviyeye, <span className="text-amber-300">Türkçe ve ücretsiz</span> Python dersleri.
              Her ders çalıştırılabilir kod örneği, kısa açıklama ve pratik ödev içerir.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                ✓ Ücretsiz
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                ✓ Üyelik gerektirmez
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                ✓ Tarayıcıda çalışır
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {LESSONS.length} ders
              </span>
            </div>
          </div>
        </header>

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
                    <span>⏱ {l.duration}</span>
                    <span>•</span>
                    <span>{l.topics.length} konu</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20">
            <h2 className="text-xl font-bold mb-3">📚 Önerilen Sıra</h2>
            <ol className="space-y-2 text-sm text-white/70 list-decimal list-inside marker:text-amber-300">
              <li>Başlangıç derslerini sırayla tamamla</li>
              <li>Her dersin sonundaki ödevi kendi başına yap</li>
              <li>Yapamadığın ödev için <Link href="/interviews" className="text-amber-300 hover:underline">mülakat soruları</Link>nda pratik yap</li>
              <li>Online editörde (<Link href="/python-online" className="text-amber-300 hover:underline">/python-online</Link>) kod yazarak pekiştir</li>
            </ol>
          </section>

          <section className="prose prose-invert max-w-none">
            <h2 className="text-xl font-bold text-white mb-3">Sık Sorulan Sorular</h2>
            <div className="space-y-3 text-sm">
              <FaqItem q="Python öğrenmek için önceden programlama bilmem gerekiyor mu?" a="Hayır. İlk dersler hiç programlama deneyimi olmayanlar için tasarlandı. Sırayla ilerleyerek başlangıçtan ileri seviyeye ulaşabilirsin." />
              <FaqItem q="Bu eğitim sertifika veriyor mu?" a="Hayır, sertifika programımız yok. Odak noktası pratik yapabilme ve gerçek Python kodu yazabilme." />
              <FaqItem q="Hangi Python sürümünü kullanıyorsunuz?" a="Tüm örnekler Python 3.12 ile test edilmiştir ve tarayıcıda Pyodide üzerinden doğrudan çalışır." />
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
        <span>{q}</span>
        <span className="text-white/40 group-open:rotate-180 transition-transform">▾</span>
      </summary>
      <p className="mt-2 text-white/70 leading-relaxed">{a}</p>
    </details>
  );
}
