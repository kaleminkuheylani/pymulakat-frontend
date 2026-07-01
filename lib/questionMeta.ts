// lib/questionMeta.ts
// 67 soru için sabit metadata: function_name, topic, level_description
// DB'de olmayan (silinen) alanları frontend buradan çeker

export interface QuestionMeta {
  id: number;
  title: string; // Soru başlğı (DB'den gelmez, fallback için)
  function_name: string;
  topic: string;
  difficulty_note: string; // Kısa açıklama (level'dan daha detaylı)
  prerequisites?: number[]; // Önce çözülmesi gereken soru ID'leri
  related_concepts: string[];
  related_questions: number[]; // Benzer soru ID'leri (DB boşsa fallback)
  slug?: string; // URL-friendly slug (canonical URL)
}

export const QUESTION_META: Record<number, QuestionMeta> = {
  // ═══ PYTHON BASICS (1-15) ═══
  1: { id: 1, title: "Palindrom Kontrol", function_name: "is_palindrome", slug: "palindrom-kontrol", topic: "String İşlemleri", difficulty_note: "String slicing ve regex ile palindrome kontrolü", related_concepts: ["string", "slicing", "regex"], related_questions: [3, 7, 51, 17, 23] },
  2: { id: 2, title: "FizzBuzz", function_name: "fizzbuzz", slug: "fizzbuzz", topic: "Kontrol Yapıları", difficulty_note: "Modulo operatörü ve if-elif zinciri", related_concepts: ["modulo", "kontrol yapıları"], related_questions: [53, 11, 1] },
  3: { id: 3, title: "En Uzun Kelime", function_name: "longest_word", slug: "en-uzun-kelime", topic: "String İşlemleri", difficulty_note: "String split ve max() fonksiyonu", related_concepts: ["string", "max", "split"], related_questions: [1, 7, 17, 19] },
  4: { id: 4, title: "Sihirli Kare", function_name: "is_magic_square", slug: "sihirli-kare", topic: "Matris İşlemleri", difficulty_note: "İç içe liste ve zip() ile matris kontrolü", related_concepts: ["matris", "zip", "iç içe liste"], related_questions: [30, 14, 10] },
  5: { id: 5, title: "Sayi Tahmin", function_name: "guess_score", slug: "sayi-tahmin", topic: "Algoritma Tasarımı", difficulty_note: "Random modülü ve oyun döngüsü", related_concepts: ["random", "while döngüsü"], related_questions: [9, 14, 16] },
  6: { id: 6, title: "Karakter Sayaci", function_name: "char_count", slug: "karakter-sayaci", topic: "Veri Yapıları", difficulty_note: "Counter veya dict ile karakter sayma", related_concepts: ["Counter", "dict"], related_questions: [11, 19, 29] },
  7: { id: 7, title: "Anagram Kontrol", function_name: "is_anagram", slug: "anagram-kontrol", topic: "String İşlemleri", difficulty_note: "String normalize ve karşılaştırma", related_concepts: ["string", "normalize"], related_questions: [1, 3, 17] },
  8: { id: 8, title: "Rakam Toplami", function_name: "sum_digits", slug: "rakam-toplami", topic: "Algoritma Tasarımı", difficulty_note: "Recursive veya iterative rakam toplamı", related_concepts: ["özyineleme", "modulo"], related_questions: [9, 11, 16] },
  9: { id: 9, title: "Asal Sayi", function_name: "is_prime", slug: "asal-sayi", topic: "Matematik", difficulty_note: "Modulo ile asal sayı kontrolü", related_concepts: ["matematik", "modulo"], related_questions: [11, 14, 16] },
  10: { id: 10, title: "Kumulatif Toplam", function_name: "cumulative_sum", slug: "kumulatif-toplam", topic: "Dizi İşlemleri", difficulty_note: "itertools.accumulate veya döngü", related_concepts: ["itertools", "dizi"], related_questions: [35, 32, 39] },
  11: { id: 11, title: "OBEB Hesaplama", function_name: "gcd", slug: "obeb-hesaplama", topic: "Matematik", difficulty_note: "Öklid algoritması ile OBEB", related_concepts: ["matematik", "özyineleme"], related_questions: [9, 8, 16] },
  12: { id: 12, title: "Ucgen Tipi", function_name: "triangle_type", slug: "ucgen-tipi", topic: "Geometri", difficulty_note: "Üçgen eşitsizliği ve tip kontrolü", related_concepts: ["geometri", "koşullar"], related_questions: [4, 30, 14] },
  13: { id: 13, title: "Ters Cevirme", function_name: "reverse_string", slug: "ters-cevirme", topic: "String İşlemleri", difficulty_note: "String veya liste ters çevirme", related_concepts: ["string", "slicing"], related_questions: [1, 7, 17] },
  14: { id: 14, title: "Matris Transpoz", function_name: "matrix_transpose", slug: "matris-transpoz", topic: "Matris İşlemleri", difficulty_note: "zip(*) ile matris transpozu", related_concepts: ["matris", "zip"], related_questions: [4, 30, 10] },
  15: { id: 15, title: "Sayi Heceleme", function_name: "spell_number", slug: "sayi-heceleme", topic: "Algoritma Tasarımı", difficulty_note: "Recursive sayı yazıya çevirme", related_concepts: ["özyineleme"], related_questions: [8, 9, 11] },

  // ═══ STRINGS (16-30) ═══
  16: { id: 16, title: "Parantez Dengesi", function_name: "is_balanced", slug: "parantez-dengesi", topic: "Veri Yapıları", difficulty_note: "Stack ile parantez dengesi", related_concepts: ["stack"], related_questions: [8, 11, 17] },
  17: { id: 17, title: "Slug Olusturucu", function_name: "slugify", slug: "slug-olusturucu", topic: "String İşlemleri", difficulty_note: "Regex ile URL-friendly slug", related_concepts: ["regex", "string"], related_questions: [1, 7, 3] },
  18: { id: 18, title: "Run-Length Encoding", function_name: "run_length_encode", slug: "run-length-encoding", topic: "Algoritma Tasarımı", difficulty_note: "Run-length encoding (sıkıştırma)", related_concepts: ["string", "algoritma"], related_questions: [20, 19, 6] },
  19: { id: 19, title: "Kelime Sikligi", function_name: "word_frequency", slug: "kelime-sikligi", topic: "Veri Yapıları", difficulty_note: "Counter ile kelime sıklığı", related_concepts: ["Counter"], related_questions: [6, 18, 20] },
  20: { id: 20, title: "String Sikistirma", function_name: "compress_string", slug: "string-sikistirma", topic: "Algoritma Tasarımı", difficulty_note: "String sıkıştırma algoritması", related_concepts: ["string", "algoritma"], related_questions: [18, 19, 6] },
  21: { id: 21, title: "Roma Rakami", function_name: "roman_to_int", slug: "roma-rakami", topic: "String İşlemleri", difficulty_note: "Roman rakamı -> int dönüşümü", related_concepts: ["string", "parsing"], related_questions: [22, 23, 1] },
  22: { id: 22, title: "Pangram Kontrol", function_name: "is_pangram", slug: "pangram-kontrol", topic: "String İşlemleri", difficulty_note: "Tüm alfabe var mı kontrolü", related_concepts: ["string", "set"], related_questions: [21, 23, 19] },
  23: { id: 23, title: "Kelime Sayisi", function_name: "word_count", slug: "kelime-sayisi", topic: "String İşlemleri", difficulty_note: "Gelişmiş kelime sayımı (Unicode)", related_concepts: ["string", "regex"], related_questions: [19, 3, 22] },
  24: { id: 24, title: "Cumle Baslangici", function_name: "sentence_start", slug: "cumle-baslangici", topic: "String İşlemleri", difficulty_note: "Cümle başlangıç büyük harf", related_concepts: ["string"], related_questions: [17, 1, 7] },
  25: { id: 25, title: "DNA Tamamlayici", function_name: "dna_complement", slug: "dna-tamamlayici", topic: "Algoritma Tasarımı", difficulty_note: "DNA tamamlayıcısı (A-T, C-G)", related_concepts: ["string", "biyoinformatik"], related_questions: [18, 19, 20] },
  26: { id: 26, title: "Liste Birlestir", function_name: "merge_lists", slug: "liste-birlestir", topic: "Veri Yapıları", difficulty_note: "İki sıralı listeyi birleştir", related_concepts: ["liste", "iki pointer"], related_questions: [27, 28, 29] },
  27: { id: 27, title: "Sozluk Birlestir", function_name: "merge_dicts", slug: "sozluk-birlestir", topic: "Veri Yapıları", difficulty_note: "Sözlük birleştirme, çakışma yönetimi", related_concepts: ["sözlük"], related_questions: [26, 28, 29] },
  28: { id: 28, title: "Gruplama", function_name: "group_by", slug: "gruplama", topic: "Veri Yapıları", difficulty_note: "defaultdict ile gruplama", related_concepts: ["sözlük", "defaultdict"], related_questions: [27, 26, 29] },
  29: { id: 29, title: "Liste Farki", function_name: "diff_lists", slug: "liste-farki", topic: "Veri Yapıları", difficulty_note: "İki liste farkı (set operasyonları)", related_concepts: ["set"], related_questions: [26, 27, 28] },
  30: { id: 30, title: "Matris Carpim", function_name: "matrix_multiply", slug: "matris-carpim", topic: "Matris İşlemleri", difficulty_note: "İç içe döngü ile matris çarpımı", related_concepts: ["matris", "iç içe döngü"], related_questions: [4, 14, 10] },

  // ═══ LIST-DICT (31-45) ═══
  31: { id: 31, title: "Stok Takibi", function_name: "stock_tracker", slug: "stok-takibi", topic: "Veri Yapıları", difficulty_note: "Stok takip dict'i", related_concepts: ["sözlük"], related_questions: [35, 38, 43] },
  32: { id: 32, title: "Hareketli Ortalama", function_name: "moving_average", slug: "hareketli-ortalama", topic: "Veri Analizi", difficulty_note: "Sliding window", related_concepts: ["döngü"], related_questions: [39, 45, 35] },
  33: { id: 33, title: "En Uzun Artan Dizi", function_name: "longest_increasing_subseq", slug: "en-uzun-artan-dizi", topic: "Algoritma Tasarımı", difficulty_note: "En uzun artan alt dizi (LIS)", related_concepts: ["dinamik programlama"], related_questions: [47, 50, 49] },
  34: { id: 34, title: "Fiyat Analizi", function_name: "analyze_prices", slug: "fiyat-analizi", topic: "Veri Analizi", difficulty_note: "Fiyat istatistikleri", related_concepts: ["istatistik"], related_questions: [35, 38, 40] },
  35: { id: 35, title: "Kumulatif Total", function_name: "cumulative_total", slug: "kumulatif-total", topic: "Veri Analizi", difficulty_note: "Kümülatif toplam", related_concepts: ["accumulate"], related_questions: [31, 38, 32] },
  36: { id: 36, title: "Anket Sonucu", function_name: "favorite_color_poll", slug: "anket-sonucu", topic: "Veri Yapıları", difficulty_note: "Counter ile anket", related_concepts: ["Counter"], related_questions: [19, 38, 42] },
  37: { id: 37, title: "Eksik Deger", function_name: "fill_missing", slug: "eksik-deger", topic: "Veri Temizleme", difficulty_note: "Eksik değer doldurma", related_concepts: ["defaultdict"], related_questions: [41, 38, 36] },
  38: { id: 38, title: "Satis Raporu", function_name: "sales_report", slug: "satis-raporu", topic: "Veri Analizi", difficulty_note: "Satış raporu (groupby)", related_concepts: ["sözlük"], related_questions: [43, 31, 35] },
  39: { id: 39, title: "Gunluk Ortalama", function_name: "daily_average", slug: "gunluk-ortalama", topic: "Veri Analizi", difficulty_note: "Günlük ortalama", related_concepts: ["ortalama"], related_questions: [45, 32, 35] },
  40: { id: 40, title: "Korelasyon", function_name: "correlation", slug: "korelasyon", topic: "Veri Analizi", difficulty_note: "İki değişken korelasyonu", related_concepts: ["istatistik"], related_questions: [34, 35, 44] },
  41: { id: 41, title: "Tekrar Eden Satir", function_name: "find_duplicates", slug: "tekrar-eden-satir", topic: "Veri Yapıları", difficulty_note: "Tekrar eden satırları bul", related_concepts: ["set"], related_questions: [29, 19, 26] },
  42: { id: 42, title: "Yas Segmentasyon", function_name: "age_segmentation", slug: "yas-segmentasyon", topic: "Veri Analizi", difficulty_note: "Yaş grubu segmentasyonu", related_concepts: ["kategorizasyon"], related_questions: [36, 38, 43] },
  43: { id: 43, title: "Grup Toplam", function_name: "group_total", slug: "grup-toplam", topic: "Veri Analizi", difficulty_note: "Grup bazlı toplam", related_concepts: ["defaultdict"], related_questions: [38, 31, 35] },
  44: { id: 44, title: "Aykiri Deger", function_name: "detect_outliers", slug: "aykiri-deger", topic: "Veri Analizi", difficulty_note: "Aykırı değer tespiti (IQR)", related_concepts: ["istatistik"], related_questions: [40, 34, 37] },
  45: { id: 45, title: "Rolling Ortalama", function_name: "rolling_average", slug: "rolling-ortalama", topic: "Veri Analizi", difficulty_note: "Hareketli ortalama (pandas)", related_concepts: ["pandas"], related_questions: [39, 32, 35] },

  // ═══ PANDAS (46-55) ═══
  46: { id: 46, title: "Binary Search Pandas", function_name: "binary_search_pandas", slug: "binary-search-pandas", topic: "Algoritma", difficulty_note: "Pandas ile binary search", related_concepts: ["pandas"], related_questions: [14, 47, 9] },
  47: { id: 47, title: "Bubble Sort", function_name: "bubble_sort", slug: "bubble-sort", topic: "Algoritma", difficulty_note: "Bubble sort implementasyonu", related_concepts: ["sıralama"], related_questions: [33, 50, 49] },
  48: { id: 48, title: "Bozuk Para", function_name: "coin_change", slug: "bozuk-para", topic: "Algoritma", difficulty_note: "Greedy coin change", related_concepts: ["greedy"], related_questions: [49, 50, 11] },
  49: { id: 49, title: "Knapsack", function_name: "knapsack", slug: "knapsack", topic: "Algoritma", difficulty_note: "0/1 knapsack DP", related_concepts: ["dinamik programlama"], related_questions: [48, 50, 33] },
  50: { id: 50, title: "En Kisa Yol", function_name: "shortest_path", slug: "en-kisa-yol", topic: "Algoritma", difficulty_note: "BFS ile en kısa yol", related_concepts: ["BFS", "graf"], related_questions: [33, 49, 47] },
  51: { id: 51, title: "Emoji Duygu Analizi", function_name: "emoji_sentiment", slug: "emoji-duygu-analizi", topic: "NLP", difficulty_note: "Emoji duygu analizi", related_concepts: ["NLP", "emoji"], related_questions: [52, 53, 56] },
  52: { id: 52, title: "Gizli Emoji Mesaj", function_name: "decode_hidden_emoji", slug: "gizli-emoji-mesaj", topic: "Şifreleme", difficulty_note: "Gizli emoji mesajı çöz", related_concepts: ["unicode", "steganografi"], related_questions: [60, 51, 65] },
  53: { id: 53, title: "Emoji FizzBuzz", function_name: "emoji_fizzbuzz", slug: "emoji-fizzbuzz", topic: "Kontrol Yapıları", difficulty_note: "Emoji FizzBuzz", related_concepts: ["modulo"], related_questions: [2, 51, 56] },
  54: { id: 54, title: "Turkce Normalize", function_name: "turkish_normalize", slug: "turkce-normalize", topic: "String İşlemleri", difficulty_note: "Türkçe karakter normalizasyonu", related_concepts: ["locale"], related_questions: [1, 7, 17] },
  55: { id: 55, title: "Viral Skor", function_name: "viral_score", slug: "viral-skor", topic: "Sosyal Medya", difficulty_note: "Viral potansiyel skoru", related_concepts: ["NLP"], related_questions: [51, 56, 64] },

  // ═══ ALGORITHMS (56-67) ═══
  56: { id: 56, title: "Ruh Hali Dedektoru", function_name: "mood_detector", slug: "ruh-hali-dedektoru", topic: "NLP", difficulty_note: "Ruh hali emoji dedektörü", related_concepts: ["NLP"], related_questions: [51, 55, 58] },
  57: { id: 57, title: "Trend Avci", function_name: "trend_hunter", slug: "trend-avci", topic: "Sosyal Medya", difficulty_note: "Trend içerik avcısı", related_concepts: ["regex"], related_questions: [63, 55, 64] },
  58: { id: 58, title: "Emoji Ruh Hali", function_name: "emoji_mood", slug: "emoji-ruh-hali", topic: "NLP", difficulty_note: "Emoji ruh hali analizi", related_concepts: ["NLP"], related_questions: [51, 56, 66] },
  59: { id: 59, title: "Yorum Sensor", function_name: "comment_sensor", slug: "yorum-sensor", topic: "Sosyal Medya", difficulty_note: "Yorum sensörü", related_concepts: ["NLP"], related_questions: [51, 56, 66] },
  60: { id: 60, title: "Emoji Sifre", function_name: "emoji_cipher", slug: "emoji-sifre", topic: "Şifreleme", difficulty_note: "Emoji şifresi dedektörü", related_concepts: ["şifreleme"], related_questions: [52, 55, 65] },
  61: { id: 61, title: "Hye Olusturucu", function_name: "hype_generator", slug: "hye-olusturucu", topic: "Sosyal Medya", difficulty_note: "Hype yaratıcısı", related_concepts: ["string"], related_questions: [64, 55, 67] },
  62: { id: 62, title: "Yildiz Sifresi", function_name: "star_cipher", slug: "yildiz-sifresi", topic: "Şifreleme", difficulty_note: "Yıldız tayfası şifresi", related_concepts: ["şifreleme"], related_questions: [60, 52, 65] },
  63: { id: 63, title: "Hashtag Temizleyici", function_name: "trend_cleaner", slug: "hashtag-temizleyici", topic: "Sosyal Medya", difficulty_note: "Trend hashtag temizleyici", related_concepts: ["regex"], related_questions: [17, 1, 7] },
  64: { id: 64, title: "Viral Baslik", function_name: "viral_title", slug: "viral-baslik", topic: "Sosyal Medya", difficulty_note: "Viral başlık avcısı", related_concepts: ["NLP"], related_questions: [55, 61, 67] },
  65: { id: 65, title: "Gizli Mesaj Coz", function_name: "decode_message", slug: "gizli-mesaj-coz", topic: "Şifreleme", difficulty_note: "Gizli mesaj dekoder", related_concepts: ["steganografi"], related_questions: [52, 60, 51] },
  66: { id: 66, title: "Pozitif Filtre", function_name: "positive_filter", slug: "pozitif-filtre", topic: "NLP", difficulty_note: "Pozitif yorum filtresi", related_concepts: ["NLP"], related_questions: [51, 58, 56] },
  67: { id: 67, title: "Tweet Enhancer", function_name: "mood_enhancer", slug: "tweet-enhancer", topic: "NLP", difficulty_note: "Tweet ruh hali iyileştirici", related_concepts: ["NLP"], related_questions: [51, 56, 61] },
};

