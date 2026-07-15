"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

// 2026-07-15: Siteden cikip geri geldiginde (veya hard refresh), eger user
// zaten login ise landing'i gormeden /dashboard'a push. Bu sayede:
//
//   1. Login basarili -> /dashboard (zaten returnUrl ile)
//   2. Tarayici kapat -> ac -> landing'e donmek YERINE
//      session cookie/localStorage kontrol edilir, varsa /dashboard
//   3. Logout -> / (landing, user sifirlandi)
//
// Supabase session httpOnly cookie + localStorage'da persist ediyor,
// useUser hook bu state'i React tarafinda tutar. user var mi kontrol
// edip yoksa redirect ediyoruz.

export default function LandingAutoRedirect() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  return null;
}
