// lib/errorClassifier.ts
// Pyodide'dan dönen raw Python error mesajlarını hardcoded enum etiketlere çevirir.
// UI'da gösterilecek tek şey sabit label'dır. Raw mesaj ASLA loglanmaz, toast'a
// basılmaz, server'a gönderilmez, DB'ye yazılmaz.

export type ErrorCategory =
  | "syntax_error"
  | "value_error"
  | "index_error"
  | "type_error"
  | "recursion_error"
  | "name_error"
  | "attribute_error"
  | "key_error"
  | "logic_error"
  | "unknown";

export const ERROR_LABELS: Record<ErrorCategory, string> = {
  syntax_error: "Syntax Error",
  value_error: "Value Error",
  index_error: "Index Error",
  type_error: "Type Error",
  recursion_error: "Recursion Error",
  name_error: "Name Error",
  attribute_error: "Attribute Error",
  key_error: "Key Error",
  logic_error: "Logic Error",
  unknown: "Unknown Error",
};

// Renk paleti de sabit — UI'da hızlı badge için
export const ERROR_BADGE: Record<ErrorCategory, string> = {
  syntax_error: "bg-rose-500/15 border-rose-500/30 text-rose-300",
  value_error: "bg-orange-500/15 border-orange-500/30 text-orange-300",
  index_error: "bg-amber-500/15 border-amber-500/30 text-amber-300",
  type_error: "bg-yellow-500/15 border-yellow-500/30 text-yellow-300",
  recursion_error: "bg-purple-500/15 border-purple-500/30 text-purple-300",
  name_error: "bg-pink-500/15 border-pink-500/30 text-pink-300",
  attribute_error: "bg-fuchsia-500/15 border-fuchsia-500/30 text-fuchsia-300",
  key_error: "bg-red-500/15 border-red-500/30 text-red-300",
  logic_error: "bg-slate-500/15 border-slate-500/30 text-slate-300",
  unknown: "bg-white/5 border-white/10 text-white/60",
};

/**
 * Pyodide'dan dönen error message'ı kategorize edip sabit label döner.
 *
 * NOT: Bu fonksiyon raw error string'i ASLA döndürmez, loglamaz, göstermez.
 * Sadece enum + label. Raw içerik sadece fonksiyon içinde yaşar ve biter.
 *
 * Pattern'ler Python'ın resmi exception isimleriyle başlayan mesajlardır:
 *   "SyntaxError: invalid syntax"
 *   "ValueError: invalid literal for int() with base 10: 'abc'"
 *   "IndexError: list index out of range"
 *   vs.
 */
export function classifyError(rawMessage: string): ErrorCategory {
  // Güvenli lower-case — case-sensitive kontrol gerekmiyor
  const m = (rawMessage || "").toString();

  if (!m.trim()) return "unknown";

  // 1. Syntax — parser/fonksiyon tanımıyla ilgili
  if (
    /\bSyntaxError\b/.test(m) ||
    /\bIndentationError\b/.test(m) ||
    /\bTabError\b/.test(m)
  ) {
    return "syntax_error";
  }

  // 2. ValueError — argüman/tip doğru ama değer uygun değil
  if (/\bValueError\b/.test(m)) {
    return "value_error";
  }

  // 3. IndexError
  if (/\bIndexError\b/.test(m)) {
    return "index_error";
  }

  // 4. TypeError
  if (/\bTypeError\b/.test(m)) {
    return "type_error";
  }

  // 5. RecursionError / MemoryError
  if (/\bRecursionError\b/.test(m) || /\bMemoryError\b/.test(m)) {
    return "recursion_error";
  }

  // 6. NameError
  if (/\bNameError\b/.test(m)) {
    return "name_error";
  }

  // 7. AttributeError
  if (/\bAttributeError\b/.test(m)) {
    return "attribute_error";
  }

  // 8. KeyError
  if (/\bKeyError\b/.test(m)) {
    return "key_error";
  }

  // 9. Bilinen hiçbir kategoriye uymadı
  return "unknown";
}

/**
 * Test case bazlı: eğer success=false ama hiçbir test patlamadıysa
 * (passed < total ama results[].error yok), bu logic hatasıdır.
 */
export function classifyFromTestFailure(
  passedTests: number,
  totalTests: number,
  firstErrorMessage?: string
): ErrorCategory {
  if (firstErrorMessage && firstErrorMessage.trim()) {
    return classifyError(firstErrorMessage);
  }
  if (passedTests < totalTests) {
    return "logic_error";
  }
  return "unknown";
}

/**
 * UI için: kategori → sabit label. Raw içerik sızmaz.
 */
export function getErrorLabel(category: ErrorCategory): string {
  return ERROR_LABELS[category] ?? ERROR_LABELS.unknown;
}

export function getErrorBadgeClass(category: ErrorCategory): string {
  return ERROR_BADGE[category] ?? ERROR_BADGE.unknown;
}