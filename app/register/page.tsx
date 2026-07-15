"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import {
  register as authRegister,
  verifyEmail,
  resendCode,
} from "../../lib/api/authAPI";
import { ApiError } from "../../lib/api";
import type { ApiMessageResponse } from "../../lib/api/types";

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  privacy_policy_consent?: boolean;
}

// lib/api/authAPI.ts + ApiError üzerinden standart error mesajı çıkar
function extractErrorMessage(e: unknown, fallback: string): string {
  if (e instanceof ApiError) return e.message;
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return fallback;
}

const authAPI = {
  async register(payload: RegisterPayload): Promise<ApiMessageResponse> {
    return authRegister(payload);
  },
  async verifyEmail(payload: { email: string; code: number }): Promise<ApiMessageResponse> {
    return verifyEmail(payload);
  },
  async resendCode(email: string): Promise<ApiMessageResponse> {
    return resendCode(email);
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
      className="relative z-10 flex items-center justify-between px-8 py-4 backdrop-blur-md bg-[#050816]/80"
    >
      <Link href="/" className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-amber-400 flex items-center justify-center">
          <span className="text-white font-bold text-xs">PM</span>
        </div>
        <span className="text-white font-bold text-lg">PythonMulakat</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
          Giriş Yap
        </Link>
        <Link href="/" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
          Ana Sayfa
        </Link>
      </div>
    </motion.nav>
  );
}

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

interface LegalConsent {
  privacyPolicy: boolean;
}

