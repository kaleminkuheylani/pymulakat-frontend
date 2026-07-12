// app/about/page.tsx
// Hakkımızda sayfası — SERVER COMPONENT (kural: public SEO sayfası ASLA client).
// Animation: framer-motion YERİNE CSS @keyframes (server-render, no JS, no flicker).
// "use client" YASAK — useState/useEffect yok, framer-motion kaldırıldı.

import Link from "next/link";
import { Target } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda | Python Mülakat",
  description:
    "İki kişilik bir ekip, bir amacı paylaşıyoruz: Python öğretmek için yapay zekâ ile üretilmiş sorular, idealist pedagojik yaklaşım ve sıfır bütçe.",
};

// ─── Stiller (server component'te <style> tag'i inline) ────────
// Tailwind animasyonu "animate-fade-up" globalde yoksa, burada
// tanımlıyoruz. CSS-only, JS yok, hydration flash yok.
const styleBlock = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .anim-fade-up {
    opacity: 0;
    animation: fadeUp 0.6s ease-out forwards;
  }
  .anim-fade-up-1 { animation-delay: 0.05s; }
  .anim-fade-up-2 { animation-delay: 0.15s; }
  .anim-fade-up-3 { animation-delay: 0.25s; }
  .anim-fade-up-4 { animation-delay: 0.35s; }
`;

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <style dangerouslySetInnerHTML={{ __html: styleBlock }} />

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(245,158,11,0.12),transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
          <div className="anim-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono text-[11px] tracking-widest text-white/60">
                KİMİZ?
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              İki kişilik bir ekip.<br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Bir amacı paylaşıyoruz.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
              Python öğretmek için yapay zekâ ile üretilmiş sorular, idealist pedagojik
              yaklaşım ve sıfır bütçe. Hiçbir öğrencinin tek başına öğrenmek
              zorunda kalmaması için.
            </p>
          </div>
        </div>
      </section>

      {/* ─── VİZYON ──────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="anim-fade-up anim-fade-up-1">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-amber-400">
            Vizyon
          </h2>
          <div className="prose prose-invert prose-lg max-w-none text-white/80 leading-relaxed space-y-5">
            <p>
              Türkiye, yapay zekâ ile bağdaşmıyor gibi gözüküyor. Ama bu bir
              alın yazısı değil — <strong className="text-white">bu sadece bizim çabasızlığımız.</strong>
            </p>
            <p>
              Biz, sıradan iki kişiyiz. Türkiye'de Python öğrenmek isteyen
              bir öğrenci yeterince sabırlı bir eğitmene, yeterince
              net bir içeriğe, yeterince dürüst geri bildirime ulaşamıyor.
            </p>
            <p>
              Biz bunu değiştirebileceğimize inanıyoruz. Çünkü <em>değiştirmek için
              gerekli olan tek şey para değil, niyet ve yeterince pratik bilgi</em>.
              İkisine de sahibiz.
            </p>
          </div>
        </div>
      </section>

      {/* ─── NASIL / NEDEN ──────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="anim-fade-up anim-fade-up-2 grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <Target className="w-7 h-7 text-amber-400 mb-3" />
            <h3 className="text-lg font-semibold mb-2 text-white">Saf Python</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Framework yetiştirmiyoruz. Döngü, koşul, fonksiyon, veri yapıları —
              temelden sağlam temel. Çünkü temelsiz bina çöker.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-lg font-semibold mb-2 text-white">
              Yapay Zekâ ile Üretilmiş Sorular
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Her soru Gemini tarafından taslaklanır, biz düzenleriz. AI burada
              içerik üreticisi değil, hızlandırıcı. Pedagojik kararlar insanda.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="text-3xl mb-3">📐</div>
            <h3 className="text-lg font-semibold mb-2 text-white">
              İdealist Pedagoji
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Önce kavram, sonra örnek, en son egzersiz. İpuçları gizli spoiler
              değil, kademeli düşünce iskeleti. Açıklamalar ezber değil, mantık zinciri.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-6">
            <div className="text-3xl mb-3">🧪</div>
            <h3 className="text-lg font-semibold mb-2 text-amber-300">
              Test Kullanıcılar Topluyoruz
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Platform şu anda beta aşamasında. Aktif soru çözen, geri bildirim
              veren, hata yakalayan test kullanıcıları arıyoruz. Sen de bir
              öğrenciysen ya da Python'a yeni başlıyorsan, birlikte daha iyi
              hale getirebiliriz. Geri bildirimlerin içerikleri, soruları ve
              rehberleri doğrudan şekillendiriyor.
            </p>
            <a
              href="https://x.com/PythonMulakat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs text-amber-300 hover:text-amber-200 transition-colors"
            >
              X'ten bize ulaş
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── MANIFESTO ──────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="anim-fade-up anim-fade-up-3">
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.07] via-indigo-500/[0.05] to-transparent p-8 md:p-12">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />

            <div className="relative">
              <p className="font-mono text-[11px] tracking-widest uppercase text-amber-400 mb-4">
                Manifesto
              </p>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white leading-tight">
                "Bu alın yazısı değil. Bu, çoğumuzun denememiş olması."
              </h3>
              <div className="space-y-4 text-white/80 leading-relaxed text-base md:text-lg">
                <p>
                  Yapay zekâ dünyayı değiştiriyor — bu tartışmasız. Ama Türkiye'de
                  üretilen yapay zekâ uygulamalarının sayısı, ülkenin genç
                  nüfusuna kıyasla çok az.
                </p>
                <p>
                  Bu azlık <em>yetenek</em> eksikliğinden değil, <strong className="text-white">
                  cesaret eksikliğinden</strong>. "Küçük ekibiz, büyük şirketler
                  var, biz yapamayız" düşüncesinden. Halbuki yapabiliriz. Aslında
                  zaten yapıyoruz — küçük, sessiz, ama kararlı.
                </p>
                <p>
                  <strong className="text-amber-300">Bizim cevabımız:</strong> Eğer
                  iki kişi yapabiliyorsa, yüz kişi de yapabilir. Bin kişi de. Bu
                  bir milli sorun değil, bir başlatma sorunu. Biz başlattık. Sıra sende.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA / GAZA GETİREN ────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="anim-fade-up anim-fade-up-4">
          <p className="text-white/50 text-sm uppercase tracking-widest mb-4">
            Bir sonraki adım
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
            Sen de{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              yapabilirsin.
            </span>
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Bir öğrenci olarak soruları çöz, kendi projende uygula. Bir geliştirici
            olarak GitHub'da yıldızla, katkıda bulun. Bir içerik üreticisi olarak
            soru öner. Yapay zekâdan korkmak yerine onunla çalış.
          </p>

          {/* Twitter */}
          <a
            href="https://x.com/PythonMulakat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-amber-300 hover:text-black transition-all shadow-lg hover:shadow-amber-400/30"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Bizi X'te takip et
            <span className="text-black/60 font-mono text-sm">@PythonMulakat</span>
          </a>

          {/* Alternatif CTA'lar */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link
              href="/interviews"
              className="px-5 py-2.5 bg-amber-400 text-[#050816] rounded-full font-medium hover:bg-amber-300 transition-colors text-sm"
            >
              Soruları Çözmeye Başla →
            </Link>
            <Link
              href="/python-egitimi"
              className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-full font-medium hover:bg-white/10 transition-colors text-sm"
            >
              Eğitim Yol Haritası
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
