// app/dashboard/page.tsx
// Kişisel dashboard — SADECE auth'lu kullanıcı kendi verisini görür.
// Bölümler: Trend, Skill Graph, En Sık Hatalar, Son Attemptler.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface SkillTree {
  id: string;
  name: string;
  topics: Array<{
    id: string;
    name: string;
    subskills: Array<{ id: string; name: string }>;
  }>;
}

interface SkillProgress {
  topic: string;
  attempted: number;
  solved: number;
  errors: number;
}

interface CategoryStat {
  category: string;
  label: string;
  count: number;
  pct: number;
}

interface RecentAttempt {
  id: string;
  question_id: number;
  question_title: string;
  category: string;
  category_label: string;
  success: boolean;
  passed: number;
  total: number;
  created_at: string;
}

interface ClusterInfo {
  size: number;
  from: string;
  to: string;
  categories: string[];
}

interface DashboardData {
  user: {
    id: string;
    username: string;
    total_solved: number;
    total_attempted: number;
    streak_days: number;
  };
  skill_tree: SkillTree[];
  retention_days: number;
  category_breakdown: CategoryStat[];
  top_errors: any[];
  skill_progress: Record<string, SkillProgress>;
  nearby_clusters: ClusterInfo[];
  trend: {
    today: { attempts: number; errors: number };
    yesterday: { attempts: number; errors: number };
    this_week: { attempts: number; errors: number };
  };
  recent: RecentAttempt[];
  lint: { ok: boolean; orphan_topics_count: number; message: string };
}

const COLORS = {
  bg: "#050816",
  text: "text-white",
  textMuted: "text-white/50",
  textSubtle: "text-white/30",
  border: "border-white/10",
  borderHover: "hover:border-white/20",
  amber: "text-amber-400",
  indigo: "text-indigo-400",
  emerald: "text-emerald-400",
  red: "text-red-400",
  orange: "text-orange-400",
};

function relativeTime(iso: string): string {
  try {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const m = Math.floor(diffMs / 60000);
    const h = Math.floor(diffMs / 3600000);
    const d = Math.floor(diffMs / 86400000);
    if (m < 1) return "az önce";
    if (m < 60) return `${m}dk önce`;
    if (h < 24) return `${h}sa önce`;
    if (d < 7) return `${d}g önce`;
    return date.toLocaleDateString("tr-TR");
  } catch {
    return iso;
  }
}

