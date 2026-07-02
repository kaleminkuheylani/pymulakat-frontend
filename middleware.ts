import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { QUESTION_META } from "./lib/questionMeta";

// ═════════════════════════════════════════════════════════
// MIDDLEWARE — Host + Canonical URL routing
// ═════════════════════════════════════════════════════════
// www.pythonmulakat.com -> 308 pythonmulakat.com (apex)
// /interviews/{category}/{id}   -> 308 /interviews/{category}/{slug}
// /interviews/{category}/{slug} -> render (canonical, indexlenir)
// ═════════════════════════════════════════════════════════

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // 1) www -> apex (308 Permanent)
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.replace(/^www\./, "");
    url.protocol = "https";
    return NextResponse.redirect(url, 308);
  }

  // 2) /interviews/{category}/{id} -> slug (308 Permanent)
  const match = pathname.match(/^\/interviews\/([a-z0-9-]+)\/([a-z0-9-]+)$/i);
  if (!match) {
    return NextResponse.next();
  }

  const [, category, idOrSlug] = match;

  // Eğer slug ise (parseInt NaN dönerse) — canonical, geç
  const asNumber = parseInt(idOrSlug, 10);
  if (isNaN(asNumber)) {
    return NextResponse.next();
  }

  // ID geldi — QuestionMeta'dan slug al
  const meta = QUESTION_META[asNumber];
  if (!meta || !meta.slug) {
    return NextFound();
  }

  // 308 Permanent Redirect (canonical, tarayıcı cache'ler)
  // ✅ Slug'ı URL-encode et (Türkçe karakterler dahil)
  const slugEncoded = encodeURIComponent(meta.slug);
  const url = request.nextUrl.clone();
  url.pathname = `/interviews/${category}/${slugEncoded}`;
  return NextResponse.redirect(url, 308);
}

// Yardımcı: sayfa render'a düşsün, page.tsx 404 versin
function NextFound() {
  return new NextResponse(null, { status: 404 });
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};