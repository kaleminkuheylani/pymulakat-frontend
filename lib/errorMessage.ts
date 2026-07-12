// lib/errorMessage.ts
// TS strict mode'da catch (e: unknown) için güvenli erişim.
// 
// Kullanım:
//   catch (e) { log(errorMessage(e)); }
//   catch (e) { setError(errorMessage(e, "Varsayılan mesaj")); }

/**
 * Unknown hata değerinden string mesaj çıkar.
 * Error instance ise message, string ise kendisi, aksi halde String().
 */
export function errorMessage(e: unknown, fallback = "Bilinmeyen hata"): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  if (e && typeof e === "object" && "message" in e && typeof (e as { message: unknown }).message === "string") {
    return (e as { message: string }).message;
  }
  return fallback;
}
