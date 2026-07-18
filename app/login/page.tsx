"use client";
import { Lock } from "lucide-react";

import { Suspense, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

import { notifyAuthChange } from "../../hooks/useUser";
import { createClient } from "@supabase/supabase-js";
import { authAPI } from "../../lib/api/authAPI";

// ═══════════════════════════════════════════════════════════════
// ─── Inline authAPI — Supabase client ile login ──────────────
// ═══════════════════════════════════════════════════════════════
interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  expires_at?: number | string;
  user: { id: string; email: string; username?: string };
}

const inlineAuthAPI = {
  /**
   * Doğrudan Supabase createClient ile login.
   * useSupabaseBrowser'dan bağımsız, basit, güvenilir.
   */
  async login(payload: { email: string; password: string }): Promise<LoginResponse> {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL veya NEXT_PUBLIC_SUPABASE_ANON_KEY tanımlı değil!"
      );
    }

    // Doğrudan createClient — useSupabaseBrowser wrapper'ını bypass et
    const supabase = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storageKey: "sb-pymulakat-auth-token",
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
      },
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (error) {
      if (error.message?.toLowerCase().includes("email not confirmed")) {
        throw new Error("E-posta adresin doğrulanmamış");
      }
      if (error.message?.toLowerCase().includes("invalid login credentials")) {
        throw new Error("E-posta veya şifre hatalı");
      }
      throw new Error(error.message || "Giriş başarısız");
    }

    if (!data.session || !data.user) {
      throw new Error("Oturum açılamadı");
    }

    // Token'ları manual yaz (storage wrapper bazen çalışmıyor)
    if (typeof window !== "undefined") {
      try {
        const expiresAt = data.session.expires_at || Math.floor(Date.now() / 1000) + 3600;
        const supabaseSession = {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: expiresAt,
          expires_in: 3600,
          token_type: "bearer",
          user: data.user,
        };
        localStorage.setItem("sb-pymulakat-auth-token", JSON.stringify(supabaseSession));
        // 📌 Auth gate middleware için sentinel cookie. Login sayfasında
        // GlobalNav render edilmiyor (isAuthPage → null) bu yüzden useUser
        // mount olmuyor. Cookie'yi bizzat login sonrası set ediyoruz ki
        // /python-egitimi veya /python-kodlari'na direkt geçişte middleware
        // server tarafında session'ı görsün.
        try {
          document.cookie = "pymulakat_auth=1; path=/; max-age=86400; SameSite=Lax";
        } catch { /* ignore */ }
      } catch (e) {
      }
    }

    // Backend profile senkronizasyonu (opsiyonel)
    try {
      await authAPI.getMe();
    } catch {
      // ignore
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
      user: {
        id: data.user.id,
        email: data.user.email || "",
        username: data.user.user_metadata?.username || data.user.email?.split("@")[0],
      },
    };
  },
};

// ─── Grid Background ─────────────────────────────────────────
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

// ─── Navbar ──────────────────────────────────────────────────
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
        <Link href="/register" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
          Kayıt Ol
        </Link>
        <Link href="/" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
          Ana Sayfa
        </Link>
      </div>
    </motion.nav>
  );
}

// ─── Types ────────────────────────────────────────────────────
interface LoginFormData {
  email: string;
  password: string;
}

