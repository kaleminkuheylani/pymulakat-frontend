import MaintenancePage from "../components/MaintenancePage";

// ═══════════════════════════════════════════════════════════
// Index Page — sadece maintenance görünümü.
// Tüm site bakımda: navigation, üyelik, içerik devre dışı.
// ═══════════════════════════════════════════════════════════

export default function Home() {
  return <MaintenancePage />;
}