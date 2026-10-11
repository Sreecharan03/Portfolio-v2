"use client";

import { useId, useMemo, useState, type CSSProperties } from "react";

/**
 * Ports of two agents from Agentic-RAG/agents.py:
 *  - QueryUnderstandingAgent.run   (subject keyword scoring, question type, rewrite)
 *  - VerificationAgent.run          (weighted confidence and verdict)
 */
const SUBJECT_KEYWORDS: Record<string, string[]> = {
  DBMS: ["database", "sql", "table", "query", "normalization", "transaction", "dbms", "relation", "schema", "index", "join", "primary key", "foreign key", "acid"],
  ML: [
    "machine learning",
    "model",
    "training",
    "algorithm",
    "neural network",
    "classification",
    "regression",
    "feature",
    "dataset",
    "accuracy",
    "overfitting",
    "gradient",
    "python",
    "supervised",
    "unsupervised",
    "clustering",
    "decision tree",
  ],
  OS: [
    "operating system",
    "process",
    "thread",
    "memory",
    "scheduling",
    "deadlock",
    "semaphore",
    "kernel",
    "cpu",
    "paging",
    "segmentation",
    "file system",
    "interrupt",
    "virtual memory",
    "mutex",
    "concurrency",
    "ipc",
  ],
};

const QUESTION_TYPES: [string, string[]][] = [
  ["definition", ["what is", "define", "what are", "meaning of"]],
  ["explanation", ["explain", "how does", "describe", "elaborate"]],
  ["comparison", ["difference between", "compare", "vs", "versus"]],
  ["example", ["example", "give an example", "illustrate"]],
  ["procedure", ["how to", "steps", "process of", "procedure"]],
  ["reason", ["why", "reason", "cause", "purpose of"]],
];

function understand(query: string) {
  const q = query.toLowerCase();
  const scores = Object.entries(SUBJECT_KEYWORDS).map(([subject, kws]) => ({
    subject,
    score: kws.filter((kw) => q.includes(kw)).length,
    hits: kws.filter((kw) => q.includes(kw)),
  }));
  // Python's max() keeps the first maximum in dict order
  let best = scores[0];
  for (const s of scores) if (best && s.score > best.score) best = s;
  const subject = best && best.score > 0 ? best.subject : "ALL";
  const type = QUESTION_TYPES.find(([, pats]) => pats.some((p) => q.includes(p)))?.[0] ?? "general";
  const rewritten = subject !== "ALL" ? `${subject} concept: ${query}` : query;
  return { scores, subject, type, rewritten };
}

function verify(retrieval: number, overlap: number, refusal: boolean) {
  const content = refusal ? 0 : 1;
  const confidence = Math.round((retrieval * 0.4 + overlap * 0.4 + content * 0.2) * 1000) / 1000;
  const verdict =
    confidence >= 0.7 ? "HIGH_CONFIDENCE" : confidence >= 0.5 ? "MEDIUM_CONFIDENCE" : refusal ? "NOT_FOUND" : "LOW_CONFIDENCE";
  return { confidence, verdict };
}

const EXAMPLES = [
  "What is normalization in a database?",
  "Explain gradient descent for training a model",
  "Difference between a process and a thread",
  "Why does deadlock happen?",
];

