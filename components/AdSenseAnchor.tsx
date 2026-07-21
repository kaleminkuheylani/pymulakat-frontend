// components/AdSenseAnchor.tsx
// Mobile sticky bottom anchor reklam.
// SERVER COMPONENT (2026-07-21 fix) + CSS media query + route guard.
//
// Onceki: "use client" + usePathname — server-render'da BOS.
// Yeni: Server component + headers() + x-pathname middleware header.
//   Sadece /interviews/* sayfalarinda gosterilir (yasak sayfa guard).

import { headers } from "next/headers";
import AdSense from "./AdSense";
import { ADSENSE_SLOTS, ADSENSE_PUB_ID } from "@/lib/adsenseSlots";

export default async function AdSenseAnchor() {
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") || "";

  if (!pathname) return null;

  // Sadece /interveys/* sayfalarinda (kategori + detay)
  if (!pathname.startsWith("/interviews/")) return null;

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
