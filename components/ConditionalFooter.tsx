"use client";

// components/ConditionalFooter.tsx
// Detail sayfalarında (interviews/guides) footer gizli, diğer sayfalarda görünür.
// İlk render'da footer GÖSTERİLİR (server-render ile uyumlu), client effect'inde
// pathname kontrol edilip detail sayfalarında kaldırılır.

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname() || "";
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // İlk server+client render'da footer görünsün (hydration uyumlu)
  if (!mounted) return <Footer />;

  // Client effect sonrası pathname'e göre gizle/göster
  const hideFooter =
    pathname.startsWith("/interviews/") ||
    pathname.startsWith("/guides/");
  if (hideFooter) return null;
  return <Footer />;
}