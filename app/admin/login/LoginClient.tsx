"use client";

// app/admin/login/LoginClient.tsx
// 2-aşamalı login UI: email+password → mfa_token → TOTP → session.
//
// MİMARİ:
// - Stage 1: email + password form
// - Stage 2: 6-haneli TOTP form (mfa_token gerekli)
// - Stage 3: MFA setup (ilk kez login, TOTP secret + QR)
// - Her stage kendi state'inde, geri-ileri butonları

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  KeyRound,
  Smartphone,
  Copy,
  Check,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type Stage = "password" | "mfa" | "setup" | "enabled";

interface LoginResponse {
  mfa_required?: boolean;
  mfa_token?: string;
  authenticated?: boolean;
  mfa_setup_required?: boolean;
  user?: { id: string; email: string; role: string };
}

interface SetupResponse {
  secret: string;
  qr_png_base64: string;
  otpauth_url: string;
  backup_codes: string[];
}

export default function LoginClient() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaToken, setMfaToken] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [enableCode, setEnableCode] = useState("");
  const [setup, setSetup] = useState<SetupResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (stage === "mfa" || stage === "setup") {
      codeInputRef.current?.focus();
    }
  }, [stage]);

  // Stage 1: password
  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiFetch<LoginResponse>("/api/v2/admin/auth/login", {
        method: "POST",
        body: { email, password },
        // credentials dahil et (cookie set)
        headers: { Accept: "application/json" },
      });
      if (data.mfa_required && data.mfa_token) {
        setMfaToken(data.mfa_token);
        setStage("mfa");
      } else if (data.authenticated) {
        // MFA yok — direkt session
        if (data.mfa_setup_required) {
          // MFA setup yapmamız gerek
          await loadSetup();
        } else {
          router.push("/admin");
          router.refresh();
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Bilinmeyen hata";
      setError(parseError(msg));
    } finally {
      setLoading(false);
    }
  };

  // Stage 2: MFA verify
  const handleMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiFetch<LoginResponse>("/api/v2/admin/auth/verify-mfa", {
        method: "POST",
        body: { mfa_token: mfaToken, totp_code: totpCode },
      });
      if (data.authenticated) {
        router.push("/admin");
        router.refresh();
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Bilinmeyen hata";
      setError(parseError(msg));
    } finally {
      setLoading(false);
    }
  };

  // Stage 3: MFA setup
  const loadSetup = async () => {
    setError(null);
    try {
      const data = await apiFetch<SetupResponse>("/api/v2/admin/auth/setup-mfa", {
        method: "POST",
      });
      setSetup(data);
      setStage("setup");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Bilinmeyen hata";
      setError(parseError(msg));
    }
  };

  const handleEnableMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiFetch("/api/v2/admin/auth/enable-mfa", {
        method: "POST",
        body: { totp_code: enableCode },
      });
      setStage("enabled");
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1500);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Bilinmeyen hata";
      setError(parseError(msg));
    } finally {
      setLoading(false);
    }
  };

  const parseError = (msg: string): string => {
    if (msg.includes("401")) return "Geçersiz email veya şifre";
    if (msg.includes("429")) return "Çok fazla deneme. 15dk sonra tekrar deneyin.";
    if (msg.includes("403")) return "Bu IP'den admin erişimi yok";
    if (msg.includes("Network")) return "Backend bağlantısı başarısız";
    return msg;
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* ─── Header ───────────────────────────────────── */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-3">
            <ShieldCheck className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Admin Panel Giriş</h1>
          <p className="text-white/50 text-sm">PythonMulakat — 2FA korumalı admin</p>
        </div>

        {/* ─── Error ─────────────────────────────────────── */}
        {error && (
          <div className="mb-4 bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-rose-200">{error}</div>
          </div>
        )}

        {/* ─── Stage 1: Password ─────────────────────────── */}
        {stage === "password" && (
          <form onSubmit={handlePassword} className="bg-slate-900/50 border border-white/10 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-xs text-white/50 uppercase tracking-wider mb-1.5 font-semibold">
                <KeyRound className="w-3 h-3 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@pythonmulakat.com"
                className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-white/10 text-sm text-white placeholder:text-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 uppercase tracking-wider mb-1.5 font-semibold">
                <KeyRound className="w-3 h-3 inline mr-1" />
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-white/10 text-sm text-white focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Devam
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ─── Stage 2: MFA ───────────────────────────────── */}
        {stage === "mfa" && (
          <form onSubmit={handleMfa} className="bg-slate-900/50 border border-white/10 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-xs text-white/50 uppercase tracking-wider mb-1.5 font-semibold">
                <Smartphone className="w-3 h-3 inline mr-1" />
                TOTP Kodu
              </label>
              <input
                ref={codeInputRef}
                type="text"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                autoComplete="one-time-code"
                inputMode="numeric"
                placeholder="123456"
                maxLength={6}
                className="w-full px-3 py-3 rounded-lg bg-slate-950 border border-white/10 text-center text-2xl font-mono tracking-widest text-white focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              <p className="text-[10px] text-white/40 mt-1.5">
                Authenticator app&apos;inizdaki 6 haneli kodu girin.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStage("password");
                  setTotpCode("");
                  setError(null);
                }}
                className="px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={loading || totpCode.length !== 6}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Doğrula ve Giriş Yap"
                )}
              </button>
            </div>
          </form>
        )}

        {/* ─── Stage 3: MFA Setup ─────────────────────────── */}
        {stage === "setup" && setup && (
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6 space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-bold text-white mb-1">MFA Kurulumu</h2>
              <p className="text-xs text-white/50">
                Authenticator app&apos;inize (Google Authenticator, Authy, 1Password) QR kodu tarayın.
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center bg-white p-4 rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/png;base64,${setup.qr_png_base64}`}
                alt="TOTP QR Code"
                className="w-48 h-48"
              />
            </div>

            {/* Secret (manuel giris icin) */}
            <div className="space-y-1.5">
              <label className="block text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                Manuel Key
              </label>
              <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-lg p-2">
                <code className="flex-1 text-xs font-mono text-cyan-300 break-all">
                  {setup.secret}
                </code>
                <button
                  type="button"
                  onClick={() => copy(setup.secret)}
                  className="p-1.5 rounded text-white/40 hover:text-white"
                  aria-label="Kopyala"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Backup codes */}
            {setup.backup_codes && setup.backup_codes.length > 0 && (
              <details className="text-xs">
                <summary className="text-white/40 cursor-pointer hover:text-white/70">
                  Yedek kodlar ({setup.backup_codes.length})
                </summary>
                <div className="mt-2 grid grid-cols-2 gap-1.5 font-mono text-cyan-300/80">
                  {setup.backup_codes.map((c, i) => (
                    <div key={i} className="bg-slate-950 border border-white/10 rounded px-2 py-1 text-center">
                      {c}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-white/30 mt-2">
                  Bu kodları güvenli bir yere kaydedin. Her biri tek kullanımlık.
                </p>
              </details>
            )}

            {/* Verify code (enable) */}
            <form onSubmit={handleEnableMfa} className="space-y-3 pt-2 border-t border-white/5">
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-wider mb-1.5 font-semibold">
                  Uygulamadaki 6 haneli kodu girin (MFA aktifleştirmek için)
                </label>
                <input
                  ref={codeInputRef}
                  type="text"
                  value={enableCode}
                  onChange={(e) => setEnableCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-white/10 text-center text-xl font-mono tracking-widest text-white focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
              <button
                type="submit"
                disabled={loading || enableCode.length !== 6}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Aktifleştir ve Giriş"}
              </button>
            </form>
          </div>
        )}

        {/* ─── Stage 4: Enabled ───────────────────────────── */}
        {stage === "enabled" && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
            <Check className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h2 className="text-lg font-bold text-emerald-300 mb-1">MFA Aktifleştirildi</h2>
            <p className="text-sm text-white/60">Admin paneline yönlendiriliyorsunuz...</p>
          </div>
        )}

        <p className="text-center text-[10px] text-white/30 mt-6">
          <ShieldCheck className="w-3 h-3 inline mr-1" />
          Tüm giriş denemeleri audit log&apos;a kaydedilir.
        </p>
      </div>
    </div>
  );
}
