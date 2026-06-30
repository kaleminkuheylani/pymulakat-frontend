// app/interviews/[category]/[id]/page.tsx
// Mobile detection client-side — server-side fetch/headers hatalarını önler

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import WorkspaceClient from "./WorkspaceClient";
import WorkspaceMobileClient from "./WorkspaceMobileClient";

function isMobileUA(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua)
    || /ipad|android(?!.*mobile)/i.test(ua);
}

export default function Page() {
  // Next.js 16: useParams() hook Promise değil, direkt obje döner
  const params = useParams<{ category: string; id: string }>();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobile(isMobileUA());
  }, []);

  // İlk render'da loading göster
  if (isMobile === null) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-white/40 text-xs">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const Component = isMobile ? WorkspaceMobileClient : WorkspaceClient;
  return <Component initialParams={{ category: params.category, id: params.id }} />;
}