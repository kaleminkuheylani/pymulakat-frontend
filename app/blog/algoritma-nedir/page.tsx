// app/blog/algoritma-nedir/page.tsx
//
// "Algoritma Nedir?" blog yazısı — pymulakat dark + amber teması.
//
// 2026-07-17: İlk blog entry. HTML prototip → JSX, temaya uyarlandı.
// - Lucide icons (no emoji)
// - Dark + amber accent
// - Akış şemaları: CSS nodes + Lucide arrow
// - Pseudo kod: monospace plain (renk yok, JSX escape sorunu)

import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, ArrowLeft, ArrowRight, ArrowDown } from "lucide-react";
import { notFound } from "next/navigation";
import { BASE_URL } from "@/lib/seo";
import { getPost } from "../posts";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const post = await getPost("algoritma-nedir");
  if (!post) return { title: "Yazı Bulunamadı" };
  return {
    title: `${post.title} | Python Mülakat Blog`,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: "Python Mülakat", url: "https://pythonmulakat.com" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/blog/algoritma-nedir`,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: `${BASE_URL}/blog/algoritma-nedir`,
    },
  };
}

// Pseudo kod plain text — JSX escape yok
const PSEUDO_TEK_CIFT = `BAŞLA
  n = 0

TEKRARLA WHILE n < 11:
  EĞER n % 2 == 0 İSE:
    YAZ("çift:", n)
  DEĞİLSE:
    YAZ("tek:", n)
  n = n + 1

BİTİR`;

const PYTHON_TEK_CIFT = `for n in range(11):
    if n % 2 == 0:
        print(f"çift: {n}")
    else:
        print(f"tek: {n}")`;

const PSEUDO_BUBBLE = `FONKSİYON bubble_sort(liste):
  n = uzunluk(liste)

  DÖNGÜ i = 0 DAN n − 1 KADAR:
    DÖNGÜ j = 0 DAN n − i − 2 KADAR:
      EĞER liste[j] > liste[j+1] İSE:
        takas(liste[j], liste[j+1])

  DÖNDÜR liste

bubble_sort([5,2,8,1,4])  // → [1,2,4,5,8]`;

const PYTHON_BUBBLE = `def bubble_sort(liste):
    n = len(liste)
    for i in range(n):
        for j in range(n - i - 1):
            if liste[j] > liste[j+1]:
                liste[j], liste[j+1] = liste[j+1], liste[j]
    return liste

print(bubble_sort([5,2,8,1,4]))  # [1, 2, 4, 5, 8]`;

export default async function AlgoritmaNedirPage() {
  const post = await getPost("algoritma-nedir");
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <article className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <Link
            href="/blog"
            className="hover:text-amber-300 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Blog
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-white/70">Algoritma Nedir?</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 text-xs text-white/40 mb-4">
            <time dateTime={post.date}>{post.date}</time>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingMinutes} dakika okuma
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              Blog
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
            Algoritma Nedir?
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Bir problemi çözmek için izlenen{" "}
            <strong className="text-white">sonlu, sıralı, kesin adımlar bütünü</strong>.
            Kod yazmadan önce, sandviç yaparken bile farkında olmadan algoritma kuruyoruz.
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {post.tags.map((tag) => (
              <mark
                key={tag}
                className="px-2.5 py-0.5 text-xs rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300"
              >
                {tag}
              </mark>
            ))}
          </div>
        </header>

        {/* ── SECTION 01: SANDVİÇ ────────────────────────── */}
        <section className="mb-16">
          <SectionHeader num="01" title="Reel Hayattan Bir Örnek: Sandviç Yapmak" />
          <p className="text-white/70 leading-relaxed mb-4">
            Bir arkadaşınız daha önce mutfak görmedi ve sizden &ldquo;sandviç yap&rdquo;
            istedi. Ona tarif verirken aslında bir{" "}
            <strong className="text-white">algoritma</strong> yazıyorsunuz — adımlar
            sıralı, her adım net, sonuç belirli.
          </p>

          <div className="my-8 p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="text-[10px] font-bold tracking-widest text-amber-300 uppercase mb-4">
              Tarif (algoritma adımları)
            </div>
            <ol className="space-y-2 text-white/70 text-[15px] leading-relaxed">
              <li>1. Ekmeği tezgâha koy</li>
              <li>2. Marulu yıka, iki yaprak ayır</li>
              <li>3. Domatesi yuvarlak dilimle</li>
              <li>4. Peyniri ekmeğin üstüne koy</li>
              <li>5. Domates dilimini peynirin üstüne yerleştir</li>
              <li>6. Marul yapraklarını ekle</li>
              <li>7. Salam dilimlerini marulun üstüne diz</li>
              <li>8. İkinci ekmeği kapat</li>
              <li>9. Sandviçi ikiye böl</li>
            </ol>
          </div>

          <div className="my-10 max-w-xs mx-auto">
            <div className="rounded-xl border border-amber-700/40 bg-amber-700/15 px-4 py-3 text-center text-amber-100 text-sm font-medium">
              Ekmek (üst)
            </div>
            <SandwichLayer
              color="bg-rose-700/20 border-rose-700/40 text-rose-100"
              label="Salam"
            />
            <SandwichLayer
              color="bg-emerald-700/20 border-emerald-700/40 text-emerald-100"
              label="Marul"
            />
            <SandwichLayer
              color="bg-red-700/20 border-red-700/40 text-red-100"
              label="Domates"
            />
            <SandwichLayer
              color="bg-amber-500/20 border-amber-500/40 text-amber-100"
              label="Peynir"
            />
            <div className="rounded-xl border border-amber-700/40 bg-amber-700/15 px-4 py-3 text-center text-amber-100 text-sm font-medium">
              Ekmek (alt)
            </div>
          </div>

          <p className="text-white/70 leading-relaxed">
            Bu adımları <strong className="text-white">sırasıyla</strong>{" "}
            uyguladığınızda sonuç <em>her zaman</em> aynıdır. Adımları karıştırırsanız
            (peyniri altta, ekmeği ortada) ya da atlarsanız (marulu unutursanız) farklı
            sonuç çıkar. Bir bilgisayar da kodunuzdaki adımları aynı şekilde takip eder
            — sırası, kesinliği ve sonuçluluğu önemlidir.
          </p>
        </section>

        {/* ── SECTION 02: TEK-ÇİFT ───────────────────────── */}
        <section className="mb-16">
          <SectionHeader
            num="02"
            title="0–10 Arası Sayıları Tek / Çift Sınıflandır"
          />
          <p className="text-white/70 leading-relaxed mb-6">
            Basit bir algoritma: 0&apos;dan 10&apos;a kadar her sayıyı al, 2&apos;ye
            bölümünden kalan 0 mı diye bak. Kalan 0 ise çift, değilse tek.
          </p>

          <FlowChartCard label="Akış Şeması (Flowchart)">
            <FlowNode variant="start" label="BAŞLA" />
            <FlowArrow />
            <FlowNode label="n = 0" />
            <FlowArrow />
            <FlowNode variant="decision" label="n < 11 ?" />
            <FlowBranch>
              <FlowBranchLabel side="yes" />
              <FlowNode variant="decision" label="n % 2 == 0 ?" />
              <FlowBranch>
                <FlowBranchLabel side="yes" color="amber" />
                <FlowNode label={'YAZ "çift: n"'} />
              </FlowBranch>
              <FlowBranch>
                <FlowBranchLabel side="no" color="amber" />
                <FlowNode label={'YAZ "tek: n"'} />
              </FlowBranch>
              <FlowArrow />
              <FlowNode label="n = n + 1" />
              <FlowLoopBack />
            </FlowBranch>
            <FlowBranch>
              <FlowBranchLabel side="no" />
              <FlowNode variant="io" label="n = 11 → ÇIK" />
            </FlowBranch>
            <FlowArrow />
            <FlowNode variant="end" label="BİTİR" />
          </FlowChartCard>

          <h3 className="text-lg font-semibold text-white mt-10 mb-3">Pseudo Kod</h3>
          <CodeBlock>{PSEUDO_TEK_CIFT}</CodeBlock>

          <h3 className="text-lg font-semibold text-white mt-8 mb-3">Python Karşılığı</h3>
          <CodeBlock language="python">{PYTHON_TEK_CIFT}</CodeBlock>
        </section>

        {/* ── SECTION 03: BUBBLE SORT ────────────────────── */}
        <section className="mb-16">
          <SectionHeader num="03" title="Bubble Sort ile Listeyi Sırala" />
          <p className="text-white/70 leading-relaxed mb-6">
            Elimizde{" "}
            <code className="text-amber-300 px-1.5 py-0.5 rounded bg-white/5">
              [5, 2, 8, 1, 4]
            </code>{" "}
            listesi var. Her adımda yan yana iki elemanı karşılaştır, soldaki büyükse
            yer değiştir. Liste tamamen sıralanana kadar devam et.
          </p>

          <FlowChartCard label="Bubble Sort Akış Şeması">
            <FlowNode variant="start" label="BAŞLA · liste = [5,2,8,1,4]" />
            <FlowArrow />
            <FlowNode label="n = uzunluk(liste)" />
            <FlowArrow />
            <FlowNode label="i = 0" />
            <FlowArrow />
            <FlowNode variant="decision" label="i < n − 1 ?" />
            <FlowBranch>
              <FlowBranchLabel side="yes" />
              <FlowNode label="j = 0" />
              <FlowArrow />
              <FlowNode variant="decision" label="j < n − i − 1 ?" />
              <FlowBranch>
                <FlowBranchLabel side="yes" />
                <FlowNode
                  variant="decision"
                  label="liste[j] > liste[j+1] ?"
                />
                <FlowBranch>
                  <FlowBranchLabel side="yes" color="amber" />
                  <FlowNode label="takas(liste[j], liste[j+1])" />
                </FlowBranch>
                <FlowBranch>
                  <FlowBranchLabel side="no" color="amber" />
                  <FlowNode label="— (hiçbir şey yapma)" />
                </FlowBranch>
                <FlowArrow />
                <FlowNode label="j = j + 1" />
                <FlowLoopBack />
              </FlowBranch>
              <FlowBranch>
                <FlowBranchLabel side="no" />
                <FlowNode label="i = i + 1" />
                <FlowLoopBack />
              </FlowBranch>
            </FlowBranch>
            <FlowBranch>
              <FlowBranchLabel side="no" />
              <FlowNode variant="io" label="liste sıralı → ÇIK" />
            </FlowBranch>
            <FlowArrow />
            <FlowNode variant="end" label="BİTİR" />
          </FlowChartCard>

          <h3 className="text-lg font-semibold text-white mt-10 mb-3">
            Adım Adım Çalışma
          </h3>
          <div className="my-6 p-5 rounded-2xl border border-white/10 bg-white/[0.02] overflow-x-auto">
            <SortStep label="başlangıç">
              <Cell>5</Cell>
              <Cell>2</Cell>
              <Cell>8</Cell>
              <Cell>1</Cell>
              <Cell>4</Cell>
            </SortStep>
            <SortStep label="i=0, j=0">
              <Cell variant="compare">5</Cell>
              <Cell variant="compare">2</Cell>
              <Cell>8</Cell>
              <Cell>1</Cell>
              <Cell>4</Cell>
              <Note color="amber">5&gt;2 → takas</Note>
            </SortStep>
            <SortStep label="i=0, j=1">
              <Cell>2</Cell>
              <Cell variant="compare">5</Cell>
              <Cell variant="compare">8</Cell>
              <Cell>1</Cell>
              <Cell>4</Cell>
              <Note>5&lt;8 → geç</Note>
            </SortStep>
            <SortStep label="i=0, j=2">
              <Cell>2</Cell>
              <Cell>5</Cell>
              <Cell variant="compare">8</Cell>
              <Cell variant="compare">1</Cell>
              <Cell>4</Cell>
              <Note color="amber">8&gt;1 → takas</Note>
            </SortStep>
            <SortStep label="i=0, j=3">
              <Cell>2</Cell>
              <Cell>5</Cell>
              <Cell>1</Cell>
              <Cell variant="compare">8</Cell>
              <Cell variant="compare">4</Cell>
              <Note color="amber">8&gt;4 → takas</Note>
            </SortStep>
            <SortStep label="i=0 sonu">
              <Cell>2</Cell>
              <Cell>5</Cell>
              <Cell>1</Cell>
              <Cell>4</Cell>
              <Cell variant="done">8</Cell>
            </SortStep>
            <SortStep label="i=1, j=2">
              <Cell>2</Cell>
              <Cell variant="compare">5</Cell>
              <Cell variant="compare">1</Cell>
              <Cell variant="done">4</Cell>
              <Cell variant="done">8</Cell>
              <Note color="amber">5&gt;1 → takas</Note>
            </SortStep>
            <SortStep label="i=2 sonu">
              <Cell>2</Cell>
              <Cell>1</Cell>
              <Cell variant="done">4</Cell>
              <Cell variant="done">5</Cell>
              <Cell variant="done">8</Cell>
            </SortStep>
            <SortStep label="i=3 sonu">
              <Cell>1</Cell>
              <Cell variant="done">2</Cell>
              <Cell variant="done">4</Cell>
              <Cell variant="done">5</Cell>
              <Cell variant="done">8</Cell>
            </SortStep>
            <SortStep label="sonuç" last>
              <Cell variant="done">1</Cell>
              <Cell variant="done">2</Cell>
              <Cell variant="done">4</Cell>
              <Cell variant="done">5</Cell>
              <Cell variant="done">8</Cell>
            </SortStep>
          </div>

          <h3 className="text-lg font-semibold text-white mt-8 mb-3">Pseudo Kod</h3>
          <CodeBlock>{PSEUDO_BUBBLE}</CodeBlock>

          <h3 className="text-lg font-semibold text-white mt-8 mb-3">
            Python Karşılığı
          </h3>
          <CodeBlock language="python">{PYTHON_BUBBLE}</CodeBlock>
        </section>

        {/* ── SECTION 04: NEDEN ÖNEMLİ ──────────────────── */}
        <section className="mb-16">
          <SectionHeader num="04" title="Algoritma Neden Önemli?" />
          <p className="text-white/70 leading-relaxed mb-6">
            Bilgisayar ne kadar hızlı olursa olsun, kötü bir algoritma sonsuza
            kadar bekletebilir. İyi bir algoritma ise milyonlarca veriyi saniyeler
            içinde işler. Sıralama örneğinde fark çok net:
          </p>

          <ul className="space-y-3">
            {[
              {
                n: 1,
                title: "Performans — Doğru Algoritma Zaman Kazandırır",
                body: "10.000 öğrenciyi sıralamak: Bubble sort ~5 saniye, Merge sort ~0.05 saniye. Aynı işlem, 100 kat fark.",
              },
              {
                n: 2,
                title: "Ölçeklenebilirlik — Büyük Veri İçin Tek Çıkış",
                body: "100 müşteriyle çalışan brute force, 100 milyon müşteriyle patlar. İyi algoritma, veri 1000 kat büyüse bile çalışmaya devam eder.",
              },
              {
                n: 3,
                title: "Problem Çözme Disiplini",
                body: "Kod yazmadan önce düşünmeyi öğretir. Problemi parçalara ayırır, her parçayı sırayla çözersin. Bu disiplin sadece yazılımda değil, hayatta da işe yarar.",
              },
              {
                n: 4,
                title: "Mülakat ve Kariyer",
                body: "Yazılım mülakatlarının %60'ı algoritma sorusudur. Mülakatı geçmek için değil, gerçek mühendislik problemlerini çözmek için algoritmik düşünme şart.",
              },
              {
                n: 5,
                title: "Dil ve Platformdan Bağımsız",
                body: "Bir algoritmayı Python'da da yazsan, JavaScript'te de, Rust'ta da aynı mantık çalışır. Algoritma düşünmek, her dilde geçerli bir süper güçtür.",
              },
            ].map((r) => (
              <li
                key={r.n}
                className="flex gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02]"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center font-bold flex-shrink-0">
                  {r.n}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold mb-1">{r.title}</h4>
                  <p className="text-sm text-white/60 leading-relaxed">{r.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ── SECTION 05: SONUÇ ─────────────────────────── */}
        <section>
          <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-500/15 to-amber-700/10 border border-amber-500/20">
            <SectionHeader num="05" title="Sonuç — Kanaat" variant="highlight" />
            <p className="text-white/80 leading-relaxed mb-4">
              Algoritma, yazılımın{" "}
              <strong className="text-white">ne yapacağını</strong> söyleyen
              reçetedir. Kod ise o reçetenin yazıldığı{" "}
              <em className="text-amber-200">bir dil</em>. Dili öğrenmek kolaydır —
              reçete yazmak yıllar alır.
            </p>
            <p className="text-white/80 leading-relaxed mb-4">
              Bugün iki basit örnek gördük:{" "}
              <strong className="text-amber-200">tek-çift ayrımı</strong>{" "}
              (döngü + karar yapısı) ve{" "}
              <strong className="text-amber-200">bubble sort</strong>{" "}
              (iç içe döngü + yer değiştirme). Bu ikisi, yazılım dünyasındaki{" "}
              <em>her algoritmanın</em> yapı taşı.
            </p>
            <p className="text-white/80 leading-relaxed">
              Bir sonraki adım: Bu örnekleri kendi elinle yaz, akış şemasını
              kâğıda çiz, adımları sayarak yürü.{" "}
              <strong className="text-amber-200">Algoritma düşünmek</strong> bir
              kas gibi — her gün biraz çalışırsan, bir gün gelir mülakatlarda,
              projelerinde, hayatın içinde kendiliğinden devreye girer.
            </p>
          </div>
        </section>

        {/* CTA: blog liste donus */}
        <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between flex-wrap gap-3">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tüm yazılar
          </Link>
          <Link
            href="/interviews"
            className="inline-flex items-center gap-2 text-sm text-amber-300 hover:text-amber-200 transition-colors"
          >
            Hemen pratik yap
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </article>
    </main>
  );
}

// ── Sub-components ──────────────────────────────────────

function SectionHeader({
  num,
  title,
  variant = "default",
}: {
  num: string;
  title: string;
  variant?: "default" | "highlight";
}) {
  return (
    <h2 className="flex items-baseline gap-3 text-2xl md:text-3xl font-bold tracking-tight mb-5">
      <span
        className={`text-sm font-semibold tracking-wider ${
          variant === "highlight" ? "text-amber-200" : "text-amber-300"
        }`}
      >
        {num}
      </span>
      <span className="text-white">{title}</span>
    </h2>
  );
}

function SandwichLayer({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div
      className={`px-4 py-3 text-center text-sm font-medium border-t-0 ${color}`}
    >
      {label}
    </div>
  );
}

function FlowChartCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-8 p-6 rounded-2xl border border-white/10 bg-white/[0.02] overflow-x-auto">
      <div className="text-[10px] font-bold tracking-widest text-amber-300 uppercase mb-6">
        {label}
      </div>
      <div className="flex flex-col items-center min-w-fit">{children}</div>
    </div>
  );
}

