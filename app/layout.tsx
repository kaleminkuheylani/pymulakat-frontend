import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./global.css";
import Script from "next/script";
import GlobalNav from "../components/GlobalNav";
import ConditionalFooter from "../components/ConditionalFooter";
import ClientOnly from "../components/ClientOnly";
import CookieConsent from "../components/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 📌 CodeMirror editörü için JetBrains Mono — kod için optimize ligatürler
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// ────────────────────────────────────────────────────────────
// 🌐 GLOBAL SEO METADATA
// ────────────────────────────────────────────────────────────
// 📌 Next.js 13+ requires separate viewport export.
//   Merge: viewport name=theme-color, width=device-width, initial-scale=1.
//   Bu olmadan mobile rendering bozulur + Google mobile-first index
//   skorunu düşürür.
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050816" },
    { media: "(prefers-color-scheme: light)", color: "#0a0e1a" },
  ],
  colorScheme: "dark",
} as const;

export const metadata: Metadata = {
  metadataBase: new URL("https://pythonmulakat.com"),

  title: {
    default:
      "Yapay Zeka Destekli Python Mülakat Platformu",
    // 2026-07-14 v13: Template sade ("Python Mülakat" — her sayfada
    //   tekrar "Yapay Zeka Destekli" ekleyerek keyword stuffing riski).
    //   Default title + description + footer + JSON-LD yeterli (toplam
    //   4-5 YZD per sayfa, dogal dagilim).
    template: "%s | Python Mülakat",
  },

  description:
    "Yapay zeka destekli Python mülakat soru platformu. Yapay zeka denetiminden geçirilmiş sorular, algoritma ve dinamik programlama için Türkçe interaktif pratik. Tarayıcıda kod yaz, AI geri bildirim al. Şimdilik ücretsiz.",

  keywords: [
    // Temel / Yeni başlayan
    "python yeni başlayanlar",
    "python temel konular",
    "sıfırdan python",
    "python pratik soruları",         // YENİ: 600-1.2K hacim
    "python alıştırma soruları",      // YENİ: 600-1.2K hacim
    "python temel sorular",            // YENİ: 400-800 hacim
    "python dersleri türkçe",
    "python eğitimi",                   // 📌 Ubersuggest: 1.3K vol, SEO 18, ₺61 CPC
    "python kodları",                   // 📌 Ubersuggest: 1.3K vol, SEO 17, ₺28 CPC

    // Veri tipleri
    "python veri tipleri sorular",
    "python list dict tuple set soruları",
    "python string manipülasyon örnekleri",

    // OOP
    "nesne yönelimli programlama python türkçe",
    "python oop alıştırma",
    "python class inheritance örnekleri",
    "python encapsulation polymorphism",

    // Uygulama / Mülakat
    "python mülakat hazırlık",
    "python başlangıç soruları",       // YENİ: 400-800 hacim
    "python sınav soruları",            // YENİ: 1K-2K hacim ⭐
    "python basit uygulama örnekleri",
    "python beyin fırtınası soruları",
    "python kodlama mülakatı",
    "junior python developer mülakat soruları",
    "python algoritma soruları",        // 📌 ACİL #4: title/H1 destekleyici keyword
    "python dinamik programlama",       // 📌 ACİL #4: title/H1 destekleyici keyword
    "python dynamic programming",
    "python dp soruları",
    "python knapsack problemi",
    "python fibonacci memoization",
    "python longest common subsequence",
    "python online",                    // 📌 Ubersuggest: 9.9K vol, SEO 27, ₺53 CPC

    // Veritabanı / Kütüphaneler
    "python sqlite3 soruları",
    "python sqlite3 alıştırma",
    "python pandas alıştırma soruları",
    "python veri bilimi mülakat",

    // Platform odaklı (marka)
    "python online sandbox türkçe",
    "python interaktif öğrenme",
    "yapay zeka destekli python pratiği",  // DÜŞÜK DEĞER, ÇIKARILDI

    // Transactional (mimari-uyumlu, geçici ücretsiz tier vurgusu)
    "python mülakat soruları",
    "yazılım mülakat soruları python",
    "python online test çöz",
    "python online sınav",
    "python ücretsiz deneme",
    "python online mülakat",
    "python tarayıcıda kod yazma",
    "python mülakat hesap aç",
    "ücretsiz python hesabı",
    "python çevrimiçi üye ol",
    "python bootcamp",
    "python mülakat bootcamp",
    "junior python mülakat",
    "python developer mülakat",
  ],

  authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
  creator: "Python Mülakat",
  publisher: "Python Mülakat",

  category: "education",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Open Graph ──────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://pythonmulakat.com",
    siteName: "Python Mülakat",
    title: "Python Mülakat, Algoritma ve Dinamik Programlama Soruları",
    description:
      "Python mülakat soruları, algoritma soruları ve dinamik programlama için Türkçe interaktif pratik. OOP, SQLite, Pandas, sandbox ve anlık AI geri bildirimi.",
    images: [
      {
        url: "https://pythonmulakat.com/og-default.png",
        width: 1200,
        height: 630,
        alt: "Python Mülakat Hazırlığı — pythonmulakat.com",
      },
    ],
  },

  // ── Twitter / X ─────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Python Mülakat, Algoritma ve Dinamik Programlama Soruları",
    description:
      "Türkçe interaktif Python mülakat soruları, algoritma soruları ve dinamik programlama. OOP, veri tipleri, SQLite, sandbox ve anlık AI geri bildirimi.",
    images: ["https://pythonmulakat.com/og-default.png"],
    creator: "@pythonmulakat",
  },

  // ── Canonical & Alternates ──────────────────────────────────
  alternates: {
    canonical: "https://pythonmulakat.com",
    // 📌 Hreflang: Tek dil (tr-TR) + x-default fallback. Çoklu dil yoksa bile
    // x-default en iyi pratik — Google botlarına canonical hedefi gösterir.
    languages: {
      "tr-TR": "https://pythonmulakat.com",
      "x-default": "https://pythonmulakat.com",
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },

  manifest: "/site.webmanifest",

  verification: {
    google: "Kb5VdxiZ4LBLZzun5jYJHBJ--GB1ydxdfMbSwaVuFbw",
  },

  // ── Ek SEO meta etiketleri ─────────────────────────────────
  other: {
    "revisit-after": "3 days",
    "rating": "general",
    "distribution": "global",
  },
};

