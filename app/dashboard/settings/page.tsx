// app/dashboard/settings/page.tsx — Ayarlar (sadeleştirilmiş)
// Sadece çalışan özellikler: hesap bilgisi + hesap silme (KVKK).
// Olmayan bildirim toggle'ları / veri indirme / görünür profil kaldırıldı.

"use client";

import { useUser } from "../../../hooks/useUser";

export default function SettingsPage() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">⚙️ Ayarlar</h1>
        <p className="text-white/60 text-sm">Hesap bilgileri ve gizlilik</p>
      </div>

      {/* Hesap bilgileri */}
      <Section title="👤 Hesap">
        <Row label="Kullanıcı adı" value={user.username} />
        <Row label="E-posta" value={user.email} />
        <Row
          label="Doğrulanmış"
          value={user.is_verified ? "✅ Evet" : "❌ Hayır"}
        />
        <Row
          label="Üyelik tarihi"
          value={new Date(user.created_at || Date.now()).toLocaleDateString("tr-TR")}
        />
      </Section>

      <div className="text-xs text-white/30 text-center pt-4">
        Daha fazla ayar yakında eklenecek.
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 space-y-3">
      <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wide">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2 last:border-0">
      <span className="text-sm text-white/60">{label}</span>
      <span className="text-sm text-white font-medium">{value}</span>
    </div>
  );
}