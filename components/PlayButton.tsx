"use client";

import Link from "next/link";
import { useUser } from "../hooks/useUser";

interface Props {
  snippetSlug: string;
  className?: string;
}

/**
 * Snippet "Skill Ağacında Gör" butonu — koşullu rendering:
 *   - user giriş yapmışsa → /skill-agaci?focus=... (direkt ağaca)
 *   - user giriş yapmamışsa → /login?returnUrl=/skill-agaci (girişe yönlendir)
 *
 * Login sonrası otomatik olarak returnUrl'e dönüş sağlanır (login page tarafından).
 */
export default function PlayButton({ snippetSlug, className = "" }: Props) {
  const { user, loading } = useUser();

  const playHref = `/skill-agaci?focus=${encodeURIComponent(snippetSlug)}`;
  const returnUrl = `/skill-agaci`;
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
          ? "Skill ağacında gör"
          : "Görmek için giriş yap"
      }
      aria-label={
        user
          ? "Skill ağacında gör"
          : "Görmek için giriş yap"
      }
    >
      <span aria-hidden>▶</span>
      {user ? "Skill ağacında gör" : "Görmek için giriş"}
    </Link>
  );
}