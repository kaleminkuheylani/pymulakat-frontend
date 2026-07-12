// app/admin/settings/page.tsx
// Admin settings — widget enable/disable, localStorage reset, environment info.

import { Settings as SettingsIcon, RotateCcw } from "lucide-react";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-white/60 text-xs font-mono uppercase tracking-widest mb-2">
          <SettingsIcon className="w-4 h-4" />
          Settings
        </div>
        <h1 className="text-2xl font-bold mb-2">Admin Ayarları</h1>
        <p className="text-white/60 text-sm">
          Widget görünürlüğü, localStorage tercihi, environment bilgisi.
        </p>
      </div>

      <SettingsClient />
    </div>
  );
}
