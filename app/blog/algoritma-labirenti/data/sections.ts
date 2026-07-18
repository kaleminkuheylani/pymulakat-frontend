// app/blog/algoritma-labirenti/data/sections.ts
//
// 2026-07-18: "Algoritma Labirenti" — 30 dakikalık interaktif blog.
// 6 seviye, her seviyede 2 test case (kolay + edge).
// Seviye gecisi: 2/2 test case basarili olmali.
//
// Kapsam (siralama: kolaydan zora):
//   1. filtrele    → cift sayilari filtrele    ([1,2,3,4] → [2,4], [] → [])
//   2. max-bul     → listedeki en buyuk        ([3,7,2] → 7, [-5,-2] → -2)
//   3. ters-cevir  → string'i ters cevir       ("merhaba" → "abahrem", "x" → "x")
//   4. palindrom   → palindrom mu?             ("kayak" → true, "" → true)
//   5. iki-toplam  → iki sayi toplami (hash)   ([2,7,11,15] t=9 → [0,1], [3,3] t=6 → [0,1])
//   6. anagram     → anagram mi?               ("listen","silent" → true, "a","b" → false)

export type SectionId =
  | "filtrele"
  | "max-bul"
  | "ters-cevir"
  | "palindrom"
  | "iki-toplam"
  | "anagram";

export interface TestCase {
  id: string;
  description: string; // "Kolay: [1,2,3,4] → [2,4]"
  /** input — print() ile cagirilan parametre (tek parametre) */
  input: string;
  /** beklenen print ciktisi (trim) */
  expected: string;
}

export interface SectionExercise {
  /** Problem aciklamasi — basit Turkce */
  problem: string;
  /** Fonksiyon ismi (kullanici tanimlayacak) */
  functionName: string;
  /** Parametre ipucu (ornek: "sayilar: list[int]") */
  signature: string;
  /** Starter code — kullanicinin edit edecegi */
  starter: string;
  /** 2 test case: kolay + edge */
  testCases: [TestCase, TestCase];
  /** Pyodide'da input handling kodu (hidden, test runner'a yardimci) */
  /** Ornek: def cozum(sayilar): return [x for x in sayilar if x % 2 == 0]; print(cozum(sayilar)) */
  /** Beklenen print ciktisi (kullanicinin fonksiyonu) */
  expectedHint: string;
}

export interface Section {
  id: SectionId;
  title: string;
  icon: string; // lucide icon ismi (string)
  estimatedMinutes: number;
  /** Hikaye anlatimi (labirent metaforu) */
  story: string[];
  /** Algoritmik anlatim */
  anlatim: string[];
  /** Onerilen yaklasim ipucu (sadece yardim linkinde) */
  ipucu: string;
  /** Interaktif soru */
  exercise: SectionExercise;
  /** Yardim linki (sifirdan-zirveye'ye yonlendir) */
  yardimLink?: { href: string; label: string };
}

