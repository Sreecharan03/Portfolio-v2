"use client";

import { useId, useMemo, useState, type CSSProperties } from "react";

/**
 * Port of TrafficSignalController from Smart-traffic-management-opencv:
 *   calculate_phase_priority, get_next_phase, get_green_time_for_phase
 * with the constants from config.py.
 */
const W = { VEHICLE_COUNT: 0.6, WAITING_TIME: 0.3, FAIRNESS: 0.1 };
const T = { MIN_GREEN: 15, MAX_GREEN: 60, FIXED_GREEN: 25 };
const SMOOTHING = 0.3;
const MIN_VEHICLES_FOR_PRIORITY = 1;
const NAMES = ["North", "East", "South", "West"] as const;

interface Approach {
  count: number;
  wait: number;
  since: number;
}

function adaptiveGreen(count: number) {
  if (count === 0) return T.MIN_GREEN;
  return T.MIN_GREEN + Math.min(count * 2, T.MAX_GREEN - T.MIN_GREEN);
}

function greenTime(count: number, baseline: boolean) {
  if (baseline) return { seconds: T.FIXED_GREEN, raw: T.FIXED_GREEN, smoothed: T.FIXED_GREEN };
  if (count === 0) return { seconds: T.MIN_GREEN, raw: T.MIN_GREEN, smoothed: T.MIN_GREEN };
  const raw = adaptiveGreen(count);
  const smoothed = Math.trunc(T.FIXED_GREEN * SMOOTHING + raw * (1 - SMOOTHING));
  return { seconds: Math.max(T.MIN_GREEN, Math.min(smoothed, T.MAX_GREEN)), raw, smoothed };
}

function decide(approaches: Approach[], current: number, baseline: boolean) {
  const priorities = approaches.map((a, i) =>
    i === current ? -1 : a.count * W.VEHICLE_COUNT + a.wait * W.WAITING_TIME + a.since * W.FAIRNESS,
  );
  let next = (current + 1) % 4;
  let reason = "Baseline period: fixed sequence.";
  if (!baseline) {
    const ranked = priorities.map((p, i) => ({ p, i })).sort((a, b) => b.p - a.p);
    const pick = ranked.find(
      ({ p, i }) => i !== current && p > 0 && (approaches[i]?.count ?? 0) >= MIN_VEHICLES_FOR_PRIORITY,
    );
    if (pick) {
      next = pick.i;
      reason = "Highest priority among approaches with at least one queued vehicle.";
    } else {
      reason = "No approach qualifies, so the fixed sequence continues.";
    }
  }
  return { priorities, next, reason, green: greenTime(approaches[next]?.count ?? 0, baseline) };
}

function Range({ id, label, value, max, unit, onChange }: { id: string; label: string; value: number; max: number; unit: string; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[0.8rem] text-ink-2">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-[0.78rem] text-ink tabular">
          {value}
          {unit}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range"
        style={{ "--range-pct": `${(value / max) * 100}%` } as CSSProperties}
      />
    </div>
  );
}

function Junction({ approaches, current, next }: { approaches: Approach[]; current: number; next: number }) {
  const zones = [
    { d: "M150 20 H210 V120 H150 Z", label: { x: 180, y: 14 }, arrow: "M180 116 V 150" },
    { d: "M240 150 H340 V210 H240 Z", label: { x: 290, y: 140 }, arrow: "M244 180 H 210" },
    { d: "M150 240 H210 V340 H150 Z", label: { x: 180, y: 356 }, arrow: "M180 244 V 210" },
    { d: "M20 150 H120 V210 H20 Z", label: { x: 70, y: 140 }, arrow: "M116 180 H 150" },
  ];
  return (
    <svg viewBox="0 0 360 360" className="mx-auto w-full max-w-[340px]" aria-hidden focusable={false}>
      <rect x="120" y="0" width="120" height="360" fill="var(--color-surface-2)" />
      <rect x="0" y="120" width="360" height="120" fill="var(--color-surface-2)" />
      <path d="M180 0 V120 M180 240 V360 M0 180 H120 M240 180 H360" stroke="var(--color-line-strong)" strokeDasharray="6 8" />
      {zones.map((z, i) => {
        const a = approaches[i];
        const intensity = Math.min(1, (a?.count ?? 0) / 20);
        const isGreen = i === current;
        const isNext = i === next;
        return (
          <g key={i}>
            <path d={z.d} fill={isNext ? "var(--color-verify)" : "var(--color-signal)"} opacity={0.08 + intensity * 0.42} />
            <path
              d={z.d}
              fill="none"
              stroke={isNext ? "var(--color-verify)" : isGreen ? "var(--color-signal-soft)" : "var(--color-line-strong)"}
              strokeWidth={isNext || isGreen ? 2 : 1}
              strokeDasharray={isGreen ? undefined : "4 4"}
            />
            <text
              x={z.label.x}
              y={z.label.y}
              textAnchor="middle"
              fontSize="12"
              fontFamily="var(--font-geist-mono), monospace"
              fill={isNext ? "var(--color-verify-soft)" : "var(--color-ink-3)"}
            >
              {NAMES[i]?.[0]} · {a?.count ?? 0}
            </text>
            {isGreen ? <path d={z.arrow} stroke="var(--color-signal-soft)" strokeWidth="3" strokeLinecap="round" /> : null}
          </g>
        );
      })}
      <circle cx="180" cy="180" r="22" fill="var(--color-bg)" stroke="var(--color-line-strong)" />
      <text x="180" y="185" textAnchor="middle" fontSize="13" fontFamily="var(--font-geist-mono), monospace" fill="var(--color-verify-soft)">
        {NAMES[next]?.[0]}
      </text>
    </svg>
  );
}

