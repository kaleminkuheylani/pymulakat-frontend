"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { useUser } from "../hooks/useUser"

// ═══════════════════════════════════════════════════════════
// Landing Page — pythonmulakat.com
// Ana renkler: bg-[#050816], text-white, accent amber-500 + indigo-500
// ═══════════════════════════════════════════════════════════

// ─── Grid Background ─────────────────────────────────────
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.08) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
    </div>
  )
}

// ─── Logo (favicon) ──────────────────────────────────────
function BrandLogo({ size = 56 }: { size?: number }) {
  return (
    <div
      className="relative inline-flex items-center justify-center rounded-2xl overflow-hidden shadow-lg shadow-amber-500/30 ring-1 ring-white/10"
      style={{ width: size, height: size, background: "linear-gradient(135deg, #f59e0b 0%, #6366f1 100%)" }}
    >
      <Image
        src="/favicon-32x32.png"
        alt="PythonMulakat logosu"
        width={size}
        height={size}
        className="object-contain p-1.5"
        unoptimized
      />
    </div>
  )
}

// ─── Floating Badge ───────────────────────────────────────
function FloatingBadge({ text, index }: { text: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      whileHover={{ scale: 1.05, y: -4 }}
      className="group relative border border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl px-5 py-3 hover:border-indigo-400/50 transition-colors"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      <p className="relative text-sm font-semibold tracking-wider text-white/80 uppercase">
        <span className="text-amber-400 mr-2">✦</span>{text}
      </p>
    </motion.div>
  )
}

// ─── Hero ─────────────────────────────────────────────────
function Hero({ user: _ }: { user: any }) {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-12 pb-16">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <BrandLogo size={72} />
      </motion.div>

      {/* Marka yazısı */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-center mb-6"
      >
        <div className="text-2xl font-extrabold tracking-tight text-white">
          Python<span className="bg-gradient-to-r from-indigo-400 to-amber-400 bg-clip-text text-transparent">Mulakat</span>
        </div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-white/40 mt-1">
          Tarayıcıda Python Mülakat Hazırlığı
        </div>
      </motion.div>

      {/* Badges */}
      <div className="flex flex-wrap justify-center gap-3 mb-10 max-w-3xl">
        {[
          "KURULUM YOK",
          "TARAYICI İÇİ PYTHON",
          "OTOMATİK PUANLAMA",
          "TÜRKÇE İÇERİK",
        ].map((f, i) => (
          <FloatingBadge key={i} text={f} index={i} />
        ))}
      </div>

      {/* 📌 Landing page tamamen misafir odakli — user bilgisi gostermez.
          Login sonrasi dashboard'a yonlendirilir, dashboard'ta kullanici
          bilgisi OnboardingGate ve dashboard tarafindan gosterilir. */}

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-center mb-6 max-w-4xl"
      >
        <span className="block text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
          Python{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
            Mülakat Hazırlığını
          </span>
          <br />
          <span className="text-white/95">Ciddiye Al</span>
        </span>
        <span className="block text-base md:text-xl text-white/50 mt-6 font-light max-w-2xl mx-auto leading-relaxed">
          Tarayıcıda Python kodu yaz, otomatik puanla. Kodun sadece senin cihazında çalışır;
          sadece ilerlemen kaydedilir.
          <br className="hidden md:block" />
          Kurulum yok. Python kütüphanesi yok. Sadece 60 saniyede başla.
        </span>
      </motion.h1>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="flex flex-col sm:flex-row items-center gap-4 mt-8"
      >
        (
        <>
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="relative group bg-gradient-to-r from-amber-400 to-amber-500 text-[#050816] font-bold text-lg px-10 py-4 rounded-2xl shadow-lg shadow-amber-400/20 hover:shadow-amber-400/40 transition-all"
            >
              <span className="relative z-10">Ücretsiz Başla — 60 Saniyede</span>
            </motion.button>
          </Link>
          <Link href="/interviews/strings/51">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="border border-white/20 text-white font-semibold text-base md:text-lg px-6 md:px-8 py-3.5 md:py-4 rounded-2xl hover:border-indigo-400/50 hover:bg-indigo-500/10 transition-all"
            >
              👀 Kayıt Olmadan Dene
            </motion.button>
          </Link>
        </>
      )
      </motion.div>

      {/* Trust signals */}
      (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-xs text-white/40"
        >
          <span>✓ Kredi kartı yok</span>
          <span>✓ Spam yok</span>
          <span>✓ Kurulum yok</span>
          <span>✓ Süresiz ücretsiz</span>
        </motion.div>
    </section>
  )
}

// ─── Feature Card ─────────────────────────────────────────
function FeatureCard({
  icon, title, description, highlight, index,
}: {
  icon: string
  title: string
  description: string
  highlight?: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -6 }}
      className="relative group border border-white/10 bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="text-3xl">{icon}</div>
          {highlight && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold uppercase tracking-wider">
              {highlight}
            </span>
          )}
        </div>
        <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
        <p className="text-white/55 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

// ─── Step Card (Nasıl Çalışır) ─────────────────────────────
function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: number * 0.15, duration: 0.5 }}
      className="relative"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
          {number}
        </div>
        <div>
          <h4 className="text-white font-bold text-lg mb-1">{title}</h4>
          <p className="text-white/60 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── StatHighlight — CountUp animasyonu (0 → hedef) ────────
