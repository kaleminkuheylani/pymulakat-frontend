// components/AdSense.tsx
// Reusable AdSense reklam komponenti (2026-07-21, kullanici direktifi).
//
// CTR optimizasyonu: yuksek CTR placement'lar:
//   - In-Article (300x250, icerik arasi)
//   - In-Feed (native, liste icinde)
//   - Matched Content (728x90, footer ustu)
//   - Anchor/Sticky (mobile, alt)
//
// YASAK sayfalar (kullanici direktifi "asla workspace anasayfa dashboard"):
//   - / (anasayfa)
//   - /dashboard/* (kisisel)
//   - /interviews/{cat}/{slug} workspace (kod editor)
//
// Kullanim:
//   <AdSense slot="9232002070" format="in-article" />
//   <AdSense slot="9232002070" format="in-feed" style={{ margin: '1.5rem 0' }} />

"use client";

import { useEffect } from "react";

interface AdSenseProps {
  /** AdSense ad slot ID (AdSense panel'den alinir). */
  slot: string;
  /** AdSense ad client (publisher ID). Default: env'den alinir. */
  client?: string;
  /**
   * Reklam formati:
   * - "auto" (default): responsive, genelde in-article gibi davranir
   * - "in-article": 300x250, makale arasi
   * - "in-feed": native, feed icinde
   * - "matched-content": 728x90, ilgili icerik
   * - "anchor": mobile sticky alt
   */
  format?: "auto" | "in-article" | "in-feed" | "matched-content" | "anchor";
  /** Inline style (genelde layout). */
  style?: React.CSSProperties;
  /** Ek class. */
  className?: string;
}

const DEFAULT_CLIENT = "ca-pub-6019538059362110";

export default function AdSense({
  slot,
  client = DEFAULT_CLIENT,
  format = "auto",
  style,
  className,
}: AdSenseProps) {
  // push() — AdSense client'a "bu reklami yukle" sinyali
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      // @ts-expect-error - window.adsbygoogle global'i AdSense script tarafindan set edilir
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Hata durumunda sessiz (AdSense bazen reklam gostermez,
      // bu durum click-through rate'i etkilemez)
      console.warn("[AdSense] push() failed:", e);
    }
  }, [slot, format]);

  // Anchor reklami mobile-only ve sticky alt
  if (format === "anchor") {
    return (
      <>
        <ins
          className={`adsbygoogle ${className ?? ""}`}
          style={{
            display: "block",
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 40,
            background: "rgba(5, 8, 22, 0.95)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            ...style,
          }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="anchor"
          data-ad-anchor-type="bottom"
        />
        {/* Anchor icin ek push gerekli (ustteki useEffect yeterli) */}
      </>
    );
  }

  // Normal reklam blogu (in-article, in-feed, matched-content, auto)
  return (
    <ins
      className={`adsbygoogle ${className ?? ""}`}
      style={{
        display: "block",
        textAlign: "center",
        margin: "1.5rem auto",
        ...style,
      }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={format === "in-feed" || format === "matched-content" ? "true" : "false"}
    />
  );
}
