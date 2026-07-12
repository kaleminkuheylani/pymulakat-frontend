"use client";

import Link from "next/link";
import { useUser } from "../hooks/useUser";

interface Props {
  snippetSlug: string;
  className?: string;
}

/**
 * Snippet "Online editörde çalıştır" butonu — koşullu rendering:
 *   - user giriş yapmışsa → /python-online?snippet=... (direkt editöre)
 *   - user giriş yapmamışsa → /login?returnUrl=/python-kodlari#snippet (girişe yönlendir)
 *
 * Login sonrası otomatik olarak returnUrl'e dönüş sağlanır (login page tarafından).
 */
export default function PlayButton({ snippetSlug, className = "" }: Props) {
  const { user, loading } = useUser();

  const playHref = `/python-online?snippet=${encodeURIComponent(snippetSlug)}`;
  const returnUrl = `/python-kodlari#${snippetSlug}`;
  const targetHref = user ? playHref : `/login?returnUrl=${encodeURIComponent(returnUrl)}`;

  return (
    <Link
      href={targetHref}
      className={
        "inline-flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-colors " +
        className
      }
      title={
        loading
          ? "Yükleniyor..."
          : user
          ? "Tarayıcıda çalıştır"
          : "Çalıştırmak için giriş yap"
      }
      aria-label={
        user
          ? "Online editörde çalıştır"
          : "Çalıştırmak için giriş yap"
      }
    >
      <span aria-hidden>▶</span>
      {user ? "Online editörde çalıştır" : "Çalıştırmak için giriş"}
    </Link>
  );
}