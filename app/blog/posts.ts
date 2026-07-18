// app/blog/posts.ts
//
// BLOG POSTS — Inline data (1 post). DB-driven olunca blog_posts tablosu
// + getBlogPosts() helper ile degistirilebilir.

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingMinutes: number;
  tags: string[];
}

const POSTS: BlogPostMeta[] = [
  {
    slug: "programlama-temelleri",
    title: "Programlama Temelleri Nedir? — if else ve Döngü Örnekleri (Python)",
    excerpt:
      "Bir programın temel yapı taşları: if/else koşul ifadeleri, for ve while döngüleri. 5 somut örnek, akış şeması, FAQ ve Python kodu ile yeni başlayanlar için temiz bir giriş.",
    date: "2026-07-18",
    readingMinutes: 7,
    tags: ["temeller", "koşul ifadeleri", "döngüler", "python başlangıç"],
  },
  {
    slug: "algoritma-nedir",
    title: "Algoritma Nedir? — Sandviçten Kodlamaya Bir Yolculuk",
    excerpt:
      "Bir problemi çözmek için izlenen sonlu, sıralı, kesin adımlar bütünü. Sandviç tarifinden bubble sort'a, akış şemaları ve pseudo kodlarla.",
    date: "2026-07-17",
    readingMinutes: 7,
    tags: ["algoritma", "temel kavramlar", "akış şeması", "bubble sort"],
  },
];

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<BlogPostMeta | null> {
  return POSTS.find((p) => p.slug === slug) ?? null;
}
