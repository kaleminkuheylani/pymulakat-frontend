import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ═════════════════════════════════════════════════════════
// MIDDLEWARE — Host + Canonical URL routing
// ═════════════════════════════════════════════════════════
// www.pythonmulakat.com -> 308 pythonmulakat.com (apex)
// /interviews/{category}/{id}   -> 308 /interviews/{category}/{slug}
// /interviews/{category}/{slug} -> render (canonical, indexlenir)
//
// CSV-only mimari: id→slug map CSV'den üretilir (raw primary + jsDelivr fallback).
// Backend DB'ye hiç bağlanmıyoruz. Vercel Edge runtime'da çalışır (10s timeout).
// ═════════════════════════════════════════════════════════

// Build time'da ve runtime'da idToSlug map'i lazy yükle.
// 1 saatlik revalidate — CSV'ye yeni soru eklenirse max 1 saat gecikmeyle canonical URL'ler güncellenir.

const CSV_PRIMARY = "https://raw.githubusercontent.com/kaleminkuheylani/pymulakat-backend/main/data/QUESTIONS-v3.csv";
const CSV_FALLBACK = "https://cdn.jsdelivr.net/gh/kaleminkuheylani/pymulakat-backend@main/data/QUESTIONS-v3.csv";

// Edge runtime'da title → slug üretici
function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ü/g, "u").replace(/ö/g, "o")
    .replace(/ş/g, "s").replace(/ç/g, "c").replace(/ğ/g, "g")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

let idToSlugCache: Map<number, string> | null = null;
let cacheTs = 0;
const CACHE_TTL = 3600 * 1000; // 1 saat