function Slider({
  id,
  label,
  value,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[0.9rem] text-ink">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-[0.85rem] text-ink-2 tabular">
          {value.toFixed(2)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-1"
        style={{ "--range-pct": `${value * 100}%` } as CSSProperties}
      />
      <p className="text-[0.78rem] text-ink-3">{hint}</p>
    </div>
  );
}

export function RagLab() {
  const id = useId();
  const [query, setQuery] = useState(EXAMPLES[0] ?? "");
  const [retrieval, setRetrieval] = useState(0.78);
  const [overlap, setOverlap] = useState(0.64);
  const [refusal, setRefusal] = useState(false);

  const u = useMemo(() => understand(query), [query]);
  const v = useMemo(() => verify(retrieval, overlap, refusal), [retrieval, overlap, refusal]);
  const maxScore = Math.max(1, ...u.scores.map((s) => s.score));
  const verdictTone = v.verdict.startsWith("HIGH") ? "text-verify-soft" : v.verdict.startsWith("MEDIUM") ? "text-signal-soft" : "text-warn";

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section aria-labelledby={`${id}-a1`} className="rounded-[var(--radius)] border border-line bg-surface-1 p-5">
        <p className="label-mono text-ink-3">Agent 1 · QueryUnderstandingAgent</p>
        <h4 id={`${id}-a1`} className="mt-2 text-step-1 font-medium">
          Route and rewrite
        </h4>
        <label htmlFor={`${id}-q`} className="sr-only">
          Question
        </label>
        <input
          id={`${id}-q`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-4 w-full rounded-[10px] border border-line bg-bg px-4 py-3 text-[0.95rem] text-ink outline-none transition-colors focus:border-signal/60"
          placeholder="Ask a DBMS, ML or OS question"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setQuery(ex)}
              className="min-h-8 rounded-full border border-line px-3 text-[0.76rem] text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
            >
              {ex}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-2" aria-live="polite">
          {u.scores.map((s) => (
            <div key={s.subject} className="grid grid-cols-[3.2rem_1fr_auto] items-center gap-3">
              <span className={`font-mono text-[0.78rem] ${u.subject === s.subject ? "text-verify-soft" : "text-ink-3"}`}>{s.subject}</span>
              <span className="h-2 overflow-hidden rounded-full bg-line">
                <span
                  className={`block h-full rounded-full transition-[width] duration-500 ease-out-expo ${u.subject === s.subject ? "bg-verify" : "bg-line-strong"}`}
                  style={{ width: `${(s.score / maxScore) * 100}%` }}
                />
              </span>
              <span className="font-mono text-[0.78rem] text-ink-2 tabular">{s.score}</span>
            </div>
          ))}
          <dl className="mt-4 grid gap-2 text-[0.88rem]">
            <div className="flex flex-wrap gap-x-3">
              <dt className="text-ink-3">Subject</dt>
              <dd className="font-mono text-ink">{u.subject === "ALL" ? "ALL (no keywords matched)" : u.subject}</dd>
            </div>
            <div className="flex flex-wrap gap-x-3">
              <dt className="text-ink-3">Question type</dt>
              <dd className="font-mono text-ink">{u.type}</dd>
            </div>
            <div>
              <dt className="text-ink-3">Rewritten query</dt>
              <dd className="mt-1 break-words rounded-[8px] bg-bg px-3 py-2 font-mono text-[0.82rem] text-signal-soft">{u.rewritten || "—"}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section aria-labelledby={`${id}-a4`} className="rounded-[var(--radius)] border border-line bg-surface-1 p-5">
        <p className="label-mono text-ink-3">Agent 4 · VerificationAgent</p>
        <h4 id={`${id}-a4`} className="mt-2 text-step-1 font-medium">
          Score the answer
        </h4>
        <div className="mt-5 space-y-5">
          <Slider id={`${id}-r`} label="Mean retrieval score" value={retrieval} onChange={setRetrieval} hint="Average similarity of the five retrieved chunks." />
          <Slider id={`${id}-o`} label="Answer–context overlap" value={overlap} onChange={setOverlap} hint="Share of answer words found in the chunks, minus stop words." />
          <label className="flex cursor-pointer items-center gap-3 text-[0.9rem]">
            <input type="checkbox" checked={refusal} onChange={(e) => setRefusal(e.target.checked)} className="size-4 accent-[var(--color-warn)]" />
            The answer is a refusal (“could not find…”)
          </label>
        </div>
        <div className="mt-6 rounded-[10px] border border-line bg-bg p-4" aria-live="polite">
          <p className="font-mono text-[0.78rem] text-ink-3">
            0.4 × {retrieval.toFixed(2)} + 0.4 × {overlap.toFixed(2)} + 0.2 × {refusal ? "0" : "1"}
          </p>
          <div className="mt-2 flex items-baseline justify-between gap-4">
            <p className="font-display text-step-3 tabular">{v.confidence.toFixed(3)}</p>
            <p className={`font-mono text-[0.8rem] tracking-[0.06em] ${verdictTone}`}>{v.verdict}</p>
          </div>
          <div className="relative mt-3 h-2 rounded-full bg-line">
            <span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-signal to-verify transition-[width] duration-500 ease-out-expo" style={{ width: `${v.confidence * 100}%` }} />
            <span aria-hidden className="absolute -top-1 bottom-[-4px] left-1/2 w-px bg-ink-3" />
            <span aria-hidden className="absolute -top-1 bottom-[-4px] left-[70%] w-px bg-ink-2" />
          </div>
          <div aria-hidden className="relative mt-1 h-4 font-mono text-[0.68rem] text-ink-3">
            <span className="absolute left-1/2 -translate-x-1/2">0.5</span>
            <span className="absolute left-[70%] -translate-x-1/2">0.7</span>
          </div>
        </div>
      </section>
    </div>
  );
}
