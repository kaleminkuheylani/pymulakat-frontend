"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { getMyAttempts } from "@/lib/api/authAPI";
import type { ApiQuestion, ApiAttemptResponse } from "@/lib/api/types";

interface Props {
  questions: ApiQuestion[];
}

interface SkillStats {
  label: string;
  total: number;
  solved: number;
  attempted: number;
  avgPass: number;
}

// Canonical skill buckets. Language (Python/JS) split is intentionally avoided.
const SKILL_KEYWORDS: Record<string, string[]> = {
  strings: [
    "string",
    "slicing",
    "split",
    "regex",
    "casefold",
    "normalize",
    "palindrome",
    "anagram",
    "string temizleme",
    "string normalization",
    "substring",
    "concat",
    "format",
    "f-string",
  ],
  functions: [
    "function",
    "fonksiyon",
    "lambda",
    "def",
    "parametre",
    "arg",
    "kwarg",
    "recursive",
    "recursion",
    "özyineleme",
    "base case",
  ],
  "if-else": [
    "if",
    "else",
    "elif",
    "koşullu",
    "kontrol yapıları",
    "condition",
    "ternary",
  ],
  loops: [
    "loop",
    "loops",
    "for",
    "while",
    "döngü",
    "iteration",
    "iterasyon",
    "enumerate",
    "range",
  ],
  lists: [
    "list",
    "liste",
    "array",
    "dizi",
    "in-place swap",
    "reversed",
    "slicing",
    "comprehension",
    "nested list",
  ],
  dictionaries: [
    "dict",
    "dictionary",
    "sözlük",
    "counter",
    "defaultdict",
    "collections",
    "hashmap",
    "hash table",
    "key-value",
  ],
  math: [
    "math",
    "matematik",
    "modulo",
    "asal",
    "prime",
    "eratosthenes",
    "öklid",
    "gcd",
    "ebob",
    "factorial",
    "fibonacci",
    "numeric",
    "sayı",
    "arithmetic",
    "kümülatif",
    "accumulate",
    "sum",
  ],
  algorithms: [
    "algorithm",
    "algoritma",
    "binary search",
    "ikili arama",
    "dynamic programming",
    "dinamik programlama",
    "greedy",
    "divide and conquer",
    "two pointers",
    "sliding window",
    "kayan pencere",
    "memoization",
  ],
  sorting: [
    "sort",
    "sıralama",
    "merge sort",
    "quick sort",
    "heap sort",
    "bubble sort",
    "sorted",
    "ordering",
  ],
  "data-structures": [
    "stack",
    "queue",
    "deque",
    "heap",
    "linked list",
    "tree",
    "binary tree",
    "graph",
    "veri yapısı",
    "data structure",
    "dfs",
    "bfs",
  ],
  files: ["file", "dosya", "csv", "json", "with", "io", "read", "write"],
  oop: [
    "class",
    "object",
    "oop",
    "inheritance",
    "encapsulation",
    "polymorphism",
    "nesne",
    "init",
    "self",
  ],
  "error-handling": ["exception", "try", "except", "error", "hata", "raise"],
  sets: ["set", "küme", "intersection", "union", "difference", "subset"],
  tuples: ["tuple", "demet"],
};

function normalizeConceptToSkills(concept: string): string[] {
  const c = concept.toLowerCase().trim();
  const matched: string[] = [];
  for (const [skill, keywords] of Object.entries(SKILL_KEYWORDS)) {
    if (keywords.some((kw) => c.includes(kw.toLowerCase()))) {
      matched.push(skill);
    }
  }
  if (matched.length === 0) {
    matched.push(c);
  }
  return matched;
}

