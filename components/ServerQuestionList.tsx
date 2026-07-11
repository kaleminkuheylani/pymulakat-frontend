// components/ServerQuestionList.tsx
//
// DB-FIRST mimari (2026-07-11): server tarafında backend API'den soruları çeker,
// initialQuestions prop'uyla QuestionListClient'a geçer. Böylece
// ilk HTML (SSR, no-JS, Googlebot) tam liste ile gelir; client
// component sadece hydration + revalidate için tekrar fetch eder.
//
// Bu server component, tüm pillar sayfalarında (python-temelleri,
// python-dinamik-programlama, ...) paylaşılır — DRY.

import { listQuestionsByCategory, slugifyTitle as csvSlugify } from "../lib/api/questionAPI";
import QuestionListClient from "./QuestionListClient";

interface Props {
  category: string;
  urlSlug: string;
  displaySlug?: string;
  skeletonCount?: number;
}

export default async function ServerQuestionList({
  category,
  urlSlug,
  displaySlug,
  skeletonCount,
}: Props) {
  const items = await listQuestionsByCategory(category);
  const initialQuestions = items.map((q) => ({
    id: q.id,
    title: q.title,
    slug: csvSlugify(q.title),
    category: q.category,
    level: q.level,
    description: q.description,
    function_name: q.function_name ?? undefined,
  }));
  return (
    <QuestionListClient
      category={category}
      urlSlug={urlSlug}
      displaySlug={displaySlug}
      skeletonCount={skeletonCount}
      initialQuestions={initialQuestions}
      initialSource="primary"
    />
  );
}
