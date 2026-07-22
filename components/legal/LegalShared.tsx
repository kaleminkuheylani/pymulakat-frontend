import Link from "next/link";

export const LAST_UPDATED = "22 Temmuz 2026";
export const PLATFORM_NAME = "Python Mulakat";
export const PLATFORM_URL = "https://www.pythonmulakat.com";

export interface Section {
  num: string;
  title: string;
  content: React.ReactNode;
}

export function SectionBlock({ num, title, content }: Section) {
  return (
    <div className="border-l-2 border-zinc-800 pl-5 hover:border-zinc-600 transition-colors duration-200">
      <p className="font-mono text-[10px] tracking-widest text-zinc-600 mb-2 uppercase">
        {num}
      </p>
      <h2 className="text-[15px] font-semibold text-zinc-200 mb-3">{title}</h2>
      <div className="text-[14px] leading-relaxed text-zinc-400 space-y-3">
        {content}
      </div>
    </div>
  );
}

export function PartTitle({
  num,
  title,
  color = "cyan",
}: {
  num: string;
  title: string;
  color?: string;
}) {
  return (
    <div className="pt-8 pb-2 border-zinc-900 first:pt-0 first:border-t-0">
      <p
        className={`font-mono text-[11px] tracking-widest uppercase mb-1 ${
          color === "amber" ? "text-amber-500" : "text-cyan-500"
        }`}
      >
        BÖLÜM {num}
      </p>
      <h2 className="text-2xl font-bold text-zinc-100">{title}</h2>
    </div>
  );
}

export function LegalShell({
  badge,
  title,
  children,
  otherHref,
  otherLabel,
}: {
  badge: string;
  title: string;
  children: React.ReactNode;
  otherHref: string;
  otherLabel: string;
}) {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          <span className="font-mono text-[11px] text-zinc-500">{badge}</span>
        </div>

        <h1 className="text-3xl font-semibold text-zinc-100 mb-2">{title}</h1>
        <p className="font-mono text-[13px] text-zinc-600 mb-4">
          Son güncelleme: {LAST_UPDATED}
        </p>
        <p className="text-sm text-zinc-500 mb-14">
          Ayrıca bakın:{" "}
          <Link
            href={otherHref}
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
          >
            {otherLabel}
          </Link>
        </p>

        {children}

        <hr className="border-zinc-900 my-12" />
        <p className="font-mono text-[11px] text-zinc-700">
          Bu metinler 6698 sayılı Kişisel Verilerin Korunması Kanunu ve ilgili
          mevzuat kapsamında hazırlanmıştır. · Türkiye Cumhuriyeti
        </p>
      </div>
    </main>
  );
}
