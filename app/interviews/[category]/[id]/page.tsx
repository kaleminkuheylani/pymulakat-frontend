// app/interviews/[category]/[id]/page.tsx
// SEO-optimized: server-side metadata, HowTo schema, breadcrumb, related questions
// Supports BOTH slug-based URLs (/interviews/python-basics/palindrom-kontrol)
// AND legacy ID URLs (/interviews/python-basics/3) — slug gelirse ID'ye resolve eder

import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import WorkspaceClient from "./WorkspaceClient";
import WorkspaceMobileClient from "./WorkspaceMobileClient";
import { getIdFromSlug, slugifyTitle } from "../../../../lib/questionMeta";

// Tüm soru verisi backend DB'den gelir — kod-içi fallback YOK.

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
  slug?: string;
  related_questions?: Array<{ id: number; title: string; category: string; level: string; slug: string }>;
  tutorial_slug?: string;
  hints?: string[];
  tags?: string[];
  starter_code?: string;
}

// 📌 SSR test case formatı: input / expected / actual / description.
//    Misafirler de okuyabilsin diye public — auth gerekmez.
interface SSRTestCase {
  input: any;
  expected: any;
  actual?: any;
  description?: string;
}
interface SSRQuestionTests {
  question_id: number;
  function_name: string;
  test_cases: SSRTestCase[];
}

