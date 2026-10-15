"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { SourceTag } from "@/components/ui/SourceTag";

/**
 * Illustrative simulation of the documented protection mechanisms:
 * AIMD concurrency control, a circuit breaker and retry-instead-of-drop,
 * against a provider whose capacity collapses mid-run. Abstract units
 * ("requests", "ticks"); not production telemetry.
 */
const TOTAL = 400;
const TICKS = 64;
// provider: healthy (14/tick) → outage (0) → degraded (5) → healthy
const capacityAt = (t: number) => (t >= 14 && t < 20 ? 0 : t >= 20 && t < 32 ? 5 : 14);

type Mode = "protected" | "naive";
type Breaker = "closed" | "open" | "half";

interface Tick {
  t: number;
  capacity: number;
  sent: number;
  ok: number;
  throttled: number;
  breaker: Breaker;
  limit: number;
}

function simulate(mode: Mode) {
  const ticks: Tick[] = [];
  let remaining = TOTAL;
  let limit = mode === "naive" ? 14 : 4;
  let breaker: Breaker = "closed";
  let openUntil = -1;
  let strikes = 0;
  let retried = 0;
  let lost = 0;
  let done = 0;
  let finishedAt = -1;

  for (let t = 0; t < TICKS; t++) {
    const capacity = capacityAt(t);
    if (remaining <= 0) {
      ticks.push({ t, capacity, sent: 0, ok: 0, throttled: 0, breaker: "closed", limit });
      continue;
    }
    if (mode === "protected" && breaker === "open" && t >= openUntil) breaker = "half";
    let sent = 0;
    if (mode === "naive") sent = Math.min(limit, remaining);
    else if (breaker === "open") sent = 0;
    else if (breaker === "half") sent = 1;
    else sent = Math.min(limit, remaining);

    const ok = Math.min(sent, capacity);
    const throttled = sent - ok;
    done += ok;
    remaining -= ok;

    if (mode === "naive") {
      lost += throttled; // no retry: throttled requests are gone
      remaining -= throttled;
    } else if (sent > 0) {
      retried += throttled; // re-queued, not dropped
      if (throttled > 0) {
        strikes += 1;
        limit = Math.max(1, Math.floor(limit / 2)); // multiplicative decrease
        if (breaker === "half" || strikes >= 3) {
          breaker = "open";
          openUntil = t + 3;
          strikes = 0;
        }
      } else {
        strikes = 0;
        if (breaker === "half") {
          breaker = "closed";
          limit = 2;
        } else {
          limit = Math.min(20, limit + 1); // additive increase
        }
      }
    }

    ticks.push({ t, capacity, sent, ok, throttled, breaker, limit });
    if (remaining <= 0 && finishedAt < 0) finishedAt = t + 1;
  }
  return { ticks, retried, lost, done, finishedAt: finishedAt < 0 ? TICKS : finishedAt };
}

