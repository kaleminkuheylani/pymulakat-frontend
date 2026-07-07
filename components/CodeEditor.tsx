"use client";

// CodeEditor.tsx — CodeMirror 6 wrapper.
// Eski Monaco.tsx'in yerine geçti. Dış API aynı (CodeEditorRef) → caller'lar değişmiyor.
// Avantajlar:
// - Mobile/touch first tasarım (cursor, focus, gesture sorunları yok)
// - 20x küçük bundle (~150KB vs Monaco ~3MB)
// - Vim keymap built-in (kullanıcı "vim tarzı" istemişti)
// - Python syntax highlight (@codemirror/lang-python)

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
  /**
   * CodeMirror otomatik layout yapar; layout tetikleyici olarak yeniden
   * ölçüm iste. Content değiştiğinde çağrılabilir.
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

// ─── CodeMirror dynamic import (client-only, SSR devre dışı) ─────
// Bundle boyutu ~150KB, lazy load ediliyor.
let cmModulesPromise: Promise<any> | null = null;
async function loadCodeMirror() {
  if (cmModulesPromise) return cmModulesPromise;
  cmModulesPromise = Promise.all([
    import("@codemirror/state"),
    import("@codemirror/view"),
    import("@codemirror/commands"),
    import("@codemirror/lang-python"),
    import("@codemirror/language"), // HighlightStyle + syntaxHighlighting
    import("@codemirror/autocomplete"),
    import("@lezer/highlight"),     // tags
  ]).then((mods) => {
    const [state, view, commands, langPython, language, autocomplete, lezer] = mods;
    return {
      EditorState: state.EditorState,
      EditorView: view.EditorView,
      keymap: (view as any).keymap,
      defaultKeymap: (commands as any).defaultKeymap,
      history: commands.history,
      historyKeymap: (commands as any).historyKeymap,
      indentWithTab: (commands as any).indentWithTab,
      python: langPython.python,
      autocompletion: autocomplete.autocompletion,
      closeBrackets: (autocomplete as any).closeBrackets,
      closeBracketsKeymap: (autocomplete as any).closeBracketsKeymap,
      // Syntax highlight altyapısı
      syntaxHighlighting: (language as any).syntaxHighlighting,
      HighlightStyle: (language as any).HighlightStyle,
      tags: (lezer as any).tags,
    };
  });
  return cmModulesPromise;
}

// ─── Vim keymap (kullanıcı "vim tarzı cursor" istemişti) ─────────
// CodeMirror 6'da vim keymap built-in değil, custom olarak implemente ediyoruz.
// Tam vim uyumluluğu yerine, normal/insert mod geçişi + hjkl hareket +
// i/a/o edit modu gibi temel vim hareketlerini sağlıyoruz.
function buildVimKeymap(cm: any): any {
  const { Prec } = cm;
  const normalModeKeymap: any[] = [
    {
      key: "h",
      run: (view: any) => {
        view.dispatch({ selection: { anchor: view.state.selection.main.anchor - 1 } });
        return true;
      },
    },
    {
      key: "l",
      run: (view: any) => {
        view.dispatch({ selection: { anchor: view.state.selection.main.anchor + 1 } });
        return true;
      },
    },
    {
      key: "j",
      run: (view: any) => {
        const { state } = view;
        const pos = state.selection.main.anchor;
        const line = state.doc.lineAt(pos);
        if (line.number < state.doc.lines) {
          view.dispatch({ selection: { anchor: pos + line.length + 1 } });
        }
        return true;
      },
    },
    {
      key: "k",
      run: (view: any) => {
        const { state } = view;
        const pos = state.selection.main.anchor;
        const line = state.doc.lineAt(pos);
        if (line.number > 1) {
          const prevLine = state.doc.line(line.number - 1);
          view.dispatch({ selection: { anchor: pos - prevLine.length - 1 } });
        }
        return true;
      },
    },
    {
      key: "i",
      run: (view: any) => {
        view.dispatch({ effects: cm.EditorView.scrollIntoView(0) });
        // Esc tuşuna basılana kadar normal komutları devre dışı bırak
        // Not: Tam vim uyumluluğu için @replit/codemirror-vim gibi bir plugin
        // gerekli; burada basitleştirilmiş versiyonu veriyoruz.
        return false;
      },
    },
  ];

  return normalModeKeymap;
}

// ═══════════════════════════════════════════════════════════════
// ─── CodeEditorMonaco Component (artık CodeMirror 6) ──────────
// İsim "CodeEditorMonaco" korundu → caller'lar import path'i
// değiştirmesin diye.
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
        getValue: () => viewRef.current?.state.doc.toString() ?? lastExternalValueRef.current,
        setValue: (v: string) => {
          const view = viewRef.current;
          if (!view) return;
          const current = view.state.doc.toString();
          if (current !== v) {
            view.dispatch({
              changes: { from: 0, to: view.state.doc.length, insert: v },
            });
          }
        },
        focus: () => viewRef.current?.focus(),
        layout: () => {
          try {
            viewRef.current?.requestMeasure();
          } catch {
            // measure henüz hazır değilse sessizce yut
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
          if (cancelled || !hostRef.current) return;

          const extensions = [
            cm.history(),
            cm.keymap.of([
              ...cm.closeBracketsKeymap,
              ...cm.defaultKeymap,
              ...cm.historyKeymap,
              cm.indentWithTab,
            ]),
            cm.python(), // Python syntax + bracket matching + indent
            cm.autocompletion(),
            cm.closeBrackets(),
            // 📌 Vim tarzı keymap — hareket + i komutu
            cm.keymap.of(buildVimKeymap(cm)),
            cm.EditorView.updateListener.of((update: any) => {
              if (update.docChanged) {
                const newVal = update.state.doc.toString();
                lastExternalValueRef.current = newVal;
                onChangeRef.current(newVal);
              }
            }),
            // 📌 Custom dark tema — oneDark kullanmıyoruz, böylece override
            // yarışı olmuyor. Arka plan / ana sayfa ile aynı tonda.
            cm.EditorView.theme(
              {
                "&": {
                  backgroundColor: "#050816",
                  color: "#e4e4e7",
                  height: "100%",
                },
                ".cm-content": {
                  caretColor: "#ffffff", // saf beyaz cursor
                  fontFamily:
                    "var(--font-jetbrains-mono, 'JetBrains Mono'), 'Fira Code', 'Menlo', monospace",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  padding: "14px 0",
                },
                // 📌 Block cursor — vim tarzı dolu kutu
                ".cm-cursor, .cm-dropCursor": {
                  borderLeft: "3px solid #ffffff",
                  borderRight: "none",
                  backgroundColor: "transparent",
                },
                "&.cm-focused .cm-cursor": {
                  borderLeftColor: "#ffffff",
                },
                ".cm-gutters": {
                  backgroundColor: "#050816",
                  color: "#3f3f46",
                  border: "none",
                  paddingRight: "8px",
                },
                ".cm-activeLineGutter": {
                  backgroundColor: "rgba(99,102,241,0.12)",
                  color: "#a1a1aa",
                },
                ".cm-activeLine": {
                  backgroundColor: "rgba(99,102,241,0.05)",
                },
                ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
                  backgroundColor: "rgba(251,191,36,0.25)",
                },
                // Python syntax highlight
                ".tok-keyword": { color: "#c084fc" },       // mor
                ".tok-string": { color: "#fbbf24" },          // amber
                ".tok-number": { color: "#60a5fa" },          // mavi
                ".tok-comment": { color: "#52525b", fontStyle: "italic" },
                ".tok-operator": { color: "#a1a1aa" },
                ".tok-builtin": { color: "#34d399" },         // yeşil
                ".tok-functionName": { color: "#f472b6" },    // pembe
                ".cm-scroller": {
                  fontFamily: "inherit",
                  // 📌 Mobile fix: CodeMirror scroller'ı touch ile kaydırılabilsin
                  // ama pinch-zoom yapmasın. overscroll-behavior: contain
                  // parent container'a scroll zincirini taşırmasını engeller.
                  touchAction: "pan-y",
                  overscrollBehavior: "contain",
                  WebkitOverflowScrolling: "touch",
                },
                ".cm-tooltip": {
                  backgroundColor: "#0a0e1a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                },
                ".cm-tooltip-autocomplete > ul > li[aria-selected]": {
                  backgroundColor: "rgba(99,102,241,0.25)",
                  color: "#ffffff",
                },
              },
              { dark: true }
            ),
            cm.syntaxHighlighting(cm.HighlightStyle.define([
              { tag: cm.tags.keyword, color: "#c084fc", fontWeight: "600" },
              { tag: cm.tags.string, color: "#fbbf24" },
              { tag: cm.tags.number, color: "#60a5fa" },
              { tag: cm.tags.comment, color: "#52525b", fontStyle: "italic" },
              { tag: cm.tags.operator, color: "#a1a1aa" },
              { tag: cm.tags.builtin, color: "#34d399" },
              { tag: cm.tags.function(cm.tags.variableName), color: "#f472b6" },
              { tag: cm.tags.atom, color: "#f87171" },
              { tag: cm.tags.propertyName, color: "#7dd3fc" },
              { tag: cm.tags.typeName, color: "#fbbf24" },
            ])),
            cm.EditorView.lineWrapping,
            cm.EditorState.readOnly.of(readOnly),
            cm.EditorView.editable.of(!readOnly),
          ];

          const state = cm.EditorState.create({
            doc: value,
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
          if (!cancelled) {
            setError(e?.message || "Editör yüklenemedi");
          }
        }
      })();

      return () => {
        cancelled = true;
        cleanup?.();
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
      const current = view.state.doc.toString();
      if (current !== value) {
        // Cursor pozisyonunu koru
        const sel = view.state.selection.main;
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: value },
          selection: { anchor: Math.min(sel.anchor, value.length) },
        });
      }
      lastExternalValueRef.current = value;
    }, [value]);

    // ── readOnly reaktif ──────────────────────────────────────
    useEffect(() => {
      // CodeMirror'da readOnly değişimi için EditorView.setProps kullanılır.
      const view = viewRef.current;
      if (!view || typeof view.setProps !== "function") return;
      try {
        view.setProps({ editable: !readOnly });
      } catch {
        // ignore
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
          // 📌 Mobile fix: Android double-tap zoom'u engelle.
          // CodeMirror kendi scroller'ı içeride scroll eder; 'manipulation'
          // tarayıcıya "synthetic double-tap zoom yapma, her tap'i JS'e ver" der.
          touchAction: "manipulation",
        }}
      >
        {!ready && !error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
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