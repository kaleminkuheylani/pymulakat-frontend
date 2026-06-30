// app/interviews/[category]/[id]/page.tsx
// SEO-optimized: server-side metadata, HowTo schema, breadcrumb, related questions
// Supports BOTH slug-based URLs (/interviews/python-basics/palindrom-kontrol)
// AND legacy ID URLs (/interviews/python-basics/3) — slug gelirse ID'ye resolve eder

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import WorkspaceClient from "./WorkspaceClient";
import WorkspaceMobileClient from "./WorkspaceMobileClient";
import { getIdFromSlug, getQuestionMeta, slugifyTitle } from "../../../../lib/questionMeta";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ category: string; id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
  related_questions?: Array<{ id: number; title: string; category: string; level: string }>;
  tutorial_slug?: string;
  hints?: string[];
}

// ─── Server-side data fetch ────────────────────────────────
async function fetchQuestionSEO(category: string, id: string): Promise<SEOQuestion | null> {
  try {
    const h = await headers();
    const host = h.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || `${protocol}://${host}`;
    const res = await fetch(`${apiUrl}/api/v2/questions/${id}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || data;
  } catch {
    return null;
  }
}

// ─── Related questions fetch (batch) ─────────────────────
async function fetchRelatedTitles(
  ids: number[],
  apiUrl: string
): Promise<Array<{ id: number; title: string; category: string; level: string }>> {
  if (!ids?.length) return [];
  try {
    const out = await Promise.all(
      ids.map(async (rid) => {
        const res = await fetch(`${apiUrl}/api/v2/questions/${rid}`, {
          next: { revalidate: 3600 },
          signal: AbortSignal.timeout(3000),
        });
        if (!res.ok) return null;
        const json = await res.json();
        const q = json.data || json;
        return { id: q.id, title: q.title, category: q.category, level: q.level };
      })
    );
    return out.filter((x): x is { id: number; title: string; category: string; level: string } => x !== null);
  } catch {
    return [];
  }
}

// ─── generateMetadata (SEO) ───────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, id } = await params;
  const q = await fetchQuestionSEO(category, id);
  if (!q) {
    return { title: "Soru bulunamadı | PythonMulakat" };
  }

  const title = `${q.title} — Python Sorusu #${q.id} | PythonMulakat`;
  const description = q.explanation
    ? q.explanation.replace(/[*#`]/g, "").slice(0, 160)
    : `${q.title} sorusu, ${q.level} seviye Python mülakat sorusu. Türkçe açıklama, kod çalıştırma ve test case'leri ile pratik yapın.`;

  return {
    title,
    description,
    keywords: [
      q.title,
      "python mülakat",
      `python ${q.category}`,
      ...(q.related_concepts || []),
    ].join(", "),
    alternates: {
      canonical: `https://www.pythonmulakat.com/interviews/${q.category}/${q.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.pythonmulakat.com/interviews/${q.category}/${q.id}`,
      siteName: "PythonMulakat",
      locale: "tr_TR",
      type: "article",
      images: [{ url: "https://www.pythonmulakat.com/og-default.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.pythonmulakat.com/og-default.png"],
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
function buildBreadcrumbSchema(category: string, id: string, title: string, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Sorular", item: `${baseUrl}/interviews` },
      { "@type": "ListItem", position: 3, name: category, item: `${baseUrl}/interviews/${category}` },
      { "@type": "ListItem", position: 4, name: title, item: `${baseUrl}/interviews/${category}/${id}` },
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

async function getApiBase(): Promise<string> {
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  return process.env.NEXT_PUBLIC_API_URL || `${protocol}://${host}`;
}

// ─── Page ─────────────────────────────────────────────────
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;

  // 🆕 Slug → ID resolution: eğer id parametresi sayı değilse slug'tır
  const idAsNumber = parseInt(resolvedParams.id, 10);
  let actualId = resolvedParams.id;

  if (isNaN(idAsNumber)) {
    // Slug geldi — ID'yi bul
    const resolvedId = getIdFromSlug(resolvedParams.id);
    if (resolvedId) {
      // Redirect ile temiz URL'e yönlendir (canonical SEO)
      const m = getQuestionMeta(resolvedId);
      redirect(`/interviews/${resolvedParams.category}/${resolvedId}`);
    } else {
      // Slug bulunamadı, 404'e düşsün
      actualId = "0"; // invalid ID, DB null döner
    }
  } else {
    actualId = String(idAsNumber);
  }

  const [mobile, seoQ] = await Promise.all([
    isMobileDevice(),
    fetchQuestionSEO(resolvedParams.category, actualId),
  ]);

  // Related soruları paralel çek (SEO + workspace için)
  const apiBase = await getApiBase();
  const relatedQuestions = seoQ?.related_question_ids?.length
    ? await fetchRelatedTitles(seoQ.related_question_ids, apiBase)
    : [];

  // Question objesine related_questions ekle (Workspace'e prop olarak aktarılır)
  const enrichedQuestion: SEOQuestion | null = seoQ
    ? { ...seoQ, related_questions: relatedQuestions }
    : null;

  const Component = mobile ? WorkspaceMobileClient : WorkspaceClient;
  const baseUrl = "https://www.pythonmulakat.com";
  const howToSchema = seoQ ? buildHowToSchema(seoQ, baseUrl) : null;
  const breadcrumbSchema = seoQ
    ? buildBreadcrumbSchema(resolvedParams.category, resolvedParams.id, seoQ.title, baseUrl)
    : null;

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

      <Component
        initialParams={resolvedParams}
        seoQuestion={enrichedQuestion || undefined}
      />
    </>
  );
}