// ─── Server-side test cases fetch (SSR: misafirler de okuyabilsin) ─────
async function fetchQuestionTests(category: string, slugOrId: string): Promise<SSRQuestionTests | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";
    const asNum = parseInt(slugOrId, 10);
    const url = isNaN(asNum)
      ? `${apiUrl}/api/v2/questions/by-slug/${encodeURIComponent(category)}/${encodeURIComponent(slugOrId)}/tests`
      : `${apiUrl}/api/v2/questions/${asNum}/tests`;
    const res = await fetch(url, {
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

// ─── Server-side data fetch ────────────────────────────────
async function fetchQuestionSEO(category: string, id: string): Promise<SEOQuestion | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";

    // ✅ Slug veya ID'yi kabul et → backend by-slug API veya ID fetch
    let actualId = id;
    const asNum = parseInt(id, 10);

    if (isNaN(asNum)) {
      // Slug → backend by-slug
      const slug = id;
      try {
        const bySlugRes = await fetch(
          `${apiUrl}/api/v2/questions/by-slug/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`,
          { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) }
        );
        if (bySlugRes.ok) {
          const data = await bySlugRes.json();
          return data.data || data;
        }
      } catch {
        // Fallback: slug -> ID resolver
      }
      const resolvedId = await getIdFromSlug(slug, apiUrl);
      if (resolvedId) {
        actualId = String(resolvedId);
      }
    }

    const res = await fetch(`${apiUrl}/api/v2/questions/${actualId}`, {
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
// (Kaldırıldı: Workspace client kendi fetch'ini yapıyor, SSR enrichment gereksiz.)

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
      canonical: `https://pythonmulakat.com/interviews/${q.category}/${q.slug || slugifyTitle(q.title)}`,
    },
    openGraph: {
      title,
      description,
      url: `https://pythonmulakat.com/interviews/${q.category}/${q.slug || slugifyTitle(q.title)}`,
      siteName: "PythonMulakat",
      locale: "tr_TR",
      type: "article",
      images: [{ url: "https://pythonmulakat.com/og-default.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://pythonmulakat.com/og-default.png"],
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

// ─── Page ─────────────────────────────────────────────────
export default async function Page({ params, searchParams }: PageProps) {
  const [resolvedParams, resolvedSearch] = await Promise.all([params, searchParams]);
  // 📌 ?readonly=true → mobile client'ta editör kilitli + Run butonu yok
  //    Demo/embed/paylaşım linkleri için.
  const readonly = resolvedSearch?.readonly === "true";

  // ✅ Canonical routing middleware tarafindan yonetiliyor:
  //   - /interviews/{cat}/{slug}  → burada render (canonical, indexlenir)
  //   - /interviews/{cat}/{id}    → middleware slug URL'e yonlendirir (308)
  // Burada slug'in gecerli oldugunu dogrulayip fetch ediyoruz.
  let resolvedId: number | null = null;
  const _asNum = parseInt(resolvedParams.id, 10);
  if (!isNaN(_asNum)) {
    resolvedId = _asNum;  // Eski ID URL (legacy /interviews/python-basics/3 gibi)
  } else {
    // Slug → ID cozumleme:
    // 1) Backend by-slug API (runtime)
    resolvedId = await getIdFromSlug(resolvedParams.id);
    // 2) Q-v4 (89+) icin DB uzerinden by-slug API dene (runtime fetch)
    if (!resolvedId) {
      try {
        const apiBase2 = process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";
        const bySlugRes = await fetch(
          `${apiBase2}/api/v2/questions/by-slug/${encodeURIComponent(resolvedParams.category)}/${encodeURIComponent(resolvedParams.id)}`,
          { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) }
        );
        if (bySlugRes.ok) {
          const data = await bySlugRes.json();
          const q = data.data || data;
          if (q && typeof q.id === "number") {
            resolvedId = q.id;
          }
        }
      } catch {
        // Sessizce devam et, notFound fallback
      }
    }
  }
  // Slug ile geldiyse resolvedId null olabilir — bu durumda WorkspaceClient
  // kendi fetch'iyle soruyu çekecek. notFound() sadece gerçekten bulunamadıysa çağrılır.
  const isSlugRequest = isNaN(_asNum);
  if (!resolvedId && !isSlugRequest) {
    notFound();
  }

  const [mobile, seoQ, ssrTests] = await Promise.all([
    isMobileDevice(),
    fetchQuestionSEO(resolvedParams.category, String(resolvedId)),
    // SSR: test case'leri server-side çek. Misafirler de Testler tab'ında görebilsin.
    resolvedId && !isNaN(resolvedId as any)
      ? fetchQuestionTests(resolvedParams.category, String(resolvedId))
      : resolvedParams.id && !isNaN(parseInt(resolvedParams.id, 10)) === false
      ? fetchQuestionTests(resolvedParams.category, resolvedParams.id)
      : Promise.resolve(null),
  ]);

  // Workspace client kendi fetch'ini yapıyor; burada sadece SEO schema'ları için kullanıyoruz.
  // 📌 SSR: initial data'yı server'da geçiriyoruz — client'ta loading state atlanıyor.
  const Component = mobile ? WorkspaceMobileClient : WorkspaceClient;
  const initialInterview = seoQ ? {
    id: seoQ.id,
    title: seoQ.title,
    description: seoQ.description,
    level: seoQ.level,
    category: seoQ.category,
    starter_code: (seoQ as any).starter_code || "",
    tags: seoQ.tags || [],
    hints: seoQ.hints || [],
  } : null;
  // SSR'dan gelen test case verisi — her iki client da prop olarak alır (misafirler dahil).
  const initialTests: any = ssrTests;
  const baseUrl = "https://pythonmulakat.com";
  const howToSchema = seoQ ? buildHowToSchema(seoQ, baseUrl) : null;
  const breadcrumbSchema = seoQ
    ? buildBreadcrumbSchema(resolvedParams.category, resolvedParams.id, seoQ.title, baseUrl)
    : null;

  // 📌 SSR Content — Googlebot ve JS olmadan da içeriği görsün
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

      {/* 📌 SSR Content Block — JS yüklenmeden de Googlebot + kullanıcı görsün
          Hem desktop hem mobile için responsive: küçük ekranda padding/font azalır.
          JS yüklenince script ile gizlenir (client component kendi UI'ini gösterir).
          JS yoksa (Googlebot ilk crawl, no-JS kullanıcı) içerik görünür kalır. */}
      <div
        data-ssr-question
        className="ssr-question-block bg-[#050816] text-white px-4 py-6 sm:px-6 sm:py-8 md:max-w-3xl md:mx-auto"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">{ssrTitle}</h1>
        <div className="flex flex-wrap gap-2 mb-4 text-xs sm:text-sm text-white/60">
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">{ssrLevel}</span>
          {ssrComplexity && <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">{ssrComplexity}</span>}
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
              {ssrTestCases.map((tc, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs sm:text-sm">
                  <div className="font-semibold text-white/60 mb-2 uppercase tracking-wider text-[10px]">
                    Örnek #{i + 1}{tc.description ? ` · ${tc.description}` : ""}
                  </div>
                  <div className="space-y-1.5">
                    <div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider font-bold">📥 Input</div>
                      <pre className="font-mono text-white/80 bg-black/30 p-1.5 rounded overflow-x-auto">{JSON.stringify(tc.input)}</pre>
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-400/80 uppercase tracking-wider font-bold">✓ Expected</div>
                      <pre className="font-mono text-emerald-300 bg-emerald-500/5 p-1.5 rounded overflow-x-auto">{JSON.stringify(tc.expected)}</pre>
                    </div>
                    {tc.actual !== undefined && tc.actual !== null && (
                      <div>
                        <div className="text-[10px] text-cyan-300/70 uppercase tracking-wider font-bold">👁 Actual (referans çıktı)</div>
                        <pre className="font-mono text-cyan-200 bg-cyan-500/5 p-1.5 rounded overflow-x-auto">{JSON.stringify(tc.actual)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-white/40 italic">
              💡 Kodu çalıştırmak ve gerçek çıktılarını görmek için üye girişi yapıp editöre geçebilirsin.
            </p>
          </div>
        )}
        <noscript>
          <p className="mt-6 text-amber-300 text-sm">
            💡 İnteraktif editör için JavaScript gerekiyor. İçerik yine de görünür durumda.
          </p>
        </noscript>
      </div>

      <div data-client-workspace>
        <Component
          initialParams={resolvedParams}
          readonly={readonly}
          initialInterview={(mobile ? initialInterview : undefined) as any}
          initialTestCases={initialTests}
        />
      </div>

      {/* 📌 JS yoksa: üstteki description paneli zaten SSR ile geliyor.
          "Soru yükleniyor" loading JS olmadan takılı kalır, gizle. */}
      <noscript>
        <style>{`[data-client-workspace]{display:none!important}`}</style>
        <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 text-center">
          <p className="text-white/60 text-sm">
            💡 İnteraktif editör ve kod çalıştırma için JavaScript gerekiyor.
            Soru açıklamasını yukarıda görebilirsiniz.
          </p>
        </div>
      </noscript>

      {/* 📌 JS yüklenince SSR bloğu useEffect ile kaldırılır (WorkspaceClient / MobileClient)
          — hem desktop hem mobile için aynı davranış. Bu sayede React hydration
          sırasında duplicate render oluşmuyor. */}
    </>
  );
}