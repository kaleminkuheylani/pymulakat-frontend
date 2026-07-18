// app/interviews/[category]/[id]/page.tsx
// SEO-optimized: server-side metadata, HowTo schema, breadcrumb, related questions
// Supports BOTH slug-based URLs (/interviews/python-basics/palindrom-kontrol)
// AND legacy ID URLs (/interviews/python-basics/3) — slug gelirse ID'ye resolve eder
//
// <Pin className="w-3 h-3 inline" /> CSV-FIRST: Yeni eklenen sorular henüz DB'de olmayabilir (Railway deploy
// gecikebilir). Bu yüzden önce CSV'den (jsDelivr CDN, GitHub main) çekiyoruz,
// bulamazsak backend DB'ye düşüyoruz. Her iki kaynak aynı şemaya normalize
// ediliyor, downstream kod değişmiyor.
import { Check, Download, Eye, Lightbulb, Pin } from "lucide-react";
import { getCategoryLabel, getCategoryUrl, legacyDisplayToDb } from "@/lib/categorySlug";
import { getCategoryMeta } from "@/lib/api/categoryAPI";

import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
// <Pin className="w-3 h-3 inline" /> Code splitting (2026-07-11, kalıcı): Workspace artık mobile/desktop
// switch'i kendi içinde yapıyor. page.tsx server-side isMobileDevice() ile
// variant'ı hesaplayıp <Workspace variant="mobile|desktop" ... /> geçirir.
import Workspace from "./components/workspace";
import WorkspaceErrorBoundary from "@/components/workspace/WorkspaceErrorBoundary";
import Breadcrumb from "@/components/Breadcrumb";
import { slugifyTitle } from "@/lib/questionMeta";
import { findQuestion, slugifyTitle as csvSlugify } from "@/lib/api/questionAPI";
import type { ApiQuestion, ApiQuestionTests } from "@/lib/api/types";
import { getQuestionTests } from "@/lib/api/questionAPI";
import { BASE_URL } from "@/lib/seo";

// Tüm soru verisi backend DB'den gelir — kod-içi fallback YOK.

// ISR + on-demand revalidation (2026-07-13 refactor):
//   - revalidate=3600: 1 saat cache
//   - dynamicParams=true: build sonrası eklenen slug'lar da çalışır
//   - Tags: question-{cat}-{slug}, category-{cat}, questions-list →
//     tek endpoint değişince ilgili tüm cache'ler düşer
// Not: Bu sayfayı `generateMetadata()` zaten yönetiyor; sayfanın kendisi
// force-dynamic yerine ISR kullanıyor → build-time pre-render, runtime cache.
export const revalidate = 3600;
export const dynamicParams = true;

