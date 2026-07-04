"use client";

// components/ClientOnly.tsx
// Server-render'da hiçbir şey render etmez, sadece client mount'ta children'ı basar.
// Hydration mismatch'i önler (usePathname, useUser vs Next 16 client-only hook'ları).

import { useEffect, useState } from "react";

export default function ClientOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}