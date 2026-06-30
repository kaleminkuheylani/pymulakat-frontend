// app/interviews/[category]/[id]/page.tsx
// Mobile-aware workspace + error boundary

"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, Component, ReactNode } from "react";

// ─── Inline Error Boundary ─────────────────────────────────
class WorkspaceErrorBoundary extends Component<
  { children: ReactNode; name: string },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode; name: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error(`[${this.props.name}] caught error:`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050816] flex items-center justify-center p-6">
          <div className="max-w-xl w-full">
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-2xl">💥</div>
                <div>
                  <h2 className="text-lg font-bold text-red-400">
                    {this.props.name} patladı
                  </h2>
                  <p className="text-xs text-white/40">Render sırasında beklenmeyen hata</p>
                </div>
              </div>
              <pre className="text-xs text-red-300 bg-black/30 p-3 rounded overflow-auto max-h-96 font-mono whitespace-pre-wrap">
                {this.state.error?.message || "Bilinmeyen hata"}
                {"\n\n"}
                {this.state.error?.stack?.split("\n").slice(0, 8).join("\n")}
              </pre>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#050816] font-bold text-sm transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Lazy loader wrapper ───────────────────────────────────
function ClientLoader({ name, loader, props }: { name: string; loader: () => Promise<any>; props?: any }) {
  const [Component, setComponent] = useState<any>(null);
  const [err, setErr] = useState<Error | null>(null);

  useEffect(() => {
    loader()
      .then((m) => setComponent(() => m.default))
      .catch((e) => {
        console.error(`[${name}] load error:`, e);
        setErr(e);
      });
  }, [name]);

  if (err) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center p-6 text-red-400">
        <div className="max-w-xl">
          <p className="font-bold mb-2">Client yüklenemedi: {name}</p>
          <pre className="text-xs">{err.message}</pre>
        </div>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-white/40 text-xs">{name} yükleniyor...</p>
        </div>
      </div>
    );
  }

  return <Component {...(props || {})} />;
}

// ─── Page ──────────────────────────────────────────────────
export default function Page() {
  const params = useParams<{ category: string; id: string }>();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const mobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua)
      || /ipad|android(?!.*mobile)/i.test(ua);
    setIsMobile(mobile);
  }, []);

  if (isMobile === null) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const initialParams = { category: params.category, id: params.id };

  return (
    <WorkspaceErrorBoundary name={isMobile ? "Mobile Workspace" : "Desktop Workspace"}>
      {isMobile ? (
        <ClientLoader
          name="WorkspaceMobileClient"
          loader={() => import("./WorkspaceMobileClient")}
          props={{ initialParams }}
        />
      ) : (
        <ClientLoader
          name="WorkspaceClient"
          loader={() => import("./WorkspaceClient")}
          props={{ initialParams }}
        />
      )}
    </WorkspaceErrorBoundary>
  );
}