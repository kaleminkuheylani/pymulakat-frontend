// @ts-check

/** @type {import('next').NextConfig} */

const nextConfig = {
  // www -> apex redirect middleware.ts'te yapılıyor (308 Permanent).
  // Edge'de host header'ı okuyabilmek için burada redirects() kullanılmadı.

  async headers() {
    // Production-grade security headers (OWASP önerileri)
    const csp = [
      "default-src 'self'",
      // Next.js inline script + Pyodide WebAssembly
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      // Tailwind inline style + Monaco editor
      "style-src 'self' 'unsafe-inline'",
      // Supabase storage + general image hosting
      "img-src 'self' data: blob: https:",
      // Fonts (next/font inline data URIs)
      "font-src 'self' data:",
      // API calls (Supabase REST + Realtime WebSocket + own backend)
      `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://pymulakat-backend-production.up.railway.app`,
      // Web Workers (Pyodide runs in a worker)
      "worker-src 'self' blob:",
      // Clickjacking koruması (X-Frame-Options yerine modern alternatif)
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    const permissionsPolicy = [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "interest-cohort=()",  // FLoC opt-out
    ].join(", ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // HSTS — HTTPS zorla (1 yıl, subdomain dahil, preload-ready)
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          // Clickjacking (CSP frame-ancestors modern ama X-Frame-Options eski tarayıcılar için)
          { key: "X-Frame-Options", value: "DENY" },
          // XSS koruması (eski tarayıcılar için)
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Yetenek kısıtlama
          { key: "Permissions-Policy", value: permissionsPolicy },
          // Cross-origin izolasyon
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-site" },
          // İçerik güvenliği
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },

  transpilePackages: ["pyodide"],
};

export default nextConfig;