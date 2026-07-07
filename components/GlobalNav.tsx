"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../hooks/useUser";

export default function GlobalNav() {
  const { user, loading, logout } = useUser();
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
            <span className="text-white font-bold text-xs">PM</span>
          </div>
          <span className="text-white font-bold text-base hidden sm:block">PythonMulakat</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/interviews"
            className="text-white/70 hover:text-white text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
          >
            Sorular
          </Link>
          <Link
            href="/python-kodlari"
            className="text-white/70 hover:text-white text-xs sm:text-sm font-medium transition-colors whitespace-nowrap hidden sm:inline"
          >
            Kodlar
          </Link>
          <Link
            href="/python-egitimi"
            className="text-white/70 hover:text-white text-xs sm:text-sm font-medium transition-colors whitespace-nowrap hidden sm:inline"
          >
            Eğitim
          </Link>
          <Link
            href="/python-online"
            className="text-amber-300 hover:text-amber-200 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap"
          >
            Online
          </Link>
          {/* 📌 /guides kaldırıldı — rehberler artık /python-egitimi içinde. */}
        </div>

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

                    {/* 📌 Dashboard linki — belirgin gradient CTA, dropdown'un ilk öğesi */}
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500/30 to-purple-500/30 hover:from-indigo-500/40 hover:to-purple-500/40 transition-colors"
                    >
                      <span className="text-base">✨</span>
                      <span>Akışım</span>
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold">
                        YENİ
                      </span>
                    </Link>

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

                    <Link
                      href="/interviews"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition-colors md:hidden"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Sorular
                    </Link>

                    <Link
                      href="/python-egitimi"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Eğitim
                    </Link>

                    <button
                      onClick={async () => {
                        setOpen(false);
                        await logout();
                        router.push("/");
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