"use client";

// CopyButton — Kod örneklerini kopyalamak için mini client component.

export default function CopyButton({ code }: { code: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          navigator.clipboard.writeText(code);
        }
      }}
      className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
    >
      📋 Kopyala
    </button>
  );
}