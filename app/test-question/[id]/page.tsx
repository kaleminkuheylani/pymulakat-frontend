"use client";

// /test-question/[id] — Soru detay sayfası için diagnostics
import React from "react";
// pythonmulakat.com/test-question/matris-carpimi
// Hangi katmanda ne hata aldığını gösterir.

import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function TestQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15+ async params — React.use() ile unwrap et
  const resolved = React.use(params);
  const idOrSlug = resolved.id;
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const update = (name: string, patch: Partial<TestResult>) => {
    setResults((prev) => prev.map((r) => (r.name === name ? { ...r, ...patch } : r)));
  };
  const addResult = (result: TestResult) => setResults((prev) => [...prev, result]);

  async function runAll() {
    setRunning(true);
    setResults([]);

    // ─── Test 1: by-slug API ───────────────────────────
    addResult({ name: "1. by-slug (python-basics)", status: "running", detail: "..." });
    try {
      const { value, ms } = await timed(() =>
        fetch(`${API_BASE}/api/v2/questions/by-slug/python-basics/${encodeURIComponent(idOrSlug)}`).then((r) => r.json())
      );
      const data = value.data || value;
      update("1. by-slug (python-basics)", {
        status: data?.id ? "pass" : "fail",
        detail: data?.id ? `OK: id=${data.id}, title="${data.title}"` : `FAIL: ${value.detail || JSON.stringify(value).slice(0, 200)}`,
        durationMs: Math.round(ms),
      });
    } catch (e: any) {
      update("1. by-slug (python-basics)", { status: "fail", detail: `ERROR: ${e?.error?.message || e}` });
    }

    // ─── Test 2: by-slug (other categories) ────────────
    for (const cat of ["data-structures", "algorithms", "pandas", "list-dict"]) {
      const name = `2. by-slug (${cat})`;
      addResult({ name, status: "running", detail: "..." });
      try {
        const { value, ms } = await timed(() =>
          fetch(`${API_BASE}/api/v2/questions/by-slug/${cat}/${encodeURIComponent(idOrSlug)}`).then((r) => r.json())
        );
        const data = value.data || value;
        update(name, {
          status: data?.id ? "pass" : "fail",
          detail: data?.id ? `OK: id=${data.id}, title="${data.title}"` : `404 / not found`,
          durationMs: Math.round(ms),
        });
      } catch (e: any) {
        update(name, { status: "fail", detail: `ERROR: ${e?.error?.message || e}` });
      }
    }

    // ─── Test 3: by-id (numeric only) ──────────────────
    const asNum = parseInt(idOrSlug, 10);
    if (!isNaN(asNum)) {
      addResult({ name: "3. by-id (numeric)", status: "running", detail: "..." });
      try {
        const { value, ms } = await timed(() =>
          fetch(`${API_BASE}/api/v2/questions/${asNum}`).then((r) => r.json())
        );
        const data = value.data || value;
        update("3. by-id (numeric)", {
          status: data?.id ? "pass" : "fail",
          detail: data?.id ? `OK: title="${data.title}"` : `404`,
          durationMs: Math.round(ms),
        });
      } catch (e: any) {
        update("3. by-id (numeric)", { status: "fail", detail: `ERROR: ${e?.error?.message || e}` });
      }
    }

    // ─── Test 4: /tests endpoint (auth required) ──────
    // Hem auth'lı hem auth'sız test et
    addResult({ name: "4. /tests (no auth)", status: "running", detail: "..." });
    try {
      const target = !isNaN(asNum) ? asNum : null;
      if (target) {
        const res = await fetch(`${API_BASE}/api/v2/questions/${target}/tests`);
        const text = await res.text();
        update("4. /tests (no auth)", {
          status: res.ok ? "pass" : "fail",
          detail: `${res.status} ${res.statusText}: ${text.slice(0, 200)}`,
        });
      } else {
        update("4. /tests (no auth)", { status: "pass", detail: "skip — ID değil, slug test edildi" });
      }
    } catch (e: any) {
      update("4. /tests (no auth)", { status: "fail", detail: `ERROR: ${e?.message}` });
    }

    // ─── Test 5: by-slug /tests (alternatif) ───────────
    addResult({ name: "5. by-slug /tests", status: "running", detail: "..." });
    try {
      const res = await fetch(`${API_BASE}/api/v2/questions/by-slug/python-basics/${encodeURIComponent(idOrSlug)}/tests`);
      const text = await res.text();
      update("5. by-slug /tests", {
        status: res.ok ? "pass" : "fail",
        detail: `${res.status} ${res.statusText}: ${text.slice(0, 200)}`,
      });
    } catch (e: any) {
      update("5. by-slug /tests", { status: "fail", detail: `ERROR: ${e?.message}` });
    }

    // ─── Test 6: /auth/me ─────────────────────────────
    addResult({ name: "6. /auth/me (session check)", status: "running", detail: "..." });
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
      const text = await res.text();
      update("6. /auth/me (session check)", {
        status: res.ok ? "pass" : res.status === 401 ? "fail" : "fail",
        detail: `${res.status}: ${text.slice(0, 200)}`,
      });
    } catch (e: any) {
      update("6. /auth/me (session check)", { status: "fail", detail: `ERROR: ${e?.message}` });
    }

    setRunning(false);
  }

  const passCount = results.filter((r) => r.status === "pass").length;
  const failCount = results.filter((r) => r.status === "fail").length;

  return (
    <div className="min-h-screen bg-[#050816] text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/test-diagnostics" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6">
          ← Diagnostics
        </Link>
        <h1 className="text-3xl font-bold mb-2">📄 Soru Detayı Test</h1>
        <p className="text-white/60 text-sm mb-6">
          Slug veya ID ile detay sayfasının tüm katmanlarını test eder.
        </p>

        <div className="mb-6 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
          <div className="text-xs uppercase text-white/40 tracking-wider mb-1">Test edilen</div>
          <div className="font-mono text-sm text-amber-300 break-all">
            {idOrSlug}
            <span className="ml-2 text-white/40 text-xs">
              ({/^\d+$/.test(idOrSlug) ? "numeric ID" : "slug"})
            </span>
          </div>
        </div>

        <div className="mb-6 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
          <div className="text-xs uppercase text-white/40 tracking-wider mb-1">API Base URL</div>
          <div className="font-mono text-sm text-white/70 break-all">{API_BASE}</div>
        </div>

        <button
          onClick={runAll}
          disabled={running}
          className="w-full mb-6 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-white/10 disabled:text-white/40 text-slate-950 font-bold transition-colors"
        >
          {running ? "Çalışıyor..." : "▶ Tüm Detay Testlerini Çalıştır"}
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
            <div key={r.name} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-3 mb-2">
                <StatusDot status={r.status} />
                <span className="font-semibold text-sm">{r.name}</span>
                {r.durationMs !== undefined && (
                  <span className="ml-auto text-xs text-white/40">{r.durationMs}ms</span>
                )}
              </div>
              <pre className="text-xs text-white/70 whitespace-pre-wrap break-all font-mono">{r.detail}</pre>
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