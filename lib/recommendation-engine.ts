// lib/recommendation-engine.ts
// Frontend tarafında deterministic scoring — backend ile aynı mantık.
// Login olunca backend'den gelen veriyi önceliklendirir, yoksa bu fallback çalışır.

export interface UserContext {
  top_categories: string[];
  weak_categories: string[];
  success_rate: number;
  solved_ids: number[];
  user_id?: string;
}

export interface ScoredItem {
  type: "question" | "tutorial" | "form";
  id: number | string;
  title: string;
  category?: string;
  level?: string;
  slug?: string;
  score: number;
  reason: string;
}

const W = {
  CATEGORY_MATCH: 30,
  DIFFICULTY_MATCH: 20,
  FRESHNESS: 15,
  TUTORIAL_BRIDGE: 15,
  FORM_ENGAGEMENT: 10,
};

function scoreQuestion(q: { id: number; category: string; level: string; created_at?: string }, ctx: UserContext): number {
  let s = 0;
  if (ctx.top_categories.includes(q.category)) {
    const idx = ctx.top_categories.indexOf(q.category);
    s += W.CATEGORY_MATCH * (1 - idx * 0.2);
  }
  if (ctx.success_rate < 0.3 && q.level === "beginner") s += W.DIFFICULTY_MATCH;
  else if (ctx.success_rate >= 0.3 && ctx.success_rate < 0.7 && q.level === "intermediate") s += W.DIFFICULTY_MATCH;
  else if (ctx.success_rate >= 0.7 && q.level === "advanced") s += W.DIFFICULTY_MATCH;
  if (q.created_at) {
    const days = (Date.now() - new Date(q.created_at).getTime()) / 86400000;
    if (days <= 14) s += W.FRESHNESS * (1 - days / 14);
  }
  if (!ctx.solved_ids.includes(q.id)) s += 5;
  return s;
}

function scoreTutorial(t: { category?: string; created_at?: string }, ctx: UserContext): number {
  let s = 0;
  if (ctx.weak_categories.includes(t.category || "")) s += W.TUTORIAL_BRIDGE * 1.2;
  if (ctx.top_categories.includes(t.category || "")) s += W.CATEGORY_MATCH * 0.5;
  if (t.created_at) {
    const days = (Date.now() - new Date(t.created_at).getTime()) / 86400000;
    if (days <= 14) s += W.FRESHNESS;
  }
  return s;
}

export function explainQuestion(category: string, level: string, ctx: UserContext): string {
  if (ctx.top_categories.includes(category)) return `🔁 ${category} kategorisinde başarılısın`;
  if (ctx.success_rate < 0.3 && level === "beginner") return "🌱 Başlangıç seviyesi";
  return "📌 Önerilen içerik";
}

export function explainTutorial(category: string, ctx: UserContext): string {
  if (ctx.weak_categories.includes(category)) return "💪 Zorlandığın kategoride rehber";
  return "📖 Konuyu pekiştirir";
}

export const RECOMMENDATION_WEIGHTS = W;
export { scoreQuestion, scoreTutorial };