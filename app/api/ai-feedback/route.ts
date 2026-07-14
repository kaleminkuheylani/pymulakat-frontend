// app/api/ai-feedback/route.ts
//
// 2026-07-14 — DeepSeek V3 entegrasyonu.
//
// Akış:
//   POST /api/ai-feedback
//   Body: { code, questionContext, testResults, apiKey? }
//   Header: X-User-Api-Key (BYOK — kullanıcının kendi key'i, öncelikli)
//
// Auth:
//   - Cookie "pymulakat_auth" === "1" → user authenticated
//   - Aksi → 401 (misafir AI feedback kullanamaz)
//
// API key önceliği (sırayla):
//   1) X-User-Api-Key header (BYOK, server-side hiç loglanmaz)
//   2) Body.apiKey (alternatif BYOK kanalı)
//   3) process.env.DEEPSEEK_API_KEY (fallback, ücretsiz tier için)
//
// Limit:
//   - Server-side limit YOK (kullanıcı kendi localStorage'ında tutuyor)
//   - Üye user 5 deneme hakkına sahip (QuotaClient-side)
//   - BYOK kullananlar server-side limitsiz (key kendilerinin)
//
// Response:
//   200: { feedback: string, model: string, usage: { prompt_tokens, completion_tokens, total_tokens } }
//   401: { error: "auth_required" }
//   400: { error: "no_api_key" }
//   502: { error: "deepseek_error", message: string }

import { NextRequest, NextResponse } from "next/server";

// 2026-07-14 v3: Edge runtime iptal — 30s timeout + CPU limit, DeepSeek
//   fetch uzun sürünce kesiliyordu (stream yarım geldi). Node.js'e geri
//   dönüldü. Streaming için Vercel-aware headers + ReadableStream passthrough.
//   Vercel Node.js runtime Web Streams API (ReadableStream) destekliyor (Node 18+).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const DEFAULT_MODEL = "deepseek-chat"; // DeepSeek V3 (2024-12 stable)
const MAX_TOKENS = 1500;
const TEMPERATURE = 0.3; // düşük = deterministik, kod review için ideal

// Sistem promptu — Türkçe, deneyimli coding coach persona
// 2026-07-14 v2: "Çözüm yazma" kuralı eklendi — sadece feedback/yönlendirme.
const SYSTEM_PROMPT = `Sen deneyimli bir Python teknik mülakat koçusun. Öğrenci bir kod yazdı ve test case'leri çalıştırdı. Sana kodu, soru bağlamını ve test sonuçlarını göndereceğim.

GÖREV — sadece FEEDBACK ve YÖNLENDIRME, ASLA direkt çözüm kodu yazma:

1. **✅ İyi olan kısımlar** — neyi doğru yapmış, kısa ve net.
2. **⚠️ Hata / bug** — varsa spesifik satır/satır aralığı, NEDEN hatalı.
3. **💡 Düşünce yönlendirmesi** — hangi yaklaşımı denemesi gerektiğini İPUCU olarak söyle (hangi veri yapısı, hangi algoritma pattern'i, hangi edge case'leri kontrol etmeli). ÇÖZÜM KODU YAZMA.
4. **⏱ Karmaşıklık** — mevcut kodun Big-O'su, ideal olması gereken.
5. **🧪 Edge case hatırlatması** — boş liste, tek eleman, None, negatif sayı, büyük input.

KURALLAR:
- ASLA tam çözüm kodu yazma. "Bunu dene: def foo(x): ..." gibi. Sadece yön göster.
- İPUCU formatı: "Şunu düşün: [kavram]", "Hangi pattern uygun: [pattern adı]", "[X] durumunda ne olur?"
- Türkçe yaz, teknik terim İngilizce parantez içinde olabilir.
- Maksimum 280 kelime, markdown KULLANMA (düz metin).
- Cevap yapısı: "✅ İyi: ... → ⚠️ Hata: ... → 💡 Düşün: ... → ⏱ Karmaşıklık: ... → 🧪 Edge: ...".
- Ton: samimi, yargılamayan, teşvik edici. Kullanıcı öğrensin, kopyala-yapıştır yapmasın.`;

interface AiFeedbackBody {
  code: string;
  questionTitle: string;
  questionDescription?: string;
  testResults?: Array<{ input?: string; expected?: string; actual?: string; passed: boolean; description?: string }>;
  apiKey?: string;
}

const parseBody = (raw: unknown): AiFeedbackBody | null => {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.code !== "string" || typeof r.questionTitle !== "string") return null;
  return {
    code: r.code,
    questionTitle: r.questionTitle,
    questionDescription: typeof r.questionDescription === "string" ? r.questionDescription : "",
    testResults: Array.isArray(r.testResults) ? (r.testResults as AiFeedbackBody["testResults"]) : [],
    apiKey: typeof r.apiKey === "string" ? r.apiKey : undefined,
  };
};

