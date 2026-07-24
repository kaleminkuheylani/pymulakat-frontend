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
    title: "Programlama Temelleri Nedir? — Sıfırdan Python Öğren (Yeni Başlayanlar İçin)",
    excerpt:
      "Sıfırdan Python öğrenmek isteyenler için temel yapı taşları: koşul ifadeleri, döngüler, fonksiyonlar. 5 somut örnek, akış şeması, FAQ ve Python kodu ile temiz bir giriş.",
    date: "2026-07-18",
    readingMinutes: 7,
    tags: ["python ogren", "programlama temelleri", "kodlama temelleri", "yazilima giris"],
  },
  {
    slug: "sifirdan-zirveye",
    title: "Sıfırdan Python Öğren: 30 Dakikada İlk Programını Yaz",
    excerpt:
      "Hiç kod yazmamış biri için 8 kısa görev. Tarayıcıda Python — kurulum yok. Yaz, çalıştır, test geçince sonraki açılır. 30 dakikada kodlama temellerini öğren.",
    date: "2026-07-18",
    readingMinutes: 30,
    tags: ["sifirdan python", "python ogren", "kodlama temelleri", "yeni baslayan"],
  },
  {
    slug: "algoritma-nedir",
    title: "Algoritma Nedir? — Kodlama Mantığını Öğren (Yeni Başlayanlar İçin)",
    excerpt:
      "Bir problemi çözmek için izlenen sonlu, sıralı, kesin adımlar bütünü. Yazılıma giriş için temel kavram: sandviç tarifinden bubble sort'a, akış şemaları ve pseudo kodlarla.",
    date: "2026-07-17",
    readingMinutes: 7,
    tags: ["kodlama mantigi", "yazilima giris", "programlama temelleri", "algoritma"],
  },
  {
    slug: "teknik-terimler",
    title: "Yazılıma Giriş: 20+ Temel Teknik Terim Sözlüğü (Mutfak, Restoran Benzetmeleriyle)",
    excerpt:
      "Yazılıma yeni başlayanlar için 20+ temel teknik terim: binary, machine code, interpreter, derleyici, IDE, runtime. Mutfak, restoran, elektrik ve tercüman benzetmeleriyle.",
    date: "2026-07-18",
    readingMinutes: 12,
    tags: ["yazilima giris", "kodlama sozlugu", "programlama temelleri", "temel kavramlar"],
  },
  {
    slug: "algoritma-labirenti",
    title: "Mülakat Hazırlık: 30 Dakikada 6 Kodlama Problemini Çöz",
    excerpt:
      "Yazılım mülakatına hazırlananlar için interaktif kodlama kasabası: 6 seviye, 12 test case. Yazılım mülakatı pratiği: filtreleme, max bulma, palindrom, anagram. 30 dakikada tamamla.",
    date: "2026-07-18",
    readingMinutes: 30,
    tags: ["mulakat hazirlik", "kodlama pratiği", "yazilim mulakat", "problem cozme"],
  },
  {
    slug: "javascript-closure-nedir",
    title: "Yazılım Mülakatı: Kapsam ve Fonksiyon Hafızası (JavaScript Örnekleriyle)",
    excerpt:
      "Yazılım mülakatının en çok sorulan konularından: kapsam ve fonksiyon hafızası nasıl çalışır, hangi problemi çözer. Gerçek dünya benzetmeleri, 5 kod örneği, mülakat SSS ve sık yapılan hatalar.",
    date: "2026-07-19",
    readingMinutes: 12,
    tags: ["yazilim mulakat", "kodlama becerileri", "mulakat hazirlik", "python dersleri"],
  },
  {
    slug: "javascript-hoisting",
    title: "Mülakat Hazırlık: Değişken Yükseltme ve var/let/const Farkı (Örneklerle)",
    excerpt:
      "Yazılım mülakatında sıkça sorulan: değişkenler nasıl yukarı çekilir, var-let-const farkı, fonksiyon deklarasyonu vs ifadesi, temporal dead zone ve mülakat tuzakları.",
    date: "2026-07-19",
    readingMinutes: 11,
    tags: ["mulakat hazirlik", "kodlama temelleri", "yazilim mulakat", "python mulakat sorulari"],
  },
  {
    slug: "javascript-async-await",
    title: "Mülakat Hazırlık: Asenkron Programlama ve Promise/async/await (Örneklerle)",
    excerpt:
      "Yazılım mülakatının en kritik konularından: asenkron programlama, callback'ten async/await'e evrim, paralel-await sıralı-await farkı, mülakat tuzakları ve sık yapılan hatalar.",
    date: "2026-07-19",
    readingMinutes: 14,
    tags: ["mulakat hazirlik", "yazilim mulakat", "kodlama pratiği", "python dersleri"],
  },
  {
    slug: "javascript-promise-nedir",
    title: "Mülakat Hazırlık: Promise Kavramı ve .then().catch() (Örneklerle)",
    excerpt:
      "Yazılım mülakatının temel konularından: söz dilim (promise), üç durum (pending/fulfilled/rejected), .then().catch() zinciri, callback'ten kurtuluş. SSS, benzetmeler, mülakat tuzakları.",
    date: "2026-07-22",
    readingMinutes: 13,
    tags: ["mulakat hazirlik", "yazilim mulakat", "kodlama pratiği", "python dersleri"],
  },
  {
    slug: "javascript-this-keyword",
    title: "Mülakat Hazırlık: Bağlam (Context), this, call, apply, bind (Örneklerle)",
    excerpt:
      "Yazılım mülakatının zorlu konularından: bağlam (context) kavramı, dört bağlam kuralı, arrow function farkı, call/apply/bind ile bağlam değiştirme. Mülakat odaklı örneklerle.",
    date: "2026-07-22",
    readingMinutes: 12,
    tags: ["mulakat hazirlik", "yazilim mulakat", "kodlama becerileri", "python dersleri"],
  },
  {
    slug: "en-iyi-python-kurslari",
    title: "En İyi 7 Python Kursu (Udemy + Coursera) — 2026 Güncel Fiyat Karşılaştırma",
    excerpt:
      "Python öğrenmek için en iyi 7 online kurs (Udemy + Coursera + ücretsiz). Seviye, eğitmen, sertifika, güncel fiyat ve editör seçimi. Sıfırdan ileri seviyeye uygun kurslar.",
    date: "2026-07-24",
    readingMinutes: 14,
    tags: ["python kursu", "udemy python", "coursera python", "kodlama egitimi", "online ogrenme"],
  },
  {
    slug: "en-iyi-programlama-kitaplari",
    title: "En İyi 10 Programlama Kitabı (2026) — Yabancı Dil + Türkçe Öneriler",
    excerpt:
      "Python ve yazılım geliştirme için en iyi 10 kitap (5 yabancı dil + 5 Türkçe). Yazar, seviye, fiyat, dil ve editör seçimi. Sıfırdan ileri seviyeye uygun kitaplar.",
    date: "2026-07-24",
    readingMinutes: 15,
    tags: ["programlama kitabi", "python kitap", "temel kavramlar", "yazilima giris", "kodlama ogren"],
  },
];

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<BlogPostMeta | null> {
  return POSTS.find((p) => p.slug === slug) ?? null;
}
