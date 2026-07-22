import { getAllCategories } from "@/lib/api/categoryAPI";
import { getTotalQuestionCount } from "@/lib/api/questionAPI";

export interface PlatformStats {
  questionCount: number;
  categoryCount: number;
}

/** DB'den toplam soru + kategori sayısı (hardcode yok). */
export async function getPlatformStats(): Promise<PlatformStats> {
  const [questionCount, categories] = await Promise.all([
    getTotalQuestionCount(),
    getAllCategories(),
  ]);
  const categoryCount = categories.filter((c) => c.slug !== "queue").length;
  return {
    questionCount: questionCount || 0,
    categoryCount: categoryCount || 0,
  };
}

/** SEO / UI metinleri için tutarlı özet. */
export function formatPlatformStatsSummary(stats: PlatformStats): string {
  const q = stats.questionCount > 0 ? `${stats.questionCount}` : "çok sayıda";
  const c = stats.categoryCount > 0 ? `${stats.categoryCount}` : "birden fazla";
  return `${c} kategori, ${q} soru`;
}

export function formatSeoDescription(stats: PlatformStats): string {
  return `Python ve JavaScript mülakat soruları, AI geri bildirim. Tarayıcıda kod yaz, anlık sonuç al. ${formatPlatformStatsSummary(stats)}.`;
}
