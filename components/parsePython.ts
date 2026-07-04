// components/parsePython.ts
// Python fonksiyon imzasını parse edip input paneli için parametre listesi döndürür.
// Sadece mobil WorkspaceMobileClient tarafından kullanılır.
// Desktop WorkspaceEditor kendi inline parser'larını kullanıyor (tarihsel).

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

export function parseFunctionSignature(starterCode: string, functionName: string): ParamInfo[] {
  if (!starterCode || !functionName) return [];
  const m = starterCode.match(
    new RegExp(`def\\s+${functionName}\\s*\\(([^)]*)\\)`, "m")
  );
  if (!m) return [];
  const raw = m[1].trim();
  if (!raw) return [];
  return raw.split(",").map((p) => {
    p = p.trim();
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

export function parseUserInput(raw: string): any {
  const s = raw.trim();
  if (s === "") return "";
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  if (s === "True" || s === "true") return true;
  if (s === "False" || s === "false") return false;
  if (s === "None" || s === "null") return null;
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d*\.\d+$/.test(s)) return parseFloat(s);
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