// components/dashboard/PersonalFlow.tsx
// Lazy-loaded: dashboard page initial bundle'dan bu cikar.
// Sections: personal | recent | popular | recent_attempts
// "Öneriler / next_level" KALDIRILDI.

import Link from "next/link";
import { CheckCircle2, XCircle, Clock3 } from "lucide-react";

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
  success?: boolean;
  passed_tests?: number;
  total_tests?: number;
}

interface FlowResponse {
  sections: {
    personal: FlowItem[];
    recent: FlowItem[];
    popular: FlowItem[];
    recent_attempts?: FlowItem[];
    next_level?: FlowItem[];
    recommended?: FlowItem[];
  };
  context: {
    is_authenticated: boolean;
    solved_categories: string[];
    solved_ids?: number[];
    top_categories?: string[];
    weak_categories?: string[];
    success_rate: number;
    target_level: string;
    current_level?: string;
    total_attempts?: number;
    total_items?: number;
  };
}

type Accent = "indigo" | "amber" | "rose" | "emerald" | "cyan";
const ACCENT_STYLES: Record<
  Accent,
  { gradient: string; border: string; bg: string; text: string; pill: string; ring: string }
> = {
  indigo: {
    gradient: "from-indigo-500/20 via-indigo-500/10 to-transparent",
    border: "border-indigo-500/30",
    bg: "bg-gradient-to-br",
    text: "text-indigo-300",
    pill: "bg-indigo-500 text-white",
    ring: "ring-indigo-500/30",
  },
  amber: {
    gradient: "from-amber-500/20 via-amber-500/10 to-transparent",
    border: "border-amber-500/30",
    bg: "bg-gradient-to-br",
    text: "text-amber-300",
    pill: "bg-amber-500 text-slate-950",
    ring: "ring-amber-500/30",
  },
  rose: {
    gradient: "from-rose-500/20 via-rose-500/10 to-transparent",
    border: "border-rose-500/30",
    bg: "bg-gradient-to-br",
    text: "text-rose-300",
    pill: "bg-rose-500 text-white",
    ring: "ring-rose-500/30",
  },
  emerald: {
    gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent",
    border: "border-emerald-500/30",
    bg: "bg-gradient-to-br",
    text: "text-emerald-300",
    pill: "bg-emerald-500 text-white",
    ring: "ring-emerald-500/30",
  },
  cyan: {
    gradient: "from-cyan-500/20 via-cyan-500/10 to-transparent",
    border: "border-cyan-500/30",
    bg: "bg-gradient-to-br",
    text: "text-cyan-300",
    pill: "bg-cyan-500 text-slate-950",
    ring: "ring-cyan-500/30",
  },
};

export default function PersonalFlow({
  flow,
  error,
}: {
  flow: FlowResponse | null;
  error?: string | null;
}) {
  if (error) {
    return (
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 text-rose-300 text-sm">
        <div className="font-semibold mb-1">Akış yüklenemedi</div>
        <pre className="text-xs font-mono whitespace-pre-wrap break-all opacity-80">{error}</pre>
      </div>
    );
  }
  if (!flow) return <EmptyState text="Akış yüklenemedi." />;
  const { sections, context } = flow;
  const personalItems = sections.personal || [];
  const recentItems = sections.recent || [];
  const popularItems = sections.popular || [];
  const attemptItems = sections.recent_attempts || [];

  const topCat =
    context.solved_categories?.[0] || context.top_categories?.[0] || null;

  return (
    <div className="space-y-4">
      <FlowSection
        title="Senin İçin Seçtiklerimiz"
        subtitle={
          context.is_authenticated
            ? topCat
              ? `${topCat} ve çözdüğün sorulara yakın konular`
              : "Birkaç soru çöz — yakın konulu öneriler burada dolacak"
            : "Giriş yaparak kişiselleştir"
        }
        accent="indigo"
        emptyText="Henüz öneri yok. Birkaç soru çözdükten sonra yakın konulu sorular görünür."
        items={personalItems}
      />
      <FlowSection
        title="Yeni Eklenenler"
        subtitle="Sisteme yeni eklenen sorular"
        accent="amber"
        emptyText="Yeni içerik yok."
        items={recentItems}
      />
      <FlowSection
        title="En Çok Çözülenler"
        subtitle="Topluluğun en çok denediği sorular"
        accent="rose"
        emptyText="Henüz popüler içerik yok."
        items={popularItems}
      />
      <FlowSection
        title="Son Denemeler"
        subtitle={
          context.total_attempts
            ? `${context.total_attempts} deneme kaydın var`
            : "Son çalıştığın sorular"
        }
        accent="cyan"
        emptyText="Henüz deneme yok. Bir soru çözünce burada görünür."
        items={attemptItems}
        showAttemptStatus
      />
    </div>
  );
}

