// components/parsePython.ts
// Python fonksiyon imzasını parse edip input paneli için parametre listesi döndürür.
// Hem desktop hem mobile ConsoleTab tarafından kullanılır.

export type PyParamType = "str" | "int" | "float" | "bool" | "list" | "dict" | "tuple" | "any";

export type ParamInfo = {
  name: string;
  type: PyParamType;
  placeholder: string;
};

function placeholderFor(t: PyParamType): string {
  switch (t) {
    case "str":
      return "'hello'";
    case "int":
      return "42";
    case "float":
      return "3.14";
    case "bool":
      return "True";
    case "list":
      return "[1, 2, 3]";
    case "dict":
      return "{'a': 1}";
    case "tuple":
      return "(1, 2)";
    default:
      return "value";
  }
}

function normalizeType(t: string): PyParamType {
  const s = t.toLowerCase().trim();
  if (s === "str" || s === "string") return "str";
  if (s === "int") return "int";
  if (s === "float" || s === "number") return "float";
  if (s === "bool" || s === "boolean") return "bool";
  if (s === "list" || s === "array" || s.startsWith("list[")) return "list";
  if (s === "dict" || s.startsWith("dict[")) return "dict";
  if (s === "tuple") return "tuple";
  return "any";
}

/**
 * "def is_palindrome(text: str) -> bool:" gibi bir starter satırdan
 * veya fonksiyon imzasından parametre listesi çıkarır.
 */
export function parseFunctionSignature(starterCode: string, functionName: string): ParamInfo[] {
  if (!starterCode || !functionName) return [];
  // def functionName(...) ... — ilk parantez bloğunu al
  const m = starterCode.match(
    new RegExp(`def\\s+${functionName}\\s*\\(([^)]*)\\)`, "m")
  );
  if (!m) return [];
  const raw = m[1].trim();
  if (!raw) return [];
  return raw.split(",").map((p) => {
    p = p.trim();
    // "name: type = default" veya "name = default" veya "name"
    const colonIdx = p.indexOf(":");
    let name: string;
    let pyType: PyParamType = "any";
    if (colonIdx > -1) {
      name = p.slice(0, colonIdx).trim();
      const typePart = p.slice(colonIdx + 1).split("=")[0].trim();
      pyType = normalizeType(typePart);
    } else {
      const eqIdx = p.indexOf("=");
      name = (eqIdx > -1 ? p.slice(0, eqIdx) : p).trim();
    }
    return { name, type: pyType, placeholder: placeholderFor(pyType) };
  });
}

/**
 * "42" → 42, "'hello'" → "hello", "[1,2,3]" → [1,2,3]
 * Gibi primitive input'ları parse eder. Hata olursa raw string'i döndürür.
 */
export function parseUserInput(raw: string): any {
  const s = raw.trim();
  if (s === "") return "";
  // Tırnak ile çevrili ise string
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  // bool
  if (s === "True" || s === "true") return true;
  if (s === "False" || s === "false") return false;
  if (s === "None" || s === "null") return null;
  // int / float
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d*\.\d+$/.test(s)) return parseFloat(s);
  // list / dict / tuple
  if (
    (s.startsWith("[") && s.endsWith("]")) ||
    (s.startsWith("{") && s.endsWith("}")) ||
    (s.startsWith("(") && s.endsWith(")"))
  ) {
    try {
      // eslint-disable-next-line no-new-func
      return Function(`"use strict"; return (${s});`)();
    } catch {
      return s;
    }
  }
  return s;
}

/**
 * Primitive, list, dict, string, tuple hepsini okunur formata bas.
 */
export function formatValue(v: any): string {
  if (v === undefined) return "undefined";
  if (v === null) return "null";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}