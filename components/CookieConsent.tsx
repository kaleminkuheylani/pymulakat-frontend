"use client";

import { Cookie } from "lucide-react";

// components/CookieConsent.tsx
// KVKK md. 5/1 + md. 7 uyumu: kullanıcıya çerez / yerel depolama kullanımı
// hakkında açık bilgilendirme + onay/ret seçeneği.
//
// NOT: Google Analytics (gtag) zaten anonymized IP kullanıyor.
// Bu banner sadece localStorage (auth token, tema tercihi) ve analytics için onay alır.

import { useEffect, useState } from "react";

const CONSENT_KEY = "pm-cookie-consent";

type Consent = "accepted" | "rejected" | null;

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored === "accepted" || stored === "rejected") {
        setConsent(stored);
        setVisible(false);
      } else {
        // İlk ziyaret → banner göster
        setVisible(true);
      }
    } catch {
      // localStorage yok (gizli mod)
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {}
    setConsent("accepted");
    setVisible(false);
  };

  const handleReject = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "rejected");
    } catch {}
    setConsent("rejected");
    setVisible(false);
    // Reddedildi → analytics kapat (gtag varsa devre dışı bırak)
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "denied",
      });
    }
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Çerez bildirimi"
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-md shadow-2xl shadow-black/50 p-4"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="text-2xl flex-shrink-0"><Cookie className="w-3.5 h-3.5 inline" /></div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white mb-1">Çerez ve Veri Bildirimi</h3>
          <p className="text-xs text-white/70 leading-relaxed">
            Sitemiz, oturum bilgileriniz (giriş yapabilmeniz için) ve anonim
            kullanım istatistikleri için çerez/yerel depolama kullanır.
            Yazdığınız kod tarayıcınızda çalışır, sunucuya gönderilmez.
            Detaylı bilgi için{" "}
            <a
              href="/privacy"
              className="text-indigo-300 hover:text-indigo-200 underline"
            >
              Gizlilik Politikası
            </a>
            'ni inceleyebilirsin.
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleReject}
          className="flex-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-colors"
        >
          Reddet
        </button>
        <button
          onClick={handleAccept}
          className="flex-1 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
        >
          Kabul Et
        </button>
      </div>
    </div>
  );
}