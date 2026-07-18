// app/api/revalidate/route.ts
// On-demand ISR revalidation endpoint (tag + path).
//
// POST /api/revalidate
//   Headers: Authorization: Bearer <REVALIDATE_SECRET>
//   Body (JSON):
//     - tags?:  string[]   — revalidateTag(tag) her biri için
//     - paths?: string[]   — revalidatePath(p) her biri için
//   Örnek:
//     curl -X POST https://pythonmulakat.com/api/revalidate \
//       -H "Authorization: Bearer $REVALIDATE_SECRET" \
//       -H "Content-Type: application/json" \
//       -d '{"tags":["questions-list","category-heap"]}'
//
// Güvenlik:
//   - REVALIDATE_SECRET env ile korunur (production'da zorunlu)
//   - Boş/eksik secret → 503 Service Unavailable (endpoint kapalı)
//   - Yanlış secret → 401 Unauthorized
//
// Backend entegrasyonu: services/notifier.py → notify_nextjs_revalidate()
//   Backend admin endpoint'leri yeni soru ekleyince burayı çağırır →
//   Next.js cache'i anında düşer, max 1 saat ISR beklemek gerekmez.

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export const runtime = "nodejs"; // env access + logging

interface RevalidateBody {
  tags?: string[];
  paths?: string[];
  // Backward compat (eski client'lar tek string geçiyordu)
  tag?: string;
  path?: string;
}

export async function POST(req: NextRequest) {
  const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

  // Secret set edilmemişse endpoint'i kapat (production güvenliği).
  // Açık bırakmak = herhangi biri cache'i invalidate edebilir.
  if (!REVALIDATE_SECRET) {
    return NextResponse.json(
      {
        error: "REVALIDATE_SECRET not configured",
        hint: "Set REVALIDATE_SECRET in environment (Vercel/Railway dashboard).",
      },
      { status: 503 }
    );
  }

  // Auth: Authorization: Bearer <secret>
  const authHeader = req.headers.get("authorization") || "";
  const expected = `Bearer ${REVALIDATE_SECRET}`;
  if (authHeader !== expected) {
    return NextResponse.json(
      { error: "Invalid or missing Authorization header" },
      { status: 401 }
    );
  }

  // Body parse
  let body: RevalidateBody;
  try {
    body = (await req.json()) as RevalidateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const invalidatedTags: string[] = [];
  const invalidatedPaths: string[] = [];

  // Tag bazlı invalidation (tercih edilen yol)
  // lib/api/questionAPI.ts CACHE_TAGS'den tag isimleri kullanılır:
  //   - "questions-list"   (tüm soru listeleri)
  //   - "categories-list"  (tüm kategori listeleri)
  //   - "category-{slug}"  (tek kategori sayfası)
  //   - "question-{cat}-{slug}" (tek soru detay sayfası)
  for (const tag of body.tags ?? []) {
    try {
      // Next.js 15+: 2. argüman = profile (default ISR profile)
      revalidateTag(tag, "default");
      invalidatedTags.push(tag);
    } catch (e) {
    }
  }
  // Backward compat: tek string tag
  if (body.tag) {
    try {
      revalidateTag(body.tag, "default");
      invalidatedTags.push(body.tag);
    } catch (e) {
    }
  }

  // Path bazlı invalidation (fallback — tag çalışmıyorsa path)
  for (const p of body.paths ?? []) {
    try {
      revalidatePath(p);
      invalidatedPaths.push(p);
    } catch (e) {
    }
  }
  // Backward compat: tek string path
  if (body.path) {
    try {
      revalidatePath(body.path);
      invalidatedPaths.push(body.path);
    } catch (e) {
    }
  }

  // Hiçbir şey invalidate edilmediyse bad request
  if (invalidatedTags.length === 0 && invalidatedPaths.length === 0) {
    return NextResponse.json(
      {
        error: "No tags or paths provided",
        hint: 'Body: {"tags": ["category-heap"]} veya {"paths": ["/interviews/heap"]}',
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    invalidated: {
      tags: invalidatedTags,
      paths: invalidatedPaths,
    },
    timestamp: new Date().toISOString(),
  });
}

// GET: docs / health
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/revalidate",
    method: "POST",
    auth: "Authorization: Bearer <REVALIDATE_SECRET>",
    body: {
      tags: ["questions-list", "category-heap", "question-heap-kth-largest"],
      paths: ["/interviews", "/interviews/heap"],
    },
    notes: [
      "REVALIDATE_SECRET env zorunlu (production).",
      "Tag-bazlı invalidation tercih edilir; path-bazlı fallback.",
      "Backend services/notifier.py → notify_nextjs_revalidate() helper'ı kullanır.",
    ],
  });
}
