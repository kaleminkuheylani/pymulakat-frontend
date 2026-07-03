// app/loading.tsx — Root loading state
// Sayfa geçişleri sırasında gösterilen minimal UI.

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-white/40 text-xs">Yükleniyor...</p>
      </div>
    </div>
  );
}