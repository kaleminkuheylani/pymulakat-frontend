import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ═════════════════════════════════════════════════════════
// MIDDLEWARE — Host + Canonical URL routing
// ═════════════════════════════════════════════════════════
// www.pythonmulakat.com -> 308 pythonmulakat.com (apex)
// /interviews/{category}/{id}   -> 308 /interviews/{category}/{slug}
// /interviews/{category}/{slug} -> render (canonical, indexlenir)
//
// DB source of truth: build time'da backend /api/v2/questions/all'dan map çekilir.
// Vercel Edge runtime'da çalışır (10s timeout).
// ═════════════════════════════════════════════════════════

const API = process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";

// Build time'da ve runtime'da idToSlug map'i lazy yükle.
// 1 saatlik revalidate — DB'de yeni soru eklenirse max 1 saat gecikmeyle canonical URL'ler güncellenir.
let idToSlugCache: Map<number, string> | null = null;
let cacheTs = 0;
const CACHE_TTL = 3600 * 1000; // 1 saat

async function getIdToSlug(): Promise<Map<number, string>> {
  if (idToSlugCache && Date.now() - cacheTs < CACHE_TTL) {
    return idToSlugCache;
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${API}/api/v2/questions/all?limit=500`, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      const map = new Map<number, string>();
      for (const q of data?.data || []) {
        if (typeof q.id === "number" && q.slug) {
          map.set(q.id, q.slug);
        }
      }
      idToSlugCache = map;
      cacheTs = Date.now();
      return map;
    }
  } catch {
    // Fallback: boş map → legacy ID URL'leri middleware'den geçer,
    // page.tsx 404 verir
  }
  return new Map();
}

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

  // 2) /interviews/{category}/{id} -> slug (308 Permanent)
  const match = pathname.match(/^\/interviews\/([a-z0-9-]+)\/([a-z0-9-]+)$/i);
  if (!match) {
    return NextResponse.next();
  }

  const [, category, idOrSlug] = match;
  const asNumber = parseInt(idOrSlug, 10);
  if (isNaN(asNumber)) {
    // Slug ise — canonical, geç
    return NextResponse.next();
  }

  // ID geldi — DB'den slug al
  const map = await getIdToSlug();
  const slug = map.get(asNumber);
  if (!slug) {
    return new NextResponse(null, { status: 404 });
  }

  const url = request.nextUrl.clone();
  url.pathname = `/interviews/${category}/${encodeURIComponent(slug)}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};