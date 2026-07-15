"use client";

// app/admin/login/LoginClient.tsx
// 2026-07-15: Email + password (env-based) → magic link (Resend).
//
// Akis:
//   1. Email + password gir
//   2. POST /api/v2/admin/auth/magic-link { email, password }
//   3. Backend dogrulama: ADMIN_EMAIL + ADMIN_PASSWORD (Railway env)
//   4. Basarili: Resend ile magic link gonderilir
//   5. Kullanici email'deki linke tiklar
//   6. /admin/auth/verify?token=... sayfasi cookie set eder
//   7. /admin'e redirect

import { useState } from "react";
import {
  Mail,
  KeyRound,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface MagicLinkResponse {
  ok: boolean;
  sent: boolean;
  dev_link?: string;
}

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDevLink(null);
    setSuccess(false);
    setLoading(true);
    try {
      const data = await apiFetch<MagicLinkResponse>("/api/v2/admin/auth/magic-link", {
        method: "POST",
        body: { email, password },
        headers: { Accept: "application/json" },
      });
      setSuccess(true);
      if (data.dev_link) {
        setDevLink(data.dev_link);
      }
    } catch (err: any) {
      setError(err?.message || "Bir hata olustu, tekrar deneyin");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mb-3">
              <CheckCircle className="w-7 h-7 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Giris Linki Gonderildi</h1>
            <p className="text-white/50 text-sm">PythonMulakat — admin giris linki</p>
          </div>
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6 space-y-4">
            <p className="text-sm text-white/70">
              <strong className="text-amber-300">{email}</strong> adresine admin giris linki gonderildi. Link 15 dakika gecerlidir.
            </p>
            <p className="text-xs text-white/40">
              Email gelmediyse spam klasorunu kontrol edin. Birden fazla istek lockout&apos;a neden olabilir.
            </p>
            {devLink && (
              <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p className="text-xs text-amber-300 font-semibold mb-1">DEV MODE</p>
                <a href={devLink} className="text-xs text-amber-200 underline break-all">
                  {devLink}
                </a>
              </div>
            )}
            <button
              onClick={() => {
                setSuccess(false);
                setEmail("");
                setPassword("");
              }}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
            >
              Farkli email ile dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-3">
            <ShieldCheck className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Admin Panel Giris</h1>
          <p className="text-white/50 text-sm">PythonMulakat — email + sifre dogrulama, sonra magic link</p>
        </div>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-rose-200">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-white/10 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-1.5 font-semibold">
              <Mail className="w-3 h-3 inline mr-1" />
              Admin Email
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
              Sifre
              <span className="ml-2 text-[10px] text-white/30 normal-case font-normal">
                (Railway env&apos;deki ADMIN_PASSWORD)
              </span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
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
                Giris Linki Gonder
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
        <p className="text-center text-[10px] text-white/30 mt-6">
          <ShieldCheck className="w-3 h-3 inline mr-1" />
          Magic link · Email sifre dogrulama · 8 saatlik session
        </p>
      </div>
    </div>
  );
}
