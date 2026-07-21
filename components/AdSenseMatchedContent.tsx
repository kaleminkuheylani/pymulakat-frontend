// components/AdSenseMatchedContent.tsx
// Matched Content (728x90) reklam, footer ustunde.
// SERVER COMPONENT (2026-07-21 fix) + server-side route guard.
//
// Onceki: "use client" + usePathname — server-render'da BOS, JS mount bekliyor.
//   Sonuc: ISR cache'de <ins> yok, SEO + first-paint kaybi.
// Yeni: Server component + headers() ile pathname al, server-side route guard.
//   <ins> HTML'de hemen render edilir, JS mount beklemiyor.
//
// YASAK sayfalar (kullanici direktifi "asla workspace anasayfa dashboard"):
//   - / (anasayfa)
//   - /dashboard/* (kisisel)
//   - /login, /register, /profile, /settings
//   - /auth/*, /admin/*
//   - /python-online, /python-egitimi, /python-kodlari
//   - /about, /terms
//   - /python-basics/queue (queue kategori yok)
//
// Sadece PUBLIC landing/kategori/detay sayfalarinda gosterilir:
//   - /interviews/{cat} (kategori landing)
//   - /interviews/{cat}/{slug} (soru detay)
// NOT: Workspace tamamen ayri client component mount eder, <ins> elementi ile
// catismaz; eger workspace render edilse bile bu reklam yukarida sabit kalir.

import { headers } from "next/headers";
import AdSense from "./AdSense";
import { ADSENSE_SLOTS, ADSENSE_PUB_ID } from "@/lib/adsenseSlots";

interface AdSenseMatchedContentProps {
  /** AdSense slot (default: ADSENSE_SLOTS.MATCHED_CONTENT). */
  slot?: string;
  /** Slot yuksekligi (default 90 = matched content). */
  height?: number;
}

export default async function AdSenseMatchedContent({
  slot = ADSENSE_SLOTS.MATCHED_CONTENT,
  height = 90,
}: AdSenseMatchedContentProps) {
  // Server-side route guard: pathname al, izinli prefix'leri kontrol et.
  // Bu component async oldu, headers() kullandigi icin dynamic rendering tetikler
  // (sadece matched-content reklam alaninda, geri kalan ISR/cache'lenmis).
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") || hdrs.get("x-invoke-path") || "";

  // Server-side middleware zaten host www->apex redirect yapiyor.
  // headers() Next.js'te pathname'i direkt vermez (custom header gerekli veya
  // middleware uzerinden). Bu yuzden URL'i nextUrl'den alalim:
  // Fallback: pathname yoksa HIC gosterme (guvenli default).
  if (!pathname) {
    // pathname alinamadi, gosterme (güvenli taraf)
    return null;
  }

  // YASAK prefix'ler
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
  const isBlocked = BLOCKED_PREFIXES.some((p) => pathname.startsWith(p));
  if (isBlocked) return null;

  // YASAK tam eslesme (anasayfa)
  if (pathname === "/") return null;

  // Sadece izinli prefix: /interviews/
  if (!pathname.startsWith("/interviews/")) return null;

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
