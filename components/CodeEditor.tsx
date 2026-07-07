"use client";

// CodeEditor.tsx — CodeMirror 6 wrapper (minimal version).
// Eski Monaco.tsx'in yerine geçti. Dış API aynı (CodeEditorRef) → caller'lar değişmiyor.
//
// Bu versiyonun farkı:
// - Vim keymap KALDIRILDI (prec/selection.main.anchor erişimleri patliyordu)
// - Custom syntax highlight KALDIRILDI (tags.function(variableName) erişimleri patliyordu)
// - Sadece python() + defaultKeymap + historyKeymap
// - oneDark tema (custom theme yerine — daha güvenli)
// - Tüm mount adımları try/catch + sentinel

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

// ─── Imperative API (caller'lar için değişmedi) ────────────────
export interface CodeEditorRef {
  getValue: () => string;
  setValue: (v: string) => void;
  focus: () => void;
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

// ─── CodeMirror dynamic import ─────────────────────────────────
let cmModulesPromise: Promise<any> | null = null;
async function loadCodeMirror() {
  if (cmModulesPromise) return cmModulesPromise;
  cmModulesPromise = (async () => {
    try {
      const [stateMod, viewMod, cmdMod, pyMod, acMod, themeMod] = await Promise.all([
        import("@codemirror/state").catch(() => null),
        import("@codemirror/view").catch(() => null),
        import("@codemirror/commands").catch(() => null),
        import("@codemirror/lang-python").catch(() => null),
        import("@codemirror/autocomplete").catch(() => null),
        import("@codemirror/theme-one-dark").catch(() => null),
      ]);

      if (!stateMod || !viewMod || !cmdMod || !pyMod) {
        throw new Error("CodeMirror core modülleri yüklenemedi");
      }

      return {
        EditorState: stateMod.EditorState,
        EditorView: viewMod.EditorView,
        // keymap @codemirror/view'da export ediliyor
        keymap: (viewMod as any).keymap,
        defaultKeymap: (cmdMod as any).defaultKeymap,
        history: cmdMod.history,
        historyKeymap: (cmdMod as any).historyKeymap,
        indentWithTab: (cmdMod as any).indentWithTab,
        // python language
        python: pyMod.python,
        // autocomplete (optional)
        autocompletion: acMod ? (acMod as any).autocompletion : null,
        closeBrackets: acMod ? (acMod as any).closeBrackets : null,
        closeBracketsKeymap: acMod ? (acMod as any).closeBracketsKeymap : [],
        // oneDark theme (optional, fallback: custom)
        oneDark: themeMod ? (themeMod as any).oneDark : null,
      };
    } catch (e) {
      // Cache temizle — tekrar deneyebilsin
      cmModulesPromise = null;
      throw e;
    }
  })();
  return cmModulesPromise;
}

// ═══════════════════════════════════════════════════════════════
export const CodeEditorMonaco = forwardRef<CodeEditorRef, Props>(
  function CodeEditorMonaco(
    {
      value,
      onChange,
      language = "python",
      height = "100%",
      readOnly = false,
      // theme prop korundu (eski API uyumu), oneDark kullanıyoruz
      theme = "vs-dark",
    },
    ref
  ) {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const viewRef = useRef<any>(null);
    const lastExternalValueRef = useRef<string>(value);
    const onChangeRef = useRef<typeof onChange>(onChange);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // onChange ref sync
    useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    // Imperative API — stabil, deps yok
    useImperativeHandle(
      ref,
      () => ({
        getValue: () => {
          const view = viewRef.current;
          if (view && view.state && view.state.doc) {
            try {
              return view.state.doc.toString();
            } catch {
              // proxy hatası olursa son bilinen değeri döndür
            }
          }
          return lastExternalValueRef.current;
        },
        setValue: (v: string) => {
          const view = viewRef.current;
          if (!view) return;
          try {
            if (view.state && view.state.doc) {
              const current = view.state.doc.toString();
              if (current !== v) {
                view.dispatch({
                  changes: { from: 0, to: view.state.doc.length, insert: v },
                });
              }
            }
          } catch {
            /* proxy hatası → yut */
          }
        },
        focus: () => {
          try {
            viewRef.current?.focus();
          } catch {
            /* ignore */
          }
        },
        layout: () => {
          try {
            const v = viewRef.current;
            if (v && typeof v.requestMeasure === "function") {
              v.requestMeasure();
            }
          } catch {
            /* ignore */
          }
        },
      }),
      []
    );

    // ── Mount: CodeMirror EditorView oluştur ──────────────────
    useEffect(() => {
      let cancelled = false;
      let cleanup: (() => void) | null = null;

      (async () => {
        try {
          const cm = await loadCodeMirror();
          if (cancelled) return;
          if (!hostRef.current) return;

          // Extensions — minimal set, defensive
          const extensions: any[] = [];

          // Editor history (undo/redo)
          try { extensions.push(cm.history()); } catch { /* ignore */ }

          // Keymap — sadece temel history + default
          try {
            const keymaps: any[] = [];
            if (cm.closeBracketsKeymap) keymaps.push(...cm.closeBracketsKeymap);
            if (cm.defaultKeymap) keymaps.push(...cm.defaultKeymap);
            if (cm.historyKeymap) keymaps.push(...cm.historyKeymap);
            if (cm.indentWithTab) keymaps.push(cm.indentWithTab);
            if (keymaps.length > 0) {
              extensions.push(cm.keymap.of(keymaps));
            }
          } catch { /* ignore */ }

          // Python language (best-effort)
          try {
            if (typeof cm.python === "function") {
              extensions.push(cm.python());
            }
          } catch { /* ignore */ }

          // Autocomplete (optional)
          try {
            if (cm.autocompletion) extensions.push(cm.autocompletion());
            if (cm.closeBrackets) extensions.push(cm.closeBrackets());
          } catch { /* ignore */ }

          // Theme — oneDark varsa onu kullan, yoksa custom minimal
          if (cm.oneDark) {
            extensions.push(cm.oneDark);
          } else {
            try {
              extensions.push(cm.EditorView.theme(
                {
                  "&": { backgroundColor: "#050816", color: "#e4e4e7" },
                  ".cm-content": { caretColor: "#ffffff" },
                },
                { dark: true }
              ));
            } catch { /* ignore */ }
          }

          // Update listener
          try {
            extensions.push(cm.EditorView.updateListener.of((update: any) => {
              if (update && update.docChanged) {
                try {
                  const newVal = update.state.doc.toString();
                  lastExternalValueRef.current = newVal;
                  onChangeRef.current(newVal);
                } catch {
                  /* ignore */
                }
              }
            }));
          } catch { /* ignore */ }

          // Readonly / editable
          try {
            extensions.push(cm.EditorState.readOnly.of(!!readOnly));
            extensions.push(cm.EditorView.editable.of(!readOnly));
          } catch { /* ignore */ }

          // Line wrapping
          try { extensions.push(cm.EditorView.lineWrapping); } catch { /* ignore */ }

          // View oluştur
          const state = cm.EditorState.create({
            doc: value || "",
            extensions,
          });

          const view = new cm.EditorView({
            state,
            parent: hostRef.current,
          });

          viewRef.current = view;
          lastExternalValueRef.current = value;
          setReady(true);

          cleanup = () => {
            try {
              view.destroy();
            } catch {
              // ignore
            }
            viewRef.current = null;
          };
        } catch (e: any) {
          // Hata olursa loading state'ten çık, error göster
          if (!cancelled) {
            let msg: string;
            try {
              msg = String(e?.message || e || "Editör yüklenemedi");
            } catch {
              msg = "Editör yüklenemedi";
            }
            setError(msg);
          }
        }
      })();

      return () => {
        cancelled = true;
        try { cleanup?.(); } catch { /* ignore */ }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Sadece mount'ta bir kez

    // ── External value sync (parent value değişirse) ──────────
    useEffect(() => {
      const view = viewRef.current;
      if (!view) {
        lastExternalValueRef.current = value;
        return;
      }
      try {
        if (view.state && view.state.doc) {
          const current = view.state.doc.toString();
          if (current !== value) {
            const sel = view.state.selection?.main;
            const anchor = sel && typeof sel.anchor === "number" ? sel.anchor : 0;
            view.dispatch({
              changes: { from: 0, to: view.state.doc.length, insert: value },
              selection: { anchor: Math.min(anchor, value.length) },
            });
          }
        }
      } catch {
        /* ignore */
      }
      lastExternalValueRef.current = value;
    }, [value]);

    // ── readOnly reaktif ──────────────────────────────────────
    useEffect(() => {
      const view = viewRef.current;
      if (!view) return;
      try {
        if (typeof view.setProps === "function") {
          view.setProps({ editable: !readOnly });
        }
      } catch {
        /* ignore */
      }
    }, [readOnly]);

    return (
      <div
        ref={hostRef}
        style={{
          height: typeof height === "number" ? `${height}px` : height,
          width: "100%",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10,
          overflow: "hidden",
          background: "#050816",
          touchAction: "manipulation",
          position: "relative",
        }}
      >
        {!ready && !error && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.4)",
              fontSize: "13px",
              fontFamily: "monospace",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  border: "3px solid rgba(99,102,241,0.25)",
                  borderTopColor: "#6366f1",
                  borderRadius: "50%",
                  animation: "cm-spin 1s linear infinite",
                  margin: "0 auto 8px",
                }}
              />
              Editör yükleniyor...
              <style>{`@keyframes cm-spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          </div>
        )}
        {error && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 16px",
              color: "rgba(248,113,113,0.9)",
              fontSize: "13px",
            }}
          >
            ⚠ {error}
          </div>
        )}
      </div>
    );
  }
);

// ─── Default Export (eski dosyalarla uyumluluk için) ─────────
export default CodeEditorMonaco;