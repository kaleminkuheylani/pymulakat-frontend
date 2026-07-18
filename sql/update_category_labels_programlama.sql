-- pymulakat-backend: kategori label/description "Programlama Mülakatı" pozisyonu
-- 2026-07-18: Python'a bağımlı etiketler kaldırıldı.
--
-- Önce kontrol (dry-run):
SELECT slug, label, description FROM categories ORDER BY slug;

-- Güncelle:
UPDATE categories
SET
  label = CASE slug
    WHEN 'python-basics'         THEN 'Programlama Temelleri'
    WHEN 'data-structures'       THEN 'Veri Yapıları'
    WHEN 'list-dict'             THEN 'Listeler & Sözlükler'
    WHEN 'algorithms'            THEN 'Algoritmalar'
    WHEN 'heap'                  THEN 'Heap / Öncelik Kuyruğu'
    WHEN 'stack'                 THEN 'Yığın / Stack'
    WHEN 'dynamic-programming'   THEN 'Dinamik Programlama'
  END,
  description = CASE slug
    WHEN 'python-basics'         THEN 'Değişkenler, döngüler, koşullar, fonksiyonlar, string işlemleri. Python ve JavaScript için ortak temel.'
    WHEN 'data-structures'       THEN 'List, dict, set, tuple, deque, generators. Dil-bağımsız veri yapıları.'
    WHEN 'list-dict'             THEN 'Listeler, sözlükler, setler. Arama, ekleme, silme, sıralama pratikleri.'
    WHEN 'algorithms'            THEN 'Sıralama, arama, iki işaretçi, sliding window. Dil-bağımsız algoritma temelleri.'
    WHEN 'heap'                  THEN 'Heapq, kth largest, top-k, merge k sorted, median stream.'
    WHEN 'stack'                 THEN 'Yığın yapısı, parantez eşleme, undo, RPN, monotonik stack.'
    WHEN 'dynamic-programming'   THEN 'Memoization, tabulation, optimal substructure. Fibonacci, knapsack, LCS.'
  END
WHERE slug IN (
  'python-basics', 'data-structures', 'list-dict',
  'algorithms', 'heap', 'stack', 'dynamic-programming'
);

-- Pandas da scope'tan çıkarılmıştı — silmek için (sen söylemiştin):
-- DELETE FROM categories WHERE slug = 'pandas';

-- Doğrula:
SELECT slug, label, description FROM categories ORDER BY slug;
