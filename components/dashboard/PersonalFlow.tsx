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
    next_level: FlowItem[];
    // Geriye uyumlu eski alan
    recommended?: FlowItem[];
  };
  context: {
    is_authenticated: boolean;
    // Yeni motor: çözülmüş soruların kategorileri
    solved_categories: string[];
    // Eski motor ile geriye uyum
    top_categories?: string[];
    weak_categories?: string[];
    success_rate: number;
    target_level: string;
    current_level?: string;
    total_attempts?: number;
    total_items?: number;
  };
}

type Accent = "indigo" | "amber" | "rose" | "emerald";
const ACCENT_STYLES: Record<Accent, { gradient: string; border: string; bg: string; text: string; pill: string; ring: string }> = {
  indigo: { gradient: "from-indigo-500/20 via-indigo-500/10 to-transparent", border: "border-indigo-500/30", bg: "bg-gradient-to-br", text: "text-indigo-300", pill: "bg-indigo-500 text-white", ring: "ring-indigo-500/30" },
  amber: { gradient: "from-amber-500/20 via-amber-500/10 to-transparent", border: "border-amber-500/30", bg: "bg-gradient-to-br", text: "text-amber-300", pill: "bg-amber-500 text-slate-950", ring: "ring-amber-500/30" },
  rose: { gradient: "from-rose-500/20 via-rose-500/10 to-transparent", border: "border-rose-500/30", bg: "bg-gradient-to-br", text: "text-rose-300", pill: "bg-rose-500 text-white", ring: "ring-rose-500/30" },
  emerald: { gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent", border: "border-emerald-500/30", bg: "bg-gradient-to-br", text: "text-emerald-300", pill: "bg-emerald-500 text-white", ring: "ring-emerald-500/30" },
};

export default function PersonalFlow({ flow, error }: { flow: FlowResponse | null; error?: string | null }) {
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
  // Tolerans: eski/yeni backend response şekillerini destekle
  const personalItems = sections.personal || [];
  const recentItems = sections.recent || [];
  const popularItems = sections.popular || [];
  const nextLevelItems = sections.next_level || sections.recommended || [];

  return (
    <div className="space-y-4">
      <FlowSection
        title="✨ Senin İçin Seçtiklerimiz"
        subtitle={context.is_authenticated ? `${context.solved_categories?.[0] || context.top_categories?.[0] || "python-basics"} kategorisinde başarılısın · daha fazlası için` : "Genel öneriler — giriş yaparak kişiselleştir"}
        accent="indigo" icon="✨"
        emptyText="Henüz öneri yok. Birkaç soru çözdükten sonra kişiselleştirilmiş öneriler görünür."
        items={personalItems}
      />
      <FlowSection
        title="🆕 Yeni Eklenenler"
        subtitle="Platforma yeni eklenen içerikler"
        accent="amber" icon="🆕"
        emptyText="Yeni içerik yok."
        items={recentItems}
      />
      <FlowSection
        title="🔥 En Çok Çözülenler"
        subtitle="Topluluğun en çok çözdüğü sorular"
        accent="rose" icon="🔥"
        emptyText="Henüz popüler içerik yok."
        items={popularItems}
      />
      <FlowSection
        title="🚀 Bir Sonraki Seviye"
        subtitle={context.target_level && context.current_level
          ? `Mevcut: ${context.current_level} · Hedef: ${context.target_level}`
          : context.target_level
            ? `Hedef seviye: ${context.target_level}`
            : "Başarı oranına göre sıradaki adım"}
        accent="emerald" icon="🚀"
        emptyText="Şu an için ek tavsiye yok."
        items={nextLevelItems}
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

// ── URL builder: hangi type hangi route'a gider ──
function buildHref(item: FlowItem): { href: string; ok: boolean } {
  // Question: slug varsa slug, yoksa ID (interview sayfası ikisini de kabul ediyor)
  if (item.type === "question") {
    if (item.slug) return { href: `/interviews/${item.category}/${item.slug}`, ok: true };
    if (item.id) return { href: `/interviews/${item.category || "python-basics"}/${item.id}`, ok: true };
    return { href: "", ok: false };
  }
  // Tutorial: slug primary, ID yok
  if (item.type === "tutorial") {
    if (item.slug) return { href: `/guides/${item.slug}`, ok: true };
    return { href: "", ok: false };
  }
  // Form
  if (item.type === "form") {
    if (item.id) return { href: `/dashboard/forms?form_id=${item.id}`, ok: true };
    return { href: "", ok: false };
  }
  return { href: "", ok: false };
}

// ── Type → renk/emojı etiketi ──
const TYPE_BADGE: Record<string, { label: string; emoji: string; pill: string }> = {
  question: { label: "Soru", emoji: "💻", pill: "bg-indigo-500/15 border border-indigo-500/30 text-indigo-300" },
  tutorial: { label: "Rehber", emoji: "📘", pill: "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300" },
  form: { label: "Topluluk", emoji: "💬", pill: "bg-amber-500/15 border border-amber-500/30 text-amber-300" },
};

function FlowRow({ item, rank, accent }: { item: FlowItem; rank: number; accent: Accent }) {
  const { href, ok } = buildHref(item);
  const a = ACCENT_STYLES[accent];
  const badge = TYPE_BADGE[item.type] ?? { label: item.type, emoji: "•", pill: "bg-white/10 border border-white/20 text-white/70" };

  // ── Reason backend'den zaten spesifik geliyor (soru ID, kategori, sayılar) ──
  // Frontend ekstra bir şey eklemiyor; sadece gösterir.
  const reasonDetail = item.reason || "Önerildi";

  const inner = (
    <>
      <div className={`w-9 h-9 rounded-lg ${a.pill} flex items-center justify-center font-bold text-sm shrink-0 shadow-lg`}>
        {rank.toString().padStart(2, "0")}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wide font-bold ${badge.pill}`}>
            {badge.emoji} {badge.label}
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
        <div className={`text-[11px] mt-0.5 ${a.text} font-medium flex items-center gap-1`}>
          <span aria-hidden>💡</span>
          <span className="truncate">{reasonDetail}</span>
        </div>
      </div>
      <div className="text-white/30 group-hover:text-white/70 transition-colors shrink-0 text-lg">→</div>
    </>
  );

  // ── Fallback: link bozuksa disabled kart göster, neden önerildiğini açıkla ──
  if (!ok) {
    return (
      <div
        title="Bu öğenin bağlantısı şu anda kullanılamıyor"
        className="flex items-center gap-3 bg-white/[0.02] border border-dashed border-white/15 rounded-xl p-3 opacity-60 cursor-not-allowed"
      >
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={href}
      prefetch={false}
      title={`Neden önerildi: ${reasonDetail}`}
      className={`flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl p-3 transition-all group hover:${a.ring}`}
    >
      {inner}
    </Link>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="text-center text-white/40 text-sm py-6 bg-white/[0.02] border rounded-xl">{text}</div>;
}