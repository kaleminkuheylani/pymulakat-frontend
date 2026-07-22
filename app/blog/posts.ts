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
  {
    slug: "algoritma-labirenti",
    title: "Algoritma Labirenti — 30 Dakikada 6 Algoritma Problemini Çöz",
    excerpt:
      "İnteraktif algoritma kasabası: 6 seviye, 12 test case. Filtrele, max bul, palindrom, iki sayı toplamı, anagram. İki test case'i de geçmeden sonraki seviyeye geçemezsin. 30 dakikada kasabayı çöz.",
    date: "2026-07-18",
    readingMinutes: 30,
    tags: ["algoritma", "interaktif", "labirent", "30 dakika", "problem çözme"],
  },
  {
    slug: "javascript-closure-nedir",
    title: "JavaScript Closure Nedir? — Kapsam ve Fonksiyon Hafızası (Örneklerle)",
    excerpt:
      "JavaScript'in en çok sorulan mülakat konusu: closure nedir, nasıl çalışır, hangi problemi çözer. Gerçek dünya benzetmeleri, 5 kod örneği, mülakat SSS ve sık yapılan hatalar.",
    date: "2026-07-19",
    readingMinutes: 12,
    tags: ["javascript", "closure", "kapsam", "mülakat", "ileri javascript"],
  },
  {
    slug: "javascript-hoisting",
    title: "JavaScript Hoisting Nedir? — var, let, const ve Fonksiyon Yükseltme (Örneklerle)",
    excerpt:
      "JavaScript hoisting kavramı net açıklamayla: değişkenler nasıl yukarı çekilir, var-let-const farkı, fonksiyon deklarasyonu vs ifadesi, temporal dead zone ve mulakat tuzakları.",
    date: "2026-07-19",
    readingMinutes: 11,
    tags: ["javascript", "hoisting", "var let const", "kapsam", "mülakat"],
  },
  {
    slug: "javascript-async-await",
    title: "JavaScript async/await ve Promise Nedir? — Asenkron Programlama (Örneklerle)",
    excerpt:
      "JavaScript async/await, Promise ve event loop kavramı net açıklamayla: callback hell'den promise chain'e, .then().catch()'den async/await'e, paralel-await sıralı-await farkı, mulakat tuzakları.",
    date: "2026-07-19",
    readingMinutes: 14,
    tags: ["javascript", "async", "await", "promise", "asenkron", "mülakat"],
  },
  {
    slug: "javascript-promise-nedir",
    title: "JavaScript Promise Nedir? — Söz Dilim, .then(), .catch() ve Promise.all (Örneklerle)",
    excerpt:
      "JavaScript Promise kavramı temelden: sözcük anlamı, üç durumu (pending/fulfilled/rejected), .then().catch() zinciri, Promise.all/Promise.race, callback hell'den kurtuluş. SSS, benzetmeler, mülakat tuzakları.",
    date: "2026-07-22",
    readingMinutes: 13,
    tags: ["javascript", "promise", "asenkron", "then", "catch", "mülakat", "temelden"],
  },
  {
    slug: "javascript-this-keyword",
    title: "JavaScript this Keyword Nedir? — Bağlam (Context), Call, Apply, Bind (Örneklerle)",
    excerpt:
      "JavaScript this kavramı temelden: dört bağlam kuralı (global/function/method/new), arrow function farkı, call/apply/bind ile bağlam değiştirme, sık yapılan hatalar ve mülakat tuzakları.",
    date: "2026-07-22",
    readingMinutes: 12,
    tags: ["javascript", "this", "context", "call", "apply", "bind", "mülakat"],
  },
];

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<BlogPostMeta | null> {
  return POSTS.find((p) => p.slug === slug) ?? null;
}
