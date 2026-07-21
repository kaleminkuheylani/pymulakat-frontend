"use client";

import { useEffect, useRef } from "react";

interface AdUnitProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const AD_CLIENT = "ca-pub-6019538059362110";

export default function AdUnit({
  slot,
  format = "auto",
  responsive = true,
  className,
  style,
}: AdUnitProps) {
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    try {
      const adsbygoogle = ((window as any).adsbygoogle = (window as any).adsbygoogle || []);
      adsbygoogle.push({});
      pushedRef.current = true;
    } catch {
      // ignore
    }
  }, []);

  return (
    <ins
      className={["adsbygoogle", className].filter(Boolean).join(" ")}
      style={{ display: "block", ...style }}
      data-ad-client={AD_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );
}