/**
 * Soru ID'sinden meta bilgisi al. Bulunamazsa default döndür.
 */
export function getQuestionMeta(id: number): QuestionMeta {
  return (
    QUESTION_META[id] || {
      id,
      title: `Soru ${id}`,
      function_name: "solution",
      topic: "Genel",
      difficulty_note: "",
      related_concepts: [],
      related_questions: [],
    }
  );
}

/**
 * Slug'tan ID bul (ters yön).
 * Örn: "palindrom-kontrol" → 1
 *      "obeb-hesaplama" → 11
 */
export function getIdFromSlug(slug: string): number | null {
  for (const idStr of Object.keys(QUESTION_META)) {
    const id = parseInt(idStr, 10);
    const m = QUESTION_META[id];
    // Hem DB title (İngilizce) hem QuestionMeta title (Türkçe) slug'ı kabul et
    if (slugifyTitle(m.title) === slug || m.slug === slug) {
      return id;
    }
  }
  // Belki slug direkt ID mi?
  const asNum = parseInt(slug, 10);
  if (!isNaN(asNum) && QUESTION_META[asNum]) return asNum;
  return null;
}

/**
 * Title'dan URL slug üret (SEO friendly).
 * Örn: "Palindrom Kontrol" → "palindrom-kontrol"
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
 * Kategori ID'sinden tüm soruların meta'sını al (sıralı).
 */
export function getMetaByCategory(): Record<string, QuestionMeta[]> {
  const out: Record<string, QuestionMeta[]> = {};
  for (let i = 1; i <= 15; i++) {
    if (!out["python-basics"]) out["python-basics"] = [];
    out["python-basics"].push(getQuestionMeta(i));
  }
  for (let i = 16; i <= 30; i++) {
    if (!out["strings"]) out["strings"] = [];
    out["strings"].push(getQuestionMeta(i));
  }
  for (let i = 31; i <= 45; i++) {
    if (!out["list-dict"]) out["list-dict"] = [];
    out["list-dict"].push(getQuestionMeta(i));
  }
  for (let i = 46; i <= 55; i++) {
    if (!out["pandas"]) out["pandas"] = [];
    out["pandas"].push(getQuestionMeta(i));
  }
  for (let i = 56; i <= 67; i++) {
    if (!out["algorithms"]) out["algorithms"] = [];
    out["algorithms"].push(getQuestionMeta(i));
  }
  return out;
}