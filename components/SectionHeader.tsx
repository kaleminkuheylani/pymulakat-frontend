// components/SectionHeader.tsx
//
// Editorial h2 + accent line + lucide icon. python.org tarzı
// bölüm başlığı. Sayfa kararlılığı kuralına uygun: var olan
// bölüm başlıklarını değiştirmez, sadece görsel stili.

import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ icon: Icon, title, subtitle }: Props) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-white/50 text-sm md:text-base ml-[52px]">{subtitle}</p>
      )}
    </div>
  );
}
