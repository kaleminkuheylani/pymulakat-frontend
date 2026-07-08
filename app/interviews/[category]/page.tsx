// app/interviews/[category]/page.tsx
// Kategori listeleme + TABLO + v2 API
//
// 📌 Metadata KAYNAĞI: Backend `/api/v2/categories`
//    Hardcoded CATEGORY_LABELS / CATEGORY_DESCRIPTIONS kaldırıldı.
//    Yeni kategori eklenince frontend değişikliği gerekmez.

import { headers } from "next/headers";
import Link from "next/link";
import CategoryTable from "../../../components/CategoryTable";
import type { Metadata } from "next";

// ✅ Build sırasında prerender deneme — her istekte fresh fetch
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ category: string }>;
}

// Backend'ten kategori metadata'sını çek (label, description, icon).
// Yoksa fallback: slug'ı label olarak kullan.
async function fetchCategoryInfo(slug: string): Promise<{ label: string; description: string; icon: string }> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";
    const res = await fetch(`${apiUrl}/api/v2/categories`, {
      next: { revalidate: 3600 }, // 1 saat cache
    });
    if (!res.ok) return { label: slug, description: "", icon: "📘" };
    const data = await res.json();
    const cats: Array<{ slug: string; label: string; description?: string; icon?: string }> = data?.data || [];
    const found = cats.find((c) => c.slug === slug);
    return {
      label: found?.label || slug,
      description: found?.description || "",
      icon: found?.icon || "📘",
    };
  } catch {
    return { label: slug, description: "", icon: "📘" };
  }
}

interface QuestionItem {
  id: number | string;
  title: string;
  description?: string;
  level?: string;
  topic?: string;
  category?: string;
  tags?: string[];
  starter_code?: string;
}

async function fetchQuestions(category: string): Promise<QuestionItem[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";

    // ✅ v2 API — limit=100 (max 500)
    const res = await fetch(
      `${apiUrl}/api/v2/questions?category=${encodeURIComponent(category)}&limit=100`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!res.ok) {
      console.warn(`[CategoryPage] /api/v2/questions ${res.status}`);
      return [];
    }

    const data = await res.json();

    // ✅ Güvenli parse
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  } catch (err) {
    console.error("[CategoryPage] fetch error:", err);
    return [];
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  // Backend'ten kategori metadata'sını çek (label, description, icon)
  const { label, description, icon } = await fetchCategoryInfo(category);

  const questions = await fetchQuestions(category);
  const safeQuestions: QuestionItem[] = Array.isArray(questions) ? questions : [];

  // Her soruya category ekle
  const enriched: QuestionItem[] = safeQuestions.map((q) => ({
    ...q,
    category: q.category || category,
  }));

  // 📌 BreadcrumbList + FAQPage JSON-LD — Google rich results
  const schemas = buildCategorySchema(category, label, safeQuestions.length);

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }}
      />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors"
        >
          ← Ana Sayfa
        </Link>

        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              {icon && icon !== "📘" && <span className="text-3xl">{icon}</span>}
              <span>{label}</span>
            </h1>
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white/60">
              {category}
            </span>
          </div>
          {description && (
            <p className="text-white/60 text-base">{description}</p>
          )}
          <div className="flex items-center gap-3 mt-4 text-sm text-white/40">
            <span>
              <span className="text-white font-semibold">{safeQuestions.length}</span> soru
            </span>
          </div>
        </div>

        <CategoryTable
          questions={enriched}
          currentCategory={category}
        />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const { category } = await params;
    const { label, description } = await fetchCategoryInfo(category);
    return {
      title: `${label} — Python Mülakat Soruları | PythonMulakat`,
      description: `${label} kategorisindeki Python mülakat soruları. ${description || 'Tarayıcı tabanlı interaktif editörde çöz.'} `,
      keywords: `python ${category}, ${category} soruları, python mülakat ${category}`,
      alternates: {
        canonical: `https://pythonmulakat.com/interviews/${category}`,
      },
      openGraph: {
        title: `${label} — Python Mülakat Soruları`,
        description: description || `Python mülakat soruları — ${label} kategorisi`,
        url: `https://pythonmulakat.com/interviews/${category}`,
        siteName: "PythonMulakat",
        locale: "tr_TR",
        type: "website",
      },
    };
  } catch {
    return {
      title: "Sorular | PythonMulakat",
      description: "Python mülakat soruları.",
    };
  }
}

// 📌 Category sayfasına BreadcrumbList + FAQPage JSON-LD — Google rich results.
// Sayfa eklemeden schema ile SEO artışı: SERP'te breadcrumb görünümü + FAQ kartı.
function buildCategorySchema(category: string, label: string, count: number) {
  const baseUrl = "https://pythonmulakat.com";
  return {
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Sorular", item: `${baseUrl}/interviews` },
        { "@type": "ListItem", position: 3, name: label, item: `${baseUrl}/interviews/${category}` },
      ],
    },
    faq: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `${label} kategorisinde kaç soru var?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `${label} kategorisinde şu anda ${count} soru bulunuyor. Tüm sorular tarayıcı tabanlı interaktif editörde çözülebilir; her soru için açıklama, örnek input/expected çıktılar ve test case'leri mevcuttur.`,
          },
        },
        {
          "@type": "Question",
          name: `${label} sorularını çözmek için hangi Python konuları bilinmeli?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `${label} soruları için Python'un temel veri tipleri (string, list, dict, tuple, set), kontrol yapıları (if/else, for, while), fonksiyon tanımları ve standart kütüphane modülleri (math, collections, itertools) yeterlidir. İleri sorular için Big O analizi ve algoritma bilgisi gerekir.`,
          },
        },
        {
          "@type": "Question",
          name: `${label} soruları mülakat için yeterli mi?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Evet. ${label} kategorisi Python mülakatlarının sık sorulan konularını kapsar. Her soruda örnek test case'leri ile pratik yapabilir, çözümünüzü anında doğrulayabilirsiniz. Üye olarak ilerlemenizi takip edebilirsiniz.`,
          },
        },
      ],
    },
  };
}