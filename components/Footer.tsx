// components/Footer.tsx
// Global footer — ConditionalFooter tarafından render edilir.

export default function Footer() {
  const year = new Date().getFullYear();
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
              Tarayıcıda Python mülakat hazırlığı.
              Kurulum yok, 60 saniyede ilk soruyu çöz.
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
                <a href="/python-online" className="hover:text-white transition-colors">
                  Online Editör
                </a>
              </li>
              <li>
                <a href="/python-egitimi" className="hover:text-white transition-colors">
                  Python Eğitimi
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
                <a href="/profile" className="hover:text-white transition-colors">
                  Profil
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
                Gemini AI
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
            İki kişi · saf niyet · saf Python · test kullanıcıları arıyoruz
          </div>
        </div>
      </div>
    </footer>
  );
}