interface PageProps {
  // Yeni top-level route: /{display}/{slug} (ör: /temelleri/palindrome-checker)
  // category = display URL, slug = soru slug
  params: Promise<{ category: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// ─── generateStaticParams (build-time pre-render) ────────────
// İlk 100 soruyu build sırasında pre-render et (sitemap'te en sık crawl
// edilenler). dynamicParams=true → build sonrası eklenenler on-demand SSR.
export async function generateStaticParams() {
  try {
    // listAllCategorySlugs + getAllQuestions import'a eklemeden inline çekiyoruz
    // (build sırasında DB bağlantısı başarısız olursa [] döner → tüm sayfalar
    //  on-demand render'a düşer, build kırılmaz).
    const { getAllQuestions, listAllCategorySlugs } = await import("@/lib/api/questionAPI");
    const cats = await listAllCategorySlugs();
    const allQs = await getAllQuestions({ limit: 200 });
    return allQs
      .filter((q) => cats.includes(q.category) && q.slug)
      .slice(0, 100)
      .map((q) => ({ category: q.category, slug: q.slug! }));
  } catch {
    // DB erişilemezse pre-render atla, tüm sayfalar on-demand ISR'a düşer
    return [];
  }
}

interface SEOQuestion {
  id: number;
  title: string;
  description: string;
  explanation?: string;
  complexity?: string;
  level: string;
  category: string;
  related_concepts?: string[];
  related_question_ids?: number[];
  slug?: string;
  related_questions?: Array<{ id: number; title: string; category: string; level: string; slug: string }>;
  tutorial_slug?: string;
  hints?: string[];
  tags?: string[];
  starter_code?: string;
}

// <Pin className="w-3 h-3 inline" /> SSR test case formatı: input / expected / actual / description.
//    Misafirler de okuyabilsin diye public — auth gerekmez.
interface SSRTestCase {
  input: unknown;
  expected: unknown;
  actual?: unknown;
  description?: string;
}
interface SSRQuestionTests {
  question_id: number;
  function_name: string;
  test_cases: SSRTestCase[];
}

// ─── CSV → DB Question normalizasyonu ─────────────────────────
function csvToSEOQuestion(q: ApiQuestion, actualId: number, slug: string): SEOQuestion {
  // DB-FIRST: test_cases ayrı endpoint'ten geliyor (burada [] geçici)
  const testCases: unknown[] = [];
  // hints API zaten array dönüyor (string değil)
  const hints: string[] = q.hints || [];

  return {
    id: actualId,
    title: q.title,
    description: q.description,
    level: q.level,
    category: q.category,
    slug,
    starter_code: q.starter_code ?? undefined,
    hints,
    // test_cases detay sayfada ayrı çekiliyor, ama yine de hazır
    tags: [],
  };
}



function displayToInternal(display: string): string {
  // legacyDisplayToDb: /heap → heap, /python-temelleri → python-basics, vb.
  return legacyDisplayToDb("/" + display) ?? display;
}

// ─── Server-side test cases fetch (SSR: misafirler de okuyabilsin) ─────
async function fetchQuestionTests(category: string, slugOrId: string): Promise<SSRQuestionTests | null> {
  // DB-FIRST mimari: lib/api/questionAPI.ts → getQuestionTests()
  try {
    // Önce meta + slug al
    const metaQ = await findQuestion(category, slugOrId);
    if (!metaQ) return null;
    // Sonra test cases (slug üzerinden — ID de kabul eder backend)
    const slug = metaQ.slug || slugOrId;
    const data: ApiQuestionTests | null = await getQuestionTests(category, slug);
    if (!data) return null;
    return {
      question_id: data.question_id ?? metaQ.id,
      function_name: data.function_name ?? "",
      test_cases: (data.test_cases || []).map((c: any) => ({
        input: c.input,
        expected: c.expected,
        // description undefined ise spread ile hiç ekleme (Next.js $undefined bug önleme)
        ...(c.description ? { description: c.description } : {}),
      })),
    };
  } catch {
    return null;
  }
}

// ─── Server-side data fetch ────────────────────────────────
async function fetchQuestionSEO(category: string, id: string): Promise<SEOQuestion | null> {
  // CSV-only mimari: CSV = tek kaynak, backend'e hiç bağlanmıyoruz.
  try {
    const csvQ = await findQuestion(category, id);
    if (!csvQ) return null;
    const slug = csvSlugify(csvQ.title);
    return csvToSEOQuestion(csvQ, csvQ.id, slug);
  } catch {
    return null;
  }
}

async function fetchHasStudy(_questionId: number): Promise<boolean> {
  // CSV-only mimari: guide (study) backend'de tutuluyordu, artık kullanılmıyor.
  // CSV'de guide alanı yoksa hasStudy=false kabul ediyoruz.
  return false;
}

// ─── Related questions fetch (batch) ─────────────────────
// (Kaldırıldı: Workspace client kendi fetch'ini yapıyor, SSR enrichment gereksiz.)

// ─── generateMetadata (SEO) ───────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const q = await fetchQuestionSEO(category, slug);
  if (!q) {
    return { title: "Soru bulunamadı | Python Mülakat" };
  }

  // 2026-07-13: Conversion-friendly title — "soru bankası" + "çözüm" + "açıklama"
  //   niyet kelimeleri. Hem keşif hem long-tail niyet için optimize.
  const level = q.level || "junior";
  const title = `${q.title} — ${level} Seviye Python ve JavaScript Mülakat Sorusu`;
  // 2026-07-13: Description'a CTA eklendi (ücretsiz dene + test case + AI).
  //   155-160 char Google snippet hedefi.
  const rawDesc = q.explanation
    ? q.explanation.replace(/[*#`]/g, "").slice(0, 130)
    : `${q.title} — ${level} seviye Python ve JavaScript mülakat sorusu.`;
  const description = `${rawDesc} Tarayıcıda çöz, test case'lerle dene, AI geri bildirim al. Şimdilik ücretsiz.`;

  // 2026-07-13 v2 (spam-risk reduction): 5 long-tail varyasyon → 1 ana + 1 spec.
  //   Önceki "{X} çözümü/açıklaması/kodu/algoritması" 4 varyasyon aynı
  //   sayfaya işaret ediyordu → duplicate content. Şimdi: "{q.title} çözümü"
  //   (en yüksek niyet) + kategori seviyesi + 1-2 spesifik kavram.
  const levelKw = level === "advanced" ? "ileri seviye python" :
                  level === "intermediate" ? "orta seviye python" :
                  "başlangıç python";
  const keywords = [
    q.title,
    `${q.title} çözümü`,
    `python ${q.category}`,
    levelKw,
    "python mülakat sorusu",
    ...(q.related_concepts || []).slice(0, 3), // max 3 spesifik kavram
  ].join(", ");

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${BASE_URL}/interviews/${q.category}/${q.slug || slugifyTitle(q.title)}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/interviews/${q.category}/${q.slug || slugifyTitle(q.title)}`,
      siteName: "PythonMulakat",
      locale: "tr_TR",
      type: "article",
      images: [{ url: `${BASE_URL}/og-default.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/og-default.png`],
    },
  };
}

// ─── HowTo schema builder ─────────────────────────────────
function buildHowToSchema(q: SEOQuestion, baseUrl: string) {
  const steps: { name: string; text: string }[] = [];

  if (q.explanation) {
    const matches = q.explanation.matchAll(/(\d+)\.\s+\*\*([^*]+?)\*\*[—\-:]\s*(.+?)(?=\n|$)/g);
    for (const m of matches) {
      steps.push({ name: m[2].trim(), text: m[3].trim() });
    }
    if (steps.length === 0) {
      const firstSentence = q.explanation.split(/[.!?]/)[0];
      steps.push({ name: q.title, text: firstSentence });
    }
  }

  return {
    "@context": "https://schema.org",
// DEPRECATED Google rich result (May 2026 itibarıyla SERP'te gösterilmiyor). Schema.org tipi valid; sayfada bırakılıyor (Bing/Perplexity/LLM crawler için). Yeni geliştirmede Article/TechArticle + LearningResource + Course + BreadcrumbList kullan.
        "@type": "HowTo",
    name: `Python ${q.title} Çözümü`,
    description: q.explanation?.slice(0, 200) || q.description,
    totalTime: `PT${q.complexity?.includes("log") ? "10M" : "5M"}`,
    estimatedCost: { "@type": "MonetaryAmount", currency: "TRY", value: "0" },
    tool: [{ "@type": "HowToTool", name: "Python 3" }],
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
    author: { "@type": "Organization", name: "PythonMulakat", url: baseUrl },
  };
}

// ─── Breadcrumb schema ────────────────────────────────────
async function buildBreadcrumbSchema(category: string, slug: string, title: string, baseUrl: string) {
  // DB-FIRST: kategori label'ı DB'den (kullanici direktifi 2026-07-13)
  const meta = await getCategoryMeta(category);
  const categoryLabel = meta?.label ?? getCategoryLabel(category);
  // Canonical category: /{display} (top-level, ISR pre-rendered)
  // Question detail: /interviews/{db_category}/{slug} (canonical)
  const categoryUrl = `${baseUrl}${getCategoryUrl(category)}`;
  const questionUrl = `${baseUrl}/interviews/${category}/${slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Sorular", item: `${baseUrl}/interviews` },
      { "@type": "ListItem", position: 3, name: categoryLabel, item: categoryUrl },
      { "@type": "ListItem", position: 4, name: title, item: questionUrl },
    ],
  };
}

async function isMobileDevice(): Promise<boolean> {
  try {
    const h = await headers();
    const ua = h.get("user-agent") || "";
    return /android|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua.toLowerCase())
      || /ipad|android(?!.*mobile)/i.test(ua.toLowerCase());
  } catch {
    return false;
  }
}

// ─── FAQ schema builder — her soru sayfasında page-specific Q&A ──
// <Pin className="w-3 h-3 inline" /> Long-tail yakalama: "X sorusu nasıl çözülür?", "X Python'da ne işe yarar?"
//     gibi sorular için rich result şansı.
function buildFaqSchema(q: SEOQuestion, baseUrl: string) {
  const slug = q.slug || slugifyTitle(q.title);
  const url = `${baseUrl}/interviews/${q.category}/${slug}`;
  const functionMatch = (q.description || "").match(/def\s+([a-zA-Z_]\w*)\s*\(/);
  const funcName = functionMatch ? functionMatch[1] : null;

  const mainEntity: Array<{ "@type": string; name: string; acceptedAnswer: { "@type": string; text: string } }> = [
    {
      "@type": "Question",
      name: `${q.title} sorusu Python'da nasıl çözülür?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${q.title} sorusu için ${q.level || "beginner"} seviye Python bilgisi yeterlidir. ${
          q.explanation
            ? "Yaklaşım: " + q.explanation.replace(/[*#`]/g, "").slice(0, 280) + "..."
            : "Soru açıklamasını ve örnek test case'leri inceleyip tarayıcı tabanlı editörde çözebilirsiniz."
        } Detaylı çözüm için ${url} adresini ziyaret edin.`,
      },
    },
    {
      "@type": "Question",
      name: `${q.title} için hangi Python konuları gerekli?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `Bu soru için şu konular faydalıdır: ${
          (q.related_concepts || []).join(", ") || "string/liste temelleri, döngüler ve koşullar"
        }.`,
      },
    },
  ];

  if (funcName) {
    mainEntity.push({
      "@type": "Question",
      name: `Python'da ${funcName} fonksiyonu nasıl yazılır?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `Python'da ${funcName} fonksiyonunu yazmak için ${q.category || "python-basics"} kategorisindeki bu soruyu interaktif editörde çözebilirsiniz. Başlangıç kodu (starter_code) ve beklenen test case'leri sayfada yer alır. Çözüm: ${url}`,
      },
    });
  }

  return {
    "@context": "https://schema.org",
    // DEPRECATED Google rich result (May 2026 itibarıyla SERP'te gösterilmiyor). Schema.org tipi valid; sayfada bırakılıyor (Bing/Perplexity/LLM crawler için). Yeni geliştirmede Article/TechArticle + LearningResource + Course + BreadcrumbList kullan.
    "@type": "FAQPage",
    mainEntity,
  };
}

// ─── Page ─────────────────────────────────────────────────
export default async function Page({ params, searchParams }: PageProps) {
  const [resolvedParams, resolvedSearch] = await Promise.all([params, searchParams]);
  // <Pin className="w-3 h-3 inline" /> ?readonly=true → mobile client'ta editör kilitli + Run butonu yok
  //    Demo/embed/paylaşım linkleri için.
  const readonly = resolvedSearch?.readonly === "true";

  // <Check className="w-3.5 h-3.5 inline" /> Canonical routing middleware tarafindan yonetiliyor:
  //   - /interviews/{cat}/{slug}  → burada render (canonical, indexlenir)
  //   - /{display}/{slug}    → middleware slug URL'e yonlendirir (308)
  // Burada slug'in gecerli oldugunu dogrulayip fetch ediyoruz.
  //
  // ⚠️ parseInt('0-1-knapsack') === 0 (parseInt leading digit'i alir),
  //    isNaN(0) === false → slug olarak davranmiyor → 404.
  //    Cozum: sadece /^\d+$/ ise ID kabul et, aksi halde slug.
  //
  // <Pin className="w-3 h-3 inline" /> CSV-only mimari: resolvedId sadece URL /^\d+$/ ise set edilir.
  //    Slug geliyorsa resolvedId null kalır → fetchQuestionSEO CSV'den
  //    slug'ı bulur, notFound() tetiklenmez.
  let resolvedId: number | null = null;
  const _isPureId = /^\d+$/.test(resolvedParams.slug);
  if (_isPureId) {
    resolvedId = parseInt(resolvedParams.slug, 10);  // Eski ID URL
  }
  // (Eski backend by-slug çözümlemesi kaldırıldı — CSV-only mimari.)
  // Slug ile geldiyse resolvedId null olabilir — bu durumda WorkspaceClient
  // kendi fetch'iyle soruyu çekecek. notFound() sadece gerçekten bulunamadıysa çağrılır.
  const isSlugRequest = !_isPureId;
  if (!resolvedId && !isSlugRequest) {
    notFound();
  }

  // DB-FIRST mimari: lib/api/questionAPI.ts üzerinden çek
  // (2 paralel fetch — question meta + test cases)
  const internalCat = displayToInternal(resolvedParams.category);
  process.stderr.write(`[detay] URL ${resolvedParams.category}/${resolvedParams.slug} -> internal ${internalCat}\n`);
  let apiQ = null;
  let ssrTestsRaw = null;
  let findError = null;
  try {
    apiQ = await findQuestion(internalCat, resolvedParams.slug);
    process.stderr.write(`[detay] apiQ: ${apiQ ? `id=${apiQ.id} title=${apiQ.title}` : "null"}\n`);
  } catch (e: any) {
    findError = e?.message ?? String(e);
    process.stderr.write(`[detay] findQuestion ERR: ${findError} stack: ${e?.stack?.slice(0, 500)}\n`);
  }
  try {
    ssrTestsRaw = await getQuestionTests(internalCat, resolvedParams.slug);
  } catch (e: any) {
    process.stderr.write(`[detay] getQuestionTests ERR: ${e?.message ?? e}\n`);
  }
  
  
  const mobile = await isMobileDevice();
  // Resolve seoQ + ssrTests aynı request'ten (cache + tutarlı)
  const csvQ = apiQ;
  const seoQ = csvQ ? csvToSEOQuestion(csvQ, csvQ.id, csvSlugify(csvQ.title)) : null;
  const ssrTests: SSRQuestionTests | null = csvQ && ssrTestsRaw
    ? {
        question_id: ssrTestsRaw.question_id ?? csvQ.id,
        function_name: ssrTestsRaw.function_name ?? "",
        test_cases: (ssrTestsRaw.test_cases || []).map((c: any) => ({
          input: c.input,
          expected: c.expected,
          ...(c.description ? { description: c.description } : {}),
        })),
      }
    : null;

  // <Pin className="w-3 h-3 inline" /> Guide (DB-backed analiz) var mı? Sadece DB'den gelirse CTA göster,
  // CSV metadata fallback yetersiz.
  const initialHasStudy = seoQ?.id ? await fetchHasStudy(seoQ.id) : false;

  // Workspace client kendi fetch'ini yapıyor; burada sadece SEO schema'ları için kullanıyoruz.
  // <Pin className="w-3 h-3 inline" /> SSR: initial data'yı server'da geçiriyoruz — client'ta loading state atlanıyor.
  // Code splitting: <Workspace variant="mobile|desktop" /> kendi içinde
  //   uygun client'ı React.lazy ile mount eder (Suspense fallback korunur).
  const variant: "mobile" | "desktop" = mobile ? "mobile" : "desktop";
  const initialInterview = seoQ ? {
    id: seoQ.id,
    title: seoQ.title,
    description: seoQ.description,
    level: seoQ.level,
    category: seoQ.category,
    starter_code: (seoQ as any).starter_code || "",
    tags: seoQ.tags || [],
    hints: seoQ.hints || [],
    slug: seoQ.slug || csvSlugify(seoQ.title),
  } : null;
  // SSR'dan gelen test case verisi — her iki client da prop olarak alır (misafirler dahil).
  const initialTests: any = ssrTests;
  // Kategori label (DB'den) — breadcrumb + Workspace header için
  const categoryMeta = await getCategoryMeta(internalCat);
  const categoryLabel = categoryMeta?.label ?? internalCat;
  const baseUrl = BASE_URL;
  const howToSchema = seoQ ? buildHowToSchema(seoQ, baseUrl) : null;
  const breadcrumbSchema = seoQ
    ? await buildBreadcrumbSchema(resolvedParams.category, resolvedParams.slug, seoQ.title, baseUrl)
    : null;

  // <Pin className="w-3 h-3 inline" /> SSR Content — Googlebot ve JS olmadan da içeriği görsün
  // description + starter_code + test_cases + hints server-side HTML'e basılıyor.
  const ssrTitle = seoQ?.title ?? `Soru #${resolvedId}`;
  const ssrDescription = seoQ?.description ?? "";
  const ssrHints = seoQ?.hints ?? [];
  const ssrComplexity = seoQ?.complexity ?? "";
  const ssrLevel = seoQ?.level ?? "";
  const ssrTestCases: SSRTestCase[] = initialTests?.test_cases ?? [];

  return (
    <>
      {/* SEO: HowTo Schema */}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
      {/* SEO: Breadcrumb */}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {/* <Pin className="w-3 h-3 inline" /> SEO: FAQ schema — page-specific Q&A, Google rich results + long-tail capture.
          Her soru sayfasında "Bu Python sorusu hangi konuları kapsar?" / "Hangi
          fonksiyon imzası bekleniyor?" gibi doğal sorularla hedefliyoruz. */}
      {seoQ && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(seoQ, baseUrl)) }}
        />
      )}

      {/* <Pin className="w-3 h-3 inline" /> SSR Content Block — JS yüklenmeden de Googlebot + kullanıcı görsün
          Hem desktop hem mobile için responsive: küçük ekranda padding/font azalır.
          JS yüklenince script ile gizlenir (client component kendi UI'ini gösterir).
          JS yoksa (Googlebot ilk crawl, no-JS kullanıcı) içerik görünür kalır. */}
      <div
        data-ssr-question
        className="ssr-question-block bg-[#050816] text-white px-4 py-6 sm:px-6 sm:py-8 md:max-w-3xl md:mx-auto"
      >
        <Breadcrumb
          category={resolvedParams.category}
          slug={resolvedParams.slug}
          title={ssrTitle}
        />
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">{ssrTitle}</h1>
        <div className="flex flex-wrap gap-2 mb-4 text-xs sm:text-sm text-white/60">
          <mark className="px-2 py-0.5 rounded bg-white/5 border border-white/10">{ssrLevel}</mark>
          {ssrComplexity && <mark className="px-2 py-0.5 rounded bg-white/5 border border-white/10">{ssrComplexity}</mark>}
        </div>
        {ssrDescription && (
          <div className="text-sm sm:text-base whitespace-pre-wrap text-white/80 leading-relaxed mb-6">
            {ssrDescription}
          </div>
        )}
        {ssrHints.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 text-amber-400">İpuçları</h2>
            <ul className="space-y-2">
              {ssrHints.map((h, i) => (
                <li key={i} className="text-sm sm:text-base text-white/70 leading-relaxed">
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}
        {seoQ?.explanation && (
          <div className="mt-8 pt-6 border-white/10">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 text-indigo-400">Yaklaşım & Açıklama</h2>
            <div className="text-sm sm:text-base text-white/70 leading-relaxed whitespace-pre-wrap">
              {seoQ.explanation}
            </div>
          </div>
        )}
        {ssrTestCases.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 text-cyan-300">Örnek Test Case'ler</h2>
            <div className="space-y-3">
              {ssrTestCases.map((tc: any, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs sm:text-sm">
                  <div className="font-semibold text-white/60 mb-2 uppercase tracking-wider text-[10px]">
                    Örnek #{i + 1}{tc.description ? ` · ${tc.description}` : ""}
                  </div>
                  <div className="space-y-1.5">
                    <div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider font-bold"><Download className="w-3.5 h-3.5 inline" /> Input</div>
                      <pre className="font-mono text-white/80 bg-black/30 p-1.5 rounded overflow-x-auto">{JSON.stringify(tc.input)}</pre>
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-400/80 uppercase tracking-wider font-bold">✓ Expected</div>
                      <pre className="font-mono text-emerald-300 bg-emerald-500/5 p-1.5 rounded overflow-x-auto">{JSON.stringify(tc.expected)}</pre>
                    </div>
                    {tc.actual !== undefined && tc.actual !== null && (
                      <div>
                        <div className="text-[10px] text-cyan-300/70 uppercase tracking-wider font-bold"><Eye className="w-3.5 h-3.5 inline" /> Actual (referans çıktı)</div>
                        <pre className="font-mono text-cyan-200 bg-cyan-500/5 p-1.5 rounded overflow-x-auto">{JSON.stringify(tc.actual)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-white/40 italic">
              <Lightbulb className="w-3.5 h-3.5 inline" /> Kodu çalıştırmak ve gerçek çıktılarını görmek için üye girişi yapıp editöre geçebilirsin.
            </p>
          </div>
        )}
        <noscript>
          <p className="mt-6 text-amber-300 text-sm">
            <Lightbulb className="w-3.5 h-3.5 inline" /> İnteraktif editör için JavaScript gerekiyor. İçerik yine de görünür durumda.
          </p>
        </noscript>
      </div>

      <div data-client-workspace className="h-[100dvh] flex flex-col overflow-hidden">
        <WorkspaceErrorBoundary categoryUrl={`/${resolvedParams.category}`}>
          <Workspace
            key={resolvedParams.slug}
            variant={variant}
            initialParams={{ ...resolvedParams, id: resolvedParams.slug }}
            readonly={readonly}
            initialInterview={initialInterview as any}
            initialTestCases={initialTests}
            hasStudy={initialHasStudy}
            categoryLabel={categoryLabel}
          />
        </WorkspaceErrorBoundary>
      </div>

      {/* <Pin className="w-3 h-3 inline" /> JS yoksa: üstteki description paneli zaten SSR ile geliyor.
          "Soru yükleniyor" loading JS olmadan takılı kalır, gizle. */}
      <noscript>
        <style>{`[data-client-workspace]{display:none!important}`}</style>
        <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 text-center">
          <p className="text-white/60 text-sm">
            <Lightbulb className="w-3.5 h-3.5 inline" /> İnteraktif editör ve kod çalıştırma için JavaScript gerekiyor.
            Soru açıklamasını yukarıda görebilirsiniz.
          </p>
        </div>
      </noscript>

      {/* <Pin className="w-3 h-3 inline" /> JS yüklenince SSR bloğu useEffect ile kaldırılır (WorkspaceClient / MobileClient)
          — hem desktop hem mobile için aynı davranış. Bu sayede React hydration
          sırasında duplicate render oluşmuyor. */}

    </>
  );
}

