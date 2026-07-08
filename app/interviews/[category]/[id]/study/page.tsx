// app/interviews/[category]/[id]/study/page.tsx
// Soru bazlı detaylı etüt (study guide) sayfası.
//
// URL: /interviews/{category}/{slug}/study
// Backend: /api/v2/guides/by-question-id/{id}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";

interface Guide {
  question_id: number;
  study_slug: string;
  seo_title: string;
  category: string;
  level: string;
  keywords: string[];
  meta_description: string;
  estimated_read_time_min: number;
  prereq_topics: string;
  difficulty_progression: string;
  related_question_ids: number[];
  problem_understanding: string | null;
  approach_1: { title: string; code: string; complexity: string } | null;
  approach_2: { title: string; code: string; complexity: string } | null;
  approach_3: { title: string; code: string; complexity: string } | null;
  challenges: string | null;
}

// ─── Server-side fetch ─────────────────────────────────────
async function fetchGuideBySlug(studySlug: string): Promise<Guide | null> {
  try {
    const r = await fetch(`${API}/api/v2/guides/by-slug/${studySlug}`, {
      next: { revalidate: 3600 },
    });
    if (!r.ok) return null;
    const data = await r.json();
    return data?.data || data || null;
  } catch {
    return null;
  }
}

async function fetchGuide(idOrSlug: string): Promise<Guide | null> {
  // Önce id integer mı dene, yoksa slug olarak kullan
  if (/^\d+$/.test(idOrSlug)) {
    try {
      const r = await fetch(`${API}/api/v2/guides/by-question-id/${idOrSlug}`, {
        next: { revalidate: 3600 },
      });
      if (!r.ok) return null;
      const data = await r.json();
      return data?.data || data || null;
    } catch {
      return null;
    }
  }
  return fetchGuideBySlug(idOrSlug);
}

async function fetchQuestionMeta(category: string, slug: string) {
  try {
    // by-slug ile önce id al
    const r = await fetch(`${API}/api/v2/questions/by-slug/${category}/${slug}`);
    if (!r.ok) {
      // Slug bazlı değilse id olarak tüm soruları tara
      const allR = await fetch(`${API}/api/v2/questions/all`);
      if (!allR.ok) return null;
      const allData = await allR.json();
      const items: any[] = allData?.data || [];
      return items.find((q) => String(q.id) === String(slug)) || null;
    }
    return await r.json();
  } catch {
    return null;
  }
}

// ─── Metadata ────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}): Promise<Metadata> {
  const { category, id } = await params;
  const guide = await fetchGuide(id);
  const q = await fetchQuestionMeta(category, id);
  if (!guide) {
    return { title: "Etüt bulunamadı" };
  }
  return {
    title: guide.seo_title,
    description: guide.meta_description,
    keywords: guide.keywords,
    alternates: {
      canonical: `https://pythonmulakat.com/interviews/${q?.category || "python"}/${q?.slug || id}/study`,
    },
    openGraph: {
      title: guide.seo_title,
      description: guide.meta_description,
      url: `https://pythonmulakat.com/interviews/${q?.category || "python"}/${q?.slug || id}/study`,
      siteName: "PythonMulakat",
      locale: "tr_TR",
      type: "article",
    },
  };
}

