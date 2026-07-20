// components/dashboard/StatsOverview.tsx
// Kullanıcı istatistikleri — dashboard'u zenginleştiren görsel kartlar.

import { Trophy, Target, Clock, Award, CheckCircle2, XCircle, Zap, Flame } from "lucide-react";

export interface UserStats {
  id: string;
  username: string;
  email?: string;
  is_verified?: boolean;
  points?: number;
  total_attempts?: number;
  success_count?: number;
  fail_count?: number;
  success_rate?: number;
  solution_average_time?: number;
  solution_average_time_ms?: number;
  created_at?: string;
}

type Accent = "amber" | "emerald" | "indigo" | "rose" | "sky" | "violet";

const ACCENT: Record<Accent, { border: string; bg: string; text: string; iconBg: string }> = {
  amber: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    iconBg: "bg-amber-500/20 text-amber-300",
  },
  emerald: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-300",
    iconBg: "bg-emerald-500/20 text-emerald-300",
  },
  indigo: {
    border: "border-indigo-500/30",
    bg: "bg-indigo-500/10",
    text: "text-indigo-300",
    iconBg: "bg-indigo-500/20 text-indigo-300",
  },
  rose: {
    border: "border-rose-500/30",
    bg: "bg-rose-500/10",
    text: "text-rose-300",
    iconBg: "bg-rose-500/20 text-rose-300",
  },
  sky: {
    border: "border-sky-500/30",
    bg: "bg-sky-500/10",
    text: "text-sky-300",
    iconBg: "bg-sky-500/20 text-sky-300",
  },
  violet: {
    border: "border-violet-500/30",
    bg: "bg-violet-500/10",
    text: "text-violet-300",
    iconBg: "bg-violet-500/20 text-violet-300",
  },
};

function formatDuration(totalSeconds?: number): string {
  if (!totalSeconds || totalSeconds <= 0) return "—";
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  if (m > 0) return `${m}dk ${s.toString().padStart(2, "0")}sn`;
  return `${s}sn`;
}

function getRank(points = 0): { name: string; color: Accent; nextThreshold?: number } {
  if (points >= 15000) return { name: "Efsane", color: "violet" };
  if (points >= 7000) return { name: "Usta", color: "indigo", nextThreshold: 15000 };
  if (points >= 2500) return { name: "Kalfa", color: "sky", nextThreshold: 7000 };
  if (points >= 500) return { name: "Çırak", color: "emerald", nextThreshold: 2500 };
  return { name: "Başlangıç", color: "amber", nextThreshold: 500 };
}

function StatCard({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: React.ElementType;
  value: React.ReactNode;
  label: string;
  accent: Accent;
}) {
  const theme = ACCENT[accent];
  return (
    <div className={`rounded-2xl border ${theme.border} ${theme.bg} p-4 flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme.iconBg}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className={`text-xs font-medium ${theme.text}`}>{label}</div>
      </div>
    </div>
  );
}

export default function StatsOverview({
  user,
  performance,
}: {
  user: UserStats;
  performance?: { total_usage_seconds?: number; streak_count?: number };
}) {
  const points = user.points || 0;
  const total = user.total_attempts || 0;
  const success = user.success_count || 0;
  const fail = user.fail_count ?? Math.max(0, total - success);
  const usageSeconds = performance?.total_usage_seconds || 0;
  const streak = performance?.streak_count || 0;
  const rank = getRank(points);

  return (
    <div className="space-y-4">
      {/* Rank banner */}
      <div className={`rounded-2xl border ${ACCENT[rank.color].border} bg-gradient-to-r ${ACCENT[rank.color].bg} to-transparent p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${ACCENT[rank.color].iconBg}`}>
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-white/60">Mevcut Seviye</div>
            <div className={`text-xl font-bold ${ACCENT[rank.color].text}`}>{rank.name}</div>
          </div>
        </div>
        {rank.nextThreshold ? (
          <div className="text-right">
            <div className="text-xs text-white/50">Sonraki seviye için</div>
            <div className="text-sm font-semibold text-white">{rank.nextThreshold - points} puan daha</div>
          </div>
        ) : (
          <div className="text-right">
            <div className="text-xs text-white/50">Maksimum seviye</div>
            <div className="text-sm font-semibold text-white">Tebrikler!</div>
          </div>
        )}
      </div>

      {/* Main stat grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Zap} value={points.toLocaleString("tr-TR")} label="Toplam Puan" accent="amber" />
        <StatCard icon={Target} value={total.toLocaleString("tr-TR")} label="Toplam Deneme" accent="indigo" />
        <StatCard icon={CheckCircle2} value={success.toLocaleString("tr-TR")} label="Başarılı" accent="emerald" />
        <StatCard icon={XCircle} value={fail.toLocaleString("tr-TR")} label="Başarısız" accent="rose" />
      </div>

      {/* Secondary row: total usage time + streak */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StatCard icon={Clock} value={formatDuration(usageSeconds)} label="Toplam Kullanım Süresi" accent="sky" />
        <StatCard icon={Flame} value={streak > 0 ? `${streak} gün` : "—"} label="Günlük Streak" accent="emerald" />
      </div>

      {/* Mini progress hint */}
      {rank.nextThreshold && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-white/60">{rank.name} → {getRank(rank.nextThreshold).name}</span>
            <span className="text-white/40">{points} / {rank.nextThreshold} puan</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full ${ACCENT[rank.color].bg.replace("/10", "")}`}
              style={{ width: `${Math.min(100, (points / rank.nextThreshold) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
