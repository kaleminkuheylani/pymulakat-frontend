"use client";

import Link from "next/link";
import {
  Sparkles,
  TestTube,
  Zap,
  ShieldCheck,
  Terminal,
  Check,
  Code2,
} from "lucide-react";
import OAuthButtons from "@/components/auth/OAuthButtons";

const HIGHLIGHTS = [
  {
    icon: Sparkles,
    title: "Yapay zeka feedback",
    body: "DeepSeek V3 ile çözüm analizi ve geliştirme önerileri",
  },
  {
    icon: TestTube,
    title: "Hazır test case'ler",
    body: "Her soruda 4–6 otomatik test — kenar durumlar dahil",
  },
  {
    icon: Terminal,
    title: "Tarayıcıda kod yaz",
    body: "Pyodide ile kurulum yok, anında çalıştır ve test et",
  },
  {
    icon: Zap,
    title: "Gerçek mülakat soruları",
    body: "Python & JavaScript, kategorize ve zorluk seviyeli",
  },
];

const TRUST = [
  "Kurulum yok",
  "5 dakikada başla",
  "KVKK uyumlu",
  "Şimdilik ücretsiz",
];

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99, 102, 241, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.07) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 75%)",
        }}
      />
      <div className="absolute -top-24 left-1/4 w-[520px] h-[420px] bg-indigo-600/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[480px] h-[360px] bg-amber-500/10 rounded-full blur-[110px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-violet-600/5 rounded-full blur-[100px]" />
    </div>
  );
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 group"
    >
      <div
        className={`${compact ? "w-8 h-8 text-xs" : "w-9 h-9 text-sm"} rounded-xl bg-gradient-to-br from-indigo-500 to-amber-400 flex items-center justify-center font-bold text-white shadow-lg shadow-amber-400/15 group-hover:shadow-amber-400/30 transition-shadow`}
      >
        PM
      </div>
      <span className={`${compact ? "text-sm" : "text-base"} font-semibold text-white tracking-tight`}>
        PythonMulakat
      </span>
    </Link>
  );
}