function CategoryBadge({ category }: { category: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    syntax: { color: "text-red-300", bg: "bg-red-500/15" },
    indentation: { color: "text-red-300", bg: "bg-red-500/15" },
    name_error: { color: "text-amber-300", bg: "bg-amber-500/15" },
    type_error: { color: "text-amber-300", bg: "bg-amber-500/15" },
    logic: { color: "text-indigo-300", bg: "bg-indigo-500/15" },
    off_by_one: { color: "text-pink-300", bg: "bg-pink-500/15" },
    infinite_loop: { color: "text-pink-300", bg: "bg-pink-500/15" },
    missing_return: { color: "text-amber-300", bg: "bg-amber-500/15" },
    empty_code: { color: "text-white/60", bg: "bg-white/10" },
  };
  const c = map[category] || { color: "text-white/60", bg: "bg-white/10" };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider ${c.bg} ${c.color}`}>
      {category.replace(/_/g, " ")}
    </span>
  );
}

function SkillNode({ topic, name, subskills, progress }: {
  topic: string;
  name: string;
  subskills: Array<{ id: string; name: string }>;
  progress?: SkillProgress;
}) {
  const isMastered = progress && progress.attempted >= 3 && progress.errors === 0;
  const isInProgress = progress && progress.attempted > 0;
  const isErrorHeavy = progress && progress.errors >= 3;
  const state = isMastered ? "mastered" : isErrorHeavy ? "errors" : isInProgress ? "in_progress" : "not_started";

  const stateStyle = {
    mastered: { border: "border-emerald-500/40", bg: "bg-emerald-500/[0.04]", badge: "✓ Öğrenildi", badgeColor: "text-emerald-400" },
    in_progress: { border: "border-indigo-500/40", bg: "bg-indigo-500/[0.04]", badge: "◐ Devam Ediyor", badgeColor: "text-indigo-400" },
    errors: { border: "border-amber-500/40", bg: "bg-amber-500/[0.04]", badge: "⚠ Tekrar Gerekli", badgeColor: "text-amber-400" },
    not_started: { border: "border-white/10", bg: "bg-white/[0.02]", badge: "— Başlanmadı", badgeColor: "text-white/30" },
  }[state];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-3 rounded-xl border ${stateStyle.border} ${stateStyle.bg} transition-colors cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-2">
        <code className="text-[10px] font-mono text-white/40 truncate">{topic}</code>
        <span className={`text-[9px] font-semibold uppercase tracking-wider ${stateStyle.badgeColor}`}>
          {stateStyle.badge}
        </span>
      </div>
      <div className="text-xs font-semibold text-white mb-1.5 capitalize">{name.replace(/_/g, " ")}</div>
      <div className="flex flex-wrap gap-1">
        {subskills.slice(0, 4).map((s) => (
          <span key={s.id} className="text-[9px] text-white/30 px-1.5 py-0.5 rounded bg-white/5">
            {s.name.replace(/_/g, " ")}
          </span>
        ))}
        {subskills.length > 4 && (
          <span className="text-[9px] text-white/20 px-1 py-0.5">+{subskills.length - 4}</span>
        )}
      </div>
      {progress && (
        <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-white/40">
          <span>{progress.attempted} deneme</span>
          <span className={progress.solved > 0 ? "text-emerald-300" : "text-white/30"}>
            {progress.solved} başarılı
          </span>
          {progress.errors > 0 && (
            <span className="text-amber-300">{progress.errors} hata</span>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const tokenRaw = localStorage.getItem("sb-pymulakat-auth-token");
      const token = tokenRaw?.match(/"access_token":"([^"]+)"/)?.[1];
      if (!token) {
        window.location.href = "/login?returnUrl=/dashboard";
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/dashboard/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          window.location.href = "/login?returnUrl=/dashboard";
          return;
        }
        if (!res.ok) throw new Error("dashboard failed");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
        setError("Dashboard yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white/40 text-sm">
        Dashboard yükleniyor…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-amber-400 text-2xl mb-2">⚠</div>
          <p className="text-white/70 mb-4">{error || "Veri bulunamadı"}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  const topErrors = data.category_breakdown.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Link href="/profile" className="text-white/40 hover:text-white text-xs mb-2 inline-block">
              ← Profil
            </Link>
            <h1 className="text-3xl font-bold mb-1">
              Hoş geldin, <span className="text-amber-400">{data.user.username}</span>
            </h1>
            <p className="text-white/50 text-sm">
              Son {data.retention_days} gündeki tüm aktiviten — sadece senin görebildiğin kişisel panel.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/interviews"
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors"
            >
              Soru Çöz →
            </Link>
            <Link
              href="/coach"
              className="px-4 py-2 rounded-lg border border-white/15 hover:border-white/30 text-white text-sm transition-colors"
            >
              📬 Mail Koç
            </Link>
          </div>
        </div>

        {/* Top stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
        >
          <div className="p-5 rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Toplam Çözülen</div>
            <div className="text-3xl font-bold text-amber-400">{data.user.total_solved}</div>
          </div>
          <div className="p-5 rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Toplam Deneme</div>
            <div className="text-3xl font-bold text-indigo-400">{data.user.total_attempted}</div>
          </div>
          <div className="p-5 rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Streak</div>
            <div className="text-3xl font-bold text-orange-400">
              {data.user.streak_days > 0 ? `🔥 ${data.user.streak_days}` : "—"}
            </div>
          </div>
          <div className="p-5 rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Bu Hafta Hata</div>
            <div className="text-3xl font-bold text-red-400">{data.trend.this_week.errors}</div>
          </div>
        </motion.div>

        {/* Trend cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {[
            { label: "Bugün", ...data.trend.today, accent: "text-emerald-400" },
            { label: "Dün", ...data.trend.yesterday, accent: "text-white/70" },
            { label: "Bu Hafta", ...data.trend.this_week, accent: "text-indigo-400" },
          ].map((t) => (
            <div key={t.label} className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="text-[10px] uppercase tracking-wider text-white/40 mb-2">{t.label}</div>
              <div className="flex items-end justify-between gap-2">
                <div>
                  <div className={`text-2xl font-bold ${t.accent}`}>{t.attempts}</div>
                  <div className="text-[10px] text-white/40 mt-0.5">deneme</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-red-300/80">{t.errors}</div>
                  <div className="text-[10px] text-white/40">hata</div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT — Skill Graph */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">🎯 Yetenek Yolculuğu</h2>
              <span className="text-xs text-white/40">
                {Object.keys(data.skill_progress).length}/{data.skill_tree.reduce((acc, c) => acc + c.topics.length, 0)} topic'te deneyim var
              </span>
            </div>

            <div className="space-y-4">
              {data.skill_tree.map((cat) => (
                <div key={cat.id} className="p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white capitalize">{cat.id.replace(/-/g, " ")}</h3>
                    <span className="text-[10px] text-white/30">{cat.topics.length} topic</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {cat.topics.map((t) => (
                      <SkillNode
                        key={t.id}
                        topic={t.id}
                        name={t.name}
                        subskills={t.subskills}
                        progress={data.skill_progress[t.id]}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Top errors + recent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-6"
          >
            {/* Top Errors */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">🔥 En Sık Hatalar</h2>
                <span className="text-xs text-white/40">son {data.retention_days}g</span>
              </div>

              {topErrors.length === 0 ? (
                <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-center">
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="text-white/50 text-sm">Hata kaydı yok. Harika gidiyorsun!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {topErrors.map((err) => (
                    <div
                      key={err.category}
                      className="p-3 rounded-xl border border-white/10 bg-white/[0.02]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-semibold text-white">{err.label}</div>
                        <CategoryBadge category={err.category} />
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-red-400"
                          style={{ width: `${err.pct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1.5 text-[10px] text-white/40">
                        <span>{err.count} kez</span>
                        <span>{err.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ±5dk correlation clusters */}
            {data.nearby_clusters.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">⚡ Yakın Hata Kümeleri</h2>
                  <span className="text-xs text-white/40">±5dk</span>
                </div>
                <div className="space-y-2">
                  {data.nearby_clusters.map((cluster, i) => (
                    <div key={i} className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.04]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-semibold text-amber-200">
                          {cluster.size} hata birlikte
                        </span>
                        <span className="text-[10px] text-white/40">
                          {relativeTime(cluster.from)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {cluster.categories.map((c) => (
                          <CategoryBadge key={c} category={c} />
                        ))}
                      </div>
                      <div className="text-[10px] text-white/30 mt-1.5">
                        {new Date(cluster.from).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })} – {new Date(cluster.to).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent attempts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">🕒 Son Denemeler</h2>
              </div>
              {data.recent.length === 0 ? (
                <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-center">
                  <p className="text-white/50 text-sm">Henüz deneme yok</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {data.recent.map((a) => (
                    <Link
                      key={a.id}
                      href={`/interviews/${a.question_id || ""}`}
                      className="block p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="text-xs font-semibold text-white truncate">
                          {a.question_title || `Soru #${a.question_id}`}
                        </div>
                        <div className="text-[10px] text-white/40 whitespace-nowrap">
                          {relativeTime(a.created_at)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <CategoryBadge category={a.category} />
                        <div className="text-[10px] text-white/50">
                          {a.success ? (
                            <span className="text-emerald-300">✓ {a.passed}/{a.total}</span>
                          ) : (
                            <span className="text-red-300">{a.passed}/{a.total}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Lint durumu (sade bilgi, kullanıcıyı sıkmaz) */}
            {data.lint.orphan_topics_count > 0 && (
              <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="text-[10px] text-white/30 italic">
                  ⓘ {data.lint.message}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <div className="mt-10 text-center text-[10px] text-white/20">
          Bu sayfa sadece senin verini gösterir. Hiçbir başka kullanıcı erişemez. Veriler 7 gün sonra otomatik temizlenir.
        </div>
      </div>
    </div>
  );
}