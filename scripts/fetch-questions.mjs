#!/usr/bin/env node
/**
 * Build sırasında backend'den soru listesini çekip JSON'a yazar.
 * DB source of truth — QUESTIONS-v3.py DB'ye seed atıyor, buradan okuyoruz.
 * Yeni soru eklendiğinde: QUESTIONS-v3.py'i güncelle + seed çalıştır (DB sync).
 * Sonra `npm run build` otomatik yeni listeyi çeker.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "lib", "questions.json");

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";
const URL = `${BACKEND}/api/v2/questions/all`;

console.log(`[prebuild] Fetching questions from ${URL} ...`);

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30000);

try {
  const res = await fetch(URL, { signal: controller.signal });
  clearTimeout(timeout);

  if (!res.ok) {
    throw new Error(`Backend returned ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  const qs = Array.isArray(data) ? data : (data.data || []);
  if (!Array.isArray(qs) || qs.length === 0) {
    throw new Error("Backend boş soru listesi döndü (DB senkron değil)");
  }

  // Sadece gerekli alanları tut, boyut küçük olsun
  const minimal = qs
    .filter((q) => q.category && q.slug)
    .map((q) => ({ category: q.category, slug: q.slug }));

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(minimal, null, 2) + "\n");
  console.log(`[prebuild] ✅ ${minimal.length} soru yazıldı → ${OUT}`);
} catch (e) {
  if (e.name === "AbortError") {
    console.error(`[prebuild] ❌ Timeout: Backend 30s içinde cevap vermedi (${URL})`);
  } else {
    console.error(`[prebuild] ❌ ${e.message}`);
  }
  console.error(`[prebuild] DB source of truth (backend) erişilemedi — build devam eder, eski soru listesi kullanılır.`);
  // Build'i durdurmuyoruz — eski questions.json varsa kullanılır, yoksa sitemap boş kalır
  process.exit(0);
}