async function getIdToSlug(): Promise<Map<number, string>> {
  if (idToSlugCache && Date.now() - cacheTs < CACHE_TTL) {
    return idToSlugCache;
  }
  const map = new Map<number, string>();

  // CSV-only mimari: CSV = tek kaynak, backend'e hiç bağlanmıyoruz.
  // raw GitHub primary, jsDelivr fallback.
  for (const csvUrl of [CSV_PRIMARY, CSV_FALLBACK]) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(csvUrl, {
        signal: controller.signal,
        next: { revalidate: 3600 },
      });
      clearTimeout(timeout);
      if (!res.ok) continue;
      const text = await res.text();
      // Basit CSV parser — header-driven
      const rows: string[][] = [];
      let cur: string[] = [];
      let cell = "";
      let inQ = false;
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inQ) {
          if (c === '"') {
            if (text[i + 1] === '"') { cell += '"'; i++; } else inQ = false;
          } else cell += c;
        } else {
          if (c === '"') inQ = true;
          else if (c === ",") { cur.push(cell); cell = ""; }
          else if (c === "\n" || c === "\r") {
            if (c === "\r" && text[i + 1] === "\n") i++;
            cur.push(cell); cell = "";
            if (cur.length > 1 || cur[0] !== "") rows.push(cur);
            cur = [];
          } else cell += c;
        }
      }
      if (cell || cur.length) { cur.push(cell); rows.push(cur); }
      if (rows.length >= 2) {
        const h = rows[0];
        const idx = (k: string) => h.indexOf(k);
        for (const cols of rows.slice(1)) {
          const id = parseInt(cols[idx("id")] || "0", 10);
          const title = cols[idx("title")] || "";
          if (id > 0 && title) {
            map.set(id, slugifyTitle(title));
          }
        }
      }
      break;  // İlk başarılı kaynak yeterli
    } catch {
      // Diğer CSV kaynağını dene
    }
  }

  idToSlugCache = map;
  cacheTs = Date.now();
  return map;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // 0) Bakım modu — tüm sayfalar ana sayfaya yönlendir
  // NEXT_PUBLIC_REPAIR_MODE=1 ise aktif (production'da kaldırıp canlıya al)
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

  // 1.5) Auth-gated sayfalar: misafirler → /login (returnUrl ile geri döner)
  // Merkeziyet: SADECE /dashboard* ve /login member-only.
  // - /interviews, /interviews/{cat}, /interviews/{cat}/{id} → public (misafir görür, kod çalıştıramaz)
  // - /python-online, /python-egitimi, /python-kodlari → public (misafir görür, save/AI yapamaz)
  // - /dashboard → member-only (kişisel veri + submission/AI)
  // Detay sayfalar public: misafir Sorular → Online → Eğitimler sırasıyla gezer,
  // her bölümde "Üye ol & çalıştır/kaydet/AI" CTA'sı görür.
  const AUTH_GATED_PREFIXES = ["/dashboard"];
  const isGated = AUTH_GATED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isGated) {
    // 📌 Çok kaynaklı oturum kontrolü:
    // 1) Sentinel cookie 'pymulakat_auth' — useUser.ts mount + onAuthStateChange
    //    sırasında yazılır, 24 saat TTL. En güvenilir yöntem.
    // 2) Bilinen spesifik Supabase cookie isimleri
    // 3) Pattern fallback: tüm cookie'lerde auth pattern taranır
    //
    // Edge runtime'da localStorage erişilemez; Supabase SSR cookie naming
    // base64url encoding + chunking ile farklı varyasyonlar yaratıyor.
    // Bu yüzden sentinel cookie en başta kontrol edilir.

    let hasSession = false;

    // 1) Sentinel cookie (en güvenilir)
    const sentinel = request.cookies.get("pymulakat_auth")?.value;
    if (sentinel === "1") {
      hasSession = true;
    }

    // 2) Bilinen Supabase + legacy cookie isimleri
    if (!hasSession) {
      const KNOWN_NAMES = [
        "sb-pymulakat-auth-token",
        "sb-pymulakat-auth-token-code-verifier",
        "sb-lhuhfgpjbnngjxzlvywp-auth-token",
        "sb-lhuhfgpjbnngjxzlvywp-auth-token-code-verifier",
        "token",
      ];
      for (const name of KNOWN_NAMES) {
        const v = request.cookies.get(name)?.value;
        if (v && v.length > 0 && v !== "null" && v !== "undefined") {
          hasSession = true;
          break;
        }
      }
    }

    // 3) Pattern fallback: tüm cookie isimlerini tara
    if (!hasSession) {
      const allCookies = request.cookies.getAll();
      for (const c of allCookies) {
        if (
          /auth-token|access-token|jwt|sb-.*-auth/i.test(c.name) &&
          c.value &&
          c.value.length > 0 &&
          c.value !== "null" &&
          c.value !== "undefined"
        ) {
          hasSession = true;
          break;
        }
      }
    }

    if (!hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(url, 302);
    }
  }

  // 2) /interviews/{category}/{id} -> slug (308 Permanent)
  const match = pathname.match(/^\/interviews\/([a-z0-9-]+)\/([a-z0-9-]+)$/i);
  if (!match) {
    return NextResponse.next();
  }

  let [, category, idOrSlug] = match;

  // 2a) /interviews/{internal-slug} -> /{display-slug} (308 Permanent)
  // Detay sayfa breadcrumb/canonical internal slug kullanıyor, kullanıcı
  // /interviews/python-basics (Türkçe yerine İngilizce slug) tıklarsa
  // doğrudan /python-temelleri display URL'ine yönlendir.
  const INTERVIEW_TO_DISPLAY: Record<string, string> = {
    "python-basics": "/python-temelleri",
    "data-structures": "/python-veri-yapilari",
    "pandas": "/python-pandas",
    "list-dict": "/python-liste-sozluk",
    "heap": "/python-heap",
    "stack": "/python-stack",
    "queue": "/python-queue",
    "algorithms": "/python-algoritma-sorulari",
    "dynamic-programming": "/python-dinamik-programlama",
  };
  if (INTERVIEW_TO_DISPLAY[category]) {
    const url = request.nextUrl.clone();
    url.pathname = INTERVIEW_TO_DISPLAY[category];
    return NextResponse.redirect(url, 308);
  }

  // Legacy/deprecated category alias'lar (eski URL'leri canlı kategoriye yönlendir)
  const CATEGORY_ALIASES: Record<string, string> = {
    strings: "python-basics",        // strings → python-basics (deprecated)
  };
  if (CATEGORY_ALIASES[category]) {
    const url = request.nextUrl.clone();
    url.pathname = `/interviews/${CATEGORY_ALIASES[category]}/${idOrSlug}`;
    return NextResponse.redirect(url, 308);
  }

  // ⚠️ parseInt('0-1-knapsack') === 0, isNaN(0) === false → ID gibi davranip 404.
  //    Sadece /^\d+$/ ise ID kabul et, aksi halde slug (canonical, render).
  const isPureId = /^\d+$/.test(idOrSlug);
  if (!isPureId) {
    // Slug ise — canonical, geç
    return NextResponse.next();
  }

  // ID geldi — DB'den slug al
  const asNumber = parseInt(idOrSlug, 10);
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