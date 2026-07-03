// components/forms/FormCard.tsx

"use client";

import Link from "next/link";

interface Form {
  id: number;
  title: string;
  body: string;
  category: string;
  tags: string[];
  created_at: string;
  user_id: string;
  replies?: Array<{ count: number }>;
}

const CATEGORY_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  feedback: { label: "Geri Bildirim", icon: "💬", color: "amber" },
  question_help: { label: "Soru Yardımı", icon: "❓", color: "indigo" },
  code_help: { label: "Kod Yardımı", icon: "🐛", color: "rose" },
  share: { label: "Yazılım Paylaşımı", icon: "🚀", color: "emerald" },
};

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}dk önce`;
  if (hours < 24) return `${saat(hours)} önce`;
  return `${days}g önce`;
}
function saat(h: number) { return `${h}saat`; }

export default function FormCard({ form }: { form: Form }) {
  const cat = CATEGORY_LABELS[form.category] || CATEGORY_LABELS.feedback;
  const replyCount = form.replies?.[0]?.count || 0;

  return (
    <Link
      href={`/dashboard/forms/${form.id}`}
      className="block bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:border-white/20 hover:bg-white/[0.05] transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{cat.icon}</span>
          <span className="text-xs text-white/40 uppercase tracking-wide">{cat.label}</span>
        </div>
        <span className="text-xs text-white/30">{timeAgo(form.created_at)}</span>
      </div>

      <h3 className="text-white font-semibold mb-2 line-clamp-1">{form.title}</h3>
      <p className="text-white/60 text-sm line-clamp-2 mb-3">{form.body}</p>

      <div className="flex items-center justify-between text-xs text-white/40">
        <div className="flex flex-wrap gap-1">
          {(form.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-white/5 rounded">
              #{tag}
            </span>
          ))}
        </div>
        {replyCount > 0 && (
          <span>💬 {replyCount}</span>
        )}
      </div>
    </Link>
  );
}