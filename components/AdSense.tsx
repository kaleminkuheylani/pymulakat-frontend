"use client";

// components/AdSense.tsx
// Reusable AdSense reklam komponenti — CLIENT COMPONENT (2026-07-21 robust SPA fix).
//
// Onceki: Server component, inline <ins> + inline push() script.
//   Ancak inline script'ler Next.js client-side routing (SPA geçişi)
//   sırasında browser tarafından TETİKLENMEZ. Bu yüzden navigasyon
//   edildikten sonra reklamlar yüklenmiyordu ve boş kalıyordu.
// Yeni: Client component, inline <ins> (SSR'da da görünür) + useEffect push().
//   Hem SSR ile sayfa ilk yüklendiğinde hem de SPA navigasyonlarında
//   reklamlar sorunsuz tetiklenir. Hydration mismatch olmaması için
//   <ins> elemanları server ile eşzamanlı render edilir.
//

import { useEffect, useRef } from "react";

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
  const initialized = useRef(false);

  useEffect(() => {
    // Sadece client-side'da ve her mount'ta bir kez tetikle
    if (initialized.current) return;

    try {
      if (typeof window !== "undefined") {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        initialized.current = true;
      }
    } catch (e) {
      console.error("AdSense push error:", e);
    }
  }, [slot]); // Slot değiştiğinde de gerekirse yeniden tetiklenebilmesi için

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
