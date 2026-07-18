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
    slug: "sifirdan-zirveye",
    title: "Sıfırdan Zirveye: 30 Dakikada Programlama Öğren",
    excerpt:
      "Hiç kod yazmamış biri için 8 kısa görev. Tarayıcıda Python — kurulum yok. Yaz, çalıştır, test geçince sonraki açılır. Print, değişkenler, if/else, fonksiyonlar, for/while.",
    date: "2026-07-18",
    readingMinutes: 30,
    tags: ["sıfırdan", "interaktif", "temeller", "yeni başlayan"],
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
  {
    slug: "teknik-terimler",
    title: "Programlamanın Temel Teknik Terimleri — Binary, Machine Code, Interpreter ve Daha Fazlası",
    excerpt:
      "Yazılımda sık duyulan ama kimsenin düzgün anlatmadığı 20+ teknik terim: binary, machine code, interpreter, derleyici, IDE, runtime. Mutfak, restoran, elektrik ve tercüman benzetmeleriyle.",
    date: "2026-07-18",
    readingMinutes: 12,
    tags: ["temel kavramlar", "teknik terimler", "yazılıma giriş", "sözlük"],
  },
];

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<BlogPostMeta | null> {
  return POSTS.find((p) => p.slug === slug) ?? null;
}
