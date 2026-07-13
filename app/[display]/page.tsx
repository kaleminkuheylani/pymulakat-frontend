// app/[display]/page.tsx
//
// TEK DİNAMİK ROUTE — 8 kategori top-level display URL'sinden render.
//
// URL: /{display} (örn. /heap, /pandas, /temelleri, /veri-yapilari)
// - Canonical 8: temelleri, veri-yapilari, liste-sozluk, pandas,
//   algoritma-sorulari, heap, stack, dinamik-programlama
// - Legacy alias: python-temelleri (canonical'e 308 redirect edilebilir,
//   veya burada direkt render — şu an 308 tercih edildi, bkz. middleware)
//
// 2026-07-13 refactor: 8 ayrı statik sayfa (app/heap/page.tsx, app/pandas/page.tsx,
// ...) SİLİNDİ. Bu tek dosya tüm kategorileri handle eder.
//
// ISR + on-demand revalidation:
//   - generateStaticParams() → build sırasında 8 display slug pre-render
//   - dynamicParams=true → build sonrası eklenen kategori (DB'de) on-demand
//   - revalidate=3600 (1 saat)
//   - Tag: "category-{db}" → /api/revalidate ile anında invalidate
//
// SEO:
//   - generateMetadata() DB-FIRST title/description
//   - JSON-LD: CollectionPage + ItemList + BreadcrumbList
//   - canonical: /{display} (top-level, redirect yok)
//
// Auth:
//   - Public (misafir görür, kod çalıştırma ayrı component — GuestEditorGate)
//
// Cache:
//   - Server-side fetch: INTERNAL_API_URL (k8s/docker internal)
//   - Tag: CACHE_TAGS.CATEGORY(dbSlug) + CACHE_TAGS.CATEGORIES_LIST

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCategoryPageData, getAllQuestions } from "@/lib/api/questionAPI";
import { BASE_URL } from "@/lib/seo";
import {
  displayToDb,
  listAllDisplaySlugs,
  getCategoryLabel,
} from "@/lib/categorySlug";
import QuestionListItem from "@/components/QuestionListItem";

// ─── ISR config ──────────────────────────────────────────────
export const revalidate = 3600; // 1 saat ISR
// Build sırasında bilinmeyen bir display slug gelirse on-demand render
// (DB-FIRST: yeni kategori slug'ı DB'ye eklenince /{yeni} çalışır)
export const dynamicParams = true;

// ─── generateStaticParams (build-time pre-render) ────────────
// Tüm bilinen display URL'ler (canonical + legacy) build'de HTML üretir.
// "python-temelleri" gibi legacy URL'ler de pre-render edilir; middleware
// 308 tercih edebilir ama pre-render zarar vermez (cached HTML).
export async function generateStaticParams() {
  return listAllDisplaySlugs().map((display) => ({ display }));
}

// ─── generateMetadata (SEO) ──────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ display: string }>;
}): Promise<Metadata> {
  const { display } = await params;
  const dbSlug = displayToDb(display);
  if (!dbSlug) {
    return { title: "Kategori bulunamadı | PythonMulakat" };
  }

  const { meta, questions } = await getCategoryPageData(dbSlug);
  if (!meta) {
    return { title: "Kategori bulunamadı | PythonMulakat" };
  }

  // Label + count (zengin meta description)
  const label = meta.label ?? getCategoryLabel(dbSlug);
  const desc = meta.description ||
    `${label} konusunda ${questions.length} Python mülakat sorusu. Tarayıcı tabanlı editör, otomatik test case ve anında geri bildirim ile pratik yapın.`;
  const canonical = `${BASE_URL}/${display}`;

  return {
    title: `${label} Soruları — Python Mülakat Hazırlığı | PythonMulakat`,
    description: desc,
    keywords: [
      label,
      "python mülakat soruları",
      `python ${dbSlug}`,
      `${dbSlug} soruları`,
      "python pratik",
    ],
    alternates: { canonical },
    openGraph: {
      title: `${label} Soruları — Python Mülakat Hazırlığı`,
      description: desc,
      url: canonical,
      siteName: "PythonMulakat",
      locale: "tr_TR",
      type: "website",
      images: [{ url: `${BASE_URL}/og-default.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${label} Soruları — Python Mülakat Hazırlığı`,
      description: desc,
      images: [`${BASE_URL}/og-default.png`],
    },
  };
}

// ─── JSON-LD builders ────────────────────────────────────────
function buildCollectionPageSchema(
  meta: { label?: string; description?: string; slug?: string },
  questionCount: number,
  display: string,
  baseUrl: string
) {
  const slug = meta.slug ?? "";
  const label = meta.label ?? slug;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${label} Soruları`,
    description: meta.description ?? `${label} konusunda Python mülakat soruları.`,
    url: `${baseUrl}/${display}`,
    isPartOf: { "@type": "WebSite", name: "PythonMulakat", url: baseUrl },
    mainEntity: { "@type": "ItemList", numberOfItems: questionCount },
  };
}

function buildItemListSchema(
  questions: Array<{ id: number; title: string; slug: string | null; category: string; level: string }>,
  display: string,
  baseUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${display} soruları`,
    itemListElement: questions.slice(0, 50).map((q, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Question",
        name: q.title,
        url: `${baseUrl}/interviews/${q.category}/${q.slug ?? q.id}`,
        educationalLevel: q.level,
      },
    })),
  };
}

