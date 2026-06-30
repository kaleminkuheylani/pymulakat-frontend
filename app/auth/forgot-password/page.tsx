"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface MessageResponse {
  ok: boolean;
  message?: string;
  expires_in_minutes?: number;
}

interface ForgotStep1 {
  email: string;
  username: string;
}

function extractErrorMessage(data: any, fallback: string): string {
  if (typeof data?.detail === "string") return data.detail;
  if (Array.isArray(data?.detail)) {
    return data.detail
      .map((err: any) => {
        const field = (err.loc || []).join(".");
        return field ? `${field}: ${err.msg}` : err.msg;
      })
      .join(" | ");
  }
  if (typeof data?.message === "string") return data.message;
  return fallback;
}

const authAPI = {
  async verifyUsername(payload: ForgotStep1): Promise<MessageResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password/verify-username`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(extractErrorMessage(data, `Doğrulama başarısız: ${res.status}`));
    }
    return data;
  },

  async resetPassword(payload: { email: string; code: number; new_password: string }): Promise<MessageResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(extractErrorMessage(data, `Şifre sıfırlanamadı: ${res.status}`));
    }
    return data;
  },
};

// ─── Grid + Navbar ─────────────────────────────────────────
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.08) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
    </div>
  );
}

function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-white/5 backdrop-blur-md bg-[#050816]/80"
    >
      <Link href="/" className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-amber-400 flex items-center justify-center">
          <span className="text-white font-bold text-xs">PM</span>
        </div>
        <span className="text-white font-bold text-lg">PythonMulakat</span>
      </Link>
      <Link href="/login" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
        Giriş Yap
      </Link>
    </motion.nav>
  );
}

function ForgotPasswordInner() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: username doğrula, 2: kod gir, 3: başarılı

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-xl p-3.5 bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all";

  const getPasswordStrength = (p: string) => {
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    const labels = ["Çok Zayıf", "Zayıf", "Orta", "İyi", "Güçlü", "Çok Güçlü"];
    const colors = ["#ef4444", "#f87171", "#fbbf24", "#a3e635", "#22c55e", "#10b981"];
    return { score, label: labels[score] || "Çok Zayıf", color: colors[score] || "#ef4444" };
  };
  const strength = getPasswordStrength(newPassword);

  // ─── Step 1: username doğrula ─────────────────────────
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !username) {
      setError("E-posta ve kullanıcı adı gerekli");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await authAPI.verifyUsername({ email, username });
      if (res.ok) {
        toast.success("✓ Kullanıcı doğrulandı", {
          description: "E-postana kod gönderildi.",
        });
        setStep(2);
      } else {
        setError(res.message || "E-posta veya kullanıcı adı eşleşmiyor");
      }
    } catch (err: any) {
      setError(err?.message || "Doğrulama başarısız");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Step 2: kod + yeni şifre ────────────────────────
  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    const codeNum = parseInt(code, 10);
    if (isNaN(codeNum) || code.length !== 6) {
      setError("6 haneli geçerli bir kod girin");
      return;
    }
    if (newPassword.length < 6) {
      setError("Yeni şifre en az 6 karakter olmalı");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await authAPI.resetPassword({
        email,
        code: codeNum,
        new_password: newPassword,
      });
      if (res.ok) {
        toast.success("Şifre güncellendi! 🎉");
        setStep(3);
      } else {
        setError(res.message || "Şifre sıfırlanamadı");
      }
    } catch (err: any) {
      setError(err?.message || "Şifre sıfırlanamadı");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Step 3: başarılı ────────────────────────────────
  if (step === 3) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12"
      >
        <div className="relative w-full max-w-md border border-white/10 bg-[#0a0e1a]/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-6"
          >
            <span className="text-4xl">✅</span>
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-3">Şifren Güncellendi!</h2>
          <p className="text-white/70 text-sm mb-6">
            Yeni şifrenle giriş yapabilirsin.
          </p>
          <Link
            href="/login"
            className="w-full block py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-[#050816] font-bold text-base hover:shadow-lg hover:shadow-amber-400/40 transition-all"
          >
            Giriş Sayfasına Git →
          </Link>
        </div>
      </motion.div>
    );
  }

  // ─── Step 1 / 2: form ────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-amber-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-75" />

        <div className="relative border border-white/10 bg-[#0a0e1a]/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2].map((n) => (
              <div
                key={n}
                className={`h-1.5 rounded-full transition-all ${
                  step === n ? "w-12 bg-amber-400" : step > n ? "w-8 bg-green-500" : "w-8 bg-white/10"
                }`}
              />
            ))}
          </div>

          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-amber-400 mb-4 shadow-lg shadow-amber-400/20"
            >
              {step === 1 ? (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </motion.div>

            <h1 className="text-3xl font-bold text-white mb-2">
              {step === 1 ? "Hesabını Doğrula" : "Şifreni Sıfırla"}
            </h1>
            <p className="text-white/50 text-sm">
              {step === 1
                ? "Güvenliğin için önce e-posta ve kullanıcı adını doğrulayalım."
                : "E-postana gelen 6 haneli kodu ve yeni şifreni gir."}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleStep1} className="space-y-5">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <label className="block text-white/70 text-sm font-medium mb-2">E-posta</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@pythonmulakat.com" className={inputClass} required disabled={isLoading} autoComplete="email" autoFocus />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <label className="block text-white/70 text-sm font-medium mb-2">Kullanıcı Adı</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Kayıt olduğun kullanıcı adı" className={inputClass} required disabled={isLoading} autoComplete="username" />
              </motion.div>

              {error && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 font-medium text-center block">
                  {error}
                </motion.span>
              )}

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full rounded-xl p-4 font-bold text-lg transition-all ${
                  isLoading ? "bg-amber-800 cursor-not-allowed text-white/50" : "bg-gradient-to-r from-amber-400 to-amber-500 text-[#050816] hover:shadow-lg hover:shadow-amber-400/40"
                }`}
              >
                {isLoading ? "Doğrulanıyor..." : "🔍 Doğrula & Kod Gönder"}
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleStep2} className="space-y-5">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
                <label className="block text-white/70 text-sm font-medium mb-2">Doğrulama Kodu</label>
                <input
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`${inputClass} text-center tracking-[0.5em] text-lg font-bold text-amber-400`}
                  required
                  autoFocus
                />
                <p className="text-[10px] text-white/40 mt-1.5 text-center">
                  <strong className="text-amber-400/80">{email}</strong> adresine gönderildi
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <label className="block text-white/70 text-sm font-medium mb-2">Yeni Şifre</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    className={inputClass + " pr-12"}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1" tabIndex={-1}>
                    {showPw ? "🙈" : "👁️"}
                  </button>
                </div>
                {newPassword.length > 0 && (
                  <div className="mt-2">
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(strength.score / 5) * 100}%` }} transition={{ duration: 0.3 }} className="h-full rounded-full" style={{ background: strength.color }} />
                    </div>
                    <p className="text-[10px] mt-1.5 uppercase tracking-wider font-semibold" style={{ color: strength.color }}>
                      {strength.label}
                    </p>
                  </div>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <label className="block text-white/70 text-sm font-medium mb-2">Şifreyi Onayla</label>
                <input type={showPw ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className={inputClass} required minLength={6} autoComplete="new-password" />
                {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                  <p className="text-[10px] mt-1.5 text-red-400">Şifreler eşleşmiyor</p>
                )}
              </motion.div>

              {error && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 font-medium text-center block">
                  {error}
                </motion.span>
              )}

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full rounded-xl p-4 font-bold text-lg transition-all ${
                  isLoading ? "bg-amber-800/50 cursor-not-allowed text-white/30" : "bg-gradient-to-r from-amber-400 to-amber-500 text-[#050816] hover:shadow-lg hover:shadow-amber-400/40"
                }`}
              >
                {isLoading ? "Güncelleniyor..." : "🔐 Şifreyi Güncelle"}
              </motion.button>

              <button
                type="button"
                onClick={() => { setStep(1); setError(null); setCode(""); setNewPassword(""); setConfirmPassword(""); }}
                className="text-xs text-white/40 hover:text-white/70 transition-colors w-full text-center"
              >
                ← Geri (kullanıcı adını değiştir)
              </button>
            </form>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6 text-white/50 text-sm"
          >
            Şifreni hatırladın mı?{" "}
            <Link href="/login" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
              Giriş Yap
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="relative bg-[#050816] min-h-screen w-full overflow-x-hidden">
      <GridBackground />
      <Navbar />
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <ForgotPasswordInner />
      </Suspense>
    </div>
  );
}