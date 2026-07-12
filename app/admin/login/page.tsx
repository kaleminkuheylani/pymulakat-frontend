// app/admin/login/page.tsx
// Admin login — 2 aşamalı (password → TOTP).
//
// MİMARİ:
// - Aşama 1: email + password → mfa_token (5dk)
// - Aşama 2: mfa_token + 6-haneli TOTP → session cookie (8 saat)
// - MFA kurulu değilse: password sonrası direkt session + setup-mfa
// - Rate limit: 5/dk (backend)
// - Lockout: 5 fail → 15dk (backend)
//
// NOT: Bu sayfa /admin/*'in DIŞINDA — /admin/login route'u.
// app/admin/layout.tsx guard sadece /admin/{dashboard,...} için çalışır.

import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return <LoginClient />;
}
