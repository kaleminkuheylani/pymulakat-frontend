"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { useUser } from "../hooks/useUser"

// ─── Grid Background ─────────────────────────────────
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

// ─── Floating Badge ───────────────────────────────────
function FloatingBadge({ text, index }: { text: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      whileHover={{ scale: 1.05, y: -4 }}
      className="group relative border border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 hover:border-indigo-400/50 transition-colors"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      <p className="relative text-sm font-semibold tracking-wider text-white/80 uppercase">
        <span className="text-amber-400 mr-2">✦</span>{text}
      </p>
    </motion.div>
  )
}

// ─── User-Aware Hero ──────────────────────────────────
function Hero({ user }: { user: { username: string } | null }) {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-12 pb-16">
      {/* Badges */}
      <div className="flex flex-wrap justify-center gap-4 mb-10 max-w-3xl">
        {[
          "KODLAMA ORTAMI GEREKMEZ",
          "VSCODE ORTAMI DESTEKLİ",
          "MÜFREDATA UYGUN SORULAR",
          "ALGORİTMA & KÜTÜPHANE",
        ].map((f, i) => (
          <FloatingBadge key={i} text={f} index={i} />
        ))}
      </div>

      {/* User-aware greeting */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-medium"
        >
          Tekrar hoş geldin, <strong>{user.username}</strong> 👋
        </motion.div>
      )}

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-center mb-6"
      >
        <span className="block text-5xl md:text-7xl font-extrabold text-white leading-tight">
          Python{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
            Gurusu Ol
          </span>
        </span>
        <span className="block text-xl md:text-2xl text-white/40 mt-4 font-light max-w-2xl mx-auto">
          Python öğrenmek isteyen herkes için tasarlanmıştır, her seviyeye hitap eden modüller içeren
          <br className="hidden md:block" />
          interaktif bir platformdur. (Aşağıdaki sorular kayıt olmadan da çözülebilir.)
        </span>
      </motion.h1>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="flex flex-col sm:flex-row items-center gap-4 mt-8"
      >
        {user ? (
          <>
            <Link href="/interviews">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="relative group bg-gradient-to-r from-amber-400 to-amber-500 text-[#050816] font-bold text-lg px-10 py-4 rounded-2xl shadow-lg shadow-amber-400/20 hover:shadow-amber-400/40 transition-all"
              >
                <span className="relative z-10">Sorulara Başla →</span>
              </motion.button>
            </Link>
            <Link href="/profile">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="border border-white/20 text-white font-semibold text-base md:text-lg px-6 md:px-8 py-3.5 md:py-4 rounded-2xl hover:border-indigo-400/50 hover:bg-indigo-500/10 transition-all"
              >
                👤 Profilim
              </motion.button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="relative group bg-gradient-to-r from-amber-400 to-amber-500 text-[#050816] font-bold text-lg px-10 py-4 rounded-2xl shadow-lg shadow-amber-400/20 hover:shadow-amber-400/40 transition-all"
              >
                <span className="relative z-10">Kayıt Ol — Ücretsiz</span>
              </motion.button>
            </Link>
            <Link href="/interviews/strings/51">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="border border-white/20 text-white font-semibold text-base md:text-lg px-6 md:px-8 py-3.5 md:py-4 rounded-2xl hover:border-indigo-400/50 hover:bg-indigo-500/10 transition-all"
              >
                💖 Emoji Duygu Analizi →
              </motion.button>
            </Link>
          </>
        )}
      </motion.div>
    </section>
  )
}

