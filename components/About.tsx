// components/About.tsx
//
// Anasayfa "Biz Kimiz" bölümü — server component.
// 2026-07-15: Kullanıcı direktifi — proje hakkında bilgi:
//   - Solo entrepreneurial, gelişime açık proje
//   - Yapay zekâdan yardım alınarak geliştirildi
//   - Sorular denetleniyor (AI feedback denetimi)
//   - KVKK için link

import Link from "next/link";
import {
  User,
  Bot,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Mail,
} from "lucide-react";

export default function About() {
  return (
    <section className="py-12 md:py-20 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* ─── Section header ─────────────────────────────── */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-4">
            <User className="w-3.5 h-3.5" />
            Biz Kimiz
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
            Solo bir proje,
            <br />
            <mark className="bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">
              yapay zekâ destekli geliştirme
            </mark>
          </h2>
          <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto">
            Açık kaynak ruhuyla, küçük bir ekibin (aslında tek kişinin) büyük bir
            vizyonu. Mülakat hazırlığını demokratikleştirmek.
          </p>
        </div>

        {/* ─── 3 sütun: geliştirici + AI + denetim ──────────── */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-5 mb-10">
          {/* 1. Solo entrepreneur */}
          <article className="p-5 md:p-6 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-300 mb-4">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-base md:text-lg font-semibold mb-2 text-white">
              Solo Entrepreneurial
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Kurucu + geliştirici + ürün sorumlusu + test kullanıcısı — her şey
              tek kişi. Açık kaynak, şeffaf, küçük ve öz.
            </p>
          </article>

          {/* 2. AI destekli geliştirme */}
          <article className="p-5 md:p-6 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/10 text-amber-300 mb-4">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base md:text-lg font-semibold mb-2 text-white">
              Yapay Zekâ Destekli
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Geliştirme sürecinde DeepSeek, Claude, GPT-4 gibi yapay zekâ
              araçlarından yardım alındı. Üretkenlik × kalite = özgür bırakılan zaman.
            </p>
          </article>

          {/* 3. Soru denetimi */}
          <article className="p-5 md:p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-300 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base md:text-lg font-semibold mb-2 text-white">
              Sorular Denetleniyor
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Her soru AI feedback denetiminden geçirilir. Çözümler, test case'ler
              ve ipuçları tutarlılık + doğruluk açısından sürekli kontrol altında.
            </p>
          </article>
        </div>

        {/* ─── KVKK + AI feedback + About sayfası linkleri ── */}
        <div className="p-5 md:p-7 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/10">
          <div className="grid md:grid-cols-2 gap-5 items-center">
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-2 text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                Gizlilik ve KVKK
              </h3>
              <p className="text-sm text-white/60 leading-relaxed mb-3">
                Verileriniz Supabase'de şifreli saklanır, 3. parti reklam veya
                tracker yoktur. Hesabınızı tek tıkla silebilirsiniz — verileriniz
                kalıcı olarak silinir.
              </p>
              <p className="text-xs text-white/40">
                Detaylı bilgi için{" "}
                <Link
                  href="/terms#bolum-4"
                  className="text-amber-300 hover:text-amber-200 underline-offset-2 hover:underline"
                >
                  Kullanım Şartları · Bölüm 4 (Yapay Zekâ)
                </Link>{" "}
                bölümünü inceleyin.
              </p>
            </div>

            <div className="space-y-2.5">
              <Link
                href="/terms"
                className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  KVKK + Kullanım Şartları
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-white/40" />
              </Link>
              <Link
                href="/about"
                className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Proje Hakkında (Detaylı)
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-white/40" />
              </Link>
              <a
                href="mailto:mkemal@pythonmulakat.com"
                className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-300" />
                  İletişim: mkemal@pythonmulakat.com
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-white/40" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
