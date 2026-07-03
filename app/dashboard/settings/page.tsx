// app/dashboard/settings/page.tsx — Ayarlar (subscription yok)

"use client";

import { useUser } from "../../../hooks/useUser";
import { useState } from "react";

export default function SettingsPage() {
  const { user } = useUser();
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">⚙️ Ayarlar</h1>
        <p className="text-white/60 text-sm">Hesap bilgileri ve tercihleri</p>
      </div>

      {/* Hesap */}
      <Section title="👤 Hesap">
        <Row label="Kullanıcı adı" value={user.username} />
        <Row label="E-posta" value={user.email} />
        <Row label="Doğrulanmış" value={user.is_verified ? "✅ Evet" : "❌ Hayır"} />
        <Row label="Üyelik tarihi" value={new Date(user.created_at || Date.now()).toLocaleDateString("tr-TR")} />
      </Section>

      {/* Tercihler */}
      <Section title="🔔 Bildirim Tercihleri">
        <ToggleRow label="Yeni soru eklendiğinde bildir" defaultChecked />
        <ToggleRow label="Rehber güncellemeleri" defaultChecked />
        <ToggleRow label="Topluluk yanıtları" />
        <ToggleRow label="Haftalık özet e-postası" />
      </Section>

      {/* Gizlilik */}
      <Section title="🔒 Gizlilik">
        <Row label="Görünür profil" value="Herkese açık" />
        <Row label="Veri indirme" value={
          <a href="/api/v2/account/me/export" className="text-indigo-400 hover:underline text-sm">
            Hesap verilerini indir (JSON)
          </a>
        } />
        <Row label="Hesap silme" value={
          <a href="/dashboard/settings/delete" className="text-red-400 hover:underline text-sm">
            Hesabı sil (KVKK)
          </a>
        } />
      </Section>

      {saved && (
        <div className="fixed bottom-4 right-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 px-4 py-2 rounded-lg">
          ✅ Kaydedildi
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 space-y-3">
      <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wide">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-sm text-white/60">{label}</span>
      <span className="text-sm text-white font-medium">{value}</span>
    </div>
  );
}

function ToggleRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(!!defaultChecked);
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-sm text-white/80">{label}</span>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-indigo-500" : "bg-white/10"}`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}