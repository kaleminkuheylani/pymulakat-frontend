"use client";

// app/interviews/[category]/[id]/error.tsx
// Workspace route'u için runtime error boundary.
// "This page couldn't load" fallback yerine kullanıcıya anlamlı UI + Geri yolu.

import Link from "next/link";
import { useEffect } from "react";

export default function WorkspaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[WorkspaceError]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-2">Sayfa yüklenemedi</h1>
        <p className="text-white/60 text-sm mb-6">
          Soru çalışma alanı yüklenirken bir hata oluştu. Sayfayı yenilemeyi
          deneyebilir ya da soru listesine dönebilirsin.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold transition-colors"
          >
            Tekrar Dene
          </button>
          <Link
            href="/interviews"
            className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-colors"
          >
            Soru Listesine Dön
          </Link>
        </div>
        {error.digest && (
          <p className="mt-6 text-[10px] font-mono text-white/30">
            Hata kodu: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}