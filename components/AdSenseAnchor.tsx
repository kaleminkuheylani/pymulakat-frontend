"use client";

// components/AdSenseAnchor.tsx
// Mobile sticky bottom anchor reklam.
// CLIENT COMPONENT + usePathname route guard + CSS media query (2026-07-21 geri donus).
//
// Onceki server component + headers() Vercel build'de hata verdi.
// Client component'e geri donuldu. JS mount bekliyor ama build kesin gecer.

import { usePathname } from "next/navigation";
import AdSense from "./AdSense";
import { ADSENSE_SLOTS, ADSENSE_PUB_ID } from "@/lib/adsenseSlots";

export default function AdSenseAnchor() {
  const pathname = usePathname() || "";

  // Sadece /interviews/*
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
