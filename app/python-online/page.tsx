// /python-online — Free-style Python editor (server component + metadata).
// Client logic: PythonOnlineEditor.tsx.

import type { Metadata } from "next";
import { EditorErrorBoundary } from "../../components/EditorErrorBoundary";
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
  ],
  alternates: {
    canonical: "https://pythonmulakat.com/python-online",
  },
  openGraph: {
    title: "Python Online — Tarayıcıda Ücretsiz Kod Editörü",
    description: "Kurulum yok, hesap yok. Tarayıcıda Python yaz ve anında çalıştır.",
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

// 📌 FAQ JSON-LD — page-specific FAQ for Google rich results
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
      <EditorErrorBoundary editorName="Python Online">
        <PythonOnlineEditor />
      </EditorErrorBoundary>
    </>
  );
}