// ─── Inner Form ──────────────────────────────────────────────
function LoginFormInner() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  // 2026-07-18: Magic link kaldirildi, OAuth (Google + GitHub) eklendi

  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl =
    searchParams.get("returnUrl") || "/dashboard";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ─── Password Login ───────────────────────────────────────
  const handlePasswordLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loginData = await inlineAuthAPI.login({
        email: formData.email,
        password: formData.password,
      });

      if (loginData.access_token) {
        // Supabase client kendi storage'ini zaten yönetti ("sb-pymulakat-auth-token")
        // inlineAuthAPI.login() içinde plain key'ler de yazıldı (geriye uyumlu)

        notifyAuthChange();
        toast.success("Giriş başarılı! Hoş geldiniz 👋");
        router.push(returnUrl);
      }
    } catch (error: any) {
      const fullMsg = error?.message || "Giriş başarısız.";

      // 🔍 Backend 403 = email doğrulanmamış → register verify ekranına yönlendir
      if (
        fullMsg.toLowerCase().includes("doğrulanmamış") ||
        fullMsg.toLowerCase().includes("not confirmed") ||
        fullMsg.toLowerCase().includes("not verified")
      ) {
        toast.error("E-posta adresin doğrulanmamış", {
          description: "E-postandaki 6 haneli kodu kullan. Yeni kod istersen aşağıdaki sayfadan talep edebilirsin.",
          duration: 6000,
        });
        router.push(`/register?email=${encodeURIComponent(formData.email)}`);
        return;
      }

      toast.error(fullMsg);
    } finally {
      setIsLoading(false);
    }
  };
  // ─── Google OAuth Handler ──────────────────────────
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !key) {
        throw new Error("Supabase env tanımsız");
      }
      const supabase = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: "sb-pymulakat-auth-token",
        },
      });

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`,
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      const msg = error?.message || "Bilinmeyen hata";
      toast.error("Google ile giriş başlatılamadı", { description: msg });
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !key) {
        throw new Error("Supabase env tanımsız");
      }
      const supabase = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: "sb-pymulakat-auth-token",
        },
      });

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      const msg = error?.message || "Bilinmeyen hata";
      toast.error("GitHub ile giriş başlatılamadı", { description: msg });
      setIsLoading(false);
    }
  };

  // ─── Login Form ───────────────────────────────────────────
  const inputClass =
    "w-full rounded-xl p-3.5 bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all";

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
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-amber-400 mb-4 shadow-lg shadow-amber-400/20"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Tekrar Hoş Geldiniz
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/50 text-sm"
            >
              Şifrenle giriş yap veya Google/GitHub ile devam et
            </motion.p>
          </div>

          {/* Form */}
          <form
            onSubmit={handlePasswordLogin}
            className="space-y-5"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-white/70 text-sm font-medium mb-2">
                E-posta Adresi
              </label>
              <input
                type="email"
                name="email"
                placeholder="ornek@pythonmulakat.com"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-white/70 text-sm font-medium mb-2">
                Şifre
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={inputClass}
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-xl p-4 font-bold text-lg transition-all ${
                isLoading
                  ? "bg-amber-800 cursor-not-allowed text-white/50"
                  : "bg-gradient-to-r from-amber-400 to-amber-500 text-[#050816] hover:shadow-lg hover:shadow-amber-400/40"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Giriş Yapılıyor...
                </span>
              ) : (
                "Şifre ile Giriş Yap"
              )}
            </motion.button>
          </form>

          {/* Mode Toggle */}
          {/* OAuth butonlari: Google + GitHub */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0e1a] px-2 text-white/40">veya sosyal hesap ile</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              type="button"
              className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <GoogleIcon className="w-4 h-4" />
              Google
            </button>
            <button
              onClick={handleGitHubLogin}
              disabled={isLoading}
              type="button"
              className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <GitHubIcon className="w-4 h-4" />
              GitHub
            </button>
          </div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-6 text-white/50 text-sm"
          >
            Hesabınız yok mu?{" "}
            <Link
              href="/register"
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              Kayıt Ol
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page Wrapper ────────────────────────────────────────────
export default function LoginPage() {
  return (
    <div className="relative bg-[#050816] min-h-screen w-full overflow-x-hidden">
      <GridBackground />
      <Navbar />
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/50 mt-4 text-sm">Yükleniyor...</p>
          </div>
        }
      >
        <LoginFormInner />
      </Suspense>
    </div>
  );
}

// ─── OAuth Provider Iconlari (lucide'da yok) ────────────────────
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}
