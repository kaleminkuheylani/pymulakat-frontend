// components/CategoryFetchTest.tsx
//
// TÜM kategori sayfaları için FETCH-TEST diagnostic component.
// CSV-only mimari: CSV = TEK kaynak. Backend DB'ye hiç bağlanmıyoruz.
//   • CSV (raw GitHub + jsDelivr CDN) → sorular ve test_cases parse
//   • Detail sayfası → Vercel'de Next.js ile render (CSV-FIRST)
//
// Backend DB kullanılmıyor — sadece CSV'de yoksa "missing" olur (yeni
// eklenen ama henüz push edilmemiş demektir). Mimari: CSV = source of truth.
//
// Kullanım:
//   <CategoryFetchTest category="dynamic-programming" />  → sadece DP
//   <CategoryFetchTest />                                   → tüm 9 kategori (default)
//
// Çıktı:
//   ✅ 200 OK  + ms    → her şey yolunda
//   ❌ 404/500 + ms    → Next.js detay sayfası yok
//   ⏱  timeout        → çok yavaş
//   ⏳ pending        → henüz fetch edilmedi
//   ⚠ missing          → CSV'de soru yok (henüz push edilmemiş)

"use client";

import { useEffect, useMemo, useState } from "react";

type Status = "pending" | "ok" | "error" | "timeout" | "missing";

export interface CategoryFetchTestProps {
  /** Filtrelenecek kategori. Boş/undefined = tüm 9 kategori. */
  category?: string;
  /** Maksimum probe edilecek soru (default 50) */
  maxRows?: number;
  /** Tabloda gösterilecek kategori label (örn. "Dinamik Programlama") */
  categoryLabel?: string;
}

interface TestRow {
  id: number;
  slug: string;
  title: string;
  category: string;
  detailStatus: Status;
  detailMs?: number;
  /** CSV'de test_cases parse sonucu: ok (varsa) / missing (yok) */
  csvTestsStatus: Status;
  csvTestsCount: number;
  csvParseMs?: number;
  detailUrl: string;
  error?: string;
}

interface CategoryInfo {
  /** CSV'deki kategori (örn. "dynamic-programming") */
  key: string;
  /** Görüntülenecek label (örn. "Dinamik Programlama") */
  label: string;
  /** URL prefix (örn. "/python-dinamik-programlama") */
  urlPrefix: string;
}

const ALL_CATEGORIES: CategoryInfo[] = [
  { key: "python-basics",       label: "Python Temelleri",      urlPrefix: "/python-temelleri" },
  { key: "data-structures",     label: "Veri Yapıları",         urlPrefix: "/python-veri-yapilari" },
  { key: "pandas",              label: "Pandas",                urlPrefix: "/python-pandas" },
  { key: "list-dict",           label: "Liste / Sözlük",        urlPrefix: "/python-liste-sozluk" },
  { key: "heap",                label: "Heap",                  urlPrefix: "/python-heap" },
  { key: "stack",               label: "Stack",                 urlPrefix: "/python-stack" },
  { key: "queue",               label: "Queue",                 urlPrefix: "/python-queue" },
  { key: "algorithms",          label: "Algoritmalar",          urlPrefix: "/python-algoritma-sorulari" },
  { key: "dynamic-programming", label: "Dinamik Programlama",   urlPrefix: "/python-dinamik-programlama" },
];

// CSV-only: backend'e hiç gitmiyoruz
const CSV_PRIMARY = "https://raw.githubusercontent.com/kaleminkuheylani/pymulakat-backend/main/data/QUESTIONS-v3.csv";
const CSV_FALLBACK = "https://cdn.jsdelivr.net/gh/kaleminkuheylani/pymulakat-backend@main/data/QUESTIONS-v3.csv";

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ü/g, "u").replace(/ö/g, "o")
    .replace(/ş/g, "s").replace(/ç/g, "c").replace(/ğ/g, "g")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface ParsedRow {
  id: string;
  category: string;
  title: string;
  test_cases: string;
  function_name: string;
  level: string;
}

