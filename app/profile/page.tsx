// app/profile/page.tsx
"use client";

import { useUser } from "../../hooks/useUser";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { interviewsAPI, AttemptResponse } from "../../api/v2/questions";
import { slugifyTitle } from "../../lib/questionMeta";

// 🔹 Yardımcı: Relative Time
function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Az önce";
  if (diffMins < 60) return `${diffMins} dakika önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays < 7) return `${diffDays} gün önce`;
  return date.toLocaleDateString("tr-TR");
}

// 🔹 Yardımcı: Süre Formatı
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}sn`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}dk ${secs}sn`;
}

// 🔹 Yardımcı Bileşenler
function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: "amber" | "green" | "blue" | "purple" }) {
  const colorMap = {
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    green: "border-green-500/30 bg-green-500/10 text-green-400",
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    purple: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  };

  return (
    <div className={`p-5 rounded-2xl border ${colorMap[color]} backdrop-blur-sm transition-all hover:scale-[1.02]`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium opacity-80">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function ProgressBar({ label, value, total, color }: { label: string; value: number; total: number; color: "green" | "red" }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  const barColor = color === "green" ? "bg-green-500" : "bg-red-500";

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400 font-mono">{value} / {total} (%{percent})</span>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
      <div className="text-amber-400 text-xl animate-pulse">Profil yükleniyor...</div>
    </div>
  );
}

// 🔹 Son Denemeler Listesi
function RecentAttempts({ attempts, loading }: { attempts: AttemptResponse[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-slate-800/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="text-4xl mb-3 block">📝</span>
        <p className="text-slate-400 text-sm">Henüz deneme yapmadın.</p>
        <Link
          href="/interviews/python-basics"
          className="inline-block mt-3 text-amber-400 hover:text-amber-300 text-sm underline"
        >
          İlk sorunu çözmeye başla →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {attempts.map((attempt) => {
        // Orphans: eski 6, 17, 51 — yeni DB'de yok, ESKİ rozet
        const isOrphaned = attempt.is_orphaned === true;
        const targetHref = `/interviews/${attempt.category || "python-basics"}/${
          attempt.question_slug ||
          (attempt.question_id as any)?.slug ||
          (attempt.question_title ? slugifyTitle(attempt.question_title) : String(attempt.question_id))
        }`;
        return (
          <Link
            key={attempt.id}
            href={targetHref}
            className={`block group ${isOrphaned ? "pointer-events-none" : ""}`}
          >
            <div className={`flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border transition-all ${
              isOrphaned
                ? "border-slate-800/60 opacity-70 cursor-not-allowed"
                : "border-slate-800 hover:border-amber-500/30 hover:bg-slate-800/50"
            }`}>
              {/* Durum İkonu */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${attempt.success
                ? "bg-green-500/15 border border-green-500/30"
                : "bg-red-500/15 border border-red-500/30"
                }`}>
                {attempt.success ? (
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </div>

              {/* Soru Bilgisi */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium truncate transition-colors ${
                    isOrphaned
                      ? "text-slate-400 italic"
                      : "text-white/90 group-hover:text-amber-400"
                  }`}>
                    {attempt.question_title || `Soru #${attempt.question_id}`}
                  </span>
                  <span className="text-white/30 text-xs font-mono flex-shrink-0">
                    #{attempt.question_id}
                  </span>
                  {isOrphaned && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/40 text-slate-500 border border-slate-700/50 font-medium tracking-wide">
                      ESKİ
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                  <span>{timeAgo(attempt.created_at)}</span>
                  <span>•</span>
                  <span>{attempt.passed_tests}/{attempt.total_tests} test</span>
                  <span>•</span>
                  <span>{formatDuration(attempt.execution_time_ms)}</span>
                </div>
              </div>

              {/* Ok İkonu — sadece orphaned değilse */}
              {!isOrphaned && (
                <svg className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// 🔹 Ana Profil Sayfası
export default function ProfilePage() {
  const { user, loading, refresh } = useUser();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [attempts, setAttempts] = useState<AttemptResponse[]>([]);
  const [attemptsLoading, setAttemptsLoading] = useState(true);
  // 📌 KVKK hesap silme state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // 📥 Son 10 denemeyi çek
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    interviewsAPI.getMyAttempts(10)
      .then((data) => {
        if (!cancelled) setAttempts(data);
      })
      .catch((err) => {
        console.warn("Attempts yüklenemedi:", err);
      })
      .finally(() => {
        if (!cancelled) setAttemptsLoading(false);
      });

    return () => { cancelled = true; };
  }, [user]);

  if (loading) return <LoadingSkeleton />;
  if (!user) {
    router.push("/register");
    return null;
  }

  // 📊 Hesaplamalar
 

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}dk ${s}sn`;
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  // 📌 KVKK md. 11 - Hesap ve verilerin tamamen silinmesi
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "HESABIMI SIL") {
      setDeleteError("Onay metni hatali. 'HESABIMI SIL' yazmalisiniz.");
      return;
    }
    setIsDeleting(true);
    setDeleteError(null);
    try {
      // Supabase token'ı al (sb-pymulakat-auth-token veya fallback 'token')
      const getToken = (): string | null => {
        if (typeof window === "undefined") return null;
        try {
          const raw = localStorage.getItem("sb-pymulakat-auth-token");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.access_token) return parsed.access_token;
          }
        } catch {
          // ignore
        }
        return localStorage.getItem("token");
      };
      const token = getToken();
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiBase}/api/v2/account/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ confirmation: deleteConfirmText }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Hesap silinemedi");
      }
      // Logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/?deleted=1");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Bilinmeyen hata");
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-amber-500/30">
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* 👤 Profil Başlık Kartı */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-black/20">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.username.charAt(0).toUpperCase()}
            </div>
            {user.is_verified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full border-2 border-slate-900">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{user.username}</h1>
              {user.is_verified ? (
                <span className="bg-green-500/20 text-green-400 text-xs px-2.5 py-1 rounded-full border border-green-500/30 font-medium">
                  Doğrulanmış Hesap
                </span>
              ) : (
                <span className="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-1 rounded-full border border-amber-500/30 font-medium">
                  Doğrulanmamış
                </span>
              )}
            </div>
            <p className="text-slate-400 mt-1 text-sm font-mono">{user.email}</p>
          </div>

          <button
            onClick={refresh}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition group"
            title="Verileri Yenile"
          >
            <svg className="w-5 h-5 text-slate-300 group-hover:text-amber-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

      
        {/* 📈 Detay & Aksiyonlar */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Performans Dağılımı */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-5 text-amber-400 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Performans Dağılımı
            </h2>
           
            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between text-sm text-slate-400">
              <span>Başarı:</span>
              <span className="font-mono text-green-400">{user.success_count}</span>
              <span>Başarısız:</span>
              <span className="font-mono text-red-400">{user.fail_count}</span>
            </div>
          </div>

          {/* Hesap & Çıkış Kartı */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-3 text-amber-400 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Hesap Yönetimi
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                İlerlemen otomatik olarak kaydedilir. Çıkış yaptığında token yerel depolamadan silinir.
              </p>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="mt-6 w-full py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Çıkış Yapılıyor...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Çıkış Yap
                </>
              )}
            </button>
          </div>
        </div>

        {/* 📌 KVKK Hesap Silme Alani */}
        <div className="mb-8 bg-red-950/20 border border-red-900/40 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-2 text-red-400 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Hesabımı Sil (KVKK md. 11)
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            KVKK kapsamında dilediğiniz zaman hesabınızı silebilirsiniz. Bu işlem
            <strong className="text-red-300"> geri alınamaz</strong>: tüm denemeleriniz,
            ilerlemeniz ve profil bilgileriniz kalıcı olarak silinir. Detaylı bilgi için
{" "}<Link href="/terms" className="text-amber-300 underline">Kullanıcı Sözleşmesi</Link>'ni inceleyin.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-5 py-2.5 bg-red-500/10 border border-red-500/40 text-red-400 rounded-xl hover:bg-red-500/20 transition-all font-medium text-sm"
            >
              Hesabımı Silmek İstiyorum
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-white text-sm">
                Onaylamak için aşağıdaki kutuya <code className="bg-red-900/40 px-1.5 py-0.5 rounded text-red-300 font-mono">HESABIMI SIL</code> yazın:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => {
                  setDeleteConfirmText(e.target.value);
                  setDeleteError(null);
                }}
                placeholder="HESABIMI SIL"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:border-red-500 focus:outline-none font-mono text-sm"
                disabled={isDeleting}
                autoComplete="off"
              />
              {deleteError && (
                <p className="text-red-400 text-xs">{deleteError}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || deleteConfirmText !== "HESABIMI SIL"}
                  className="px-5 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      Siliniyor...
                    </>
                  ) : (
                    "Kalıcı Olarak Sil"
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                    setDeleteError(null);
                  }}
                  disabled={isDeleting}
                  className="px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-all font-medium text-sm"
                >
                  Vazgeç
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 🔗 KISAYOLLAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <Link
            href="/interviews"
            className="flex items-center justify-between p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/[0.08] to-transparent hover:border-amber-500/30 transition-colors group"
          >
            <div>
              <div className="text-sm font-semibold text-white">Soru Çöz</div>
              <div className="text-[11px] text-white/40 mt-0.5">Pratik yapmaya devam et</div>
            </div>
            <span className="text-amber-400 text-xl group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link
            href="/interviews/python-basics"
            className="flex items-center justify-between p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/[0.08] to-transparent hover:border-indigo-500/30 transition-colors group"
          >
            <div>
              <div className="text-sm font-semibold text-white">🐍 Temel Sorular</div>
              <div className="text-[11px] text-white/40 mt-0.5">Python temelleri ile başla</div>
            </div>
            <span className="text-indigo-400 text-xl group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* 🕐 SON 10 DENEME (YENİ!) */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Son Denemelerim
            </h2>
            {attempts.length > 0 && (
              <span className="text-xs text-slate-500 font-mono">
                {attempts.length} / {user.total_attempts}
              </span>
            )}
          </div>

          <RecentAttempts attempts={attempts} loading={attemptsLoading} />
        </div>
      </main>
    </div>
  );
}