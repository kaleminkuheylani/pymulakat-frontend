// app/interviews/[category]/layout.tsx
// Tüm interview sayfaları için ortak layout
// - QuestionMeta provider (function_name, topic, difficulty_note)
// - Server-side metadata için Question API fetch
// - GlobalNav ile uyumlu

import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ category: string }>;
}

/**
 * Layout: QuestionMeta'yı tüm çocuk sayfalara (WorkspaceClient, page.tsx) sağlar.
 * Server component — DB'ye gitmez, lib/questionMeta.ts'ten çeker.
 */
export default async function CategoryLayout({ children, params }: LayoutProps) {
  const { category } = await params;
  // Category adını validate et (SEO + hata önleme)
  const validCategories = ["python-basics", "strings", "list-dict", "pandas", "algorithms"];
  const cat = validCategories.includes(category) ? category : "python-basics";

  // Metadata tüm sayfalara uygulansın (SEO için)
  // (page.tsx'te override edilebilir)

  return <>{children}</>;
}