function parseCSV(text: string): ParsedRow[] {
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
    test_cases: cols[h.indexOf("test_cases")] || "",
    function_name: cols[h.indexOf("function_name")] || "",
    level: cols[h.indexOf("level")] || "beginner",
  })).filter((q) => q.id && q.title);
}

async function probe(url: string, timeoutMs = 6000): Promise<{ status: Status; ms: number; error?: string }> {
  const start = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const r = await fetch(url, { cache: "no-store", signal: controller.signal });
    clearTimeout(timer);
    const ms = Math.round(performance.now() - start);
    if (!r.ok) return { status: "error", ms, error: `HTTP ${r.status}` };
    return { status: "ok", ms };
  } catch (e: any) {
    clearTimeout(timer);
    const ms = Math.round(performance.now() - start);
    if (e?.name === "AbortError") return { status: "timeout", ms, error: `>${timeoutMs}ms` };
    return { status: "error", ms, error: e?.message || "fetch error" };
  }
}

const STATUS_COLORS: Record<Status, string> = {
  pending:  "bg-white/5 text-white/40 border-white/10",
  ok:       "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  error:    "bg-rose-500/10 text-rose-300 border-rose-500/30",
  timeout:  "bg-amber-500/10 text-amber-300 border-amber-500/30",
  missing:  "bg-rose-500/10 text-rose-300 border-rose-500/30",
};

const STATUS_LABELS: Record<Status, string> = {
  pending:  "⏳ pending",
  ok:       "✅ 200 OK",
  error:    "❌ error",
  timeout:  "⏱ timeout",
  missing:  "⚠ missing",
};

