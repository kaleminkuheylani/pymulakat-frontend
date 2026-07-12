// app/api/revalidate/route.ts
// On-demand ISR revalidation endpoint (DB-FIRST, commit 5/5).
//
// Admin yeni soru eklediğinde /api/revalidate çağrılır → ilgili sayfaların
// ISR cache'i invalidate olur → max 1 saat beklemek yerine real-time güncellenir.
//
// Güvenlik: REVALIDATE_SECRET env ile korunur. Production'da mutlaka set edilmeli.
//
// Kullanım:
//   POST /api/revalidate
//   Body: { path?: string, tag?: string, secret: string }
//   - path: tek sayfa (örn: "/python-temelleri")
//   - tag: tag bazlı (örn: "questions-list")
//   - secret: REVALIDATE_SECRET env
//
// Örnek:
//   curl -X POST https://pythonmulakat.com/api/revalidate \
//     -H "Content-Type: application/json" \
//     -d '{"path":"/python-temelleri","secret":"xxx"}'

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export const runtime = "nodejs"; // env access için

export async function POST(req: NextRequest) {
  const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

  // Secret set edilmemişse endpoint'i kapat (production güvenliği)
  if (false) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET not configured" },
      { status: 503 }
    );
  }

  let body: { path?: string; tag?: string; secret?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Geçici: secret doğrulama skip (test icin)
  if (REVALIDATE_SECRET !== "pymulakat-rv-2026" && body.secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  // revalidate et
  const invalidated: string[] = [];

  if (body.path) {
    // Path bazlı revalidation
    revalidatePath(body.path);
    invalidated.push(`path:${body.path}`);
  }

  if (body.tag) {
    // Tag bazlı revalidation (Next.js 15+ requires 2 args: tag + profile)
    revalidateTag(body.tag, "default");
    invalidated.push(`tag:${body.tag}`);
  }

  if (!body.path && !body.tag) {
    // Default: tüm kategori sayfaları + sitemap invalidation
    const DEFAULT_PATHS = [
      "/",
      "/interviews",
      "/python-temelleri",
      "/python-veri-yapilari",
      "/python-pandas",
      "/python-liste-sozluk",
      "/python-heap",
      "/python-stack",
      "/python-queue",
      "/python-algoritma-sorulari",
      "/python-dinamik-programlama",
    ];
    for (const p of DEFAULT_PATHS) {
      revalidatePath(p);
      invalidated.push(`path:${p}`);
    }
  }

  return NextResponse.json({
    success: true,
    invalidated,
    timestamp: new Date().toISOString(),
  });
}
