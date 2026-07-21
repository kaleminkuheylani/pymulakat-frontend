// components/AdSenseAnchor.tsx
// Mobile sticky bottom anchor reklam.
// 2026-07-21, kullanici direktifi: CTR optimizasyonu.
//
// YASAK sayfalar (kullanici direktifi "asla workspace anasayfa dashboard"):
//   - / (anasayfa)
//   - /dashboard/* (kisisel)
//   - workspace client component (kod editoru)
//
// Sadece /interviews/* sayfalarinda mobile-only sticky alt reklam.

"use client";

import { usePathname } from "next/navigation";
import AdSense from "./AdSense";

const AD_SLOT = "9232002070";

export default function AdSenseAnchor() {
  const pathname = usePathname() || "";

  // Sadece /interviews/* — kategori landing + detay sayfalari
  // Workspace (/interviews/{cat}/{slug}) da bu prefix'te ama client mount
  // sonrasi DOM'da bu reklam KALIR — workspace kendi container'inda
  // ayri olarak mount edilir. Bu nedenle pathname ile guard YETERLI.
  const isAllowed = pathname.startsWith("/interviews/");
  if (!isAllowed) return null;

  return (
    <>
      {/* Mobile-only — CSS ile md:ustunde gizle (desktop'ta sticky bottom UX kotu) */}
      <div className="block md:hidden" data-adsense-anchor>
        <AdSense slot={AD_SLOT} format="anchor" />
      </div>
    </>
  );
}
