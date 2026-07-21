// components/AdSenseAnchor.tsx
// Mobile sticky bottom anchor reklam.
// SERVER COMPONENT (2026-07-21 fix) + CSS ile mobile-only.
//
// Onceki: "use client" + usePathname — server-render'da BOS, JS mount bekliyor.
//   Sonuc: ISR cache'de <ins> yok, SEO + first-paint kaybi.
// Yeni: Server component + CSS media query (md:ustunde gizle).
//   <ins> HTML'de hemen render edilir, JS yüklenmeden bile DOM'da.

import AdSense from "./AdSense";
import { ADSENSE_SLOTS, ADSENSE_PUB_ID } from "@/lib/adsenseSlots";

export default function AdSenseAnchor() {
  return (
    <div className="md:hidden" data-adsense-anchor>
      <AdSense
        client={ADSENSE_PUB_ID}
        slot={ADSENSE_SLOTS.ANCHOR}
        format="anchor"
      />
    </div>
  );
}
