-- pymulakat-backend: "python-basics" → "programlama-temelleri" slug migration
-- 2026-07-18: Python'a bağımlı URL/slug kaldırıldı.
--
-- ÖNEMLİ: Foreign key bağlı soruları da güncelle.
-- Sonra legacy redirect (/python-basics → /programlama-temelleri) 308 zaten var.
--
-- ADIM 1 — Dry-run (kontrol):
SELECT 'categories' AS tablo, slug, label FROM categories WHERE slug = 'python-basics'
UNION ALL
SELECT 'questions' AS tablo, category AS slug, COUNT(*)::text AS label
FROM questions WHERE category = 'python-basics' GROUP BY category;

-- ADIM 2 — Güncelle:
-- 2a) categories tablosu
UPDATE categories
SET slug = 'programlama-temelleri',
    label = 'Programlama Temelleri',
    description = 'Değişkenler, döngüler, koşullar, fonksiyonlar, string işlemleri. Python ve JavaScript için ortak temel.'
WHERE slug = 'python-basics';

-- 2b) questions tablosu (category field)
UPDATE questions
SET category = 'programlama-temelleri'
WHERE category = 'python-basics';

-- ADIM 3 — Pandas'ı sil (scope'tan çıkarılmıştı):
DELETE FROM categories WHERE slug = 'pandas';
DELETE FROM questions WHERE category = 'pandas';

-- ADIM 4 — Doğrula:
SELECT slug, label, description FROM categories ORDER BY slug;

SELECT category, COUNT(*) AS soru_sayisi
FROM questions
GROUP BY category
ORDER BY category;