function FeaturePanel() {
  return (
    <div className="relative h-full w-full flex items-center justify-center px-8 lg:px-12 xl:px-16 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center lg:justify-start">
          <BrandMark />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          DeepSeek destekli mülakat platformu
        </div>

        <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-[1.15] text-white mb-4">
          Mülakata hazırlan,
          <br />
          <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            tarayıcıda kod yaz
          </span>
        </h2>

        <p className="text-white/60 text-sm xl:text-base leading-relaxed mb-8">
          Gerçek mülakat soruları, anında test çıktısı ve DeepSeek geri bildirimi.
          Kurulum yok — hesap aç, hemen çözmeye başla.
        </p>

        <ul className="space-y-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="flex gap-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 hover:bg-white/[0.05] hover:border-white/10 transition-colors"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-amber-400/10 border border-white/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-amber-300" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-white/50 leading-relaxed mt-0.5">{body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-6 border-t border-white/[0.06]">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/45">
            {TRUST.map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                {item}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-white/35">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/80" />
            Verilerin şifreli saklanır · hesap silme tek tıkla
          </div>
        </div>
      </div>
    </div>
  );
}

export interface AuthShellProps {
  mode: "login" | "register";
  returnUrl: string;
}

export default function AuthShell({ mode, returnUrl }: AuthShellProps) {
  const isLogin = mode === "login";
  const title = isLogin ? "Tekrar hoş geldin" : "Hesabını oluştur";
  const subtitle = isLogin
    ? "Dashboard, ilerleme ve DeepSeek feedback için giriş yap."
    : "Ücretsiz hesap aç — kurulum yok, hemen kodlamaya başla.";
  const switchLabel = isLogin ? "Hesabın yok mu?" : "Zaten hesabın var mı?";
  const switchHref = isLogin
    ? `/register?returnUrl=${encodeURIComponent(returnUrl)}`
    : `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
  const switchCta = isLogin ? "Kaydol" : "Giriş Yap";

  return (
    <div className="relative min-h-screen w-full bg-[#050816] text-white overflow-x-hidden">
      <GridBackground />

      <div className="relative z-10 min-h-screen max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-stretch">
        {/* Left brand panel — desktop */}
        <aside className="hidden lg:flex lg:w-1/2 border-r border-white/[0.06]">
          <FeaturePanel />
        </aside>

        {/* Right auth card */}
        <main className="flex-1 lg:w-1/2 flex flex-col min-h-screen lg:min-h-0">
          {/* Mobile top bar */}
          <div className="lg:hidden flex items-center justify-between px-5 pt-5 pb-2">
            <BrandMark compact />
            <Link
              href="/"
              className="text-xs text-white/45 hover:text-white/70 transition-colors"
            >
              Ana sayfa
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8">
            <div className="w-full max-w-[400px]">
              {/* Mobile value strip */}
              <div className="lg:hidden mb-7 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-amber-300" />
                  Python & JS mülakat platformu
                </p>
                <p className="text-xs text-white/50 leading-relaxed mb-3">
                  DeepSeek feedback · hazır testler · tarayıcıda kod · kurulum yok
                </p>
                <div className="flex flex-wrap gap-2">
                  {TRUST.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/55"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div
                  className="absolute -inset-[1px] rounded-[1.35rem] bg-gradient-to-b from-white/15 via-amber-500/10 to-indigo-500/10 opacity-80"
                  aria-hidden
                />
                <div className="relative rounded-[1.25rem] border border-white/10 bg-[#0a0e1a]/95 backdrop-blur-xl p-7 sm:p-8 shadow-2xl shadow-black/40">
                  <div className="mb-7">
                    <div className="hidden lg:flex items-center justify-between mb-6">
                      <span className="text-[11px] uppercase tracking-[0.14em] text-white/35 font-medium">
                        {isLogin ? "Giriş" : "Kayıt"}
                      </span>
                      <Link
                        href="/"
                        className="text-xs text-white/40 hover:text-amber-300 transition-colors"
                      >
                        ← Ana sayfa
                      </Link>
                    </div>

                    <h1 className="text-2xl sm:text-[1.7rem] font-bold tracking-tight text-white mb-2">
                      {title}
                    </h1>
                    <p className="text-sm text-white/50 leading-relaxed">{subtitle}</p>
                  </div>

                  <OAuthButtons returnUrl={returnUrl} mode={mode} />

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center" aria-hidden>
                      <div className="w-full border-t border-white/[0.07]" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-3 bg-[#0a0e1a] text-[11px] text-white/35 uppercase tracking-wider">
                        güvenli OAuth
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3 mb-6">
                    <ul className="space-y-2">
                      {[
                        "İlerleme ve istatistiklerin kaydedilir",
                        "DeepSeek feedback günlük hakkın açılır",
                        "Kişisel soru önerileri devreye girer",
                      ].map((line) => (
                        <li key={line} className="flex items-start gap-2 text-xs text-white/50">
                          <Check className="w-3.5 h-3.5 text-amber-400/90 mt-0.5 shrink-0" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-center text-sm text-white/50">
                    {switchLabel}{" "}
                    <Link
                      href={switchHref}
                      className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                    >
                      {switchCta}
                    </Link>
                  </p>

                  <p className="text-center mt-5 text-[11px] text-white/35 leading-relaxed">
                    Devam ederek{" "}
                    <Link
                      href="/terms"
                      className="text-white/50 hover:text-amber-300 underline underline-offset-2"
                    >
                      Kullanım Koşulları
                    </Link>{" "}
                    ve{" "}
                    <Link
                      href="/privacy"
                      className="text-white/50 hover:text-amber-300 underline underline-offset-2"
                    >
                      Gizlilik Politikası
                    </Link>
                    &apos;nı kabul etmiş olursun.
                  </p>
                </div>
              </div>

              <p className="mt-6 text-center text-[11px] text-white/30">
                Google veya GitHub ile tek tık · şifre yok
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
