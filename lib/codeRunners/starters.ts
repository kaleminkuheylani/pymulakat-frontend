// lib/codeRunners/starters.ts
//
// 2026-07-15: Python starter code → JavaScript starter code otomatik donusum.
// Soru DB'de tek starter_code (Python) tutulur; kullanici JavaScript'e
// gecince otomatik ceviriyoruz — DB'ye yeni kolon eklemeden.
//
// Desteklenen donusumler:
//   def fn_name(args):     → function fnName(args) {
//   return value            → return value;
//   def helper(...):        → function helper(...) {
//   True/False/None         → true/false/null
//   print(x)                → console.log(x)
//   if/for/while/elif/else  → if/for/while/else if/else (Python ayni)
//   not/and/or              → !/&&/||
//   # yorum                 → // yorum
//   """docstring"""         → /* docstring */

export function pythonToJsStarter(pythonCode: string, functionName?: string): string {
  if (!pythonCode) return "";

  let js = pythonCode;

  // 1) Docstring → block comment (en basta)
  js = js.replace(/^(\s*)"""([\s\S]*?)"""/gm, "$1/*$2*/");

  // 2) Tek satır yorum # → //
  // (string icindeki # karakterine dokunma, basit regex yeterli)
  js = js.replace(/(^|\s)#(.*)$/gm, "$1 //$2");

  // 3) True/False/None → true/false/null (kelime sinirli)
  js = js.replace(/\bTrue\b/g, "true");
  js = js.replace(/\bFalse\b/g, "false");
  js = js.replace(/\bNone\b/g, "null");

  // 4) Python operatorler → JS
  //    not -> !   and -> &&   or -> ||
  //    Not: 'not in' once 'in' ile karistirilmasin, ama basitlestirilmis
  js = js.replace(/\bnot\b/g, "!");
  js = js.replace(/\band\b/g, "&&");
  js = js.replace(/\bor\b/g, "||");

  // 5) print(x) → console.log(x)
  js = js.replace(/\bprint\s*\(/g, "console.log(");

  // 6) elif → else if
  js = js.replace(/\belif\b/g, "else if");

  // 7) def fn_name(args): → function fnName(args) {
  //    Icerideki indentation'i 1 seviye artir (JS block syntax)
  js = js.replace(
    /^(\s*)def\s+(\w+)\s*\(([^)]*)\)\s*:\s*$/gm,
    (_m, indent, name, args) => `${indent}function ${name}(${args}) {`,
  );

  // 8) Ic def'ler de function olur (nested)
  //    (yukaridaki regex zaten tum 'def'leri yakalar, indentation korunur)

  // 9) return value; ekle (Python'da var, JS'te ';' ekle)
  //    Sadece satir basindaki return statement'lar
  js = js.replace(/(^|\n)([ \t]*)return\s+(.+?)(?=\n|$)/g, (_m, nl, indent, expr) => {
    const trimmed = expr.trim();
    // Zaten ; ile bitiyorsa ekleme
    if (trimmed.endsWith(";") || trimmed.endsWith("{") || trimmed.endsWith("}")) {
      return `${nl}${indent}return ${trimmed}`;
    }
    return `${nl}${indent}return ${trimmed};`;
  });

  // 10) Her satirdan 4 bosluk indentation'i sil (def body'sini 1 seviye azalt)
  //     Bu sayede def body'si fonksiyonun { } blogu icinde olur
  //     Sadece bosluk (tab degil) — yaygın Python convention
  const lines = js.split("\n");
  const dedented: string[] = [];
  let inFunctionBody = false;
  for (const line of lines) {
    if (/^function\s+\w+/.test(line)) {
      inFunctionBody = true;
      dedented.push(line);
      continue;
    }
    if (inFunctionBody && line.match(/^[ ]{4}/)) {
      // 4 bosluk sil
      dedented.push(line.slice(4));
    } else {
      dedented.push(line);
    }
  }
  js = dedented.join("\n");

  // 11) Kapali 'function' blogu — son def'ten sonra JS'in '}' ihtiyaci var
  //     Son satira } ekle (yoksa)
  if (/function\s+\w+\s*\(/.test(js) && !/\}\s*$/.test(js.trimEnd())) {
    js = js.trimEnd() + "\n}";
  }

  return js;
}

/**
 * Kullanicinin kodu starter mi yoksa edit edilmis mi?
 * Basit karsilastirma (whitespace normalizasyonu).
 */
export function isStarterUnchanged(currentCode: string, starter: string | null | undefined): boolean {
  if (!starter) return !currentCode;
  return currentCode.trim() === starter.trim();
}
