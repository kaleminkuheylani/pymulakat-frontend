// app/interviews/page.tsx
// TÜM KATEGORİLERİN LİSTESİ — DP sayfasındaki soru kartı şablonuna benzer şekilde
// her kategori kendi "kartı" içinde gösterilir (icon, başlangıç seviyesi badge, soru
// sayısı, başlık, açıklama, slug, "Keşfet" linki).
//
// DP sayfasıyla eşitlenen bölümler:
//   - H1 + subtitle + tag chip'leri (indigo)
//   - "Mülakat Kategorileri Nedir?" context bölümü (beforeRelated)
//   - 3 related kart (kodlar, eğitim, online)
//   - Soru kartı şablonu (kategori için uyarlandı: icon + seviye badge + count)
//   - 3-col grid, sm:2-col, lg:3-col

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";

interface Category {
  slug: string;
  label: string;
  description?: string;
  icon?: string;
  question_count: number;
}

interface CategoriesResponse {
  data: Category[];
}

// DP sayfasındaki QuestionListClient ile aynı gradient paleti (görsel eşitlik)
const DEFAULT_GRADIENT_FROM = "#6366f1";
const DEFAULT_GRADIENT_TO = "#f59e0b";
const DEFAULT_ACCENT = "#fbbf24";

// DP sayfasındaki "seviye badge" renkleri
const LEVEL_COLORS: Record<string, string> = {
  beginner: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
  intermediate: "bg-amber-500/10 border-amber-500/30 text-amber-300",
  advanced: "bg-rose-500/10 border-rose-500/30 text-rose-300",
};

// Slug -> seviye mapping (kategori büyüklüğüne göre tahmini seviye)
function inferLevel(slug: string, count: number): string {
  // Veri yapıları + DP + algoritma: intermediate/advanced
  if (["dynamic-programming", "algorithms", "data-structures", "heap"].includes(slug)) {
    return count > 15 ? "intermediate" : "advanced";
  }
  // Çok sayıda temel soru: beginner
  if (["python-basics", "list-dict"].includes(slug)) return "beginner";
  // Diğer: intermediate
  return "intermediate";
}

