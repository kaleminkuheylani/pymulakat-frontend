// app/blog/algoritma-labirenti/components/ProgressTopbar.tsx
//
// 2026-07-18: Sabit topbar — başlık + progress bar + yüzde.
// Scroll'da üstte sabit kalır, kullanıcı nerede olduğunu görür.

"use client";

import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";
import { TOTAL_MINUTES, SECTIONS } from "../data/sections";
import { useAlgProgress } from "../hooks/useProgress";

export default function ProgressTopbar() {
  const { completed, mounted, reset } = useAlgProgress();

  // Hydration mismatch'i önle — ilk render'da 0 göster
  if (!mounted) {
    return (
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#050816]/95 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>PYBlog</span>
          </Link>
          <div className="text-xs text-white/40">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  const total = SECTIONS.length;
  const done = completed.length;
  const percent = Math.round((done / total) * 100);
  const minutesLeft = TOTAL_MINUTES - Math.round((done / total) * TOTAL_MINUTES);

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-[#050816]/95 backdrop-blur-md">
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3 mb-2">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>PYBlog</span>
          </Link>
          <div className="flex items-center gap-3">
            {done === total ? (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                <Trophy className="w-3.5 h-3.5" />
                Tamamlandı
              </div>
            ) : (
              <div className="text-xs text-white/50">
                Bölüm {Math.min(done + 1, total)} / {total} · ~{minutesLeft} dk
              </div>
            )}
            {done > 0 && (
              <button
                type="button"
                onClick={reset}
                className="text-[10px] text-white/30 hover:text-rose-300 transition-colors"
                title="İlerlemeyi sıfırla"
              >
                Sıfırla
              </button>
            )}
          </div>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
