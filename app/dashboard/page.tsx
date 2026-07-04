// app/dashboard/page.tsx
// Dashboard ana sayfa — direkt 2-tab'li akış (kişiselleştirilmiş + topluluk).
// 4 bölüm, her biri max 5 item, canlı tutarlı renkler.

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useUser } from "../../hooks/useUser";
import OnboardingGate from "../../components/OnboardingGate";

// 📌 Lazy load — initial bundle'dan cikar (mobil performans)
const PersonalFlow = dynamic(() => import("../../components/dashboard/PersonalFlow"), {
  loading: () => <div className="flex items-center justify-center py-12"><div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" /></div>,
  ssr: false,
});
const CommunityFlow = dynamic(() => import("../../components/dashboard/CommunityFlow"), {
  loading: () => <div className="flex items-center justify-center py-12"><div className="w-6 h-6 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" /></div>,
  ssr: false,
});

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
    next_level: FlowItem[];
    recommended?: FlowItem[];
  };
  context: {
    is_authenticated: boolean;
    solved_categories: string[];
    top_categories?: string[];
    weak_categories?: string[];
    success_rate: number;
    target_level: string;
    current_level?: string;
    total_attempts?: number;
    total_items?: number;
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
    sections: { personal, recent, popular, next_level: recommended },
    context: {
      is_authenticated: isAuthed,
      solved_categories: [],
      top_categories: [],
      success_rate: 0,
      current_level: "beginner",
      target_level: "beginner",
      total_attempts: 0,
      total_items: personal.length + recent.length + popular.length + recommended.length,
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
  // Mounted guard: async fetch'lerde unmount sonrası setState engeli
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

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
      if (!mountedRef.current) return;
      if (res.ok) {
        const data = await res.json();
        if (!mountedRef.current) return;
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
              <MiniStat icon="🎯" value={`%${Math.round(user.success_rate || 0)}`} label="Oran" color="indigo" />
              <MiniStat icon="⭐" value={user.points || 0} label="Puan" color="rose" />
            </div>
          </div>

          {/* 2 TAB */}
          <div className="flex gap-1 border-b border-white/10">
            <TabButton active={tab === "personal"} onClick={() => setTab("personal")} label="✨ Sana Özel" count={flow ? ((flow.sections.personal?.length || 0) + (flow.sections.recent?.length || 0) + (flow.sections.popular?.length || 0) + (flow.sections.next_level?.length || flow.sections.recommended?.length || 0)) : 0} />
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
type Accent = "indigo" | "amber" | "rose" | "emerald";

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
