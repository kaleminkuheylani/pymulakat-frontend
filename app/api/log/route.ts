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
    console.log(
      `[CLIENT-${body.type?.toUpperCase() || "LOG"}]`,
      JSON.stringify({
        message: body.message?.substring(0, 500),
        source: body.source,
        url: body.url,
        ua: body.userAgent?.substring(0, 200),
        appVersion: body.appVersion,
        timestamp: body.timestamp || Date.now(),
        stack: body.stack?.split("\n").slice(0, 5).join("\n"),
      })
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}