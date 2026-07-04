"use client";

// components/ConditionalFooter.tsx
// Detail sayfalarında (interviews) footer gizli, diğer sayfalarda görünür.

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname() || "";
  // Detay sayfalarında footer gizli (interview workspace, guides slug vs.)
  const hideFooter =
    pathname.startsWith("/interviews/") ||
    pathname.startsWith("/guides/");
  if (hideFooter) return null;
  return <Footer />;
}