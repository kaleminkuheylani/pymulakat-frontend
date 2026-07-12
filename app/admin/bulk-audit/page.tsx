// app/admin/bulk-audit/page.tsx
// Bulk Audit — tüm pending soruları sırayla Mavis API ile denetle.
//
// MİMARİ:
// - Server component: stats (pending count, total cost estimate)
// - Client component: bulk çalıştırma + progress + cost tracking
// - Mavis API maliyetli — her 50'de bir onay iste (uyarı)
// - 429 / quota hatası → otomatik retry yok, manuel resume

import { Code2, AlertTriangle, DollarSign } from "lucide-react";
import BulkAuditClient from "./BulkAuditClient";
import { getAuditStats } from "@/lib/api/auditAPI";

export const dynamic = "force-dynamic";

export default async function BulkAuditPage() {
  // Server-side initial stats
  let stats: Awaited<ReturnType<typeof getAuditStats>> | null = null;
  try {
    stats = await getAuditStats();
  } catch {
    // Backend yeni deploy olmamış olabilir
    stats = null;
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-mono uppercase tracking-widest mb-2">
          <Code2 className="w-4 h-4" />
          Bulk Audit
        </div>
        <h1 className="text-2xl font-bold mb-2">Toplu Soru Denetimi</h1>
        <p className="text-white/60 text-sm">
          Tüm pending soruları sırayla Mavis API ile denetle. <strong className="text-rose-300">Maliyetli</strong> —
          her soru için ayrı API call.
        </p>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-200/90 space-y-1">
          <div>
            <strong>Maliyet kontrolü:</strong> Bulk audit öncesi 1-2 örnek soruyu
            <code className="bg-black/30 px-1 rounded mx-1">/admin/audit</code>
            sayfasından tek tek denetleyerek API davranışını doğrula.
          </div>
          <div>
            <strong>Quota:</strong> OpenAI gpt-4o / Gemini Flash kullanılıyor. Rate limit'e
            takılırsa otomatik retry yok — manuel resume gerekir.
          </div>
        </div>
      </div>

      {stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-900/50 border border-white/10 rounded-lg p-4">
            <div className="text-xs text-white/50 mb-1">Toplam</div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
            <div className="text-xs text-emerald-300 mb-1">Passed</div>
            <div className="text-2xl font-bold text-emerald-300">{stats.passed}</div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <div className="text-xs text-amber-300 mb-1">Pending</div>
            <div className="text-2xl font-bold text-amber-300" id="bulk-pending-count">{stats.pending}</div>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4">
            <div className="text-xs text-rose-300 mb-1">Failed</div>
            <div className="text-2xl font-bold text-rose-300">{stats.failed}</div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/30 border border-white/10 rounded-lg p-4 mb-6 text-sm text-white/50">
          Stats endpoint&apos;ine ulaşılamadı. Backend yeni deploy olmamış olabilir.
        </div>
      )}

      <div className="bg-slate-900/50 border border-white/10 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-sm mb-2">
          <DollarSign className="w-4 h-4 text-amber-400" />
          <strong className="text-white">Tahmini Maliyet</strong>
        </div>
        <div className="text-xs text-white/60">
          ~{stats?.pending ?? 0} soru × $0.01/soru = <strong className="text-amber-300">${((stats?.pending ?? 0) * 0.01).toFixed(2)}</strong>{" "}
          (gpt-4o-mini tahmini). Gemini Flash daha ucuz olabilir.
        </div>
      </div>

      <BulkAuditClient initialStats={stats} />
    </div>
  );
}
