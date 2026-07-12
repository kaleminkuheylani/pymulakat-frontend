// app/admin/layout.tsx
// Public layout (sadece children, sidebar yok) — /admin/login için.
// Protected layout (guard + sidebar): /admin/(protected)/layout.tsx
//
// MİMARİ (route group):
//   app/admin/
//     layout.tsx                    → bu dosya (public passthrough)
//     login/page.tsx                → /admin/login (guard YOK)
//     (protected)/                  → route group, URL'de gözükmez
//       layout.tsx                  → guard + sidebar
//       page.tsx                    → /admin dashboard
//       audit/                      → /admin/audit (vs.)

import { ReactNode } from "react";

export const dynamic = "force-dynamic";

interface LayoutProps {
  children: ReactNode;
}

export default function AdminPublicLayout({ children }: LayoutProps) {
  // Public passthrough — /admin/login ve diğer auth olmayan sayfalar
  // Protected rotalar (protected)/layout.tsx kendi guard + sidebar'ını ekler
  return <>{children}</>;
}
