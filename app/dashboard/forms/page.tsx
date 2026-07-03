// app/dashboard/forms/page.tsx — Form listesi + yeni form oluşturma

"use client";

import { useState, useEffect } from "react";
import { useUser } from "../../../hooks/useUser";
import { useRouter } from "next/navigation";
import FormCategoryTabs from "../../../components/forms/FormCategoryTabs";
import FormCard from "../../../components/forms/FormCard";

export default function FormsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v2/forms${active ? `?category=${active}` : ""}`)
      .then((r) => r.json())
      .then((d) => setForms(d.data || []))
      .catch(() => setForms([]))
      .finally(() => setLoading(false));
  }, [active]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">💬 Topluluk</h1>
          <p className="text-white/60 text-sm">
            Geri bildirim, soru yardımı, kod yardımı, yazılım paylaşımı
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold rounded-lg transition-colors"
        >
          + Yeni Paylaşım
        </button>
      </div>

      <FormCategoryTabs active={active} onChange={setActive} />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : forms.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 text-center text-white/60">
          {active ? "Bu kategoride henüz paylaşım yok." : "Henüz paylaşım yok — ilk paylaşımı sen yap!"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {forms.map((f) => (
            <FormCard key={f.id} form={f} />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateFormModal
          defaultCategory={active || "feedback"}
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v2/forms${active ? `?category=${active}` : ""}`)
              .then((r) => r.json())
              .then((d) => setForms(d.data || []));
          }}
        />
      )}
    </div>
  );
}

function CreateFormModal({
  defaultCategory,
  onClose,
  onCreated,
}: {
  defaultCategory: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [category, setCategory] = useState(defaultCategory);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (title.length < 3 || body.length < 10) {
      setError("Başlık en az 3, içerik en az 10 karakter olmalı");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v2/forms`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, title, body }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Paylaşım oluşturulamadı");
      }
      onCreated();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-[#0a0e1a] border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Yeni Paylaşım</h2>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-white/60 mb-1 block">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="feedback">💬 Geri Bildirim</option>
              <option value="question_help">❓ Soru Yardımı</option>
              <option value="code_help">🐛 Kod Yardımı</option>
              <option value="share">🚀 Yazılım Paylaşımı</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1 block">Başlık</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder="Kısa, öz bir başlık..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1 block">İçerik</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={5000}
              rows={6}
              placeholder="Detayları yaz... Markdown desteklenir (yorumda değil)."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 resize-none"
            />
            <div className="text-xs text-white/30 text-right mt-1">{body.length}/5000</div>
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded p-2">{error}</div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm"
            >
              İptal
            </button>
            <button
              onClick={submit}
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-sm"
            >
              {submitting ? "Gönderiliyor..." : "Paylaş"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}