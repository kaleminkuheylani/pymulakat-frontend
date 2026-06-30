// app/interviews/[category]/[id]/page.tsx
// Minimal test page — hangi client'in patladığını bulmak için

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const params = useParams<{ category: string; id: string }>();
  const [clientStatus, setClientStatus] = useState<{
    desktop: "ok" | "fail" | "loading";
    mobile: "ok" | "fail" | "loading";
  }>({ desktop: "loading", mobile: "loading" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Client-side mobile detection
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua)
      || /ipad|android(?!.*mobile)/i.test(ua);

    // Dinamik import ile client'ları yükle
    Promise.all([
      import("./WorkspaceClient").then((m) => m.default).catch((e) => {
        console.error("WorkspaceClient import failed:", e);
        setError(`Desktop client failed: ${e.message}`);
        return null;
      }),
      import("./WorkspaceMobileClient").then((m) => m.default).catch((e) => {
        console.error("WorkspaceMobileClient import failed:", e);
        setError(`Mobile client failed: ${e.message}`);
        return null;
      }),
    ]).then(([Desktop, Mobile]) => {
      setClientStatus({
        desktop: Desktop ? "ok" : "fail",
        mobile: Mobile ? "ok" : "fail",
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-400 mb-4">🔧 Debug Page</h1>

        <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-4">
          <p className="text-sm text-white/60 mb-2">URL Params:</p>
          <pre className="text-xs font-mono text-white/80">
            {JSON.stringify(params, null, 2)}
          </pre>
        </div>

        <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-4">
          <p className="text-sm text-white/60 mb-2">Client Status:</p>
          <ul className="space-y-1 text-xs font-mono">
            <li>Desktop: <span className={clientStatus.desktop === "ok" ? "text-green-400" : clientStatus.desktop === "fail" ? "text-red-400" : "text-yellow-400"}>{clientStatus.desktop}</span></li>
            <li>Mobile: <span className={clientStatus.mobile === "ok" ? "text-green-400" : clientStatus.mobile === "fail" ? "text-red-400" : "text-yellow-400"}>{clientStatus.mobile}</span></li>
          </ul>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 mb-4">
            <p className="text-sm text-red-400 font-bold mb-1">Error:</p>
            <pre className="text-xs font-mono text-red-300 whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        <Link href={`/interviews/${params.category}`} className="text-amber-400 hover:text-amber-300 text-sm">
          ← Geri dön
        </Link>
      </div>
    </div>
  );
}