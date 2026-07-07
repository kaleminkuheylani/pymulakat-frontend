// Python eğitim dersleri — statik katalog.
// Her ders slug, başlık, kısa açıklama, seviye, süre, ikon, konuları ve içerik içerir.

export type LessonLevel = "Başlangıç" | "Orta" | "İleri";

export interface Lesson {
  slug: string;
  title: string;
  description: string;
  level: LessonLevel;
  duration: string;
  icon: string;
  topics: string[];
  intro: string;
  sections: LessonSection[];
  homework: string;
}

export interface LessonSection {
  heading: string;
  body: string; // markdown-lite
  code?: string;
  codeLabel?: string;
}

export const LESSONS: Lesson[] = [
  {
    slug: "temel-kavramlar",
    title: "Temel Kavramlar",
    description: "Değişkenler, veri tipleri, operatörler, giriş/çıkış. Python'un en temel yapı taşları.",
    level: "Başlangıç",
    duration: "20 dk",
    icon: "🧱",
    topics: ["Değişkenler", "Veri tipleri", "Operatörler", "print & input"],
    intro: "Bu derste Python'da bir değişken nasıl tanımlanır, hangi veri tipleri var ve ekrana çıktıyı nasıl yazdırırız öğreniyoruz.",
    sections: [
      {
        heading: "Değişkenler",
        body: "Python'da değişken tanımlamak için tip belirtmene gerek yok. Doğrudan atarsın:",
        code: "isim = 'Ali'\nyas = 28\npi = 3.14\naktif = True",
        codeLabel: "değişkenler.py",
      },
      {
        heading: "Temel Veri Tipleri",
        body: "Python'da dört temel veri tipiyle başlarsın: int, float, str, bool. Bunlar üzerinde tip dönüşümü yapabilirsin:",
        code: "sayi = int('42')      # str → int\noran = float('0.5')    # str → float\nmetin = str(123)       # int → str",
        codeLabel: "tipler.py",
      },
      {
        heading: "Giriş / Çıkış",
        body: "print() ekrana yazar, input() kullanıcıdan alır. input() her zaman str döner:",
        code: "isim = input('Adın: ')\nprint('Merhaba,', isim)\n\n# Tip dönüşümü gerekiyorsa:\nyas = int(input('Yaşın: '))",
        codeLabel: "io.py",
      },
    ],
    homework: "Kullanıcıdan ad, yaş ve şehir alıp 'Merhaba Ali, 28 yaşında ve İstanbul'dasın' gibi bir cümle yazdır.",
  },
  {
    slug: "kontrol-yapilari",
    title: "Kontrol Yapıları",
    description: "if/elif/else ile koşullar, for/while ile döngüler, break/continue ile akış kontrolü.",
    level: "Başlangıç",
    duration: "25 dk",
    icon: "🔀",
    topics: ["if/elif/else", "for döngüsü", "while döngüsü", "break & continue"],
    intro: "Kodun belirli koşullara göre farklı davranması için kontrol yapılarını öğreniyoruz.",
    sections: [
      {
        heading: "if / elif / else",
        body: "Koşul doğruysa ilgili blok çalışır. Python'da bloklar girinti (4 boşluk) ile belirlenir:",
        code: "puan = 75\n\nif puan >= 90:\n    print('AA')\nelif puan >= 70:\n    print('BB')\nelse:\n    print('CC')",
        codeLabel: "kosul.py",
      },
      {
        heading: "for Döngüsü",
        body: "for, üzerinde gezilebilen (iterable) bir nesnenin elemanlarını sırayla ziyaret eder:",
        code: "meyveler = ['elma', 'armut', 'muz']\nfor meyve in meyveler:\n    print(meyve)\n\n# range() ile sayılarda dolaş:\nfor i in range(3):\n    print(i)  # 0, 1, 2",
        codeLabel: "for.py",
      },
      {
        heading: "while Döngüsü",
        body: "Koşul doğru olduğu sürece çalışır. Sonsuz döngüye dikkat:",
        code: "sayac = 0\nwhile sayac < 3:\n    print(sayac)\n    sayac += 1",
        codeLabel: "while.py",
      },
    ],
    homework: "1'den 100'e kadar olan sayılardan hem 3 hem 5'e bölünebilenleri yazdır (FizzBuzz mantığı).",
  },
  {
    slug: "fonksiyonlar",
    title: "Fonksiyonlar",
    description: "def, return, parametreler, *args, **kwargs, lambda, scope, dekoratörler.",
    level: "Başlangıç",
    duration: "30 dk",
    icon: "🧩",
    topics: ["def & return", "parametreler", "*args / **kwargs", "lambda", "dekoratörler"],
    intro: "Tekrar eden kod bloklarını fonksiyonlara paketleyerek DRY (Don't Repeat Yourself) ilkesini uygularız.",
    sections: [
      {
        heading: "Fonksiyon Tanımlama",
        body: "def anahtar kelimesiyle tanımlanır, return ile değer döndürülür (yoksa None döner):",
        code: "def topla(a, b):\n    return a + b\n\nsonuc = topla(3, 5)  # 8",
        codeLabel: "fonksiyon.py",
      },
      {
        heading: "Varsayılan ve Anahtar Kelime Argümanları",
        body: "Parametrelere varsayılan değer atayabilir ve çağırırken isimle geçebilirsin:",
        code: "def selam(isim='Dünya', sesli=True):\n    if sesli:\n        return f'Selam {isim}!'\n    return isim\n\nprint(selam())                  # 'Selam Dünya!'\nprint(selam(isim='Ali', sesli=False))  # 'Ali'",
        codeLabel: "varsayilan.py",
      },
      {
        heading: "Lambda (İsimsiz Fonksiyon)",
        body: "Tek satırlık küçük fonksiyonlar için kullanışlı:",
        code: "kare = lambda x: x * x\nprint(kare(5))  # 25\n\n# sorted ile birlikte:\nnoktalar = [(1, 2), (3, 0), (2, 1)]\nprint(sorted(noktalar, key=lambda p: p[1]))  # y'ye göre sıralı",
        codeLabel: "lambda.py",
      },
    ],
    homework: "Bir listenin en büyük, en küçük ve ortanca değerini döndüren istatistik fonksiyonu yaz (sıralama kullanmadan).",
  },
  {
    slug: "veri-yapilari",
    title: "Veri Yapıları",
    description: "list, tuple, dict, set. List/dict comprehension. Veri yapılarının zaman karmaşıklığı.",
    level: "Orta",
    duration: "35 dk",
    icon: "🗂️",
    topics: ["list & tuple", "dict", "set", "comprehension", "zamankarmaşıklığı"],
    intro: "Veriyi organize etmenin dört temel yolu: sıralı, değiştirilemez, anahtar-değer, benzersiz.",
    sections: [
      {
        heading: "list ve tuple",
        body: "list değiştirilebilir (mutable), tuple değiştirilemez (immutable):",
        code: "sayilar = [1, 2, 3]\nsayilar.append(4)\nsayilar[0] = 10\n\nrenkler = ('kırmızı', 'yeşil', 'mavi')\n# renkler[0] = 'sarı'  # HATA! tuple değiştirilemez",
        codeLabel: "list_tuple.py",
      },
      {
        heading: "dict (Sözlük)",
        body: "Anahtar-değer çiftleri. Arama O(1), ekleme O(1) ortalama:",
        code: "kullanici = {'ad': 'Ali', 'yas': 28}\nprint(kullanici['ad'])           # 'Ali'\nprint(kullanici.get('email', 'yok'))  # 'yok'\n\n# Güvenli erişim:\nkullanici.setdefault('sehir', 'İstanbul')",
        codeLabel: "dict.py",
      },
      {
        heading: "Comprehension",
        body: "Liste/sözlük oluşturmayı tek satırda yap:",
        code: "# List comprehension\nkareler = [x * x for x in range(5)]  # [0, 1, 4, 9, 16]\n\nciftler = [x for x in range(10) if x % 2 == 0]\n\n# Dict comprehension\nharf_sayilari = {h: 'merhaba'.count(h) for h in 'merhaba'}",
        codeLabel: "comprehension.py",
      },
    ],
    homework: "Bir cümledeki kelimelerin frekansını dict olarak döndüren fonksiyon yaz (boşluk ve noktalama ignore).",
  },
  {
    slug: "oop",
    title: "Nesne Yönelimli Programlama",
    description: "class, __init__, self, kalıtım, çok biçimlilik, özel metotlar, dataclass.",
    level: "Orta",
    duration: "40 dk",
    icon: "🧬",
    topics: ["class & __init__", "kalıtım", "çok biçimlilik", "özel metotlar", "dataclass"],
    intro: "Gerçek dünya nesnelerini kodda modelleme yaklaşımı. Sınıflar, kalıtım, çok biçimlilik.",
    sections: [
      {
        heading: "Sınıf Tanımlama",
        body: "class anahtar kelimesiyle. __init__ kurucu metot, self o anki nesne:",
        code: "class Araba:\n    def __init__(self, marka, model):\n        self.marka = marka\n        self.model = model\n\n    def bilgi(self):\n        return f'{self.marka} {self.model}'\n\na = Araba('Toyota', 'Corolla')\nprint(a.bilgi())  # 'Toyota Corolla'",
        codeLabel: "class.py",
      },
      {
        heading: "Kalıtım",
        body: "Bir sınıf, başka bir sınıfın özelliklerini miras alabilir:",
        code: "class ElektrikliAraba(Araba):\n    def __init__(self, marka, model, batarya):\n        super().__init__(marka, model)\n        self.batarya = batarya\n\n    def bilgi(self):  # override (çok biçimlilik)\n        return f'{super().bilgi()} ({self.batarya} kWh)'\n\nt = ElektrikliAraba('Tesla', 'Model 3', 75)\nprint(t.bilgi())",
        codeLabel: "kalitim.py",
      },
    ],
    homework: "Bir 'BankaHesabi' sınıfı yaz: bakiye, para yatırma/çekme metotları, yetersiz bakiyede hata fırlatsın.",
  },
  {
    slug: "ileri-konular",
    title: "İleri Konular",
    description: "Generator, decorator, context manager, async/await, typing. Modern Python araçları.",
    level: "İleri",
    duration: "45 dk",
    icon: "🚀",
    topics: ["generator", "decorator", "context manager", "async/await", "typing"],
    intro: "Profesyonel seviyede Python kodu yazmak için gereken ileri seviye araçlar.",
    sections: [
      {
        heading: "Generator",
        body: "yield anahtar kelimesiyle değer döndüren fonksiyonlar. Bellek dostu, lazy evaluation:",
        code: "def fibonacci(limit):\n    a, b = 0, 1\n    while a < limit:\n        yield a\n        a, b = b, a + b\n\nfor n in fibonacci(100):\n    print(n)  # 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89",
        codeLabel: "generator.py",
      },
      {
        heading: "Async / Await",
        body: "Asenkron programlama. I/O yoğun işlerde (ağ, dosya) yararlı:",
        code: "import asyncio\n\nasync def bekle_saniye(n, ad):\n    await asyncio.sleep(n)\n    print(f'{ad} bitti ({n}s)')\n\nasync def main():\n    await asyncio.gather(\n        bekle_saniye(1, 'A'),\n        bekle_saniye(2, 'B'),\n    )\n\nasyncio.run(main())",
        codeLabel: "async.py",
      },
    ],
    homework: "Bir URL listesi alan ve eşzamanlı olarak içeriklerini çeken async fonksiyon yaz (asyncio + aiohttp).",
  },
];

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}