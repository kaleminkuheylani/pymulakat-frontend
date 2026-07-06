// frontend/api/v2/tutorials.ts
// Tutorial API client — uzun form rehber yazıları için

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://pymulakat-backend-production.up.railway.app";

export interface Tutorial {
  id: number;
  slug: string;
  title: string;
  description: string;
  content_md: string;
  category?: string;
  difficulty?: string;
  reading_time_minutes: number;
  related_question_ids: number[];
  faq?: Array<{ question: string; answer: string }>;
  cover_image?: string;
  view_count: number;
  published_at: string;
  updated_at: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const tutorialsAPI = {
  /**
   * Tüm tutorial'ları listele
   */
  async list(): Promise<Tutorial[]> {
    const data = await fetchJson<{ data: Tutorial[] } | Tutorial[]>(
      `${BASE_URL}/api/v2/tutorials`
    );
    return Array.isArray(data) ? data : data.data || [];
  },

  /**
   * Slug ile tekil tutorial getir
   */
  async getBySlug(slug: string): Promise<Tutorial | null> {
    try {
      const data = await fetchJson<{ data: Tutorial } | Tutorial>(
        `${BASE_URL}/api/v2/tutorials/${encodeURIComponent(slug)}`
      );
      return (data as { data: Tutorial }).data || (data as Tutorial);
    } catch {
      return null;
    }
  },

  /**
   * Kategoriye göre filtrele
   */
  async getByCategory(category: string): Promise<Tutorial[]> {
    const all = await this.list();
    return all.filter((t) => t.category === category);
  },
};