export const SECTIONS: Section[] = [
  // ════════════════════════════════════════════════════
  // 1. FILTRELE — kolay baslangic
  // ════════════════════════════════════════════════════
  {
    id: "filtrele",
    title: "Seviye 1: Filtrele Kapısı",
    icon: "Filter",
    estimatedMinutes: 5,
    story: [
      "Algoritma kasabasına hoş geldin. Kapıdaki yaşlı bilge seni durduruyor: 'Sadece çift sayıları geçirebilirim,' diyor. Listeni al, içinden sadece 2'ye tam bölünenleri süz.",
      "İki sınav var: kolay olan klasik liste, zor olan boş liste. İkisini de geçersen kapı açılır.",
    ],
    anlatim: [
      "Bir listeyi filtrelemek demek, her elemanı bir koşula göre seçmek demek. Python'da en kısa yol: <code>list comprehension</code>.",
      "<code>[x for x in liste if kosul]</code> → liste içindeki her x'i gez, kosul doğruysa al, değilse atla.",
    ],
    ipucu: "Koşul: x % 2 == 0. Yani 2'ye bölümünden kalan 0 olanlar.",
    exercise: {
      problem:
        "Verilen <code>sayilar</code> listesinden sadece çift sayıları içeren yeni bir liste döndür. Sıra korunmalı.",
      functionName: "ciftleri_al",
      signature: "ciftleri_al(sayilar: list[int]) -> list[int]",
      starter: `def ciftleri_al(sayilar):
    # TODO: sadece cift sayilari filtrele
    return []

# Test runner — dokunma
sayilar = [1, 2, 3, 4, 5, 6]
print(ciftleri_al(sayilar))`,
      expectedHint: "print(ciftleri_al([1,2,3,4,5,6])) → [2, 4, 6]",
      testCases: [
        {
          id: "kolay",
          description: "Kolay: [1,2,3,4,5,6] → [2, 4, 6]",
          input: "sayilar = [1, 2, 3, 4, 5, 6]\nprint(ciftleri_al(sayilar))",
          expected: "[2, 4, 6]",
        },
        {
          id: "edge-bos",
          description: "Edge: boş liste [] → []",
          input: "sayilar = []\nprint(ciftleri_al(sayilar))",
          expected: "[]",
        },
      ],
    },
    yardimLink: {
      href: "/blog/programlama-temelleri",
      label: "if/else ve liste döngüsü nasıl çalışır?",
    },
  },

  // ════════════════════════════════════════════════════
  // 2. MAX BUL — liste tarama
  // ════════════════════════════════════════════════════
  {
    id: "max-bul",
    title: "Seviye 2: En Yüksek Kulenin Max'ı",
    icon: "TrendingUp",
    estimatedMinutes: 5,
    story: [
      "Bir sonraki kapıda ejderha bekliyor. 'Sana üç kule veriyorum, en yükseğini söyle,' diye hırlıyor.",
      "Ama dikkat: tüm kuleler yıkılmış (negatif yükseklik) olabilir. O zaman en az yıkılanı söylemelisin.",
    ],
    anlatim: [
      "Listeyi gezip en büyüğü tutmak için <strong>akümülatör deseni</strong> kullanılır: ilk elemanı başlangıç al, sonra her elemanla karşılaştır, büyükse güncelle.",
      "<code>max(0, x)</code> gibi kısa yollar var ama algoritma pratiği için elle yazmak daha öğretici.",
    ],
    ipucu: "max_degisken = sayilar[0]; for x in sayilar: if x > max_degisken: max_degisken = x",
    exercise: {
      problem:
        "Verilen <code>sayilar</code> listesindeki en büyük sayıyı döndür. Liste boş olabilir (return 0).",
      functionName: "en_buyuk",
      signature: "en_buyuk(sayilar: list[int]) -> int",
      starter: `def en_buyuk(sayilar):
    # TODO: listedeki en buyuk sayiyi bul
    return 0

# Test runner — dokunma
sayilar = [3, 7, 2, 8, 4]
print(en_buyuk(sayilar))`,
      expectedHint: "print(en_buyuk([3,7,2,8,4])) → 8",
      testCases: [
        {
          id: "kolay",
          description: "Kolay: [3, 7, 2, 8, 4] → 8",
          input: "sayilar = [3, 7, 2, 8, 4]\nprint(en_buyuk(sayilar))",
          expected: "8",
        },
        {
          id: "edge-negatif",
          description: "Edge: hepsi negatif [-5, -2, -8, -1] → -1",
          input: "sayilar = [-5, -2, -8, -1]\nprint(en_buyuk(sayilar))",
          expected: "-1",
        },
      ],
    },
  },

  // ════════════════════════════════════════════════════
  // 3. TERS CEVIR — string
  // ════════════════════════════════════════════════════
  {
    id: "ters-cevir",
    title: "Seviye 3: Aynalı Kapı",
    icon: "Repeat",
    estimatedMinutes: 5,
    story: [
      "Kapıda bir ayna var. Aynaya bakınca yazın tersten görünüyor. Kapıyı açacak anahtar: yazıyı tersten söyleyebilmek.",
      "Tek harf de terstir (yine kendisi). Boş yazı da terstir (yine boş).",
    ],
    anlatim: [
      "Python'da string ters çevirmek için üç yaygın yol var: dilimleme (<code>[::-1]</code>), <code>reversed()</code> fonksiyonu, veya manuel döngü.",
      "Dilimleme en kısa ve en Pythonic yoludur: <code>string[::-1]</code> → baştan sona, -1 adımla (ters yön).",
    ],
    ipucu: "return metin[::-1]",
    exercise: {
      problem: "Verilen <code>metin</code> string'ini ters çevir ve döndür.",
      functionName: "ters_cevir",
      signature: "ters_cevir(metin: str) -> str",
      starter: `def ters_cevir(metin):
    # TODO: string'i ters cevir
    return ""

# Test runner
metin = "merhaba"
print(ters_cevir(metin))`,
      expectedHint: "print(ters_cevir('merhaba')) → abahrem",
      testCases: [
        {
          id: "kolay",
          description: "Kolay: 'merhaba' → 'abahrem'",
          input: "metin = 'merhaba'\nprint(ters_cevir(metin))",
          expected: "abahrem",
        },
        {
          id: "edge-tek",
          description: "Edge: tek karakter 'x' → 'x'",
          input: "metin = 'x'\nprint(ters_cevir(metin))",
          expected: "x",
        },
      ],
    },
  },

  // ════════════════════════════════════════════════════
  // 4. PALINDROM — two pointer
  // ════════════════════════════════════════════════════
  {
    id: "palindrom",
    title: "Seviye 4: Simetrik Labirent",
    icon: "Mirror",
    estimatedMinutes: 5,
    story: [
      "Labirentin 4. katında simetri testi var. 'Verdiğim kelime baştan ve sondan okunduğunda aynı mı?' diye soruyor. 'kayak' palindromdur, 'araba' değildir.",
      "Boş string palindrom sayılır (simetrik). Tek harf de palindromdur.",
    ],
    anlatim: [
      "Palindrom kontrolü için iki yaklaşım var: (1) String'i ters çevir, orijinaliyle karşılaştır. (2) İki uçtan başla, ortaya doğru karşılaştır (two pointer).",
      "İkinci yöntem O(n/2) yerine O(n) — aynı karmaşıklık ama iki yarıda durur. Bellekten de tasarruf sağlar.",
    ],
    ipucu: "i=0, j=len(s)-1; while i<j: if s[i] != s[j]: return False; i+=1; j-=1",
    exercise: {
      problem:
        "Verilen <code>kelime</code> string'i palindrom mu kontrol et. Boş string ve tek karakter palindrom sayılır.",
      functionName: "palindrom_mu",
      signature: "palindrom_mu(kelime: str) -> bool",
      starter: `def palindrom_mu(kelime):
    # TODO: palindrom mu kontrol et
    return False

# Test runner
kelime = "kayak"
print(palindrom_mu(kelime))`,
      expectedHint: "print(palindrom_mu('kayak')) → True",
      testCases: [
        {
          id: "kolay",
          description: "Kolay: 'kayak' → True",
          input: "kelime = 'kayak'\nprint(palindrom_mu(kelime))",
          expected: "True",
        },
        {
          id: "edge-bos",
          description: "Edge: boş string '' → True (simetrik)",
          input: "kelime = ''\nprint(palindrom_mu(kelime))",
          expected: "True",
        },
      ],
    },
  },

  // ════════════════════════════════════════════════════
  // 5. IKI TOPLAM — hash map
  // ════════════════════════════════════════════════════
  {
    id: "iki-toplam",
    title: "Seviye 5: İki Kapı Anahtarı",
    icon: "KeyRound",
    estimatedMinutes: 5,
    story: [
      "Kütüphaneci sana bir liste veriyor: [2, 7, 11, 15]. 'Toplamı 9 olan iki sayının index'lerini bul,' diyor.",
      "Ama bir twist var: aynı sayıyı iki kez kullanabilirsin. [3, 3] listesi ve hedef 6 → [0, 1] (ilk ve son eleman, aynı değer farklı index).",
    ],
    anlatim: [
      "Naif çözüm: her çift için topla, hedefe eşit mi bak. O(n²). Yavaş.",
      "Akıllı çözüm: hash map (dict). Her sayıyı gezerken <code>hedef - sayi</code>'yı daha önce gördük mü diye bak. O(n).",
    ],
    ipucu: "gorulen = {}; for i, x in enumerate(sayilar): if hedef - x in gorulen: return [gorulen[hedef-x], i]; gorulen[x] = i",
    exercise: {
      problem:
        "Verilen <code>sayilar</code> listesinde, toplamı <code>hedef</code>'e eşit olan iki sayının index'lerini liste olarak döndür. Her eleman sadece 1 kez kullanılır, ama aynı değer farklı index'lerde olabilir.",
      functionName: "iki_toplam",
      signature: "iki_toplam(sayilar: list[int], hedef: int) -> list[int]",
      starter: `def iki_toplam(sayilar, hedef):
    # TODO: toplami hedef olan iki index
    return []

# Test runner
sayilar = [2, 7, 11, 15]
hedef = 9
print(iki_toplam(sayilar, hedef))`,
      expectedHint: "print(iki_toplam([2,7,11,15], 9)) → [0, 1]",
      testCases: [
        {
          id: "kolay",
          description: "Kolay: [2,7,11,15] hedef=9 → [0, 1]",
          input: "sayilar = [2, 7, 11, 15]\nhedef = 9\nprint(iki_toplam(sayilar, hedef))",
          expected: "[0, 1]",
        },
        {
          id: "edge-duplicate",
          description: "Edge: [3, 3] hedef=6 → [0, 1] (duplicate değer farklı index)",
          input: "sayilar = [3, 3]\nhedef = 6\nprint(iki_toplam(sayilar, hedef))",
          expected: "[0, 1]",
        },
      ],
    },
  },

  // ════════════════════════════════════════════════════
  // 6. ANAGRAM — counter
  // ════════════════════════════════════════════════════
  {
    id: "anagram",
    title: "Seviye 6: Şifreli Anagram",
    icon: "Shuffle",
    estimatedMinutes: 5,
    story: [
      "Son kapıda gizli bir mesaj var. 'Bu iki kelime aynı harflerden mi oluşuyor?' diye soruyor. 'listen' ve 'silent' anagramdır (aynı harfler, farklı sıra).",
      "Ama farklı uzunlukta kelimeler anagram olamaz — kısa devre yap.",
    ],
    anlatim: [
      "İki string anagram mı? Karakter sayıları aynı mı? <code>Counter(s1) == Counter(s2)</code>.",
      "Veya: <code>sorted(s1) == sorted(s2)</code>. Sırala, karşılaştır. Basit ama O(n log n).",
      "En hızlısı: önce uzunluk kontrolü, sonra her karakterin sayısını say.",
    ],
    ipucu: "from collections import Counter; return Counter(s1) == Counter(s2)",
    exercise: {
      problem:
        "Verilen <code>s1</code> ve <code>s2</code> string'leri anagram mı? Aynı harfler, farklı sıra = anagram. Farklı uzunluk = kesinlikle değil.",
      functionName: "anagram_mi",
      signature: "anagram_mi(s1: str, s2: str) -> bool",
      starter: `def anagram_mi(s1, s2):
    # TODO: anagram mi kontrol et
    return False

# Test runner
s1 = "listen"
s2 = "silent"
print(anagram_mi(s1, s2))`,
      expectedHint: "print(anagram_mi('listen', 'silent')) → True",
      testCases: [
        {
          id: "kolay",
          description: "Kolay: 'listen', 'silent' → True",
          input: "s1 = 'listen'\ns2 = 'silent'\nprint(anagram_mi(s1, s2))",
          expected: "True",
        },
        {
          id: "edge-farkli-uzunluk",
          description: "Edge: farklı uzunluk 'a', 'ab' → False",
          input: "s1 = 'a'\ns2 = 'ab'\nprint(anagram_mi(s1, s2))",
          expected: "False",
        },
      ],
    },
  },
];

export const SECTION_IDS: SectionId[] = SECTIONS.map((s) => s.id);
export const getSection = (id: SectionId): Section | undefined =>
  SECTIONS.find((s) => s.id === id);
export const getSectionIndex = (id: SectionId): number =>
  SECTIONS.findIndex((s) => s.id === id);


export const TOTAL_MINUTES = SECTIONS.reduce((sum, s) => sum + s.estimatedMinutes, 0);
export const TOTAL_SECTIONS = SECTIONS.length;
