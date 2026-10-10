"use client";

import { useMemo, useState } from "react";
import { SourceTag } from "@/components/ui/SourceTag";
import { mulberry32 } from "@/lib/random";

/**
 * Illustrative only: a synthetic 48-hour sensor trace (15-minute steps) with
 * a seasonal forecast band and a simple out-of-band rule. It explains how an
 * explained alert reads; it is not client telemetry and not the production model.
 */
const STEPS = 192; // 48 h at 15-minute steps
const FAILURE = 124; // 31 h
const DOWN_UNTIL = 130;

interface Point {
  i: number;
  v: number | null;
  expected: number;
}

const data: Point[] = (() => {
  const rand = mulberry32(2025);
  const pts: Point[] = [];
  let walk = 0;
  for (let i = 0; i <= STEPS; i++) {
    const expected = 52 + 7 * Math.sin((2 * Math.PI * i) / 96 - 1.2);
    walk = walk * 0.7 + (rand() - 0.5) * 2.6;
    let v = expected + walk;
    if (i >= 80 && i < FAILURE) v += Math.pow((i - 80) / (FAILURE - 80), 1.6) * 26;
    if (i >= 160 && i <= 163) v += 13 - Math.abs(i - 161.5) * 2;
    pts.push({ i, v: i >= FAILURE && i < DOWN_UNTIL ? null : v, expected });
  }
  return pts;
})();

const BAND = 6.5;

function flagWindows() {
  const windows: { start: number; end: number }[] = [];
  let runStart = -1;
  for (const p of data) {
    const out = p.v !== null && Math.abs(p.v - p.expected) > BAND;
    if (out && runStart < 0) runStart = p.i;
    if ((!out || p.i === STEPS) && runStart >= 0) {
      const end = out ? p.i : p.i - 1;
      if (end - runStart + 1 >= 3) windows.push({ start: runStart, end });
      runStart = -1;
    }
  }
  return windows;
}

const WINDOWS = flagWindows();

const ATTRIBUTIONS = [
  {
    title: "Developing fault",
    note: "Deviation builds for hours before failure, and two signals agree. This is the pattern an engineer can act on early.",
    bars: [
      { label: "Signal A · deviation from forecast", v: 0.46 },
      { label: "Signal B · rate of change", v: 0.29 },
      { label: "Signal C · cross-sensor drift", v: 0.14 },
      { label: "Other features", v: 0.06 },
    ],
  },
  {
    title: "Transient spike",
    note: "A short spike driven almost entirely by one signal, with nothing building around it. The attribution makes that obvious at a glance.",
    bars: [
      { label: "Signal A · deviation from forecast", v: 0.38 },
      { label: "Signal B · rate of change", v: 0.07 },
      { label: "Signal C · cross-sensor drift", v: -0.04 },
      { label: "Other features", v: 0.02 },
    ],
  },
];

const X0 = 44;
const X1 = 984;
const Y0 = 300;
const Y1 = 26;
const x = (i: number) => X0 + (i / STEPS) * (X1 - X0);
const y = (v: number) => Y0 - ((v - 28) / (96 - 28)) * (Y0 - Y1);
const hours = (i: number) => (i / 4).toFixed(i % 4 === 0 ? 0 : 1);

