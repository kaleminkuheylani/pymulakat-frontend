// lib/csvSource.ts
// Server-side CSV fetch + parse. Paylaşılan kaynak: hem detail sayfası hem de
// client component'ler (QuestionListClient, /interviews) tarafından kullanılır.
//
// Cache stratejisi: Next.js fetch revalidate (1 saat). jsDelivr CDN de
// cache'li, double-cache.

const CSV_PRIMARY = "https://raw.githubusercontent.com/kaleminkuheylani/pymulakat-backend/main/data/QUESTIONS-v3.csv";
const CSV_FALLBACK = "https://cdn.jsdelivr.net/gh/kaleminkuheylani/pymulakat-backend@main/data/QUESTIONS-v3.csv";

export interface CSVQuestion {
  id: number;
  category: string;
  title: string;
  level: string;
  description: string;
  starter_code: string;
  test_cases: string;   // JSON string
  hints: string;        // JSON string
  function_name: string;
}

// ─── Parser (RFC 4180 mini) ──────────────────────────────────
function parseCSVText(text: string): CSVQuestion[] {
  const rows: string[][] = [];
  let current: string[] = [];
  let cell = "";
  let inQuote = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuote) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; } else inQuote = false;
      } else cell += c;
    } else {
      if (c === '"') inQuote = true;
      else if (c === ",") { current.push(cell); cell = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        current.push(cell); cell = "";
        if (current.length > 1 || current[0] !== "") rows.push(current);
        current = [];
      } else cell += c;
    }
  }
  if (cell || current.length) { current.push(cell); rows.push(current); }
  if (rows.length < 2) return [];
  const h = rows[0];
  return rows.slice(1).map((cols) => {
    const get = (k: string) => {
      const i = h.indexOf(k);
      return i >= 0 ? cols[i] || "" : "";
    };
    return {
      id: parseInt(get("id"), 10) || 0,
      category: get("category"),
      title: get("title"),
      level: get("level") || "beginner",
      description: get("description"),
      starter_code: get("starter_code"),
      test_cases: get("test_cases"),
      hints: get("hints"),
      function_name: get("function_name"),
    };
  }).filter((q) => q.id > 0 && q.title);
}

// ─── Server fetch (Next.js cache ile) ───────────────────────
export async function fetchCSVQuestions(): Promise<CSVQuestion[]> {
  for (const url of [CSV_PRIMARY, CSV_FALLBACK]) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const text = await res.text();
        const parsed = parseCSVText(text);
        if (parsed.length > 0) return parsed;
      }
    } catch {
      // devam
    }
  }
  return [];
}

// ─── Helper: title → slug (DB uyumlu) ────────────────────────
export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ü/g, "u").replace(/ö/g, "o")
    .replace(/ş/g, "s").replace(/ç/g, "c").replace(/ğ/g, "g")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── ID veya slug ile soru bul ──────────────────────────────
export async function findQuestion(
  category: string,
  idOrSlug: string
): Promise<CSVQuestion | null> {
  const rows = await fetchCSVQuestions();
  const asNum = parseInt(idOrSlug, 10);

  // 1) ID ile eşle
  if (!isNaN(asNum)) {
    const byId = rows.find((q) => q.id === asNum && q.category === category);
    if (byId) return byId;
  }

  // 2) Slug ile eşle (DB'de slug alanı yok, title'dan üret)
  const slug = idOrSlug.toLowerCase();
  const bySlug = rows.find(
    (q) => q.category === category && slugifyTitle(q.title) === slug
  );
  if (bySlug) return bySlug;

  return null;
}
