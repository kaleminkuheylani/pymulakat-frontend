// lib/admin/widgetRegistry.ts
// Admin dashboard widget registry — özelleştirilebilir widget sistemi.
//
// MİMARİ:
// - Her widget bir "tile" — başlık, icon, href, badge (sayı), açıklama
// - Widget kayıtları statik (typed registry, compile-time güvenli)
// - localStorage'da enable/disable + order (client customization)
// - Yeni widget eklemek: registry'ye entry ekle + path oluştur
//
// KULLANIM:
//   // Server component'te tüm widget'ları listele
//   import { getAllWidgets } from "@/lib/admin/widgetRegistry";
//   const widgets = getAllWidgets();
//
//   // Client component'te filtrele/sırala
//   import { WIDGET_REGISTRY, getAllWidgets } from "@/lib/admin/widgetRegistry";
//   const enabled = widgets.filter(w => isEnabled(w.id));

import type { LucideIcon } from "lucide-react";
import {
  ShieldCheck,
  FileText,
  Users,
  Activity,
  Wrench,
  Database,
  BarChart3,
  Bug,
  Code2,
  Trash2,
  Settings as SettingsIcon,
} from "lucide-react";

/**
 * Widget tanımı — registry entry.
 */
export interface AdminWidget {
  /** Benzersiz ID (localStorage key'lerde kullanılır) */
  id: string;
  /** Başlık (UI'da gösterilir) */
  title: string;
  /** Kısa açıklama */
  description: string;
  /** Icon (lucide) */
  icon: LucideIcon;
  /** Hedef route (admin altında) */
  href: string;
  /** Kategori (UI gruplandırma) */
  category: "audit" | "content" | "users" | "system";
  /** Default sıra numarası (küçük = üstte) */
  defaultOrder: number;
  /** Yalnızca super_admin mi? */
  superAdminOnly?: boolean;
  /** External route mi? (örn. /admin/test-diagnostics) */
  external?: boolean;
  /** Badge (sayı + label) — fetch'ten gelir, server component set eder */
  badge?: {
    label: string;
    variant: "default" | "warning" | "danger" | "success";
  };
}

/**
 * Static widget registry.
 * Yeni widget eklerken sadece buraya entry ekle + app/admin/[id]/page.tsx oluştur.
 */
export const WIDGET_REGISTRY: Record<string, AdminWidget> = {
  "question-audit": {
    id: "question-audit",
    title: "Question Audit",
    description: "Soru denetim durumu: kod üret, test çalıştır, audit_status güncelle.",
    icon: ShieldCheck,
    href: "/admin/audit",
    category: "audit",
    defaultOrder: 1,
    badge: { label: "QA", variant: "warning" },
  },
  "page-audit": {
    id: "page-audit",
    title: "Page Audit",
    description: "9 pillar + detay sayfalarının SEO, hız, ISR cache durumu.",
    icon: FileText,
    href: "/admin/page-audit",
    category: "audit",
    defaultOrder: 2,
    badge: { label: "SEO", variant: "default" },
  },
  "user-audit": {
    id: "user-audit",
    title: "User Audit",
    description: "Kullanıcı aktivitesi: kayıt, giriş, attempt, leaderboard.",
    icon: Users,
    href: "/admin/user-audit",
    category: "users",
    defaultOrder: 3,
    badge: { label: "USR", variant: "default" },
  },
  "test-diagnostics": {
    id: "test-diagnostics",
    title: "Test Diagnostics",
    description: "Detay sayfa fetch diagnostik: alan kontrol, status, error tracking.",
    icon: Bug,
    href: "/admin/test-diagnostics",
    category: "system",
    defaultOrder: 4,
    external: true,
  },
  "system-health": {
    id: "system-health",
    title: "System Health",
    description: "Backend durumu, Supabase bağlantı, Railway deploy, Vercel build.",
    icon: Activity,
    href: "/admin/system-health",
    category: "system",
    defaultOrder: 5,
    badge: { label: "OPS", variant: "success" },
  },
  "data-tools": {
    id: "data-tools",
    title: "Data Tools",
    description: "CSV ↔ DB senkron, bulk seed/delete, audit sıfırlama.",
    icon: Database,
    href: "/admin/data-tools",
    category: "content",
    defaultOrder: 6,
    superAdminOnly: true,
  },
  "bulk-audit": {
    id: "bulk-audit",
    title: "Bulk Audit",
    description: "Tüm pending soruları sırayla denetle (Mavis API maliyetli).",
    icon: Code2,
    href: "/admin/bulk-audit",
    category: "audit",
    defaultOrder: 7,
    badge: { label: "$$", variant: "warning" },
  },
  "settings": {
    id: "settings",
    title: "Settings",
    description: "Widget enable/disable, sıralama, admin yetki yönetimi.",
    icon: SettingsIcon,
    href: "/admin/settings",
    category: "system",
    defaultOrder: 99,
  },
};

/**
 * Tüm widget'ları defaultOrder'a göre sıralı getir.
 */
export function getAllWidgets(): AdminWidget[] {
  return Object.values(WIDGET_REGISTRY).sort((a, b) => a.defaultOrder - b.defaultOrder);
}

/**
 * Kategoriye göre widget'ları grupla.
 */
export function getWidgetsByCategory(): Record<AdminWidget["category"], AdminWidget[]> {
  const grouped: Record<AdminWidget["category"], AdminWidget[]> = {
    audit: [],
    content: [],
    users: [],
    system: [],
  };
  for (const w of getAllWidgets()) {
    grouped[w.category].push(w);
  }
  return grouped;
}

/**
 * localStorage key (client customization için).
 * Prefix ile çakışma önlenir.
 */
export const WIDGET_PREF_KEY = "pymulakat_admin_widgets_v1";

/**
 * Client-side tercih tipi.
 */
export interface WidgetPreference {
  /** Gizli widget ID'leri */
  hidden: string[];
  /** Manuel sıralama (sadece görünür olanlar) */
  order: string[];
}

/**
 * Default tercih (hiçbir şey gizli değil, default sıralama).
 */
export function getDefaultWidgetPreference(): WidgetPreference {
  return {
    hidden: [],
    order: getAllWidgets().map((w) => w.id),
  };
}
