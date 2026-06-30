// lib/questionMeta.ts
// 67 soru için sabit metadata: function_name, topic, level_description
// DB'de olmayan (silinen) alanları frontend buradan çeker

export interface QuestionMeta {
  id: number;
  function_name: string;
  topic: string;
  difficulty_note: string; // Kısa açıklama (level'dan daha detaylı)
  prerequisites?: number[]; // Önce çözülmesi gereken soru ID'leri
  related_concepts: string[];
}

export const QUESTION_META: Record<number, QuestionMeta> = {
  // ═══ PYTHON BASICS (1-15) ═══
  1: { id: 1, function_name: "is_palindrome", topic: "String İşlemleri", difficulty_note: "String slicing ve regex ile palindrome kontrolü", related_concepts: ["string", "slicing", "regex"] },
  2: { id: 2, function_name: "fizzbuzz", topic: "Kontrol Yapıları", difficulty_note: "Modulo operatörü ve if-elif zinciri", related_concepts: ["modulo", "kontrol yapıları"] },
  3: { id: 3, function_name: "longest_word", topic: "String İşlemleri", difficulty_note: "String split ve max() fonksiyonu", related_concepts: ["string", "max", "split"] },
  4: { id: 4, function_name: "is_magic_square", topic: "Matris İşlemleri", difficulty_note: "İç içe liste ve zip() ile matris kontrolü", related_concepts: ["matris", "zip", "iç içe liste"] },
  5: { id: 5, function_name: "guess_score", topic: "Algoritma Tasarımı", difficulty_note: "Random modülü ve oyun döngüsü", related_concepts: ["random", "while döngüsü"] },
  6: { id: 6, function_name: "char_count", topic: "Veri Yapıları", difficulty_note: "Counter veya dict ile karakter sayma", related_concepts: ["Counter", "dict"] },
  7: { id: 7, function_name: "is_anagram", topic: "String İşlemleri", difficulty_note: "String normalize ve karşılaştırma", related_concepts: ["string", "normalize"] },
  8: { id: 8, function_name: "sum_digits", topic: "Algoritma Tasarımı", difficulty_note: "Recursive veya iterative rakam toplamı", related_concepts: ["özyineleme", "modulo"] },
  9: { id: 9, function_name: "is_prime", topic: "Matematik", difficulty_note: "Modulo ile asal sayı kontrolü", related_concepts: ["matematik", "modulo"] },
  10: { id: 10, function_name: "cumulative_sum", topic: "Dizi İşlemleri", difficulty_note: "itertools.accumulate veya döngü", related_concepts: ["itertools", "dizi"] },
  11: { id: 11, function_name: "gcd", topic: "Matematik", difficulty_note: "Öklid algoritması ile OBEB", related_concepts: ["matematik", "özyineleme"] },
  12: { id: 12, function_name: "triangle_type", topic: "Geometri", difficulty_note: "Üçgen eşitsizliği ve tip kontrolü", related_concepts: ["geometri", "koşullar"] },
  13: { id: 13, function_name: "reverse_string", topic: "String İşlemleri", difficulty_note: "String veya liste ters çevirme", related_concepts: ["string", "slicing"] },
  14: { id: 14, function_name: "matrix_transpose", topic: "Matris İşlemleri", difficulty_note: "zip(*) ile matris transpozu", related_concepts: ["matris", "zip"] },
  15: { id: 15, function_name: "spell_number", topic: "Algoritma Tasarımı", difficulty_note: "Recursive sayı yazıya çevirme", related_concepts: ["özyineleme"] },

  // ═══ STRINGS (16-30) ═══
  16: { id: 16, function_name: "is_balanced", topic: "Veri Yapıları", difficulty_note: "Stack ile parantez dengesi", related_concepts: ["stack"] },
  17: { id: 17, function_name: "slugify", topic: "String İşlemleri", difficulty_note: "Regex ile URL-friendly slug", related_concepts: ["regex", "string"] },
  18: { id: 18, function_name: "run_length_encode", topic: "Algoritma Tasarımı", difficulty_note: "Run-length encoding (sıkıştırma)", related_concepts: ["string", "algoritma"] },
  19: { id: 19, function_name: "word_frequency", topic: "Veri Yapıları", difficulty_note: "Counter ile kelime sıklığı", related_concepts: ["Counter"] },
  20: { id: 20, function_name: "compress_string", topic: "Algoritma Tasarımı", difficulty_note: "String sıkıştırma algoritması", related_concepts: ["string", "algoritma"] },
  21: { id: 21, function_name: "roman_to_int", topic: "String İşlemleri", difficulty_note: "Roman rakamı -> int dönüşümü", related_concepts: ["string", "parsing"] },
  22: { id: 22, function_name: "is_pangram", topic: "String İşlemleri", difficulty_note: "Tüm alfabe var mı kontrolü", related_concepts: ["string", "set"] },
  23: { id: 23, function_name: "word_count", topic: "String İşlemleri", difficulty_note: "Gelişmiş kelime sayımı (Unicode)", related_concepts: ["string", "regex"] },
  24: { id: 24, function_name: "sentence_start", topic: "String İşlemleri", difficulty_note: "Cümle başlangıç büyük harf", related_concepts: ["string"] },
  25: { id: 25, function_name: "dna_complement", topic: "Algoritma Tasarımı", difficulty_note: "DNA tamamlayıcısı (A-T, C-G)", related_concepts: ["string", "biyoinformatik"] },
  26: { id: 26, function_name: "merge_lists", topic: "Veri Yapıları", difficulty_note: "İki sıralı listeyi birleştir", related_concepts: ["liste", "iki pointer"] },
  27: { id: 27, function_name: "merge_dicts", topic: "Veri Yapıları", difficulty_note: "Sözlük birleştirme, çakışma yönetimi", related_concepts: ["sözlük"] },
  28: { id: 28, function_name: "group_by", topic: "Veri Yapıları", difficulty_note: "defaultdict ile gruplama", related_concepts: ["sözlük", "defaultdict"] },
  29: { id: 29, function_name: "diff_lists", topic: "Veri Yapıları", difficulty_note: "İki liste farkı (set operasyonları)", related_concepts: ["set"] },
  30: { id: 30, function_name: "matrix_multiply", topic: "Matris İşlemleri", difficulty_note: "İç içe döngü ile matris çarpımı", related_concepts: ["matris", "iç içe döngü"] },

  // ═══ LIST-DICT (31-45) ═══
  31: { id: 31, function_name: "stock_tracker", topic: "Veri Yapıları", difficulty_note: "Stok takip dict'i", related_concepts: ["sözlük"] },
  32: { id: 32, function_name: "moving_average", topic: "Veri Analizi", difficulty_note: "Sliding window", related_concepts: ["döngü"] },
  33: { id: 33, function_name: "longest_increasing_subseq", topic: "Algoritma Tasarımı", difficulty_note: "En uzun artan alt dizi (LIS)", related_concepts: ["dinamik programlama"] },
  34: { id: 34, function_name: "analyze_prices", topic: "Veri Analizi", difficulty_note: "Fiyat istatistikleri", related_concepts: ["istatistik"] },
  35: { id: 35, function_name: "cumulative_total", topic: "Veri Analizi", difficulty_note: "Kümülatif toplam", related_concepts: ["accumulate"] },
  36: { id: 36, function_name: "favorite_color_poll", topic: "Veri Yapıları", difficulty_note: "Counter ile anket", related_concepts: ["Counter"] },
  37: { id: 37, function_name: "fill_missing", topic: "Veri Temizleme", difficulty_note: "Eksik değer doldurma", related_concepts: ["defaultdict"] },
  38: { id: 38, function_name: "sales_report", topic: "Veri Analizi", difficulty_note: "Satış raporu (groupby)", related_concepts: ["sözlük"] },
  39: { id: 39, function_name: "daily_average", topic: "Veri Analizi", difficulty_note: "Günlük ortalama", related_concepts: ["ortalama"] },
  40: { id: 40, function_name: "correlation", topic: "Veri Analizi", difficulty_note: "İki değişken korelasyonu", related_concepts: ["istatistik"] },
  41: { id: 41, function_name: "find_duplicates", topic: "Veri Yapıları", difficulty_note: "Tekrar eden satırları bul", related_concepts: ["set"] },
  42: { id: 42, function_name: "age_segmentation", topic: "Veri Analizi", difficulty_note: "Yaş grubu segmentasyonu", related_concepts: ["kategorizasyon"] },
  43: { id: 43, function_name: "group_total", topic: "Veri Analizi", difficulty_note: "Grup bazlı toplam", related_concepts: ["defaultdict"] },
  44: { id: 44, function_name: "detect_outliers", topic: "Veri Analizi", difficulty_note: "Aykırı değer tespiti (IQR)", related_concepts: ["istatistik"] },
  45: { id: 45, function_name: "rolling_average", topic: "Veri Analizi", difficulty_note: "Hareketli ortalama (pandas)", related_concepts: ["pandas"] },

  // ═══ PANDAS (46-55) ═══
  46: { id: 46, function_name: "binary_search_pandas", topic: "Algoritma", difficulty_note: "Pandas ile binary search", related_concepts: ["pandas"] },
  47: { id: 47, function_name: "bubble_sort", topic: "Algoritma", difficulty_note: "Bubble sort implementasyonu", related_concepts: ["sıralama"] },
  48: { id: 48, function_name: "coin_change", topic: "Algoritma", difficulty_note: "Greedy coin change", related_concepts: ["greedy"] },
  49: { id: 49, function_name: "knapsack", topic: "Algoritma", difficulty_note: "0/1 knapsack DP", related_concepts: ["dinamik programlama"] },
  50: { id: 50, function_name: "shortest_path", topic: "Algoritma", difficulty_note: "BFS ile en kısa yol", related_concepts: ["BFS", "graf"] },
  51: { id: 51, function_name: "emoji_sentiment", topic: "NLP", difficulty_note: "Emoji duygu analizi", related_concepts: ["NLP", "emoji"] },
  52: { id: 52, function_name: "decode_hidden_emoji", topic: "Şifreleme", difficulty_note: "Gizli emoji mesajı çöz", related_concepts: ["unicode", "steganografi"] },
  53: { id: 53, function_name: "emoji_fizzbuzz", topic: "Kontrol Yapıları", difficulty_note: "Emoji FizzBuzz", related_concepts: ["modulo"] },
  54: { id: 54, function_name: "turkish_normalize", topic: "String İşlemleri", difficulty_note: "Türkçe karakter normalizasyonu", related_concepts: ["locale"] },
  55: { id: 55, function_name: "viral_score", topic: "Sosyal Medya", difficulty_note: "Viral potansiyel skoru", related_concepts: ["NLP"] },

  // ═══ ALGORITHMS (56-67) ═══
  56: { id: 56, function_name: "mood_detector", topic: "NLP", difficulty_note: "Ruh hali emoji dedektörü", related_concepts: ["NLP"] },
  57: { id: 57, function_name: "trend_hunter", topic: "Sosyal Medya", difficulty_note: "Trend içerik avcısı", related_concepts: ["regex"] },
  58: { id: 58, function_name: "emoji_mood", topic: "NLP", difficulty_note: "Emoji ruh hali analizi", related_concepts: ["NLP"] },
  59: { id: 59, function_name: "comment_sensor", topic: "Sosyal Medya", difficulty_note: "Yorum sensörü", related_concepts: ["NLP"] },
  60: { id: 60, function_name: "emoji_cipher", topic: "Şifreleme", difficulty_note: "Emoji şifresi dedektörü", related_concepts: ["şifreleme"] },
  61: { id: 61, function_name: "hype_generator", topic: "Sosyal Medya", difficulty_note: "Hype yaratıcısı", related_concepts: ["string"] },
  62: { id: 62, function_name: "star_cipher", topic: "Şifreleme", difficulty_note: "Yıldız tayfası şifresi", related_concepts: ["şifreleme"] },
  63: { id: 63, function_name: "trend_cleaner", topic: "Sosyal Medya", difficulty_note: "Trend hashtag temizleyici", related_concepts: ["regex"] },
  64: { id: 64, function_name: "viral_title", topic: "Sosyal Medya", difficulty_note: "Viral başlık avcısı", related_concepts: ["NLP"] },
  65: { id: 65, function_name: "decode_message", topic: "Şifreleme", difficulty_note: "Gizli mesaj dekoder", related_concepts: ["steganografi"] },
  66: { id: 66, function_name: "positive_filter", topic: "NLP", difficulty_note: "Pozitif yorum filtresi", related_concepts: ["NLP"] },
  67: { id: 67, function_name: "mood_enhancer", topic: "NLP", difficulty_note: "Tweet ruh hali iyileştirici", related_concepts: ["NLP"] },
};

/**
 * Soru ID'sinden meta bilgisi al. Bulunamazsa default döndür.
 */
export function getQuestionMeta(id: number): QuestionMeta {
  return (
    QUESTION_META[id] || {
      id,
      function_name: "solution",
      topic: "Genel",
      difficulty_note: "",
      related_concepts: [],
    }
  );
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