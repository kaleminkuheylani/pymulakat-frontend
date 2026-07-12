// components/ServerQuestionList.tsx
//
// DB-FIRST mimari (2026-07-11): server tarafında backend API'den soruları çeker,
// initialQuestions prop'uyla QuestionListClient'a geçer. Böylece
// ilk HTML (SSR, no-JS, Googlebot) tam liste ile gelir; client
// component sadece hydration + revalidate için tekrar fetch eder.
//
// 📌 Çoklu kategori desteği (2026-07-12): "iki farklı kaynak" bug fix.
//   `category` (tek) veya `categories` (çoklu) prop'u verilebilir.
//   Çoklu mod: tek bir QuestionListClient render edilir, sorular birleşik
//   (Promise.all ile paralel fetch), displaySlug başlık olarak kullanılır.
//
// Bu server component, tüm pillar sayfalarında (python-temelleri,
// python-dinamik-programlama, ...) paylaşılır — DRY.

import { listQuestionsByCategory } from "../lib/api/questionAPI";
import QuestionListClient from "./QuestionListClient";

interface Props {
  /** Tek kategori (geriye uyumluluk) */
  category?: string;
  /** Çoklu kategori (yeni: birleşik liste için) */
  categories?: string[];
  urlSlug: string;
  /** Çoklu modda "algorithms + dynamic-programming" gibi başlık */
  displaySlug?: string;
  skeletonCount?: number;
}

export default async function ServerQuestionList({
  category,
  categories,
  urlSlug,
  displaySlug,
  skeletonCount,
}: Props) {
  // Çoklu mod: paralel fetch
  let items: Awaited<ReturnType<typeof listQuestionsByCategory>> = [];
  let effectiveCategories: string[];
  if (categories && categories.length > 0) {
    effectiveCategories = categories;
    const lists = await Promise.all(
      categories.map((c) => listQuestionsByCategory(c))
    );
    items = lists.flat().sort((a, b) => a.id - b.id);
  } else if (category) {
    effectiveCategories = [category];
    items = await listQuestionsByCategory(category);
  } else {
    // Hiçbiri verilmemiş — boş liste
    items = [];
    effectiveCategories = [];
  }

  const initialQuestions = items.map((q) => ({
    id: q.id,
    title: q.title,
    slug: q.slug ?? "",  // DB slugify_title kaldirildi, DB slug kolonu kullanilir
    category: q.category,
    level: q.level,
    description: q.description,
    function_name: q.function_name ?? undefined,
  }));

  // Çoklu modda: displaySlug boşsa kategori listesi göster
  const effectiveDisplaySlug =
    displaySlug ?? (effectiveCategories.length > 1 ? effectiveCategories.join(", ") : undefined);

  return (
    <QuestionListClient
      category={effectiveCategories[0] ?? ""}
      categories={effectiveCategories}
      urlSlug={urlSlug}
      displaySlug={effectiveDisplaySlug}
      skeletonCount={skeletonCount}
      initialQuestions={initialQuestions}
      initialSource="primary"
    />
  );
}
