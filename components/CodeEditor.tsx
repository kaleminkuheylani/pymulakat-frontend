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

// 2026-07-15: Language extension builder
// python → cm.python() (lang-python, gelismis Python highlight)
// javascript → cm.javascriptLanguage (StreamLanguage.define() wrap edilmis, JS highlight)
function buildLanguageExt(cm: any, lang: string): any[] {
  const exts: any[] = [];
  if (lang === "javascript") {
    try {
      if (cm.javascriptLanguage) {
        exts.push(cm.javascriptLanguage);
      }
    } catch { /* ignore */ }
    // ESLint gibi llm-eslint YOK, sadece basic syntax highlight + bracket match
  } else {
    // default: python
    try {
      if (typeof cm.python === "function") {
        exts.push(cm.python());
      }
    } catch { /* ignore */ }
  }
  return exts;
}

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
      const [stateMod, viewMod, cmdMod, pyMod, jsMod, langMod, acMod, themeMod] = await Promise.all([
        import("@codemirror/state").catch(() => null),
        import("@codemirror/view").catch(() => null),
        import("@codemirror/commands").catch(() => null),
        import("@codemirror/lang-python").catch(() => null),
        import("@codemirror/legacy-modes/mode/javascript").catch(() => null),
        import("@codemirror/language").catch(() => null),
        import("@codemirror/autocomplete").catch(() => null),
        import("@codemirror/theme-one-dark").catch(() => null),
      ]);

      if (!stateMod || !viewMod || !cmdMod || !pyMod) {
        throw new Error("CodeMirror core modülleri yüklenemedi");
      }

      // 2026-07-15: StreamParser → StreamLanguage.define() ile wrap et
      // Direkt push edilemez ("Unrecognized extension value" hatasi)
      let javascriptLanguage: any = null;
      try {
        if (jsMod && (jsMod as any).javascript && langMod && (langMod as any).StreamLanguage) {
          javascriptLanguage = (langMod as any).StreamLanguage.define((jsMod as any).javascript);
        }
      } catch { /* ignore */ }

      return {
        EditorState: stateMod.EditorState,
        EditorView: viewMod.EditorView,
        Compartment: (stateMod as any).Compartment,
        // keymap @codemirror/view'da export ediliyor
        keymap: (viewMod as any).keymap,
        defaultKeymap: (cmdMod as any).defaultKeymap,
        history: cmdMod.history,
        historyKeymap: (cmdMod as any).historyKeymap,
        indentWithTab: (cmdMod as any).indentWithTab,
        // language modes
        python: pyMod.python,
        // JavaScript: StreamLanguage.define() ile wrap edilmis (extension-compatible)
        // 2026-07-15: Workspace JS runtime dispatch icin
        javascriptLanguage,
        // autocomplete (optional) — TUM diller icin
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

          // 2026-07-15: Language dispatch — python|javascript (Compartment ile dinamik)
          // Once Compartment olustur, sonra initial language'i yukle
          let languageCompartment: any = null;
          try {
            if (cm.Compartment) {
              languageCompartment = new cm.Compartment();
              extensions.push(languageCompartment.of(buildLanguageExt(cm, language)));
              // mount sonrasi setLanguage icin disariya acmak gerekirse ref tut
              (viewRef as any).languageCompartment = languageCompartment;
              (viewRef as any).cm = cm;
            } else {
              // Compartment yoksa fallback: initial language
              extensions.push(buildLanguageExt(cm, language));
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
            // Önce view'i yok et (CodeMirror kendi DOM'unu parent'tan söker)
            try {
              view.destroy();
            } catch {
              // ignore — view zaten yoksa yut
            }
            // React host container'ı unmount sırasında kaldırır;
            // manuel firstChild silme React'e ait düğümleri (örn. spinner) bozar.
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

    // 2026-07-15: Language degisimi (python → javascript veya tam tersi)
    // Compartment.reconfigure ile editor remount etmeden syntax degistir
    // 2026-07-16: Console'a debug log (production'da 'syntax error' goren kullanici icin)
    useEffect(() => {
      const view = viewRef.current;
      if (!view) return;
      const compartment = (viewRef as any).languageCompartment;
      const cm = (viewRef as any).cm;
      if (!compartment || !cm) return;
      try {
        const newExts = buildLanguageExt(cm, language);
        // 2026-07-16: Dil degisimi logu (debug)
        if (typeof window !== "undefined" && (window as any).__pyMulakatDebug) {
          // eslint-disable-next-line no-console
        }
        view.dispatch({ effects: compartment.reconfigure(newExts) });
      } catch (e) {
        // 2026-07-16: Hata olursa logla (debug)
        // eslint-disable-next-line no-console
      }
    }, [language]);

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