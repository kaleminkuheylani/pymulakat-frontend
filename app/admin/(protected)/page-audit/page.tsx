// app/admin/(protected)/page-audit/page.tsx
// Page Audit — 9 pillar + tüm detay sayfalar (server-side).
//
// MİMARİ (server-side):
// - Server component: backend'den view count map çek
// - Her sayfa için: status, response time, cache, view count
// - Tıklama sayacı: page_views_daily aggregate (server-side)
// - Category breakdown: kategori bazlı ziyaret istatistikleri
//
// ROBOT URL LİSTESİ:
// - 9 pillar sayfa: /temelleri, /pandas, /heap, ...
// - Her kategoriden 3 örnek detay sayfa (top 9 × 3 = 27 detay)
// - System sayfalar: /, /interviews, /about, /python-egitimi, /login
// - Toplam ~40 sayfa denetlenir (fetch süresi <2s)
//
// MİMARİ KURAL (KESİN):
// - lib/api/ üzerinden fetch (inline fetch YASAK)
// - Server component, ISR cache YOK (force-dynamic, analytics fresh)
// - View count: aggregate tablo (page_views_daily), raw değil

import { listCategories } from "@/lib/api/questionAPI";
import { getAllQuestions } from "@/lib/api/questionAPI";
import { getCategoryUrl, CATEGORY_LABEL } from "@/lib/categorySlug";
import {
  getViewCountMap,
  getAnalyticsStats,
  getCategoryBreakdown,
} from "@/lib/api/analyticsAPI";
import { FileText, Search, Activity, Eye, BarChart3 } from "lucide-react";
import PageAuditTable from "./PageAuditTable";

export const dynamic = "force-dynamic";

interface PageInfo {
  url: string;
  title: string;
  type: "pillar" | "detail" | "system";
  category: string | null;
  questionCount?: number;
}

export default async function PageAuditPage() {
  // 1) Tüm kategoriler
  const categories = await listCategories();

  // 2) Tüm detay sayfa listesi (85 soru, 9 kategori)
  // Her kategoriden max 3 örnek detay al (top ~27 detay + 9 pillar + system = ~40 sayfa)
  const allQuestions = await getAllQuestions({ limit: 200 });
  const byCategory = new Map<string, typeof allQuestions>();
  for (const q of allQuestions) {
    if (!q.category || !q.slug) continue;
    const list = byCategory.get(q.category) || [];
    list.push(q);
    byCategory.set(q.category, list);
  }

  // 3) Sayfa listesi oluştur
  const pages: PageInfo[] = [
    { url: "/", title: "Ana Sayfa", type: "system", category: null },
    { url: "/interviews", title: "Tüm Kategoriler", type: "system", category: "interviews" },
    { url: "/about", title: "Hakkımızda", type: "system", category: null },
    { url: "/python-egitimi", title: "Python Eğitimi", type: "system", category: "python-egitimi" },
    { url: "/login", title: "Login", type: "system", category: null },
  ];

  // 9 pillar
  for (const c of categories) {
    const displayUrl = getCategoryUrl(c.category);
    pages.push({
      url: displayUrl,
      title: CATEGORY_LABEL[c.category] || c.label || c.category,
      type: "pillar",
      category: c.category,
    });
  }

  // Her kategoriden top 3 detay sayfa
  for (const c of categories) {
    const list = byCategory.get(c.category) || [];
    for (const q of list.slice(0, 3)) {
      const displayUrl = getCategoryUrl(c.category);
      pages.push({
        url: `${displayUrl}/${q.slug}`,
        title: q.title,
        type: "detail",
        category: c.category,
      });
    }
  }

  // 4) View count map (server-side, backend aggregate)
  const [viewCountMap, analyticsStats, categoryBreakdown] = await Promise.all([
    getViewCountMap(30),
    getAnalyticsStats(30),
    getCategoryBreakdown(30),
  ]);

  // Banner counters (server-rendered initial)
  const totalViews = Array.from(viewCountMap.values()).reduce((a, v) => a + v, 0);

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-2">
          <FileText className="w-4 h-4" />
          Page Audit
        </div>
        <h1 className="text-2xl font-bold mb-2">Sayfa Denetimi</h1>
        <p className="text-white/60 text-sm">
          Tüm public sayfaların HTTP durumu, yanıt süresi, ISR cache durumu,{" "}
          <strong className="text-amber-300">tıklama sayacı</strong>.
        </p>
      </div>

      {/* ─── Toplam stats banner (server-rendered) ────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        <div className="bg-slate-900/50 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 text-cyan-300 text-xs mb-1">
            <Search className="w-3.5 h-3.5" />
            SAYFA
          </div>
          <div className="text-2xl font-bold text-white">{pages.length}</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-amber-300 text-xs mb-1">
            <Eye className="w-3.5 h-3.5" />
            ZİYARET (30g)
          </div>
          <div className="text-2xl font-bold text-amber-300" id="page-audit-banner-views">
            {totalViews.toLocaleString("tr-TR")}
          </div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-emerald-300 text-xs mb-1">
            <Activity className="w-3.5 h-3.5" />
            CANLI
          </div>
          <div className="text-2xl font-bold text-emerald-300" id="page-audit-ok">—</div>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-rose-300 text-xs mb-1">
            <Activity className="w-3.5 h-3.5" />
            HATA
          </div>
          <div className="text-2xl font-bold text-rose-300" id="page-audit-err">—</div>
        </div>
      </div>

      {/* ─── Analytics summary (server-rendered) ──────────── */}
      {analyticsStats && (
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-5 mb-3">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Analytics (30 gün)</h2>
            <span className="text-[10px] text-white/40">
              Backend /api/v2/analytics/stats
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <div className="text-white/50 text-[10px] uppercase">Toplam</div>
              <div className="text-xl font-bold text-white">
                {analyticsStats.total_views.toLocaleString("tr-TR")}
              </div>
            </div>
            <div>
              <div className="text-white/50 text-[10px] uppercase">Unique Path</div>
              <div className="text-xl font-bold text-cyan-300">
                {analyticsStats.unique_paths}
              </div>
            </div>
            <div>
              <div className="text-white/50 text-[10px] uppercase">Kategori</div>
              <div className="text-xl font-bold text-emerald-300">
                {analyticsStats.unique_categories}
              </div>
            </div>
            <div>
              <div className="text-white/50 text-[10px] uppercase">Daily Rows</div>
              <div className="text-xl font-bold text-amber-300">
                {analyticsStats.daily_rows}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Kategori breakdown (server-rendered) ─────────── */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-5 mb-3">
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            Kategori Bazlı (30 gün)
          </h2>
          <div className="space-y-1.5">
            {categoryBreakdown.map((cb) => {
              const max = categoryBreakdown[0]?.views || 1;
              const pct = Math.round((cb.views / max) * 100);
              return (
                <div key={cb.category} className="flex items-center gap-2">
                  <div className="w-24 text-xs text-white/70 truncate font-mono">
                    {cb.category}
                  </div>
                  <div className="flex-1 h-5 bg-white/5 rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-xs font-mono text-white/80">
                    {cb.views.toLocaleString("tr-TR")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Detay tablo (client component, periyodik kontrol) ─ */}
      <PageAuditTable initialPages={pages} viewCountMap={Object.fromEntries(viewCountMap)} />
    </div>
  );
}
