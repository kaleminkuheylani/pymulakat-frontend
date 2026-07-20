"use client";

// components/ConditionalFooter.tsx
// Detail sayfalarında (interviews/guides) footer gizli, diğer sayfalarda görünür.
// ClientOnly içinde çalışır; pathname'e göre hiç mount etmez.

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname() || "";

  // Detay sayfalar (Workspace render eden) footer göstermez — focus mod.
  // Yeni top-level route: /{display}/{slug} (9 pillar + 1 DP)
  const detailSlugs = [
    "temelleri", "pandas", "heap", "stack", "queue",
    "veri-yapilari", "liste-sozluk", "algoritma-sorulari",
    "dinamik-programlama",
  ];
  const isNewDetailRoute = detailSlugs.some(
    (slug) => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)
  );
  const hideFooter =
    pathname.startsWith("/interviews/") ||
    pathname.startsWith("/guides/") ||
    isNewDetailRoute;
  if (hideFooter) return null;
  return <Footer />;
}