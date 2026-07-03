// app/dashboard/flow/page.tsx
// Kişiselleştirilmiş akış + topluluk (2 tab)
// 4 bölüm, her biri max 5 item, canlı renkler, attempts bazlı yenileme.

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useUser } from "../../../hooks/useUser";

type Tab = "personal" | "community";

interface FlowItem {
  type: string;
  id: number;
  title: string;
  category?: string;
  level?: string;
  slug?: string;
  body?: string;
  tags?: string[];
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

const API = () => process.env.NEXT_PUBLIC_API_URL || "";

export default function FlowPage() {
  const { user } = useUser();
  const [tab, setTab] = useState<Tab>("personal");
  const [flow, setFlow] = useState<FlowResponse | null>(null);
  const [community, setCommunity] = useState<FlowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchFlow = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    try {
      const res = await fetch(`${API()}/api/v2/recommendations/flow`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setFlow(data);
        setLastUpdated(new Date());
      }
    } catch {}
    if (showSpinner) setRefreshing(false);
  }, []);

  const fetchCommunity = useCallback(async () => {
    try {
      const res = await fetch(`${API()}/api/v2/recommendations/community?limit=15`);
      if (res.ok) {
        const data = await res.json();
        setCommunity(data.data || []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchFlow(false), fetchCommunity()]).finally(() => setLoading(false));
  }, [fetchFlow, fetchCommunity]);

  // Event-based refresh: attempt gönderildiğinde veya form paylaşıldığında
  useEffect(() => {
    const handler = () => {
      fetchFlow(true);
    };
    window.addEventListener("pm:attempt-submitted", handler);
    window.addEventListener("pm:form-created", handler);
    return () => {
      window.removeEventListener("pm:attempt-submitted", handler);
      window.removeEventListener("pm:form-created", handler);
    };
  }, [fetchFlow]);

  // Otomatik yenileme (sayfa açıkken her 60 saniye)
  useEffect(() => {
    const interval = setInterval(() => fetchFlow(true), 60000);
    return () => clearInterval(interval);
  }, [fetchFlow]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            {tab === "personal" ? "🌊 Senin Akışın" : "💬 Topluluk"}
          </h1>
          <p className="text-white/60 text-sm">
            {tab === "personal" ? (
              flow?.context.is_authenticated ? (
                <>
                  Seviyene ve ilgine göre kişiselleştirilmiş{" "}
                  {flow.context.target_level !== "beginner" && (
                    <span className="text-emerald-400 font-medium">
                      · bir üst seviye: {flow.context.target_level}
                    </span>
                  )}
                </>
              ) : (
                "Genel öneriler — giriş yaparak kişiselleştir"
              )
            ) : (
              "Soru sor, kod paylaş, geri bildirim ver"
            )}
          </p>
          {lastUpdated && (
            <p className="text-xs text-white/30 mt-1">
              Son güncelleme: {lastUpdated.toLocaleTimeString("tr-TR")}
            </p>
          )}
        </div>
        {tab === "personal" && (
          <button
            onClick={() => fetchFlow(true)}
            disabled={refreshing}
            className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            {refreshing ? "⏳ Yenileniyor..." : "🔄 Yenile"}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-1">
        <TabButton active={tab === "personal"} onClick={() => setTab("personal")} icon="🌊" label="Kişiselleştirilmiş" />
        <TabButton active={tab === "community"} onClick={() => setTab("community")} icon="💬" label="Topluluk" />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : tab === "personal" ? (
        <PersonalFlow flow={flow} />
      ) : (
        <CommunityFlow items={community} />
      )}
    </div>
  );
}

// ─── Tab Button ──────────────────────────────────
function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
        active ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon} {label}
    </button>
  );
}

// ─── Personal Flow (4 sections) ─────────────────
function PersonalFlow({ flow }: { flow: FlowResponse | null }) {
  if (!flow) return <EmptyState text="Akış yüklenemedi." />;

  const { sections, context } = flow;

  return (
    <div className="space-y-6">
      {/* 1) Öneriler — indigo */}
      <Section
        title="✨ Sana Özel Öneriler"
        subtitle={
          context.is_authenticated
            ? `${context.top_categories[0] || "python-basics"} kategorisinde başarılısın`
            : "Genel öneriler"
        }
        accent="indigo"
        emptyText="Henüz öneri yok. Birkaç soru çözdükten sonra kişiselleştirilmiş öneriler görünür."
      >
        {sections.personal.map((item, i) => (
          <FlowRow key={`p-${item.id}`} item={item} rank={i + 1} accent="indigo" />
        ))}
      </Section>

      {/* 2) Son Eklenenler — amber */}
      <Section
        title="🆕 Son Eklenenler"
        subtitle="Platforma yeni eklenen içerikler"
        accent="amber"
        emptyText="Yeni içerik yok."
      >
        {sections.recent.map((item, i) => (
          <FlowRow key={`r-${item.id}`} item={item} rank={i + 1} accent="amber" />
        ))}
      </Section>

      {/* 3) En Çok Gösterilenler — rose */}
      <Section
        title="🔥 En Çok Gösterilenler"
        subtitle="Topluluğun en çok etkileşim aldığı içerikler"
        accent="rose"
        emptyText="Henüz popüler içerik yok."
      >
        {sections.popular.map((item, i) => (
          <FlowRow key={`po-${item.id}`} item={item} rank={i + 1} accent="rose" />
        ))}
      </Section>

      {/* 4) Tavsiye Edilenler — emerald (altta) */}
      <Section
        title="🚀 Tavsiye — Sıradaki Seviye"
        subtitle={
          context.target_level
            ? `Bir üst seviye: ${context.target_level}`
            : "Başarı oranına göre sıradaki adım"
        }
        accent="emerald"
        emptyText="Şu an için ek tavsiye yok."
      >
        {sections.recommended.map((item, i) => (
          <FlowRow key={`rec-${item.id}`} item={item} rank={i + 1} accent="emerald" />
        ))}
      </Section>
    </div>
  );
}