function CountUpNumber({ value, duration = 1.6 }: { value: string; duration?: number }) {
  // "73+" → 73, suffix="+"
  // "9"  → 9,  suffix=""
  // "7+" → 7,  suffix="+"
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const startTime = performance.now();
            const animate = (now: number) => {
              const elapsed = (now - startTime) / 1000;
              const progress = Math.min(elapsed / duration, 1);
              // Easing: easeOutCubic — yavaslasarak yaklasir
              const eased = 1 - Math.pow(1 - progress, 3);
              setDisplay(Math.floor(eased * target));
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setDisplay(target);
              }
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

function StatHighlight({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="text-center p-6 rounded-2xl border border-white/10 bg-white/[0.02]"
    >
      <div className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent mb-2">
        <CountUpNumber value={value} />
      </div>
      <div className="text-white font-semibold mb-1">{label}</div>
      <div className="text-white/40 text-xs">{sub}</div>
    </motion.div>
  )
}

// ─── Main Page ─────────────────────────────────────────────
export default function HomePage() {
  // 📌 Landing page — user bilgisi gostermiyor. Kullanici giris yapmis olsa bile
  // bu sayfa tamamen misafir modunda. Login sonrasi yonlendirme dashboard'a.

  return (
    <div className="relative bg-[#050816] min-h-screen w-full overflow-x-hidden">
      <GridBackground />
      <Hero user={null} />

      {/* 📌 Hero altindaki stats bar kaldirildi (duplicate). */}
      {/* CountUp animasyonlu stats asagidaki 'Rakamlarla PythonMulakat' bolumunde. */}

      {/* Nasıl Çalışır — 3 adım */}
      <section className="relative z-10 px-6 py-24 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase">
            60 saniyede başla
          </span>
          <h2 className="text-white text-3xl md:text-5xl font-bold mt-3">
            Nasıl Çalışır?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <StepCard
            number={1}
            title="Hemen Dene"
            description="Üye olmadan bile bir soruyu açabilir, tarayıcıda Python kodunu yazıp Çalıştır'a basabilirsin. Sıfır kurulum."
          />
          <StepCard
            number={2}
            title="Kodla, Puanla"
            description="Pyodide motoru kodunu 100 ms içinde çalıştırır. Test case'ler otomatik puanlar, ipuçları seni yönlendirir."
          />
          <StepCard
            number={3}
            title="İlerlemen Takip Edilsin"
            description="Çözdükçe profil sayfanda ilerlemen kaydedilir. Hangi konuyu bitirdiğini, hangi testleri geçtiğini takip edebilirsin."
          />
        </div>
      </section>

      {/* Features grid — sunduklarımız */}
      <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase">
            Platform Özellikleri
          </span>
          <h2 className="text-white text-3xl md:text-5xl font-bold mt-3 mb-4">
            Neler Sunuyoruz?
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Python öğrenmeye yeni başlayanlardan junior dev'lere — her seviyeye uygun,
            tarayıcı tabanlı, kişiselleştirilmiş bir pratik deneyimi.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard
            icon="⚡"
            title="Tarayıcıda Python"
            description="Pyodide motoruyla kurulum gerektirmeden Python kodu çalıştır. Pyodide WASM ile 100 ms'de başlar."
            index={0}
          />
          <FeatureCard
            icon="🧪"
            title="Otomatik Test Caseleri"
            description="Her sorunun kendi test suite'i var. Yazdığın kod anında puanlanır, hangi case'in başarısız olduğunu görürsün."
            index={1}
          />
          <FeatureCard
            icon="💡"
            title="İpuçları + Açıklamalar"
            description="Çözemediğinde sıralı ipuçları seni yönlendirir. Çözdükten sonra 'Yaklaşım & Açıklama' bloku konuyu pekiştirir."
            index={2}
          />
          <FeatureCard
            icon="📘"
            title="Uzman Rehberler"
            description="Palindrom, FizzBuzz, Asal Sayı gibi konular için 3 farklı yaklaşımla yazılmış detaylı rehberler."
            highlight="7+ rehber"
            index={3}
          />
          <FeatureCard
            icon="📱"
            title="Mobil Uyumlu"
            description="Telefonda, tablette, masaüstünde aynı deneyim. Paylaşım/embed için ?readonly modu da var."
            index={4}
          />
          <FeatureCard
            icon="🔗"
            title="İlgili Soru Zinciri"
            description="Bir soruyu çözdüğünde, onunla ilişkili kavramları ve sonraki soruları öğrenirsin. Sıralı öğrenme."
            index={5}
          />
          <FeatureCard
            icon="🎯"
            title="Seviye Bazlı İçerik"
            description="Beginner'dan Intermediate'a kadar farklı zorluk seviyelerinde sorular. Her seviyede progress takibi."
            index={6}
          />
          <FeatureCard
            icon="🚀"
            title="Sıfır Kurulum"
            description="Python, pip, virtualenv yok. Sadece tarayıcıyı aç, hesap oluştur, hemen kodlamaya başla. 60 saniyede ilk soruyu çöz."
            index={7}
          />
        </div>
      </section>

      {/* Highlight band — AI Koç farkı */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.07] via-amber-500/[0.05] to-transparent p-8 md:p-12"
          >
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />

            <div className="relative grid md:grid-cols-[auto_1fr] gap-8 items-center">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-400 to-amber-500 flex items-center justify-center text-4xl shadow-2xl shadow-indigo-500/30">
                  🚀
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-indigo-400 font-semibold mb-2">
                  Gerçek Fark
                </div>
                <h3 className="text-white text-2xl md:text-3xl font-bold mb-3">
                  Kodun cihazında kalır, ilerleme profilinde yaşar
                </h3>
                <p className="text-white/70 text-base leading-relaxed mb-4">
                  Yazdığın Python kodu{" "}
                  <strong className="text-indigo-300">sadece senin tarayıcında çalışır</strong>;
                  sunucuya gönderilmez. Sadece test sonuçların (kaç test geçti, ne kadar
                  sürdü, kaç ipucu kullandın) kaydedilir.{" "}
                  Yani <strong className="text-white">kodun gizli, istatistiğin seninle.</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Kod cihazda kalır", "Sadece istatistik kaydedilir", "Test otomatik", "İpuçları sıralı", "Açıklamalı çözümler"].map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats highlight — sosyal kanıt */}
      <section className="relative z-10 px-6 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-white text-2xl md:text-4xl font-bold">
            Rakamlarla PythonMulakat
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <StatHighlight value="73+" label="Çözülmeyi Bekleyen Soru" sub="Her hafta yeni ekleniyor" />
          <StatHighlight value="9" label="Kategori" sub="Temelden ileri seviyeye" />
          <StatHighlight value="7+" label="Uzman Rehber" sub="3 farklı yaklaşımla" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-amber-500/10 to-indigo-500/10 rounded-3xl blur-3xl -z-10" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-white/10 bg-white/[0.03] backdrop-blur-sm rounded-3xl p-10 md:p-16"
          >
            <div className="flex justify-center mb-4">
              <BrandLogo size={48} />
            </div>
            <h2 className="text-white text-3xl md:text-5xl font-bold mb-4">
              "İlk Soruyu 60 Saniyede Çöz"
            </h2>
            <p className="text-white/60 text-base md:text-lg mb-10 max-w-xl mx-auto">
              "Ücretsiz kayıt ol, hemen bir soru aç, tarayıcıda kodunu yaz. Mülakat hazırlığı bu kadar kolay olmalıydı."
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {/* Landing her zaman misafir odakli */}
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-gradient-to-r from-amber-400 to-amber-500 text-[#050816] font-bold text-lg px-10 py-4 rounded-2xl shadow-lg shadow-amber-400/20 hover:shadow-amber-400/40 transition-all"
                >
                  Ücretsiz Başla — Kayıt Ol
                </motion.button>
              </Link>
              <Link href="/interviews/strings/51">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="border border-white/20 text-white font-semibold text-base md:text-lg px-6 md:px-8 py-3.5 md:py-4 rounded-2xl hover:border-indigo-400/50 hover:bg-indigo-500/10 transition-all"
                >
                  👀 Önce Dene
                </motion.button>
              </Link>
            </div>
            <p className="text-white/30 text-xs mt-6">
              Kredi kartı gerektirmez · İstediğin zaman sil · Süresiz ücretsiz
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-8 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size={32} />
            <span className="text-white/40 text-sm">© 2026 PythonMulakat. Tüm hakları saklıdır.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="mailto:mkemal@pythonmulakat.com" className="text-white/30 hover:text-white/60 text-sm transition-colors">
              mkemal@pythonmulakat.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}