function FlowNode({
  label,
  variant = "action",
}: {
  label: React.ReactNode;
  variant?: "start" | "end" | "action" | "decision" | "io";
}) {
  const base =
    "inline-flex items-center justify-center px-5 py-2.5 text-[13px] font-medium border-2 min-w-[140px] text-center";
  const styles = {
    start: "rounded-xl border-amber-500/60 bg-amber-500/10 text-amber-200",
    end: "rounded-xl border-emerald-500/60 bg-emerald-500/10 text-emerald-200",
    action: "rounded-lg border-white/20 bg-white/[0.04] text-white",
    decision:
      "rounded-full border-amber-400/60 bg-amber-500/10 text-amber-200 font-semibold px-6 py-3",
    io: "rounded-lg border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  } as const;
  return <div className={`${base} ${styles[variant]}`}>{label}</div>;
}

function FlowArrow() {
  return <ArrowDown className="w-4 h-4 text-white/30 my-1.5" />;
}

function FlowBranch({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col items-center w-full">{children}</div>;
}

function FlowBranchLabel({
  side,
  color = "white",
}: {
  side: "yes" | "no";
  color?: "white" | "amber";
}) {
  const label = side === "yes" ? "Evet" : "Hayır";
  const cls = color === "amber" ? "text-amber-300" : "text-white/50";
  return (
    <div className="flex items-center gap-1.5 mb-1">
      <span
        className={`text-[10px] font-semibold uppercase tracking-wider ${cls}`}
      >
        {label}
      </span>
      <ArrowDown className="w-3 h-3 text-white/20" />
    </div>
  );
}

function FlowLoopBack() {
  return (
    <div className="flex items-center gap-1.5 my-1.5 text-[10px] text-white/40">
      <span>↑ döngü başına</span>
    </div>
  );
}

function CodeBlock({
  children,
  language,
}: {
  children: string;
  language?: string;
}) {
  return (
    <pre className="my-4 px-5 py-4 rounded-xl bg-[#0a0e1a] border border-white/10 overflow-x-auto text-[13px] leading-[1.75] font-mono text-white/90">
      {language && (
        <div className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-2 font-sans">
          {language}
        </div>
      )}
      <code>{children}</code>
    </pre>
  );
}

function SortStep({
  label,
  children,
  last,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 py-3 font-mono text-[12px] ${
        last ? "" : "border-b border-dashed border-white/5"
      }`}
    >
      <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider min-w-[80px] font-sans">
        {label}
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">{children}</div>
    </div>
  );
}

function Cell({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "compare" | "swap" | "done";
}) {
  const base =
    "inline-flex items-center justify-center w-9 h-9 rounded-md text-[13px] font-semibold";
  const styles = {
    default: "bg-white/5 border border-white/10 text-white/80",
    compare: "bg-amber-500/20 border border-amber-400/40 text-amber-100 scale-110",
    swap: "bg-yellow-500/20 border border-yellow-400/40 text-yellow-100",
    done: "bg-emerald-500/15 border border-emerald-400/30 text-emerald-200",
  } as const;
  return <div className={`${base} ${styles[variant]}`}>{children}</div>;
}

function Note({
  children,
  color = "muted",
}: {
  children: React.ReactNode;
  color?: "muted" | "amber";
}) {
  const cls = color === "amber" ? "text-amber-300" : "text-white/40";
  return (
    <div className={`text-[11px] font-sans ml-2 ${cls}`}>{children}</div>
  );
}
