// /python-online — Free-style Python editor (server component + metadata).
// Client logic: PythonOnlineEditor.tsx.

import type { Metadata } from "next";
import Link from "next/link";
import { EditorErrorBoundary } from "../../components/EditorErrorBoundary";
import PythonOnlineEditor from "./PythonOnlineEditor";
import { DEFAULT_RELATED_CATEGORIES } from "../../components/defaultRelatedCategories";

export const metadata: Metadata = {
  title: "Python Online Compiler — Tarayıcıda Ücretsiz Kod Editörü",
  description:
    "Python online compiler — tarayıcıda anında kod yaz ve çalıştır. Kurulum yok, hesap yok. Şimdilik ücretsiz.",
  keywords: [
    "python online",
    "python online editör",
    "python online compiler",
    "python compiler",
    "python kodu çalıştırma",
    "tarayıcıda python",
    "python playground",
    "python öğren",
    "python örnekleri",
    "python online test çöz",
    "python online sınav",
    "python online mülakat",
    "python tarayıcıda kod yazma",
    "python online test soruları",
    "python pratik soruları"

  ],
  alternates: {
    canonical: "https://pythonmulakat.com/python-online",
  },
  openGraph: {
    title: "Python Online — Tarayıcıda Ücretsiz Kod Editörü",
    description: "Python online compiler — kurulum yok, hesap yok. Tarayıcıda Python yaz, anında çalıştır.",
    url: "https://pythonmulakat.com/python-online",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "https://pythonmulakat.com/og-default.png",
        width: 1200,
        height: 630,
        alt: "Python Online — Tarayıcıda Ücretsiz Kod Editörü",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Python Online — Tarayıcıda Ücretsiz Editör",
    description: "Python öğren — tarayıcıda anında çalıştır, kurulum yok.",
    images: ["https://pythonmulakat.com/og-default.png"],
  },
};

// 📌 FAQ JSON-LD — page-specific FAQ for Google rich results
// DEPRECATED Google rich result (May 2026 itibarıyla SERP'te gösterilmiyor). Schema.org tipi valid; sayfada bırakılıyor (Bing/Perplexity/LLM crawler için). Yeni geliştirmede Article/TechArticle + LearningResource + Course + BreadcrumbList kullan.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Python online nasıl çalıştırılır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "pythonmulakat.com/python-online sayfasında tarayıcı tabanlı Python editörünü açın, kodunuzu yazın veya yapıştırın, ardından Çalıştır butonuna tıklayın ya da Ctrl+Enter kısayolunu kullanın. Çıktı sağdaki konsol panelinde görünür.",
      },
    },
    {
      "@type": "Question",
      name: "Python online editör ücretsiz mi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet, pythonmulakat.com/python-online tamamen ücretsizdir. Python yorumlayıcısı (Pyodide) tarayıcınızda çalışır, kodunuz sunucuya gönderilmez.",
      },
    },
    {
      "@type": "Question",
      name: "Hangi Python sürümünü kullanıyor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Python 3.12 (CPython) WebAssembly üzerinden çalışır. Standart kütüphane ve numpy, pandas gibi paketler kullanılabilir.",
      },
    },
  ],
};

export default function PythonOnlinePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="min-h-screen bg-[#050816] text-white">
        {/* Paylaşılan header — diğer kategori sayfalarıyla eş */}
        <header className="bg-[#0a0e1a]/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-3 transition-colors"
            >
              ← Ana Sayfa
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Python Online</h1>
            <p className="text-white/70 text-base md:text-lg max-w-3xl leading-relaxed">
              Tarayıcıda <span className="text-amber-300">Python 3.12</span> kodunu yaz, Pyodide ile anında çalıştır.
              Kurulum yok, hesap yok. Öğrenmek için ideal playground.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["✓ Kurulum yok", "✓ Hesap yok", "✓ Pyodide WASM", "✓ 100ms başlar"].map((t) => (
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

        <main className="max-w-6xl mx-auto px-6 py-8">
          <EditorErrorBoundary editorName="Python Online">
            <PythonOnlineEditor />
          </EditorErrorBoundary>

          {/* Paylaşılan footer — diğer kategori sayfalarıyla eş */}
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