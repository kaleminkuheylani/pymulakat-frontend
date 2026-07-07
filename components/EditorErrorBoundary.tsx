"use client";

// EditorErrorBoundary — Editor sayfaları için geniş try/catch ağı.
// React hata sınırı + imperative API safe-defaults ile birlikte çalışır.
//
// 📌 Hedef: "Cannot read properties of undefined (reading id)" gibi
// runtime hataları uygulamayı çökertmek yerine, kullanıcıya
// 'sayfayı yeniden yükle' CTA'sı göster.

import { Component, ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  editorName?: string; // Hangi editör olduğunu UI'da göstermek için
}

interface State {
  hasError: boolean;
  errorMessage: string;
  errorStack?: string;
}

export class EditorErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "Bilinmeyen render hatası";

    // "Cannot read properties of undefined (reading 'id')" gibi spesifik
    // mesajları kullanıcı dostu dile çevir
    let friendly = message;
    if (/Cannot read prop(erty|erties) of (undefined|null)/.test(message)) {
      friendly = "Editör bir sorunla karşılaştı. Sayfa yeniden yükleniyor.";
    } else if (/Pyodide|loadPyodide/.test(message)) {
      friendly = "Python yüklenirken sorun çıktı. İnternet bağlantını kontrol et.";
    } else if (/Network|Failed to fetch/.test(message)) {
      friendly = "Ağ hatası. Bağlantını kontrol edip tekrar dene.";
    }

    return {
      hasError: true,
      errorMessage: friendly,
      errorStack: error instanceof Error ? error.stack : undefined,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (typeof console !== "undefined") {
      console.error("[EditorErrorBoundary]", error.message, errorInfo.componentStack);
    }
    // Analytics burada bağlanabilir.
  }

  handleReset = (): void => {
    this.setState({ hasError: false, errorMessage: "", errorStack: undefined });
    if (typeof window !== "undefined") {
      // Basit recovery: sayfa state'ini temizlemek için route'un kendisini reload et
      window.location.reload();
    }
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="h-screen bg-[#050816] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full p-6 rounded-2xl border border-rose-500/30 bg-rose-500/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-xl">
              ⚠
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {this.props.editorName || "Editör"} hata verdi
              </h2>
              <p className="text-xs text-white/60 mt-0.5">
                Kodun korunmuş olabilir, sayfayı yeniden yükleyince geri gelir.
              </p>
            </div>
          </div>

          <div className="bg-black/30 rounded-lg p-3 mb-4 border border-white/5">
            <p className="text-sm text-rose-200 font-mono break-words">
              {this.state.errorMessage}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={this.handleReset}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#050816] font-bold rounded-lg transition-all active:scale-95"
            >
              ↻ Sayfayı Yeniden Yükle
            </button>
            <a
              href="/interviews"
              className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-lg text-center transition-colors"
            >
              Sorulara Dön
            </a>
          </div>

          {process.env.NODE_ENV === "development" && this.state.errorStack && (
            <details className="mt-4 text-xs text-white/40">
              <summary className="cursor-pointer hover:text-white/70">
                Dev: Stack trace
              </summary>
              <pre className="mt-2 p-2 bg-black/40 rounded overflow-x-auto font-mono text-[10px] leading-relaxed">
                {this.state.errorStack.slice(0, 800)}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }
}

// ─── Hook: imperative safe wrappers (CodeEditor, WorkspaceClient vb.) ──
// Hot-path'te undefined dönebilecek objelere güvenli erişim için helper.
export function safeId(obj: unknown): string | number | null {
  if (obj == null) return null;
  const id = (obj as Record<string, unknown>).id;
  if (typeof id === "number" || typeof id === "string") return id;
  return null;
}

export function safeProp<T = unknown>(
  obj: unknown,
  key: string,
  fallback: T
): T {
  if (obj == null) return fallback;
  const v = (obj as Record<string, unknown>)[key];
  return v === undefined || v === null ? fallback : (v as T);
}
