"use client";

// GuestEditorGate — Misafir kullanıcılara editör yerine net üyelik CTA'sı.
// Kod yazma + kod çalıştırma akışının tamamını gizler; sadece question
// description ve starter_code'un önizlemesi görünür (HTML escape ile).

import { useRouter } from "next/navigation";
import { Target } from "lucide-react";

interface Props {
  category: string;
  id: string;
  starterCode?: string;
}

export default function GuestEditorGate({ category, id, starterCode }: Props) {
  const router = useRouter();
  const returnUrl = encodeURIComponent(`/interviews/${category}/${id}`);

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#050816] px-4 py-6 overflow-y-auto">
      <div className="max-w-md w-full">
        {/* Lock icon + başlık */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-amber-500/20 border border-indigo-500/30 mb-4">
            <svg
              className="w-8 h-8 text-amber-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Kodu çalıştırmak için üye ol
          </h2>
          <p className="text-sm text-white/60 leading-relaxed">
            Tarayıcı tabanlı Python editörünü kullanabilir, test case'leri
            otomatik çalıştırabilir, yapay zekâdan anında geri bildirim
            alabilir ve ilerlemeni kaydedebilirsin.
          </p>
        </div>

        {/* Starter code preview (read-only, escape) */}
        {starterCode && (
          <div className="mb-5 p-3 rounded-xl border border-white/10 bg-[#0a0e1a]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">
                Örnek başlangıç kodu
              </span>
              <span className="text-[9px] text-white/30">sadece önizleme</span>
            </div>
            <pre className="text-[11px] font-mono text-white/70 leading-relaxed overflow-x-auto max-h-32 overflow-y-auto">
              <code>{starterCode}</code>
            </pre>
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <button
            onClick={() => router.push(`/register?returnUrl=${returnUrl}`)}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#050816] font-bold text-sm transition-all active:scale-95 shadow-lg shadow-amber-500/20"
          >
            ✨ Ücretsiz Üye Ol
          </button>
          <button
            onClick={() => router.push(`/login?returnUrl=${returnUrl}`)}
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition-colors"
          >
            🔑 Giriş Yap
          </button>
        </div>

        {/* Feature bullets */}
        <ul className="text-xs text-white/50 space-y-1.5">
          <li>⚡ Pyodide ile tarayıcıda anında çalıştır</li>
          <li>🤖 Yapay zekâ destekli kod review</li>
          <li>📊 İlerleme + leaderboard takibi</li>
          <li><Target className="w-4 h-4 inline mr-1.5 text-amber-300" /> Kategorilere ayrılmış mülakat soruları</li>
        </ul>
      </div>
    </div>
  );
}