function computeStats(questions: ApiQuestion[], attempts: ApiAttemptResponse[]): SkillStats[] {
  const questionById = new Map<number, ApiQuestion>();
  for (const q of questions) {
    questionById.set(q.id, q);
  }

  const skillTotals = new Map<string, Set<number>>();
  const questionSkills = new Map<number, Set<string>>();

  for (const q of questions) {
    const qSkillSet = new Set<string>();
    questionSkills.set(q.id, qSkillSet);
    for (const concept of q.related_concepts || []) {
      for (const skill of normalizeConceptToSkills(concept)) {
        qSkillSet.add(skill);
        const set = skillTotals.get(skill) ?? new Set<number>();
        set.add(q.id);
        skillTotals.set(skill, set);
      }
    }
  }

  const skillSolved = new Map<string, Set<number>>();
  const skillAttempted = new Map<string, Set<number>>();
  const skillPassSum = new Map<string, number>();
  const skillPassCount = new Map<string, number>();

  for (const a of attempts) {
    const q = questionById.get(a.question_id);
    if (!q) continue;

    const skills = questionSkills.get(q.id);
    if (!skills || skills.size === 0) continue;

    const pass = a.total_tests > 0 ? a.passed_tests / a.total_tests : a.success ? 1 : 0;
    for (const skill of skills) {
      skillPassSum.set(skill, (skillPassSum.get(skill) || 0) + pass);
      skillPassCount.set(skill, (skillPassCount.get(skill) || 0) + 1);

      const attSet = skillAttempted.get(skill) ?? new Set<number>();
      attSet.add(a.question_id);
      skillAttempted.set(skill, attSet);

      if (a.success) {
        const solSet = skillSolved.get(skill) ?? new Set<number>();
        solSet.add(a.question_id);
        skillSolved.set(skill, solSet);
      }
    }
  }

  const stats: SkillStats[] = [];
  for (const [skill, ids] of skillTotals.entries()) {
    const total = ids.size;
    const solved = skillSolved.get(skill)?.size ?? 0;
    const attempted = skillAttempted.get(skill)?.size ?? 0;
    const passCount = skillPassCount.get(skill) || 0;
    const avgPass = passCount > 0 ? (skillPassSum.get(skill) || 0) / passCount : 0;
    stats.push({ label: skill, total, solved, attempted, avgPass });
  }

  // Most “complete” first, then by attempted count
  stats.sort((a, b) => {
    const ra = a.total > 0 ? a.solved / a.total : 0;
    const rb = b.total > 0 ? b.solved / b.total : 0;
    if (rb !== ra) return rb - ra;
    return b.attempted - a.attempted;
  });

  return stats;
}

export default function SkillProgress({ questions }: Props) {
  const { user, loading: userLoading } = useUser();
  const [attempts, setAttempts] = useState<ApiAttemptResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getMyAttempts(1000)
      .then((data) => {
        if (!cancelled) {
          setAttempts(data);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError("Denemeler alınamadı.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const stats = useMemo(() => {
    return computeStats(questions, attempts || []);
  }, [questions, attempts]);

  if (userLoading || loading) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-6 animate-pulse">
        <div className="h-6 w-1/3 bg-white/10 rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-white/5 rounded" />
          ))}
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 md:p-6">
        <h2 className="text-lg font-bold mb-2">Yetenek İlerlemen</h2>
        <p className="text-sm text-white/70">
          İlerlemeni görmek için giriş yap. Çözdüğün soruların konseptlerine göre
          başarı ortalaman ve tamamlama oranları burada listelenecek.
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 md:p-6 text-sm text-white/70">
        {error}
      </section>
    );
  }

  if (stats.length === 0) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-6">
        <h2 className="text-lg font-bold mb-2">Yetenek İlerlemen</h2>
        <p className="text-sm text-white/70">
          Henüz kavram bazlı ilerleme verisi yok. Soruları çözdükçe bu alan dolacak.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg md:text-xl font-bold">Yetenek İlerlemen</h2>
          <p className="text-xs text-white/50 mt-1">
            Çözdüğün soruların {stats.length} farklı kavramdaki başarı ortalaması.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {stats.map((s) => {
          const pct = s.total > 0 ? Math.round((s.solved / s.total) * 100) : 0;
          const avgPct = Math.round(s.avgPass * 100);
          return (
            <div
              key={s.label}
              className="rounded-xl border border-white/5 p-3 md:p-4 bg-white/[0.02] hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold capitalize">{s.label.replace(/-/g, " ")}</span>
                <span className="text-xs text-white/50">
                  {s.solved}/{s.total} çözüldü · ort % {avgPct}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-amber-500"
                  style={{ width: `${pct}%` }}
                  aria-label={`%${pct}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