function FlowSection({
  title,
  subtitle,
  accent,
  emptyText,
  items,
  showAttemptStatus = false,
}: {
  title: string;
  subtitle?: string;
  accent: Accent;
  emptyText: string;
  items: FlowItem[];
  showAttemptStatus?: boolean;
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
        {items.length > 0 ? (
          items.map((item, i) => (
            <FlowRow
              key={`${accent}-${item.id}-${item.created_at || i}`}
              item={item}
              rank={i + 1}
              accent={accent}
              showAttemptStatus={showAttemptStatus}
            />
          ))
        ) : (
          <div className="text-center text-white/40 text-xs py-3">{emptyText}</div>
        )}
      </div>
    </section>
  );
}

function buildHref(item: FlowItem): { href: string; ok: boolean } {
  if (item.type === "question" || !item.type) {
    if (item.slug) return { href: `/interviews/${item.category}/${item.slug}`, ok: true };
    if (item.id)
      return {
        href: `/interviews/${item.category || "programlama-temelleri"}/${item.id}`,
        ok: true,
      };
    return { href: "", ok: false };
  }
  if (item.type === "tutorial") {
    if (item.slug) return { href: `/guides/${item.slug}`, ok: true };
    return { href: "", ok: false };
  }
  if (item.type === "form") {
    if (item.id) return { href: `/dashboard/forms?form_id=${item.id}`, ok: true };
    return { href: "", ok: false };
  }
  return { href: "", ok: false };
}

const TYPE_BADGE: Record<string, { label: string; pill: string }> = {
  question: {
    label: "Soru",
    pill: "bg-indigo-500/15 border border-indigo-500/30 text-indigo-300",
  },
  tutorial: {
    label: "Rehber",
    pill: "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300",
  },
  form: {
    label: "Topluluk",
    pill: "bg-amber-500/15 border border-amber-500/30 text-amber-300",
  },
};

function FlowRow({
  item,
  rank,
  accent,
  showAttemptStatus,
}: {
  item: FlowItem;
  rank: number;
  accent: Accent;
  showAttemptStatus?: boolean;
}) {
  const { href, ok } = buildHref(item);
  const a = ACCENT_STYLES[accent];
  const badge =
    TYPE_BADGE[item.type] ?? {
      label: item.type || "Soru",
      pill: "bg-white/10 border border-white/20 text-white/70",
    };
  const reasonDetail = item.reason || "Önerildi";

  const statusIcon =
    showAttemptStatus && item.success === true ? (
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
    ) : showAttemptStatus && item.success === false ? (
      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
    ) : showAttemptStatus ? (
      <Clock3 className="w-4 h-4 text-white/40 shrink-0" />
    ) : null;

  const inner = (
    <>
      <div
        className={`w-9 h-9 rounded-lg ${a.pill} flex items-center justify-center font-bold text-sm shrink-0 shadow-lg`}
      >
        {rank.toString().padStart(2, "0")}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wide font-bold ${badge.pill}`}
          >
            {badge.label}
          </span>
          {showAttemptStatus && item.success === true && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
              Çözüldü
            </span>
          )}
          {showAttemptStatus && item.success === false && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 font-semibold">
              Denendi
            </span>
          )}
          {item.category && (
            <span className="text-[10px] text-white/50 font-medium">{item.category}</span>
          )}
          {item.level && (
            <span className="text-[10px] text-white/40 uppercase">{item.level}</span>
          )}
        </div>
        <div className="font-semibold text-white truncate text-sm flex items-center gap-2">
          {statusIcon}
          <span className="truncate">{item.title}</span>
        </div>
        <div className={`text-[11px] mt-0.5 ${a.text} font-medium truncate`}>
          {reasonDetail}
        </div>
      </div>
      <div className="text-white/30 group-hover:text-white/70 transition-colors shrink-0 text-lg">
        →
      </div>
    </>
  );

  if (!ok) {
    return (
      <div className="flex items-center gap-3 bg-white/[0.02] border border-dashed border-white/15 rounded-xl p-3 opacity-60 cursor-not-allowed">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={href}
      prefetch={false}
      title={reasonDetail}
      className={`flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl p-3 transition-all group hover:${a.ring}`}
    >
      {inner}
    </Link>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center text-white/40 text-sm py-6 bg-white/[0.02] border rounded-xl">
      {text}
    </div>
  );
}
