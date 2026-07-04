import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./global.css";
import Script from "next/script";
import GlobalNav from "../components/GlobalNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ────────────────────────────────────────────────────────────
// 🌐 GLOBAL SEO METADATA
// ────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://pythonmulakat.com"),

  title: {
    default:
      "Python Mülakat Hazırlığı | Yeni Başlayanlar İçin Ücretsiz Pratik",
    template: "%s | Python Mülakat",
  },

  description:
    "Sıfırdan Python öğrenenler için Türkçe interaktif mülakat platformu. Veri tipleri, OOP, SQLite, Pandas ve algoritmik düşünme sorularını tarayıcıda kodlayarak çöz, yapay zekâdan anında geri bildirim al. Ücretsiz, kurulum gerektirmez.",

  keywords: [
    // Temel / Yeni başlayan
    "python yeni başlayanlar",
    "python temel konular",
    "python öğreniyorum",
    "sıfırdan python",
    "python başlangıç seviye",
    "python kolay öğren",
    "python dersleri türkçe",

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
    "python mülakat soruları yeni başlayan",
    "python mülakat hazırlık",
    "python basit uygulama örnekleri",
    "python beyin fırtınası soruları",
    "python kodlama mülakatı",
    "junior python developer mülakat soruları",

    // Veritabanı / Kütüphaneler
    "python sqlite3 soruları",
    "python sqlite3 alıştırma",
    "python pandas alıştırma soruları",
    "python veri bilimi mülakat",

    // Platform odaklı (marka)
    "python online sandbox türkçe",
    "python interaktif öğrenme",
    "yapay zeka destekli python pratiği",
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
    title: "Python Mülakat Hazırlığı | Yeni Başlayanlar İçin Ücretsiz Pratik",
    description:
      "Sıfırdan Python öğrenenler için Türkçe interaktif mülakat soruları. OOP, SQLite, Pandas, sandbox ve anlık AI geri bildirimi.",
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
    title: "Python Mülakat Hazırlığı | Yeni Başlayanlar İçin",
    description:
      "Türkçe interaktif Python mülakat soruları. OOP, veri tipleri, SQLite, sandbox ve anlık AI geri bildirimi.",
    images: ["https://pythonmulakat.com/og-default.png"],
    creator: "@pythonmulakat",
  },

  // ── Canonical & Alternates ──────────────────────────────────
  alternates: {
    canonical: "https://pythonmulakat.com",
    languages: { "tr-TR": "https://pythonmulakat.com" },
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
      url: "https://pythonmulakat.com",
      logo: {
        "@type": "ImageObject",
        url: "https://pythonmulakat.com/og-default.png",
        width: 1200,
        height: 630,
      },
      description:
        "Python öğrenmeye yeni başlayanlar için Türkçe interaktif mülakat hazırlık platformu.",
      sameAs: [],
    },

    // ── WebSite + SearchAction ────────────────────────────────
    {
      "@type": "WebSite",
      "@id": "https://pythonmulakat.com/#website",
      url: "https://pythonmulakat.com",
      name: "Python Mülakat",
      description:
        "Python öğrenmeye yeni başlayanlar için gerçek dünya mülakat soruları, interaktif sandbox ve AI geri bildirimi.",
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

    // ── Course (Yeni: Eğitim içeriği olarak işaretle) ─────────
    {
      "@type": "Course",
      "@id": "https://pythonmulakat.com/#course",
      name: "Yeni Başlayanlar İçin Python Mülakat Hazırlığı",
      description:
        "Python'a yeni başlayanlar için veri tipleri, OOP, SQLite, Pandas ve algoritmik düşünme konularını kapsayan interaktif mülakat hazırlık kursu.",
      provider: { "@id": "https://pythonmulakat.com/#organization" },
      url: "https://pythonmulakat.com",
      inLanguage: "tr-TR",
      educationalLevel: "Beginner",
      teaches:
        "Python temel konular, nesne yönelimli programlama, SQLite, Pandas, algoritmik düşünme",
      audience: {
        "@type": "EducationalAudience",
        educationalRole: "student",
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        location: {
          "@type": "VirtualLocation",
          url: "https://pythonmulakat.com",
        },
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
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-950 text-white antialiased`}
      >
        <GlobalNav />

        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NJMG2G2F"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <Toaster position="top-right" theme="dark" richColors closeButton />
        {children}
        <Footer />
      </body>
    </html>
  );
}
// ─── Footer — her sayfada alt kısımda ─────────────────────
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-white/5 bg-[#0a0e1a]/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Marka */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/20">
                🐍
              </div>
              <span className="font-bold text-white">PythonMulakat</span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Tarayıcıda Python mülakat hazırlığı.
              Kurulum yok, 60 saniyede ilk soruyu çöz.
            </p>
          </div>

          {/* Ürün */}
          <div>
            <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3">
              Ürün
            </h4>
            <ul className="space-y-2 text-xs text-white/50">
              <li>
                <a href="/interviews" className="hover:text-white transition-colors">
                  Sorular
                </a>
              </li>
              <li>
                <a href="/guides" className="hover:text-white transition-colors">
                  Rehberler
                </a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/dashboard/forms" className="hover:text-white transition-colors">
                  Topluluk
                </a>
              </li>
            </ul>
          </div>

          {/* Kaynak */}
          <div>
            <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3">
              Kaynak
            </h4>
            <ul className="space-y-2 text-xs text-white/50">
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  Hakkında
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white transition-colors">
                  Kullanım Şartları
                </a>
              </li>
              <li>
                <a href="/profile" className="hover:text-white transition-colors">
                  Profil
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-white transition-colors">
                  Giriş Yap
                </a>
              </li>
            </ul>
          </div>

          {/* Teknoloji */}
          <div>
            <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3">
              Teknoloji
            </h4>
            <ul className="space-y-2 text-xs text-white/50">
              <li className="flex items-center gap-2">
                <span>⚡</span>
                <span>Pyodide (WASM)</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🧠</span>
                <span>Gemini AI</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🗄️</span>
                <span>Supabase</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🚀</span>
                <span>Next.js 14</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt çizgi */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/40">
            © {year} PythonMulakat · pythonmulakat.com
          </p>
          <p className="text-[11px] text-white/40">
            KVKK uyumlu · Kod tarayıcıda çalışır, sunucuya gönderilmez
          </p>
        </div>
      </div>
    </footer>
  );
}
