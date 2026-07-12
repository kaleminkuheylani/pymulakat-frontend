// app/dashboard/forms/[id]/page.tsx — Form detay + yanıtlar

"use client";

import { useState, useEffect } from "react";
import { useUser } from "../../../../hooks/useUser";
import { useRouter } from "next/navigation";
import { getForm, submitReply } from "../../../../lib/api/formAPI";

export default function FormDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useUser();
  const router = useRouter();
  const [formId, setFormId] = useState<number | null>(null);
  const [form, setForm] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setFormId(parseInt(p.id, 10)));
  }, [params]);

  useEffect(() => {
    if (formId === null) return;
    setLoading(true);
    getForm(formId)
      .then((d) => setForm(d as any))
      .catch(() => setForm(null))
      .finally(() => setLoading(false));
  }, [formId]);

  async function submitReplyHandler() {
    if (!form || replyText.length < 2) return;
    setSubmitting(true);
    try {
      // formAPI.submitReply — typed + auth header otomatik
      await submitReply(form.id, { body: replyText });
      const refreshed = await getForm(form.id);
      setForm(refreshed as any);
      setReplyText("");
    } catch {
      // yoksay
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!form) {
    return <div className="text-white/60">Paylaşım bulunamadı.</div>;
  }

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="text-sm text-white/60 hover:text-white">
        ← Geri
      </button>

      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
        <div className="flex items-center gap-3 text-xs text-white/40 mb-4">
          {form.category}
          •
          {new Date(form.created_at).toLocaleString("tr-TR")}
        </div>
        <div className="text-white/80 whitespace-pre-wrap">{form.body}</div>
        {form.tags?.length > 0 && (
          <div className="flex gap-1 mt-4">
            {form.tags.map((tag: string) => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-white/5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          Yanıtlar ({form.replies?.length || 0})
        </h2>

        {(form.replies || []).map((reply: any) => (
          <div key={reply.id} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 ml-6">
            <div className="text-xs text-white/40 mb-2">
              {new Date(reply.created_at).toLocaleString("tr-TR")}
            </div>
            <div className="text-white/80 whitespace-pre-wrap">{reply.body}</div>
          </div>
        ))}

        {user && (
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              maxLength={2000}
              rows={3}
              placeholder="Yanıtını yaz..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-white/30">{replyText.length}/2000</span>
              <button
                onClick={submitReplyHandler}
                disabled={submitting || replyText.length < 2}
                className="px-4 py-1.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white text-sm font-bold rounded-lg"
              >
                {submitting ? "Gönderiliyor..." : "Yanıtla"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}