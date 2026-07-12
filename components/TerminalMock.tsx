// components/TerminalMock.tsx
//
// Server-render, JS yok. **Typewriter animasyonlu** Python terminal:
// - Her satır sırayla typewriter ile yazılıyor (CSS keyframe width 0→100%)
// - Cursor blink (yanıp sönen imleç)
// - Kod yazıldıktan sonra test çıktıları sırayla görünür
// - Loop: animasyon bittikten sonra reset, baştan tekrar yazar
// Pyodide yüklendi hissi — "Running test 1/4..." gibi çıktı.

const lines: Array<{
  type: "code" | "output" | "blank";
  parts: Array<{ syn?: string; text: string }>;
  // Typewriter speed: yazılma süresi (ms)
  speed?: number;
}> = [
  // ── Prompt satırı: prompt + kod ─────────────────────────────
  {
    type: "code",
    parts: [
      { syn: "syn-prompt", text: ">>> " },
      { syn: "syn-kw", text: "def" },
      { syn: "syn-fn", text: " merge_dicts" },
      { syn: "syn-var", text: "(d1, d2):" },
    ],
    speed: 1200,
  },
  // ── Kod satırları (girintili) ──────────────────────────────
  {
    type: "code",
    parts: [
      { syn: "syn-var", text: "    result = d1." },
      { syn: "syn-fn", text: "copy" },
      { syn: "syn-var", text: "()" },
    ],
    speed: 900,
  },
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
    speed: 1200,
  },
  {
    type: "code",
    parts: [
      { syn: "syn-var", text: "        result[k] = result." },
      { syn: "syn-fn", text: "get" },
      { syn: "syn-var", text: "(k, 0) + v" },
    ],
    speed: 1100,
  },
  {
    type: "code",
    parts: [
      { syn: "syn-kw", text: "    return" },
      { syn: "syn-var", text: " result" },
    ],
    speed: 800,
  },
  // ── Boşluk + test çalıştır simülasyonu ────────────────────
  { type: "blank", parts: [{ text: "" }], speed: 300 },
  {
    type: "output",
    parts: [{ syn: "syn-out", text: "▶ Test 1/4..." }],
    speed: 600,
  },
  {
    type: "output",
    parts: [{ syn: "syn-out", text: "  ✓ passed (2ms)" }],
    speed: 400,
  },
  {
    type: "output",
    parts: [{ syn: "syn-out", text: "▶ Test 2/4..." }],
    speed: 500,
  },
  {
    type: "output",
    parts: [{ syn: "syn-out", text: "  ✓ passed (3ms)" }],
    speed: 400,
  },
  {
    type: "output",
    parts: [{ syn: "syn-out", text: "▶ Test 3/4..." }],
    speed: 500,
  },
  {
    type: "output",
    parts: [{ syn: "syn-out", text: "  ✓ passed (2ms)" }],
    speed: 400,
  },
  {
    type: "output",
    parts: [{ syn: "syn-out", text: "▶ Test 4/4..." }],
    speed: 500,
  },
  {
    type: "output",
    parts: [{ syn: "syn-out", text: "  ✓ passed (3ms)" }],
    speed: 400,
  },
  {
    type: "output",
    parts: [
      { syn: "syn-success", text: "✓ Tüm testler geçti · 10ms · +10 puan" },
    ],
    speed: 700,
  },
];

// Toplam animasyon süresi (CSS animation-delay ile hesaplanır)
function getTotalDuration(): number {
  return lines.reduce((acc, l) => acc + (l.speed || 400), 0) + 1500;
}

export default function TerminalMock() {
  const total = getTotalDuration();

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
          <div className="flex items-center gap-1.5 text-white/30 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            live
          </div>
        </div>

        {/* Code body — animasyonlu */}
        <div
          className="px-5 py-4 font-mono text-[13px] leading-relaxed min-h-[280px] terminal-loop"
          style={
            {
              // CSS custom property: animasyon döngü süresi
              "--loop-duration": `${total}ms`,
            } as React.CSSProperties
          }
        >
          {lines.map((line, idx) => {
            const animClass =
              idx <= 4
                ? `anim-typewriter`
                : `anim-output-pop`;
            // Cumulative delay (her satır önceki tamamlanır)
            let delayMs = 0;
            for (let i = 0; i < idx; i++) {
              delayMs += lines[i].speed || 400;
            }

            if (line.type === "blank") {
              return (
                <div
                  key={idx}
                  className={animClass}
                  style={{
                    animationDelay: `${delayMs}ms`,
                    animationDuration: "0ms",
                  }}
                  aria-hidden
                />
              );
            }

            return (
              <div
                key={idx}
                className={animClass}
                style={{
                  animationDelay: `${delayMs}ms`,
                  animationDuration: `${line.speed || 400}ms`,
                }}
              >
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

          {/* Running indicator (her zaman sonda) */}
          <div
            className="anim-running-pulse text-white/30 text-[11px] mt-1"
            style={{ animationDelay: `${total - 1500}ms` }}
          >
            <span className="cursor-blink">▌</span>
          </div>
        </div>
      </div>
    </div>
  );
}
