import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ═════════════════════════════════════════════════════════
// MIDDLEWARE — Host + Canonical URL routing + pathname passthrough
// ═════════════════════════════════════════════════════════
// 2026-07-13: 'tek olsun her yerde sabit' direktifi
//   - TEK URL: /interviews/{category}/{slug}
//   - Top-level /temelleri vb. YOK
//
// 2026-07-21: x-pathname header eklendi (server component'lerin
//   pathname bilmesi icin — AdSenseMatchedContent route guard icin).
//   Bu sayede server-render'da pathname alinip reklam yasak sayfalarda
//   gosterilmez (anasayfa, dashboard, login, vs.).

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // 0) Bakım modu — tüm sayfalar ana sayfaya yönlendir
  if (process.env.NEXT_PUBLIC_REPAIR_MODE === "1") {
    if (pathname !== "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url, 302);
    }
    return NextResponse.next();
  }

  // 1) www -> apex (308 Permanent)
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.replace(/^www\./, "");
    url.protocol = "https";
    return NextResponse.redirect(url, 308);
  }

  // Request headers'a x-pathname ekle (server component'ler pathname'i okuyabilsin)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
