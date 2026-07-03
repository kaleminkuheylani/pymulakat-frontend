// app/dashboard/page.tsx — Ana dashboard

"use client";

import { useUser } from "../../hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import OnboardingGate from "../../components/OnboardingGate";

export default function DashboardHome() {
  const { user } = useUser();
  const router = useRouter();
  const [recentForms, setRecentForms] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v2/forms?limit=3`)
      .then((r) => r.json())
      .then((d) => setRecentForms(d.data || []))
      .catch(() => {});
  }, []);

  if (!user) return null;

  return (
    <>
    <OnboardingGate userId={user.id}>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Merhaba, {user.username} 👋</h1>
        <p className="text-white/60 text-sm">Kişiselleştirilmiş akışın, önerilerin ve topluluk burada.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Toplam Deneme" value={user.total_attempts || 0} icon="📊" />
        <StatCard label="Başarılı" value={user.success_count || 0} icon="✅" />
        <StatCard label="Başarı Oranı" value={`%${Math.round((user.success_rate || 0) * 100)}`} icon="🎯" />
        <StatCard label="Puan" value={user.points || 0} icon="⭐" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <QuickLink href="/dashboard/flow" icon="🌊" title="Kişiselleştirilmiş Akış" description="Seviyene ve ilgine göre sıralı sorular" />
        <QuickLink href="/dashboard/recommendations" icon="✨" title="Öneriler" description="Sana özel içerik önerileri" />
        <QuickLink href="/dashboard/forms" icon="💬" title="Topluluk" description="Soru sor, kod paylaş, geri bildirim ver" />
        <QuickLink href="/dashboard/settings" icon="⚙️" title="Ayarlar" description="Hesap, gizlilik, bildirim tercihleri" />
      </div>

      {recentForms.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Son Topluluk Paylaşımları</h2>
          <div className="space-y-2">
            {recentForms.map((f) => (
              <Link key={f.id} href={`/dashboard/forms/${f.id}`} className="block bg-white/[0.03] border border-white/10 rounded-lg p-3 hover:bg-white/[0.05] transition-colors">
                <div className="text-sm font-medium text-white truncate">{f.title}</div>
                <div className="text-xs text-white/40 truncate">{f.body}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
    </OnboardingGate>
    </>
  );
}

function StatCard({ label, value, icon }: { label: string; value: any; icon: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/40">{label}</div>
    </div>
  );
}

function QuickLink({ href, icon, title, description }: { href: string; icon: string; title: string; description: string }) {
  return (
    <Link href={href} className="block bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-semibold text-white mb-1">{title}</div>
      <div className="text-xs text-white/60">{description}</div>
    </Link>
  );
}
