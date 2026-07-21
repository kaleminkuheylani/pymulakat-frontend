// app/interviews/[category]/page.tsx
//
// KATEGORİ DETAY — Tek kategorinin soru listesi, DB-driven, ISR 1h.
//
// 2026-07-16 kullanıcı direktifi:
//   /interviews/{db_slug} → o kategorinin tüm soruları
//   Örnek: /interviews/dynamic-programming → sadece DP soruları
//   8 canonical slug (lib/categorySlug.ts → CATEGORY_SLUGS)
//
// Mimari:
//   - Server component (initial HTML dolu)
//   - generateStaticParams: 8 path pre-render
//   - dynamicParams: true (yeni kategori DB'ye eklenince on-demand)
//   - revalidate: 3600 (1 saat)
//   - DB-FIRST: getAllQuestions({ category })
//   - Mevcut /interviews sayfasının filtrelenmiş hali (sade/düz versiyon)
//
// SEO:
//   - generateMetadata: DB-FIRST title/description
//   - JSON-LD: CollectionPage + ItemList + BreadcrumbList
//   - canonical: /interviews/{slug}

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCategories, getCategoryMeta } from "@/lib/api/categoryAPI";
import { getAllQuestions } from "@/lib/api/questionAPI";
import { CATEGORY_ICONS } from "@/lib/icons";
import { CATEGORY_SLUGS, getCategoryUrl } from "@/lib/categorySlug";
import { BASE_URL } from "@/lib/seo";
import SolvedQuestionList from "@/components/SolvedQuestionList";

// ISR — 1 saatte bir yenile
export const revalidate = 3600;
// dynamicParams: true → build sonrası DB'ye eklenen kategori on-demand render
export const dynamicParams = true;

// 2026-07-16: generateStaticParams YOK — build sirasinda network fetch
// patliyor (build env'de backend'e erisim yok). dynamicParams=true ile
// ilk istekte on-demand render + revalidate=3600 cache yeterli.
interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryMeta(category);
  if (!cat) return { title: "Kategori Bulunamadı" };

  // 2026-07-18: pandas scope'tan cikarildi (CATEGORY_SLUGS'ta yok zaten,
  // notFound 404 dondurur). Metadata yine de uretilir (defensive).

  const label = cat.label ?? category;
  return {
    title: `${label} Mülakat Soruları`,
    description:
      cat.description ??
      `${label} kategorisindeki Python mülakat soruları. ${cat.question_count ?? 0} soru, açıklama, ipuçları.`,
    keywords: [
      `${label} mülakat soruları`,
      `${label} python`,
      "python mülakat",
      "yazılım mülakat hazırlık",
      ...(category === "algorithms" ? [
        "javascript array method soruları",
        "javascript es6 soruları",
        "javascript async await örnekleri",
        "javascript event loop",
      ] : []),
    ],
    openGraph: {
      title: `${label} Mülakat Soruları`,
      description: cat.description ?? `${label} kategorisindeki Python mülakat soruları.`,
      url: `${BASE_URL}/interviews/${category}`,
      type: "website",
    },
    alternates: {
      canonical: `${BASE_URL}/interviews/${category}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  // Canonical slug mı kontrol et
  if (!CATEGORY_SLUGS.includes(category as (typeof CATEGORY_SLUGS)[number])) {
    notFound();
  }

  // 2026-07-18: pandas scope'tan cikarildi — 410 Gone
  if (category === "pandas") {
    notFound(); // CATEGORY_SLUGS'ta yok zaten, notFound 404 dondurur
  }

  // Kategori meta
  const cat = await getCategoryMeta(category);
  if (!cat) notFound();


  // Bu kategorinin soruları
  const questions = await getAllQuestions({ category, limit: 500 });
  const Icon = CATEGORY_ICONS[category] ?? CATEGORY_ICONS["programlama-temelleri"];

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        {/* ─── Breadcrumb ──────────────────────────────── */}
        <nav className="text-sm text-white/40 mb-6" aria-label="Breadcrumb">
          <Link href="/interviews" className="hover:text-amber-300 transition-colors">
            Mülakat Soruları
          </Link>
          <span className="mx-2 text-white/20">/</span>
          <span className="text-white/70">{cat.label ?? category}</span>
        </nav>

        {/* ─── Header ──────────────────────────────────── */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Icon className="w-6 h-6 text-amber-300" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {cat.label ?? category}
            </h1>
          </div>
          {cat.description && (
            <p className="text-white/60 text-sm md:text-base max-w-2xl leading-relaxed">
              {cat.description}
            </p>
          )}
          <div className="mt-3 text-sm text-white/50">
            {questions.length} soru gösteriliyor
          </div>
        </header>

        {/* ─── Soru listesi (+ çözüldü rozeti + In-Feed reklam) ─────────── */}
        <SolvedQuestionList
          questions={questions}
          categorySlug={category}
          categoryLabel={cat.label ?? category}
        />

        {/* ─── Diğer kategoriler ───────────────────────── */}
        <OtherCategoriesNav currentSlug={category} />
      </div>
    </main>
  );
}

// Diğer kategorilere hızlı geçiş (UX)
async function OtherCategoriesNav({ currentSlug }: { currentSlug: string }) {
  const allCats = (await getAllCategories()).filter(
    (c) => c.slug !== "queue" && c.slug !== currentSlug
  );
  return (
    <nav
      className="mt-12 pt-8 border-t border-white/5"
      aria-label="Diğer kategoriler"
    >
      <h2 className="text-sm font-semibold text-white/70 mb-4">
        Diğer Kategoriler
      </h2>
      <div className="flex flex-wrap gap-2">
        {allCats.map((c) => (
          <Link
            key={c.slug}
            href={getCategoryUrl(c.slug)}
            className="px-3 py-1.5 text-xs rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-colors"
          >
            {c.label ?? c.slug}
          </Link>
        ))}
      </div>
    </nav>
  );
}
