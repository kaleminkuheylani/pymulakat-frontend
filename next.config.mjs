// @ts-check

/** @type {import('next').NextConfig} */

const nextConfig = {
  // www -> apex redirect middleware.ts'te yapılıyor (308 Permanent).
  // Edge'de host header'ı okuyabilmek için burada redirects() kullanılmadı.

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  transpilePackages: ["pyodide"],
};

export default nextConfig;