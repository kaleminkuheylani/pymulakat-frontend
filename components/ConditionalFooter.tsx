"use client";

// components/ConditionalFooter.tsx
// Detail sayfalarında (interviews/guides) footer gizli, diğer sayfalarda görünür.
// İlk render'da footer GÖSTERİLİR (server-render ile uyumlu), client effect'inde
// pathname kontrol edilip detail sayfalarında kaldırılır.

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname() || "";
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // İlk server+client render'da footer görünsün (hydration uyumlu)
  if (!mounted) return <Footer />;

  // Client effect sonrası pathname'e göre gizle/göster.
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