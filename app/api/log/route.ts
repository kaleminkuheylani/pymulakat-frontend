// app/api/log/route.ts
// Client-side runtime hatalarını backend'e göndermeden Vercel loglarına yazdırır.
// navigator.sendBeacon ile sayfa kapansa bile veri kaybolmaz.

import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface LogPayload {
  type: "error" | "warn" | "info";
  message: string;
  stack?: string;
  source?: string;     // "global-error" | "useEffect" | "click" | vs.
  url?: string;
  userAgent?: string;
  appVersion?: string;
  timestamp?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LogPayload;

    // Vercel'in runtime log'larına düşür (Functions → Logs'dan okunur)
    // eslint-disable-next-line no-console

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}