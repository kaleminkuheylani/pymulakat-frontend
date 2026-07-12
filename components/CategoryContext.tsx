// components/CategoryContext.tsx
// TÜM kategori sayfalarında paylaşılan "Context" bölümü.
// Her kategori için özgün, faydalı, özgün içerik (SEO + kullanıcı değeri).

import { ReactNode } from "react";
import { Target } from "lucide-react";

export interface ContextBlock {
  /** Bölüm başlığı (örn. "Python Temelleri Nedir?") */
  heading: string;
  /** Paragraflar (string veya JSX) */
  paragraphs: ReactNode[];
  /** Opsiyonel kod bloğu */
  code?: { language?: string; label?: string; content: string };
  /** Opsiyonel ipucu kutusu */
  tip?: { title?: string; text: ReactNode };
  /** Opsiyonel "ne zaman kullanılır" listesi */
  whenToUse?: { title: string; items: string[] };
}

export interface CategoryContextProps {
  /** Sayfa H1 başlığıyla aynı (örn. "Python Temelleri") */
  category: string;
  /** Bölüm başlığı (default: "{category} Nedir?") */
  heading?: string;
  /** İçerik blokları */
  blocks: ContextBlock[];
  /** Ek bağlantılar (ileri okuma) */
  furtherReading?: { label: string; href: string }[];
}

export default function CategoryContext({
  category,
  heading,
  blocks,
  furtherReading,
}: CategoryContextProps) {
  return (
    <section className="mt-16 pt-10 border-t border-white/10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        {heading || `${category} Nedir?`}
      </h2>

      <div className="prose prose-invert max-w-3xl text-white/70 leading-relaxed space-y-6">
        {blocks.map((b, i) => (
          <div key={i} className="space-y-4">
            {b.heading && (
              <h3 className="text-lg md:text-xl font-bold text-white mt-6">{b.heading}</h3>
            )}
            {b.paragraphs.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
            {b.code && (
              <div className="rounded-xl border border-white/10 bg-[#0a0e1a] overflow-hidden">
                {b.code.label && (
                  <div className="px-4 py-2 text-xs text-white/40 border-b border-white/5 font-mono">
                    {b.code.label}
                  </div>
                )}
                <pre className="p-4 overflow-x-auto text-sm text-white/85 font-mono leading-relaxed">
                  <code>{b.code.content}</code>
                </pre>
              </div>
            )}
            {b.tip && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4">
                <div className="flex gap-3">
                  💡
                  <div>
                    {b.tip.title && (
                      <div className="font-semibold text-amber-300 mb-1">{b.tip.title}</div>
                    )}
                    <div className="text-sm text-white/70">{b.tip.text}</div>
                  </div>
                </div>
              </div>
            )}
            {b.whenToUse && (
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04] p-4">
                <div className="font-semibold text-indigo-300 mb-2"><Target className="w-4 h-4 inline mr-1.5" /> {b.whenToUse.title}</div>
                <ul className="text-sm text-white/70 space-y-1.5 list-disc pl-5">
                  {b.whenToUse.items.map((it, k) => (
                    <li key={k}>{it}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {furtherReading && furtherReading.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="text-sm text-white/50 mb-3">📚 İleri Okuma</div>
          <div className="flex flex-wrap gap-3">
            {furtherReading.map((fr, i) => (
              <a
                key={i}
                href={fr.href}
                className="text-sm px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-colors"
              >
                {fr.label} →
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
