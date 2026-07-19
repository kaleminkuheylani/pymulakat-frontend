// app/register/page.tsx
//
// 2026-07-19: SADECE OAuth — Google + GitHub. Email/sifre kayit kaldirildi.

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import OAuthButtons from "@/components/auth/OAuthButtons";

// ─── Background ──────────────────────────────────────────────
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99, 102, 241, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
    </div>
  );
}

// ─── Register Content ───────────────────────────────────────────
function RegisterContent() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";

  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-12">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-amber-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-75" />
        <div className="relative border border-white/10 bg-[#0a0e1a]/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-amber-400 mb-4 shadow-lg shadow-amber-400/20">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Hesap Oluştur</h1>
            <p className="text-white/50 text-sm">
              Google veya GitHub hesabınla ücretsiz kaydol
            </p>
          </div>

          {/* OAuth Buttons */}
          <OAuthButtons returnUrl={returnUrl} mode="register" />

          {/* Login link */}
          <p className="text-center mt-6 text-white/50 text-sm">
            Zaten hesabın var mı?{" "}
            <Link
              href={`/login${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`}
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              Giriş Yap
            </Link>
          </p>

          {/* Info */}
          <p className="text-center mt-4 text-white/40 text-xs leading-relaxed">
            Devam ederek{" "}
            <Link href="/terms" className="text-white/60 hover:text-amber-300 underline underline-offset-2">
              Kullanım Koşulları
            </Link>{" "}
            ve{" "}
            <Link href="/privacy" className="text-white/60 hover:text-amber-300 underline underline-offset-2">
              Gizlilik Politikası
            </Link>
            &apos;nı kabul etmiş olursun.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Page Wrapper ───────────────────────────────────────────
export default function RegisterPage() {
  return (
    <div className="relative bg-[#050816] min-h-screen w-full overflow-x-hidden">
      <GridBackground />
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <RegisterContent />
      </Suspense>
    </div>
  );
}