function buildBreadcrumbSchema(
  display: string,
  label: string,
  baseUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Sorular", item: `${baseUrl}/interviews` },
      { "@type": "ListItem", position: 3, name: label, item: `${baseUrl}/${display}` },
    ],
  };
}

// ─── Page ───────────────────────────────────────────────────
export default async function CategoryDisplayPage({
  params,
}: {
  params: Promise<{ display: string }>;
}) {
  const { display } = await params;

  // display → DB slug (canonical 8 + legacy alias)
  const dbSlug = displayToDb(display);
  if (!dbSlug) {
    // Bilinmeyen top-level path → 404. Statik rotalar (about, admin, ...) zaten
    // kendi sayfalarını render eder; bu catch-all'a düşmez.
    notFound();
  }

  // DB'den kategori meta + soru listesi
  // (lib/api/questionAPI.ts → getCategoryPageData, tag'li cache'li)
  const { meta, questions } = await getCategoryPageData(dbSlug);
  if (!meta) {
    notFound();
  }

  // UI label normalize
  const label = meta.label ?? getCategoryLabel(dbSlug);
  const baseUrl = BASE_URL;

  // JSON-LD (3 katman)
  const collectionSchema = buildCollectionPageSchema(meta, questions.length, display, baseUrl);
  const itemListSchema = buildItemListSchema(questions, display, baseUrl);
  const breadcrumbSchema = buildBreadcrumbSchema(display, label, baseUrl);

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* SEO: structured data (3 katman) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* ─── Breadcrumb (DB label, semantik ol/li) ─── */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm">
          <ol className="flex flex-wrap items-center gap-1 text-white/60">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Ana Sayfa
              </Link>
            </li>
            <li className="text-white/30">/</li>
            <li>
              <Link href="/interviews" className="hover:text-white transition-colors">
                Sorular
              </Link>
            </li>
            <li className="text-white/30">/</li>
            <li>
              <strong className="text-white font-medium">{label}</strong>
            </li>
          </ol>
        </nav>

        {/* ─── Hero (DB-FIRST: label + description) ─── */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {label} Soruları
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl">
            {meta.description ||
              `${label} konusunda Python mülakat soruları ve çözümleri.`}
          </p>
          <div className="mt-3 text-sm text-white/50">
            {questions.length} soru · Tarayıcıda çöz, otomatik test et
          </div>
        </header>

        {/* ─── Soru listesi (DB-FIRST, SSR + paylaşılan component) ─── */}
        <ul className="space-y-3" data-ssr-category-list={display}>
          {questions.length === 0 ? (
            <li className="text-white/50 text-sm py-8 text-center">
              Bu kategoride henüz soru yok.
            </li>
          ) : (
            questions.map((q) => (
              <QuestionListItem
                key={q.id}
                question={q}
                categorySlug={dbSlug}
                // category label göstermeye gerek yok — zaten bu sayfanın konusu
              />
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
