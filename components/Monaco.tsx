"use client";

// Build trigger

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";

// ─── Monaco dynamic import (SSR devre dışı) ──────────────────
// @ts-ignore — paket runtime'da yüklenecek
const MonacoEditor = dynamic(
  // @ts-ignore
  () => import("@monaco-editor/react").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0e1a",
          color: "rgba(255,255,255,0.4)",
          fontFamily: "monospace",
          fontSize: "13px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 32,
              height: 32,
              border: "3px solid rgba(99,102,241,0.25)",
              borderTopColor: "#6366f1",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 8px",
            }}
          />
          Monaco yükleniyor...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    ),
  }
);

// ─── Tip Tanımları ─────────────────────────────────────────────
export interface CodeEditorRef {
  getValue: () => string;
  setValue: (v: string) => void;
  focus: () => void;
  /**
   * Monaco'nun internal layout() metodu.
   * Container boyutu değiştiğinde (resize, orientationchange, soft keyboard)
   * hit-test tablosunu güncellemek için dışarıdan çağrılır.
   * Not: automaticLayout: false modunda GEREKLİ.
   */
  layout: () => void;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  language?: "python" | "javascript" | "typescript";
  height?: string | number;
  readOnly?: boolean;
  theme?: "vs-dark" | "hc-black" | "pythonDark";
}

// ─── Monaco Python Tema Tanımı ────────────────────────────────
function defineMonacoTheme(monaco: any) {
  monaco.editor.defineTheme("pythonDark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "c084fc", fontStyle: "bold" },
      { token: "string", foreground: "86efac" },
      { token: "number", foreground: "fbbf24" },
      { token: "comment", foreground: "71717a", fontStyle: "italic" },
      { token: "type", foreground: "60a5fa" },
      { token: "function", foreground: "f472b6" },
      { token: "variable", foreground: "e4e4e7" },
    ],
    colors: {
      "editor.background": "#0a0e1a",
      "editor.foreground": "#e4e4e7",
      "editorLineNumber.foreground": "#3f3f46",
      "editorLineNumber.activeForeground": "#a1a1aa",
      "editor.selectionBackground": "#fbbf2440",
      "editor.lineHighlightBackground": "#1e293b40",
      "editorCursor.foreground": "#ffffff",  // saf beyaz — mobilde cursor net görünsün
      "editorIndentGuide.background": "#1e293b",
    },
  });
}

