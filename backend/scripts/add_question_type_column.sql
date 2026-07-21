-- Migration: public.questions tablosuna question_type kolonu ekle
-- 2026-07-21: Public sorulari filtrelemek icin gerekli.
-- Idempotent: kolon yoksa ekler, varsa guncellemez.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'questions'
      AND column_name = 'question_type'
  ) THEN
    ALTER TABLE public.questions
      ADD COLUMN question_type TEXT NOT NULL DEFAULT 'public';
  END IF;
END
$$;

-- Guvenlik: mevcut satirlar NULL veya bos ise 'public' yap.
UPDATE public.questions
SET question_type = 'public'
WHERE question_type IS NULL OR question_type = '';
