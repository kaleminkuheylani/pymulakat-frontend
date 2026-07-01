// app/coach/page.tsx
// Coach status dashboard — kullanıcının mail koç durumu.
// Bilgi amaçlı, puanlama yok. Kullanıcı ne mail alıyor / alabilir görür.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUser } from "../../hooks/useUser";

interface RuleInfo {
  rule: string;
  label: string;
  icon: string;
  description: string;
  status: "ready" | "not_triggered" | "rate_limited" | "error";
  note: string;
}

interface SkillProgress {
  topic: string;
  attempted: number;
  solved: number;
  failed: number;
  success_rate: number;
}

interface CoachStatus {
  user: {
    username: string;
    total_solved: number;
    total_attempted: number;
    streak_days: number;
    days_since_active: number;
  };
  coach: {
    enabled: boolean;
    from_email: string;
    total_mails_sent: number;
    last_mail: {
      rule: string;
      label: string;
      iso: string;
      days_ago: number;
      hours_ago: number;
      ago_text: string;
    } | null;
    frequency_cap_days: number;
    available_rules: RuleInfo[];
  };
  skills: SkillProgress[];
}

function StatusDot({ status }: { status: RuleInfo["status"] }) {
  const colors = {
    ready: "bg-emerald-400",
    not_triggered: "bg-white/20",
    rate_limited: "bg-amber-400",
    error: "bg-red-400",
  };
  const labels = {
    ready: "Hazır",
    not_triggered: "Beklemede",
    rate_limited: "Yakında tekrar",
    error: "Hata",
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold">
      <span className={`w-2 h-2 rounded-full ${colors[status]}`} />
      <span className="text-white/60">{labels[status]}</span>
    </span>
  );
}

export default function CoachPage() {
  const { user, loading } = useUser();
  const [status, setStatus] = useState<CoachStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login?returnUrl=/coach";
    }
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/coach-status/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sb-pymulakat-auth-token")?.match(/"access_token":"([^"]+)"/)?.[1] || ""}`,
      },
    })
      .then((r) => r.ok ? r.json() : Promise.reject(r))
      .then((data) => setStatus(data))
      .catch((e) => {
        console.error("coach status fetch failed", e);
        setError("Koç durumu yüklenemedi. Lütfen tekrar deneyin.");
      })
      .finally(() => setFetching(false));
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white/40 text-sm">
        Yükleniyor…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-amber-400 text-lg mb-2">⚠</div>
          <p className="text-white/70">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white/40 text-sm">
        Koç durumu yükleniyor…
      </div>
    );
  }

  const readyCount = status.coach.available_rules.filter((r) => r.status === "ready").length;
  const limitedCount = status.coach.available_rules.filter((r) => r.status === "rate_limited").length;

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile" className="text-white/40 hover:text-white text-sm mb-3 inline-block">
            ← Profil
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">📬</div>
            <h1 className="text-3xl font-bold">Mail Koçun</h1>
          </div>
          <p className="text-white/50 text-sm">
            Hangi kurallar tetiklenebilir, ne zaman mail gönderildi, hangi konularda ilerleme var —
            hepsi burada. Spam yok, sadece somut veriye dayalı öneriler.
          </p>
        </div>

        {/* User activity summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
        >
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="text-2xl font-bold text-amber-400">{status.user.total_solved}</div>
            <div className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Çözülen Soru</div>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="text-2xl font-bold text-indigo-400">{status.user.total_attempted}</div>
            <div className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Toplam Deneme</div>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="text-2xl font-bold text-orange-400">
              {status.user.streak_days > 0 ? `🔥 ${status.user.streak_days}` : "—"}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Streak</div>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="text-2xl font-bold text-white/70">
              {status.user.days_since_active < 999
                ? `${status.user.days_since_active}g`
                : "—"}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Son Aktif</div>
          </div>
        </motion.div>

        {/* Last mail + frequency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.05] to-transparent p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-indigo-300 mb-2">Son Gönderilen Mail</div>
              {status.coach.last_mail ? (
                <>
                  <div className="text-lg font-semibold text-white">
                    {status.coach.last_mail.label}
                  </div>
                  <div className="text-xs text-white/40 mt-1">{status.coach.last_mail.ago_text}</div>
                </>
              ) : (
                <div className="text-white/40 text-sm italic">Henüz mail gönderilmedi</div>
              )}
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-indigo-300 mb-2">Toplam</div>
              <div className="text-2xl font-bold text-white">{status.coach.total_mails_sent}</div>
              <div className="text-xs text-white/40 mt-1">son 30 günde</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-indigo-300 mb-2">Frequency Cap</div>
              <div className="text-2xl font-bold text-white">{status.coach.frequency_cap_days} gün</div>
              <div className="text-xs text-white/40 mt-1">aynı kural için</div>
            </div>
          </div>
        </motion.div>

        {/* Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Kurallar</h2>
            <div className="text-xs text-white/40">
              {readyCount} hazır · {limitedCount} rate-limited
            </div>
          </div>

          <div className="space-y-2">
            {status.coach.available_rules.map((rule, idx) => (
              <motion.div
                key={rule.rule}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * idx }}
                className={`p-4 rounded-xl border transition-colors ${
                  rule.status === "ready"
                    ? "border-emerald-500/30 bg-emerald-500/[0.04]"
                    : rule.status === "rate_limited"
                    ? "border-amber-500/20 bg-amber-500/[0.03]"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">{rule.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <div className="font-semibold text-white text-sm">{rule.label}</div>
                        <div className="text-xs text-white/50 mt-0.5">{rule.description}</div>
                      </div>
                      <StatusDot status={rule.status} />
                    </div>
                    <div className="text-[10px] text-white/30 mt-2 font-mono">{rule.rule}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skill progress */}
        {status.skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-4">Konu Bazlı İlerleme</h2>
            <div className="space-y-2">
              {status.skills.map((skill, idx) => (
                <motion.div
                  key={skill.topic}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className="p-3 rounded-xl border border-white/10 bg-white/[0.02]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-xs text-white/80 font-mono">{skill.topic}</code>
                    <div className="text-[10px] text-white/50">
                      {skill.solved}/{skill.attempted} başarılı · {skill.success_rate}%
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 transition-all"
                      style={{ width: `${skill.success_rate}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-[10px] text-white/30 mt-3 italic">
              Lint bu konu listesini arka planda doğrular — kullanıcıya gösterilmez.
            </div>
          </motion.div>
        )}

        {/* Footer note */}
        <div className="mt-10 p-4 rounded-xl border border-white/10 bg-white/[0.02] text-center">
          <p className="text-xs text-white/40">
            📬 Mail adresinden: <code className="text-white/60">{status.coach.from_email}</code>
          </p>
          <p className="text-xs text-white/30 mt-2">
            Spam göndermeyiz. Sadece somut veriye dayanan öneriler.{" "}
            <Link href="/settings" className="underline text-white/40 hover:text-white/60">
              Bildirim ayarları
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}