// ─── Section Wrapper ──────────────────────────────
type Accent = "indigo" | "amber" | "rose" | "emerald";
const ACCENT_STYLES: Record<Accent, { bg: string; text: string; border: string; pill: string; icon: string }> = {
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-300", border: "border-indigo-500/30", pill: "bg-indigo-500/20 text-indigo-200", icon: "✨" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-300", border: "border-amber-500/30", pill: "bg-amber-500/20 text-amber-200", icon: "🆕" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-300", border: "border-rose-500/30", pill: "bg-rose-500/20 text-rose-200", icon: "🔥" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-300", border: "border-emerald-500/30", pill: "bg-emerald-500/20 text-emerald-200", icon: "🚀" },
};

function Section({
  title,
  subtitle,
  accent,
  emptyText,
  children,
}: {
  title: string;
  subtitle?: string;
  accent: Accent;
  emptyText: string;
  children: React.ReactNode;
}) {
  const a = ACCENT_STYLES[accent];
  return (
    <section className={`rounded-2xl border ${a.border} ${a.bg} p-4 md:p-5`}>
      <div className="mb-4">
        <h2 className={`text-lg font-bold ${a.text}`}>{title}</h2>
        {subtitle && <p className="text-xs text-white/50 mt-0.5">{subtitle}</p>}
      </div>
      <div className="space-y-2">{children || <EmptyState text={emptyText} />}</div>
    </section>
  );
}

// ─── Flow Row ────────────────────────────────────
function FlowRow({ item, rank, accent }: { item: FlowItem; rank: number; accent: Accent }) {
  let href = "";
  if (item.type === "question" && item.slug) href = `/interviews/${item.category}/${item.slug}`;
  else if (item.type === "tutorial" && item.slug) href = `/guides/${item.slug}`;

  const a = ACCENT_STYLES[accent];

  return (
    <Link
      href={href || "#"}
      className="flex items-center gap-3 md:gap-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl p-3 transition-all group"
    >
      <div className={`w-8 h-8 rounded-lg ${a.pill} flex items-center justify-center font-bold text-sm shrink-0`}>
        {rank.toString().padStart(2, "0")}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wide font-semibold ${a.pill}`}>
            📝 Soru
          </span>
          {item.category && <span className="text-[10px] text-white/40">{item.category}</span>}
          {item.level && (
            <span className="text-[10px] text-white/40 uppercase">
              {item.level}
            </span>
          )}
        </div>
        <div className="font-medium text-white truncate text-sm md:text-base">{item.title}</div>
        <div className={`text-xs mt-0.5 ${a.text}`}>{item.reason}</div>
      </div>

      <div className="text-white/30 group-hover:text-white/60 transition-colors shrink-0">→</div>
    </Link>
  );
}

// ─── Community Flow ───────────────────────────────
function CommunityFlow({ items }: { items: FlowItem[] }) {
  const [filter, setFilter] = useState<string | null>(null);
  const cats = [
    { slug: null, label: "🌐 Tümü", color: "white" },
    { slug: "feedback", label: "💬 Geri Bildirim", color: "amber" },
    { slug: "question_help", label: "❓ Soru Yardımı", color: "indigo" },
    { slug: "code_help", label: "🐛 Kod Yardımı", color: "rose" },
    { slug: "share", label: "🚀 Yazılım Paylaşımı", color: "emerald" },
  ];
  const filtered = filter ? items.filter((i) => i.category === filter) : items;

  if (items.length === 0) {
    return (
      <div className="bg-gradient-to-br from-rose-500/10 to-amber-500/10 border border-white/10 rounded-2xl p-12 text-center">
        <div className="text-5xl mb-3">💬</div>
        <h3 className="text-xl font-bold text-white mb-2">Henüz paylaşım yok</h3>
        <p className="text-white/60 text-sm mb-4">İlk paylaşımı sen yap — topluluk seni bekliyor!</p>
        <Link
          href="/dashboard/forms"
          className="inline-block px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-lg transition-colors"
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
              filter === c.slug ? "bg-white/15 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
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
  const catColors: Record<string, string> = {
    feedback: "border-amber-500/30 hover:border-amber-500/60",
    question_help: "border-indigo-500/30 hover:border-indigo-500/60",
    code_help: "border-rose-500/30 hover:border-rose-500/60",
    share: "border-emerald-500/30 hover:border-emerald-500/60",
  };
  const catIcons: Record<string, string> = {
    feedback: "💬",
    question_help: "❓",
    code_help: "🐛",
    share: "🚀",
  };

  return (
    <Link
      href={`/dashboard/forms/${item.id}`}
      className={`block bg-white/[0.03] border-2 ${catColors[item.category ?? ""] || "border-white/10"} rounded-xl p-4 hover:bg-white/[0.06] transition-all`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/50">{catIcons[item.category ?? ""]} {item.category}</span>
        {item.reply_count ? (
          <span className="text-xs px-2 py-0.5 bg-rose-500/20 text-rose-200 rounded-full font-semibold">
            💬 {item.reply_count}
          </span>
        ) : null}
      </div>
      <h3 className="font-semibold text-white mb-1 line-clamp-1">{item.title}</h3>
      <p className="text-xs text-white/50 line-clamp-2">{item.body}</p>
      <div className="text-[10px] text-white/30 mt-2">{item.reason}</div>
    </Link>
  );
}

// ─── Empty State ──────────────────────────────────
function EmptyState({ text }: { text: string }) {
  return <div className="text-center text-white/40 text-sm py-4">{text}</div>;
}