// lib/seo.ts
//
// SEO ve canonical URL için TEK KAYNAK.
// Tüm metadataBase, OG image URL, canonical, JSON-LD schema URL'leri
// buradan türetilir. 20+ dosyada hardcoded "https://pythonmulakat.com"
// vardı — hepsi buraya yönlendirildi (kullanici direktifi 2026-07-13).
//
// Production'da NEXT_PUBLIC_SITE_URL env ile override edilebilir
// (Vercel dashboard → Project Settings → Environment Variables).

export const BASE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pythonmulakat.com";

/** Sık kullanılan site-wide alanlar. */
export const SITE = {
  NAME: "PythonMulakat",
  LOCALE: "tr_TR",
  OG_IMAGE: `${BASE_URL}/og-default.png`,
  TWITTER_HANDLE: "@pythonmulakat",
  DESCRIPTION:
    "Python mülakat soruları, çözümleri ve tarayıcı tabanlı interaktif editör. 8+ kategoride 200+ soru ile mülakata hazırlanın.",
} as const;

/** URL path → tam URL helper. */
export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${normalized}`;
}
