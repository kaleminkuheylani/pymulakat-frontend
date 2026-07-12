"use client";

// components/workspace/WorkspaceErrorBoundary.tsx
// Workspace React hatalarını (removeChild, hydration, lazy load race) yakalar.
// Düzgün fallback UI + reload önerisi gösterir; "Sayfa yüklenemedi" Next.js default
// error.tsx sayfasından daha bilgilendirici.
//
// Production davranışı:
// 1. Component hata fırlatırsa (lazy load race, CodeMirror DOM conflict, vs.)
// 2. componentDidCatch yakalar
// 3. Fallback render: "Soru yüklenemedi — sayfayı yenile" butonu + "Listeye Dön"
// 4. State sıfırlanır, kullanıcı reload veya navigate seçebilir
//
// NOT: ErrorBoundary'ler React hatalarını yakalar (removeChild dahil). Next.js'in
// `notFound()` / `redirect()` exception'larını YAKALAMAMALI — bunlar Next.js'in
// özel handled exception'ları. Bu nedenle fallback render'ında navigate kullanır.

import { Component, type ErrorInfo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, RefreshCw, ArrowLeft, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  /** Kategori display URL'i (Listeye Dön linki için) */
  categoryUrl?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * Pure Error Boundary class — fallback render için internal HookErrorFallback kullanır
 * (hooks class component'te çalışmaz).
 */
class WorkspaceErrorBoundaryInner extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: unknown): State {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Bilinmeyen hata";
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    // Production'da console.warn bile kaldırıldı (mimari: log yok).
    // İleride Sentry/etc. entegrasyonu buraya eklenebilir.
    // Vercel log'a düşmesi için process.stderr kullanmıyoruz — sadece state.
    if (typeof error === "object" && error !== null && "name" in error) {
      // Error tipini state'te zaten tutuyoruz
    }
  }

  reset = (): void => {
    this.setState({ hasError: false, message: "" });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return <HookErrorFallback
        message={this.state.message}
        categoryUrl={this.props.categoryUrl}
        onReset={this.reset}
      />;
    }
    return this.props.children;
  }
}

/**
 * HookErrorFallback — class component içinde hook kullanamayacağımız için
 * ErrorBoundary fallback'i ayrı fonksiyon component. useRouter ile
 * navigate yapabilir.
 */
function HookErrorFallback({
  message,
  categoryUrl,
  onReset,
}: {
  message: string;
  categoryUrl?: string;
  onReset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 mb-4">
          <AlertTriangle className="w-7 h-7 text-rose-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Soru yüklenemedi
        </h1>
        <p className="text-white/60 text-sm mb-6">
          Workspace render edilirken bir hata oluştu. Genellikle geçici bir
          render yarışıdır — sayfayı yenilemek çözer.
        </p>

        {message && (
          <details className="text-left mb-6 bg-slate-900/50 border border-white/10 rounded-lg p-3">
            <summary className="text-xs text-white/40 cursor-pointer hover:text-white/60">
              Teknik detay
            </summary>
            <pre className="mt-2 text-[11px] text-rose-300/80 font-mono whitespace-pre-wrap break-words">
              {message}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            type="button"
            onClick={() => {
              onReset();
              // router.refresh() ile server-side re-render tetikle
              // Bu, lazy load race'i temizler
              router.refresh();
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Tekrar Dene
          </button>

          {categoryUrl ? (
            <button
              type="button"
              onClick={() => router.push(categoryUrl)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Listeye Dön
            </button>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors"
            >
              <Home className="w-4 h-4" />
              Ana Sayfa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * WorkspaceErrorBoundary — public API. Tek satır wrap:
 *   <WorkspaceErrorBoundary categoryUrl="/liste-sozluk">
 *     <Workspace ... />
 *   </WorkspaceErrorBoundary>
 */
export default function WorkspaceErrorBoundary({
  children,
  categoryUrl,
}: Props) {
  return (
    <WorkspaceErrorBoundaryInner categoryUrl={categoryUrl}>
      {children}
    </WorkspaceErrorBoundaryInner>
  );
}
