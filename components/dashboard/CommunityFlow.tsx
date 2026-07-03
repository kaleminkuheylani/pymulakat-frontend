// components/dashboard/CommunityFlow.tsx
// Lazy-loaded: dashboard page initial bundle'dan bu cikar.

import { useState } from "react";
import Link from "next/link";

interface FlowItem {
  type: string;
  id: number;
  title: string;
  category?: string;
  body?: string;
  reply_count?: number;
  reason: string;
}

export default function CommunityFlow({ items }: { items: FlowItem[] }) {
  const [filter, setFilter] = useState<string | null>(null);
  const cats = [
    { slug: null, label: "🌐 Tümü" },
    { slug: "feedback", label: "💬 Geri Bildirim" },
    { slug: "question_help", label: "❓ Soru Yardımı" },
    { slug: "code_help", label: "🐛 Kod Yardımı" },
    { slug: "share", label: "🚀 Yazılım Paylaşımı" },
  ];
  const filtered = filter ? items.filter((i) => i.category === filter) : items;

  if (items.length === 0) {
    return (
      <div className="bg-gradient-to-br from-rose-500/15 via-amber-500/10 to-emerald-500/10 border-2 border-white/10 rounded-2xl p-12 text-center">
        <div className="text-5xl mb-3">💬</div>
        <h3 className="text-xl font-bold text-white mb-2">Henüz paylaşım yok</h3>
        <p className="text-white/60 text-sm mb-4">İlk paylaşımı sen yap — topluluk seni bekliyor!</p>
        <Link
          href="/dashboard/forms"
          className="inline-block px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm rounded-lg transition-colors shadow-lg shadow-amber-500/20"
        >
          + Yeni Paylaşım
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {cats.map((c) => (
          <button
            key={c.slug || "all"}
            onClick={() => setFilter(c.slug)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
              filter === c.slug
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item) => (
          <CommunityCard key={item.id} item={item} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-white/40 text-sm py-8">Bu kategoride paylaşım yok.</div>
      )}
    </div>
  );
}

function CommunityCard({ item }: { item: FlowItem }) {
  const catColors: Record<string, { border: string; icon: string; badge: string }> = {
    feedback: { border: "border-amber-500/30 hover:border-amber-500/60", icon: "💬", badge: "bg-amber-500/20 text-amber-200" },
    question_help: { border: "border-indigo-500/30 hover:border-indigo-500/60", icon: "❓", badge: "bg-indigo-500/20 text-indigo-200" },
    code_help: { border: "border-rose-500/30 hover:border-rose-500/60", icon: "🐛", badge: "bg-rose-500/20 text-rose-200" },
    share: { border: "border-emerald-500/30 hover:border-emerald-500/60", icon: "🚀", badge: "bg-emerald-500/20 text-emerald-200" },
  };
  const c = catColors[item.category ?? ""] || catColors.feedback;

  return (
    <Link
      href={`/dashboard/forms/${item.id}`}
      className={`block bg-white/[0.04] border-2 ${c.border} rounded-xl p-4 hover:bg-white/[0.08] transition-all`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${c.badge}`}>
          {c.icon} {item.category}
        </span>
        {item.reply_count ? (
          <span className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-bold shadow-lg shadow-rose-500/30">
            💬 {item.reply_count}
          </span>
        ) : null}
      </div>
      <h3 className="font-bold text-white mb-1 line-clamp-1">{item.title}</h3>
      <p className="text-xs text-white/50 line-clamp-2">{item.body}</p>
      <div className="text-[10px] text-white/30 mt-2 font-medium">{item.reason}</div>
    </Link>
  );
}