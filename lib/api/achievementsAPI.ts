import { apiFetch } from "./index";
import type { ApiAchievementResponse } from "./types";

export async function getAchievements(): Promise<ApiAchievementResponse> {
  return apiFetch<ApiAchievementResponse>("/api/v2/achievements", { auth: true });
}