// ────────────────────────────────────────────────────────────
// 🔗 JSON-LD STRUCTURED DATA
// ────────────────────────────────────────────────────────────
const siteJsonLd = {
  "@context": "https://schema.org",

  "@graph": [
    // ── Organization ──────────────────────────────────────────
    {
      "@type": "Organization",
      "@id": "https://pythonmulakat.com/#organization",
      name: "Python Mülakat",
      alternateName: "Yapay Zeka Destekli Python Mülakat Platformu",
      url: "https://pythonmulakat.com",
      logo: {
        "@type": "ImageObject",
        url: "https://pythonmulakat.com/og-default.png",
        width: 1200,
        height: 630,
      },
      description:
        "Yapay zeka destekli Python mülakat soru platformu. Python öğrenmeye yeni başlayanlar için Türkçe interaktif mülakat hazırlık, AI geri bildirim ve kod pratik.",
      sameAs: [],
    },

    // ── WebSite + SearchAction ────────────────────────────────
    {
      "@type": "WebSite",
      "@id": "https://pythonmulakat.com/#website",
      url: "https://pythonmulakat.com",
      name: "Yapay Zeka Destekli Python Mülakat",
      alternateName: "Python Mülakat",
      description:
        "Yapay zeka destekli Python mülakat platformu: gerçek dünya mülakat soruları, interaktif sandbox, AI destekli geri bildirim ve kod pratik.",
      publisher: { "@id": "https://pythonmulakat.com/#organization" },
      inLanguage: "tr-TR",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://pythonmulakat.com/interviews/{search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },

    // ── LearningResource (Yeni: Öğrenme kaynağı) ──────────────
    {
      "@type": "LearningResource",
      "@id": "https://pythonmulakat.com/#learning-resource",
      name: "Python Mülakat Soruları - İnteraktif Sandbox",
      description:
        "Tarayıcıda kod yazarak Python mülakat sorularını çözebileceğin, yapay zekâ destekli geri bildirim veren interaktif öğrenme platformu.",
      url: "https://pythonmulakat.com",
      educationalUse: "practice",
      learningResourceType: "interactive tutorial",
      audience: {
        "@type": "Audience",
        audienceType: "Python'a yeni başlayanlar",
      },
      teaches: [
        "Python veri tipleri",
        "OOP temelleri",
        "SQLite3 ile veritabanı",
        "Pandas ile veri analizi",
        "Algoritmik düşünme",
      ],
      isAccessibleForFree: true,
    },

    // ── BreadcrumbList (Yeni: Gezinti yapısı) ─────────────────
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Ana Sayfa",
          item: "https://pythonmulakat.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Mülakat Soruları",
          item: "https://pythonmulakat.com/interviews",
        },
      ],
    },

    // ── FAQPage ───────────────────────────────────────────────
    // DEPRECATED Google rich result (May 2026 itibarıyla SERP'te gösterilmiyor). Schema.org tipi valid; sayfada bırakılıyor (Bing/Perplexity/LLM crawler için). Yeni geliştirmede Article/TechArticle + LearningResource + Course + BreadcrumbList kullan.
    {
      "@type": "FAQPage",
      "@id": "https://pythonmulakat.com/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Python'a yeni başlayanlar mülakatta hangi konulardan soru alır?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yeni başlayanlar için en sık sorulan konular şunlardır: veri tipleri (list, dict, tuple, set, string), nesne yönelimli programlama temelleri (class, __init__, inheritance, encapsulation, polymorphism), temel Python uygulamaları, SQLite ile veritabanı işlemleri (CRUD, JOIN) ve algoritmik düşünme (beyin fırtınası) sorularıdır.",
          },
        },
        {
          "@type": "Question",
          name: "Python OOP alıştırma soruları nasıl çalışılır?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Class tanımlama, __init__ metodu, kalıtım (inheritance), polimorfizm ve kapsülleme (encapsulation) konularında interaktif sandbox'ta kod yazarak pratik yapabilirsiniz. Her çözümün ardından yapay zekâdan anında geri bildirim alırsınız.",
          },
        },
        {
          "@type": "Question",
          name: "Python sqlite3 alıştırma soruları nasıl çözülür?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Python sqlite3 modülü ile veritabanı bağlantısı kurma, tablo oluşturma, CRUD işlemleri (INSERT, SELECT, UPDATE, DELETE) ve basit JOIN sorguları en çok sorulan konulardır. Tüm bu işlemleri platformdaki sandbox ortamında pratik edebilirsiniz.",
          },
        },
        {
          "@type": "Question",
          name: "Pandas alıştırma soruları ile nasıl pratik yapılır?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Gerçek veri setleri üzerinde veri temizleme (cleaning), gruplama (groupby), birleştirme (merge) ve görselleştirme pratikleri yaparak interaktif sandbox'ta kod çalıştırarak hazırlanabilirsiniz.",
          },
        },
        {
          "@type": "Question",
          name: "Python veri bilimi mülakatına nasıl hazırlanılır?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pandas (veri temizleme, groupby, merge), Scikit-learn (pipeline, cross-validation, feature engineering), istatistik (A/B testi, dağılım), SQL ve zaman serisi analizi en sık sorulan ileri düzey konulardır. Platformumuzda bu konuların her biri için interaktif sorular mevcuttur.",
          },
        },
        {
          "@type": "Question",
          name: "Python mülakat hazırlığı için kurulum gerekiyor mu?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Hayır. pythonmulakat.com tamamen tarayıcı tabanlıdır. Python, Pyodide veya herhangi bir kütüphane kurmanıza gerek yoktur. Hesap açıp hemen kodlamaya başlayabilirsiniz.",
          },
        },
        {
          // 📌 Ubersuggest 9.9K vol — python online
          "@type": "Question",
          name: "Python online olarak nasıl pratik yapılır?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Python online pratik için pythonmulakat.com'u kullanabilirsiniz: tarayıcı tabanlı editörde Python kodu yazarsınız, kodu çalıştırır, test case'lerini geçerek interaktif şekilde öğrenirsiniz. Kurulum gerekmez, hesabınızla her cihazdan erişebilirsiniz.",
          },
        },
        {
          // 📌 Ubersuggest 1.3K vol — python eğitimi
          "@type": "Question",
          name: "Python eğitimi için en iyi kaynak hangisidir?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Python eğitimi için interaktif pratik en etkili yöntemdir. pythonmulakat.com sıfırdan ileri seviyeye kadar tüm konularda (veri tipleri, OOP, SQLite, Pandas, algoritma) hazır sorular, otomatik test ve yapay zekâ destekli geri bildirim sunar.",
          },
        },
        {
          // 📌 Ubersuggest 1.3K vol — python kodları
          "@type": "Question",
          name: "Python kodları örnekleri nereden bulunur?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Python kodları örnekleri için platformumuzdaki soru bankasını kullanabilirsiniz. Her soruda başlangıç kodu (starter_code) ile birlikte örnek input/expected çıktılar yer alır; kodunuzu yazıp doğrudan test edebilirsiniz.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className="dark">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),
                    dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NJMG2G2F');
          `}
        </Script>

        {/* 📌 Pyodide artık self-hosted (Vercel CDN, aynı origin).
            Her sayfada preload/preconnect YAPMA — sadece workspace açılınca
            lazy yüklensin (~14MB tasarruf, LCP + Lighthouse mobile ↑).
            Analytics DNS-prefetch aşağıda kaldı (GTM/GA hâlâ 3rd-party). */}
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} bg-slate-950 text-white antialiased min-h-screen`}
        suppressHydrationWarning
      >
        <ClientOnly fallback={<div style={{ height: 64 }} />}>
        <GlobalNav />
      </ClientOnly>

        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NJMG2G2F"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* <Toaster position="top-right" theme="dark" richColors closeButton /> */}
        {children}
        <ClientOnly>
        <ConditionalFooter />
      </ClientOnly>
      <ClientOnly>
        <CookieConsent />
      </ClientOnly>
      </body>
    </html>
  );
}
// ─── Footer — ayrı dosyaya taşındı (components/Footer.tsx) ─────────
