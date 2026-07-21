// components/Footer.tsx

// Global footer — ConditionalFooter tarafından render edilir.

//

// 2026-07-15: Footer CTA user state'e göre dinamik:

//   - Anon user → "Hemen Başla →" /register

//   - Authenticated → "Soru Çözmeye Devam Et →" /interviews

//   - Authenticated + dashboard hariç her yerde (kullanıcı dashboard'da zaten)



"use client";



import { useUser } from "@/hooks/useUser";

import Link from "next/link";



export default function Footer() {

  const year = new Date().getFullYear();

  const { user } = useUser();



  return (

    <footer className="mt-20 bg-slate-950">

      <div className="max-w-6xl mx-auto px-5 py-10">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">

          {/* Marka */}

          <div className="col-span-2 md:col-span-1">

            <div className="flex items-center gap-2 mb-3">

              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/20">

                🐍

              </div>

              <span className="font-bold text-white">PythonMulakat</span>

            </div>

            <p className="text-xs text-white/50 leading-relaxed">

              Yapay zeka destekli mülakat soru platformu.

              Tarayıcıda Python mülakat hazırlığı, yapay zekâ geri bildirimi.

            </p>

          </div>



          {/* Ürün — misafir için: Sorular (kategoriler listesi, public).

              Python Online + Eğitim + Kodlar — internal SEO linkleri geri. */}

          <div>

            <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3">

              Ürün

            </h4>

            <ul className="space-y-2 text-xs text-white/50">

              <li>

                <a href="/interviews" className="hover:text-white transition-colors">

                  Sorular

                </a>

              </li>

              <li>

                <a href="/python-kodlari" className="hover:text-white transition-colors">

                  Hazır Kodlar

                </a>

              </li>

            </ul>

          </div>



          {/* Kaynak */}

          <div>

            <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3">

              Kaynak

            </h4>

            <ul className="space-y-2 text-xs text-white/50">

              <li>

                <a href="/about" className="hover:text-white transition-colors">

                  Hakkında

                </a>

              </li>

              <li>

                <a href="/terms" className="hover:text-white transition-colors">

                  Kullanım Şartları

                </a>

              </li>

              <li>

                <a href="/login" className="hover:text-white transition-colors">

                  Giriş Yap

                </a>

              </li>

            </ul>

          </div>



          {/* Teknoloji */}

          <div>

            <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3">

              Teknoloji

            </h4>

            <ul className="space-y-2 text-xs text-white/50">

              <li className="flex items-center gap-2">

                ⚡

                Pyodide (WASM)

              </li>

              <li className="flex items-center gap-2">

                🧠

                DeepSeek AI

              </li>

              <li className="flex items-center gap-2">

                🗄️

                Supabase

              </li>

              <li className="flex items-center gap-2">

                🚀

                Next.js 14

              </li>

            </ul>

          </div>

        </div>



        {/* Alt çizgi */}

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-[11px] text-white/40">

            © {year} PythonMulakat · pythonmulakat.com

          </p>

          <div className="flex items-center gap-4 text-[11px] text-white/40">

            <a href="mailto:mkemal@pythonmulakat.com" className="hover:text-white/70 transition-colors">

              mkemal@pythonmulakat.com

            </a>

            ·

            İki kişi · saf niyet · saf Python

          </div>

        </div>



        {/* 2026-07-15: Kısıtlı süreliğine ücretsiz vurgusu + dinamik CTA */}

        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-xs text-amber-300/80 font-medium">

            ⏳ Şu anda kısıtlı süreliğine ücretsiz — süre sınırı yakında

          </p>

          {user ? (

            <Link

              href="/interviews"

              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-colors"

            >

              Soru Çözmeye Devam Et →

            </Link>

          ) : (

            <Link

              href="/register"

              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-colors"

            >

              Hemen Başla →

            </Link>

          )}

        </div>

      </div>

    </footer>

  );

}