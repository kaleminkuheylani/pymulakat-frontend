"use client";

// app/admin/(protected)/page-audit/PageAuditTable.tsx
// Client component — periyodik HTTP kontrol (status, cache, response time).
// View count SERVER-SIDE gelir (initialViewCount), periyodik güncellenir.

import { useEffect, useState } from "react";
import { RefreshCw, ExternalLink, CheckCircle2, XCircle, Loader2, Eye } from "lucide-react";

interface PageInfo {
  url: string;
  title: string;
  type: "pillar" | "detail" | "system";
}

interface PageStatus {
  url: string;
  title: string;
  type: PageInfo["type"];
  status: number | null;
  responseTimeMs: number | null;
  cache: "HIT" | "MISS" | "STALE" | "UNKNOWN";
  checking: boolean;
  viewCount: number;
}

export default function PageAuditTable({
  initialPages,
  viewCountMap,
}: {
  initialPages: PageInfo[];
  viewCountMap: Record<string, number>;
}) {
  const [statuses, setStatuses] = useState<PageStatus[]>(
    initialPages.map((p) => ({
      ...p,
      status: null,
      responseTimeMs: null,
      cache: "UNKNOWN" as const,
      checking: false,
      viewCount: viewCountMap[p.url] ?? 0,
    }))
  );
  const [viewCounts, setViewCounts] = useState<Record<string, number>>(viewCountMap);

  const refreshViewCounts = async () => {
    try {
      const res = await fetch(`/api/v2/analytics/top-pages?days=30&limit=500`, {
        credentials: "include",
      });
      if (!res.ok) return;
      const data = (await res.json()) as { pages: Array<{ path: string; total_views: number }> };
      const newMap: Record<string, number> = {};
      for (const p of data.pages) {
        newMap[p.path] = p.total_views;
      }
      setViewCounts(newMap);
      setStatuses((prev) =>
        prev.map((s) => ({ ...s, viewCount: newMap[s.url] ?? 0 }))
      );
    } catch {
      // ignore
    }
  };

  const checkPage = async (url: string) => {
    setStatuses((prev) =>
      prev.map((p) => (p.url === url ? { ...p, checking: true } : p))
    );
    const start = performance.now();
    try {
      const res = await fetch(url, { method: "HEAD", cache: "no-store" });
      const elapsed = Math.round(performance.now() - start);
      const cacheHeader = res.headers.get("x-vercel-cache") || "";
      const cache: PageStatus["cache"] =
        cacheHeader === "HIT"
          ? "HIT"
          : cacheHeader === "MISS"
            ? "MISS"
            : cacheHeader.includes("STALE")
              ? "STALE"
              : "UNKNOWN";
      setStatuses((prev) =>
        prev.map((p) =>
          p.url === url
            ? { ...p, status: res.status, responseTimeMs: elapsed, cache, checking: false }
            : p
        )
      );
    } catch {
      setStatuses((prev) =>
        prev.map((p) =>
          p.url === url
            ? { ...p, status: 0, responseTimeMs: null, cache: "UNKNOWN", checking: false }
            : p
        )
      );
    }
  };

  const checkAll = async () => {
    for (const p of initialPages) {
      await checkPage(p.url);
    }
  };

  const refreshAll = async () => {
    await Promise.all([checkAll(), refreshViewCounts()]);
  };

  useEffect(() => {
    checkAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Banner counters
  useEffect(() => {
    const ok = statuses.filter((s) => s.status === 200).length;
    const err = statuses.filter((s) => s.status !== null && s.status !== 200).length;
    const okEl = document.getElementById("page-audit-ok");
    const errEl = document.getElementById("page-audit-err");
    if (okEl) okEl.textContent = String(ok);
    if (errEl) errEl.textContent = String(err);
  }, [statuses]);

  // Toplam view banner (günceller)
  useEffect(() => {
    const total = Object.values(viewCounts).reduce((a, v) => a + v, 0);
    const el = document.getElementById("page-audit-banner-views");
    if (el) el.textContent = total.toLocaleString("tr-TR");
  }, [viewCounts]);

  // Toplam view (initial'dan)
  const totalViews = Object.values(viewCounts).reduce((a, v) => a + v, 0);

  // Top 5 sayfa
  const top5 = Object.entries(viewCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .filter(([, v]) => v > 0);

  return (
    <div className="space-y-4">
      {/* ─── Top 5 sayfa (server-side initial) ──────────── */}
      {top5.length > 0 && (
        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">En Çok Ziyaret (30g)</h3>
          </div>
          <div className="space-y-1.5">
            {top5.map(([path, count], i) => {
              const max = top5[0][1];
              const pct = Math.round((count / max) * 100);
              return (
                <div key={path} className="flex items-center gap-2">
                  <div className="w-6 text-right text-[10px] text-white/40 font-mono">
                    {i + 1}.
                  </div>
                  <div className="w-44 text-xs text-white/80 truncate font-mono">
                    {path}
                  </div>
                  <div className="flex-1 h-4 bg-white/5 rounded overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-xs font-mono text-amber-300 font-semibold">
                    {count.toLocaleString("tr-TR")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Sayfa tablosu ──────────────────────────────── */}
      <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="text-sm font-semibold text-white">
            Sayfa Listesi{" "}
            <span className="text-white/40 text-xs font-normal">
              ({statuses.length} URL · toplam {totalViews.toLocaleString("tr-TR")} ziyaret)
            </span>
          </div>
          <button
            type="button"
            onClick={refreshAll}
            className="flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Tümünü Kontrol Et
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/30 text-[10px] uppercase tracking-wider text-white/40">
              <tr>
                <th className="text-left px-4 py-2 font-semibold">URL</th>
                <th className="text-left px-4 py-2 font-semibold">Tür</th>
                <th className="text-left px-4 py-2 font-semibold">Status</th>
                <th className="text-left px-4 py-2 font-semibold">Süre</th>
                <th className="text-left px-4 py-2 font-semibold">Cache</th>
                <th className="text-left px-4 py-2 font-semibold">
                  <Eye className="w-3 h-3 inline mr-1" />
                  Ziyaret
                </th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {statuses.map((s) => (
                <tr key={s.url} className="border-t border-white/5 hover:bg-white/5">
                  <td className="px-4 py-2 font-mono text-xs text-white/90">
                    {s.url}
                    <div className="text-[10px] text-white/40 font-normal">{s.title}</div>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        s.type === "pillar"
                          ? "bg-amber-500/15 text-amber-300"
                          : s.type === "detail"
                            ? "bg-cyan-500/15 text-cyan-300"
                            : "bg-white/10 text-white/60"
                      }`}
                    >
                      {s.type}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {s.checking ? (
                      <Loader2 className="w-4 h-4 text-white/40 animate-spin" />
                    ) : s.status === 200 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : s.status === null ? (
                      <span className="text-white/30">—</span>
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                    {s.status !== null && s.status !== 0 && (
                      <span className="ml-1.5 text-xs text-white/50">{s.status}</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-xs text-white/60 font-mono">
                    {s.responseTimeMs !== null ? `${s.responseTimeMs}ms` : "—"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        s.cache === "HIT"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : s.cache === "MISS"
                            ? "bg-amber-500/15 text-amber-300"
                            : s.cache === "STALE"
                              ? "bg-rose-500/15 text-rose-300"
                              : "bg-white/10 text-white/40"
                      }`}
                    >
                      {s.cache}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm font-mono">
                    {s.viewCount === 0 ? (
                      <span className="text-white/30">0</span>
                    ) : (
                      <span className="text-amber-300 font-semibold">
                        {s.viewCount.toLocaleString("tr-TR")}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5 inline" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
