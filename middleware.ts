import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { QUESTION_META } from "./lib/questionMeta";

// ═════════════════════════════════════════════════════════
// MIDDLEWARE — Canonical URL routing
// ═════════════════════════════════════════════════════════
// /interviews/{category}/{id}   → 308 /interviews/{category}/{slug}
// /interviews/{category}/{slug} → render (canonical, indexlenir)
// ═════════════════════════════════════════════════════════

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sadece /interviews/{category}/{id|slug} pattern'i
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
  matcher: ["/interviews/:category/:id"],
};