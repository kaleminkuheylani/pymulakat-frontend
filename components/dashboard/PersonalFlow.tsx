// components/dashboard/PersonalFlow.tsx
// Lazy-loaded: dashboard page initial bundle'dan bu cikar.

import Link from "next/link";

interface FlowItem {
  type: string;
  id: number;
  title: string;
  category?: string;
  level?: string;
  slug?: string;
  body?: string;
  reply_count?: number;
  score?: number;
  reason: string;
  created_at?: string;
  view_count?: number;
  attempt_count?: number;
}

interface FlowResponse {
  sections: {
    personal: FlowItem[];
    recent: FlowItem[];
    popular: FlowItem[];
    recommended: FlowItem[];
  };
  context: {
    is_authenticated: boolean;
    top_categories: string[];
    success_rate: number;
    target_level: string;
  };
}

type Accent = "indigo" | "amber" | "rose" | "emerald";
const ACCENT_STYLES: Record<Accent, { gradient: string; border: string; bg: string; text: string; pill: string; ring: string }> = {
  indigo: { gradient: "from-indigo-500/20 via-indigo-500/10 to-transparent", border: "border-indigo-500/30", bg: "bg-gradient-to-br", text: "text-indigo-300", pill: "bg-indigo-500 text-white", ring: "ring-indigo-500/30" },
  amber: { gradient: "from-amber-500/20 via-amber-500/10 to-transparent", border: "border-amber-500/30", bg: "bg-gradient-to-br", text: "text-amber-300", pill: "bg-amber-500 text-slate-950", ring: "ring-amber-500/30" },
  rose: { gradient: "from-rose-500/20 via-rose-500/10 to-transparent", border: "border-rose-500/30", bg: "bg-gradient-to-br", text: "text-rose-300", pill: "bg-rose-500 text-white", ring: "ring-rose-500/30" },
  emerald: { gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent", border: "border-emerald-500/30", bg: "bg-gradient-to-br", text: "text-emerald-300", pill: "bg-emerald-500 text-white", ring: "ring-emerald-500/30" },
};

export default function PersonalFlow({ flow }: { flow: FlowResponse | null }) {
  if (!flow) return <EmptyState text="Akış yüklenemedi." />;
  const { sections, context } = flow;

  return (
    <div className="space-y-4">
      <FlowSection
        title="✨ Sana Özel Öneriler"
        subtitle={context.is_authenticated ? `${context.top_categories[0] || "python-basics"} kategorisinde başarılısın · mevcut seviye` : "Genel öneriler"}
        accent="indigo" icon="✨"
        emptyText="Henüz öneri yok. Birkaç soru çözdükten sonra kişiselleştirilmiş öneriler görünür."
        items={sections.personal}
      />
      <FlowSection
        title="🆕 Son Eklenenler"
        subtitle="Platforma yeni eklenen içerikler"
        accent="amber" icon="🆕"
        emptyText="Yeni içerik yok."
        items={sections.recent}
      />
      <FlowSection
        title="🔥 En Çok Gösterilenler"
        subtitle="Topluluğun en çok etkileşim aldığı içerikler"
        accent="rose" icon="🔥"
        emptyText="Henüz popüler içerik yok."
        items={sections.popular}
      />
      <FlowSection
        title="🚀 Sıradaki Seviye"
        subtitle={context.target_level ? `Bir üst seviye: ${context.target_level}` : "Başarı oranına göre sıradaki adım"}
        accent="emerald" icon="🚀"
        emptyText="Şu an için ek tavsiye yok."
        items={sections.recommended}
      />
    </div>
  );
}

function FlowSection({ title, subtitle, accent, icon, emptyText, items }: {
  title: string;
  subtitle?: string;
  accent: Accent;
  icon: string;
  emptyText: string;
  items: FlowItem[];
}) {
  const a = ACCENT_STYLES[accent];
  return (
    <section className={`rounded-2xl border-2 ${a.border} ${a.bg} ${a.gradient} p-4 md:p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className={`text-base md:text-lg font-bold ${a.text}`}>{title}</h2>
          {subtitle && <p className="text-[11px] text-white/50 mt-0.5">{subtitle}</p>}
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${a.pill}`}>
          {items.length}
        </span>
      </div>
      <div className="space-y-2">
        {items.length > 0 ? items.map((item, i) => (
          <FlowRow key={`${accent}-${item.id}`} item={item} rank={i + 1} accent={accent} />
        )) : (
          <div className="text-center text-white/40 text-xs py-3">{emptyText}</div>
        )}
      </div>
    </section>
  );
}

function FlowRow({ item, rank, accent }: { item: FlowItem; rank: number; accent: Accent }) {
  let href = "";
  if (item.type === "question" && item.slug) href = `/interviews/${item.category}/${item.slug}`;
  else if (item.type === "tutorial" && item.slug) href = `/guides/${item.slug}`;
  else if (item.type === "form") href = `/dashboard/forms/${item.id}`;

  const a = ACCENT_STYLES[accent];
  return (
    <Link
      href={href || "#"}
      className={`flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl p-3 transition-all group hover:${a.ring}`}
    >
      <div className={`w-9 h-9 rounded-lg ${a.pill} flex items-center justify-center font-bold text-sm shrink-0 shadow-lg`}>
        {rank.toString().padStart(2, "0")}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wide font-bold ${a.pill}`}>
            📝
          </span>
          {item.category && (
            <span className="text-[10px] text-white/50 font-medium">{item.category}</span>
          )}
          {item.level && (
            <span className="text-[10px] text-white/40 uppercase">
              {item.level}
            </span>
          )}
        </div>
        <div className="font-semibold text-white truncate text-sm">{item.title}</div>
        <div className={`text-[11px] mt-0.5 ${a.text} font-medium`}>{item.reason}</div>
      </div>
      <div className="text-white/30 group-hover:text-white/70 transition-colors shrink-0 text-lg">→</div>
    </Link>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="text-center text-white/40 text-sm py-6 bg-white/[0.02] border border-white/5 rounded-xl">{text}</div>;
}