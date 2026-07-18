// Python kod örnekleri kataloğu — statik.

export type CodeLevel = "Başlangıç" | "Orta" | "İleri";

export interface Category {
  slug: string;
  name: string;
  icon: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { slug: "temel", name: "Temel", icon: "🧱", description: "String, liste, sözlük gibi temel veri yapıları." },
  { slug: "algoritmalar", name: "Algoritmalar", icon: "🧠", description: "Sıralama, arama, dinamik programlama." },
  { slug: "veri-yapilari", name: "Veri Yapıları", icon: "📚", description: "Stack, queue, linked list, tree." },
  { slug: "dosya-islemleri", name: "Dosya İşlemleri", icon: "📁", description: "Dosya okuma/yazma, JSON, CSV." },
  { slug: "web-api", name: "Web & API", icon: "🌐", description: "HTTP, JSON API, regex." },
];

export interface CodeSample {
  slug: string;
  category: string;
  title: string;
  description: string;
  level: CodeLevel;
  code: string;
  // SEO alanlari (Ne Zaman Kullanilir / Gercek Dunya Ornegi / Yaygin Hatalar)
  useCase?: string;
  realWorld?: string;
  commonMistakes?: string;
}

export const CODE_SAMPLES: CodeSample[] = [
  // ── TEMEL ──
  {
    slug: "ters-string",
    category: "temel",
    title: "String Ters Çevirme",
    description: "Bir string'i ters çevirmenin üç farklı yolu: dilim, döngü, join + reversed.",
    level: "Başlangıç",
    code: `s = "Python"
# 1) Dilim (en kısa)
print(s[::-1])          # 'nohtyP'

# 2) Döngü
t = ""
for c in s:
    t = c + t
print(t)                # 'nohtyP'

# 3) join + reversed
print(''.join(reversed(s)))  # 'nohtyP'`,
    useCase: "URL slug üretirken, log dosyalarını tersine çevirirken, palindrome kontrolünde.",
    realWorld: "GitHub repo'da dosya yolunu ters çevirme, biyoinformatikte DNA reverse-complement hesabı.",
    commonMistakes: "s[::1] yerine s[::-1] yazmak (off-by-one), reversed()'ı doğrudan print etmeye çalışmak (iterator döner).",
  },
  {
    slug: "palindrom-kontrol",
    category: "temel",
    title: "Palindrom Kontrolü",
    description: "Bir kelimenin tersten de aynı okunup okunmadığını kontrol eder.",
    level: "Başlangıç",
    code: `def is_palindrome(s: str) -> bool:
    s = s.lower().replace(" ", "")
    return s == s[::-1]

print(is_palindrome("kek"))         # True
print(is_palindrome("A man a plan a canal Panama"))  # True
print(is_palindrome("python"))      # False`,
    useCase: "Form validasyonu, kelime oyunları, kullanıcı adı kontrolü.",
    realWorld: "Biyoinformatikte DNA palindrome tespiti, kod yarışmalarında klasik soru.",
    commonMistakes: "Büyük/küçük harf duyarlılığını unutmak, boşluk ve noktalamayı filtrelememek.",
  },
  {
    slug: "iki-sayinin-ebobu",
    category: "temel",
    title: "EBOB (GCD) Hesaplama",
    description: "Öklid algoritmasıyla iki sayının en büyük ortak bölenini bulur.",
    level: "Başlangıç",
    code: `def ebob(a: int, b: int) -> int:
    while b:
        a, b = b, a % b
    return a

# math modülü ile:
import math
print(math.gcd(48, 18))  # 6
print(ebob(48, 18))      # 6

# Üç sayının EBOB'u:
print(math.gcd(math.gcd(12, 18), 24))  # 6`,
    useCase: "Kesir sadeleştirme, RSA şifreleme, asal çarpan bulmada yardımcı.",
    realWorld: "Kriptografi (RSA), müzik teorisi (ritim analizi), grafik renk paleti hesabı.",
    commonMistakes: "Negatif sayılarla çalışırken işaret unutmak, çok büyük sayılarda recursion derinliği.",
  },
  {
    slug: "liste-tekil-sirali",
    category: "temel",
    title: "Listeyi Tekilleştirme (Sırayı Koruyarak)",
    description: "Bir listenin tekrar eden elemanlarını kaldırır, ilk görünme sırasını korur.",
    level: "Orta",
    code: `def uniq(seq):
    seen = set()
    out = []
    for x in seq:
        if x not in seen:
            seen.add(x)
            out.append(x)
    return out

print(uniq([1, 3, 2, 3, 1, 4]))  # [1, 3, 2, 4]`,
    useCase: "Veri temizleme, log ayrıştırma, e-posta listelerini sadeleştirme.",
    realWorld: "E-ticaret'te sepet verisi, CRM'de müşteri tekrarları temizleme, ETL pipeline preprocessing.",
    commonMistakes: "set() kullanıp sırayı kaybetmek, O(n²) kontrol ile performans kaybı.",
  },

  // ── ALGORİTMALAR ──
  {
    slug: "binary-search",
    category: "algoritmalar",
    title: "İkili Arama (Binary Search)",
    description: "Sıralı bir dizide O(log n) hızında arama yapar.",
    level: "Orta",
    code: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

print(binary_search([1, 3, 5, 7, 9, 11], 7))  # 3`,
    useCase: "Sıralı veri üzerinde hızlı arama, sözlük implementasyonu, oyun motorlarında hit detection.",
    realWorld: "Veritabanı index aramaları, dosya sistemi binary search tree, telefon rehberi araması.",
    commonMistakes: "Sıralanmamış dizide kullanmak, off-by-one hatası (left <= right vs <), mid hesabında overflow (C++'ta)."
  },
  {
    slug: "quick-sort",
    category: "algoritmalar",
    title: "Hızlı Sıralama (Quick Sort)",
    description: "Böl ve fethet yaklaşımıyla O(n log n) ortalama sıralama.",
    level: "Orta",
    code: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left   = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right  = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

print(quick_sort([3, 6, 8, 10, 1, 2, 1, 9, 5]))  # [1, 1, 2, 3, 5, 6, 8, 9, 10]`,
    useCase: "Genel amaçlı sıralama, veritabanı ORDER BY, leaderboard sıralaması.",
    realWorld: "Excel sıralama, e-ticaret ürün listesi (fiyata göre), harita servislerinde rota optimizasyonu.",
    commonMistakes: "Pivot elemanı kötü seçmek (worst-case O(n²)), recursion stack overflow büyük dizilerde."
  },
  {
    slug: "fibonacci-memoization",
    category: "algoritmalar",
    title: "Fibonacci (Memoization)",
    description: "Dinamik programlama ile O(n) Fibonacci hesabı.",
    level: "Orta",
    code: `from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n: int) -> int:
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

# İlk 10 sayı:
print([fib(i) for i in range(10)])
# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,
    useCase: "Özyinelemeli hesaplama optimizasyonu, dinamik programlama temeli.",
    realWorld: "Finansal modelleme, populasyon büyüme simülasyonu, Fibonacci retracement (teknik analiz).",
    commonMistakes: "Base case'leri eksik bırakmak (fib(0)=0, fib(1)=1), memoization'sız O(2^n) patlaması.",
  },
  {
    slug: "iki-toplam",
    category: "algoritmalar",
    title: "İki Sayının Toplamı (Two Sum)",
    description: "Bir dizide toplamı hedef değere eşit olan iki sayının indislerini bulur.",
    level: "Orta",
    code: `def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        kalan = target - x
        if kalan in seen:
            return [seen[kalan], i]
        seen[x] = i
    return []

print(two_sum([2, 7, 11, 15], 9))  # [0, 1]`,
    useCase: "Mülakat klasiği, pair/target problemleri, indeks haritalama.",
    realWorld: "Ödeme eşleştirme (banka transaction), envanterde toplam fiyat kontrolü, sudoku gibi oyunlar.",
    commonMistakes: "Aynı elemanı iki kez kullanmak (nums[i] + nums[i] == target), indeksleri karıştırmak."
  },

  // ── VERİ YAPILARI ──
  {
    slug: "stack-listeyle",
    category: "veri-yapilari",
    title: "Stack (Yığın) — Liste ile",
    description: "LIFO (Son Giren İlk Çıkar) veri yapısı.",
    level: "Başlangıç",
    code: `class Stack:
    def __init__(self):
        self._data = []

    def push(self, x):  self._data.append(x)
    def pop(self):      return self._data.pop() if self._data else None
    def peek(self):     return self._data[-1] if self._data else None
    def is_empty(self): return not self._data

s = Stack()
s.push(1); s.push(2); s.push(3)
print(s.pop(), s.pop(), s.pop())  # 3 2 1
print(s.is_empty())              # True`,
    useCase: "Geri alma (undo), DFS, parantez eşleme, fonksiyon çağrı yığını.",
    realWorld: "Tarayıcı geri-ileri navigasyonu, editör undo/redo, derleyici call stack, infix → postfix dönüşümü.",
    commonMistakes: "Boş stack'te pop() yapmak, LIFO yerine FIFO kullanmak, list.pop(0) ile kuyruk simülasyonu (yavaş)."
  },
  {
    slug: "queue-deque",
    category: "veri-yapilari",
    title: "Queue (Kuyruk) — deque ile",
    description: "FIFO (İlk Giren İlk Çıkar) veri yapısı. deque O(1) append/popleft sağlar.",
    level: "Orta",
    code: `from collections import deque

class Queue:
    def __init__(self):
        self._data = deque()

    def enqueue(self, x): self._data.append(x)
    def dequeue(self):    return self._data.popleft() if self._data else None
    def is_empty(self):   return not self._data

q = Queue()
q.enqueue('a'); q.enqueue('b'); q.enqueue('c')
print(q.dequeue(), q.dequeue(), q.dequeue())  # a b c`,
    useCase: "BFS, iş kuyruğu (task scheduling), mesaj kuyruğu (RabbitMQ benzeri).",
    realWorld: "Yazıcı kuyruğu, çağrı merkezi IVR, gerçek zamanlı chat sunucuları, sliding window algoritmaları.",
    commonMistakes: "list.pop(0) O(n) maliyet — deque kullan, threading olmadan thread-safe varsaymak.",
  },
  {
    slug: "linked-list",
    category: "veri-yapilari",
    title: "Bağlı Liste (Linked List)",
    description: "Düğümler halinde organize edilen, O(1) ekleme/çıkarma yapısı.",
    level: "İleri",
    code: `class Node:
    def __init__(self, val, nxt=None):
        self.val, self.next = val, nxt

def to_list(head):
    out, cur = [], head
    while cur:
        out.append(cur.val); cur = cur.next
    return out

# 1 -> 2 -> 3 -> None
head = Node(1, Node(2, Node(3)))
print(to_list(head))  # [1, 2, 3]`,
    useCase: "Dinamik veri yapısı, hash tablo zincirleme, LRU cache implementasyonu.",
    realWorld: "Müzik çalar önceki/sonraki, geri alma geçmişi, bellek ayırıcı (allocator) free list.",
    commonMistakes: "Döngüsel referans oluşturmak (memory leak), head/tail pointer'ı karıştırmak, traversal'da None kontrolü."
  },

  // ── DOSYA İŞLEMLERİ ──
  {
    slug: "dosya-okuma-yazma",
    category: "dosya-islemleri",
    title: "Dosya Okuma / Yazma",
    description: "with deyimiyle güvenli dosya işlemleri (otomatik kapatma).",
    level: "Başlangıç",
    code: `# Yazma
with open("notlar.txt", "w", encoding="utf-8") as f:
    f.write("Merhaba\\nDünya\\n")

# Satır satır okuma
with open("notlar.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.rstrip())`,
    useCase: "Log dosyaları, konfigürasyon, veri dışa aktarma, batch processing.",
    realWorld: "CSV raporları, log rotasyonu, JSON dump, pickle ile model kaydetme.",
    commonMistakes: "Dosyayı kapatmayı unutmak (with kullan), encoding belirtmemek (Türkçe karakter bozulur), mode='w' ile yanlışlıkla silmek.",
  },
  {
    slug: "json-okuma-yazma",
    category: "dosya-islemleri",
    title: "JSON Okuma / Yazma",
    description: "Python dict ↔ JSON dönüşümü.",
    level: "Orta",
    code: `import json

data = {
    "ad": "Ali",
    "yas": 28,
    "yetenekler": ["Python", "SQL", "Docker"]
}

# JSON string:
s = json.dumps(data, ensure_ascii=False, indent=2)
print(s)

# JSON string → dict:
parsed = json.loads(s)
print(parsed["ad"])`,
    useCase: "API yanıtları, konfigürasyon dosyaları, veri serileştirme, cache.",
    realWorld: "REST API yanıtları, .env yerine JSON config, microservice arası mesajlaşma, settings persistence.",
    commonMistakes: "Datetime gibi özel tipleri serialize edememek, JSON içine fonksiyon/reference koymak (güvenlik riski), indent olmadan dev dosya üretmek.",
  },
  {
    slug: "csv-okuma",
    category: "dosya-islemleri",
    title: "CSV Dosyası Okuma",
    description: "csv modülüyle tablo verisi okuma ve DictReader kullanımı.",
    level: "Orta",
    code: `import csv

# Çok satırlı string (örnek veri)
csv_text = """ad,yas,sehir
Ali,28,İstanbul
Ayşe,32,Ankara
Mehmet,25,İzmir"""

# DictReader ile oku:
from io import StringIO
reader = csv.DictReader(StringIO(csv_text))
for row in reader:
    print(row)`,
    useCase: "Veri analizi, ETL, raporlama, e-ticaret ürün listesi.",
    realWorld: "Banka ekstreleri (CSV), müşteri verisi içe aktarma, anket sonuçları, hızlı okuma.",
    commonMistakes: "Delimiter'ı yanlış tahmin etmek (noktalı virgül), header=None unutmak, büyük dosyada csv.reader yerine DictReader performansı.",
  },

  // ── WEB & API ──
  {
    slug: "url-parse",
    category: "web-api",
    title: "URL Ayrıştırma",
    description: "urllib.parse ile URL parçalama, query string işleme.",
    level: "Başlangıç",
    code: `from urllib.parse import urlparse, parse_qs, urlencode

url = "https://api.example.com/search?q=python&page=2"
p = urlparse(url)
print("Host:", p.netloc)
print("Path:", p.path)
print("Query:", parse_qs(p.query))
# {'q': ['python'], 'page': ['2']}

# Yeni URL oluştur:
params = urlencode({"q": "django", "page": 1})
print(f"{p.scheme}://{p.netloc}{p.path}?{params}")`,
    useCase: "API entegrasyonları, web scraping, query string işleme, OAuth callback.",
    realWorld: "URL shortener (bit.ly), affiliate link takibi, REST API parametre yönetimi, e-ticaret filtre URL'leri.",
    commonMistakes: "Query string'de aynı anahtardan birden fazla olabilir (list dön!), URL encoding/decoding karıştırmak."
  },
  {
    slug: "email-kontrol",
    category: "web-api",
    title: "Email Doğrulama (Regex)",
    description: "Basit email format kontrolü için regex kullanımı.",
    level: "Orta",
    code: `import re

EMAIL_RE = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")

def is_valid_email(s: str) -> bool:
    return bool(EMAIL_RE.match(s))

print(is_valid_email("ali@test.com"))   # True
print(is_valid_email("ali.test@com"))  # False`,
    useCase: "Form validasyonu, kayıt formları, kullanıcı girişi, toplu e-posta temizliği.",
    realWorld: "Newsletter kayıtları, e-ticaret checkout, kurumsal e-posta format kontrolü, GDPR uyum veri temizleme.",
    commonMistakes: "Çok basit regex (@ olsun yeter) → RFC 5321 standartlarını kaçırmak, server-side validation'ı atlamak."
  },

];

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}