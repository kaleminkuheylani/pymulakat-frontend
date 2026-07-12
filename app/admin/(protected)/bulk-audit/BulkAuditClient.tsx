"use client";

// app/admin/bulk-audit/BulkAuditClient.tsx
// Client component — bulk audit çalıştırma, progress, cost tracking.
//
// MİMARİ:
// - Backend /api/v2/admin/audit/bulk-audit endpoint'ini çağırır
// - Server-side tüm pending'leri sırayla işler (rate limit aware)
// - Client sadece progress + result gösterir
// - 429 / quota → backend otomatik retry eder, sonuç döner
// - Cancel: backend stop flag'i kontrol eder

import { useState } from "react";
import { Play, RefreshCw, CheckCircle2, XCircle, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface BulkStats {
  total: number;
  pending: number;
  passed: number;
  failed: number;
}

interface BulkResult {
  processed: number;
  passed: number;
  failed: number;
  errors?: Array<{ id: number; error: string }>;
  duration_ms?: number;
}

export default function BulkAuditClient({ initialStats }: { initialStats: BulkStats | null }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<BulkResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  const startBulk = async () => {
    const pending = initialStats?.pending ?? 0;
    if (pending === 0) {
      setError("Pending soru yok. Audit sıfırla veya yeni soru ekle.");
      return;
    }
    if (!window.confirm(
      `${pending} soru denetlenecek. Bu işlem ~${Math.ceil(pending * 5 / 60)} dakika sürer ve Mavis API maliyeti oluşturur. Devam edilsin mi?`
    )) {
      return;
    }
    setRunning(true);
    setError(null);
    setResult(null);
    setProgress({ current: 0, total: pending });
    try {
      // Backend bulk-audit endpoint'i tüm pending'leri işler
      // Server-streaming yok (Vercel function timeout 60s), bu yüzden
      // backend 50'şerli batch'ler halinde işler
      const data = await apiFetch<BulkResult>("/api/v2/admin/audit/bulk-audit", {
        method: "POST",
        body: { batch_size: 10 },
      });
      setResult(data);
      setProgress({ current: data.processed, total: pending });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Bilinmeyen hata";
      setError(msg);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-900/50 border border-white/10 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white mb-1">Bulk Audit Başlat</h3>
            <p className="text-xs text-white/60 leading-relaxed mb-3">
              Tüm pending soruları sırayla denetle. Backend 10'arlı batch'ler halinde işler,
              rate limit'e takılırsa otomatik retry eder.
            </p>
            <button
              type="button"
              onClick={startBulk}
              disabled={running}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-colors disabled:opacity-50"
            >
              {running ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Çalışıyor...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Başlat
                </>
              )}
            </button>
          </div>
        </div>

        {progress && progress.total > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-white/60 mb-1.5">
              <span>İlerleme</span>
              <span>
                {progress.current} / {progress.total}
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-rose-300">Hata</div>
              <div className="text-xs text-rose-200/80 mt-0.5">{error}</div>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              Tamamlandı
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-white/50">İşlenen</div>
                <div className="text-lg font-bold text-white">{result.processed}</div>
              </div>
              <div>
                <div className="text-white/50">Passed</div>
                <div className="text-lg font-bold text-emerald-300">{result.passed}</div>
              </div>
              <div>
                <div className="text-white/50">Failed</div>
                <div className="text-lg font-bold text-rose-300">{result.failed}</div>
              </div>
            </div>
            {result.duration_ms && (
              <div className="mt-2 text-[10px] text-white/40">
                Süre: {(result.duration_ms / 1000).toFixed(1)}s
              </div>
            )}
            {result.errors && result.errors.length > 0 && (
              <details className="mt-3">
                <summary className="text-xs text-rose-300 cursor-pointer">
                  {result.errors.length} hata detayı
                </summary>
                <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                  {result.errors.slice(0, 20).map((e, i) => (
                    <div key={i} className="text-[10px] font-mono text-rose-200/70">
                      #{e.id}: {e.error}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </div>

      <div className="text-[10px] text-white/40 leading-relaxed">
        <strong>Not:</strong> Mavis API key sırası <code className="bg-black/30 px-1 rounded">OPENAI → MAVIS → GOOGLE</code>.
        Model fallback: <code className="bg-black/30 px-1 rounded">gemini-2.5-flash → 2.0-flash → gpt-4o</code>.
        Backend service_role ile Supabase&apos;e yazar, her denetim 4 adım: code generate → subprocess test → mark audit → DB update.
      </div>
    </div>
  );
}
