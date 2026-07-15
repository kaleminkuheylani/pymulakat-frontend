"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

/**
 * Theme toggle button — Sun/Moon lucide icon.
 * Default theme: dark (eski hali). Click ile light ↔ dark.
 * Hydration mismatch'i önlemek için sadece mounted=true iken render.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // SSR + initial client render: neutral icon göster (hydration mismatch yok)
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Tema değiştir"
        className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        suppressHydrationWarning
      >
        <Sun className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
      title={theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
      className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
