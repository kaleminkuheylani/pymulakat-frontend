// components/dashboard/StatsOverview.tsx
// Kullanıcı istatistikleri — dashboard'u zenginleştiren görsel kartlar.

import { Trophy, Target, Clock, TrendingUp, Award, CheckCircle2, XCircle, Zap } from "lucide-react";

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
  if (points >= 5000) return { name: "Efsane", color: "violet" };
  if (points >= 2000) return { name: "Usta", color: "indigo", nextThreshold: 5000 };
  if (points >= 1000) return { name: "Kalfa", color: "sky", nextThreshold: 2000 };
  if (points >= 300) return { name: "Çırak", color: "emerald", nextThreshold: 1000 };
  return { name: "Başlangıç", color: "amber", nextThreshold: 300 };
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

function SuccessRateRing({ rate = 0 }: { rate?: number }) {
  const safeRate = Math.max(0, Math.min(100, Math.round(rate || 0)));
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeRate / 100) * circumference;

  return (
    <div className="flex items-center gap-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
      <div className="relative w-24 h-24 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-emerald-400 transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">%{safeRate}</span>
        </div>
      </div>
      <div>
        <div className="text-sm font-semibold text-emerald-300">Başarı Oranı</div>
        <p className="text-xs text-white/50 mt-1">
          {safeRate >= 80 ? "Harika!" : safeRate >= 50 ? "İyi gidiyorsun." : "Pratik yapmaya devam et."}
        </p>
      </div>
    </div>
  );
}

export default function StatsOverview({ user }: { user: UserStats }) {
  const points = user.points || 0;
  const total = user.total_attempts || 0;
  const success = user.success_count || 0;
  const fail = user.fail_count ?? Math.max(0, total - success);
  const rate = user.success_rate ?? (total > 0 ? Math.round((success / total) * 100) : 0);
  const avgSeconds = user.solution_average_time || 0;
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

      {/* Secondary row: success rate + avg time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SuccessRateRing rate={rate} />
        <StatCard icon={Clock} value={formatDuration(avgSeconds)} label="Ortalama Çözüm Süresi" accent="sky" />
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
