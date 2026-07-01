// lib/questionMeta.ts
// 67 soru için sabit metadata: function_name, topic, level_description
// DB'de olmayan (silinen) alanları frontend buradan çeker
// Bu dosya DB title/slug ile senkronize edildi.

export interface QuestionMeta {
  id: number;
  title: string; // Soru başlğı (DB'den gelmez, fallback için)
  function_name: string;
  topic: string;
  difficulty_note: string;
  prerequisites?: number[];
  related_concepts: string[];
  related_questions: number[];
  slug?: string;
}

export const QUESTION_META: Record<number, QuestionMeta> = {
  1: { id: 1, title: "Palindrome Checker", function_name: "is_palindrome", topic: "Python Temelleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [2, 3, 10, 11], slug: "palindrome-checker" },
  2: { id: 2, title: "Emoji FizzBuzz", function_name: "fizzbuzz", topic: "Python Temelleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [1, 3, 10, 11], slug: "emoji-fizzbuzz" },
  3: { id: 3, title: "Kelimelerin En Uzunu", function_name: "longest_word", topic: "Python Temelleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [1, 2, 10, 11], slug: "kelimelerin-en-uzunu" },
  4: { id: 4, title: "Sihirli Kare Kontrolü", function_name: "is_magic_square", topic: "Python Temelleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [14, 30], slug: "sihirli-kare-kontrolu" },
  5: { id: 5, title: "Sayı Tahmin Skoru", function_name: "guess_score", topic: "Python Temelleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [7, 9], slug: "sayi-tahmin-skoru" },
  6: { id: 6, title: "Karakter Sayacı", function_name: "char_count", topic: "Python Temelleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [12, 15, 17, 21], slug: "karakter-sayaci" },
  7: { id: 7, title: "Asal Sayı Kontrolü", function_name: "is_anagram", topic: "Python Temelleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [5, 9], slug: "asal-sayi-kontrolu" },
  8: { id: 8, title: "Liste Düzleştirme", function_name: "sum_digits", topic: "Python Temelleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [26, 27, 29, 35], slug: "liste-duzlestirme" },
  9: { id: 9, title: "Fibonacci Dizisi", function_name: "is_prime", topic: "Python Temelleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [5, 7], slug: "fibonacci-dizisi" },
  10: { id: 10, title: "Anagram Kontrolü", function_name: "cumulative_sum", topic: "Python Temelleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [1, 2, 3, 11], slug: "anagram-kontrolu" },
  11: { id: 11, title: "Kelime Tersleyici", function_name: "gcd", topic: "Python Temelleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [1, 2, 3, 10], slug: "kelime-tersleyici" },
  12: { id: 12, title: "İkinci En Büyük", function_name: "triangle_type", topic: "Python Temelleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [6, 15, 17, 21], slug: "ikinci-en-buyuk" },
  13: { id: 13, title: "Sezar Şifresi", function_name: "reverse_string", topic: "Python Temelleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [1, 2, 3, 10], slug: "sezar-sifresi" },
  14: { id: 14, title: "Matris Transpozu", function_name: "matrix_transpose", topic: "Python Temelleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [4, 30], slug: "matris-transpozu" },
  15: { id: 15, title: "Sayı Heceleme", function_name: "spell_number", topic: "Python Temelleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [6, 12, 17, 21], slug: "sayi-heceleme" },
  16: { id: 16, title: "Parantez Dengesi", function_name: "is_balanced", topic: "String İşlemleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [47, 48, 49, 50], slug: "parantez-dengesi" },
  17: { id: 17, title: "Slug Oluşturucu", function_name: "slugify", topic: "String İşlemleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [6, 12, 15, 21], slug: "slug-olusturucu" },
  18: { id: 18, title: "Run-Length Encoding", function_name: "run_length_encode", topic: "String İşlemleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [1, 2, 3, 10], slug: "run-length-encoding" },
  19: { id: 19, title: "Kelime Sıklığı", function_name: "word_frequency", topic: "String İşlemleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [1, 2, 3, 10], slug: "kelime-sikligi" },
  20: { id: 20, title: "String Sıkıştırma", function_name: "compress_string", topic: "String İşlemleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [1, 2, 3, 10], slug: "string-sikistirma" },
  21: { id: 21, title: "Roman Numerals", function_name: "roman_to_int", topic: "String İşlemleri", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [6, 12, 15, 17], slug: "roman-numerals" },
  22: { id: 22, title: "Pangram Kontrolü", function_name: "is_pangram", topic: "String İşlemleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [1, 2, 3, 10], slug: "pangram-kontrolu" },
  23: { id: 23, title: "Kelime Sayısı (Gelişmiş)", function_name: "word_count", topic: "String İşlemleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [1, 2, 3, 10], slug: "kelime-sayisi-gelismis" },
  24: { id: 24, title: "Cümle Başlığı", function_name: "sentence_start", topic: "String İşlemleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [1, 2, 3, 10], slug: "cumle-basligi" },
  25: { id: 25, title: "DNA Tamamlayıcısı", function_name: "dna_complement", topic: "String İşlemleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [1, 2, 3, 10], slug: "dna-tamamlayicisi" },
  26: { id: 26, title: "İki Listeyi Birleştir", function_name: "merge_lists", topic: "Veri Yapıları", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [8, 27, 29, 35], slug: "iki-listeyi-birlestir" },
  27: { id: 27, title: "Sözlük Birleştirme", function_name: "merge_dicts", topic: "Veri Yapıları", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [8, 26, 29, 35], slug: "sozluk-birlestirme" },
  28: { id: 28, title: "Gruplama", function_name: "group_by", topic: "Veri Yapıları", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [32, 37, 38, 39], slug: "gruplama" },
  29: { id: 29, title: "Fark Listesi", function_name: "diff_lists", topic: "Veri Yapıları", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [8, 26, 27, 35], slug: "fark-listesi" },
  30: { id: 30, title: "Matris Çarpımı", function_name: "matrix_multiply", topic: "Veri Yapıları", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [4, 14], slug: "matris-carpimi" },
  31: { id: 31, title: "Stok Takibi", function_name: "stock_tracker", topic: "Veri Yapıları", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [6, 12, 15, 17], slug: "stok-takibi" },
  32: { id: 32, title: "Hareketli Ortalama", function_name: "moving_average", topic: "Veri Yapıları", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [28, 37, 38, 39], slug: "hareketli-ortalama" },
  33: { id: 33, title: "En Uzun Artan Alt Dizi", function_name: "longest_increasing_subseq", topic: "Veri Yapıları", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [6, 12, 15, 17], slug: "en-uzun-artan-alt-dizi" },
  34: { id: 34, title: "Fiyat Analizi", function_name: "analyze_prices", topic: "Veri Yapıları", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [6, 12, 15, 17], slug: "fiyat-analizi" },
  35: { id: 35, title: "Kümülatif Toplam", function_name: "cumulative_total", topic: "Veri Yapıları", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [8, 26, 27, 29], slug: "kumulatif-toplam" },
  36: { id: 36, title: "Favori Renk Anketi", function_name: "favorite_color_poll", topic: "Pandas Veri Analizi", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [6, 12, 15, 17], slug: "favori-renk-anketi" },
  37: { id: 37, title: "Eksik Değer Doldurma", function_name: "fill_missing", topic: "Pandas Veri Analizi", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [28, 32, 38, 39], slug: "eksik-deger-doldurma" },
  38: { id: 38, title: "Satış Raporu", function_name: "sales_report", topic: "Pandas Veri Analizi", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [28, 32, 37, 39], slug: "satis-raporu" },
  39: { id: 39, title: "Günlük Ortalama", function_name: "daily_average", topic: "Pandas Veri Analizi", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [28, 32, 37, 38], slug: "gunluk-ortalama" },
  40: { id: 40, title: "Korelasyon Analizi", function_name: "correlation", topic: "Pandas Veri Analizi", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [28, 32, 37, 38], slug: "korelasyon-analizi" },
  41: { id: 41, title: "Tekrar Eden Satırlar", function_name: "find_duplicates", topic: "Pandas Veri Analizi", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [28, 32, 37, 38], slug: "tekrar-eden-satirlar" },
  42: { id: 42, title: "Yaş Grubu Segmentasyonu", function_name: "age_segmentation", topic: "Pandas Veri Analizi", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [28, 32, 37, 38], slug: "yas-grubu-segmentasyonu" },
  43: { id: 43, title: "Grup Toplamı", function_name: "group_total", topic: "Pandas Veri Analizi", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [28, 32, 37, 38], slug: "grup-toplami" },
  44: { id: 44, title: "Aykırı Değer Tespiti", function_name: "detect_outliers", topic: "Pandas Veri Analizi", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [28, 32, 37, 38], slug: "aykiri-deger-tespiti" },
  45: { id: 45, title: "Rolling Ortalama", function_name: "rolling_average", topic: "Pandas Veri Analizi", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [6, 12, 15, 17], slug: "rolling-ortalama" },
  46: { id: 46, title: "İkili Arama", function_name: "binary_search_pandas", topic: "Algoritmalar", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [6, 12, 15, 17], slug: "ikili-arama" },
  47: { id: 47, title: "Bubble Sort", function_name: "bubble_sort", topic: "Algoritmalar", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [16, 48, 49, 50], slug: "bubble-sort" },
  48: { id: 48, title: "Bozuk Para Hesabı (Greedy)", function_name: "coin_change", topic: "Algoritmalar", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [16, 47, 49, 50], slug: "bozuk-para-hesabi-greedy" },
  49: { id: 49, title: "Kaplama Problemi", function_name: "knapsack", topic: "Algoritmalar", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [16, 47, 48, 50], slug: "kaplama-problemi" },
  50: { id: 50, title: "En Kısa Yol (BFS)", function_name: "shortest_path", topic: "Algoritmalar", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [16, 47, 48, 49], slug: "en-kisa-yol-bfs" },
  51: { id: 51, title: "💖 Emoji Envanteri: Sosyal Medya Duygu Analizi", function_name: "emoji_sentiment", topic: "String İşlemleri", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [1, 2, 3, 10], slug: "emoji-envanteri-sosyal-medya-duygu-analizi" },
  52: { id: 52, title: "🕵️‍♀️ Emoji Gizemleri: Gizli Mesajı Bul! 🔍", function_name: "decode_hidden_emoji", topic: "String İşlemleri", difficulty_note: "beginner seviye", related_concepts: [], related_questions: [1, 2, 3, 10], slug: "emoji-gizemleri-gizli-mesaji-bul" },
  53: { id: 53, title: "🚀 Sosyal Medya Post Kontrolcüsü: Trend ve Temiz Mi?", function_name: "emoji_fizzbuzz", topic: "String İşlemleri", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [6, 12, 15, 17], slug: "sosyal-medya-post-kontrolcusu-trend-ve-temiz-mi" },
  54: { id: 54, title: "🍽️ Emoji Sipariş Fiyatı Hesaplayıcı", function_name: "turkish_normalize", topic: "Veri Yapıları", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [1, 2, 3, 10], slug: "emoji-siparis-fiyati-hesaplayici" },
  55: { id: 55, title: "Viral Potansiyel Skoru Hesapla 📈🚀", function_name: "viral_score", topic: "String İşlemleri", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [6, 12, 15, 17], slug: "viral-potansiyel-skoru-hesapla" },
  56: { id: 56, title: "😎 Ruh Hali Emoji Dedektörü", function_name: "mood_detector", topic: "String İşlemleri", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [1, 2, 3, 10], slug: "ruh-hali-emoji-dedektoru" },
  57: { id: 57, title: "🌟 Sosyal Medya İçerik Avcısı: Trendleri Yakala!", function_name: "trend_hunter", topic: "String İşlemleri", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [6, 12, 15, 17], slug: "sosyal-medya-icerik-avcisi-trendleri-yakala" },
  58: { id: 58, title: "🤩 Emoji Ruh Hali Analizi", function_name: "emoji_mood", topic: "Veri Yapıları", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [1, 2, 3, 10], slug: "emoji-ruh-hali-analizi" },
  59: { id: 59, title: "👾 Sosyal Medya Yorum Sensörü!", function_name: "comment_sensor", topic: "Veri Yapıları", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [6, 12, 15, 17], slug: "sosyal-medya-yorum-sensoru" },
  60: { id: 60, title: "🔐 Emoji Şifresi Dedektörü", function_name: "emoji_cipher", topic: "String İşlemleri", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [1, 2, 3, 10], slug: "emoji-sifresi-dedektoru" },
  61: { id: 61, title: "🚀 Sosyal Medya Gönderisi Hype Yaratıcısı", function_name: "hype_generator", topic: "String İşlemleri", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [6, 12, 15, 17], slug: "sosyal-medya-gonderisi-hype-yaraticisi" },
  62: { id: 62, title: "✨ Sosyal Medya Şifresi: Yıldız Tayfası Mesajlarını Çöz!", function_name: "star_cipher", topic: "String İşlemleri", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [1, 2, 3, 10], slug: "sosyal-medya-sifresi-yildiz-tayfasi-mesajlarini-coz" },
  63: { id: 63, title: "✨ Trend Hashtag Temizleyici", function_name: "trend_cleaner", topic: "String İşlemleri", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [6, 12, 15, 17], slug: "trend-hashtag-temizleyici" },
  64: { id: 64, title: "🚀 Viral Başlık Avcısı: Etkileşim Skoru Hesaplayıcı", function_name: "viral_title", topic: "String İşlemleri", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [6, 12, 15, 17], slug: "viral-baslik-avcisi-etkilesim-skoru-hesaplayici" },
  65: { id: 65, title: "🕵️ Emoji Gizemini Çöz: Gizli Mesaj Dekoderi", function_name: "decode_message", topic: "String İşlemleri", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [1, 2, 3, 10], slug: "emoji-gizemini-coz-gizli-mesaj-dekoderi" },
  66: { id: 66, title: "✨ Pozitif Yorum Filtresi", function_name: "positive_filter", topic: "String İşlemleri", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [6, 12, 15, 17], slug: "pozitif-yorum-filtresi" },
  67: { id: 67, title: "✨ Tweet Mood Enhancer", function_name: "mood_enhancer", topic: "String İşlemleri", difficulty_note: "intermediate seviye", related_concepts: [], related_questions: [6, 12, 15, 17], slug: "tweet-mood-enhancer" },
};

/**
 * ID'den QuestionMeta getir. Bulamazsa default döner.
 */
export function getQuestionMeta(id: number): QuestionMeta {
  return QUESTION_META[id] || {
    id,
    title: "Soru #" + id,
    function_name: "solution",
    topic: "Genel",
    difficulty_note: "",
    related_concepts: [],
    related_questions: [],
  };
}

/**
 * Slug'tan ID'ye çevir (canonical URL routing).
 * Sadece QuestionMeta.slug ile çalışır (DB ile senkronize).
 * Örn: "fibonacci-dizisi" → 9
 */
export function getIdFromSlug(slug: string): number | null {
  // 1. Slug direkt QuestionMeta'da var mi?
  for (const idStr of Object.keys(QUESTION_META)) {
    const id = parseInt(idStr, 10);
    const m = QUESTION_META[id];
    if (m.slug === slug) return id;
  }
  // 2. Belki slug zaten ID mi? (sayisal slug)
  const asNum = parseInt(slug, 10);
  if (!isNaN(asNum) && QUESTION_META[asNum]) return asNum;
  return null;
}

/**
 * Title'dan URL slug üret (SEO friendly).
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
 * Category'yi URL-safe slug'a çevir.
 */
export function slugifyCategory(cat: string): string {
  return slugifyTitle(cat);
}
