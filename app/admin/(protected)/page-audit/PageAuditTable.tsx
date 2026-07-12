"use client";

// app/admin/page-audit/PageAuditTable.tsx
// Client component — sayfa listesini periyodik olarak kontrol et.
//
// NOT: Sayfa kontrolü client-side (headless tarayıcı yok). fetch ile
// status + response time ölçülür. ISR cache miss durumu X-Cache header'ı
// ile tespit edilir (Vercel custom header).

import { useEffect, useState } from "react";
import { RefreshCw, ExternalLink, CheckCircle2, XCircle, Loader2 } from "lucide-react";

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
}

export default function PageAuditTable({ initialPages }: { initialPages: PageInfo[] }) {
  const [statuses, setStatuses] = useState<PageStatus[]>(
    initialPages.map((p) => ({
      ...p,
      status: null,
      responseTimeMs: null,
      cache: "UNKNOWN" as const,
      checking: false,
    }))
  );

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
    // Paralel ama sıralı (rate limit'i önle)
    for (const p of initialPages) {
      await checkPage(p.url);
    }
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

  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="text-sm font-semibold text-white">Sayfa Listesi</div>
        <button
          type="button"
          onClick={checkAll}
          className="flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Tümünü Kontrol Et
        </button>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-slate-900/30 text-[10px] uppercase tracking-wider text-white/40">
          <tr>
            <th className="text-left px-4 py-2 font-semibold">URL</th>
            <th className="text-left px-4 py-2 font-semibold">Tür</th>
            <th className="text-left px-4 py-2 font-semibold">Status</th>
            <th className="text-left px-4 py-2 font-semibold">Süre</th>
            <th className="text-left px-4 py-2 font-semibold">Cache</th>
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
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  s.type === "pillar"
                    ? "bg-amber-500/15 text-amber-300"
                    : s.type === "detail"
                      ? "bg-cyan-500/15 text-cyan-300"
                      : "bg-white/10 text-white/60"
                }`}>
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
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  s.cache === "HIT"
                    ? "bg-emerald-500/15 text-emerald-300"
                    : s.cache === "MISS"
                      ? "bg-amber-500/15 text-amber-300"
                      : s.cache === "STALE"
                        ? "bg-rose-500/15 text-rose-300"
                        : "bg-white/10 text-white/40"
                }`}>
                  {s.cache}
                </span>
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
  );
}