// Backend slug'ı yeni pillar URL'ine map et (var olan 9 yeni sayfa)
const SLUG_TO_PILLAR: Record<string, string> = {
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

export default function InterviewsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    fetch(`${API_BASE}/api/v2/categories`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: CategoriesResponse | Category[]) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data && Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          setCategories([]);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.warn("[InterviewsPage] fetch error:", err);
          setError(err.message || "Kategoriler yüklenemedi");
        }
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const totalQuestions = categories.reduce((sum, c) => sum + (c.question_count || 0), 0);
  const totalCategories = categories.length;

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* ─── HEADER (DP sayfasıyla eş: py-8, text-4xl md:text-5xl, max-w-6xl) ─── */}
      <header className="bg-[#0a0e1a]/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-3 transition-colors"
          >
            ← Ana Sayfa
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Python Mülakat Kategorileri</h1>
          <p className="text-white/70 text-base md:text-lg max-w-3xl leading-relaxed">
            Python mülakat soruları kataloğu. Seviyene uygun bir kategori seç, tarayıcıda kod yaz, otomatik
            test et, yapay zekâdan anında geri bildirim al.{" "}
            <strong className="text-amber-400">{totalQuestions}+ interaktif soru</strong>{" "}
            {totalCategories} kategoride.
          </p>
          {/* DP sayfasındaki tag chip'leri (indigo) — kategori isimleri */}
          {categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((c) => (
                <span
                  key={c.slug}
                  className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                >
                  {c.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ─── ANA İÇERİK (DP sayfasıyla eş: max-w-6xl, py-10) ─── */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 h-44 animate-pulse"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <div className="text-5xl mb-4">{error ? "⚠️" : "📭"}</div>
            <h2 className="text-xl font-semibold mb-2">
              {error ? "Kategoriler yüklenemedi" : "Henüz kategori yok"}
            </h2>
            <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
              {error ? (
                <>
                  Backend&apos;e bağlanılamadı ({error}). Birkaç saniye sonra tekrar deneyebilirsin.
                </>
              ) : (
                "Backend&apos;de henüz kategori yok. Biraz sonra tekrar dene."
              )}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        ) : (
          <>
            <div className="text-sm text-white/50 mb-4">
              <span className="text-white font-semibold">{totalCategories}</span> kategori ·{" "}
              <span className="text-white font-semibold">{totalQuestions}</span> soru listeleniyor
            </div>
            {/* DP sayfasındaki soru kartı şablonu — kategoriye uyarlandı */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => {
                const count = cat.question_count || 0;
                const lvl = inferLevel(cat.slug, count);
                const pillarHref = SLUG_TO_PILLAR[cat.slug] || `/interviews/${cat.slug}`;
                return (
                  <Link
                    key={cat.slug}
                    href={pillarHref}
                    className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/20 transition-all overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity"
                      style={{
                        background: `linear-gradient(135deg, ${DEFAULT_GRADIENT_FROM}, ${DEFAULT_GRADIENT_TO})`,
                      }}
                    />
                    <div
                      className="absolute top-0 left-0 right-0 h-0.5 opacity-50 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: `linear-gradient(90deg, ${DEFAULT_GRADIENT_FROM}, ${DEFAULT_GRADIENT_TO})`,
                      }}
                    />

                    <div className="relative">
                      {/* Üst kısım: icon (kategori) + seviye badge + soru sayısı */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${DEFAULT_GRADIENT_FROM}30, ${DEFAULT_GRADIENT_TO}30)`,
                              border: `1px solid ${DEFAULT_ACCENT}50`,
                            }}
                          >
                            {cat.icon || "📘"}
                          </div>
                          <span
                            className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${
                              LEVEL_COLORS[lvl] || LEVEL_COLORS.intermediate
                            }`}
                          >
                            {lvl}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-2xl font-bold text-white">{count}</span>
                          <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">
                            soru
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold mb-2 group-hover:text-amber-400 transition-colors">
                        {cat.label}
                      </h3>

                      {cat.description && (
                        <p className="text-sm text-white/50 line-clamp-3 min-h-[3.5rem]">
                          {cat.description}
                        </p>
                      )}

                      {/* function_name alanı yerine slug (DP şablonu) */}
                      <div className="mt-3 text-xs text-white/40 font-mono">
                        <span className="text-indigo-300">def</span>{" "}
                        practice_{cat.slug.replace(/-/g, "_")}()
                      </div>

                      <div className="flex items-center justify-between text-xs pt-3 mt-2 border-t border-white/5">
                        <span className="text-white/40 font-mono">{cat.slug}</span>
                        <span
                          className="flex items-center gap-1.5 transition-colors group-hover:text-amber-400"
                          style={{ color: DEFAULT_ACCENT }}
                        >
                          <span>Keşfet</span>
                          <svg
                            className="w-3 h-3 transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* ─── CONTEXT (DP sayfasıyla eş: "Mülakat Kategorileri Nedir?") ─── */}
        <section className="mt-16 pt-10 border-t border-white/10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Mülakat Kategorileri Nedir?</h2>
          <div className="prose prose-invert max-w-3xl text-white/70 leading-relaxed space-y-4">
            <p>
              <strong className="text-amber-400">Python mülakat soruları</strong>, farklı zorluk seviyelerinde ve konularda kategorize edilmiş pratik sorularıdır. Junior seviyesinde <strong>Python temelleri</strong> (değişkenler, tipler, döngüler, fonksiyonlar) ve <strong>Liste & Sözlük</strong> işlemleri en sık sorulan konulardır. Orta seviyede <strong>Veri Yapıları</strong> (stack, queue, tree), <strong>Pandas</strong> ve <strong>Algoritmalar</strong> öne çıkar. İleri seviyede ise <strong>Dinamik Programlama</strong>, graf algoritmaları ve karmaşık sistem tasarımı soruları gelir.
            </p>
            <p>
              Her kategori kendi içinde <strong>interaktif soru kartları</strong> içerir. Tarayıcıda kodu yaz, otomatik test case&apos;lerini geç, yapay zekâdan anında geri bildirim al. Kurulum gerekmez, hesap açmana gerek yok — sadece bir kategori seç ve pratik yapmaya başla.
            </p>
            <p>
              Mülakat hazırlığında önerilen sıra: <strong>Python Temelleri → Liste & Sözlük → Veri Yapıları → Algoritma Soruları → Dinamik Programlama</strong>. Her seviyede 15-20 soru çözdükten sonra bir üst kategoriye geç. Tüm sorular gerçek dünya mülakat senaryolarından esinlenilmiştir.
            </p>
          </div>
        </section>

        {/* ─── İPUCU KUTUSU (DP sayfasıyla eş: tip card) ─── */}
        <section className="mt-8">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4">
            <div className="flex gap-3">
              <span className="text-amber-300 flex-shrink-0 mt-0.5">💡</span>
              <div>
                <div className="font-semibold text-amber-300 mb-1">Hızlı Başlangıç İpucu</div>
                <div className="text-sm text-white/70">
                  Yeni başlıyorsan <strong>Python Temelleri</strong> kategorisinden başla. Her soruda otomatik ipuçları ve açıklamalı çözümler var. <strong>Liste & Sözlük</strong> kategorisi orta seviyeye geçiş için ideal — sık sorulan veri tipi işlemlerini pekiştirir. İleri seviyeye hazırsan <strong>Algoritma Soruları</strong> ve <strong>Dinamik Programlama</strong> ile devam et.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── NE ZAMAN KULLANILIR (DP sayfasıyla eş: whenToUse list) ─── */}
        <section className="mt-8">
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04] p-4">
            <div className="font-semibold text-indigo-300 mb-2">🎯 Mülakat Kategorilerini Ne Zaman Kullanmalısın?</div>
            <ul className="text-sm text-white/70 space-y-1.5 list-disc pl-5">
              <li>Python mülakatına 2-4 hafta kala sistematik hazırlık yapmak istiyorsan</li>
              <li>Hangi kategoride ne kadar soru çözdüğünü görmek ve zayıf olduğun konuyu tespit etmek istiyorsan</li>
              <li>Spesifik bir veri yapısı veya algoritma konusunu pekiştirmek istiyorsan (örn. sadece heap)</li>
              <li>Junior / mid / senior seviyelerine göre uygun zorlukta soru arıyorsan</li>
            </ul>
          </div>
        </section>

        {/* ─── RELATED (DP sayfasıyla eş: 3 related card) ─── */}
        <section className="mt-16 pt-10 border-t border-white/10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">İlgili Kategoriler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Link
              href="/python-kodlari"
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-amber-400/40 transition-all"
            >
              <div className="text-3xl mb-3">📖</div>
              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-amber-400 transition-colors">Python Kodları</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Hazır Python kodu örnekleri: liste, dict, OOP, Pandas, Algoritmalar. Kopyala, çalıştır, öğren.
              </p>
              <div className="mt-3 text-sm text-amber-400 group-hover:translate-x-1 transition-transform">Keşfet →</div>
            </Link>
            <Link
              href="/python-egitimi"
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-amber-400/40 transition-all"
            >
              <div className="text-3xl mb-3">🎓</div>
              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-amber-400 transition-colors">Python Eğitimi</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Sıfırdan ileri seviyeye, 6 ders + 6 rehber. İnteraktif editörde pratik yaparak öğren.
              </p>
              <div className="mt-3 text-sm text-amber-400 group-hover:translate-x-1 transition-transform">Keşfet →</div>
            </Link>
            <Link
              href="/python-online"
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-amber-400/40 transition-all"
            >
              <div className="text-3xl mb-3">🖥️</div>
              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-amber-400 transition-colors">Python Online</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Tarayıcıda kurulum sız Python 3.12 editörü. Pyodide WASM ile 100ms&apos;de başlar.
              </p>
              <div className="mt-3 text-sm text-amber-400 group-hover:translate-x-1 transition-transform">Keşfet →</div>
            </Link>
          </div>
        </section>

        {/* Alt bilgi */}
        {!loading && categories.length > 0 && (
          <div className="mt-12 text-center text-xs text-white/40">
            Toplam <span className="text-white/70 font-semibold">{totalQuestions}</span>{" "}
            soru · <span className="text-white/70 font-semibold">{totalCategories}</span>{" "}
            kategori
          </div>
        )}
      </main>
    </div>
  );
}
