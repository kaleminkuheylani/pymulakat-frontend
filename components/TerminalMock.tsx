// components/TerminalMock.tsx
//
// Server-render, JS yok. Statik Python kodu satırları sırayla
// fade-in (CSS keyframe). Cursor blink animasyonu.
// Pyodide yüklendi hissi — "Running test 1/4..." gibi çıktı.
//
// Kural: "Görsel sunum güncellenebilir" → public SEO sayfa içeriği
// değişmez, sadece görsel. Bu mock metin/sıra dekoratiftir.

const lines: Array<{ type: "code" | "output" | "blank"; parts: Array<{ syn?: string; text: string }> }> = [
  // Line 1: def merge_dicts(d1, d2):
  {
    type: "code",
    parts: [
      { syn: "syn-kw", text: "def" },
      { syn: "syn-fn", text: " merge_dicts" },
      { syn: "syn-var", text: "(d1, d2):" },
    ],
  },
  // Line 2: result = d1.copy()
  {
    type: "code",
    parts: [
      { syn: "syn-var", text: "    result = d1." },
      { syn: "syn-fn", text: "copy" },
      { syn: "syn-var", text: "()" },
    ],
  },
  // Line 3: for k, v in d2.items():
  {
    type: "code",
    parts: [
      { syn: "syn-kw", text: "    for" },
      { syn: "syn-var", text: " k, v " },
      { syn: "syn-kw", text: "in" },
      { syn: "syn-var", text: " d2." },
      { syn: "syn-fn", text: "items" },
      { syn: "syn-var", text: "():" },
    ],
  },
  // Line 4: result[k] = result.get(k, 0) + v
  {
    type: "code",
    parts: [
      { syn: "syn-var", text: "        result[k] = result." },
      { syn: "syn-fn", text: "get" },
      { syn: "syn-var", text: "(k, 0) + v" },
    ],
  },
  // Line 5: return result
  {
    type: "code",
    parts: [
      { syn: "syn-kw", text: "    return" },
      { syn: "syn-var", text: " result" },
    ],
  },
  // Blank
  { type: "blank", parts: [{ text: "" }] },
  // Output line 1
  {
    type: "output",
    parts: [{ syn: "syn-out", text: "▶ Test 1/4 passed ✓" }],
  },
  // Output line 2
  {
    type: "output",
    parts: [{ syn: "syn-out", text: "▶ Test 2/4 passed ✓" }],
  },
  // Output line 3
  {
    type: "output",
    parts: [{ syn: "syn-out", text: "▶ Test 3/4 passed ✓" }],
  },
  // Output line 4
  {
    type: "output",
    parts: [{ syn: "syn-out", text: "▶ Test 4/4 passed ✓" }],
  },
  // Output line 5 — final result
  {
    type: "output",
    parts: [
      { syn: "syn-str", text: "✓ Tüm testler geçti · 12ms" },
    ],
  },
];

export default function TerminalMock() {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Glow effect behind */}
      <div
        className="absolute -inset-8 rounded-3xl opacity-30 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.4), transparent 60%)" }}
        aria-hidden
      />

      {/* Terminal window */}
      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#0a0e1a] shadow-2xl">
        {/* Window header — traffic light dots */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0f1420] border-b border-white/5">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[11px] font-mono text-white/40 tracking-wide">
              ~/interviews/list-dict · python 3.12
            </span>
          </div>
        </div>

        {/* Code body */}
        <div className="px-5 py-4 font-mono text-[13px] leading-relaxed">
          {lines.map((line, idx) => {
            if (line.type === "blank") {
              return <div key={idx} className="h-2" aria-hidden />;
            }
            const animClass =
              idx <= 4
                ? `anim-fade-up`
                : `anim-fade-in`;
            const delayMs = idx * 100;
            return (
              <div
                key={idx}
                className={animClass}
                style={{ animationDelay: `${delayMs}ms` }}
              >
                {line.type === "output" && (
                  <span className="text-white/30 mr-2">$</span>
                )}
                {line.parts.map((p, i) => (
                  <span key={i} className={p.syn || "syn-var"}>
                    {p.text}
                  </span>
                ))}
                {idx === 4 && (
                  <span className="cursor-blink inline-block w-2 h-3.5 bg-amber-400 ml-1 align-middle" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
