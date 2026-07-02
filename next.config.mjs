// @ts-check

/** @type {import('next').NextConfig} */

// Apex (no www) tek canonical host
const CANONICAL_HOST = "pythonmulakat.com";

const nextConfig = {
  async redirects() {
    return [
      // www -> apex (308 Permanent Redirect)
      // Vercel proxy'sindeki 307'yi override eder.
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${CANONICAL_HOST}` }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
    ];
  },

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