// hooks/useSessionTracker.ts
// Workspace oturum süresi + streak takibi için reusable hook.
// 2026-07-20: Her 30sn'de ve sayfa kapanırken/unmount'ta kullanım süresini backend'e gönderir.

import { useEffect, useRef } from "react";
import { trackSession } from "@/lib/api/authAPI";

const SYNC_INTERVAL_MS = 30000; // 30 saniyede bir gönder

export function useSessionTracker(enabled: boolean) {
  const startRef = useRef<number>(0);
  const reportedRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const flush = async () => {
    if (!enabled || startRef.current === 0) return;
    const elapsed = Math.floor((Date.now() - startRef.current) / 1000) - reportedRef.current;
    if (elapsed <= 0) return;
    const ok = await trackSession(elapsed);
    if (ok?.ok) {
      reportedRef.current += elapsed;
    }
  };

  useEffect(() => {
    if (!enabled) return;
    startRef.current = Date.now();
    reportedRef.current = 0;

    intervalRef.current = setInterval(() => {
      flush();
    }, SYNC_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}
