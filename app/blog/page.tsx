// app/blog/page.tsx
//
// BLOG LISTESI — Yazilim muhendisligi, algoritma, mulakat ipuclari.
// 2026-07-17: Ilk entry (algoritma-nedir).
//
// Mimari:
//   - Server component (DB-FIRST yerine inline data — 1 post)
//   - ISR: revalidate=3600
//   - Pymulakat dark + amber tema
//   - DB-driven olunca: blog_posts tablosu + getBlogPosts()

import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { BASE_URL } from "@/lib/seo";
import { getAllPosts } from "./posts";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "PYBlog — Algoritma, Mülakat İpuçları | Python Mülakat",
  description:
    "PYBlog — Python Mülakat'ın blog'u. Algoritma, veri yapıları, mülakat hazırlık stratejileri. Editöryal içerik, örnekler, görsel anlatımlar.",
  keywords: [
    "yazılım blog",
    "algoritma rehberi",
    "mülakat ipuçları",
    "python eğitim",
    "yazılım mühendisliği",
    "problem çözme",
  ],
  openGraph: {
    title: "PYBlog — Python Mülakat",
    description: "Algoritma, veri yapıları, mülakat hazırlık stratejileri.",
    url: `${BASE_URL}/blog`,
    type: "website",
  },
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-4 h-4" />
            PYBlog
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            PYBlog
          </h1>
          <p className="text-white/60 text-base md:text-lg max-w-2xl leading-relaxed">
            <strong className="text-white">PYBlog</strong> — Python Mülakat&apos;ın
            editöryal köşesi. Mülakat hazırlığında ihtiyacın olan kavramsal
            derinlik, görsel anlatımlar ve gerçek mühendislik perspektifi.
          </p>
        </header>

        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-amber-500/30 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 text-xs text-white/40 mb-2">
                      <time dateTime={post.date}>{post.date}</time>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingMinutes} dakika
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-amber-300 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-white/60 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-amber-300 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