// ═══════════════════════════════════════════════════════════════
// ─── CodeEditorMonaco Component ───────────────────────────────
// ═══════════════════════════════════════════════════════════════
export const CodeEditorMonaco = forwardRef<CodeEditorRef, Props>(
  function CodeEditorMonaco(
    {
      value,
      onChange,
      language = "python",
      height = "100%",
      readOnly = false,
      theme = "vs-dark",
    },
    ref
  ) {
    const editorRef = useRef<any>(null);
    const monacoRef = useRef<any>(null);
    // Kullanıcı yazarken value prop'u ile içerik çakışmasın diye son bilinen
    // dış değeri burada tutuyoruz; ref üzerinden programatik setValue ile
    // senkron dışı state okumalarında doğru kaynağı kullanırız.
    const lastExternalValueRef = useRef<string>(value);
    // onChange ref tut — mount'tan sonra deps değişmesin diye.
    const onChangeRef = useRef<typeof onChange>(onChange);

    // ── Imperative API (Editor.tsx ile uyumlu) ────────────────
    useImperativeHandle(
      ref,
      () => ({
        getValue: () => editorRef.current?.getValue() ?? lastExternalValueRef.current,
        setValue: (v: string) => {
          const editor = editorRef.current;
          if (editor) {
            const current = editor.getValue();
            if (current !== v) editor.setValue(v);
          }
        },
        focus: () => editorRef.current?.focus(),
        layout: () => {
          try {
            editorRef.current?.layout();
          } catch {
            // Mount tamamlanmadan önce çağrılırsa sessizce yut.
            // WorkspaceMobileClient'taki ResizeObserver bir sonraki tick'te
            // yeniden çağıracak.
          }
        },
      }),
      []
    );

    // onChange güncellemesini ref ile tut, gereksiz re-render/rebind yok
    useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    // ── Editor mount handler ──────────────────────────────────
    const handleEditorDidMount = (editor: any, monaco: any) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      // Dark theme tanımla
      defineMonacoTheme(monaco);
      // Theme: prop'tan gelen değeri uygula, default'ta pythonDark kullan.
      // "vs-dark" gelirse doğrudan onu da set edebiliriz; pythonDark için
      // setTheme("pythonDark") diyoruz.
      monaco.editor.setTheme(theme === "vs-dark" || theme === "hc-black" ? theme : "pythonDark");

      // Python LSP özellikleri (opsiyonel)
      monaco.languages.registerCompletionItemProvider("python", {
        provideCompletionItems: () => {
          const suggestions = [
            "def", "class", "return", "if", "elif", "else",
            "for", "while", "import", "from", "as", "try", "except",
            "with", "lambda", "yield", "in", "is", "not", "and", "or",
            "True", "False", "None", "print", "len", "range", "enumerate",
            "zip", "map", "filter", "sorted", "sum", "min", "max",
          ].map((kw) => ({
            label: kw,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: kw,
          }));
          return { suggestions };
        },
      });

      // Klavye kısayolları — Ctrl+S (browser save dialog) engelle.
      editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        (e: any) => e.preventDefault()
      );

      // Focus
      editor.focus();

      // 📌 Layout yönetimi WorkspaceMobileClient'in ResizeObserver'ına bırakıldı.
      // automaticLayout: false + tek noktadan layout() çağrısı — çift/triple
      // layout race condition cursor placement'i bozuyordu.
      // Mount sonrası ilk layout: container DOM'a oturmuşken bir kez çağır.
      requestAnimationFrame(() => {
        try {
          editor.layout();
        } catch (err) {
          // sessiz geç — layout hatası mount anında konteyner hazır değilse olur,
          // sonraki observer tick'inde yeniden çağrılacak
        }
      });
    };

    // ── Theme değişimi reaktif izleme ────────────────────────
    useEffect(() => {
      const monaco = monacoRef.current;
      if (!monaco) return;
      const target =
        theme === "vs-dark" || theme === "hc-black" ? theme : "pythonDark";
      try {
        monaco.editor.setTheme(target);
      } catch {
        // ignore
      }
    }, [theme]);

    // ── Dışarıdan gelen value değişimini editöre yansıt ────────
    // Kullanıcı yazıyorsa bu effect tetiklendiğinde editor içeriği ile
    // dış değer eşit değilse biz yazmışızdır; bu case'i skip ediyoruz.
    useEffect(() => {
      const editor = editorRef.current;
      if (!editor) {
        lastExternalValueRef.current = value;
        return;
      }
      const current = editor.getValue();
      if (current !== value) {
        // Eğer son bilinen dış değer ile mevcut farklıysa bu dışarıdan bir
        // güncelleme; editor'a yaz ve cursor'ı en başa taşıma — sadece text'i
        // senkronla. Kullanıcı içeride yazıyorsa current === value olur
        // (onChange ile parent state güncellenmiş olur).
        const preservedSelection = editor.getSelection();
        editor.setValue(value);
        if (preservedSelection) {
          try {
            editor.setSelection(preservedSelection);
          } catch {
            // yoksa hiçbir şey yapma
          }
        }
      }
      lastExternalValueRef.current = value;
    }, [value]);

    // ── readOnly değişimi reaktif ─────────────────────────────
    useEffect(() => {
      const editor = editorRef.current;
      if (!editor) return;
      try {
        editor.updateOptions({ readOnly, domReadOnly: readOnly });
      } catch {
        // ignore
      }
    }, [readOnly]);

    // ── Component unmount: model dispose ──────────────────────
    useEffect(() => {
      return () => {
        const editor = editorRef.current;
        if (editor && typeof editor.dispose === "function") {
          try {
            editor.dispose();
          } catch {
            // ignore
          }
        }
        editorRef.current = null;
        monacoRef.current = null;
      };
    }, []);

    // ── Options ───────────────────────────────────────────────
    const options = {
      fontSize: 18,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      lineHeight: 1.55,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      // 📌 automaticLayout: false — Monaco kendi ResizeObserver'ını kurmasın,
      // WorkspaceMobileClient kendi observer'ıyla tek noktadan editor.layout()
      // çağırıyor. automaticLayout=true iken Monaco + bizim observer aynı anda
      // layout tetikleyip cursor placement'ta race condition oluşturuyordu.
      automaticLayout: false,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: "off" as const,
      lineNumbers: "on" as const,
      glyphMargin: false,
      folding: true,
      renderLineHighlight: "line" as const,
      scrollbar: {
        vertical: "visible" as const,
        horizontal: "visible" as const,
        useShadows: false,
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      },
      padding: { top: 12, bottom: 12, left: 0 },
      lineDecorationsWidth: 4,
      lineNumbersMinChars: 2,
      foldingStrategy: "indentation" as const,
      readOnly,
      // domReadOnly SADECE readOnly için true. Misafir/özel mod için
      // Monaco iç DOM read-only (yazma yok) ama tıklama + cursor OK.
      domReadOnly: readOnly,
      // 📌 Vim tarzı cursor — kullanıcı isteği.
      // cursorStyle: "block" → karakterin tamamını kaplayan blok cursor
      // (vim'in normal mode'u gibi).
      // cursorBlinking: "solid" → ASLA sönmez, sürekli görünür. 'phase'/'smooth'
      // bazı Android Chrome build'lerinde cursor'u fade-out sırasında tamamen
      // görünmez yapıyordu — kullanıcı hareketi göremiyordu. Solid ile cursor
      // her zaman net, hareket ettiğinde eski/yeni pozisyon arasında geçiş gözle görülür.
      // Color saf beyaz — her zemin üzerinde görünür.
      cursorStyle: "block" as const,
      cursorBlinking: "solid" as const,
      cursorSmoothCaretAnimation: "off" as const,
      smoothScrolling: false,
      contextmenu: true,  // sağ tık menüsü açık (anti-cheat kaldırıldı)
      mouseWheelZoom: false,
      formatOnPaste: false,
      formatOnType: false,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      parameterHints: { enabled: true },
    };

    return (
      <div
        style={{
          height: typeof height === "number" ? `${height}px` : height,
          width: "100%",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10,
          overflow: "hidden",
          background: "#0a0e1a",
        }}
      >
        <MonacoEditor
          height="100%"
          language={language}
          value={value}
          theme={theme === "pythonDark" ? "vs-dark" : theme}
          options={options}
          onChange={(v: string | undefined) => {
            const next = v ?? "";
            onChangeRef.current(next);
          }}
          onMount={handleEditorDidMount}
        />
      </div>
    );
  }
);

// ─── Default Export (eski dosyalarla uyumluluk için) ─────────
export default CodeEditorMonaco;
