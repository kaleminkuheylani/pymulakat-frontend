"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../hooks/useUser";
import { usePageView } from "../hooks/usePageView";

export default function GlobalNav() {
  const { user, loading, logout } = useUser();
  usePageView();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Hide on auth pages (cleaner UX)
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname?.startsWith("/auth/");

  // Close menu on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (isAuthPage) return null;

  const initials = (user?.username || "U").slice(0, 1).toUpperCase();

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-[#050816]/80">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-amber-400 flex items-center justify-center shadow-md group-hover:shadow-amber-400/30 transition-shadow">
            PM
          </div>
          PythonMulakat
        </Link>

        {/* 2026-07-15: 'Sorular' linki kaldirildi (kullanici direktifi). Kategori
            listesi /interviews sayfasinda, footer/dashboard'da zaten erisilebilir. */}
        <div className="flex items-center gap-2 md:gap-3" />

        {loading ? (
            <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
          ) : user ? (
            // User badge + dropdown
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                  {initials}
                </div>
                <span className="text-sm text-white/90 font-medium hidden sm:block">
                  {user.username}
                </span>
                <svg className="w-3 h-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-[#0a0e1a]/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                  >
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-white truncate">{user.username}</p>
                      <p className="text-xs text-white/40 truncate">{user.email}</p>
                    </div>

                    {/* 📌 Dashboard / Sorular / Eğitimler linkleri kaldırıldı — merkeziyet
                        yerine sadelik tercih edildi. Dashboard'a doğrudan URL ile erişilir
                        veya oturum açma sonrası auto-redirect ile gelir. */}
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profilim
                    </Link>

                    <button
                      onClick={async () => {
                        setOpen(false);
                        // 📌 Bulletproof logout: önce tüm cookie + storage'i sil
                        await logout();
                        // router.push yerine hard reload → middleware fresh cookies'i
                        // okusun, stale state'le yarış kaybedilmesin
                        window.location.assign("/");
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Çıkış Yap
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            // Anonymous — show login/register
            <>
              <Link
                href="/login"
                className="text-white/70 hover:text-white text-sm font-medium transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#050816] font-bold text-xs md:text-sm rounded-lg transition-all"
              >
                Kayıt Ol
              </Link>
            </>
          )}
      </div>
    </nav>
  );
}