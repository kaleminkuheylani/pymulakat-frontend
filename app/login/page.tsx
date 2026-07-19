// app/login/page.tsx
//
// 2026-07-19: SADECE OAuth — Google + GitHub. Email/sifre kaldirildi.
// Modern split layout: sol marka/ozellik paneli, sag OAuth karti.

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";

function LoginContent() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";
  return <AuthShell mode="login" returnUrl={returnUrl} />;
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050816] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
