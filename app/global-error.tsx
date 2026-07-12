"use client";

// app/global-error.tsx — En üst düzey hata yakalayıcı.
// Root layout bile patladığında devreye girer.
// "This page couldn't reload" Vercel fallback'i yerine diagnostik bilgi gösterir.

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hatayı konsola yaz + tarayıcı bilgisi ekle
    console.error("[GlobalError]", error);
    console.error("[GlobalError] URL:", window.location.href);
    console.error("[GlobalError] UA:", navigator.userAgent);
    console.error("[GlobalError] Online:", navigator.onLine);
    console.error(
      "[GlobalError] Cookie:",
      document.cookie.substring(0, 200)
    );
  }, [error]);

  return (
    <html lang="tr">
      <body
        style={{
          backgroundColor: "#050816",
          color: "#fff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          minHeight: "100vh",
          margin: 0,
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}>
          <AlertTriangle style={{ width: "3rem", height: "3rem", color: "#fb7185", marginBottom: "1rem" }} />
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            Sayfa yüklenemedi
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.875rem",
              marginBottom: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            Tarayıcınız bir hatayla karşılaştı. Bu genelde eski bir önbellek
            veya eksik JavaScript desteğinden kaynaklanır.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <button
              onClick={reset}
              style={{
                padding: "0.625rem 1.25rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.5rem",
                color: "#fff",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Tekrar Dene
            </button>
            <a
              href="/"
              style={{
                padding: "0.625rem 1.25rem",
                background: "#f59e0b",
                color: "#050816",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Ana Sayfa
            </a>
          </div>

          {error.digest && (
            <p
              style={{
                marginTop: "1.5rem",
                fontSize: "0.625rem",
                fontFamily: "monospace",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Hata kodu: {error.digest}
            </p>
          )}

          <details
            style={{
              marginTop: "2rem",
              textAlign: "left",
              background: "rgba(0,0,0,0.3)",
              padding: "1rem",
              borderRadius: "0.5rem",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <summary style={{ cursor: "pointer", color: "rgba(255,255,255,0.7)" }}>
              Teknik detaylar
            </summary>
            <pre
              style={{
                marginTop: "0.5rem",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {error.message || "Bilinmeyen hata"}
              {"\n\n"}
              {error.stack?.split("\n").slice(0, 5).join("\n")}
            </pre>
          </details>
        </div>
      </body>
    </html>
  );
}