export default function CategoryFetchTest({
  category,
  maxRows = 50,
  categoryLabel,
}: CategoryFetchTestProps) {
  const isAllMode = !category;
  const targetCategories = useMemo(() => {
    if (category) return ALL_CATEGORIES.filter((c) => c.key === category);
    return ALL_CATEGORIES;
  }, [category]);

  const [allRows, setAllRows] = useState<Record<string, TestRow[]>>({});
  const [csvStatus, setCsvStatus] = useState<Status>("pending");
  const [csvMs, setCsvMs] = useState<number | undefined>();
  const [csvCount, setCsvCount] = useState<number | undefined>();
  const [csvSource, setCsvSource] = useState<"primary" | "fallback" | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(category || ALL_CATEGORIES[0].key);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // 1) CSV'yi text olarak çek — CSV-only mimari
      let csvText = "";
      let csvMsVal = 0;
      let source: "primary" | "fallback" | null = null;
      let ok = false;
      for (const url of [CSV_PRIMARY, CSV_FALLBACK]) {
        const start = performance.now();
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);
        try {
          const r = await fetch(url, { cache: "no-store", signal: controller.signal });
          clearTimeout(timer);
          csvMsVal = Math.round(performance.now() - start);
          if (r.ok) {
            csvText = await r.text();
            source = url === CSV_PRIMARY ? "primary" : "fallback";
            setCsvStatus("ok");
            setCsvMs(csvMsVal);
            setCsvSource(source);
            ok = true;
            break;
          }
        } catch {
          clearTimeout(timer);
        }
      }
      if (!ok) {
        setCsvStatus("error");
        setCsvMs(csvMsVal);
        return;
      }
      if (cancelled) return;

      const all = parseCSV(csvText);
      setCsvCount(all.length);

      // 2) Her kategori için initial row — CSV'de test_cases ok=missing
      const initial: Record<string, TestRow[]> = {};
      for (const cat of targetCategories) {
        const catRows = all.filter((q) => q.category === cat.key);
        const rows: TestRow[] = catRows.slice(0, maxRows).map((q) => {
          const slug = slugifyTitle(q.title);
          // CSV-FIRST: test_cases parse et
          let cases: any[] = [];
          let parseStatus: Status = "ok";
          try {
            cases = JSON.parse(q.test_cases || "[]");
            if (!Array.isArray(cases) || cases.length === 0) parseStatus = "missing";
          } catch {
            parseStatus = "missing";
          }
          return {
            id: parseInt(q.id, 10),
            slug,
            title: q.title,
            category: cat.key,
            detailStatus: "pending",
            csvTestsStatus: parseStatus,
            csvTestsCount: cases.length || 0,
            detailUrl: `/interviews/${cat.key}/${slug}`,
          };
        });
        initial[cat.key] = rows;
      }
      if (cancelled) return;
      setAllRows(initial);

      // 3) Her satır için detail sayfası probe et (Next.js render)
      for (const cat of targetCategories) {
        if (cancelled) return;
        const rows = initial[cat.key];
        for (let i = 0; i < rows.length; i++) {
          if (cancelled) return;
          const r = rows[i];
          const detailProbe = await probe(r.detailUrl, 8000);
          if (cancelled) return;
          setAllRows((prev) => {
            const catRows = prev[cat.key] || [];
            return {
              ...prev,
              [cat.key]: catRows.map((p) =>
                p.id === r.id
                  ? { ...p, detailStatus: detailProbe.status, detailMs: detailProbe.ms, error: detailProbe.error }
                  : p
              ),
            };
          });
        }
      }
    }

    run();
    return () => { cancelled = true; };
  }, [category, maxRows, targetCategories]);

  const allRowsFlat = useMemo(
    () => Object.values(allRows).flat(),
    [allRows]
  );

  const visibleRows = isAllMode ? (allRows[activeCategory] || []) : (allRows[category!] || []);

  const summary = {
    total: allRowsFlat.length,
    detailOk: allRowsFlat.filter((r) => r.detailStatus === "ok").length,
    detailErr: allRowsFlat.filter((r) => r.detailStatus === "error").length,
    detailTimeout: allRowsFlat.filter((r) => r.detailStatus === "timeout").length,
    csvTestsOk: allRowsFlat.filter((r) => r.csvTestsStatus === "ok").length,
    csvTestsMissing: allRowsFlat.filter((r) => r.csvTestsStatus === "missing").length,
    byCategory: targetCategories.map((c) => ({
      ...c,
      count: allRows[c.key]?.length || 0,
      detailOk: allRows[c.key]?.filter((r) => r.detailStatus === "ok").length || 0,
      csvTestsOk: allRows[c.key]?.filter((r) => r.csvTestsStatus === "ok").length || 0,
      csvTestsMissing: allRows[c.key]?.filter((r) => r.csvTestsStatus === "missing").length || 0,
    })),
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {isAllMode ? "Category Fetch-Test Diagnostics" : `${categoryLabel || category} Fetch-Test`}
        </h1>
        <p className="text-white/60 text-sm mb-6">
          <span className="text-amber-300">CSV-only mimari</span> · CSV: <code className="text-amber-300">raw.githubusercontent.com</code> + jsDelivr · Detail: Next.js slug URL
        </p>

        {/* CSV status */}
        <div className={`rounded-xl border p-4 mb-6 ${STATUS_COLORS[csvStatus]}`}>
          <div className="flex items-center gap-3 text-sm flex-wrap">
            <span className="font-semibold">📄 CSV</span>
            <span>{STATUS_LABELS[csvStatus]}</span>
            {csvMs !== undefined && <span className="text-white/50">&middot; {csvMs}ms</span>}
            {csvCount !== undefined && <span className="text-white/50">&middot; {csvCount} satır</span>}
            {csvSource && <span className="text-white/50">&middot; {csvSource}</span>}
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 text-sm">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Toplam Soru</div>
            <div className="text-2xl font-bold text-white">{summary.total}</div>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] p-3">
            <div className="text-emerald-300 text-xs uppercase tracking-wider mb-1">Detail ✅ 200</div>
            <div className="text-2xl font-bold text-emerald-300">{summary.detailOk}</div>
          </div>
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/[0.05] p-3">
            <div className="text-cyan-300 text-xs uppercase tracking-wider mb-1">CSV Test Cases</div>
            <div className="text-2xl font-bold text-cyan-300">
              {summary.csvTestsOk}<span className="text-sm text-white/40"> / {summary.total}</span>
            </div>
            <div className="text-[10px] text-cyan-300/60 mt-0.5">ok: {summary.csvTestsOk} · missing: {summary.csvTestsMissing}</div>
          </div>
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.05] p-3">
            <div className="text-rose-300 text-xs uppercase tracking-wider mb-1">Detail ❌</div>
            <div className="text-2xl font-bold text-rose-300">{summary.detailErr + summary.detailTimeout}</div>
          </div>
        </div>

        {/* Kategori sekmeleri (tüm modda) */}
        {isAllMode && (
          <div className="flex flex-wrap gap-2 mb-4">
            {summary.byCategory.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  activeCategory === c.key
                    ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-200"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                }`}
              >
                {c.label}
                <span className="ml-2 text-white/40">
                  {c.detailOk}/{c.count}
                </span>
                {c.csvTestsMissing > 0 && (
                  <span className="ml-1 text-rose-300/80">·missing:{c.csvTestsMissing}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Aktif kategori özet kartı */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 mb-4 text-sm">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-white/40 uppercase text-xs tracking-wider">Aktif:</span>
            <span className="font-semibold">
              {ALL_CATEGORIES.find((c) => c.key === activeCategory)?.label || activeCategory}
            </span>
            <span className="text-white/40">·</span>
            <a
              href={ALL_CATEGORIES.find((c) => c.key === activeCategory)?.urlPrefix}
              className="text-indigo-300 hover:underline text-xs"
              target="_blank"
            >
              {ALL_CATEGORIES.find((c) => c.key === activeCategory)?.urlPrefix}
            </a>
          </div>
        </div>

        {/* Tablo */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr className="text-left text-white/50 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 w-12">id</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3 text-center">Detail<br/><span className="text-[10px] text-white/40 normal-case font-normal">Next.js slug URL</span></th>
                <th className="px-4 py-3 text-center">CSV Tests<br/><span className="text-[10px] text-white/40 normal-case font-normal">test_cases JSON</span></th>
                <th className="px-4 py-3 text-right">ms</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((r) => (
                <tr key={`${r.category}-${r.id}`} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono text-white/60">{r.id}</td>
                  <td className="px-4 py-3">
                    <a
                      href={r.detailUrl}
                      target="_blank"
                      rel="noopener"
                      className="text-white hover:text-indigo-300 transition-colors"
                    >
                      {r.title}
                    </a>
                    <div className="text-xs text-white/40 font-mono">/{r.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider ${STATUS_COLORS[r.detailStatus]}`}>
                      {STATUS_LABELS[r.detailStatus]}
                    </span>
                    {r.detailMs !== undefined && (
                      <div className="text-[10px] text-white/40 mt-1">{r.detailMs}ms</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider ${STATUS_COLORS[r.csvTestsStatus]}`}>
                      {STATUS_LABELS[r.csvTestsStatus]}
                    </span>
                    <div className="text-[10px] text-white/40 mt-1">
                      {r.csvTestsCount > 0 ? `${r.csvTestsCount} tests` : "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-white/60">
                    d:{r.detailMs ?? "–"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibleRows.length === 0 && (
            <div className="text-center text-white/40 text-sm py-8">Yükleniyor…</div>
          )}
        </div>

        <p className="mt-4 text-xs text-white/40">
          💡 Mimari: <span className="text-amber-300">CSV = tek kaynak</span>.
          Backend DB'ye hiç bağlanmıyoruz. "missing" = CSV'de test_cases
          boş/parse hatası (push edilmemiş demektir).
        </p>
      </div>
    </div>
  );
}
