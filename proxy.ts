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

// 2026-07-13 refactor (kullanici direktifi "seoyu kırıyor"):
//   Canonical = DB slug (İngilizce, kısa): /python-basics, /heap, /pandas
//   Legacy display URL → 308 → canonical: /temelleri → /python-basics
//   app/[category]/page.tsx tek dinamik route, 8 DB slug pre-render
//   /interviews/{db} eski canonical → 308 → /{db} (canonical)
//   /{db}/[slug] → 308 → /interviews/{db}/{slug} (soru detay hâlâ orada)
// Mapping tek kaynak: lib/categorySlug (DRY prensibi)
import { legacyDisplayToDb, getCategoryUrl, isCanonicalCategory } from "@/lib/categorySlug";

export async function proxy(request: NextRequest) {
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

  // 0.5) URL case-insensitive: uppercase varsa → lowercase 308
  // /ADMIN/LOGIN gibi caps URL'ler Next.js'te 404 verir (case-sensitive).
  // Tüm path segment'leri lowercase + redirect. Query string korunur.
  // (2026-07-13: ahmet33589 user 404 aldı /ADMIN/LOGIN'de — cap-sensitive sorun)
  if (pathname !== pathname.toLowerCase()) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 308);
  }

  // 0.75) Oturum açıksa anasayfa -> dashboard (302)
  if (pathname === "/") {
    const sentinel = request.cookies.get("pymulakat_auth")?.value;
    if (sentinel === "1") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url, 302);
    }
  }

  // 1) www -> apex (308 Permanent)
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.replace(/^www\./, "");
    url.protocol = "https";
    return NextResponse.redirect(url, 308);
  }

  // 1b) /{db-or-legacy}/{slug} → /interviews/{db}/{slug} (308)
  // Soru detay URL'i hâlâ /interviews/{db}/{slug} canonical.
  // Hem canonical (heap, pandas) hem legacy display (temelleri, veri-yapilari)
  //   formları kabul edilir, hepsi DB slug'a normalize edilip redirect olur.
  //   /heap/palindrom-kontrol → /interviews/heap/palindrom-kontrol
  //   /temelleri/palindrom-kontrol → /interviews/python-basics/palindrom-kontrol
  //
  // KRITIK (2026-07-13 fix): Önceki kod tanınmayan pillar'lar için 404
  //   dönüyordu — bu /admin/login, /admin/audit, /about/team gibi gerçek
  //   sayfaları da yiyordu. Şimdi: pillar TANINMIYORSA → NextResponse.next()
  //   (Next.js kendi route tablosuna baksın, static 404 mü render mı karar versin).
  //   Pillar tanınıyorsa → 308 redirect. Başka path'ler için middleware dokunmaz.
  const topLevelPillarSlugMatch = pathname.match(
    /^\/([a-z0-9-]+)\/([a-z0-9-]+)$/i
  );
  if (topLevelPillarSlugMatch) {
    const [, pillarSlug, slug] = topLevelPillarSlugMatch;
    const dbCat = legacyDisplayToDb(pillarSlug);
    if (dbCat) {
      // Tanınan pillar (canonical veya legacy) → /interviews/{db}/{slug} (308)
      const url = request.nextUrl.clone();
      url.pathname = `/interviews/${dbCat}/${slug}`;
      return NextResponse.redirect(url, 308);
    }
    // Tanınmayan top-level (admin, about, login, dashboard, ...) →
    //   Next.js kendi route tablosuna baksın. Eğer page varsa render,
    //   yoksa Next.js'in kendi 404'ü devreye girer. Burada 404 DÖNME!
    return NextResponse.next();
  }

  // 1c) /{db-or-legacy} (no sub-segment) → 308 → canonical DB slug URL
  //   /heap        → /heap        (zaten canonical, no-op redirect)
  //   /temelleri   → /python-basics  (legacy)
  //   /python-temelleri → /python-basics  (legacy alias)
  // Canonical zaten DB slug ise bile 308 ile kendisine redirect etmek
  //   zarar vermez (idempotent), tutarlılık sağlar.
  // app/[category]/page.tsx zaten pre-rendered, buradaki redirect gereksiz
  //   görünebilir ama Edge'de static path match daha hızlıdır.
  //
  // NOT (2026-07-13): Bilinmeyen top-level (about, admin, login, dashboard...)
  //   fall-through → NextResponse.next(). Middleware her sayfada çalışır
  //   (matcher pattern: /((?!_next|api|favicon.ico).*)); tanınmayan path'ler
  //   için Next.js kendi route tablosuna baksın, oradan 404 döner.
  const topLevelPillarOnlyMatch = pathname.match(/^\/([a-z0-9-]+)$/i);
  if (topLevelPillarOnlyMatch) {
    const pillarSlug = topLevelPillarOnlyMatch[1];
    const dbCat = legacyDisplayToDb(pillarSlug);
    if (dbCat && !isCanonicalCategory(pillarSlug)) {
      // Legacy display URL → canonical DB slug (308)
      const url = request.nextUrl.clone();
      url.pathname = getCategoryUrl(dbCat);
      return NextResponse.redirect(url, 308);
    }
    // Canonical DB slug ise → app/[category]/page.tsx render eder
    if (dbCat && isCanonicalCategory(pillarSlug)) {
      return NextResponse.next();
    }
    // Bilinmeyen top-level (admin, about, login, ...) →
    //   Middleware dokunmaz, Next.js kendi route tablosuna baksın.
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

  // 2) /interviews/{db} (no sub-segment) → /{db} (308)
  // Eski canonical /interviews/{db} → yeni canonical /{db} konsolidasyon.
  // Canonical URL artık top-level DB slug, redirect ile oraya yönlendirilir.
  const interviewCategoryOnly = pathname.match(/^\/interviews\/([a-z0-9-]+)$/i);
  if (interviewCategoryOnly) {
    const dbSlug = interviewCategoryOnly[1];
    // 2026-07-21: python-basics DB'de yok (CATEGORY_SLUGS'tan kaldirildi,
    //   scope'lar temizlendi), ama /interviews/python-basics URL'ine
    //   Google'dan trafik gelebilir. Legacy alias → /programlama-temelleri.
    // 2026-07-21: pandas tamamen kaldirildi → /programlama-temelleri.
    const LEGACY_TO_CANONICAL: Record<string, string> = {
      "python-basics": "programlama-temelleri",
      "pandas": "programlama-temelleri",
    };
    if (LEGACY_TO_CANONICAL[dbSlug]) {
      const url = request.nextUrl.clone();
      url.pathname = getCategoryUrl(LEGACY_TO_CANONICAL[dbSlug]);
      return NextResponse.redirect(url, 308);
    }
    if (isCanonicalCategory(dbSlug)) {
      const url = request.nextUrl.clone();
      url.pathname = getCategoryUrl(dbSlug);
      return NextResponse.redirect(url, 308);
    }
    // DB'de olmayan eski kategori → 404
    return new NextResponse(null, { status: 404 });
  }

  // 3) /interviews/{category}/{id_or_slug}
  //    - /interviews/{db}/{slug}       → render (soru detay canonical)
  //    - /interviews/{db}/{numeric_id} → 308 → /interviews/{db}/{slug} (legacy ID URL)
  //    - /interviews/{aliased}/{slug}  → 308 → /interviews/{current}/{slug} (eski kategori)
  const match = pathname.match(/^\/interviews\/([a-z0-9-]+)\/([a-z0-9-]+)$/i);
  if (!match) {
    return NextResponse.next();
  }

  const [, category, idOrSlug] = match;

  // Legacy/deprecated category alias'lar (eski URL'leri canlı kategoriye yönlendir)
  // 2026-07-21: python-basics + pandas DB'de yok (CATEGORY_SLUGS'tan kaldirildi).
  //   /interviews/python-basics/{slug} → /interviews/programlama-temelleri/{slug}
  //   /interviews/pandas/{slug} → /interviews/programlama-temelleri/{slug}
  const CATEGORY_ALIASES: Record<string, string> = {
    strings: "programlama-temelleri",  // eski: python-basics (deprecated + DB'de yok)
    "python-basics": "programlama-temelleri",  // 2026-07-21: DB'den kaldirildi
    pandas: "programlama-temelleri",  // 2026-07-21: scope'tan tamamen cikarildi
  };
  if (CATEGORY_ALIASES[category]) {
    const url = request.nextUrl.clone();
    url.pathname = `/interviews/${CATEGORY_ALIASES[category]}/${idOrSlug}`;
    return NextResponse.redirect(url, 308);
  }

  // ⚠️ parseInt('0-1-knapsack') === 0, isNaN(0) === false → ID gibi davranip 404.
  //    Sadece /^\d+$/ ise ID kabul et, aksi halde slug — display URL'e yönlendir.
  const isPureId = /^\d+$/.test(idOrSlug);
  if (!isPureId) {
    // Slug ise — zaten canonical /interviews/{db}/{slug}, render et
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