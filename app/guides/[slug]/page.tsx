// app/guides/[slug]/page.tsx
// Tutorial/rehber sayfası — uzun form SEO content, internal linking, FAQ schema

import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { tutorialsAPI, type Tutorial } from "../../../api/v2/tutorials";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── Server-side fetch ────────────────────────────────────
async function fetchTutorial(slug: string): Promise<Tutorial | null> {
  try {
    const h = await headers();
    const host = h.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || `${protocol}://${host}`;
    const res = await fetch(`${apiUrl}/api/v2/tutorials/${encodeURIComponent(slug)}`, {
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

// ─── generateMetadata ─────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = await fetchTutorial(slug);
  if (!tutorial) {
    return { title: "Rehber bulunamadı | PythonMulakat" };
  }

  const title = `${tutorial.title} — Python Rehberi | PythonMulakat`;
  const description = tutorial.description.slice(0, 160);

  return {
    title,
    description,
    keywords: [tutorial.title, "python rehber", "python mülakat", ...(tutorial.faq?.map((f) => f.question) || [])].join(", "),
    alternates: {
      canonical: `https://pythonmulakat.com/guides/${tutorial.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://pythonmulakat.com/guides/${tutorial.slug}`,
      siteName: "PythonMulakat",
      locale: "tr_TR",
      type: "article",
      images: tutorial.cover_image ? [{ url: tutorial.cover_image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ─── Article Schema ───────────────────────────────────────
function buildArticleSchema(t: Tutorial, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: t.title,
    description: t.description,
    author: { "@type": "Organization", name: "PythonMulakat", url: baseUrl },
    publisher: {
      "@type": "Organization",
      name: "PythonMulakat",
      logo: { "@type": "ImageObject", url: `${baseUrl}/logo.png` },
    },
    datePublished: t.published_at,
    dateModified: t.updated_at || t.published_at,
    inLanguage: "tr-TR",
    articleSection: t.category,
    keywords: t.faq?.map((f) => f.question).join(", "),
    mainEntityOfPage: `${baseUrl}/guides/${t.slug}`,
  };
}

// ─── FAQ Schema ───────────────────────────────────────────
function buildFAQSchema(faq: Array<{ question: string; answer: string }>) {
  if (!faq?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

// ─── Breadcrumb ───────────────────────────────────────────
function buildBreadcrumbSchema(slug: string, title: string, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Rehberler", item: `${baseUrl}/guides` },
      { "@type": "ListItem", position: 3, name: title, item: `${baseUrl}/guides/${slug}` },
    ],
  };
}

// ─── Basit Markdown Renderer (tutorial için) ──────────────
// Heading, list, code block, bold, code, link desteği
function MarkdownTutorial({ content }: { content: string }) {
  const html = renderMarkdownToHTML(content);
  return (
    <div
      className="prose prose-invert prose-indigo max-w-none
        prose-headings:text-white prose-headings:font-bold
        prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
        prose-p:text-white/80 prose-p:leading-relaxed
        prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-white
        prose-code:text-emerald-300 prose-code:bg-black/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10
        prose-li:text-white/80
        prose-blockquote:border-indigo-500/40 prose-blockquote:text-white/70
        prose-table:border-collapse prose-th:bg-white/5 prose-td:border-white/10"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// XSS-safe markdown → HTML
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderMarkdownToHTML(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let codeLang = "";

  for (const rawLine of lines) {
    // Code block toggle
    if (rawLine.trim().startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = rawLine.trim().slice(3);
        codeContent = [];
      } else {
        out.push(
          `<pre><code class="language-${escapeHtml(codeLang)}">${escapeHtml(codeContent.join("\n"))}</code></pre>`
        );
        inCodeBlock = false;
      }
      continue;
    }
    if (inCodeBlock) {
      codeContent.push(rawLine);
      continue;
    }

    const line = rawLine;

    // Headings
    if (line.startsWith("### ")) {
      out.push(`<h3>${inline(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith("## ")) {
      out.push(`<h2>${inline(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith("# ")) {
      out.push(`<h1>${inline(line.slice(2))}</h1>`);
      continue;
    }

    // Lists
    if (/^[-*]\s+/.test(line)) {
      out.push(`<li>${inline(line.replace(/^[-*]\s+/, ""))}</li>`);
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      out.push(`<li>${inline(line.replace(/^\d+\.\s+/, ""))}</li>`);
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      out.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);
      continue;
    }

    // Empty line
    if (!line.trim()) {
      out.push("");
      continue;
    }

    // Paragraph
    out.push(`<p>${inline(line)}</p>`);
  }

  // Unclosed codeblock
  if (inCodeBlock) {
    out.push(`<pre><code>${escapeHtml(codeContent.join("\n"))}</code></pre>`);
  }

  return out.join("\n");
}

function inline(s: string): string {
  let r = escapeHtml(s);
  // Bold
  r = r.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // Italic
  r = r.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  // Inline code
  r = r.replace(/`([^`]+)`/g, "<code>$1</code>");
  // Links [text](url)
  r = r.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return r;
}

// ─── Page ─────────────────────────────────────────────────
export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const tutorial = await fetchTutorial(slug);

  const baseUrl = "https://pythonmulakat.com";

  // Bulunamadıysa 404 fallback
  if (!tutorial) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-3">Rehber bulunamadı</h1>
          <p className="text-white/60 mb-6">
            Aradığınız <code className="text-indigo-400">{slug}</code> rehberi mevcut değil.
          </p>
          <Link
            href="/guides"
            className="inline-block px-5 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors"
          >
            Tüm Rehberler
          </Link>
        </div>
      </div>
    );
  }

  const articleSchema = buildArticleSchema(tutorial, baseUrl);
  const breadcrumbSchema = buildBreadcrumbSchema(slug, tutorial.title, baseUrl);
  const faqSchema = buildFAQSchema(tutorial.faq || []);

  // Related questions'ı çekmek için parallel fetch (basit linkler)
  const relatedQuestionLinks = (tutorial.related_question_ids || []).slice(0, 5);

  return (
    <>
      {/* Schema.org yapısal veri — </ → \/ escape ile script tag injection / hydration mismatch önlemi */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      )}

      <div className="min-h-screen bg-[#050816] text-white">
        {/* Header */}
        <header className="border-b border-white/5 bg-[#0a0e1a]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold">
              🐍 PythonMulakat
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/interviews" className="text-white/60 hover:text-white transition-colors">
                Sorular
              </Link>
              <Link href="/guides" className="text-indigo-400 font-semibold">
                Rehberler
              </Link>
            </nav>
          </div>
        </header>

        <article className="max-w-4xl mx-auto px-5 py-10">
          {/* Breadcrumb */}
          <nav className="text-sm text-white/50 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-white">Rehberler</Link>
            <span>/</span>
            <span className="text-white/80">{tutorial.title}</span>
          </nav>

          {/* Title + Meta */}
          <header className="mb-8 pb-8 border-b border-white/10">
            {tutorial.category && (
              <div className="text-xs uppercase tracking-wider text-indigo-400 mb-3">
                {tutorial.category}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {tutorial.title}
            </h1>
            <p className="text-xl text-white/70 leading-relaxed mb-5">
              {tutorial.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-white/50">
              <span>⏱️ {tutorial.reading_time_minutes || 10} dakika okuma</span>
              {tutorial.difficulty && (
                <>
                  <span>•</span>
                  <span className="capitalize">{tutorial.difficulty}</span>
                </>
              )}
              <span>•</span>
              <time dateTime={tutorial.published_at}>
                {new Date(tutorial.published_at).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </header>

          {/* Content */}
          <MarkdownTutorial content={tutorial.content_md} />

          {/* FAQ */}
          {tutorial.faq && tutorial.faq.length > 0 && (
            <section className="mt-12 pt-8 border-t border-white/10">
              <h2 className="text-2xl font-bold mb-6">Sık Sorulan Sorular</h2>
              <div className="space-y-4">
                {tutorial.faq.map((f, i) => (
                  <details
                    key={i}
                    className="group p-4 rounded-lg bg-white/[0.03] border border-white/10 hover:border-indigo-500/30 transition-colors"
                  >
                    <summary className="cursor-pointer font-semibold text-white/90 flex items-start gap-3">
                      <span className="text-indigo-400 flex-shrink-0">S:</span>
                      <span>{f.question}</span>
                    </summary>
                    <div className="mt-3 pl-7 text-white/70 leading-relaxed">
                      <span className="text-emerald-400 font-semibold mr-1.5">C:</span>
                      {f.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related Questions (internal linking) */}
          {relatedQuestionLinks.length > 0 && (
            <section className="mt-12 pt-8 border-t border-white/10">
              <h2 className="text-2xl font-bold mb-6">İlgili Mülakat Soruları</h2>
              <p className="text-white/60 mb-4">
                Bu rehberi okuduktan sonra şu soruları çözerek pratiğinizi pekiştirin:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {relatedQuestionLinks.map((qid) => (
                  <Link
                    key={qid}
                    href={`/interviews/python-basics/${qid}`}
                    className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:border-indigo-400/50 transition-all group"
                  >
                    <span className="text-sm font-mono text-white/50">#{qid}</span>
                    <span className="flex-1 text-white/85 group-hover:text-white">Soru {qid}</span>
                    <span className="text-indigo-300 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="mt-12 p-6 rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-indigo-500/30">
            <h3 className="text-xl font-bold mb-2">Pratik yapmaya hazır mısın?</h3>
            <p className="text-white/70 mb-4">
              Tüm Python mülakat sorularını tarayıcıda çalıştır, test caseleri geç, kodunu paylaş.
            </p>
            <Link
              href="/interviews"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors"
            >
              Sorulara Göz At
              <span>→</span>
            </Link>
          </section>
        </article>
      </div>
    </>
  );
}