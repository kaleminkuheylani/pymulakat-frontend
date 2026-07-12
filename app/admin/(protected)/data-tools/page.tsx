// app/admin/data-tools/page.tsx
// Data Tools — CSV ↔ DB senkron, bulk seed/delete, audit reset.
//
// MİMARİ:
// - Server component: endpoint listesi (butonlar client tarafında tetikler)
// - Client component: her buton loading state + result gösterir
// - Super admin yetkisi (Data Tools widget registry'de superAdminOnly: true)
//
// BACKEND ENDPOINTS (kullanılan):
// - POST /api/v2/admin/bulk-seed-questions
// - POST /api/v2/admin/delete-pending-questions
// - POST /api/v2/admin/invalidate-cache
// - POST /api/v2/admin/seed-questions
// - POST /api/v2/admin/generate-questions (yeni soru üret, Mavis API)
// - POST /api/v2/admin/reset-audit (tüm audit_status = 'pending')

import { Database, Upload, Trash2, RefreshCw, Sparkles, AlertTriangle } from "lucide-react";
import DataToolsClient from "./DataToolsClient";

export const dynamic = "force-dynamic";

export default function DataToolsPage() {
  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-rose-300 text-xs font-mono uppercase tracking-widest mb-2">
          <Database className="w-4 h-4" />
          Data Tools
        </div>
        <h1 className="text-2xl font-bold mb-2">Veri Araçları</h1>
        <p className="text-white/60 text-sm">
          CSV ↔ DB senkron, bulk seed/delete, audit sıfırlama. <strong className="text-rose-300">Süper admin</strong>{" "}
          dikkatli kullanılmalı — production verisini etkiler.
        </p>
      </div>

      <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-rose-200/90">
          <strong>Dikkat:</strong> Bu araçlar doğrudan production DB'yi etkiler. İşlem öncesi
          Supabase'den yedek al. Bulk seed/delete işlemleri geri alınamaz.
        </div>
      </div>

      <DataToolsClient />
    </div>
  );
}
