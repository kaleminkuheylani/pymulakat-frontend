// Minimal test route — Vercel'in route'u gorup gormedigini anlamak icin
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, message: "Survey route active" });
}
