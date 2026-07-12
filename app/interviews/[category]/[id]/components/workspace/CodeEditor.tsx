"use client";

// CodeEditor.tsx — workspace CodeEditor wrapper.
//
// Mevcut components/CodeEditor.tsx'i sarmalayıp workspace client'larına
// prop-based API ile bağlar. Lazy load ağır kod (CodeMirror / Monaco)
// paketini ayrı chunk'a taşır — page hydration hızlanır.

import dynamic from "next/dynamic";
import type { CodeEditorRef } from "../../../../../../components/CodeEditor";

// 📌 ssr: false → sayfa hydration sırasında CodeMirror modüllerini
// yüklemeye çalışmaz. İlk render'da fallback gösterilir, sonra
// kendi chunk'ından mount olur.
const Editor = dynamic(
  () => import("../../../../../../components/CodeEditor").then((m) => m.CodeEditorMonaco),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-full w-full flex items-center justify-center bg-[#050816] text-white/40 text-xs font-mono"
        style={{ minHeight: 320 }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-[3px] border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          Editör yükleniyor...
        </div>
      </div>
    ),
  }
);

export interface CodeEditorPanelProps {
  /** Imperative ref → parent (layout/focus çağrıları için) */
  editorRef: React.RefObject<CodeEditorRef | null>;
  /** Editör içeriği */
  value: string;
  /** Code change callback — orchestrator code state'ini günceller */
  onChange: (next: string) => void;
  /** python | javascript | typescript */
  language?: "python" | "javascript" | "typescript";
  /** px veya % string. Default 100% */
  height?: string | number;
  /** Misafir / readonly modda edit kilitli */
  readOnly?: boolean;
}

// ─── CodeEditorPanel ─────────────────────────────────────
// Pure wrapper — tüm state parent'ta. Sadece value → editor, change → parent.
export default function CodeEditorPanel({
  editorRef,
  value,
  onChange,
  language = "python",
  height = "100%",
  readOnly = false,
}: CodeEditorPanelProps) {
  return (
    <Editor
      ref={editorRef}
      value={value}
      onChange={onChange}
      language={language}
      height={height}
      readOnly={readOnly}
    />
  );
}
