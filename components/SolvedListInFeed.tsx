// components/SolvedListInFeed.tsx
// In-Feed (native) reklam — server-render (2026-07-21).
//
// Soru listesinin 3. elemanindan sonra (4. pozisyon) eklenir.
// CTR optimizasyonu: dogal liste icinde, scroll sirasinda native gorunum.

import AdSense from "./AdSense";
import { ADSENSE_SLOTS, ADSENSE_PUB_ID } from "@/lib/adsenseSlots";

export default function SolvedListInFeed() {
  return (
    <li className="list-none">
      <AdSense
        client={ADSENSE_PUB_ID}
        slot={ADSENSE_SLOTS.IN_FEED}
        format="in-feed"
      />
    </li>
  );
}
