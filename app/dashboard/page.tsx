"use client";


// app/dashboard/page.tsx
// Dashboard ana sayfa — direkt 2-tab'li akış (kişiselleştirilmiş + topluluk).
// 4 bölüm, her biri max 5 item, canlı tutarlı renkler.
import { Hand } from "lucide-react";


import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useUser } from "../../hooks/useUser";
import OnboardingSurvey from "../../components/OnboardingSurvey";
import { getAllQuestions, getRecommendationFlow, getCommunityRecommendations } from "../../lib/api/questionAPI";

// 📌 Lazy load — initial bundle'dan cikar (mobil performans)
const PersonalFlow = dynamic(() => import("../../components/dashboard/PersonalFlow"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center py-12"><div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" /></div>,
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
  items?: FlowItem[];
  next_cursor?: string | null;
  source?: string;
}

// 📌 Local fallback: backend /flow endpoint'i yoksa veya timeout olursa
// Soru listesini backend'den çeker (DB source of truth).
const EMPTY: FlowResponse = {
  sections: { personal: [], recent: [], popular: [], next_level: [] },
  context: { is_authenticated: false, solved_categories: [], success_rate: 0, target_level: "beginner" },
  items: [],
  next_cursor: null,
  source: "empty",
};

async function buildLocalFallback(isAuthed: boolean = false): Promise<FlowResponse> {
  try {
    const all = await getAllQuestions();

    const now = Date.now();
    const items: FlowItem[] = all
      .filter((q) => q.slug)
      .map((q) => ({
        type: "question" as const,
        id: q.id,
        title: q.title,
        category: q.category,
        level: q.level || "beginner",
        slug: q.slug ?? "",
        score: 100 - q.id,
        reason: "📌 Öneri",
        created_at: new Date(now - q.id * 86400000).toISOString(),
        view_count: 0,
        attempt_count: 0,
      }));

    // recent: en yüksek ID = en yeni eklenen
    const recent = items.slice().sort((a, b) => b.id - a.id).slice(0, 5);
    // personal: ilk 5 ID (temel sorular)
    const personal = items.slice(0, 5);
    // popular: klasik 1-15
    const popular = items.filter((i) => i.id >= 1 && i.id <= 15).slice(0, 5);
    // recommended: 6-25
    const recommended = items.filter((i) => i.id >= 6 && i.id <= 25).slice(0, 5);

    for (const p of popular) p.reason = "🔥 Klasik — mülakatlarda sıkça çıkıyor";
    for (const r of recent) r.reason = `🆕 #${r.id} — yakın zamanda eklendi`;
    return {
      sections: { personal, recent, popular, next_level: recommended, recommended },
      context: {
        is_authenticated: isAuthed,
        solved_categories: [],
        top_categories: [],
        weak_categories: [],
        success_rate: 0,
        target_level: "beginner",
        current_level: "beginner",
        total_attempts: 0,
        total_items: items.length,
      },
      items: [...personal, ...popular, ...recent, ...recommended],
      next_cursor: null,
      source: "local-fallback",
    };
  } catch {
    return { ...EMPTY, context: { ...EMPTY.context, is_authenticated: isAuthed } };
  }
}

export default function DashboardHome() {
  const { user } = useUser();
  const [tab, setTab] = useState<Tab>("personal");
  const [flow, setFlow] = useState<FlowResponse | null>(null);
  const [flowError, setFlowError] = useState<string | null>(null);
  const [community, setCommunity] = useState<FlowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  // Mounted guard (TS strict mode + Vercel SWC uyumluluğu icin explicit type)
  const mountedRef = useRef<boolean>(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Token helper (desktop submitAttempt ile aynı mantık)
  const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("sb-pymulakat-auth-token");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.access_token) return parsed.access_token;
      }
    } catch {
      // ignore
    }
    return localStorage.getItem("token");
  };

  const fetchFlow = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    setFlowError(null);
    try {
      // questionAPI.getRecommendationFlow (lib/api/questionAPI.ts) — typed + auth header otomatik
      const data = await getRecommendationFlow(20);
      if (data) {
        // ApiRecommendationFlow context uyumsuzluğu: FlowResponse.context daha geniş.
        // Cast gerekli (memory kuralı: 'as any' YASAK, ama local typed cast kabul).
        setFlow(data as unknown as Parameters<typeof setFlow>[0]);
        setLastUpdated(new Date());
      } else {
        setFlowError("Öneri akışı alınamadı");
        setFlow(null);
      }
    } catch (e: any) {;
      setFlowError(e?.message || "Bağlantı hatası");
      setFlow(null);
    }
    if (showSpinner) setRefreshing(false);
  }, []);

  const fetchCommunity = useCallback(async () => {
    if (!mountedRef.current) return;
    try {
      // questionAPI.getCommunityRecommendations (lib/api/questionAPI.ts) — typed + auth header otomatik
      const data = await getCommunityRecommendations(15);
      if (!mountedRef.current) return;
      const list = Array.isArray(data?.data) ? data.data : [];
      setCommunity(list as FlowItem[]);
    } catch {
      // silent fail
    }
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

  // 📌 Misafir için: layout.tsx auth guard var. Buraya user gelirse üye demektir.
  // Bu yüzden null yerine bir erken return yok.
  // ÖNEMLİ: dashboard guest'te layout guard'i sayesinde /login'e yönlendirilir,
  // buraya ulaşamaz. Kullanici bu component'e eristikte user kesin vardır.

  if (!user) return null;

  return (
    <>
      <OnboardingSurvey userId={user.id} />
      <div className="space-y-5">
          {/* Üst Bar — kullanıcı + stats + tablar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  Merhaba, {user.username} <span className="text-amber-400"><Hand className="w-3.5 h-3.5 inline" /></span>
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
          <div className="flex gap-1 border-white/10">
            <TabButton active={tab === "personal"} onClick={() => setTab("personal")} label="✨ Sana Özel" count={flow ? ((flow.sections?.personal?.length || 0) + (flow.sections?.recent?.length || 0) + (flow.sections?.popular?.length || 0) + (flow.sections?.next_level?.length || 0)) : 0} />
            <TabButton active={tab === "community"} onClick={() => setTab("community")} label="💬 Topluluk" count={community.length} />
          </div>

          {/* 📌 Quick Access Hub — dashboard merkeziyet burada.
              4 özellik tek bakışta: Sorular (misafir public),
              Online Compiler (misafir public, deneme amaçli),
              Kodlar (üye), Eğitimler (üye). Tek başlangıç noktası. */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white/70 uppercase tracking-wider">
                🚀 Hızlı Erişim
              </h2>
              <span className="text-[10px] text-white/40">
                Tüm özellikler tek merkezden
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <FeatureCard
                href="/interviews"
                icon="💻"
                title="Sorular"
                description="Mülakat sorularını tarayıcıda çöz, otomatik puanlama al."
                color="indigo"
              />
              <FeatureCard
                href="/python-online"
                icon="⚡"
                title="Online Compiler"
                description="Sorudan bağımsız deneme: tarayıcıda Python yaz ve çalıştır."
                color="amber"
                highlight
              />
              <FeatureCard
                href="/python-kodlari"
                icon="📚"
                title="Kodlar"
                description="17 snippet, 6 kategori: algoritma, veri yapısı, dinamik programlama."
                color="purple"
              />
              <FeatureCard
                href="/python-egitimi"
                icon="🎓"
                title="Eğitimler"
                description="6 derslik sıralı yol haritası, çalıştırılabilir örnekler."
                color="emerald"
              />
            </div>
          </section>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : tab === "personal" ? (
            <PersonalFlow flow={flow} error={flowError} />
          ) : (
            <CommunityFlow items={community} />
          )}
        </div>
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

// ─── Feature Card (Quick Access Hub) ──────────────
// Dashboard'ın merkezde olduğunu vurgulayan 4 hızlı erişim kartı.
// Online Compiler HERKESE AÇIK (misafir dahil), diğer 3 üye gerektirir.
interface FeatureCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  color: "indigo" | "amber" | "purple" | "emerald";
  badge?: string;
  highlight?: boolean;
}
function FeatureCard({ href, icon, title, description, color, highlight }: FeatureCardProps) {
  const palette: Record<FeatureCardProps["color"], { border: string; bg: string; icon: string }> = {
    indigo: { border: "border-indigo-500/30", bg: "from-indigo-500/10", icon: "text-indigo-300" },
    amber: { border: "border-amber-500/40", bg: "from-amber-500/15", icon: "text-amber-300" },
    purple: { border: "border-purple-500/30", bg: "from-purple-500/10", icon: "text-purple-300" },
    emerald: { border: "border-emerald-500/30", bg: "from-emerald-500/10", icon: "text-emerald-300" },
  };
  const p = palette[color];
  return (
    <Link
      href={href}
      className={`group relative block p-4 rounded-2xl border ${p.border} bg-gradient-to-br ${p.bg} to-transparent hover:scale-[1.02] hover:border-current transition-all duration-300 ${
        highlight ? "ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10" : ""
      }`}
    >
      <div className={`text-3xl mb-2 ${p.icon}`}>{icon}</div>
      <h3 className="text-base font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
        {title}
      </h3>
      <p className="text-xs text-white/60 leading-relaxed">{description}</p>
      <span className="inline-flex items-center gap-1 text-[11px] mt-2 text-white/40 group-hover:text-amber-300 group-hover:gap-2 transition-all">
        {highlight ? "Hemen Dene" : "Git"} →
      </span>
    </Link>
  );
}
