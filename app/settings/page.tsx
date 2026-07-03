// app/settings/page.tsx — /settings alias
// Dashboard ayarlarına redirect eder (auth gerekli)

import { redirect } from "next/navigation";

export default function SettingsAlias() {
  redirect("/dashboard/settings");
}