"use client";

// index.tsx — Workspace client root.
//
// 📌 Code splitting mimari kararı (2026-07-11, kalıcı):
//   Bu dosya mobile/desktop variant switch yapar. Her variant kendi
//   chunk'ında lazy load edilir. Pyodide/CodeMirror ağırlığı
//   CodeEditorPanel içinde zaten dynamic import ile izole.
//
// Akış:
//   page.tsx (server) → isMobileDevice() → "mobile" | "desktop"
//   page.tsx → <Workspace variant={...} initialParams={...} />
//   Workspace (bu dosya) → React.lazy ile uygun client'ı mount eder
//   İlk paint'te Suspense fallback (skeleton) gösterilir
//
// Kural: Hiçbir monolitik client > 200 satır olmasın. Modüller arası
// iletişim prop callback (context API YASAK şimdilik).

import { Suspense, lazy } from "react";
import type { Question, QuestionTests } from "../../../../../api/v2/questions";

// ─── Public Types ────────────────────────────────────────
export interface WorkspaceProps {
  variant: "mobile" | "desktop";
  initialParams: { category: string; id: string };
  readonly?: boolean;
  initialInterview?: Question | null;
  initialTestCases?: QuestionTests | null;
  hasStudy?: boolean;
}

// ─── Lazy imports ────────────────────────────────────────
// Her variant ayrı chunk → ilk paint bundle'ı küçülür.
// ssr: false KULLANMIYORUZ — server-side render'da HTML'e gerçek
// içerik basılabilsin. Test edilebilirlik ve SEO korunur.
const DesktopClient = lazy(() => import("./WorkspaceClient"));
const MobileClient = lazy(() => import("./WorkspaceMobileClient"));

// ─── Skeleton fallback (Suspense için) ────────────────────
// Editor + sidebar mount olurken kullanıcı boş sayfa görmesin.
function WorkspaceSkeleton({ variant }: { variant: "mobile" | "desktop" }) {
  return (
    <div
      className={`bg-[#050816] flex flex-col ${
        variant === "mobile" ? "h-[100dvh] min-h-screen" : "h-screen"
      }`}
    >
      <div className="h-14 bg-[#0a0e1a]/80 border-b border-white/5 flex items-center justify-between px-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-16 h-3 bg-white/10 rounded animate-pulse" />
          <div className="w-2 h-3 bg-white/5 rounded" />
          <div className="w-10 h-4 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-6 bg-white/5 rounded animate-pulse" />
          <div className="w-24 h-6 bg-white/5 rounded animate-pulse" />
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {variant === "desktop" && (
          <div className="w-[420px] flex-shrink-0 bg-[#0a0e1a] h-full p-6 space-y-4">
            <div className="w-3/4 h-7 bg-white/10 rounded animate-pulse" />
            <div className="w-full h-4 bg-white/5 rounded animate-pulse" />
            <div className="w-5/6 h-4 bg-white/5 rounded animate-pulse" />
            <div className="w-2/3 h-4 bg-white/5 rounded animate-pulse" />
            <div className="w-full h-32 bg-white/5 rounded animate-pulse mt-6" />
          </div>
        )}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div
              className={`${
                variant === "mobile" ? "w-10 h-10" : "w-12 h-12"
              } border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin`}
            />
            <p className="text-white/40 text-xs">Workspace yükleniyor...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Workspace root ─────────────────────────────────────
export default function Workspace({
  variant,
  initialParams,
  readonly,
  initialInterview,
  initialTestCases,
  hasStudy,
}: WorkspaceProps) {
  const commonProps = {
    initialParams,
    readonly,
    initialInterview,
    initialTestCases,
    hasStudy,
  };

  return (
    <Suspense
      key={variant}
      fallback={<WorkspaceSkeleton variant={variant} />}
    >
      {variant === "mobile" ? (
        <MobileClient {...commonProps} />
      ) : (
        <DesktopClient {...commonProps} />
      )}
    </Suspense>
  );
}
