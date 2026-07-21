"use client";

// components/AdSense.tsx
// Reusable AdSense reklam komponenti — CLIENT COMPONENT.
//
// 2026-07-21 FIX: Server component hatasını çözmek için client component yapıldı.
// <script> tag'i React component içinde direct render edilemez — Next.js bunu yasaklıyor.
// useEffect ile adsbygoogle.push() çağırıldığında dinamik olarak reklamlar render edilir.
//
// Kullanim:
//   <AdSense slot="123" format="in-article" />
//   <AdSense slot="456" format="in-feed" style={{ margin: '1.5rem 0' }} />

import { useEffect } from "react";

interface AdSenseProps {
  /** AdSense ad slot ID (AdSense panelden alinir). */
  slot: string;
  /** AdSense ad client (publisher ID). */
  client?: string;
  /**
   * Reklam formati:
   * - "auto" (default): responsive
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
  useEffect(() => {
    // AdSense global variable'ını başlat
    if (typeof window !== "undefined") {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      // Push AdSense'e yeni reklam render etmesini söyle
      (window as any).adsbygoogle.push({});
    }
  }, [slot]); // slot değişirse yeniden tetikle

  // Anchor (mobile sticky alt) — full-width fixed bottom
  if (format === "anchor") {
    return (
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
    );
  }

  // Normal reklam blogu (in-article, in-feed, matched-content, auto)
  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          textAlign: "center",
          margin: "1.5rem auto",
        }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={
          format === "in-feed" || format === "matched-content" ? "true" : "false"
        }
      />
    </div>
  );
}