export function TelemetryExplorer() {
  const windows = WINDOWS;
  const [layers, setLayers] = useState({ band: true, flags: true });
  const [selected, setSelected] = useState(0);

  const paths = useMemo(() => {
    let line = "";
    let pen = false;
    for (const p of data) {
      if (p.v === null) {
        pen = false;
        continue;
      }
      line += `${pen ? "L" : "M"}${x(p.i).toFixed(1)} ${y(p.v).toFixed(1)} `;
      pen = true;
    }
    const expected = data.map((p, k) => `${k ? "L" : "M"}${x(p.i).toFixed(1)} ${y(p.expected).toFixed(1)}`).join(" ");
    const upper = data.map((p, k) => `${k ? "L" : "M"}${x(p.i).toFixed(1)} ${y(p.expected + BAND).toFixed(1)}`).join(" ");
    const lower = [...data].reverse().map((p) => `L${x(p.i).toFixed(1)} ${y(p.expected - BAND).toFixed(1)}`).join(" ");
    return { line, expected, band: `${upper} ${lower} Z` };
  }, []);

  const first = windows[0];
  const lead = first ? (FAILURE - first.start) / 4 : 0;
  const sel = windows[selected];
  const attr = ATTRIBUTIONS[selected] ?? ATTRIBUTIONS[0];

  return (
    <div className="rounded-[var(--radius)] border border-line bg-surface-1 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="label-mono text-ink-3">Synthetic sensor · 48 h · 15-minute steps</p>
        <SourceTag source="illustrative" />
      </div>

      <div className="mt-4 overflow-x-auto rounded-[8px]" tabIndex={0} role="region" aria-label="Synthetic sensor chart (scrollable)">
        <svg viewBox="0 0 1000 340" className="min-w-[620px] w-full" aria-hidden focusable={false}>
          {[0, 12, 24, 36, 48].map((h) => (
            <g key={h}>
              <path d={`M${x(h * 4)} ${Y1} V${Y0}`} stroke="var(--color-line)" />
              <text x={x(h * 4)} y={Y0 + 22} textAnchor="middle" fontSize="12" fontFamily="var(--font-geist-mono), monospace" fill="var(--color-ink-3)">
                {h} h
              </text>
            </g>
          ))}
          {layers.band ? (
            <>
              <path d={paths.band} fill="var(--color-signal)" opacity="0.09" />
              <path d={paths.expected} fill="none" stroke="var(--color-signal)" strokeOpacity="0.55" strokeDasharray="3 5" />
            </>
          ) : null}
          {layers.flags
            ? windows.map((w, k) => (
                <g key={w.start}>
                  <rect
                    x={x(w.start)}
                    y={Y1}
                    width={Math.max(4, x(w.end) - x(w.start))}
                    height={Y0 - Y1}
                    fill="var(--color-warn)"
                    opacity={k === selected ? 0.14 : 0.06}
                  />
                  <circle cx={x(w.start)} cy={Y1 + 8} r={k === selected ? 6 : 4.5} fill="var(--color-warn)" />
                </g>
              ))
            : null}
          <rect x={x(FAILURE)} y={Y1} width={x(DOWN_UNTIL) - x(FAILURE)} height={Y0 - Y1} fill="var(--color-ink-3)" opacity="0.08" />
          <path d={`M${x(FAILURE)} ${Y1} V${Y0}`} stroke="var(--color-ink-2)" strokeDasharray="2 4" />
          <text x={x(FAILURE) + 8} y={Y1 + 14} fontSize="12" fontFamily="var(--font-geist-mono), monospace" fill="var(--color-ink-2)">
            FAILURE
          </text>
          <path d={paths.line} fill="none" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinejoin="round" />
          {first && layers.flags ? (
            <g>
              <path d={`M${x(first.start)} ${Y0 - 14} H${x(FAILURE)}`} stroke="var(--color-warn)" strokeWidth="1.5" />
              <path d={`M${x(first.start)} ${Y0 - 20} v12 M${x(FAILURE)} ${Y0 - 20} v12`} stroke="var(--color-warn)" />
              <text x={(x(first.start) + x(FAILURE)) / 2} y={Y0 - 22} textAnchor="middle" fontSize="12" fontFamily="var(--font-geist-mono), monospace" fill="var(--color-warn)">
                LEAD TIME ≈ {lead.toFixed(1)} H
              </text>
            </g>
          ) : null}
        </svg>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <fieldset>
            <legend className="label-mono text-ink-3">Layers</legend>
            <div className="mt-2 flex flex-wrap gap-4 text-[0.88rem] text-ink-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={layers.band} onChange={(e) => setLayers((l) => ({ ...l, band: e.target.checked }))} className="size-4 accent-[var(--color-signal)]" />
                Forecast band
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={layers.flags} onChange={(e) => setLayers((l) => ({ ...l, flags: e.target.checked }))} className="size-4 accent-[var(--color-warn)]" />
                Flags
              </label>
            </div>
          </fieldset>
          <p className="label-mono mt-5 text-ink-3">Inspect a flag</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {windows.map((w, k) => (
              <button
                key={w.start}
                type="button"
                aria-pressed={k === selected}
                onClick={() => setSelected(k)}
                className={`min-h-10 rounded-full border px-4 text-[0.84rem] transition-colors ${
                  k === selected ? "border-warn/60 bg-warn/10 text-ink" : "border-line text-ink-2 hover:border-line-strong hover:text-ink"
                }`}
              >
                Flag {k + 1} · {hours(w.start)} h
              </button>
            ))}
          </div>
          <p className="mt-4 text-[0.84rem] text-ink-3">
            Rule used here: three or more consecutive readings outside the forecast band. Production combined Isolation Forest, XGBoost
            and NeuralProphet; this sketch only shows how the output reads.
          </p>
        </div>

        <div className="rounded-[10px] border border-line bg-bg p-4" aria-live="polite">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-medium">{attr?.title}</p>
            {sel ? (
              <p className="font-mono text-[0.75rem] text-ink-3 tabular">
                {hours(sel.start)}–{hours(sel.end)} h
              </p>
            ) : null}
          </div>
          <p className="label-mono mt-3 text-ink-3">Attribution (illustrative)</p>
          <ul className="mt-2 space-y-2">
            {attr?.bars.map((b) => (
              <li key={b.label} className="grid grid-cols-[1fr_7rem_3rem] items-center gap-3 text-[0.82rem]">
                <span className="text-ink-2">{b.label}</span>
                <span className="relative h-2 rounded-full bg-line">
                  <span
                    className={`absolute inset-y-0 rounded-full ${b.v >= 0 ? "left-1/2 bg-verify" : "right-1/2 bg-warn"}`}
                    style={{ width: `${Math.abs(b.v) * 100}%` }}
                  />
                  <span aria-hidden className="absolute inset-y-[-3px] left-1/2 w-px bg-ink-3" />
                </span>
                <span className="text-right font-mono text-ink tabular">
                  {b.v >= 0 ? "+" : "−"}
                  {Math.abs(b.v).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.84rem] text-ink-2">{attr?.note}</p>
        </div>
      </div>
    </div>
  );
}
