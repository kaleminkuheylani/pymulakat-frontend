// WorkspaceHeader — üst bar: breadcrumb, başlık, timer, pyodide status, user badge
//
// 2026-07-13 refactor: Eski "Sorular / #30" back butonu → proper breadcrumb.
//   - 3 seviye: Sorular > {Kategori} > {Soru}
//   - Sorular → /interviews (master list)
//   - {Kategori} → /{display} (top-level canonical, ISR pre-rendered)
//   - {Soru} → current (no link, strong)
//   - Lucide icon (span yok, emoji yok, no inline svg)

import Link from "next/link";
import { ChevronLeft, ChevronRight, Home, Code2, Zap, LayoutDashboard } from "lucide-react";
import { Question } from "@/lib/api/types";
import { UserResponse } from "@/hooks/useUser";
import { getCategoryUrl } from "@/lib/categorySlug";

interface HeaderProps {
  interview: Question;
  category: string;
  categoryLabel?: string; // DB'den gelen label (parent prop'tan)
  levelLabel: string;
  levelBg: string;
  levelColor: string;
  levelBorder: string;
  formattedTime: string;
  seconds: number;
  pyStatus: "idle" | "loading" | "ready" | "running" | "error";
  user: UserResponse | null;
  isGuest: boolean;
  onBack: () => void; // (geri butonu için, breadcrumb click'in alternatifi)
  // 2026-07-15: Language seçici (python|javascript)
  language: "python" | "javascript";
  onLanguageChange: (lang: "python" | "javascript") => void;
}

export default function WorkspaceHeader({
  interview,
  category,
  categoryLabel,
  levelLabel,
  levelBg,
  levelColor,
  levelBorder,
  formattedTime,
  seconds,
  pyStatus,
  user,
  onBack,
  language,
  onLanguageChange,
}: HeaderProps) {
  // 📌 interview undefined/null ise boş render et. SSR'da initial data
  // gelmediğinde burası crashlemesin.
  if (!interview) {
    return (
      <header className="h-14 bg-[#0a0e1a]/80 backdrop-blur-md flex items-center justify-between px-5 flex-shrink-0" />
    );
  }

  const label = categoryLabel ?? category;
  const categoryUrl = getCategoryUrl(category);
  const questionTitle = interview.title || `#${interview.id}`;

  return (
    <header className="h-14 bg-[#0a0e1a]/80 backdrop-blur-md flex items-center justify-between px-5 flex-shrink-0">
      {/* ─── Breadcrumb (Lucide icon, no span) ─── */}
      {/* Breadcrumb — mobile responsive: sadece soru basligi */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 min-w-0 flex-1"
      >
        <Link
          href="/interviews"
          className="hidden sm:flex items-center gap-1 text-white/60 hover:text-amber-300 transition-colors flex-shrink-0"
          aria-label="Tüm sorular"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="text-sm">Sorular</span>
        </Link>

        <ChevronRight className="w-3 h-3 text-white/30 flex-shrink-0 hidden sm:inline" />

        <Link
          href={categoryUrl}
          className="text-sm text-white/60 hover:text-amber-300 transition-colors truncate hidden md:inline"
          title={label}
        >
          {label}
        </Link>

        <ChevronRight className="w-3 h-3 text-white/30 flex-shrink-0 hidden md:inline" />

        <strong
          className="text-sm text-white font-medium truncate"
          title={questionTitle}
        >
          {questionTitle}
        </strong>

        <span
          className="px-2 py-0.5 rounded-md text-[10px] font-semibold border flex-shrink-0 ml-1"
          style={{ background: levelBg, color: levelColor, borderColor: levelBorder }}
        >
          {levelLabel}
        </span>
      </nav>

      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Timer — sadece sm: ve ustu (mobile'da gizli) */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 font-mono text-sm">
          <svg className="w-3.5 h-3.5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth={2} />
            <polyline points="12 6 12 12 16 14" strokeWidth={2} />
          </svg>
          <span
            className={
              seconds > 1200
                ? "text-red-400"
                : seconds > 600
                ? "text-amber-400"
                : "text-white/70"
            }
          >
            {formattedTime}
          </span>
        </div>

        {/* 2026-07-16: Dil seçici (Python/JS) — mobile responsive
            mobile: sadece icon, desktop: icon + text */}
        <div
          className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10"
          role="group"
          aria-label="Dil seçici"
        >
          <button
            type="button"
            onClick={() => onLanguageChange("python")}
            aria-pressed={language === "python"}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              language === "python"
                ? "bg-amber-500/20 text-amber-200"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
            title="Python (Pyodide)"
          >
            <Code2 className="w-3 h-3" />
            <span className="hidden sm:inline">Python</span>
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange("javascript")}
            aria-pressed={language === "javascript"}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              language === "javascript"
                ? "bg-amber-500/20 text-amber-200"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
            title="JavaScript (Web Worker)"
          >
            <Zap className="w-3 h-3" />
            <span className="hidden sm:inline">JavaScript</span>
          </button>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors text-xs"
          title="Dashboard'a dön"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        {user && (
          <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold">
              {(user.username || "U")[0].toUpperCase()}
            </div>
            <span className="hidden md:inline text-xs text-indigo-200 font-medium">{user.username}</span>
          </div>
        )}
      </div>
    </header>
  );
}
