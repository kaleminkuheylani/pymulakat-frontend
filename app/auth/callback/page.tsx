// app/auth/callback/page.tsx
//
// 2026-07-19: SADECE fallback UI — Supabase client detectSessionInUrl=true
// ile /auth/callback?code=xxx'i otomatik algilayip exchange yapar. Bu sayfa
// sadece kullanici /auth/callback'e direkt geldiginde (ornek: Supabase'in
// 'callback detected' mesajindan sonra) Supabase'in yaptigi exchange'i bekler.

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getSupabaseBrowser } from "@/hooks/useSupabaseBrowser";
import { notifyAuthChange } from "@/hooks/useUser";

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("OAuth girişi tamamlanıyor...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function waitForSession() {
      const supabase = getSupabaseBrowser();
      if (!supabase) {
        setError("Supabase client yüklenemedi");
        return;
      }
      const returnUrl = searchParams.get("returnUrl") || "/dashboard";
      const code = searchParams.get("code");
      const errorParam = searchParams.get("error_description") || searchParams.get("error");

      // OAuth provider hatasi (user cancel vs.)
      if (errorParam) {
        setError(errorParam);
        setTimeout(() => router.push("/login"), 2500);
        return;
      }

      // PKCE flow: ?code=xxx'i manuel exchange et. Supabase v2 + @supabase/ssr
      // detectSessionInUrl=true sayfa yuklendiginde URL'i okur, ama burada
      // server-side redirect ile code geliyor — Supabase auto-detect gormez.
      // Manuel exchangeCodeForSession en guvenilir yol.
      if (code) {
        setMessage("OAuth girişi tamamlanıyor...");
        const { data, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeErr) {
          setError(exchangeErr.message);
          setTimeout(() => router.push("/login"), 2500);
          return;
        }
        if (data?.session) {
          if (cancelled) return;
          notifyAuthChange();
          window.history.replaceState(null, "", window.location.pathname);
          toast.success("Giriş başarılı");
          router.push(returnUrl);
          return;
        }
        setError("Session oluşturulamadı");
        setTimeout(() => router.push("/login"), 2500);
        return;
      }

      // Code yoksa — mevcut session'i kontrol et
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        if (cancelled) return;
        notifyAuthChange();
        window.history.replaceState(null, "", window.location.pathname);
        toast.success("Giriş başarılı");
        router.push(returnUrl);
        return;
      }

      setError("Session oluşturulamadı");
      setTimeout(() => router.push("/login"), 2500);
    }

    waitForSession();
    return () => { cancelled = true; };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {error ? (
          <>
            <div className="text-6xl mb-4">❌</div>
            <p className="text-red-400 text-lg">Giriş başarısız</p>
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
      </div>
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
