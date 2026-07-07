import MaintenancePage from "../components/MaintenancePage";
import OriginalLanding from "./page-original";

// ═══════════════════════════════════════════════════════════
// Index Page — env-based toggle
// NEXT_PUBLIC_MAINTENANCE_MODE=1 → MaintenancePage
// (unset veya 0)               → OriginalLanding
// ═══════════════════════════════════════════════════════════

export default function Home() {
  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "1") {
    return <MaintenancePage />;
  }
  return <OriginalLanding />;
}