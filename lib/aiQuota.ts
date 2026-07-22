/** Auth kullanıcılar için günlük ücretsiz AI Feedback hakkı (backend MAX_FREE_FEEDBACK_AUTH ile aynı). */
export const FREE_AI_FEEDBACK_LIMIT = 10;

export function freeAiLimitLabel(period: "günlük" | "ücretsiz" = "günlük"): string {
  return period === "günlük"
    ? `günlük ${FREE_AI_FEEDBACK_LIMIT} kullanım hakkı`
    : `${FREE_AI_FEEDBACK_LIMIT} ücretsiz kullanım hakkı`;
}