export async function POST(request: NextRequest) {
  // 1) Auth gate — sadece authenticated user
  //    2026-07-14: 3 katmanlı kontrol:
  //    1) Sentinel cookie "pymulakat_auth" (useUser.ts mount sırasında yazılır)
  //    2) Supabase auth cookie'leri (sb-pymulakat-auth-token, sb-*-auth-token, vs.)
  //    3) Pattern fallback: cookie name auth/access-token/sb-*-auth içeriyor
  //    Sentinel yazımı race condition'da başarısız olabilir, Supabase cookie
  //    fallback ile daha robust.
  const allCookies = request.cookies.getAll();
  const cookieMap: Record<string, string> = {};
  for (const c of allCookies) cookieMap[c.name] = c.value;

  let authenticated = false;

  // 1) Sentinel
  if (cookieMap["pymulakat_auth"] === "1") {
    authenticated = true;
  }

  // 2) Supabase auth cookie pattern
  if (!authenticated) {
    const SUPABASE_NAMES = [
      "sb-pymulakat-auth-token",
      "sb-pymulakat-auth-token-code-verifier",
      "sb-lhuhfgpjbnngjxzlvywp-auth-token",
      "sb-lhuhfgpjbnngjxzlvywp-auth-token-code-verifier",
    ];
    for (const name of SUPABASE_NAMES) {
      const v = cookieMap[name];
      if (v && v.length > 0 && v !== "null" && v !== "undefined") {
        authenticated = true;
        break;
      }
    }
  }

  // 3) Pattern fallback
  if (!authenticated) {
    for (const [name, value] of Object.entries(cookieMap)) {
      if (
        /auth-token|access-token|jwt|sb-.*-auth/i.test(name) &&
        value &&
        value.length > 0 &&
        value !== "null" &&
        value !== "undefined"
      ) {
        authenticated = true;
        break;
      }
    }
  }

  if (!authenticated) {
    return NextResponse.json(
      { error: "auth_required", message: "AI feedback için giriş yapmalısın." },
      { status: 401 }
    );
  }

  // 2) Body parse + validate
  let body: AiFeedbackBody;
  try {
    const raw = await request.json();
    const parsed = parseBody(raw);
    if (!parsed) {
      return NextResponse.json(
        { error: "invalid_body", message: "Geçersiz istek formatı." },
        { status: 400 }
      );
    }
    body = parsed;
  } catch (e) {
    return NextResponse.json(
      { error: "invalid_body", message: "Geçersiz istek formatı." },
      { status: 400 }
    );
  }

  // 3) API key resolution (BYOK > env)
  const headerKey = request.headers.get("X-User-Api-Key")?.trim();
  const finalKey = headerKey || body.apiKey || process.env.DEEPSEEK_API_KEY;
  if (!finalKey) {
    return NextResponse.json(
      {
        error: "no_api_key",
        message: "API key bulunamadı. .env'e DEEPSEEK_API_KEY ekleyin veya kendi key'inizi kullanın.",
      },
      { status: 400 }
    );
  }

  // 4) User prompt derleme
  const testResults = body.testResults ?? [];
  const passedCount = testResults.filter((t) => t.passed).length;
  const totalCount = testResults.length;
  const testSummary = totalCount > 0
    ? `Test sonuçları: ${passedCount}/${totalCount} geçti.`
    : "Test sonuçları: henüz çalıştırılmadı.";

  const failingTests = testResults
    .filter((t) => !t.passed)
    .slice(0, 3) // max 3 failing test göster, prompt şişmesin
    .map((t, i) => {
      const parts = [`#${i + 1}`];
      if (t.description) parts.push(`(${t.description})`);
      if (t.input !== undefined) parts.push(`girdi: ${t.input}`);
      if (t.expected !== undefined) parts.push(`beklenen: ${t.expected}`);
      if (t.actual !== undefined) parts.push(`gerçek: ${t.actual}`);
      return parts.join(" ");
    })
    .join("\n");

  const userPrompt = `Soru Başlığı: ${body.questionTitle}
${body.questionDescription ? `\nSoru Açıklaması:\n${body.questionDescription.slice(0, 800)}` : ""}

${testSummary}
${failingTests ? `\nBaşarısız testler:\n${failingTests}` : ""}

Kullanıcının Şu Anki Kodu:
\`\`\`python
${body.code}
\`\`\`

Lütfen yukarıdaki kurallara göre feedback ver:
- Sadece yönlendirme + ipucu
- ASLA tam çözüm kodu yazma
- Kullanıcı kendi çözsün`;

  // 5) DeepSeek API call — 2026-07-14 v4: stream: false (JSON)
  //    SSE streaming Vercel Node.js runtime'da buffer'lanıyor (yarim
  //    geliyor, token '?'). Edge runtime timeout nedeniyle kesiliyor.
  //    En güvenilir: normal JSON response, frontend typewriter interval
  //    kademeli gösterir (40 char/sn, yazı okuma hızı).
  //    Kullanıcı deneyimi aynı: harf harf akıyor, ama kaynak güvenilir.
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${finalKey}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
        stream: false, // JSON response, frontend typewriter kademeli gösterir
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      return NextResponse.json(
        {
          error: "deepseek_error",
          message: `DeepSeek API hata döndü: ${response.status}`,
          detail: errText.slice(0, 300),
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    if (!choice?.message?.content) {
      return NextResponse.json(
        { error: "empty_response", message: "DeepSeek boş yanıt döndü." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      feedback: choice.message.content,
      model: data.model ?? DEFAULT_MODEL,
      usage: data.usage ?? { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      finished_at: new Date().toISOString(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bilinmeyen hata";
    return NextResponse.json(
      { error: "network_error", message: `DeepSeek'e ulaşılamadı: ${message}` },
      { status: 502 }
    );
  }
}
