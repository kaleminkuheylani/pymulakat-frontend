"use client";

// app/admin/system-health/SystemHealthChecks.tsx
// Canlı sistem kontrolleri — backend, Supabase, Vercel.

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";

interface Check {
  name: string;
  url: string;
  status: "ok" | "fail" | "checking";
  responseTimeMs: number | null;
  detail?: string;
}

const INITIAL_CHECKS: Omit<Check, "status" | "responseTimeMs" | "detail">[] = [
  { name: "Backend Health", url: "https://pymulakat-backend-production.up.railway.app/health" },
  { name: "Backend API", url: "https://pymulakat-backend-production.up.railway.app/api/v2/questions?limit=1" },
  { name: "Supabase REST", url: "https://lhuhfgpjbnngjxzlvywp.supabase.co/rest/v1/" },
  { name: "Frontend (apex)", url: "https://pythonmulakat.com/" },
];

export default function SystemHealthChecks() {
  const [checks, setChecks] = useState<Check[]>(
    INITIAL_CHECKS.map((c) => ({ ...c, status: "checking", responseTimeMs: null }))
  );

  const runCheck = async (idx: number) => {
    setChecks((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, status: "checking", responseTimeMs: null } : c))
    );
    const target = INITIAL_CHECKS[idx];
    const start = performance.now();
    try {
      const res = await fetch(target.url, { method: "GET", cache: "no-store" });
      const elapsed = Math.round(performance.now() - start);
      setChecks((prev) =>
        prev.map((c, i) =>
          i === idx
            ? {
                ...c,
                status: res.ok ? "ok" : "fail",
                responseTimeMs: elapsed,
                detail: res.ok ? undefined : `HTTP ${res.status}`,
              }
            : c
        )
      );
    } catch (e) {
      setChecks((prev) =>
        prev.map((c, i) =>
          i === idx
            ? {
                ...c,
                status: "fail",
                responseTimeMs: null,
                detail: e instanceof Error ? e.message : "Network error",
              }
            : c
        )
      );
    }
  };

  const runAll = async () => {
    for (let i = 0; i < INITIAL_CHECKS.length; i++) {
      await runCheck(i);
    }
  };

  useEffect(() => {
    runAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Banner counters
  useEffect(() => {
    const backend = checks[0];
    const supabase = checks[2];
    const backendEl = document.getElementById("sys-backend");
    const supabaseEl = document.getElementById("sys-supabase");
    if (backendEl) {
      backendEl.textContent = backend.status === "ok" ? "OK" : backend.status === "fail" ? "HATA" : "—";
      backendEl.className = `text-sm font-bold ${
        backend.status === "ok" ? "text-emerald-300" : backend.status === "fail" ? "text-rose-300" : "text-white"
      }`;
    }
    if (supabaseEl) {
      supabaseEl.textContent = supabase.status === "ok" ? "OK" : supabase.status === "fail" ? "HATA" : "—";
      supabaseEl.className = `text-sm font-bold ${
        supabase.status === "ok" ? "text-emerald-300" : supabase.status === "fail" ? "text-rose-300" : "text-white"
      }`;
    }
  }, [checks]);

  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="text-sm font-semibold text-white">Canlı Kontroller</div>
        <button
          type="button"
          onClick={runAll}
          className="flex items-center gap-1.5 text-xs text-emerald-300 hover:text-emerald-200"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Tümünü Kontrol Et
        </button>
      </div>

      <div className="divide-y divide-white/5">
        {checks.map((c, i) => (
          <div key={c.name} className="px-4 py-3 flex items-center gap-3">
            <div className="flex-shrink-0">
              {c.status === "checking" ? (
                <Loader2 className="w-4 h-4 text-white/40 animate-spin" />
              ) : c.status === "ok" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white">{c.name}</div>
              <div className="text-[10px] text-white/40 font-mono truncate">{c.url}</div>
              {c.detail && (
                <div className="text-[10px] text-rose-300 mt-0.5">{c.detail}</div>
              )}
            </div>
            <div className="flex-shrink-0 text-xs text-white/50 font-mono">
              {c.responseTimeMs !== null ? `${c.responseTimeMs}ms` : "—"}
            </div>
            <button
              type="button"
              onClick={() => runCheck(i)}
              className="flex-shrink-0 text-white/30 hover:text-white"
              aria-label="Yeniden kontrol"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
