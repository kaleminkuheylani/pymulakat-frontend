// components/dashboard/OnboardingGate.tsx
// İlk giriş algılama — kullanıcının onboarded_at yoksa wizard göster.
// localStorage + user.id hash'li key, yanlış user'da false dönmez.

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  children: React.ReactNode;
}

const STORAGE_KEY = (uid: string) => `pm_onboarded_${uid}`;

const STEPS = [
  {
    icon: "👋",
    title: "Hoş geldin!",
    body: "Senin için kişiselleştirilmiş bir Python mülakat yolculuğu hazırladık. Önce 3 kısa soru ile seni tanıyalım.",
  },
  {
    icon: "🎯",
    title: "İlgi Alanların",
    body: "Hangi konularda pratik yapmak istiyorsun? Birden fazla seçebilirsin — sonra istediğin zaman değiştirebilirsin.",
  },
  {
    icon: "🌊",
    title: "Kişiselleştirilmiş Akışın Hazır",
    body: "Seviyene ve ilgilerine göre sıralı sorular, rehberler ve topluluk paylaşımları — hepsi Dashboard'da senin için.",
  },
];

const INTERESTS = [
  { slug: "python-basics", label: "Python Temelleri", icon: "🐍" },
  { slug: "strings", label: "String İşlemleri", icon: "🔤" },
  { slug: "list-dict", label: "Liste & Sözlük", icon: "📋" },
  { slug: "pandas", label: "Pandas", icon: "🐼" },
  { slug: "algorithms", label: "Algoritmalar", icon: "🧮" },
];

export default function OnboardingGate({ userId, children }: Props) {
  const [mounted, setMounted] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const done = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY(userId));
    if (!done) {
      setShowWizard(true);
    }
  }, [userId]);

  function complete(interests: string[]) {
    localStorage.setItem(
      STORAGE_KEY(userId),
      JSON.stringify({ at: Date.now(), interests })
    );
    setShowWizard(false);
  }

  function skip() {
    complete([]);
  }

  if (!mounted) return <>{children}</>;
  if (!showWizard) return <>{children}</>;

  const currentStep = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 bg-[#050816]/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0a0e1a] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full">
        {/* Progress */}
        <div className="flex gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-colors ${
                i <= step ? "bg-indigo-500" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Icon + Content */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{currentStep.icon}</div>
          <h2 className="text-2xl font-bold mb-2">{currentStep.title}</h2>
          <p className="text-white/60 text-sm leading-relaxed">{currentStep.body}</p>
        </div>

        {/* Step 1: interests */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-2 mb-6">
            {INTERESTS.map((i) => {
              const sel = selectedInterests.includes(i.slug);
              return (
                <button
                  key={i.slug}
                  onClick={() => {
                    setSelectedInterests((prev) =>
                      sel ? prev.filter((x) => x !== i.slug) : [...prev, i.slug]
                    );
                  }}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-colors text-left ${
                    sel
                      ? "bg-indigo-500/20 border-indigo-500 text-white"
                      : "bg-white/5 border-white/10 text-white/70 hover:border-white/20"
                  }`}
                >
                  <span className="text-lg">{i.icon}</span>
                  <span className="text-xs font-medium">{i.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: CTA preview */}
        {step === 2 && (
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 mb-6 text-left">
            <div className="text-xs text-white/60 mb-2">📊 Önerilerin:</div>
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-center gap-2">
                <span>🌊</span>
                <span>Akışım — sıralı sorular + rehberler</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✨</span>
                <span>Öneriler — senin seviyene uygun</span>
              </li>
              <li className="flex items-center gap-2">
                <span>💬</span>
                <span>Topluluk — soru sor, paylaş</span>
              </li>
            </ul>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors"
            >
              Geri
            </button>
          )}
          {step === 0 && (
            <button
              onClick={skip}
              className="px-4 py-2.5 text-white/40 hover:text-white/60 text-sm transition-colors"
            >
              Atla
            </button>
          )}
          <button
            onClick={() => {
              if (step < STEPS.length - 1) setStep((s) => s + 1);
              else complete(selectedInterests);
            }}
            disabled={step === 1 && selectedInterests.length === 0}
            className="flex-1 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-lg text-sm transition-colors"
          >
            {step < STEPS.length - 1 ? "Devam →" : "Başlayalım 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}