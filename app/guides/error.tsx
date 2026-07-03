"use client";

// app/guides/error.tsx — Rehber sayfaları için error boundary.
// Hydration mismatch veya runtime hata olursa kullanıcıya anlamlı fallback gösterir.

import Link from "next/link";
import { useEffect } from "react";

export default function GuidesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GuidesError]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-4">📘</div>
        <h1 className="text-2xl font-bold mb-2">Rehber yüklenemedi</h1>
        <p className="text-white/60 text-sm mb-6">
          Bu rehber şu anda görüntülenemiyor. Bir kaç saniye sonra tekrar deneyebilirsin.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors"
          >
            Tekrar Dene
          </button>
          <Link
            href="/guides"
            className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
          >
            Tüm Rehberler
          </Link>
        </div>
        {error?.digest && (
          <p className="text-white/30 text-xs mt-6 font-mono">
            ref: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}