// ─── Feature Card ──────────────────────────────────────
function FeatureCard({ title, description, index }: { title: string; description: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      whileHover={{ y: -6 }}
      className="relative group border border-white/10 bg-white/[0.03] backdrop-blur-sm rounded-2xl p-8 hover:border-indigo-500/30 transition-all duration-300"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

// ─── Stat Card ─────────────────────────────────────────
function StatCard({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-3xl font-bold mb-1 ${color}`}>{value}</div>
      <div className="text-white/40 text-sm">{label}</div>
    </div>
  )
}

// ─── Install Command ───────────────────────────────────
function InstallCommand() {
  const [copied, setCopied] = useState(false)
  const command = "pip install pythonmulakat"

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Kopyalama başarısız:", err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex justify-center mt-8"
    >
      <div className="group relative border border-white/10 bg-[#0a0e1a] backdrop-blur-sm rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-lg w-full shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="text-indigo-400 font-mono text-xl">❯</span>
          <code className="text-white font-mono text-lg tracking-wide">{command}</code>
        </div>
        <button
          onClick={handleCopy}
          className="relative px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white text-sm font-medium transition-all flex items-center gap-2"
        >
          {copied ? (
            <>
              <span className="text-green-400">✓</span>
              <span>Kopyalandı</span>
            </>
          ) : (
            <>
              <span>📋</span>
              <span>Kopyala</span>
            </>
          )}
        </button>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </motion.div>
  )
}

// ─── Main Page ─────────────────────────────────────────
export default function HomePage() {
  const { user } = useUser()

  return (
    <div className="relative bg-[#050816] min-h-screen w-full overflow-x-hidden">
      <GridBackground />
      <Hero user={user} />

      {/* Stats */}
      <section className="relative z-10 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-12 mt-16 pt-10 border-t border-white/5"
        >
          <StatCard value="∞" label="Ömür Boyu Ücretsiz" color="text-amber-400" />
          <StatCard value="50+" label="Hazır Soru (Şimdilik)" color="text-amber-400" />
          <StatCard value="0" label="Kurulum Gerekmez" color="text-amber-400" />
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">
            Platform Özellikleri
          </span>
          <h2 className="text-white text-4xl md:text-5xl font-bold mt-4 mb-6">
            Bu Platform Ne Sunuyor?
          </h2>
          <p className="text-white/50 text-lg max-w-3xl mx-auto leading-relaxed">
            PythonMulakat, Python için geliştirilmiş interaktif bir platformdur. Gerçek dünya soruları, interaktif güvenli
            sandbox ortamı sunan PythonMulakat hem geliştiricilere ve yeni öğrenenlere interaktif ortam hazırlar.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard title="Pyodide Sandbox" description="Pyodide ortamı ile kolayca code execution sağlar. Tarayıcı üzerinde Python kodunuzu çalıştırın." index={0} />
          <FeatureCard title="Hazır Test Caseler" description="Developer dostu test caseler önceden oluşturulmuş sisteme entegre edilmiştir." index={1} />
          <FeatureCard title="Paket Entegrasyonu" description="pip install pymulakat ile projelerinize hızlıca entegre edin, yerel ve web ortamında çalıştırın." index={2} />
        </div>
      </section>

      {/* Install */}
      <section>
        <InstallCommand />
        <div className="text-center mt-10">
          <span className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-6 py-2.5 text-white/60 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Ve daha fazlası yakında eklenecek...
          </span>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-amber-500/10 to-indigo-500/10 rounded-3xl blur-3xl -z-10" />
          <div className="border border-white/10 bg-white/[0.03] backdrop-blur-sm rounded-3xl p-12 md:p-16">
            <h2 className="text-white text-4xl md:text-5xl font-bold mb-4">
              {user ? "Devam Et" : "Hemen Başla"}
            </h2>
            <p className="text-white/50 text-lg mb-10 max-w-lg mx-auto">
              {user
                ? "Yeni sorular çöz, ilerlemeni takip et, Python mülakatlarına hazırlanmaya devam et."
                : "Ücretsiz kayıt ol, Python mülakatlarına hazırlan ve kariyerinde bir adım öne geç."}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {user ? (
                <Link href="/interviews">
                  <button className="bg-gradient-to-r from-amber-400 to-amber-500 text-[#050816] font-bold text-lg px-10 py-4 rounded-2xl shadow-lg shadow-amber-400/20 hover:shadow-amber-400/40 transition-all">
                    Soruları Keşfet
                  </button>
                </Link>
              ) : (
                <Link href="/register">
                  <button className="bg-gradient-to-r from-amber-400 to-amber-500 text-[#050816] font-bold text-lg px-10 py-4 rounded-2xl shadow-lg shadow-amber-400/20 hover:shadow-amber-400/40 transition-all">
                    Ücretsiz Kayıt Ol
                  </button>
                </Link>
              )}
            </div>
            {!user && (
              <p className="text-white/30 text-sm mt-6">
                Ömür boyu ücretsiz • Kurulum gerektirmez
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-8 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-amber-400 flex items-center justify-center">
              <span className="text-white font-bold text-xs">PM</span>
            </div>
            <span className="text-white/40 text-sm">© 2026 PythonMulakat. Tüm hakları saklıdır.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/30 hover:text-white/60 text-sm transition-colors">
              mkemal@pythonmulakat.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}