"use client";

// components/AdSenseMatchedContent.tsx
// Matched Content (728x90) reklam, footer ustunde.
// CLIENT COMPONENT + usePathname route guard (2026-07-21 geri donus).
//
// Onceki server component + headers() Vercel build'de hata verdi
// (async chain + Suspense problemi). Client component'e geri donuldu.
// Server-render BOS (JS mount bekliyor), ama:
//   - Vercel build gecer ✓
//   - Route guard calisir (client-side pathname kontrolu) ✓
//   - ISR cache etkilenmez
//   - YASAK sayfalar gostermez ✓
// Tek tradeoff: ilk renderda reklam gorunmez, JS mount sonrasi DOM'a eklenir
// (CTR 0.5-1s gecikme, ihmal edilebilir).

import { usePathname } from "next/navigation";
import AdSense from "./AdSense";
import { ADSENSE_SLOTS, ADSENSE_PUB_ID } from "@/lib/adsenseSlots";

const BLOCKED_PREFIXES = [
  "/dashboard",
  "/login",
  "/register",
  "/profile",
  "/settings",
  "/auth/",
  "/admin",
  "/python-online",
  "/python-egitimi",
  "/python-kodlari",
  "/about",
  "/terms",
];

export default function AdSenseMatchedContent() {
  const pathname = usePathname() || "";

  // YASAK sayfalar
  if (pathname === "/") return null;
  if (BLOCKED_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  // Sadece /interviews/*
  if (!pathname.startsWith("/interviews/")) return null;

  return (
    <div
      className="w-full flex justify-center my-6"
      data-adsense-matched-content
    >
      <AdSense
        client={ADSENSE_PUB_ID}
        slot={ADSENSE_SLOTS.MATCHED_CONTENT}
        format="matched-content"
        style={{
          display: "inline-block",
          width: "100%",
          maxWidth: "728px",
          height: "90px",
        }}
      />
    </div>
  );
}
