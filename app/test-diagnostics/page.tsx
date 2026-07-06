"use client";

// /test-diagnostics — Backend bağlantı diagnostics component
// Production-ready, robust try/except, her katmanı tek tek test eder.
// Kullanım: pythonmulakat.com/test-diagnostics

import { useState } from "react";

type TestResult = {
  name: string;
  status: "pending" | "running" | "pass" | "fail";
  detail: string;
  durationMs?: number;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://pymulakat-backend-production.up.railway.app";

async function timed<T>(fn: () => Promise<T>): Promise<{ value: T; ms: number }> {
  const t0 = performance.now();
  try {
    const value = await fn();
    return { value, ms: performance.now() - t0 };
  } catch (e) {
    throw { error: e, ms: performance.now() - t0 };
  }
}

function StatusDot({ status }: { status: TestResult["status"] }) {
  const color =
    status === "pass" ? "bg-emerald-500" :
    status === "fail" ? "bg-rose-500" :
    status === "running" ? "bg-amber-500 animate-pulse" :
    "bg-white/20";
  return <span className={`inline-block w-3 h-3 rounded-full ${color}`} />;
}

export default function TestDiagnosticsPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const update = (name: string, patch: Partial<TestResult>) => {
    setResults((prev) =>
      prev.map((r) => (r.name === name ? { ...r, ...patch } : r))
    );
  };

  const addResult = (result: TestResult) => {
    setResults((prev) => [...prev, result]);
  };

  async function runAll() {
    setRunning(true);
    setResults([]);

    // ─── Test 1: Backend root ─────────────────────────────
    addResult({ name: "1. Backend root (/)", status: "running", detail: "testing..." });
    try {
      const { value, ms } = await timed(() =>
        fetch(`${API_BASE}/`, { cache: "no-store" }).then((r) => r.json())
      );
      update("1. Backend root (/)", {
        status: "pass",
        detail: `version: ${value.version || "?"}, service: ${value.service || "?"}`,
        durationMs: Math.round(ms),
      });
    } catch (e: any) {
      update("1. Backend root (/)", {
        status: "fail",
        detail: `ERROR: ${e?.error?.message || JSON.stringify(e)}`,
      });
    }

    // ─── Test 2: /admin/health ───────────────────────────
    addResult({ name: "2. /admin/health", status: "running", detail: "testing..." });
    try {
      const { value, ms } = await timed(() =>
        fetch(`${API_BASE}/admin/health`, { cache: "no-store" }).then((r) => r.json())
      );
      const stats = value.db_stats || {};
      update("2. /admin/health", {
        status: "pass",
        detail: `db_ok: ${value.db_ok}, total: ${stats.total ?? "?"}, active: ${stats.is_published_true ?? "?"}, url: ${(value.supabase_url || "").slice(0, 50)}`,
        durationMs: Math.round(ms),
      });
    } catch (e: any) {
      update("2. /admin/health", {
        status: "fail",
        detail: `ERROR: ${e?.error?.message || JSON.stringify(e)}`,
      });
    }

    // ─── Test 3: /api/v2/categories ─────────────────────
    addResult({ name: "3. /api/v2/categories", status: "running", detail: "testing..." });
    try {
      const { value, ms } = await timed(() =>
        fetch(`${API_BASE}/api/v2/categories`, { cache: "no-store" }).then((r) => r.json())
      );
      const data = value.data || [];
      update("3. /api/v2/categories", {
        status: data.length > 0 ? "pass" : "fail",
        detail: `count: ${data.length}${data.length > 0 ? `, first: ${data[0].slug} (${data[0].question_count} soru)` : ""}`,
        durationMs: Math.round(ms),
      });
    } catch (e: any) {
      update("3. /api/v2/categories", {
        status: "fail",
        detail: `ERROR: ${e?.error?.message || JSON.stringify(e)}`,
      });
    }

    // ─── Test 4: /api/v2/questions/all ────────────────────
    addResult({ name: "4. /api/v2/questions/all", status: "running", detail: "testing..." });
    try {
      const { value, ms } = await timed(() =>
        fetch(`${API_BASE}/api/v2/questions/all?limit=500`, { cache: "no-store" }).then((r) => r.json())
      );
      const data = value.data || [];
      const byCat: Record<string, number> = {};
      for (const q of data) {
        byCat[q.category] = (byCat[q.category] || 0) + 1;
      }
      update("4. /api/v2/questions/all", {
        status: data.length > 0 ? "pass" : "fail",
        detail: `total: ${data.length}, by category: ${JSON.stringify(byCat)}`,
        durationMs: Math.round(ms),
      });
    } catch (e: any) {
      update("4. /api/v2/questions/all", {
        status: "fail",
        detail: `ERROR: ${e?.error?.message || JSON.stringify(e)}`,
      });
    }

    // ─── Test 5: ID 1 (legacy_id direct lookup) ─────────
    addResult({ name: "5. /api/v2/questions/1", status: "running", detail: "testing..." });
    try {
      const res = await fetch(`${API_BASE}/api/v2/questions/1`, { cache: "no-store" });
      const value = await res.json();
      update("5. /api/v2/questions/1", {
        status: res.ok ? "pass" : "fail",
        detail: res.ok ? `bulundu: ${value.title}` : `status ${res.status}: ${value.detail}`,
      });
    } catch (e: any) {
      update("5. /api/v2/questions/1", {
        status: "fail",
        detail: `ERROR: ${e?.message || JSON.stringify(e)}`,
      });
    }

    // ─── Test 6: Slug ile ─────────────────────────────────
    addResult({ name: "6. /api/v2/questions/by-slug", status: "running", detail: "testing..." });
    try {
      const res = await fetch(
        `${API_BASE}/api/v2/questions/by-slug/python-basics/palindrome-checker`,
        { cache: "no-store" }
      );
      const value = await res.json();
      update("6. /api/v2/questions/by-slug", {
        status: res.ok ? "pass" : "fail",
        detail: res.ok ? `bulundu: ${value.title}` : `status ${res.status}: ${value.detail}`,
      });
    } catch (e: any) {
      update("6. /api/v2/questions/by-slug", {
        status: "fail",
        detail: `ERROR: ${e?.message || JSON.stringify(e)}`,
      });
    }

    // ─── Test 7: Backend config exposure ─────────────────
    addResult({ name: "7. /admin/invalidate-cache (auth)", status: "running", detail: "testing..." });
    try {
      const res = await fetch(`${API_BASE}/admin/invalidate-cache`, {
        method: "POST",
        headers: { "X-Admin-Secret": "test-diagnostics" },
      });
      const value = await res.json();
      update("7. /admin/invalidate-cache (auth)", {
        status: res.ok ? "pass" : res.status === 403 ? "fail" : "fail",
        detail: res.ok ? `cache sıfırlandı: ${value.message}` : `status ${res.status}: ${value.detail || JSON.stringify(value)}`,
      });
    } catch (e: any) {
      update("7. /admin/invalidate-cache (auth)", {
        status: "fail",
        detail: `ERROR: ${e?.message || JSON.stringify(e)}`,
      });
    }

    setRunning(false);
  }

  const passCount = results.filter((r) => r.status === "pass").length;
  const failCount = results.filter((r) => r.status === "fail").length;

  return (
    <div className="min-h-screen bg-[#050816] text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🔧 Backend Diagnostics</h1>
        <p className="text-white/60 text-sm mb-6">
          Her katmanı tek tek test eder. Çıktıyı kopyala, Mavis'e yapıştır.
        </p>

        <div className="mb-6 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
          <div className="text-xs uppercase text-white/40 tracking-wider mb-1">
            API Base URL
          </div>
          <div className="font-mono text-sm text-amber-300 break-all">{API_BASE}</div>
        </div>

        <button
          onClick={runAll}
          disabled={running}
          className="w-full mb-6 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-white/10 disabled:text-white/40 text-slate-950 font-bold transition-colors"
        >
          {running ? "Çalışıyor..." : "▶ Tüm Testleri Çalıştır"}
        </button>

        {results.length > 0 && (
          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">{passCount}</div>
              <div className="text-xs text-white/60 uppercase">Pass</div>
            </div>
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-center">
              <div className="text-2xl font-bold text-rose-400">{failCount}</div>
              <div className="text-xs text-white/60 uppercase">Fail</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <div className="text-2xl font-bold text-white">{results.length}</div>
              <div className="text-xs text-white/60 uppercase">Total</div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {results.map((r) => (
            <div
              key={r.name}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <StatusDot status={r.status} />
                <span className="font-semibold text-sm">{r.name}</span>
                {r.durationMs !== undefined && (
                  <span className="ml-auto text-xs text-white/40">
                    {r.durationMs}ms
                  </span>
                )}
              </div>
              <pre className="text-xs text-white/70 whitespace-pre-wrap break-all font-mono">
                {r.detail}
              </pre>
            </div>
          ))}
        </div>

        {results.length > 0 && !running && (
          <button
            onClick={() => {
              const text = results
                .map((r) => `[${r.status.toUpperCase()}] ${r.name}\n  ${r.detail}\n`)
                .join("\n");
              navigator.clipboard.writeText(text);
              alert("Çıktı kopyalandı!");
            }}
            className="mt-6 w-full px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold transition-colors"
          >
            📋 Sonuçları Kopyala
          </button>
        )}
      </div>
    </div>
  );
}