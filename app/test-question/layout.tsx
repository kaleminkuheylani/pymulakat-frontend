// app/test-question/layout.tsx
// Diagnostic sayfaları için noindex — Googlebot crawl etmesin, indeksleme kalitesini bozmasın.
// test-question/[id] sayfaları public diagnostic amaçlı; production sitemap'te yok.

import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function TestQuestionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
