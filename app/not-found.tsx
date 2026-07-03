"use client";

// app/not-found.tsx — 404 için özel UI.
// Vercel fallback yerine anlamlı Türkçe sayfa.

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold mb-2">Sayfa bulunamadı</h1>
        <p className="text-white/60 text-sm mb-6">
          Aradığın sayfa burada yok. Silinmiş, taşınmış ya da hiç var olmamış
          olabilir.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-colors"
          >
            Ana Sayfa
          </Link>
          <Link
            href="/interviews"
            className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold transition-colors"
          >
            Sorulara Göz At
          </Link>
        </div>
      </div>
    </div>
  );
}