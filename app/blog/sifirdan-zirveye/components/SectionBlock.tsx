// app/blog/sifirdan-zirveye/components/SectionBlock.tsx
//
// 2026-07-18: Tek section — anlatım + örnek + interaktif soru.
// Kilitli ise sadece kilit ekranı gösterilir (anlatım/soru gizli).

"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Lock, Play, CheckCircle2, RotateCcw, HelpCircle, Sparkles, ArrowRight, Code2 } from "lucide-react";
import type { Section } from "../data/sections";
import { usePyodide, type TestCase } from "@/hooks/usePyodide";

interface Props {
  section: Section;
  index: number;
  total: number;
  locked: boolean;
  completed: boolean;
  onComplete: () => void;
}

export default function SectionBlock({
  section,
  index,
  total,
  locked,
  completed,
  onComplete,
}: Props) {
  const [code, setCode] = useState(section.exercise.starter);
  const [output, setOutput] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "running" | "pass" | "fail">("idle");
  const taRef = useRef<HTMLTextAreaElement>(null);

  const { status: pyStatus, errorMsg, runTests, runWithCustomInput } = usePyodide();
  const isPyLoading = pyStatus === "loading" || pyStatus === "idle";
  const isPyRunning = pyStatus === "running";

  // Test stratejisi: print() ciktisini yakalamak icin wrapper.
  // Section.exercise.expected'a gore iki mod:
  //   - expected bos degilse: print ciktisini wrap'leyerek karsilastir
  //   - Bu mini versiyon: kodu sarip print ciktisini disari ver
  const runTest = async () => {
    setOutput("");
    setStatus("running");
    try {
      // Kullanici kodunu sar — tum print'leri capture et
      // "from io import StringIO; sys.stdout = StringIO()" hacki yerine
      // Daha basit: kodu oldugu gibi calistir, Pyodide runTests fonksiyonu cagirir
      // Section'da function_name yok — print tabanli, ozel wrapper kullanalim
      const wrapped = `
import sys, io
_captured = io.StringIO()
_original_stdout = sys.stdout
sys.stdout = _captured
try:
    exec(${JSON.stringify(code)})
finally:
    sys.stdout = _original_stdout
_captured.getvalue()
`;
      const result = await runWithCustomInput(
        wrapped,
        "_runner",  // dummy function name
        []
      );
      const actual = typeof result.actual === "string" ? result.actual : String(result.actual ?? "");
      const expected = section.exercise.expected.trim();
      setOutput(actual);
      if (actual.trim() === expected) {
        setStatus("pass");
        onComplete();
      } else {
        setStatus("fail");
      }
    } catch (e: any) {
      setOutput(`Hata: ${e?.errorCategory ?? "bilinmeyen"} — ${e?.errorLine ?? ""}`);
      setStatus("fail");
    }
  };

  const reset = () => {
    setCode(section.exercise.starter);
    setOutput("");
    setStatus("idle");
  };

  // Kilitli: sadece placeholder
  if (locked) {
    return (
      <div
        id={section.id}
        className="mb-8 p-6 rounded-2xl border border-white/5 bg-white/[0.01] opacity-60"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/40">
            <Lock className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white/40">
              Bölüm {index + 1}: {section.title}
            </div>
            <div className="text-xs text-white/30 mt-0.5">
              Önceki bölümü tamamla
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      id={section.id}
      className={`mb-12 p-6 md:p-8 rounded-2xl border transition-colors ${
        completed
          ? "border-emerald-500/30 bg-emerald-500/[0.04]"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
            completed
              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
              : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
          }`}
        >
          {completed ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white">{section.title}</h2>
          <div className="text-xs text-white/40 mt-0.5">
            ~{section.estimatedMinutes} dakika
          </div>
        </div>
        {completed && (
          <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold">
            Tamamlandı
          </span>
        )}
      </div>

      {/* Anlatım */}
      <div className="space-y-3 mb-6 text-white/80 leading-relaxed text-[15px]">
        {section.anlatim.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* Örnek kod */}
      {section.ornek && (
        <div className="mb-6">
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-2 flex items-center gap-1.5">
            <Code2 className="w-3 h-3" />
            Örnek
          </div>
          <pre className="px-4 py-3 rounded-lg bg-[#0a0e1a] border border-white/10 overflow-x-auto text-[13px] leading-[1.7] font-mono text-white/85">
            <code>{section.ornek.code}</code>
          </pre>
        </div>
      )}

      {/* Soru başlığı */}
      <div className="mb-4 p-4 rounded-xl bg-amber-500/[0.08] border border-amber-500/25">
        <div className="text-[10px] uppercase tracking-widest text-amber-300 font-bold mb-1.5 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          Görev
        </div>
        <p className="text-sm text-white/90 leading-relaxed">
          {section.exercise.prompt}
        </p>
        <p className="text-[11px] text-white/50 mt-2 italic">
          Beklenen: {section.exercise.testLabel}
        </p>
      </div>

      {/* Editör */}
      <div className="mb-3">
        <textarea
          ref={taRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          rows={Math.max(4, code.split("\n").length + 1)}
          className="w-full px-4 py-3 rounded-lg bg-[#0a0e1a] border border-white/15 focus:border-amber-500/50 focus:outline-none font-mono text-[13px] leading-[1.7] text-white/95 resize-y"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={runTest}
          disabled={isPyLoading || status === "running"}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-bold transition-colors"
        >
          <Play className="w-3.5 h-3.5" />
          {isPyLoading
            ? "Hazırlanıyor..."
            : status === "running"
            ? "Çalışıyor..."
            : "Çalıştır ve Test Et"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-sm transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Sıfırla
        </button>
      </div>

      {/* Output */}
      {(output || status !== "idle") && (
        <div
          className={`rounded-lg border p-3 mb-3 ${
            status === "pass"
              ? "bg-emerald-500/[0.08] border-emerald-500/30"
              : status === "fail"
              ? "bg-rose-500/[0.08] border-rose-500/30"
              : "bg-white/[0.03] border-white/10"
          }`}
        >
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-1.5">
            Çıktı
          </div>
          <pre className="font-mono text-[13px] text-white/90 whitespace-pre-wrap break-words leading-relaxed">
            {output || "(boş)"}
          </pre>
          {status === "pass" && (
            <div className="text-xs text-emerald-300 mt-2 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Test geçti! Sonraki bölüm açıldı.
            </div>
          )}
          {status === "fail" && (
            <div className="text-xs text-rose-300 mt-2 font-semibold">
              Beklenen:{" "}
              <code className="px-1 py-0.5 rounded bg-black/30 text-rose-200">
                {section.exercise.expected}
              </code>
            </div>
          )}
        </div>
      )}

      {/* Yardım linki */}
      {section.yardimLink && (
        <div className="pt-3 border-t border-white/5">
          <Link
            href={section.yardimLink.href}
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-amber-300 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {section.yardimLink.label}
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </section>
  );
}
