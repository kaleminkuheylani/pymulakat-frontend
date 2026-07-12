"use client";

// app/admin/user-audit/UserAuditStats.tsx
// Client component — kullanıcı istatistiklerini periyodik olarak çeker.
//
// NOT: /api/v2/admin/users-stats endpoint'i backend'de olmayabilir.
// Bu durumda graceful fallback: "Endpoint henüz hazır değil" mesajı.

import { useEffect, useState } from "react";
import { RefreshCw, AlertCircle, Clock } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface UserStats {
  total_users: number;
  active_7d: number;
  total_attempts: number;
  success_rate: number;
}

const REFRESH_INTERVAL = 60_000; // 60s

export default function UserAuditStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<UserStats>("/api/v2/admin/users-stats", {
        next: { revalidate: 0 },
      });
      setStats(data);
      setLastUpdate(Date.now());
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Bilinmeyen hata";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Banner counters
  useEffect(() => {
    if (stats) {
      const set = (id: string, val: string) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };
      set("user-total", String(stats.total_users));
      set("user-active", String(stats.active_7d));
      set("user-attempts", String(stats.total_attempts));
      set("user-success", `%${Math.round(stats.success_rate)}`);
    }
  }, [stats]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/50">
          {lastUpdate && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Son güncelleme: {new Date(lastUpdate).toLocaleTimeString("tr-TR")}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Yenile
        </button>
      </div>

      {error && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-amber-300 mb-1">
              Endpoint henüz hazır değil
            </div>
            <div className="text-xs text-white/60">
              Backend <code className="bg-black/30 px-1 rounded">/api/v2/admin/users-stats</code>{" "}
              endpoint'i implement edilmeli. Şimdilik sadece banner sayaçları güncellenmedi.
            </div>
            <div className="text-[10px] text-white/40 mt-1">Hata: {error}</div>
          </div>
        </div>
      )}

      {stats && (
        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-3">Detaylı Metrikler</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <div className="text-white/50 text-xs">Toplam Kullanıcı</div>
              <div className="text-lg font-bold text-white">{stats.total_users}</div>
            </div>
            <div>
              <div className="text-white/50 text-xs">7 Gün Aktif</div>
              <div className="text-lg font-bold text-emerald-300">{stats.active_7d}</div>
            </div>
            <div>
              <div className="text-white/50 text-xs">Toplam Attempt</div>
              <div className="text-lg font-bold text-amber-300">{stats.total_attempts}</div>
            </div>
            <div>
              <div className="text-white/50 text-xs">Başarı Oranı</div>
              <div className="text-lg font-bold text-cyan-300">%{Math.round(stats.success_rate)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