export function ResilienceDrill() {
  const radioName = useId();
  const [mode, setMode] = useState<Mode>("protected");
  const [progress, setProgress] = useState(TICKS);
  const raf = useRef(0);
  const sim = useMemo(() => simulate(mode), [mode]);

  const play = () => {
    cancelAnimationFrame(raf.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(TICKS);
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(TICKS, Math.floor((now - start) / 55));
      setProgress(p);
      if (p < TICKS) raf.current = requestAnimationFrame(step);
    };
    setProgress(0);
    raf.current = requestAnimationFrame(step);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const W = 1000;
  const H = 260;
  const X0 = 40;
  const bw = (W - X0 - 10) / TICKS;
  const maxY = 22;
  const yv = (v: number) => H - 30 - (v / maxY) * (H - 60);

  const visible = sim.ticks.slice(0, progress);
  const doneSoFar = visible.reduce((s, t) => s + t.ok, 0);
  const lostSoFar = mode === "naive" ? visible.reduce((s, t) => s + t.throttled, 0) : 0;
  const retriedSoFar = mode === "protected" ? visible.reduce((s, t) => s + t.throttled, 0) : 0;

  const capPath = sim.ticks.map((t, i) => `${i ? "L" : "M"}${X0 + i * bw} ${yv(t.capacity)} H${X0 + (i + 1) * bw}`).join(" ");

  return (
    <div className="rounded-[var(--radius)] border border-line bg-surface-1 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Strategy</legend>
          {(
            [
              ["protected", "AIMD + breaker + retry"],
              ["naive", "Fixed concurrency, no retry"],
            ] as const
          ).map(([m, label]) => (
            <label
              key={m}
              className={`flex min-h-10 cursor-pointer items-center rounded-full border px-4 text-[0.84rem] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-signal-soft ${
                mode === m
                  ? m === "protected"
                    ? "border-signal/60 bg-signal/10 text-ink"
                    : "border-warn/60 bg-warn/10 text-ink"
                  : "border-line text-ink-2 hover:border-line-strong hover:text-ink"
              }`}
            >
              <input
                type="radio"
                name={`${radioName}-strategy`}
                value={m}
                className="sr-only"
                checked={mode === m}
                onChange={() => {
                  setMode(m);
                  setProgress(TICKS);
                }}
              />
              {label}
            </label>
          ))}
        </fieldset>
        <div className="flex items-center gap-3">
          <SourceTag source="illustrative" />
          <button
            type="button"
            onClick={play}
            className="min-h-10 rounded-full bg-ink px-4 text-[0.84rem] font-medium text-bg transition-colors hover:bg-white"
          >
            Replay
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-[8px]" tabIndex={0} role="region" aria-label="Simulation chart (scrollable)">
        <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[620px] w-full" aria-hidden focusable={false}>
          {[0, 5, 10, 15, 20].map((v) => (
            <g key={v}>
              <path d={`M${X0} ${yv(v)} H${W - 10}`} stroke="var(--color-line)" />
              <text x={X0 - 8} y={yv(v) + 4} textAnchor="end" fontSize="11" fontFamily="var(--font-geist-mono), monospace" fill="var(--color-ink-3)">
                {v}
              </text>
            </g>
          ))}
          <rect x={X0 + 14 * bw} y={14} width={6 * bw} height={H - 44} fill="var(--color-warn)" opacity="0.09" />
          <rect x={X0 + 20 * bw} y={14} width={12 * bw} height={H - 44} fill="var(--color-warn)" opacity="0.04" />
          <text x={X0 + 17 * bw} y={26} textAnchor="middle" fontSize="11" fontFamily="var(--font-geist-mono), monospace" fill="var(--color-warn)">
            OUTAGE
          </text>
          <text x={X0 + 26 * bw} y={26} textAnchor="middle" fontSize="11" fontFamily="var(--font-geist-mono), monospace" fill="var(--color-warn)">
            THROTTLED
          </text>
          {visible.map((t) => {
            const x = X0 + t.t * bw + 1.5;
            const w = Math.max(1, bw - 3);
            return (
              <g key={t.t}>
                {t.breaker === "open" ? <rect x={x - 1.5} y={34} width={bw} height={6} fill="var(--color-warn)" opacity="0.7" /> : null}
                {t.breaker === "half" ? <rect x={x - 1.5} y={34} width={bw} height={6} fill="var(--color-warn)" opacity="0.3" /> : null}
                <rect x={x} y={yv(t.ok)} width={w} height={yv(0) - yv(t.ok)} rx={1.5} fill={mode === "protected" ? "var(--color-signal)" : "var(--color-ink-3)"} opacity="0.85" />
                {t.throttled > 0 ? (
                  <rect x={x} y={yv(t.ok + t.throttled)} width={w} height={yv(t.ok) - yv(t.ok + t.throttled)} rx={1.5} fill="var(--color-warn)" opacity={mode === "naive" ? 0.9 : 0.55} />
                ) : null}
              </g>
            );
          })}
          <path d={capPath} fill="none" stroke="var(--color-ink-2)" strokeDasharray="4 5" />
          <text x={W - 12} y={yv(14) - 8} textAnchor="end" fontSize="11" fontFamily="var(--font-geist-mono), monospace" fill="var(--color-ink-2)">
            PROVIDER CAPACITY
          </text>
          <text x={X0} y={H - 8} fontSize="11" fontFamily="var(--font-geist-mono), monospace" fill="var(--color-ink-3)">
            TICKS →
          </text>
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.78rem] text-ink-3">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className={`size-2.5 rounded-sm ${mode === "protected" ? "bg-signal" : "bg-ink-3"}`} /> Succeeded
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-sm bg-warn" /> Throttled ({mode === "protected" ? "re-queued" : "dropped"})
        </span>
        {mode === "protected" ? (
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-4 rounded-sm bg-warn/70" /> Breaker open / half-open
          </span>
        ) : null}
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-line bg-line sm:grid-cols-4" aria-live="polite">
        {[
          ["Completed", `${doneSoFar} / ${TOTAL}`],
          [mode === "protected" ? "Re-queued" : "Retried", mode === "protected" ? String(retriedSoFar) : "0"],
          ["Lost", String(lostSoFar)],
          ["Ticks to finish", progress >= TICKS ? String(sim.finishedAt) : "…"],
        ].map(([k, v]) => (
          <div key={k} className="bg-bg p-4">
            <dt className="label-mono text-ink-3">{k}</dt>
            <dd className={`font-display mt-1 text-step-2 tabular ${k === "Lost" && v !== "0" ? "text-warn" : ""}`}>{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-[0.84rem] text-ink-3">
        The trade-off the protection layer makes: under throttling it slows down instead of losing work. Units are abstract; the
        real-world result is the reported 574 → 0 on a 12,910-comment run.
      </p>
    </div>
  );
}
