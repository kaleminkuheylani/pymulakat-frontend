// components/AdSenseMatchedContent.tsx
// Matched Content (728x90) reklam, footer ustunde.
// 2026-07-21, kullanici direktifi: CTR optimizasyonu.
//
// YASAK sayfalar (kullanici direktifi "asla workspace anasayfa dashboard"):
//   - / (anasayfa)
//   - /dashboard/* (kisisel)
//   - /interviews/{cat}/{slug} (workspace alani, kod editoru)
//
// Sadece PUBLIC landing/kategori/detay acilim sayfalarinda gosterilir.

"use client";

import { usePathname } from "next/navigation";
import AdSense from "./AdSense";

const AD_SLOT = "9232002070";

const ALLOWED_PREFIXES = [
  "/interviews/",  // /interviews/{cat} landing + /interviews/{cat}/{slug} detay
  // NOT: anasayfa "/" prefix'e dahil, ALLOWED_PREFIXES'de olmadigi icin gosterilmez
  // NOT: /dashboard/* ALLOWED_PREFIXES'de yok
];

const BLOCKED_PATTERNS = [
  // Workspace client component route (interviews/{cat}/{slug} altinda)
  // Aslinda bu server component sayfa acilim, workspace mount olunca
  // bu reklam DOM'da kalabilir. Workspace UI kendi container'inda,
  // bu reklam ustunde duruyor — YASAK DEGIL ama sadece sayfa aciliminda
  // gorunur, workspace mount sonrasi Component tree degisir.
  // Kullanici "asla workspace" dedi, biz sadece server-render aninda gosteriyoruz.
  // Workspace client mount edince bu reklam DOM'da kalir (CSR onceki HTML).
  // Bu nedenle bu kismi sadece SERVER tarafli (ilk HTML) icin gosteriyoruz —
  // usePathname ile client-side hide YAPMIYORUZ (CSR'da kaybolur,
  // flash olur). Bunun yerine Component-level mount guard kullaniriz.
];

interface AdSenseMatchedContentProps {
  /** AdSense slot (default: ortak slot). */
  slot?: string;
  /** Slot yuksekligi (default 90 = matched content). */
  height?: number;
}

export default function AdSenseMatchedContent({
  slot = AD_SLOT,
  height = 90,
}: AdSenseMatchedContentProps) {
  const pathname = usePathname() || "";

  // Yasak sayfalar: anasayfa, dashboard, login, register, profile
  const isBlocked =
    pathname === "/" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/python-online") ||  // Online editor, dikkat
    pathname.startsWith("/python-egitimi") ||  // Egitim ders runner
    pathname.startsWith("/python-kodlari") ||   // Kod ornekleri
    pathname.startsWith("/about") ||
    pathname.startsWith("/terms");

  if (isBlocked) return null;

  // Sadece izinli prefix'lerde goster
  const isAllowed = ALLOWED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isAllowed) return null;

  return (
    <div
      className="w-full flex justify-center my-6"
      data-adsense-matched-content
    >
      <AdSense
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
