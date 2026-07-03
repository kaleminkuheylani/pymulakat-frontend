// app/dashboard/page.tsx
// Dashboard ana sayfa — direkt 2-tab'li akış (kişiselleştirilmiş + topluluk).
// 4 bölüm, her biri max 5 item, canlı tutarlı renkler.

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useUser } from "../../hooks/useUser";
import OnboardingGate from "../../components/OnboardingGate";

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

// 📌 Local fallback: backend /flow endpoint'i yoksa veya timeout olursa
// QUESTION_META + lib'ten client-side akis uretir. ML yok, sadece siralama.
import { QUESTION_META, getQuestionMeta } from "../../lib/questionMeta";

function buildLocalFallback(isAuthed: boolean = false): FlowResponse {
  // Tum sorulari QUESTION_META'dan al, siraya gore
  const allIds = Object.keys(QUESTION_META)
    .map(Number)
    .filter((id) => !isNaN(id) && QUESTION_META[id]?.slug)
    .sort((a, b) => a - b);

  const now = Date.now();
  const maxId = Math.max(...allIds, 88);

  // ID-bazli tarih (DB created_at'e guvenmiyoruz)
  // maxId = bugun, dusuk id = eski (gun sayisi = maxId - id)
  const items: FlowItem[] = allIds.map((id) => {
    const q = QUESTION_META[id];
    const daysAgo = maxId - id;
    return {
      type: "question" as const,
      id: q.id,
      title: q.title,
      category: q.topic,
      level: q.difficulty_note?.includes("intermediate") ? "intermediate" : "beginner",
      slug: q.slug,
      score: 100 - id,
      reason: "📌 Öneri",
      created_at: new Date(now - daysAgo * 86400000).toISOString(),
      view_count: 0,
      attempt_count: 0,
    };
  });

  // 📌 Backend ile ayni mantik (id-bazli tarih fallback)
  // recent: maxId'ye en yakin = en yeni (id buyuk = yeni)
  const recent = items
    .slice()
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);
  // personal: ilk 5 ID sirasi (temel sorular)
  const personal = items.slice(0, 5);
  // popular: ID 1-15 klasikler (gercek DB view yoksa fallback)
  const popular = items.filter((i) => i.id >= 1 && i.id <= 15).slice(0, 5);
  // recommended: ID 6-25 (baslangic-oncesi tavsiye)
  const recommended = items.filter((i) => i.id >= 6 && i.id <= 25).slice(0, 5);

  for (const p of popular) p.reason = "🔥 Klasik — mülakatlarda sıkça çıkıyor";
  for (const r of recent) r.reason = `🆕 #${r.id} — yakın zamanda eklendi`;

  return {
    sections: { personal, recent, popular, recommended },
    context: {
      is_authenticated: isAuthed,
      top_categories: [],
      success_rate: 0,
      target_level: "beginner",
    },
  };
}

export default function DashboardHome() {
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
      } else {
        // 404 veya 500 → local fallback (kullanici login mi?)
        setFlow(buildLocalFallback(!!user));
        setLastUpdated(new Date());
      }
    } catch {
      setFlow(buildLocalFallback(!!user));
      setLastUpdated(new Date());
    }
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

  // Event-based refresh
  useEffect(() => {
    const handler = () => {
      fetchFlow(true);
      fetchCommunity();
    };
    window.addEventListener("pm:attempt-submitted", handler);
    window.addEventListener("pm:form-created", handler);
    return () => {
      window.removeEventListener("pm:attempt-submitted", handler);
      window.removeEventListener("pm:form-created", handler);
    };
  }, [fetchFlow, fetchCommunity]);

  // Auto-refresh 60s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchFlow(true);
      fetchCommunity();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchFlow, fetchCommunity]);

  if (!user) return null;

  return (
    <>
      <OnboardingGate userId={user.id}>
        <div className="space-y-5">
          {/* Üst Bar — kullanıcı + stats + tablar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  Merhaba, {user.username} <span className="text-amber-400">👋</span>
                </h1>
                <p className="text-white/50 text-xs">
                  {lastUpdated ? `Son güncelleme: ${lastUpdated.toLocaleTimeString("tr-TR")}` : "Yükleniyor..."}
                </p>
              </div>
              <button
                onClick={() => {
                  fetchFlow(true);
                  fetchCommunity();
                }}
                disabled={refreshing}
                className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors disabled:opacity-50"
              >
                {refreshing ? "⏳" : "🔄"} Yenile
              </button>
            </div>

            {/* 📌 Quick stats — dashboard'a girer girmez görsün */}
            <div className="grid grid-cols-4 gap-2">
              <MiniStat icon="📊" value={user.total_attempts || 0} label="Deneme" color="amber" />
              <MiniStat icon="✅" value={user.success_count || 0} label="Başarılı" color="emerald" />
              <MiniStat icon="🎯" value={`%${Math.round((user.success_rate || 0) * 100)}`} label="Oran" color="indigo" />
              <MiniStat icon="⭐" value={user.points || 0} label="Puan" color="rose" />
            </div>
          </div>

          {/* 2 TAB */}
          <div className="flex gap-1 border-b border-white/10">
            <TabButton active={tab === "personal"} onClick={() => setTab("personal")} label="✨ Sana Özel" count={flow ? flow.sections.personal.length + flow.sections.recent.length + flow.sections.popular.length + flow.sections.recommended.length : 0} />
            <TabButton active={tab === "community"} onClick={() => setTab("community")} label="💬 Topluluk" count={community.length} />
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
      </OnboardingGate>
    </>
  );
}

