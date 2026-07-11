// lib/revalidate.ts
// On-demand ISR revalidation (DB-FIRST, commit 5/5).
//
// Admin yeni soru eklediğinde, bu helper ile /api/revalidate çağrılır.
// Production'da REVALIDATE_SECRET env zorunlu (Vercel Dashboard'dan set edilir).

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";
const REVALIDATE_SECRET = process.env.NEXT_PUBLIC_REVALIDATE_SECRET || "";

/**
 * Tag-based revalidation (tüm "questions-list" tag'i taşıyan fetch'ler invalidate olur).
 *
 * @example
 *   await revalidateQuestions();  // tüm kategori listeleri güncellenir
 */
export async function revalidateQuestions(): Promise<{ success: boolean; invalidated: string[] }> {
  if (!REVALIDATE_SECRET) {
    console.warn("[revalidate] NEXT_PUBLIC_REVALIDATE_SECRET tanımsız, skip");
    return { success: false, invalidated: [] };
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL || ""}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag: "questions-list", secret: REVALIDATE_SECRET }),
    });
    if (!res.ok) {
      console.warn(`[revalidate] API error: ${res.status}`);
      return { success: false, invalidated: [] };
    }
    return await res.json();
  } catch (e) {
    console.warn("[revalidate] Network error:", e);
    return { success: false, invalidated: [] };
  }
}

/**
 * Path-based revalidation (tek sayfa).
 *
 * @example
 *   await revalidatePath("/python-temelleri");
 */
export async function revalidatePathClient(path: string): Promise<{ success: boolean; invalidated: string[] }> {
  if (!REVALIDATE_SECRET) {
    console.warn("[revalidate] NEXT_PUBLIC_REVALIDATE_SECRET tanımsız, skip");
    return { success: false, invalidated: [] };
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL || ""}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, secret: REVALIDATE_SECRET }),
    });
    if (!res.ok) {
      console.warn(`[revalidate] API error: ${res.status}`);
      return { success: false, invalidated: [] };
    }
    return await res.json();
  } catch (e) {
    console.warn("[revalidate] Network error:", e);
    return { success: false, invalidated: [] };
  }
}

// API_BASE kullanılmıyor (helper unused warning için export edildi)
// export { API_BASE };
