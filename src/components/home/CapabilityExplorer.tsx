"use client";

import Link from "next/link";
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { capabilities, type Capability } from "@/content/capabilities";

/** Capabilities ↔ evidence as a small bipartite graph, plus an accessible tab panel. */
export function CapabilityExplorer() {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();

  const entities = useMemo(() => {
    const seen = new Map<string, { label: string; slug?: string }>();
    for (const c of capabilities) for (const e of c.evidence) if (!seen.has(e.label)) seen.set(e.label, e);
    return [...seen.values()];
  }, []);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % capabilities.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + capabilities.length) % capabilities.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = capabilities.length - 1;
    else return;
    e.preventDefault();
    setSelected(next);
    tabRefs.current[next]?.focus();
  };

  const current = capabilities[selected] ?? capabilities[0];
  if (!current) return null;

  return (
    <>
      {/* Desktop: tabs + graph */}
      <div className="hidden gap-8 lg:grid lg:grid-cols-12">
        <div role="tablist" aria-orientation="vertical" aria-label="Capabilities" className="lg:col-span-5">
          {capabilities.map((c, i) => {
            const on = i === selected;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`${uid}-tab-${c.id}`}
                aria-selected={on}
                aria-controls={`${uid}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => setSelected(i)}
                onKeyDown={(e) => onKey(e, i)}
                className={`group relative flex w-full items-baseline gap-5 border-t border-line py-5 text-left transition-colors duration-300 last:border-b ${
                  on ? "text-ink" : "text-ink-3 hover:text-ink-2"
                }`}
              >
                <span className={`font-mono text-[0.75rem] ${on ? "text-signal-soft" : ""}`}>0{i + 1}</span>
                <span className="font-display text-step-2">{c.title}</span>
                <span
                  aria-hidden
                  className={`absolute left-0 top-[-1px] h-px bg-signal transition-[width] duration-700 ease-out-expo ${on ? "w-full" : "w-0"}`}
                />
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${uid}-panel`}
          aria-labelledby={`${uid}-tab-${current.id}`}
          className="rounded-[18px] border border-line bg-surface-1/70 p-8 lg:col-span-7"
        >
          <Graph selected={selected} entities={entities} />
          <Detail capability={current} />
        </div>
      </div>

      {/* Mobile & tablet: a simple list, no hidden interactions */}
      <ol className="grid gap-4 lg:hidden">
        {capabilities.map((c, i) => (
          <li key={c.id} className="rounded-[var(--radius)] border border-line bg-surface-1/60 p-5">
            <p className="font-mono text-[0.75rem] text-signal-soft">0{i + 1}</p>
            <h3 className="font-display mt-2 text-step-2">{c.title}</h3>
            <Detail capability={c} compact />
          </li>
        ))}
      </ol>
    </>
  );
}

function Detail({ capability, compact = false }: { capability: Capability; compact?: boolean }) {
  return (
    <div className={compact ? "mt-3" : "mt-8"}>
      <p className="max-w-[56ch] text-ink-2">{capability.summary}</p>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tools">
        {capability.tools.map((t) => (
          <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[0.72rem] text-ink-2">
            {t}
          </li>
        ))}
      </ul>
      <p className="label-mono mt-7 text-ink-3">Proven in</p>
      <ul className="mt-3 divide-y divide-line border-y border-line">
        {capability.evidence.map((e) => (
          <li key={e.label} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            {e.slug ? (
              <Link href={`/work/${e.slug}`} className="link-underline font-medium text-ink hover:text-signal-soft">
                {e.label}
              </Link>
            ) : (
              <a href="#journey" className="link-underline font-medium text-ink hover:text-signal-soft">
                {e.label}
              </a>
            )}
            <span className="text-[0.84rem] text-ink-3 sm:text-right">{e.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SHORT: Record<string, string> = {
  "Multi-Agent Financial Analytics": "Financial agents",
  "Agentic RAG Study Assistant": "Agentic RAG",
  "Legal Document Summarization": "Legal summarization",
  "Adaptive Traffic Signal Control": "Traffic control",
};

function Graph({ selected, entities }: { selected: number; entities: { label: string }[] }) {
  const Wd = 640;
  const Ht = 230;
  const ly = (i: number, n: number) => 20 + (i * (Ht - 40)) / Math.max(1, n - 1);
  const left = capabilities.map((c, i) => ({ id: c.id, label: c.short, x: 170, y: ly(i, capabilities.length) }));
  const right = entities.map((e, i) => ({ label: e.label, x: 440, y: ly(i, entities.length) }));
  return (
    <svg viewBox={`0 0 ${Wd} ${Ht}`} className="w-full" aria-hidden focusable={false}>
      {capabilities.map((c, ci) =>
        c.evidence.map((ev) => {
          const a = left[ci];
          const b = right.find((r) => r.label === ev.label);
          if (!a || !b) return null;
          const on = ci === selected;
          return (
            <path
              key={`${c.id}-${ev.label}`}
              d={`M${a.x} ${a.y} C ${a.x + 150} ${a.y}, ${b.x - 150} ${b.y}, ${b.x} ${b.y}`}
              fill="none"
              stroke={on ? "var(--color-signal)" : "var(--color-line-strong)"}
              strokeOpacity={on ? 0.9 : 0.5}
              strokeWidth={on ? 1.6 : 1}
              style={{ transition: "stroke 400ms, stroke-opacity 400ms" }}
            />
          );
        }),
      )}
      {left.map((n, i) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={i === selected ? 5 : 3.5} fill={i === selected ? "var(--color-signal)" : "var(--color-ink-3)"} />
          <text
            x={n.x - 14}
            y={n.y + 4}
            textAnchor="end"
            fontSize="12"
            fontFamily="var(--font-geist-mono), monospace"
            fill={i === selected ? "var(--color-ink)" : "var(--color-ink-3)"}
          >
            {n.label}
          </text>
        </g>
      ))}
      {right.map((n) => {
        const lit = capabilities[selected]?.evidence.some((e) => e.label === n.label) ?? false;
        return (
          <g key={n.label}>
            <circle cx={n.x} cy={n.y} r={lit ? 5 : 3.5} fill={lit ? "var(--color-verify)" : "var(--color-ink-3)"} />
            <text
              x={n.x + 14}
              y={n.y + 4}
              fontSize="12"
              fontFamily="var(--font-geist-mono), monospace"
              fill={lit ? "var(--color-ink)" : "var(--color-ink-3)"}
            >
              {SHORT[n.label] ?? n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
