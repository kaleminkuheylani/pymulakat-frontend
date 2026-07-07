// /python-kodlari — Python kod örnekleri kataloğu.
// Statik snippet'ler; her biri tarayıcıda çalıştırılabilir.

import type { Metadata } from "next";
import Link from "next/link";
import { CODE_SAMPLES, CATEGORIES, getCategory } from "./samples";
import CopyButton from "./CopyButton";

export const metadata: Metadata = {
  title: "Python Kodları — Hazır Örnekler ve Şablonlar",
  description:
    "Python kodları kataloğu — sık kullanılan algoritmalar, veri yapıları, dosya işlemleri, web scraping, API çağrıları. Kopyala, çalıştır, öğren.",
  keywords: [
    "python kodları",
    "python örnekleri",
    "python kod örnekleri",
    "python snippets",
    "python algoritmaları",
    "python şablonları",
  ],
  alternates: { canonical: "https://pythonmulakat.com/python-kodlari" },
  openGraph: {
    title: "Python Kodları — Hazır Örnekler ve Şablonlar",
    description: "Sık kullanılan Python kodları, kategorize, çalıştırılabilir.",
    url: "https://pythonmulakat.com/python-kodlari",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://pythonmulakat.com/" },
    { "@type": "ListItem", position: 2, name: "Python Kodları", item: "https://pythonmulakat.com/python-kodlari" },
  ],
};

export default function PythonKodlariPage() {
  const total = CODE_SAMPLES.length;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="min-h-screen bg-[#050816] text-white">
        <header className="border-b border-white/10 bg-[#0a0e1a]/80 backdrop-blur">
          <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
            <div className="flex items-center gap-2 text-[10px] text-white/40 mb-3">
              <Link href="/" className="hover:text-white/70">Ana Sayfa</Link>
              <span>/</span>
              <span className="text-white/60">Python Kodları</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              Python Kodları
            </h1>
            <p className="text-base sm:text-lg text-white/70 max-w-3xl">
              Sık kullanılan <span className="text-amber-300">Python kod örnekleri</span>.
              Kopyala, tarayıcıda çalıştır, öğren. Toplam <span className="font-bold text-white">{total}</span> örnek.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 text-xs">
              {CATEGORIES.map((c) => (
                <a
                  key={c.slug}
                  href={`#${c.slug}`}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                >
                  {c.icon} {c.name} ({CODE_SAMPLES.filter(s => s.category === c.slug).length})
                </a>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-10 space-y-12">
          {CATEGORIES.map((cat) => {
            const items = CODE_SAMPLES.filter((s) => s.category === cat.slug);
            if (items.length === 0) return null;
            return (
              <section key={cat.slug} id={cat.slug} className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl">{cat.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold">{cat.name}</h2>
                    <p className="text-sm text-white/60">{cat.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {items.map((s) => (
                    <article key={s.slug} className="p-5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{s.title}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex-shrink-0 ${
                          s.level === "Başlangıç" ? "bg-emerald-500/15 text-emerald-300" :
                          s.level === "Orta" ? "bg-amber-500/15 text-amber-300" :
                          "bg-rose-500/15 text-rose-300"
                        }`}>
                          {s.level}
                        </span>
                      </div>
                      <p className="text-sm text-white/60 mb-3 leading-relaxed">{s.description}</p>
                      <details className="group">
                        <summary className="cursor-pointer text-xs text-amber-300 hover:text-amber-200 list-none flex items-center gap-1.5">
                          <span className="group-open:rotate-90 transition-transform">▶</span>
                          Kodu görüntüle
                        </summary>
                        <pre className="mt-3 p-3 rounded-lg bg-[#0a0e1a] border border-white/5 overflow-x-auto font-mono text-[12px] leading-relaxed text-white/85">
                          <code>{s.code}</code>
                        </pre>
                        <div className="mt-2 flex items-center gap-2 text-[10px] text-white/40">
                          <a
                            href={`/python-online?snippet=${encodeURIComponent(s.slug)}`}
                            className="px-2 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25"
                          >
                            ▶ Online editörde çalıştır
                          </a>
                          <CopyButton code={s.code} />
                        </div>
                      </details>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}

          <section className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20">
            <h2 className="text-xl font-bold mb-3">💡 Öneri</h2>
            <p className="text-sm text-white/70 leading-relaxed mb-3">
              Bu örnekleri sadece kopyalama. Her birini <Link href="/python-online" className="text-amber-300 hover:underline">online editörde</Link> aç,
              değiştir, boz, tekrar dene. Bir hatayla karşılaşmak, gerçek öğrenmenin başladığı yerdir.
            </p>
            <p className="text-sm text-white/70 leading-relaxed">
              Kapsamlı öğrenmek istiyorsan <Link href="/python-egitimi" className="text-amber-300 hover:underline">Python eğitimi</Link>ne,
              gerçek problemlerle pratik için <Link href="/interviews" className="text-amber-300 hover:underline">mülakat soruları</Link>na bak.
            </p>
          </section>
        </main>
      </div>
    </>
  );
}