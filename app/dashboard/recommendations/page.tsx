// app/dashboard/recommendations/page.tsx — Detaylı öneri sayfası

"use client";

import { useRecommendations } from "../../../hooks/useRecommendations";
import Link from "next/link";

export default function RecommendationsPage() {
  const { items, loading, context, refresh } = useRecommendations(20);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">✨ Öneriler</h1>
          <p className="text-white/60 text-sm">
            {context.is_authenticated
              ? `Senin için ${items.length} içerik seçildi`
              : "Kişiselleştirilmiş öneriler için giriş yap"}
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors disabled:opacity-50"
        >
          🔄 Yenile
        </button>
      </div>

      {context.is_authenticated && context.top_categories.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-500/10 to-amber-500/10 border border-indigo-500/20 rounded-xl p-4">
          <div className="text-xs text-white/60 mb-1">📊 Senin İlgi Alanların:</div>
          <div className="flex flex-wrap gap-2">
            {context.top_categories.map((c) => (
              <span key={c} className="text-xs px-3 py-1 bg-indigo-500/20 text-indigo-200 rounded-full">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item) => (
            <RecommendationCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      )}

      {items.length === 0 && !loading && (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 text-center text-white/60">
          Henüz öneri yok.
        </div>
      )}
    </div>
  );
}

function RecommendationCard({ item }: { item: any }) {
  let href = "";
  if (item.type === "question" && item.slug) href = `/interviews/${item.category}/${item.slug}`;
  else if (item.type === "form") href = `/dashboard/forms/${item.id}`;

  return (
    <Link
      href={href}
      className="block bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:bg-white/[0.05] hover:border-amber-500/30 transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs px-2 py-0.5 bg-white/5 rounded uppercase tracking-wide text-white/60">
          {item.type === "question" ? "📝 Soru" : item.type === "tutorial" ? "📖 Rehber" : "💬 Paylaşım"}
        </span>
        <span className="text-xs text-white/30">Skor: {Math.round(item.score)}</span>
      </div>
      <h3 className="font-semibold text-white mb-2 line-clamp-2">{item.title}</h3>
      <p className="text-xs text-white/50">{item.reason}</p>
    </Link>
  );
}