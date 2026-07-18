// app/blog/sifirdan-zirveye/data/sections.ts
//
// 2026-07-18: "Sıfırdan Zirveye" — interaktif blog yazısı.
// 8 bölüm, sıfırdan programlama (very easy).
// Her bölüm: anlatım → interaktif soru → çözüm kontrolü.
// Bölüm çözülmeden sonraki gözükmez (localStorage progress).
//
// Kapsam:
//   1. Merhaba Dünya          → print("Merhaba Dünya")
//   2. Değişkenler            → x = 10; print(x)
//   3. if/else (araba)        → hiz > 30 → "Yavaşla"
//   4. Fonksiyonlar (selam)   → def selam(isim): return ...
//   5. for döngüsü            → for i in range(3): print(i)
//   6. while döngüsü          → while i < 3
//   7. Parametrize fonksiyon  → toplam(a, b)
//   8. Final görev            → hepsini birleştir

export type SectionId =
  | "merhaba-dunya"
  | "degiskenler"
  | "if-else"
  | "fonksiyonlar"
  | "for-dongusu"
  | "while-dongusu"
  | "parametrize"
  | "final";

export interface SectionExercise {
  prompt: string;
  starter: string;
  /** Beklenen stdout (trim) */
  expected: string;
  /** Test açıklaması — feedback'te gösterilir */
  testLabel: string;
}

export interface Section {
  id: SectionId;
  title: string;
  emoji: string; // Görsel amaçlı, string literal (UI'da)
  estimatedMinutes: number;
  /** Kısa anlatım (2-3 paragraf, JSX veya plain text) */
  anlatim: string[];
  /** Kod örneği (kullanıcı kopyalayıp çalıştırabilir) */
  ornek?: { code: string; language: "python" };
  /** İnteraktif soru (zorunlu) */
  exercise: SectionExercise;
  /** Yardım linki — kafasına takılan buraya tıklar */
  yardimLink?: { href: string; label: string };
}

