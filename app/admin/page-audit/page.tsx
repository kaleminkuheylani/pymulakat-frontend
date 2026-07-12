// app/admin/page-audit/page.tsx
// Page Audit widget — 9 pillar + detay sayfaların SEO, hız, ISR durumu.
//
// MİMARİ:
// - Server component: sayfa listesini statik bilgi ile oluştur
// - Client component: canlı fetch + check
// - 9 pillar + örnek detay sayfaları (her kategori 1 örnek)
// - Kontrol: HTTP status, response time, cache hit, ISR expire
//
// MİMARİ KURAL (KESİN):
// - Inline fetch YASAK: lib/api/ üzerinden
// - Server component'te initial fetch, client effect'te refresh
// - KVKK: kullanıcı verisi YOK, sadece public sayfa metrikleri

import { listCategories } from "@/lib/api/questionAPI";
import { CATEGORY_DISPLAY_URL, CATEGORY_LABEL } from "@/lib/categorySlug";
import { FileText, Search, Activity } from "lucide-react";
import PageAuditTable from "./PageAuditTable";

export const dynamic = "force-dynamic";

interface PageInfo {
  url: string;
  title: string;
  type: "pillar" | "detail" | "system";
}

export default async function PageAuditPage() {
  // 9 pillar + her kategoriden 1 örnek detay sayfa
  const categories = await listCategories();

  const pages: PageInfo[] = [
    { url: "/", title: "Ana Sayfa", type: "system" },
    { url: "/interviews", title: "Tüm Kategoriler", type: "system" },
    { url: "/about", title: "Hakkımızda", type: "system" },
    { url: "/python-egitimi", title: "Python Eğitimi", type: "system" },
    ...categories.map((c) => ({
      // lib/categorySlug.ts tek truth of source
      url: CATEGORY_DISPLAY_URL[c.category] || `/${c.category}`,
      title: CATEGORY_LABEL[c.category] || c.label || c.category,
      type: "pillar" as const,
    })),
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-2">
          <FileText className="w-4 h-4" />
          Page Audit
        </div>
        <h1 className="text-2xl font-bold mb-2">Sayfa Denetimi</h1>
        <p className="text-white/60 text-sm">
          Tüm public sayfaların HTTP durumu, yanıt süresi, ISR cache durumu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-900/50 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 text-cyan-300 text-xs mb-1">
            <Search className="w-3.5 h-3.5" />
            TOPLAM
          </div>
          <div className="text-2xl font-bold text-white">{pages.length}</div>
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

      <PageAuditTable initialPages={pages} />
    </div>
  );
}
