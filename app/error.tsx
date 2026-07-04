"use client";

// app/error.tsx — Global runtime error boundary
// "This page couldn't load" Vercel fallback'i yerine anlamlı UI.

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-2">Bir şeyler ters gitti</h1>
        <p className="text-white/60 text-sm mb-6">
          Beklenmeyen bir hata oluştu. Sayfayı yenilemeyi ya da ana sayfaya
          dönmeyi deneyebilirsin.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold transition-colors"
          >
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-colors"
          >
            Ana Sayfa
          </Link>
        </div>
        {error.digest && (
          <p className="mt-6 text-[10px] font-mono text-white/30">
            Hata kodu: {error.digest}
          </p>
        )}
        <details className="mt-4 text-left bg-black/30 border border-white/10 rounded-lg p-3 text-xs">
          <summary className="cursor-pointer text-white/40 hover:text-white/70">Teknik detaylar</summary>
          <pre className="mt-2 text-rose-300 whitespace-pre-wrap break-all">
            {error.message}
            {error.stack && `\n\n${error.stack.split('\n').slice(0, 5).join('\n')}`}
          </pre>
        </details>
      </div>
    </div>
  );
}