export const SECTIONS: Section[] = [
  {
    id: "merhaba-dunya",
    title: "Merhaba Dünya",
    emoji: "Merhaba",
    estimatedMinutes: 3,
    anlatim: [
      "Bilgisayara bir şey yazdırmak için print() kullanırız. Parantez içine ne yazarsak ekranda onu görürüz.",
      "Metin (yazı) yazdırmak için tırnak işareti kullanırız: tek tırnak ' veya çift tırnak \" farketmez.",
      "Aşağıdaki editöre print(\"Merhaba Dünya\") yaz ve Çalıştır'a bas. Ekranda 'Merhaba Dünya' yazmalı.",
    ],
    ornek: { language: "python", code: 'print("Selam!")' },
    exercise: {
      prompt: 'Ekrana "Merhaba Dünya" yazdır. Tırnak işaretlerini unutma!',
      starter: '# Buraya kodunu yaz\n',
      expected: "Merhaba Dünya",
      testLabel: 'print("Merhaba Dünya") → Merhaba Dünya',
    },
    yardimLink: { href: "/blog/programlama-temelleri", label: "print() nasıl çalışır?" },
  },
  {
    id: "degiskenler",
    title: "Değişkenler",
    emoji: "x = 5",
    estimatedMinutes: 4,
    anlatim: [
      "Değişken, bir değeri saklayan isimdir. x = 5 dediğimizde x'in değeri 5 olur.",
      "Yazı saklamak için tırnak kullanırız: isim = \"Ali\". Sayılar tırnaksız yazılır.",
      "Bir değişkenin değerini sonra print() ile yazdırabiliriz. Aşağıda x değişkenini yazdır.",
    ],
    ornek: { language: "python", code: 'yas = 25\nisim = "Ali"\nprint(isim)' },
    exercise: {
      prompt: "x değişkenine 10 değerini ata, sonra print(x) ile yazdır.",
      starter: "# x = ... ile başla\n",
      expected: "10",
      testLabel: "x = 10; print(x) → 10",
    },
    yardimLink: { href: "/blog/programlama-temelleri", label: "Değişken nedir?" },
  },
  {
    id: "if-else",
    title: "if/else (Araba Sorusu)",
    emoji: "Araba",
    estimatedMinutes: 5,
    anlatim: [
      "if (eğer) bir koşul doğruysa o blok çalışır. else (değilse) koşul yanlışsa çalışır.",
      "Örnek: arabanın hızı 30'dan büyükse 'Yavaşla' yaz, değilse 'İyi sürüş' yaz.",
      "Girinti (4 boşluk) Python'da çok önemli. if altındaki kod 4 boşluk içeride yazılır.",
    ],
    ornek: {
      language: "python",
      code: 'hiz = 50\nif hiz > 30:\n    print("Yavaşla")\nelse:\n    print("İyi sürüş")',
    },
    exercise: {
      prompt: 'hiz değişkeni 50 olsun. Eğer hiz > 30 ise "Yavaşla" yazdır, değilse "İyi sürüş" yazdır.',
      starter: 'hiz = 50\n# if/else ekle\n',
      expected: "Yavaşla",
      testLabel: "hiz=50 → Yavaşla",
    },
    yardimLink: { href: "/blog/programlama-temelleri", label: "if/else nasıl yazılır?" },
  },
  {
    id: "fonksiyonlar",
    title: "Fonksiyonlar (Selam PYMulakat)",
    emoji: "def",
    estimatedMinutes: 5,
    anlatim: [
      "Fonksiyon, tekrar tekrar kullanacağın bir kod bloğudur. def ile tanımlanır.",
      "def selam(isim): — 'isim' bir parametredir, fonksiyonu çağırırken içine değer verirsin.",
      "return ile sonuç döndürür. Aşağıda selam(isim) fonksiyonu yazıp 'pymulakat' ile çağır.",
    ],
    ornek: {
      language: "python",
      code: 'def selam(isim):\n    return "Selam " + isim\n\nprint(selam("Ali"))',
    },
    exercise: {
      prompt: 'selam(isim) fonksiyonu yaz: "Selam pymulakat" döndürsün. Sonra print(selam("pymulakat")) çağır.',
      starter: "# def selam(isim): ...\n",
      expected: "Selam pymulakat",
      testLabel: 'selam("pymulakat") → Selam pymulakat',
    },
    yardimLink: { href: "/blog/programlama-temelleri", label: "def ve return nedir?" },
  },
  {
    id: "for-dongusu",
    title: "for Döngüsü",
    emoji: "for",
    estimatedMinutes: 4,
    anlatim: [
      "for döngüsü bir listeyi veya sayı aralığını baştan sona dolaşır.",
      "range(3) → 0, 1, 2. range(1, 4) → 1, 2, 3. Sondaki sayı dahil değil.",
      "Aşağıda 0, 1, 2 sayılarını alt alta yazdır.",
    ],
    ornek: { language: "python", code: 'for meyve in ["elma", "armut"]:\n    print(meyve)' },
    exercise: {
      prompt: "for döngüsü ile 0, 1, 2 sayılarını alt alta yazdır. range(3) kullan.",
      starter: "# for i in range(3):\n",
      expected: "0\n1\n2",
      testLabel: "range(3) → 0, 1, 2",
    },
    yardimLink: { href: "/blog/algoritma-nedir", label: "Algoritma ve döngü mantığı" },
  },
  {
    id: "while-dongusu",
    title: "while Döngüsü",
    emoji: "while",
    estimatedMinutes: 5,
    anlatim: [
      "while bir koşul doğru olduğu sürece çalışır.",
      "Sonsuz döngüye dikkat: koşul her zaman doğru olursa program donabilir. Sayaç unutma!",
      "i = 0 ile başla, while i < 3: ile 0, 1, 2 yazdır. Her adımda i'yi 1 artır.",
    ],
    ornek: {
      language: "python",
      code: "i = 0\nwhile i < 3:\n    print(i)\n    i += 1",
    },
    exercise: {
      prompt: "i = 0 ile başla. while i < 3 iken i'yi yazdır ve her adımda 1 artır. 0, 1, 2 yazmalı.",
      starter: "i = 0\n# while ...\n",
      expected: "0\n1\n2",
      testLabel: "while 0..2 → 0, 1, 2",
    },
    yardimLink: { href: "/blog/programlama-temelleri", label: "while ve sonsuz döngü" },
  },
  {
    id: "parametrize",
    title: "Parametrize Fonksiyonlar",
    emoji: "f(a,b)",
    estimatedMinutes: 4,
    anlatim: [
      "Fonksiyon birden fazla parametre alabilir. def toplam(a, b): gibi.",
      "Parametre sayısı = argüman sayısı olmalı. toplam(3, 5) → 8.",
      "Aşağıda toplam(a, b) yaz, 3 ve 5 ile çağır, sonucu yazdır.",
    ],
    ornek: {
      language: "python",
      code: "def toplam(a, b):\n    return a + b\n\nprint(toplam(3, 5))",
    },
    exercise: {
      prompt: "toplam(a, b) fonksiyonu yaz, 3 ve 5'i toplayıp sonucu yazdır.",
      starter: "# def toplam(a, b):\n",
      expected: "8",
      testLabel: "toplam(3, 5) → 8",
    },
    yardimLink: { href: "/blog/programlama-temelleri", label: "Birden fazla parametre" },
  },
  {
    id: "final",
    title: "Final Görev",
    emoji: "Tebrikler",
    estimatedMinutes: 4,
    anlatim: [
      "Tebrikler! Değişkenler, koşul, döngü ve fonksiyon temellerini öğrendin.",
      "Son görev: Bir liste içindeki sayıların toplamını hesaplayan bir fonksiyon yaz.",
      "İpucu: for döngüsü ve biriktirici (toplam = 0) ile yapabilirsin.",
    ],
    ornek: {
      language: "python",
      code: "def liste_toplam(sayilar):\n    t = 0\n    for s in sayilar:\n        t += s\n    return t\n\nprint(liste_toplam([1, 2, 3]))",
    },
    exercise: {
      prompt: "liste_toplam(liste) fonksiyonu yaz, [1, 2, 3] için 6 döndürsün. print ile yazdır.",
      starter: "# def liste_toplam(liste):\n",
      expected: "6",
      testLabel: "liste_toplam([1,2,3]) → 6",
    },
    yardimLink: { href: "/interviews/list-dict", label: "Liste & Sözlük soruları" },
  },
];

/** Toplam dakika (UI'da progress bar için) */
export const TOTAL_MINUTES = SECTIONS.reduce(
  (sum, s) => sum + s.estimatedMinutes,
  0
);

/** Bölüm index → slug (URL için) */
export function getSectionById(id: string): Section | undefined {
  return SECTIONS.find((s) => s.id === id);
}
