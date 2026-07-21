// middleware.ts
// 2026-07-21: Middleware gecici olarak minimum (sadece www->apex redirect).
// Asenkron route guard'lar (server component + headers()) build hatasi olusturuyor.
// 2026-07-13'te "tek olsun her yerde sabit" URL convention aktif.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // 1) www -> apex (308 Permanent)
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.replace(/^www\./, "");
    url.protocol = "https";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
