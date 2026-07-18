// components/OnboardingSurvey.tsx
//
// 2026-07-18: Ilk giris sonrasi kullanici memnuniyet anketi.
// 3 soru: Bizi nereden buldunuz? / Nasil buldunuz? / Yas araligi
// "Atla" veya "Gonder" basarsa dismissed = true olur, tekrar gosterilmez.
//
// Kullanim: Dashboard layout'a <OnboardingSurvey userId={user.id} />
//           Modal overlay olarak, localStorage + DB kontrolu.

"use client";

import { useEffect, useState, useCallback } from "react";
import { Sparkles, X, ChevronRight, ChevronLeft, Check } from "lucide-react";

interface Props {
  userId: string;
  totalAttempts?: number; // Dashboard'dan gelen toplam cozulen soru sayisi
}

// ─── Secenekler ─────────────────────────────────────────

const SOURCES = [
  { value: "google", label: "Google araması" },
  { value: "reddit", label: "Reddit" },
  { value: "youtube", label: "YouTube" },
  { value: "x_twitter", label: "X (Twitter)" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "friend", label: "Arkadaş önerisi" },
  { value: "other", label: "Diğer" },
] as const;

const RATINGS = [
  { value: "great", label: "Çok güzel", icon: "🔥", color: "emerald" },
  { value: "good", label: "Yeterli", icon: "👍", color: "amber" },
  { value: "questions_weak", label: "Sorular yetersiz", icon: "📉", color: "rose" },
  { value: "platform_useless", label: "Platform amaçsız duruyor", icon: "🤔", color: "rose" },
  {
    value: "learning_insufficient",
    label: "Programlama öğrenmek için yetersiz",
    icon: "📚",
    color: "rose",
  },
] as const;

const AGE_RANGES = [
  { value: "15_18", label: "15-18" },
  { value: "18_25", label: "18-25" },
  { value: "25_35", label: "25-35" },
  { value: "35_plus", label: "35+" },
] as const;

const STORAGE_KEY = (uid: string) => `pm_survey_dismissed_${uid}`;

const FIRST_VISIT_KEY = "pm_dashboard_first_visit";
const SHOW_DELAY_MS = 15 * 60 * 1000; // 15 dakika
const MIN_ATTEMPTS = 2; // 2 soru cozuldukten sonra

