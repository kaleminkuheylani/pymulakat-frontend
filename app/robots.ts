// app/robots.ts
//
// robots.txt generator (Next.js 13+ MetadataRoute).
//
// 2026-07-22 AdSense onay icin optimize:
//   - Googlebot + Googlebot-Image + Mediapartners-Google (AdSense bot) icin
//     ozel rules (allow all) — AdSense "Bulunamadi" cache workaround
//   - Tum public sayfalara allow
//   - Sadece auth/admin gerektiren sayfalar disallow
//   - Sitemap URL'si acıkca gosterildi
//
// Onceki (2026-07-15): "Disallow: /api/ai-feedback/" — bu AdSense bot
//   icin yanlis sinyal olabilir (crawler blocklanmis izlenimi).
// Yeni: ai-feedback de allow (POST endpoint, GET icin zarar yok, zaten
//   sadece auth user POST yapabilir, GET 401 doner).
//
// NOT: robots.txt sadece crawler davranisini kontrol eder, gercek
//   sayfa engellemez. Auth middleware zaten sayfa seviyesinde koruma yapar.

import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 1) Google bot ailesi — ozel allow rules (AdSense + Search + Images)
      //    AdSense "Bulunamadi" cache sorunu icin Mediapartners-Google
      //    botuna explicit allow.
      {
        userAgent: [
          "Googlebot",
          "Googlebot-Image",
          "Googlebot-News",
          "Googlebot-Video",
          "Mediapartners-Google", // AdSense crawler
          "AdsBot-Google",
        ],
        allow: ["/", "/ads.txt"],
        disallow: [
          // Sadece auth gerektiren sayfalar — bunlar Google icin zaten anlamsiz
          "/admin/",
          "/dashboard/",
          "/login",
          "/register",
          "/profile",
          "/settings",
          "/auth/callback",
        ],
      },
      // 2) Genel crawler'lar (Bing, Yandex, vb.) — aynı kurallar
      {
        userAgent: "*",
        allow: ["/", "/ads.txt", "/api/sitemap"],
        disallow: [
          "/admin/",
          "/dashboard/",
          "/auth/callback",
          // /api/auth, /api/ai-feedback, /api/revalidate — auth gerektiren
          //   API endpoint'leri (Google crawl etse bile anlamsiz, ama
          //   zarar da yok. Onceki 'disallow' kaldirildi, sadece sayfa
          //   disallow kaldi)
        ],
      },
    ],
    sitemap: [
      `${BASE_URL}/api/sitemap`,
      // Google icin ek sitemap URL (sosyal medya, Google News uyumlu)
    ],
    // 2026-07-22: 'host' direktifi KALDIRILDI (Google 2019'dan beri desteklemiyor,
    //   "Kural yok sayildi" uyarisi veriyor). Host bilgisi sitemap'te zaten var.
  };
}
