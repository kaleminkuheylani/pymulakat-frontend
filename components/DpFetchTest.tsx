// components/DpFetchTest.tsx
// DP kategorisi için FETCH-TEST diagnostic component.
// Her sorunun detay sayfasını + tests endpoint'ini probe eder,
// HTTP status kodunu ve response time'ı gösterir.
//
// Kullanım: <DpFetchTest /> herhangi bir sayfaya ekle, tarayıcıda aç.
//
// Çıktı:
//   ✅ 200 OK  + ms    → her şey yolunda
//   ❌ 404/500 + ms    → backend veya CSV problemi
//   ⏱  timeout        → çok yavaş
//   ⏳ pending        → henüz fetch edilmedi
//
// URL pattern'leri test edilir:
//   1) CSV raw GitHub   → tüm DP sorularını çek (142/22)
//   2) Detail sayfası   → /interviews/dynamic-programming/{slug}
//   3) Tests endpoint   → backend DB (varsa) + CSV fallback

"use client";

import { useEffect, useState } from "react";

type Status = "pending" | "ok" | "error" | "timeout";

interface TestRow {
  id: number;
  slug: string;
  title: string;
  detailStatus: Status;
  detailMs?: number;
  testsStatus: Status;
  testsMs?: number;
  testsCount?: number;
  detailUrl: string;
  testsUrl: string;
  error?: string;
}

const CSV_URL = "https://raw.githubusercontent.com/kaleminkuheylani/pymulakat-backend/main/data/QUESTIONS-v3.csv";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ü/g, "u").replace(/ö/g, "o")
    .replace(/ş/g, "s").replace(/ç/g, "c").replace(/ğ/g, "g")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseCSV(text: string): Array<{ id: string; category: string; title: string }> {
  const rows: string[][] = [];
  let current: string[] = [];
  let cell = "";
  let inQuote = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuote) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; } else inQuote = false;
      } else cell += c;
    } else {
      if (c === '"') inQuote = true;
      else if (c === ",") { current.push(cell); cell = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        current.push(cell); cell = "";
        if (current.length > 1 || current[0] !== "") rows.push(current);
        current = [];
      } else cell += c;
    }
  }
  if (cell || current.length) { current.push(cell); rows.push(current); }
  if (rows.length < 2) return [];
  const h = rows[0];
  return rows.slice(1).map((cols) => ({
    id: cols[h.indexOf("id")] || "",
    category: cols[h.indexOf("category")] || "",
    title: cols[h.indexOf("title")] || "",
  })).filter((q) => q.id && q.title);
}

async function probeJson(url: string, timeoutMs = 6000): Promise<{ status: Status; ms: number; data?: any; error?: string }> {
  const start = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const r = await fetch(url, { cache: "no-store", signal: controller.signal });
    clearTimeout(timer);
    const ms = Math.round(performance.now() - start);
    if (!r.ok) {
      return { status: "error", ms, error: `HTTP ${r.status}` };
    }
    let data: any = null;
    try { data = await r.json(); } catch {}
    return { status: "ok", ms, data };
  } catch (e: any) {
    clearTimeout(timer);
    const ms = Math.round(performance.now() - start);
    if (e?.name === "AbortError") {
      return { status: "timeout", ms, error: `>${timeoutMs}ms` };
    }
    return { status: "error", ms, error: e?.message || "fetch error" };
  }
}

const STATUS_COLORS: Record<Status, string> = {
  pending: "bg-white/5 text-white/40 border-white/10",
  ok: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  error: "bg-rose-500/10 text-rose-300 border-rose-500/30",
  timeout: "bg-amber-500/10 text-amber-300 border-amber-500/30",
};

const STATUS_LABELS: Record<Status, string> = {
  pending: "⏳ pending",
  ok: "✅ 200 OK",
  error: "❌ error",
  timeout: "⏱ timeout",
};