export function JunctionSandbox() {
  const id = useId();
  const [current, setCurrent] = useState(2);
  const [baseline, setBaseline] = useState(false);
  const [approaches, setApproaches] = useState<Approach[]>([
    { count: 4, wait: 20, since: 40 },
    { count: 9, wait: 32, since: 55 },
    { count: 0, wait: 0, since: 0 },
    { count: 5, wait: 15, since: 70 },
  ]);

  const result = useMemo(() => decide(approaches, current, baseline), [approaches, current, baseline]);
  const maxP = Math.max(1, ...result.priorities);

  const update = (i: number, patch: Partial<Approach>) =>
    setApproaches((prev) => prev.map((a, j) => (j === i ? { ...a, ...patch } : a)));

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.35fr]">
      <div className="flex flex-col gap-5 rounded-[var(--radius)] border border-line bg-surface-1 p-5">
        <Junction approaches={approaches} current={current} next={result.next} />
        <div aria-live="polite" className="rounded-[10px] border border-line bg-bg p-4">
          <p className="label-mono text-ink-3">Controller decision</p>
          <p className="mt-2 text-step-1">
            Next green: <span className="font-medium text-verify-soft">{NAMES[result.next]}</span> for{" "}
            <span className="font-medium tabular">{result.green.seconds} s</span>
          </p>
          <p className="mt-1 text-[0.84rem] text-ink-3">{result.reason}</p>
          {!baseline && (approaches[result.next]?.count ?? 0) > 0 ? (
            <p className="mt-3 font-mono text-[0.75rem] leading-relaxed text-ink-2">
              green = clamp(⌊0.3 × 25 + 0.7 × {result.green.raw}⌋, 15, 60) = {result.green.seconds} s
            </p>
          ) : null}
        </div>
        <fieldset>
          <legend className="label-mono text-ink-3">Currently green</legend>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {NAMES.map((n, i) => (
              <label
                key={n}
                className={`flex min-h-10 cursor-pointer items-center justify-center rounded-full border text-[0.82rem] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-signal-soft ${
                  current === i ? "border-signal/60 bg-signal/10 text-ink" : "border-line text-ink-2 hover:border-line-strong"
                }`}
              >
                <input type="radio" name={`${id}-current`} className="sr-only" checked={current === i} onChange={() => setCurrent(i)} />
                {n}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex cursor-pointer items-center gap-3 text-[0.88rem] text-ink-2">
          <input type="checkbox" checked={baseline} onChange={(e) => setBaseline(e.target.checked)} className="size-4 accent-[var(--color-signal)]" />
          Within the first 30 s (fixed baseline plan)
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {approaches.map((a, i) => {
          const p = result.priorities[i] ?? 0;
          const isCurrent = i === current;
          return (
            <fieldset key={i} className={`rounded-[var(--radius)] border p-4 ${i === result.next ? "border-verify/50 bg-verify/[0.04]" : "border-line bg-surface-1"}`}>
              <legend className="sr-only">{NAMES[i]} approach</legend>
              <div className="flex items-baseline justify-between">
                <p className="font-medium">{NAMES[i]}</p>
                <p className="font-mono text-[0.75rem] text-ink-3 tabular">
                  {isCurrent ? "serving (priority −1)" : `priority ${p.toFixed(1)}`}
                </p>
              </div>
              <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-line">
                <span
                  className={`block h-full rounded-full transition-[width] duration-500 ease-out-expo ${i === result.next ? "bg-verify" : "bg-signal/70"}`}
                  style={{ width: `${isCurrent ? 0 : Math.max(0, (p / maxP) * 100)}%` }}
                />
              </span>
              <div className="mt-3 space-y-1">
                <Range id={`${id}-c${i}`} label="Queued vehicles" value={a.count} max={30} unit="" onChange={(v) => update(i, { count: v })} />
                <Range id={`${id}-w${i}`} label="Waiting on red" value={a.wait} max={120} unit=" s" onChange={(v) => update(i, { wait: v })} />
                <Range id={`${id}-s${i}`} label="Since last green" value={a.since} max={180} unit=" s" onChange={(v) => update(i, { since: v })} />
              </div>
            </fieldset>
          );
        })}
        <p className="font-mono text-[0.72rem] leading-relaxed text-ink-3 sm:col-span-2">
          priority = 0.6 × vehicles + 0.3 × waiting s + 0.1 × s since green · the current phase scores −1
        </p>
      </div>
    </div>
  );
}
