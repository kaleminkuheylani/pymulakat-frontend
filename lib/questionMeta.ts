// lib/questionMeta.ts
//
// Metadata KAYNAĞI: Supabase DB (backend /api/v2/questions/by-slug/...)
// Bu dosya artık DB'ye spesifik veri tutmuyor — sadece utility fonksiyonlar.
//
// Component'ler artık:
//   • `getIdFromSlug(slug)`   → server-side, backend'den çeker
//   • Soruya özel bilgi (function_name, topic, related_questions) →
//     `question` prop'undan (DB'den gelen QuestionOut) okunur.

/**
 * Title'dan URL slug üret (SEO friendly, frontend-only fallback).
 * Backend slug DB'de zaten var; client-side preview için kullanılabilir.
 */
export function slugifyTitle(title: string): string {
  const trMap: Record<string, string> = {
    "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u",
    "Ç": "c", "Ğ": "g", "İ": "i", "Ö": "o", "Ş": "s", "Ü": "u",
  };
  let s = title.toLowerCase().trim();
  s = s.replace(/[çğıöşüÇĞİÖŞÜ]/g, (c) => trMap[c] || c);
  s = s.replace(/[^a-z0-9\s-]/g, "");
  s = s.replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return s;
}

/**
 * Category'yi URL-safe slug'a çevir.
 */
export function slugifyCategory(cat: string): string {
  return slugifyTitle(cat);
}

/**
 * Slug → Question ID. Server-side, backend API'den çeker.
 * Bulamazsa null döner.
 */
export async function getIdFromSlug(
  slug: string,
  apiUrl: string = process.env.NEXT_PUBLIC_API_URL || "",
): Promise<number | null> {
  if (!apiUrl) return null;
  try {
    const res = await fetch(`${apiUrl}/api/v2/questions/all`, {
      next: { revalidate: 300 }, // 5 dk cache
    });
    if (!res.ok) return null;
    const data = await res.json();
    const items: Array<{ id: number; slug: string }> = data?.data || [];
    const found = items.find((q) => q.slug === slug);
    if (found) return found.id;
    // Belki slug numerik ID?
    const asNum = parseInt(slug, 10);
    if (!isNaN(asNum) && items.some((q) => q.id === asNum)) return asNum;
    return null;
  } catch {
    return null;
  }
}

/**
 * DB'den gelen QuestionOut objesi için type re-export (UI tarafı).
 */
export interface QuestionMetaView {
  id: number;
  title: string;
  function_name: string;
  topic: string;
  difficulty_note: string;
  related_concepts: string[];
  related_questions: number[];
  related_question_ids?: number[];
  slug?: string;
}

/**
 * DB QuestionOut → eski QuestionMetaView formatına map'le.
 * Artık bu fonksiyon client component'lerde kullanılıyor (getQuestionMeta kaldırıldı).
 */
export function toQuestionMetaView(q: any): QuestionMetaView {
  return {
    id: q.id,
    title: q.title,
    function_name: q.function_name || "solution",
    topic: q.topic || "Genel",
    difficulty_note: q.level || "beginner",
    related_concepts: q.related_concepts || [],
    related_questions: q.related_question_ids || [],
    related_question_ids: q.related_question_ids || [],
    slug: q.slug,
  };
}