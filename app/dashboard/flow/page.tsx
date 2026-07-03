// app/dashboard/flow/page.tsx — Kişiselleştirilmiş akış (sıralı öneri)

"use client";

import { useRecommendations } from "../../../hooks/useRecommendations";
import Link from "next/link";

export default function FlowPage() {
  const { items, loading, context } = useRecommendations(15);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">🌊 Senin Akışın</h1>
        <p className="text-white/60 text-sm">
          {context.is_authenticated
            ? `Seviyene ve ilgine göre ${items.length} içerik`
            : "Genel öneriler — giriş yaparak kişiselleştir"}
        </p>
        {!context.is_authenticated && (
          <Link href="/login" className="text-indigo-400 text-sm hover:underline">
            Giriş yap →
          </Link>
        )}
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <FlowItem key={`${item.type}-${item.id}`} item={item} rank={idx + 1} />
        ))}
      </div>

      {items.length === 0 && (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 text-center text-white/60">
          Henüz öneri yok. Birkaç soru çözdükten sonra kişiselleştirilmiş akışın görünür.
        </div>
      )}
    </div>
  );
}

function FlowItem({ item, rank }: { item: any; rank: number }) {
  let href = "";
  if (item.type === "question" && item.slug) href = `/interviews/${item.category}/${item.slug}`;
  else if (item.type === "tutorial" && item.slug) href = `/guides/${item.slug}`;
  else if (item.type === "form") href = `/dashboard/forms/${item.id}`;

  return (
    <Link
      href={href}
      className="flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all"
    >
      <div className="text-2xl font-bold text-white/20 w-8 text-center">
        {rank.toString().padStart(2, "0")}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs px-2 py-0.5 bg-white/5 rounded uppercase tracking-wide text-white/60">
            {item.type === "question" ? "📝 Soru" : item.type === "tutorial" ? "📖 Rehber" : "💬 Paylaşım"}
          </span>
          {item.category && (
            <span className="text-xs text-white/40">{item.category}</span>
          )}
        </div>
        <div className="font-medium text-white truncate">{item.title}</div>
        <div className="text-xs text-white/40 mt-1">{item.reason}</div>
      </div>
      <div className="text-white/30">→</div>
    </Link>
  );
}