// ─── Tab Button ──────────────────────────────────
function TabButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative ${
        active ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
      }`}
    >
      {label}
      {count > 0 && (
        <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
          active ? "bg-indigo-500 text-white" : "bg-white/10 text-white/60"
        }`}>
          {count}
        </span>
      )}
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-amber-500 to-emerald-500" />}
    </button>
  );
}

// ─── Mini Stat (ana sayfa üst barı) ─────────────
function MiniStat({ icon, value, label, color }: { icon: string; value: any; label: string; color: Accent }) {
  const colors: Record<Accent, string> = {
    indigo: "border-indigo-500/30 bg-indigo-500/5",
    amber: "border-amber-500/30 bg-amber-500/5",
    rose: "border-rose-500/30 bg-rose-500/5",
    emerald: "border-emerald-500/30 bg-emerald-500/5",
  };
  return (
    <div className={`border ${colors[color]} rounded-xl p-2 text-center`}>
      <div className="text-base mb-0.5">{icon}</div>
      <div className="text-sm font-bold text-white">{value}</div>
      <div className="text-[10px] text-white/40">{label}</div>
    </div>
  );
}

// ─── Personal Flow (4 sections) ─────────────────
function PersonalFlow({ flow }: { flow: FlowResponse | null }) {
  if (!flow) return <EmptyState text="Akış yüklenemedi." />;

  const { sections, context } = flow;

  return (
    <div className="space-y-4">
      <FlowSection
        title="✨ Sana Özel Öneriler"
        subtitle={
          context.is_authenticated
            ? `${context.top_categories[0] || "python-basics"} kategorisinde başarılısın · mevcut seviye`
            : "Genel öneriler"
        }
        accent="indigo"
        icon="✨"
        emptyText="Henüz öneri yok. Birkaç soru çözdükten sonra kişiselleştirilmiş öneriler görünür."
        items={sections.personal}
      />

      <FlowSection
        title="🆕 Son Eklenenler"
        subtitle="Platforma yeni eklenen içerikler"
        accent="amber"
        icon="🆕"
        emptyText="Yeni içerik yok."
        items={sections.recent}
      />

      <FlowSection
        title="🔥 En Çok Gösterilenler"
        subtitle="Topluluğun en çok etkileşim aldığı içerikler"
        accent="rose"
        icon="🔥"
        emptyText="Henüz popüler içerik yok."
        items={sections.popular}
      />

      <FlowSection
        title="🚀 Sıradaki Seviye"
        subtitle={
          context.target_level
            ? `Bir üst seviye: ${context.target_level}`
            : "Başarı oranına göre sıradaki adım"
        }
        accent="emerald"
        icon="🚀"
        emptyText="Şu an için ek tavsiye yok."
        items={sections.recommended}
      />
    </div>
  );
}

// ─── Section ─────────────────────────────────────
type Accent = "indigo" | "amber" | "rose" | "emerald";
const ACCENT_STYLES: Record<Accent, { gradient: string; border: string; bg: string; text: string; pill: string; ring: string }> = {
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
};

function FlowSection({
  title,
  subtitle,
  accent,
  icon,
  emptyText,
  items,
}: {
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

// ─── Flow Row ────────────────────────────────────
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

// ─── Community Flow ───────────────────────────────
function CommunityFlow({ items }: { items: FlowItem[] }) {
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

// ─── Empty State ──────────────────────────────────
function EmptyState({ text }: { text: string }) {
  return <div className="text-center text-white/40 text-sm py-6 bg-white/[0.02] border border-white/5 rounded-xl">{text}</div>;
}