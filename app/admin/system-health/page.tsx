// app/admin/system-health/page.tsx
// System Health widget — backend, Supabase, Railway, Vercel build durumu.
//
// MİMARİ:
// - Server component: build bilgisi, environment
// - Client component: canlı health check
// - Kontrol: backend /health, supabase, son deploy, son commit

import { Activity, Server, Database, Cloud, GitBranch } from "lucide-react";
import SystemHealthChecks from "./SystemHealthChecks";

export const dynamic = "force-dynamic";

export default function SystemHealthPage() {
  // Server-side build info
  const buildId = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local";
  const buildTime = new Date().toISOString();

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-emerald-300 text-xs font-mono uppercase tracking-widest mb-2">
          <Activity className="w-4 h-4" />
          System Health
        </div>
        <h1 className="text-2xl font-bold mb-2">Sistem Sağlık Durumu</h1>
        <p className="text-white/60 text-sm">
          Backend, veritabanı, Vercel build, canlı endpoint kontrolleri.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-900/50 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
            <GitBranch className="w-3.5 h-3.5" />
            BUILD
          </div>
          <div className="text-sm font-mono font-bold text-white">{buildId}</div>
        </div>
        <div className="bg-slate-900/50 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
            <Cloud className="w-3.5 h-3.5" />
            VERCEL
          </div>
          <div className="text-sm font-bold text-emerald-300">CANLI</div>
        </div>
        <div className="bg-slate-900/50 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
            <Server className="w-3.5 h-3.5" />
            BACKEND
          </div>
          <div className="text-sm font-bold text-white" id="sys-backend">—</div>
        </div>
        <div className="bg-slate-900/50 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
            <Database className="w-3.5 h-3.5" />
            SUPABASE
          </div>
          <div className="text-sm font-bold text-white" id="sys-supabase">—</div>
        </div>
      </div>

      <SystemHealthChecks />

      <div className="mt-6 text-[10px] text-white/30 font-mono">
        Build: {buildId} @ {buildTime}
      </div>
    </div>
  );
}
