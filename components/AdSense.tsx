// components/AdSense.tsx
// Reusable AdSense reklam komponenti — SERVER COMPONENT (2026-07-21 fix).
//
// Onceki: "use client" (useEffect ile push()) — server-render'da BOS render
//   ediliyordu, JS mount edilmeden reklam gorunmuyordu. SEO + first-paint
//   kaybi, hydration mismatch, ISR cache'de <ins> yok.
// Yeni: Server component, inline <ins> + inline push() script.
//   <ins> HTML'de hemen render edilir, JS yüklenmeden bile DOM'da.
//   Push() inline script ile sayfa yüklenir yüklenmez tetiklenir.
//
// Kullanim:
//   <AdSense slot="123" format="in-article" />
//   <AdSense slot="456" format="in-feed" style={{ margin: '1.5rem 0' }} />

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
  // Anchor (mobile sticky alt) — full-width fixed bottom
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
        <script
          dangerouslySetInnerHTML={{
            __html: "(adsbygoogle = window.adsbygoogle || []).push({});",
          }}
        />
      </>
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
      <script
        dangerouslySetInnerHTML={{
          __html: "(adsbygoogle = window.adsbygoogle || []).push({});",
        }}
      />
    </div>
  );
}
