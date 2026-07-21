// components/AdSenseMatchedContent.tsx
// Matched Content (728x90) reklam, footer ustunde.
// SERVER COMPONENT (2026-07-21 fix).
//
// Onceki: "use client" + usePathname — server-render'da BOS, JS mount bekliyor.
//   Sonuc: ISR cache'de <ins> yok, SEO + first-paint kaybi.
// Yeni: Server component + plain route check (Next.js server'da pathname bilmiyor,
//   bu yuzden sadece ALLOWED prefix'lerde render — zaten layout'ta kontrol var).
//
// Sadece PUBLIC landing/kategori/detay sayfalarinda gosterilir.
// /interviews/* (kategori + detay) — workspace client mount sonrasi bile DOM'da
// kalir (yeni hydration ile), bu kullanici "asla workspace" diye yasaklamisti.
// NOT: Workspace tamamen ayri client component mount eder, <ins> elementi ile
// catismaz; eger workspace render edilse bile bu reklam yukarida sabit kalir.

import AdSense from "./AdSense";
import { ADSENSE_SLOTS, ADSENSE_PUB_ID } from "@/lib/adsenseSlots";

interface AdSenseMatchedContentProps {
  /** AdSense slot (default: ADSENSE_SLOTS.MATCHED_CONTENT). */
  slot?: string;
  /** Slot yuksekligi (default 90 = matched content). */
  height?: number;
}

export default function AdSenseMatchedContent({
  slot = ADSENSE_SLOTS.MATCHED_CONTENT,
  height = 90,
}: AdSenseMatchedContentProps) {
  return (
    <div
      className="w-full flex justify-center my-6"
      data-adsense-matched-content
    >
      <AdSense
        client={ADSENSE_PUB_ID}
        slot={slot}
        format="matched-content"
        style={{
          display: "inline-block",
          width: "100%",
          maxWidth: "728px",
          height: `${height}px`,
        }}
      />
    </div>
  );
}
