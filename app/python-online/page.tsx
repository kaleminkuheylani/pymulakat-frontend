// /python-online — Free-style Python editor (server component + metadata).
// Client logic in PythonOnlineEditor.tsx. Bu sayfa sadece SEO metadata üretir.

import type { Metadata } from "next";
import PythonOnlineEditor from "./PythonOnlineEditor";

export const metadata: Metadata = {
  title: "Python Online — Tarayıcıda Ücretsiz Kod Editörü",
  description:
    "Python online editör — kurulum yok, hesap yok. Tarayıcıda Python 3.12 kodu yaz, Pyodide ile anında çalıştır, çıktıyı gör. Python öğrenenler ve pratik yapanlar için ideal online playground.",
  keywords: [
    "python online",
    "python online editör",
    "python compiler",
    "python kodu çalıştırma",
    "tarayıcıda python",
    "python playground",
    "python deneme",
    "online python derleyici",
  ],
  alternates: {
    canonical: "https://pythonmulakat.com/python-online",
  },
  openGraph: {
    title: "Python Online — Tarayıcıda Ücretsiz Kod Editörü",
    description:
      "Kurulum yok, hesap yok. Tarayıcıda Python yaz ve anında çalıştır.",
    url: "https://pythonmulakat.com/python-online",
    siteName: "PythonMulakat",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Python Online — Tarayıcıda Ücretsiz Editör",
    description: "Python kodunu tarayıcıda anında çalıştır.",
  },
};

export default function PythonOnlinePage() {
  // 📌 FAQ JSON-LD — Google rich results için. Sayfada görünür değil,
  // arama sonuçlarında FAQ kartı olarak çıkabilir.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Python online nasıl çalıştırılır?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "pythonmulakat.com/python-online sayfasında tarayıcı tabanlı Python editörünü açın, kodunuzu yazın veya yapıştırın, ardından ▶ Çalıştır butonuna tıklayın ya da Ctrl+Enter kısayolunu kullanın. Çıktı hemen sağdaki konsol panelinde görünür. Kurulum, hesap açma veya sunucu bağlantısı gerekmez.",
        },
      },
      {
        "@type": "Question",
        name: "Python online editör ücretsiz mi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Evet, pythonmulakat.com/python-online tamamen ücretsizdir. Üye olmadan, kredi kartı girmeden sınırsız Python kodu yazabilir ve çalıştırabilirsiniz. Python yorumlayıcısı (Pyodide) tarayıcınızda çalışır, kodunuz sunucuya gönderilmez.",
        },
      },
      {
        "@type": "Question",
        name: "Hangi Python sürümünü kullanıyor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Python 3.12 (CPython) WebAssembly üzerinden çalışır. Pyodide projesi sayesinde standart kütüphane (math, random, json, datetime, collections vb.) ve birçok popüler paket (numpy, pandas, scipy, requests) kullanılabilir.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PythonOnlineEditor />
    </>
  );
}