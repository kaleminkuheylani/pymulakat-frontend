// /python-egitimi/[slug] — Tek bir dersin detay sayfası.

import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LESSONS, getLesson } from "../lessons";
import { EditorErrorBoundary } from "../../../components/EditorErrorBoundary";
import LessonRunner from "./LessonRunner";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return { title: "Ders Bulunamadı | Python Eğitimi" };
  return {
    title: `${lesson.title} — Python Eğitimi`,
    description: lesson.description,
    keywords: [
      "python eğitimi",
      lesson.title.toLowerCase(),
      "python dersleri",
      "türkçe python",
      ...lesson.topics.map(t => t.toLowerCase()),
    ],
    authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
    alternates: {
      canonical: `https://pythonmulakat.com/python-egitimi/${lesson.slug}`,
      languages: {
        "tr-TR": `https://pythonmulakat.com/python-egitimi/${lesson.slug}`,
        "x-default": `https://pythonmulakat.com/python-egitimi/${lesson.slug}`,
      },
    },
    openGraph: {
      title: `${lesson.title} — Python Eğitimi`,
      description: lesson.description,
      url: `https://pythonmulakat.com/python-egitimi/${lesson.slug}`,
      siteName: "PythonMulakat",
      locale: "tr_TR",
      type: "article",
      images: [
        {
          url: "https://pythonmulakat.com/og-default.png",
          width: 1200,
          height: 630,
          alt: `${lesson.title} — Python Eğitimi`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${lesson.title} — Python Eğitimi`,
      description: lesson.description,
      images: ["https://pythonmulakat.com/og-default.png"],
      creator: "@pythonmulakat",
    },
  };
}

const breadcrumbJsonLd = (title: string, slug: string) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://pythonmulakat.com/" },
    { "@type": "ListItem", position: 2, name: "Python Eğitimi", item: "https://pythonmulakat.com/python-egitimi" },
    { "@type": "ListItem", position: 3, name: title, item: `https://pythonmulakat.com/python-egitimi/${slug}` },
  ],
});

// LearningResource — tek bir dersi schema.org'a kayıt
const faqJsonLd = (faq: { q: string; a: string }[] | undefined) => {
  if (!faq || faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
};

const learningResourceJsonLd = (
  title: string,
  description: string,
  slug: string,
  level: string,
  topics: string[],
  position: number,
) => ({
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "@id": `https://pythonmulakat.com/python-egitimi/${slug}#lesson`,
  name: title,
  description,
  url: `https://pythonmulakat.com/python-egitimi/${slug}`,
  educationalLevel: level === "Başlangıç" ? "Beginner" : level === "Orta" ? "Intermediate" : "Advanced",
  learningResourceType: "lesson",
  isAccessibleForFree: true,
  inLanguage: "tr-TR",
  position,
  teaches: topics,
  isPartOf: { "@id": "https://pythonmulakat.com/python-egitimi#learning-resource" },
  provider: { "@id": "https://pythonmulakat.com/#organization" },
});

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const idx = LESSONS.findIndex((l) => l.slug === lesson.slug);
  const prev = idx > 0 ? LESSONS[idx - 1] : null;
  const next = idx < LESSONS.length - 1 ? LESSONS[idx + 1] : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(lesson.title, lesson.slug)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd(lesson.title, lesson.description, lesson.slug, lesson.level, lesson.topics, idx + 1)) }} />
      {(() => {
        const faqSchema = faqJsonLd(lesson.faq);
        return faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /> : null;
      })()}

      <div className="min-h-screen bg-[#050816] text-white">
        <header className="border-b border-white/10 bg-[#0a0e1a]/80 backdrop-blur">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center gap-2 text-[10px] text-white/40 mb-3">
              <Link href="/" className="hover:text-white/70">Ana Sayfa</Link>
              /
              <Link href="/python-egitimi" className="hover:text-white/70">Python Eğitimi</Link>
              /
              {lesson.title}
            </div>
            <div className="flex items-start gap-4">
              <span className="text-5xl">{lesson.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                    lesson.level === "Başlangıç" ? "bg-emerald-500/15 text-emerald-300" :
                    lesson.level === "Orta" ? "bg-amber-500/15 text-amber-300" :
                    "bg-rose-500/15 text-rose-300"
                  }`}>
                    {lesson.level}
                  </span>
                  <span className="text-[11px] text-white/50">⏱ {lesson.duration}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{lesson.title}</h1>
                <p className="text-sm sm:text-base text-white/70">{lesson.description}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <section className="mb-8 p-5 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/20">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-300 mb-2">📖 Giriş</h2>
            <p className="text-base text-white/80 leading-relaxed">{lesson.intro}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4"><BookOpen className="w-5 h-5 inline mr-2 text-amber-300" /> Konu Başlıkları</h2>
            <div className="space-y-6">
              {lesson.sections.map((s, i) => (
                <article key={i} className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
                  <h3 className="text-lg font-bold mb-3">
                    {i + 1}. {s.heading}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed mb-3 whitespace-pre-line">{s.body}</p>
                  {s.code && (
                    <EditorErrorBoundary editorName={`Ders: ${s.heading}`}>
                      <LessonRunner code={s.code} label={s.codeLabel || `${s.heading}.py`} />
                    </EditorErrorBoundary>
                  )}
                </article>
              ))}
            </div>
          </section>

          {lesson.faq && lesson.faq.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">❓ Sıkça Sorulan Sorular</h2>
          <div className="space-y-3">
            {lesson.faq.map((item, i) => (
              <details
                key={i}
                className="group p-4 rounded-xl border border-white/10 bg-white/[0.02] [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="cursor-pointer flex items-center justify-between gap-3 text-white font-semibold list-none">
                  <h3 className="text-sm md:text-base flex-1 min-w-0">
                    {item.q}
                  </h3>
                  <span className="text-amber-300 text-xl group-open:rotate-45 transition-transform flex-shrink-0">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm md:text-base text-white/70 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8 p-5 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <h2 className="text-base font-bold text-amber-300 mb-2">📝 Ödev</h2>
            <p className="text-sm text-white/80 leading-relaxed mb-3">{lesson.homework}</p>
            <EditorErrorBoundary editorName="Ödev">
              <LessonRunner code={`# ${lesson.homework}\n# Buraya kendi çözümünü yaz\n`} label="cozum.py" />
            </EditorErrorBoundary>
          </section>

          <section className="mb-8 p-5 rounded-xl bg-white/[0.02] border border-white/10">
            <h2 className="text-base font-bold mb-3">🏷️ Bu derste öğrendiklerin</h2>
            <div className="flex flex-wrap gap-2">
              {lesson.topics.map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70">
                  {t}
                </span>
              ))}
            </div>
          </section>

          <nav className="flex items-center justify-between gap-4 pt-6 border-t border-white/10">
            {prev ? (
              <Link href={`/python-egitimi/${prev.slug}`} className="flex-1 max-w-[45%] p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-colors">
                <div className="text-[10px] text-white/40 mb-1">← Önceki</div>
                <div className="text-sm font-bold text-white/90">{prev.icon} {prev.title}</div>
              </Link>
            ) : <div className="flex-1" />}
            {next ? (
              <Link href={`/python-egitimi/${next.slug}`} className="flex-1 max-w-[45%] p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-colors text-right">
                <div className="text-[10px] text-white/40 mb-1">Sonraki →</div>
                <div className="text-sm font-bold text-white/90">{next.icon} {next.title}</div>
              </Link>
            ) : <div className="flex-1" />}
          </nav>
        </main>
      </div>
    </>
  );
}