// app/[category]/page.tsx
//
// TEK DİNAMİK ROUTE — 8 kategori top-level DB-slug URL'sinden render.
//
// URL: /{db_slug} (örn. /python-basics, /heap, /pandas, /data-structures)
// - Canonical 8: python-basics, data-structures, list-dict, pandas,
//   algorithms, heap, stack, dynamic-programming
// - SEO iyi: İngilizce, kısa, tutarlı (2026-07-13 kullanıcı direktifi)
//
// 2026-07-13 refactor: 8 ayrı statik sayfa SİLİNDİ + önceki /{display}
// (Türkçe) URL yapısı da bırakıldı. Bu tek dosya tüm kategorileri handle eder.
// Legacy /temelleri, /veri-yapilari vb. → 308 → canonical (middleware).
//
// ISR + on-demand revalidation:
//   - generateStaticParams() → build sırasında 8 DB slug pre-render
//   - dynamicParams=true → build sonrası eklenen kategori (DB'de) on-demand
//   - revalidate=3600 (1 saat)
//   - Tag: "category-{db}" → /api/revalidate ile anında invalidate
//
// SEO:
//   - generateMetadata() DB-FIRST title/description
//   - JSON-LD: CollectionPage + ItemList + BreadcrumbList
//   - canonical: /{db_slug} (top-level, redirect yok)
//
// Auth: Public (misafir görür, kod çalıştırma ayrı component — GuestEditorGate)
//
// Cache:
//   - Server-side fetch: INTERNAL_API_URL (k8s/docker internal)
//   - Tag: CACHE_TAGS.CATEGORY(dbSlug) + CACHE_TAGS.CATEGORIES_LIST

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCategoryPageData } from "@/lib/api/questionAPI";
import { BASE_URL } from "@/lib/seo";
import {
  isCanonicalCategory,
  getCategoryLabel,
  listAllCategorySlugs,
} from "@/lib/categorySlug";
import QuestionListItem from "@/components/QuestionListItem";

// ─── ISR config ──────────────────────────────────────────────
export const revalidate = 3600; // 1 saat ISR
// Build sırasında bilinmeyen bir DB slug gelirse on-demand render
// (DB-FIRST: yeni kategori DB'ye eklenince /{yeni-slug} çalışır)
export const dynamicParams = true;

// ─── generateStaticParams (build-time pre-render) ────────────
export async function generateStaticParams() {
  return listAllCategorySlugs().map((category) => ({ category }));
}

// ─── generateMetadata (SEO) ──────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;

  // Canonical DB slug mı? Değilse → 404 metadata
  if (!isCanonicalCategory(category)) {
    return { title: "Kategori bulunamadı | PythonMulakat" };
  }

  const { meta, questions } = await getCategoryPageData(category);
  if (!meta) {
    return { title: "Kategori bulunamadı | PythonMulakat" };
  }

  // Label + count (zengin meta description)
  const label = meta.label ?? getCategoryLabel(category);
  const desc = meta.description ||
    `${label} konusunda ${questions.length} Python mülakat sorusu. Tarayıcı tabanlı editör, otomatik test case ve anında geri bildirim ile pratik yapın.`;
  const canonical = `${BASE_URL}/${category}`;

  return {
    title: `${label} Soruları — Python Mülakat Hazırlığı | PythonMulakat`,
    description: desc,
    keywords: [
      label,
      "python mülakat soruları",
      `python ${category}`,
      `${category} soruları`,
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
  category: string,
  baseUrl: string
) {
  const label = meta.label ?? category;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${label} Soruları`,
    description: meta.description ?? `${label} konusunda Python mülakat soruları.`,
    url: `${baseUrl}/${category}`,
    isPartOf: { "@type": "WebSite", name: "PythonMulakat", url: baseUrl },
    mainEntity: { "@type": "ItemList", numberOfItems: questionCount },
  };
}

function buildItemListSchema(
  questions: Array<{ id: number; title: string; slug: string | null; category: string; level: string }>,
  category: string,
  baseUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category} soruları`,
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
  category: string,
  label: string,
  baseUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Sorular", item: `${baseUrl}/interviews` },
      { "@type": "ListItem", position: 3, name: label, item: `${baseUrl}/${category}` },
    ],
  };
}

// ─── Page ───────────────────────────────────────────────────
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  // Canonical DB slug mı? Değilse → 404
  // (Legacy /temelleri vb. middleware'de 308 ile canonical'e yönlendirildi)
  if (!isCanonicalCategory(category)) {
    notFound();
  }

  // DB'den kategori meta + soru listesi
  // (lib/api/questionAPI.ts → getCategoryPageData, tag'li cache'li)
  const { meta, questions } = await getCategoryPageData(category);
  if (!meta) {
    notFound();
  }

  // UI label normalize
  const label = meta.label ?? getCategoryLabel(category);
  const baseUrl = BASE_URL;

  // JSON-LD (3 katman)
  const collectionSchema = buildCollectionPageSchema(meta, questions.length, category, baseUrl);
  const itemListSchema = buildItemListSchema(questions, category, baseUrl);
  const breadcrumbSchema = buildBreadcrumbSchema(category, label, baseUrl);

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
        <ul className="space-y-3" data-ssr-category-list={category}>
          {questions.length === 0 ? (
            <li className="text-white/50 text-sm py-8 text-center">
              Bu kategoride henüz soru yok.
            </li>
          ) : (
            questions.map((q) => (
              <QuestionListItem
                key={q.id}
                question={q}
                categorySlug={category}
                // category label göstermeye gerek yok — zaten bu sayfanın konusu
              />
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
