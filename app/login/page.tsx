// app/login/page.tsx
//
// 2026-07-19: SADECE OAuth — Google + GitHub. Email/sifre kaldirildi.
// Modern split layout: sol marka/ozellik paneli, sag OAuth karti.

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import AuthShell from "@/components/auth/AuthShell";

const GTAG_ID = "AW-18336540598";
const GTAG_CONVERSION_LABEL = "DzrTCOO8xdQcELbPxadE";

function LoginContent() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";
  return <AuthShell mode="login" returnUrl={returnUrl} />;
}

export default function LoginPage() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="gtag-conversion"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GTAG_ID}');
            function gtag_report_conversion(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                'send_to': '${GTAG_ID}/${GTAG_CONVERSION_LABEL}',
                'event_callback': callback
              });
              return false;
            }
          `,
        }}
      />
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#050816] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </>
  );
}
