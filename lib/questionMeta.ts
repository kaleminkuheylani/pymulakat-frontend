// lib/questionMeta.ts
//
// CSV-only mimari: bu dosya sadece utility (slugifyTitle, slugifyCategory) ve
// tip tanımı (QuestionMetaView) tutar. Backend DB'ye bağımlı fonksiyon
// yoktur — eski getIdFromSlug kaldırıldı.

/**
 * Title'dan URL slug üret (SEO friendly, frontend-only).
 * CSV'de title'dan slug üretilir (DB slug alanı artık kullanılmıyor).
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
 * QuestionMetaView tipi (UI tarafı için re-export).
 * CSV'den gelen soru objesi bu formata map'lenebilir.
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
 * CSV Question → QuestionMetaView formatına map'le.
 * (Eski DB QuestionOut uyumluluğu — frontend'de hâlâ kullanılıyor)
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