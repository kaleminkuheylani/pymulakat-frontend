"use client";

// app/admin/data-tools/DataToolsClient.tsx
// Bulk data işlemleri için buton paneli.
//
// MİMARİ:
// - Client component: fetch + loading + result state
// - apiFetch kullanır (lib/api/, inline fetch YASAK)
// - Her buton kendi loading state'inde (paralel risk yok)
// - Sonuç: JSON pretty-print (kısaltılmış)

import { useState } from "react";
import { Database, Upload, Trash2, RefreshCw, Sparkles, RotateCcw, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface ActionState {
  loading: boolean;
  result?: { ok: boolean; data?: unknown; message?: string };
}

export default function DataToolsClient() {
  const [actions, setActions] = useState<Record<string, ActionState>>({});

  const runAction = async (id: string, path: string, method: "GET" | "POST" = "POST", body?: unknown) => {
    setActions((p) => ({ ...p, [id]: { loading: true } }));
    try {
      const data = await apiFetch<unknown>(path, {
        method,
        body: body as Record<string, unknown> | undefined,
      });
      setActions((p) => ({ ...p, [id]: { loading: false, result: { ok: true, data } } }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Bilinmeyen hata";
      setActions((p) => ({ ...p, [id]: { loading: false, result: { ok: false, message: msg } } }));
    }
  };

  const renderResult = (id: string) => {
    const a = actions[id];
    if (!a || (!a.result && !a.loading)) return null;
    return (
      <div className="mt-3 p-3 bg-slate-950/50 border border-white/10 rounded-lg">
        {a.loading ? (
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Çalışıyor...
          </div>
        ) : a.result?.ok ? (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-300 text-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Başarılı
            </div>
            <pre className="text-[10px] text-white/60 font-mono overflow-x-auto max-h-32 overflow-y-auto">
              {JSON.stringify(a.result.data, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-rose-300 text-sm">
              <XCircle className="w-3.5 h-3.5" />
              Hata
            </div>
            <div className="text-xs text-rose-200/80">{a.result?.message}</div>
          </div>
        )}
      </div>
    );
  };

  const Action = ({
    id,
    title,
    description,
    icon: Icon,
    color,
    path,
    method = "POST",
    body,
    confirm,
  }: {
    id: string;
    title: string;
    description: string;
    icon: typeof Database;
    color: string;
    path: string;
    method?: "GET" | "POST";
    body?: unknown;
    confirm?: string;
  }) => (
    <div className="bg-slate-900/50 border border-white/10 rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
          <p className="text-xs text-white/60 leading-relaxed mb-3">{description}</p>
          <button
            type="button"
            onClick={() => {
              if (confirm && !window.confirm(confirm)) return;
              runAction(id, path, method, body);
            }}
            disabled={actions[id]?.loading}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${color.replace("/10", "/20").replace("/30", "/30")} hover:brightness-110`}
          >
            {actions[id]?.loading ? "Çalışıyor..." : "Çalıştır"}
          </button>
        </div>
      </div>
      {renderResult(id)}
    </div>
  );

  return (
    <div className="space-y-4">
      <Action
        id="bulk-seed"
        title="CSV → DB Bulk Seed"
        description="Tüm soruları CSV'den DB'ye yaz. update/insert split, JSONB-safe."
        icon={Upload}
        color="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300"
        path="/api/v2/admin/bulk-seed-questions"
      />
      <Action
        id="delete-pending"
        title="Pending Soruları Sil"
        description="audit_status = 'pending' olan tüm sorular DB'den silinir."
        icon={Trash2}
        color="bg-rose-500/10 border border-rose-500/30 text-rose-300"
        path="/api/v2/admin/delete-pending-questions"
        confirm="Tüm pending soruları silinecek. Emin misin?"
      />
      <Action
        id="invalidate-cache"
        title="Cache Invalidate"
        description="Tüm server cache temizlenir. Yeni build gerekmez, soft reload."
        icon={RefreshCw}
        color="bg-amber-500/10 border border-amber-500/30 text-amber-300"
        path="/api/v2/admin/invalidate-cache"
      />
      <Action
        id="generate-questions"
        title="Mavis API → Yeni Soru Üret"
        description="Mavis API ile yeni mülakat sorusu üret. Maliyetli — dikkatli kullan."
        icon={Sparkles}
        color="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300"
        path="/api/v2/admin/generate-questions"
        confirm="Mavis API çağrısı maliyetli. Devam edilsin mi?"
      />
      <Action
        id="reset-audit"
        title="Audit Sıfırla (Tümü)"
        description="Tüm soruların audit_status = 'pending' yapılır. Tekrar denetim gerekir."
        icon={RotateCcw}
        color="bg-rose-500/10 border border-rose-500/30 text-rose-300"
        path="/api/v2/admin/reset-audit"
        confirm="Tüm audit_status sıfırlanacak. Emin misin?"
      />
    </div>
  );
}