export default function DpFetchTest() {
  const [rows, setRows] = useState<TestRow[]>([]);
  const [csvStatus, setCsvStatus] = useState<Status>("pending");
  const [csvMs, setCsvMs] = useState<number | undefined>();
  const [csvCount, setCsvCount] = useState<number | undefined>();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // 1) CSV'yi text olarak çek
      let csvText = "";
      let csvMsVal = 0;
      try {
        const start = performance.now();
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);
        const r = await fetch(CSV_URL, { cache: "no-store", signal: controller.signal });
        clearTimeout(timer);
        csvMsVal = Math.round(performance.now() - start);
        if (r.ok) {
          csvText = await r.text();
          setCsvStatus("ok");
          setCsvMs(csvMsVal);
        } else {
          setCsvStatus("error");
          setCsvMs(csvMsVal);
          return;
        }
      } catch (e: any) {
        setCsvStatus(e?.name === "AbortError" ? "timeout" : "error");
        setCsvMs(csvMsVal);
        return;
      }

      const all = parseCSV(csvText);
      const dp = all.filter((q) => q.category === "dynamic-programming");
      setCsvCount(all.length);

      // 2) Her DP sorusu için detail + tests probe
      const initial: TestRow[] = dp.map((q) => {
        const slug = slugifyTitle(q.title);
        return {
          id: parseInt(q.id, 10),
          slug,
          title: q.title,
          detailStatus: "pending",
          testsStatus: "pending",
          detailUrl: `/interviews/dynamic-programming/${slug}`,
          testsUrl: `${API_BASE}/api/v2/questions/${q.id}/tests`,
        };
      });
      setRows(initial);

      // 3) Sırayla probe (paralel değil, backend'i yormamak için)
      for (let i = 0; i < initial.length; i++) {
        if (cancelled) return;
        const r = initial[i];
        // Detail page (HTML response)
        const detailProbe = await probeJson(r.detailUrl, 8000);
        if (cancelled) return;
        // Tests endpoint
        const testsProbe = await probeJson(r.testsUrl, 6000);
        if (cancelled) return;
        setRows((prev) =>
          prev.map((p) =>
            p.id === r.id
              ? {
                  ...p,
                  detailStatus: detailProbe.status,
                  detailMs: detailProbe.ms,
                  testsStatus: testsProbe.status,
                  testsMs: testsProbe.ms,
                  testsCount: testsProbe.data?.data?.test_cases?.length,
                  error: detailProbe.error || testsProbe.error,
                }
              : p
          )
        );
      }
    }

    run();
    return () => { cancelled = true; };
  }, []);

  const summary = {
    total: rows.length,
    detailOk: rows.filter((r) => r.detailStatus === "ok").length,
    detailErr: rows.filter((r) => r.detailStatus === "error").length,
    detailTimeout: rows.filter((r) => r.detailStatus === "timeout").length,
    testsOk: rows.filter((r) => r.testsStatus === "ok").length,
    testsErr: rows.filter((r) => r.testsStatus === "error").length,
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">DP Fetch-Test Diagnostics</h1>
        <p className="text-white/60 text-sm mb-6">
          CSV: <code className="text-amber-300">raw.githubusercontent.com</code> &middot; Detail: slug URL &middot; Tests: backend API
        </p>

        {/* CSV status */}
        <div className={`rounded-xl border p-4 mb-6 ${STATUS_COLORS[csvStatus]}`}>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold">📄 CSV</span>
            <span>{STATUS_LABELS[csvStatus]}</span>
            {csvMs !== undefined && <span className="text-white/50">&middot; {csvMs}ms</span>}
            {csvCount !== undefined && <span className="text-white/50">&middot; {csvCount} satır</span>}
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 text-sm">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Toplam DP</div>
            <div className="text-2xl font-bold text-white">{summary.total}</div>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] p-3">
            <div className="text-emerald-300 text-xs uppercase tracking-wider mb-1">Detail ✅ 200</div>
            <div className="text-2xl font-bold text-emerald-300">{summary.detailOk}</div>
          </div>
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.05] p-3">
            <div className="text-rose-300 text-xs uppercase tracking-wider mb-1">Detail ❌</div>
            <div className="text-2xl font-bold text-rose-300">{summary.detailErr + summary.detailTimeout}</div>
          </div>
        </div>

        {/* Tablo */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr className="text-left text-white/50 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 w-12">id</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3 text-center">Detail</th>
                <th className="px-4 py-3 text-center">Tests</th>
                <th className="px-4 py-3 text-right">ms</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono text-white/60">{r.id}</td>
                  <td className="px-4 py-3">
                    <a
                      href={r.detailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-amber-400"
                    >
                      {r.title}
                    </a>
                    <div className="text-xs text-white/30 font-mono mt-0.5">/{r.slug}</div>
                    {r.error && <div className="text-xs text-rose-300 mt-0.5">{r.error}</div>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-semibold border ${STATUS_COLORS[r.detailStatus]}`}>
                      {STATUS_LABELS[r.detailStatus]}
                    </span>
                    {r.detailMs !== undefined && (
                      <div className="text-[10px] text-white/40 mt-0.5">{r.detailMs}ms</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-semibold border ${STATUS_COLORS[r.testsStatus]}`}>
                      {STATUS_LABELS[r.testsStatus]}
                    </span>
                    {r.testsMs !== undefined && (
                      <div className="text-[10px] text-white/40 mt-0.5">{r.testsMs}ms</div>
                    )}
                    {r.testsCount !== undefined && (
                      <div className="text-[10px] text-white/40 mt-0.5">{r.testsCount} tests</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-white/40 font-mono text-xs">
                    {r.detailMs && r.testsMs ? `d:${r.detailMs} t:${r.testsMs}` : "—"}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && csvStatus === "ok" && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-white/40">
                    DP soruları yükleniyor...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-xs text-white/40">
          <p>💡 <strong>200 OK</strong> = sayfa doğru render ediliyor. <strong>404/500</strong> = backend problemi veya route mismatch. <strong>timeout</strong> = backend yavaş veya unreachable.</p>
          <p className="mt-1">Test endpoint'i backend DB'yi kullanır; yeni sorular DB'de yoksa 404 döner (CSV-FIRST bu durumu handle eder).</p>
        </div>
      </div>
    </div>
  );
}
