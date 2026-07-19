// app/auth/callback/page.tsx
//
// 2026-07-19: SADE — sadece hash'ten session'i alip returnUrl'e yonlendir.
// Supabase setSession yapar + /api/auth/session httpOnly cookie yazar + sentinel
// cookie'yi set eder. Tum detaylar: lib/auth-client.ts + hooks/useSupabaseBrowser.ts.

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getSupabaseBrowser } from "@/hooks/useSupabaseBrowser";
import { notifyAuthChange } from "@/hooks/useUser";

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("İşlem gerçekleştiriliyor...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function handle() {
      const supabase = getSupabaseBrowser();
      if (!supabase) {
        setError("Supabase client yüklenemedi");
        return;
      }
      const returnUrl = searchParams.get("returnUrl") || "/dashboard";
      const type = searchParams.get("type"); // "signup" | "recovery" | null
      const tokenHash = searchParams.get("token_hash");

      try {
        // ── Email confirmation / recovery (token_hash ile) ──
        if (tokenHash && (type === "signup" || type === "recovery")) {
          setMessage(type === "recovery" ? "Şifre sıfırlama linki doğrulanıyor..." : "E-posta adresin doğrulanıyor...");
          const { error: verifyErr } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as "signup" | "recovery",
          });
          if (verifyErr) throw verifyErr;
          if (cancelled) return;

          notifyAuthChange();
          toast.success(type === "recovery" ? "Şifre sıfırlama hazır" : "E-posta doğrulandı!");
          if (type === "recovery") {
            router.push("/auth/reset-password");
          } else {
            router.push(returnUrl);
          }
          return;
        }

        // ── OAuth: PKCE (code parametresi) veya implicit (hash access_token) ──
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const hash = typeof window !== "undefined" ? window.location.hash : "";

        if (code) {
          // PKCE flow — Supabase yeni default
          setMessage("OAuth girişi tamamlanıyor...");
          const { data, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeErr) throw exchangeErr;
          if (!data?.session) throw new Error("Session oluşturulamadı");

          if (cancelled) return;
          notifyAuthChange();
          toast.success("OAuth girişi başarılı");
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
          router.push(returnUrl);
          return;
        }

        if (hash.includes("access_token")) {
          // Implicit flow (legacy — eski Supabase projeleri)
          setMessage("OAuth girişi tamamlanıyor...");
          const params = new URLSearchParams(hash.slice(1));
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          if (!accessToken || !refreshToken) {
            throw new Error("OAuth token eksik");
          }

          // (A) httpOnly cookie'ler — middleware server-side auth gate için
          try {
            await fetch("/api/auth/session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
            });
          } catch {
            // localStorage fallback zaten setSession'ı deneyecek
          }

          // (B) Supabase internal state — setSession başarısızsa localStorage fallback
          const { error: setErr } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (setErr) {
            console.warn("supabase setSession failed:", setErr.message);
            const storageKey = "sb-pymulakat-auth-token";
            const expiresIn = parseInt(params.get("expires_in") || "3600", 10);
            const sessionData = [{
              access_token: accessToken,
              refresh_token: refreshToken,
              expires_in: expiresIn,
              expires_at: Math.floor(Date.now() / 1000) + expiresIn,
              token_type: params.get("token_type") || "bearer",
              user: null,
            }];
            try {
              localStorage.setItem(storageKey, JSON.stringify(sessionData));
            } catch {
              /* ignore */
            }
          }

          if (cancelled) return;
          notifyAuthChange();
          toast.success("OAuth girişi başarılı");
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
          router.push(returnUrl);
          return;
        }

        // ── Magic link (Supabase implicit session'i otomatik set eder) ──
        setMessage("Magic link doğrulanıyor...");
        let attempts = 0;
        while (attempts < 5) {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            if (cancelled) return;
            notifyAuthChange();
            toast.success("Giriş başarılı");
            router.push(returnUrl);
            return;
          }
          attempts++;
          await new Promise((r) => setTimeout(r, 800));
        }
        throw new Error("Session oluşturulamadı — link süresi dolmuş olabilir");
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message || "Bilinmeyen hata");
        toast.error("İşlem başarısız", { description: e?.message });
        setTimeout(() => router.push("/login"), 2500);
      }
    }

    handle();
    return () => { cancelled = true; };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {error ? (
          <>
            <div className="text-6xl mb-4">❌</div>
            <p className="text-red-400 text-lg">İşlem başarısız</p>
            <p className="text-white/50 text-sm mt-2">{error}</p>
            <p className="text-white/40 text-xs mt-3">Login sayfasına yönlendiriliyorsunuz...</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-lg">{message}</p>
            <p className="text-white/50 text-sm mt-2">Lütfen bekleyin</p>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050816] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
