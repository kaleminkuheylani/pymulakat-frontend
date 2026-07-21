// middleware.ts
// /interviews/* için auth gate. Sadece kayıtlı kullanıcılar (pymulakat_auth sentinel cookie) erişebilir.
// /interviews/public hariç tutulur — o sayfa misafirler için herkese açık kalır.

import { NextRequest, NextResponse } from "next/server";

const SENTINEL = "pymulakat_auth";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // /interviews/public ve alt yollar herkese açık
  if (pathname === "/interviews/public" || pathname.startsWith("/interviews/public/")) {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.get(SENTINEL)?.value === "1";
  if (isAuthenticated) {
    return NextResponse.next();
  }

  const returnUrl = `${pathname}${search}`;
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("returnUrl", returnUrl);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/interviews/:path*"],
};
