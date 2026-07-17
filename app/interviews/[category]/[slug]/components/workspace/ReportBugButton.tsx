// ReportBugButton.tsx — "Soru hataliysa lutfen bildir" butonu.
//
// 2026-07-17: Kullanici istedi — her soru icin hata bildirimi.
// - Sadece authenticated user (isGuest ise render etme)
// - Screenshot paste/drag + description textarea
// - POST /api/v2/question-reports (auth required)
// - Toast success/error
// - Rate limit: 5/saat (backend enforce eder)

"use client";
import { useState, useRef, useCallback } from "react";
import { AlertCircle, X, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ReportBugButtonProps {
  questionId: number;
  questionSlug: string;
  category: string;
  isGuest: boolean;
}

interface ApiError {
  status: number;
  message: string;
}

export default function ReportBugButton({
  questionId,
  questionSlug,
  category,
  isGuest,
}: ReportBugButtonProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Misafire render etme
  if (isGuest) return null;

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Sadece resim dosyasi kabul edilir");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Screenshot 2MB'dan buyuk olamaz");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // result = "data:image/png;base64,iVBORw0KG..." — base64 kismini al
      const base64 = result.split(",")[1] || result;
      setScreenshotBase64(base64);
      setScreenshotPreview(result);
    };
    reader.readAsDataURL(file);
  }, []);

  // Paste handler (Ctrl+V)
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            handleFile(file);
            return;
          }
        }
      }
    },
    [handleFile]
  );

  // Drag & drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleSubmit = async () => {
    if (description.trim().length < 10) {
      toast.error("Aciklama en az 10 karakter olmali");
      return;
    }
    if (description.trim().length > 2000) {
      toast.error("Aciklama 2000 karakterden fazla olamaz");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/v2/question-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          question_id: questionId,
          question_slug: questionSlug,
          category,
          description: description.trim(),
          screenshot_base64: screenshotBase64,
        }),
      });

      if (!res.ok) {
        const err: ApiError = await res
          .json()
          .catch(() => ({ status: res.status, message: res.statusText }));
        if (res.status === 401) {
          toast.error("Oturum gecersiz. Lutfen tekrar giris yapin.");
        } else if (res.status === 429) {
          toast.error("Cok fazla rapor gonderdiniz. 1 saat sonra tekrar deneyin.");
        } else if (res.status === 400) {
          toast.error(err.message || "Gecersiz istek. Screenshot 2MB'dan buyuk olabilir.");
        } else {
          toast.error(err.message || "Rapor gonderilemedi");
        }
        return;
      }

      const data = await res.json();
      toast.success(data.message || "Raporunuz alindi. Tesekkurler!");
      setOpen(false);
      setDescription("");
      setScreenshotBase64(null);
      setScreenshotPreview(null);
    } catch (err) {
      toast.error("Ag hatasi. Lutfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger butonu */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md text-rose-300 bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 hover:border-rose-400/50 transition-colors"
        title="Bu soruda hata var mi? Bize bildirin."
      >
        <AlertCircle className="w-3 h-3" />
        Soru hataliysa lutfen bildir
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => !submitting && setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0e1a] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onPaste={handlePaste}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                Soru Hatasini Bildir
              </h3>
              <button
                type="button"
                onClick={() => !submitting && setOpen(false)}
                disabled={submitting}
                className="text-white/40 hover:text-white transition-colors"
                title="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              {/* Description */}
              <div>
                <label
                  htmlFor="report-desc"
                  className="block text-[11px] font-semibold text-white/70 mb-1.5 uppercase tracking-wider"
                >
                  Sorun ne? *
                </label>
                <textarea
                  id="report-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  maxLength={2000}
                  disabled={submitting}
                  placeholder="Orn: 'Beklenen cikti yanlis, dogru sonuc 2 degil 3 olmali' veya 'Aciklama anlasilmiyor, daha fazla ornek ekleyin'..."
                  className="w-full px-3 py-2 text-sm text-white bg-white/5 border border-white/10 rounded-lg focus:border-rose-500/50 focus:outline-none resize-none placeholder:text-white/30 disabled:opacity-50"
                />
                <div className="text-[10px] text-white/40 mt-1 flex justify-between">
                  <span>En az 10 karakter</span>
                  <span>{description.length}/2000</span>
                </div>
              </div>

              {/* Screenshot */}
              <div>
                <label className="block text-[11px] font-semibold text-white/70 mb-1.5 uppercase tracking-wider">
                  Screenshot (opsiyonel)
                </label>
                {screenshotPreview ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={screenshotPreview}
                      alt="Screenshot preview"
                      className="w-full max-h-48 object-contain rounded-lg border border-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setScreenshotBase64(null);
                        setScreenshotPreview(null);
                      }}
                      disabled={submitting}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
                      title="Screenshot'i kaldir"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-[10px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Eklendi
                    </div>
                  </div>
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 hover:border-rose-500/30 rounded-lg p-4 text-center cursor-pointer transition-colors group"
                  >
                    <ImageIcon className="w-6 h-6 text-white/30 group-hover:text-rose-400 mx-auto mb-1.5 transition-colors" />
                    <p className="text-[11px] text-white/50">
                      <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 font-mono text-[10px]">
                        Ctrl+V
                      </kbd>{" "}
                      ile yapistir, surukle birak veya tikla
                    </p>
                    <p className="text-[10px] text-white/30 mt-1">
                      PNG, JPG, WebP · maks 2MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => !submitting && setOpen(false)}
                disabled={submitting}
                className="px-3 py-1.5 text-xs text-white/70 hover:text-white transition-colors disabled:opacity-50"
              >
                Iptal
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || description.trim().length < 10}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-rose-500 hover:bg-rose-400 disabled:bg-white/5 disabled:text-white/30 text-white text-xs font-bold rounded-lg transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Gonderiliyor...
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    Rapor Et
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