// ─── Page ───────────────────────────────────────────────────
export default async function StudyPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = await params;
  const [guide, q] = await Promise.all([fetchGuide(id), fetchQuestionMeta(category, id)]);
  if (!guide) notFound();

  const slug = q?.slug || id;
  const questionUrl = `/interviews/${category}/${slug}`;

  // Schema.org: Article + Breadcrumb
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: guide.seo_title,
    description: guide.meta_description,
    keywords: guide.keywords.join(", "),
    inLanguage: "tr-TR",
    author: { "@type": "Organization", name: "Python Mülakat" },
    publisher: {
      "@type": "Organization",
      name: "PythonMulakat",
      url: "https://pythonmulakat.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://pythonmulakat.com/interviews/${category}/${slug}/study`,
    },
    about: {
      "@type": "Question",
      name: q?.title || guide.seo_title,
      url: `https://pythonmulakat.com${questionUrl}`,
    },
    learningResourceType: "Study Guide",
    educationalLevel: guide.level,
    timeRequired: `PT${guide.estimated_read_time_min}M`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://pythonmulakat.com/" },
      { "@type": "ListItem", position: 2, name: "Sorular", item: "https://pythonmulakat.com/interviews" },
      { "@type": "ListItem", position: 3, name: q?.title || "Soru", item: `https://pythonmulakat.com${questionUrl}` },
      { "@type": "ListItem", position: 4, name: "Etüt", item: `https://pythonmulakat.com${questionUrl}/study` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="min-h-screen bg-[#050816] text-white">
        {/* Hero */}
        <header className="border-b border-white/10 bg-[#0a0e1a]/80 backdrop-blur">
          <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[10px] text-white/40 mb-4">
              <Link href="/" className="hover:text-white/70">Ana Sayfa</Link>
              <span>/</span>
              <Link href="/interviews" className="hover:text-white/70">Sorular</Link>
              <span>/</span>
              <Link href={questionUrl} className="hover:text-white/70">{q?.title || "Soru"}</Link>
              <span>/</span>
              <span className="text-purple-300 font-semibold">Etüt</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
              {guide.seo_title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-white/50 flex-wrap mb-4">
              <span className="px-2 py-1 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300 font-semibold uppercase tracking-wide">
                {guide.category}
              </span>
              <span className="px-2 py-1 rounded-md bg-white/5 text-white/60 uppercase tracking-wide">
                {guide.level}
              </span>
              <span className="text-white/40">⏱ {guide.estimated_read_time_min} dk okuma</span>
            </div>

            {/* Keywords */}
            <div className="flex flex-wrap gap-1.5">
              {guide.keywords.slice(0, 8).map((k) => (
                <span
                  key={k}
                  className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 border border-white/10 text-white/60"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
          {/* 🧭 Problemi Anlayalım */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-xl">
                🧭
              </span>
              <h2 className="text-2xl font-bold">Problemi Anlayalım</h2>
            </div>
            {guide.problem_understanding ? (
              <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-white/75 leading-relaxed whitespace-pre-wrap">
                {guide.problem_understanding}
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center text-white/40 text-sm">
                <p>📝 Bu sorunun detaylı problem analizi henüz hazırlanmadı.</p>
                <p className="mt-1 text-xs">Yakında: kısıtlar, edge case'ler, ipuçları.</p>
              </div>
            )}
          </section>

          {/* 🔀 3 Yaklaşım */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xl">
                🔀
              </span>
              <h2 className="text-2xl font-bold">Problem İçin Yaklaşımlar</h2>
            </div>

            <div className="grid gap-4">
              {[guide.approach_1, guide.approach_2, guide.approach_3].map((a, i) => (
                <ApproachCard key={i} idx={i + 1} approach={a} />
              ))}
            </div>
          </section>

          {/* ⚠ Karşılaşılan Sorunlar */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-xl">
                ⚠️
              </span>
              <h2 className="text-2xl font-bold">Karşılaşılan Sorunlar ve İlgili Sorular</h2>
            </div>

            {guide.challenges ? (
              <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-white/75 leading-relaxed whitespace-pre-wrap">
                {guide.challenges}
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center text-white/40 text-sm">
                <p>Yakında: edge case'ler ve yaygın hatalar.</p>
              </div>
            )}

            {/* Prereq + progression */}
            {(guide.prereq_topics || guide.difficulty_progression) && (
              <div className="grid sm:grid-cols-2 gap-3">
                {guide.prereq_topics && (
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-[10px] uppercase tracking-wider text-cyan-300 mb-1.5 font-bold">
                      📚 Ön Koşullar
                    </div>
                    <p className="text-sm text-white/75 leading-relaxed">{guide.prereq_topics}</p>
                  </div>
                )}
                {guide.difficulty_progression && (
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-[10px] uppercase tracking-wider text-emerald-300 mb-1.5 font-bold">
                      🎯 Zorluk Akışı
                    </div>
                    <p className="text-sm text-white/75 leading-relaxed">{guide.difficulty_progression}</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* CTA */}
          <section className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20">
            <h2 className="text-lg font-bold mb-2">Şimdi ne yapalım?</h2>
            <p className="text-sm text-white/65 mb-4 leading-relaxed">
              Etüdü okudun. Şimdi kodu yaz ve test case'leri geç. Editor'de pratik yapmak en iyi öğrenme yöntemidir.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={questionUrl}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-sm font-bold rounded-lg transition-all shadow-md shadow-amber-500/30"
              >
                <span>💻</span>
                <span>Soruyu Çöz</span>
              </Link>
              <Link
                href="/interviews"
                className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-white/80 hover:border-white/40 hover:text-white text-sm font-medium rounded-lg transition-all"
              >
                <span>← Tüm Sorular</span>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

function ApproachCard({ idx, approach }: { idx: number; approach: Guide["approach_1"] }) {
  if (!approach) {
    return (
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-7 h-7 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold flex items-center justify-center text-sm">
            {idx}
          </span>
          <h3 className="font-bold text-white/90">Yaklaşım {idx} — hazırlanıyor</h3>
        </div>
        <p className="text-sm text-white/40 italic">
          Bu yaklaşımın kodu + karmaşıklık analizi yakında eklenecek.
        </p>
      </div>
    );
  }

  const colors = [
    { bg: "from-rose-500/10", border: "border-rose-500/30", accent: "text-rose-300" },
    { bg: "from-amber-500/10", border: "border-amber-500/30", accent: "text-amber-300" },
    { bg: "from-emerald-500/10", border: "border-emerald-500/30", accent: "text-emerald-300" },
  ];
  const c = colors[idx - 1];

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br ${c.bg} via-transparent to-transparent border ${c.border}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-7 h-7 rounded-full ${c.bg} border ${c.border} ${c.accent} font-bold flex items-center justify-center text-sm`}>
          {idx}
        </span>
        <h3 className="font-bold text-white">{approach.title}</h3>
      </div>
      {approach.complexity && (
        <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-indigo-300">
          <span>⏱</span>
          <span>{approach.complexity}</span>
        </div>
      )}
      {approach.code && (
        <pre className="p-3 rounded-lg bg-[#0a0e1a] border border-white/5 overflow-x-auto font-mono text-[12px] leading-relaxed text-white/85">
          <code>{approach.code}</code>
        </pre>
      )}
    </div>
  );
}// last rebuilt: Wed Jul  8 16:16:13 UTC 2026
