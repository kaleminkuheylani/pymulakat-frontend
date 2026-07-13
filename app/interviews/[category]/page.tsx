// app/interviews/[category]/page.tsx
//
// Kategori landing page — TEK DİNAMİK ROUTE (8 pillar dahil).
//
// URL: /interviews/{db_category}
//   - DB-FIRST: 8 pillar (heap, python-basics, ...) hepsi bu tek dosyadan render
//   - Eski statik sayfalar (`app/{heap,python-temelleri,...}/page.tsx`) SİLİNDİ
//   - Middleware top-level `/[display_slug]` → 308 → /interviews/{db_category}
//
// SSR + ISR (2026-07-13 refactor):
//   - generateStaticParams() build-time'da bilinen 8 slug'ı pre-render
//   - dynamicParams=true → build sonrası eklenen kategoriler on-demand SSR
//   - revalidate=3600 + tags → cache miss'te taze, tag invalidation'da anında
//   - generateMetadata() → title/description/canonical DB'den
//   - JSON-LD: CollectionPage + ItemList + BreadcrumbList
//
// Auth: Halka açık. Misafirler tam içerik görür, kod editörü ayrı component
// (QuestionListCard → sadece link, editör yok).

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Code2, ArrowRight } from "lucide-react";
import { getCategoryPageData, listAllCategorySlugs } from "@/lib/api/questionAPI";
import { BASE_URL } from "@/lib/seo";

// ─── ISR config ──────────────────────────────────────────────
// 1 saat ISR. Tag-based invalidation (/api/revalidate?tag=...)
// yeni soru gelince cache'i anında düşürür.
export const revalidate = 3600;
// Build sonrası eklenen kategoriler on-demand render (DB-FIRST).
export const dynamicParams = true;

// ─── generateStaticParams (build-time pre-render) ────────────
export async function generateStaticParams() {
  const slugs = await listAllCategorySlugs();
  return slugs.map((slug) => ({ category: slug }));
}

// ─── generateMetadata (SEO) ──────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const { meta, questions } = await getCategoryPageData(category);
  if (!meta) {
    return { title: "Kategori bulunamadı | PythonMulakat" };
  }

  const label = meta.label ?? category; // DB-FIRST: label DB'den, fallback slug
  const title = `${label} Soruları — Python Mülakat Hazırlığı | PythonMulakat`;
  const description =
    meta.description ||
    `${label} konusunda ${questions.length} Python mülakat sorusu. Tarayıcı tabanlı editör, otomatik test case ve anında geri bildirim ile pratik yapın.`;
  const canonical = `${BASE_URL}/interviews/${category}`;

  return {
    title,
    description,
    keywords: [
      label,
      "python mülakat soruları",
      `python ${category}`,
      `${category} soruları`,
      "python pratik",
    ],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "PythonMulakat",
      locale: "tr_TR",
      type: "website",
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

// ─── JSON-LD builders ────────────────────────────────────────
function buildCollectionPageSchema(
  meta: { label?: string; description?: string; slug?: string },
  questionCount: number,
  baseUrl: string
) {
  // meta notFound() kontrolünden geçti, ama tip guard yine de gerekli
  const slug = meta.slug ?? "";
  const label = meta.label ?? slug;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${label} Soruları`,
    description: meta.description ?? `${label} konusunda Python mülakat soruları.`,
    url: `${baseUrl}/interviews/${slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "PythonMulakat",
      url: baseUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: questionCount,
    },
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
  // label = meta.label ?? category (caller normalize eder)
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Sorular", item: `${baseUrl}/interviews` },
      { "@type": "ListItem", position: 3, name: label, item: `${baseUrl}/interviews/${category}` },
    ],
  };
}

// ─── Page ───────────────────────────────────────────────────
export default async function CategoryLandingPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  // getCategoryPageData → listCategories + getAllQuestions paralel,
  // tag: categories-list + category-{slug} (her ikisi de cache'li)
  const { meta, questions } = await getCategoryPageData(category);
  if (!meta) {
    notFound();
  }

  const baseUrl = BASE_URL;
  const label = meta.label ?? category; // normalize for schema + UI
  const collectionSchema = buildCollectionPageSchema(meta, questions.length, baseUrl);
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
          {/* SSR'da görünür thin-content'e karşı: DB'den gelen description + ek unique içerik */}
          <p className="text-white/60 text-sm md:text-base max-w-2xl">
            {meta.description ||
              `${label} konusunda Python mülakat soruları ve çözümleri.`}
          </p>
          <div className="mt-3 text-sm text-white/50">
            {questions.length} soru · Tarayıcıda çöz, otomatik test et
          </div>
        </header>

        {/* ─── Soru listesi (DB-FIRST, SSR) ─── */}
        <ul className="space-y-3" data-ssr-category-list>
          {questions.length === 0 ? (
            <li className="text-white/50 text-sm py-8 text-center">
              Bu kategoride henüz soru yok.
            </li>
          ) : (
            questions.map((q) => (
              <li key={q.id}>
                <Link
                  href={`/interviews/${category}/${q.slug ?? q.id}`}
                  className="block bg-white/[0.03] border border-white/10 rounded-lg p-4 hover:bg-white/[0.06] hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <Code2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <h2 className="text-base font-semibold text-white truncate">
                            {q.title}
                          </h2>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0" />
                      </div>
                      <p className="text-xs text-white/50 line-clamp-2">
                        {q.description?.split("\n")[0] || "Soru açıklaması"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/60 uppercase tracking-wider">
                          {q.level}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
