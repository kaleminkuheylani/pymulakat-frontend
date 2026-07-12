// app/interviews/[category]/page.tsx
// TÜM eski /interviews/[category] URL'leri yeni pillar sayfalarına 301 yönlendirir.
// Bu sayede eski backlink'ler korunur, duplicate content riski yok (canonical = yeni sayfa).

import { permanentRedirect } from "next/navigation";

const CATEGORY_MAP: Record<string, string> = {
  "python-basics": "/python-temelleri",
  "data-structures": "/veri-yapilari",
  "pandas": "/pandas",
  "list-dict": "/liste-sozluk",
  "heap": "/heap",
  "stack": "/stack",
  "queue": "/queue",
  "algorithms": "/algoritma-sorulari",
  "dynamic-programming": "/dinamik-programlama",
};

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryRedirectPage({ params }: PageProps) {
  const { category } = await params;
  const target = CATEGORY_MAP[category];
  if (target) {
    // Yeni pillar sayfaya 308 kalıcı yönlendirme (Next.js permanentRedirect)
    permanentRedirect(target);
  }
  // Bilinmeyen kategori — yine /interviews'a yönlendir
  permanentRedirect("/interviews");
}
