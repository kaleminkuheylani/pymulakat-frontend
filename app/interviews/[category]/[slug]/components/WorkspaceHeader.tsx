// WorkspaceHeader — üst bar: breadcrumb, başlık, timer, pyodide status, user badge
//
// 2026-07-13 refactor: Eski "Sorular / #30" back butonu → proper breadcrumb.
//   - 3 seviye: Sorular > {Kategori} > {Soru}
//   - Sorular → /interviews (master list)
//   - {Kategori} → /{display} (top-level canonical, ISR pre-rendered)
//   - {Soru} → current (no link, strong)
//   - Lucide icon (span yok, emoji yok, no inline svg)

import Link from "next/link";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
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
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 min-w-0 flex-1"
      >
        <Link
          href="/interviews"
          className="flex items-center gap-1 text-white/60 hover:text-amber-300 transition-colors flex-shrink-0"
          aria-label="Tüm sorular"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="text-sm">Sorular</span>
        </Link>

        <ChevronRight className="w-3 h-3 text-white/30 flex-shrink-0" />

        <Link
          href={categoryUrl}
          className="text-sm text-white/60 hover:text-amber-300 transition-colors truncate hidden sm:inline"
          title={label}
        >
          {label}
        </Link>

        <ChevronRight className="w-3 h-3 text-white/30 flex-shrink-0 hidden sm:inline" />

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
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 font-mono text-sm">
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

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              pyStatus === "ready"
                ? "bg-green-400"
                : pyStatus === "loading"
                ? "bg-amber-400 animate-pulse"
                : pyStatus === "running"
                ? "bg-indigo-400 animate-pulse"
                : "bg-red-400"
            }`}
          />

            {pyStatus === "ready"
              ? "Python Hazır"
              : pyStatus === "loading"
              ? "Yükleniyor..."
              : pyStatus === "running"
              ? "Çalışıyor..."
              : "Hata"}

        </div>

        {user && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold">
              {(user.username || "U")[0].toUpperCase()}
            </div>
            <span className="text-xs text-indigo-200 font-medium">{user.username}</span>
          </div>
        )}
      </div>
    </header>
  );
}
