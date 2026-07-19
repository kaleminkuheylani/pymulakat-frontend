"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { getAchievements } from "@/lib/api/achievementsAPI";
import type { ApiAchievement, ApiAchievementResponse } from "@/lib/api/types";
import {
  Trophy,
  Star,
  Code,
  BookOpen,
  BarChart,
  Clock,
  Repeat,
  Flame,
  Award,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";

const groupTitles: Record<string, string> = {
  first: "İlk Adımlar",
  volume: "Hacim",
  language: "Dil",
  category: "Kategori Ustaları",
  level: "Seviye Ustaları",
  collection: "Koleksiyon",
  time: "Zaman & Alışkanlık",
  resilience: "Dayanıklılık",
};

const groupIcons: Record<string, typeof Trophy> = {
  first: Star,
  volume: Trophy,
  language: Code,
  category: BookOpen,
  level: BarChart,
  collection: Award,
  time: Clock,
  resilience: Flame,
};

export default function AchievementsPage() {
  const { user } = useUser();
  const [data, setData] = useState<ApiAchievementResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getAchievements()
      .then(setData)
      .catch((e) => setError(e.message || "Başarılar yüklenemedi"))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <p className="text-white/60">Giriş yapmanız gerekiyor.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center gap-3">
        <AlertCircle className="w-8 h-8 text-rose-400" />
        <p className="text-white/70">{error || "Veri yok"}</p>
      </main>
    );
  }

  const groupEntries = Object.entries(data.groups).sort(([a], [b]) => {
    const order = ["first", "volume", "language", "category", "level", "collection", "time", "resilience"];
    return order.indexOf(a) - order.indexOf(b);
  });

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-amber-300 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">Başarılar</h1>
            <p className="text-white/50 text-sm">Her çözüm seni bir sonrakine yaklaştırır.</p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            <div>
              <div className="text-2xl font-bold">{data.achievement_points.toLocaleString("tr-TR")}</div>
              <div className="text-xs text-white/50">Toplam Puan</div>
            </div>
          </div>
        </div>

        <div className="text-sm text-white/60">
          Açılan: <span className="text-amber-400 font-semibold">{data.unlocked_count}</span> / {data.total}
        </div>

        <div className="space-y-8">
          {groupEntries.map(([group, items]) => (
            <section key={group}>
              <div className="flex items-center gap-2 mb-3">
                {(() => {
                  const Icon = groupIcons[group] || Award;
                  return <Icon className="w-5 h-5 text-amber-400" />;
                })()}
                <h2 className="text-lg font-semibold">{groupTitles[group] || group}</h2>
                <span className="text-xs text-white/40 ml-auto">
                  {items.filter((i) => i.unlocked).length} / {items.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((item) => (
                  <AchievementCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

function AchievementCard({ item }: { item: ApiAchievement }) {
  const unlocked = item.unlocked;
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border p-4 transition-all duration-700
        ${
          unlocked
            ? "bg-white/[0.04] border-amber-500/30 opacity-100 scale-100"
            : "bg-white/[0.02] border-white/10 opacity-40 grayscale blur-[1px]"
        }
      `}
    >
      {unlocked && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-amber-500/5 to-transparent" />
      )}
      <div className="relative flex items-start gap-3">
        <div
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
            ${unlocked ? "bg-amber-500/20 text-amber-300" : "bg-white/5 text-white/40"}
          `}
        >
          <Award className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold truncate ${unlocked ? "text-white" : "text-white/60"}`}>
            {item.title}
          </h3>
          <p className="text-xs text-white/50 mt-1 leading-relaxed">{item.description}</p>
          <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-white/70">
            {unlocked ? "+" : ""}
            {item.points} puan
          </div>
        </div>
      </div>
    </div>
  );
}