function ConsentRow({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer group w-full">
      <span className="relative flex-shrink-0 mt-0.5">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <span
          className={[
            "block w-4 h-4 rounded border transition-colors",
            checked ? "bg-amber-500 border-amber-500" : "bg-transparent border-white/20 group-hover:border-amber-500/60",
          ].join(" ")}
        />
        {checked && (
          <svg className="absolute inset-0 w-4 h-4 text-[#050816] pointer-events-none" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="text-xs text-white/50 leading-relaxed">{children}</span>
    </label>
  );
}

function RegisterFormInner() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
  });
  const [consent, setConsent] = useState<LegalConsent>({ privacyPolicy: false });
  const [isVerifyMode, setIsVerifyMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string>("");


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const allConsentsGiven = consent.privacyPolicy;

  const handleRegister = async () => {
    const response = await authAPI.register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      privacy_policy_consent: true,
    });

    // 2026-07-15: Kod UI'da gosterilmez. Backend dev'de response.message'da
    // donuyor olsa bile frontend gizler (email disinda erisim yok).
    toast.success("Kayıt başarılı! 📧", {
      description: "E-postanı kontrol et",
        duration: 30000,
      });
    } else {
      toast.success("Kayıt başarılı! E-postanı kontrol et");
    }

    setIsVerifyMode(true);
    setCode("");
  };

  const handleVerify = async () => {
    const codeNumber = parseInt(code, 10);
    if (isNaN(codeNumber) || code.length !== 6) {
      throw new Error("6 haneli geçerli bir kod girin.");
    }

    const response = await authAPI.verifyEmail({
      email: formData.email,
      code: codeNumber,
    });

    if (response.ok) {
      toast.success("E-posta doğrulandı! 🎉");
      router.push("/login");
    }
  };

  const handleResend = async () => {
    try {
      setIsLoading(true);
      await authAPI.resendCode(formData.email);
      // 2026-07-15: Kod UI'da gosterilmez, sadece email'e gonderilir.
      // Dev'de backend response.message'da donuyordu, artik gizli.
      setCode("");
      toast.info("Yeni kod gönderildi", { description: "E-postanı kontrol et" });
    } catch (err: any) {
      toast.error("Kod gönderilemedi", { description: err?.message || "Bilinmeyen hata" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isVerifyMode && !allConsentsGiven) {
      setError("Devam etmek için tüm yasal onayları vermeniz gerekmektedir.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isVerifyMode) {
        await handleVerify();
      } else {
        await handleRegister();
      }
    } catch (err: any) {
      const errMsg = typeof err?.message === "string"
        ? err.message
        : JSON.stringify(err?.message || err || "İşlem başarısız");
      setError(errMsg);
      toast.error("İşlem başarısız", { description: errMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl p-3.5 bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all";

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
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {isVerifyMode ? "E-posta Doğrulama" : "Hesap Oluştur"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/50 text-sm"
            >
              {isVerifyMode
                ? `${formData.email} adresine gönderilen 6 haneli kodu girin.`
                : "Mülakat platformumuza hoş geldin. Bilgilerini girerek başla."}
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isVerifyMode && (
              <>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                  <input type="text" name="username" placeholder="Kullanıcı Adı" value={formData.username} onChange={handleChange} className={inputClass} required minLength={2} maxLength={32} autoComplete="username" />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                  <input type="email" name="email" placeholder="E-posta Adresi" value={formData.email} onChange={handleChange} className={inputClass} required autoComplete="email" />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                  <input type="password" name="password" placeholder="Şifre (en az 6 karakter)" value={formData.password} onChange={handleChange} className={inputClass} required minLength={6} autoComplete="new-password" />
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="w-full flex flex-col space-y-2.5 pt-2">
                  <ConsentRow checked={consent.privacyPolicy} onChange={(v) => setConsent({ privacyPolicy: v })}>
                    <Link href="/terms" target="_blank" className="text-amber-400 hover:text-amber-300 underline decoration-dotted transition-colors">
                      Gizlilik Politikası & Kullanım Şartları
                    </Link>{" "}
                    &apos;nı okudum ve kabul ediyorum.
                  </ConsentRow>
                </motion.div>
              </>
            )}

            {isVerifyMode && (
              <>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="w-full flex flex-col items-center text-center">
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
                </motion.div>

                {/* 2026-07-15: Kod UI'da gosterilmez (dev debug panel kaldirildi).
                    Kullanici email'e gelen kodu okumali, otomatik kopya yok. */}

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLoading}
                  className="text-xs text-amber-400 hover:text-amber-300 transition-colors w-full text-center disabled:opacity-50"
                >
                  {isLoading ? "Gönderiliyor..." : "🔄 Kodu tekrar gönder"}
                </button>
              </>
            )}

            {error && (
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 font-medium text-center block max-w-full break-words"
              >
                {error}
              </motion.span>
            )}

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isVerifyMode ? 0.6 : 0.9 }}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              type="submit"
              disabled={isLoading || (!isVerifyMode && !allConsentsGiven)}
              className={`w-full rounded-xl p-4 font-bold text-lg transition-all ${
                isLoading || (!isVerifyMode && !allConsentsGiven)
                  ? "bg-amber-800/50 cursor-not-allowed text-white/30"
                  : "bg-gradient-to-r from-amber-400 to-amber-500 text-[#050816] hover:shadow-lg hover:shadow-amber-400/40"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isVerifyMode ? "Doğrulanıyor..." : "Kayıt Olunuyor..."}
                </span>
              ) : (
                <span>{isVerifyMode ? "Kodu Doğrula & Giriş Yap" : "Kayıt Ol & Kod Gönder"}</span>
              )}
            </motion.button>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: isVerifyMode ? 0.7 : 1.0 }}
            className="text-center mt-6 text-white/50 text-sm"
          >
            {isVerifyMode ? (
              <span className="cursor-pointer hover:text-white/80 transition-colors underline decoration-dotted" onClick={() => { setIsVerifyMode(false); setError(null); setCode(""); }}>
                E-posta adresini değiştir
              </span>
            ) : (
              <>
                Zaten hesabın var mı?{" "}
                <Link href="/login" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                  Giriş Yap
                </Link>
              </>
            )}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function RegisterPage() {
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
        <RegisterFormInner />
      </Suspense>
    </div>
  );
}