// app/admin/user-audit/page.tsx
// User Audit widget — kullanıcı aktivitesi, kayıt/giriş, attempt, leaderboard.
//
// MİMARİ:
// - Server component: Supabase service_role ile kullanıcı istatistikleri
// - Client component: periyodik yenileme (60s)
// - KVKK: sadece aggregate metrikler (toplam sayı, başarı oranı)
//   Bireysel kullanıcı listesi YOK
//
// NOT: Supabase service_role server-side'da çalışır; bu widget'ın server
// component'i /api/v2/admin/users-stats endpoint'ini çağırır (güvenli).
// Backend'de ilgili endpoint henüz yoksa graceful fallback gösterir.

import { Users, TrendingUp, Trophy, Activity } from "lucide-react";
import UserAuditStats from "./UserAuditStats";

export const dynamic = "force-dynamic";

export default function UserAuditPage() {
  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-indigo-300 text-xs font-mono uppercase tracking-widest mb-2">
          <Users className="w-4 h-4" />
          User Audit
        </div>
        <h1 className="text-2xl font-bold mb-2">Kullanıcı Aktivitesi</h1>
        <p className="text-white/60 text-sm">
          Toplam kayıt, aktif kullanıcı, attempt istatistikleri, leaderboard.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-900/50 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 text-indigo-300 text-xs mb-1">
            <Users className="w-3.5 h-3.5" />
            TOPLAM
          </div>
          <div className="text-2xl font-bold text-white" id="user-total">—</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-emerald-300 text-xs mb-1">
            <Activity className="w-3.5 h-3.5" />
            AKTİF
          </div>
          <div className="text-2xl font-bold text-emerald-300" id="user-active">—</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-amber-300 text-xs mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            ATTEMPT
          </div>
          <div className="text-2xl font-bold text-amber-300" id="user-attempts">—</div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-cyan-300 text-xs mb-1">
            <Trophy className="w-3.5 h-3.5" />
            BAŞARI
          </div>
          <div className="text-2xl font-bold text-cyan-300" id="user-success">—%</div>
        </div>
      </div>

      <UserAuditStats />
    </div>
  );
}