export default function OnboardingSurvey({ userId, totalAttempts = 0 }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0); // 0, 1, 2

  // Ilk dashboard ziyareti timestamp (15dk kural icin)
  if (typeof window !== "undefined" && !localStorage.getItem(FIRST_VISIT_KEY)) {
    localStorage.setItem(FIRST_VISIT_KEY, String(Date.now()));
  }

  // Cevaplar
  const [source, setSource] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [ageRange, setAgeRange] = useState<string>("");

  // ── 1) Mount: dismissed mi kontrol et (localStorage + backend) ──
  useEffect(() => {
    if (!userId) return;

    // Once localStorage
    const lsDismissed = localStorage.getItem(STORAGE_KEY(userId));
    if (lsDismissed) {
      console.log("[OnboardingSurvey] localStorage dismissed — skip");
      setOpen(false);
      return;
    }

    // Zamanlama kontrolu: 15dk gectiyse VEYA 2+ soru cozulmusse goster
    const firstVisitStr = localStorage.getItem(FIRST_VISIT_KEY);
    const firstVisit = firstVisitStr ? Number(firstVisitStr) : Date.now();
    const elapsed = Date.now() - firstVisit;
    const enoughTime = elapsed >= SHOW_DELAY_MS;
    const enoughAttempts = totalAttempts >= MIN_ATTEMPTS;
    console.log(`[OnboardingSurvey] elapsed: ${Math.round(elapsed/1000)}s, attempts: ${totalAttempts}`);
    if (!enoughTime && !enoughAttempts) {
      console.log("[OnboardingSurvey] henuz erken (15dk VEYA 2+ soru bekleniyor)");
      setOpen(false);
      return;
    }

    // Graceful: Sadece kesin dismissed:true ise gizle.
    console.log("[OnboardingSurvey] kosul saglandi, backend kontrolu...");
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("https://pymulakat-backend-production.up.railway.app/api/v2/survey/status", {
          credentials: "include",
        });
        console.log("[OnboardingSurvey] status response:", res.status);
        if (res.status === 200) {
          const data = await res.json();
          console.log("[OnboardingSurvey] data:", data);
          if (data.dismissed === true) {
            localStorage.setItem(STORAGE_KEY(userId), "1");
            setOpen(false);
            return;
          }
        }
        setTimeout(() => setOpen(true), 1500);
      } catch (e) {
        console.log("[OnboardingSurvey] fetch error, fallback show:", e);
        setTimeout(() => setOpen(true), 1500);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, totalAttempts]);

  // ── 2) Submit: Gonder veya Atla ──────────────────────────
  const submit = useCallback(
    async (dismissed: boolean) => {
      setSubmitting(true);
      try {
        const res = await fetch("https://pymulakat-backend-production.up.railway.app/api/v2/survey", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: source || "skip",
            rating: rating || "skip",
            age_range: ageRange || "skip",
            dismissed: true,
          }),
        });
        if (!res.ok) {
          const errText = await res.text();
          console.error(`[OnboardingSurvey] POST basarisiz (status ${res.status}):`, errText);
        } else {
          console.log("[OnboardingSurvey] POST basarili, DB\'ye kaydedildi");
        }
      } catch (e) {
        console.error("[OnboardingSurvey] POST network/network error:", e);
      } finally {
        // Lokal: her durumda dismissed isaretle (kullaniciyi rahatsiz etme)
        localStorage.setItem(STORAGE_KEY(userId), "1");
        setOpen(false);
        setSubmitting(false);
      }
    },
    [userId, source, rating, ageRange]
  );

  // ── ESC ile kapatma ─────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") submit(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, submit]);

  if (loading || !open) return null;

  const totalSteps = 3;
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="survey-title"
    >
      <div className="relative w-full max-w-lg bg-[#0a0e1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <h2
              id="survey-title"
              className="text-sm font-semibold text-white/80"
            >
              Kısa bir anket (30 sn)
            </h2>
          </div>
          <button
            type="button"
            onClick={() => submit(false)}
            disabled={submitting}
            className="text-white/40 hover:text-white/80 transition-colors disabled:opacity-50"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Body */}
        <div className="p-6 min-h-[280px]">
          {step === 0 && (
            <Step
              title="Bizi nereden buldunuz?"
              subtitle="Tek tıkla seç (opsiyonel)"
            >
              <div className="grid grid-cols-2 gap-2">
                {SOURCES.map((s) => (
                  <Option
                    key={s.value}
                    selected={source === s.value}
                    onClick={() => setSource(s.value)}
                    label={s.label}
                  />
                ))}
              </div>
            </Step>
          )}

          {step === 1 && (
            <Step
              title="Nasıl buldunuz?"
              subtitle="Dürüst geri bildirimin bize çok değerli"
            >
              <div className="space-y-2">
                {RATINGS.map((r) => (
                  <RatingOption
                    key={r.value}
                    selected={rating === r.value}
                    onClick={() => setRating(r.value)}
                    label={r.label}
                    icon={r.icon}
                    color={r.color}
                  />
                ))}
              </div>
            </Step>
          )}

          {step === 2 && (
            <Step
              title="Yaş aralığınız?"
              subtitle="Anonim — sadece istatistik için"
            >
              <div className="grid grid-cols-2 gap-2">
                {AGE_RANGES.map((a) => (
                  <Option
                    key={a.value}
                    selected={ageRange === a.value}
                    onClick={() => setAgeRange(a.value)}
                    label={a.label}
                  />
                ))}
              </div>
            </Step>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 p-4 border-t border-white/5 bg-white/[0.02]">
          <button
            type="button"
            onClick={() => submit(false)}
            disabled={submitting}
            className="text-xs text-white/40 hover:text-white/70 transition-colors disabled:opacity-50"
          >
            Atla
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                disabled={submitting}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-white/10 text-white/70 hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="w-3 h-3" />
                Geri
              </button>
            )}
            {step < totalSteps - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={submitting}
                className="inline-flex items-center gap-1 px-4 py-1.5 text-xs rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold transition-colors disabled:opacity-50"
              >
                İleri
                <ChevronRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => submit(true)}
                disabled={submitting}
                className="inline-flex items-center gap-1 px-4 py-1.5 text-xs rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold transition-colors disabled:opacity-50"
              >
                <Check className="w-3 h-3" />
                {submitting ? "Gönderiliyor..." : "Gönder"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────

function Step({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      {subtitle && (
        <p className="text-xs text-white/50 mb-4">{subtitle}</p>
      )}
      {children}
    </div>
  );
}

function Option({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-3 text-sm text-left rounded-lg border transition-all ${
        selected
          ? "bg-amber-500/15 border-amber-500/50 text-amber-200"
          : "bg-white/[0.02] border-white/10 text-white/70 hover:bg-white/5 hover:border-white/20"
      }`}
    >
      {label}
    </button>
  );
}

function RatingOption({
  selected,
  onClick,
  label,
  icon,
  color,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  icon: string;
  color: "emerald" | "amber" | "rose";
}) {
  const colorClasses = {
    emerald: "border-emerald-500/30 text-emerald-200",
    amber: "border-amber-500/30 text-amber-200",
    rose: "border-rose-500/30 text-rose-200",
  } as const;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full p-3 text-sm text-left rounded-lg border flex items-center gap-3 transition-all ${
        selected
          ? `bg-white/10 ${colorClasses[color]} ring-1 ring-amber-500/50`
          : `bg-white/[0.02] border-white/10 text-white/70 hover:bg-white/5`
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
