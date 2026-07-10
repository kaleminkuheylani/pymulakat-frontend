// components/CategoryPageTemplate.tsx
// TÜM kategori sayfaları için paylaşılan görsel iskelet.
// python-kodlari, python-egitimi, python-online, python-algoritma-sorulari,
// python-dinamik-programlama — hepsi bu template'i kullanır.

import Link from "next/link";
import type { ReactNode } from "react";

export interface RelatedCategory {
  href: string;
  icon: string;
  title: string;
  description: string;
  /** Renk gradyanı: 'indigo-amber' | 'amber-indigo' */
  gradient?: "indigo-amber" | "amber-indigo";
}

export interface CategoryPageTemplateProps {
  /** Sayfa başlığı (H1) */
  title: string;
  /** Sayfa alt başlığı (paragraf) */
  subtitle: string;
  /** Header'daki chip etiketler */
  tags?: string[];
  /** Header'daki üst link (back) */
  backHref: string;
  backLabel: string;
  /** Sayfanın içerik gövdesi — her sayfa kendi grid'ini/editor'ünü koyar */
  children: ReactNode;
  /** İlgili kategoriler bölümü başlığı */
  relatedTitle?: string;
  /** İlgili kategoriler listesi (genelde 3-4 tane) */
  related?: RelatedCategory[];
  /** Opsiyonel: ekstra içerik (örn. "DP nedir?" bölümü) — children'dan önce render edilir */
  beforeRelated?: ReactNode;
  /** Opsiyonel: tag'ler için renk gradyanı */
  tagStyle?: "indigo" | "amber";
}

// ─── Tag chip stilleri ────────────────────────────────────────
const TAG_STYLES = {
  indigo: "text-xs px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300",
  amber: "text-xs px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300",
};

const GRADIENTS = {
  "indigo-amber": {
    card: "hover:border-amber-400/40",
    text: "group-hover:text-amber-400",
    arrow: "text-amber-400",
  },
  "amber-indigo": {
    card: "hover:border-indigo-400/40",
    text: "group-hover:text-amber-400",
    arrow: "text-indigo-400",
  },
};

export default function CategoryPageTemplate({
  title,
  subtitle,
  tags,
  backHref,
  backLabel,
  children,
  relatedTitle = "İlgili Kategoriler",
  related = [],
  beforeRelated,
  tagStyle = "indigo",
}: CategoryPageTemplateProps) {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* ─── HEADER ──────────────────────────────────────── */}
      <header className="bg-[#0a0e1a]/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-3 transition-colors"
          >
            ← {backLabel}
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">{title}</h1>
          <p className="text-white/70 text-base md:text-lg max-w-3xl leading-relaxed">{subtitle}</p>
          {tags && tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className={TAG_STYLES[tagStyle]}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ─── SAYFA-ÖZEL İÇERİK ──────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {children}

        {/* ─── OPSİYONEL: AÇIKLAMA BÖLÜMÜ ──────────────── */}
        {beforeRelated}

        {/* ─── İLGİLİ KATEGORİLER ──────────────────────── */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-white/10">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{relatedTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((r) => {
                const g = GRADIENTS[r.gradient || "indigo-amber"];
                return (
                  <Link
                    key={r.href}
                    href={r.href}
                    className={`group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all ${g.card}`}
                  >
                    <div className="text-3xl mb-3">{r.icon}</div>
                    <h3 className={`text-lg font-bold mb-2 transition-colors text-white ${g.text}`}>
                      {r.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed">{r.description}</p>
                    <div className={`mt-3 text-sm ${g.arrow} group-hover:translate-x-1 transition-transform`}>
                      Keşfet →
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
