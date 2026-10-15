"use client";

import { useId, useMemo, useState, type CSSProperties } from "react";

/**
 * Port of SenseMinds 360's HealthEngine (senseminds/engines/health/engine.py):
 * a sensor scores from its threshold state where one exists, otherwise from its
 * data trust; subsystems and the machine are confidence-weighted means, and the
 * worst child severity always propagates up. The machine and sensors below are
 * representative, not client data.
 */

type Severity = "ok" | "warning" | "critical";
type State = "within" | "outside" | "critical" | "trip" | "none";

const RANK: Record<Severity, number> = { ok: 0, warning: 2, critical: 3 };

const STATE_HEALTH: Record<Exclude<State, "none">, { score: number; severity: Severity }> = {
  within: { score: 100, severity: "ok" },
  outside: { score: 60, severity: "warning" },
  critical: { score: 30, severity: "critical" },
  trip: { score: 0, severity: "critical" },
};

const STATE_LABEL: Record<State, string> = {
  within: "Within range",
  outside: "Outside operating band",
  critical: "Past critical setpoint",
  trip: "Past trip setpoint",
  none: "No threshold (use data trust)",
};

const SEVERITY_LABEL: Record<Severity, string> = { ok: "OK", warning: "Warning", critical: "Critical" };

interface Sensor {
  key: string;
  name: string;
  subsystem: string;
  state: State;
  trust: number;
}

interface Score {
  score: number;
  severity: Severity;
  confidence: number;
}

const SUBSYSTEMS = [
  { key: "compression", name: "Compression" },
  { key: "cooling", name: "Cooling" },
] as const;

const INITIAL: Sensor[] = [
  { key: "dp", name: "Discharge pressure", subsystem: "compression", state: "within", trust: 0.95 },
  { key: "dt", name: "Discharge temperature", subsystem: "compression", state: "within", trust: 0.9 },
  { key: "op", name: "Oil pressure", subsystem: "compression", state: "outside", trust: 0.85 },
  { key: "cw", name: "Cooling-water inlet", subsystem: "cooling", state: "none", trust: 0.92 },
  { key: "ct", name: "Condenser temperature", subsystem: "cooling", state: "within", trust: 0.6 },
];

/** Python's round(x, n): ties go to the even neighbour. */
function pyRound(x: number, digits: number) {
  const m = 10 ** digits;
  const y = x * m;
  const f = Math.floor(y);
  if (Math.abs(y - f - 0.5) < 1e-9) return (f % 2 === 0 ? f : f + 1) / m;
  return Math.round(y) / m;
}

function severityFromScore(score: number): Severity {
  if (score >= 80) return "ok";
  if (score >= 50) return "warning";
  return "critical";
}

function sensorHealth(s: Sensor): Score {
  if (s.state !== "none") {
    const { score, severity } = STATE_HEALTH[s.state];
    return { score, severity, confidence: s.trust };
  }
  const score = pyRound(s.trust * 100, 1);
  return { score, severity: severityFromScore(score), confidence: s.trust };
}

function rollup(children: Score[]): Score {
  if (children.length === 0) return { score: 100, severity: "ok", confidence: 0 };
  const weights = children.map((c) => c.confidence);
  const wsum = weights.reduce((a, b) => a + b, 0) || children.length;
  const score = pyRound(children.reduce((acc, c, i) => acc + c.score * (weights[i] ?? 0), 0) / wsum, 1);
  const severity = children.reduce<Severity>((worst, c) => (RANK[c.severity] > RANK[worst] ? c.severity : worst), "ok");
  const confidence = pyRound(weights.reduce((a, b) => a + b, 0) / children.length, 4);
  return { score, severity, confidence };
}

const TONE: Record<Severity, string> = {
  ok: "border-signal/40 text-signal-soft",
  warning: "border-warn/50 text-warn",
  critical: "border-critical/60 bg-critical/10 text-critical",
};

function Badge({ severity }: { severity: Severity }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-[0.08em] ${TONE[severity]}`}>
      {SEVERITY_LABEL[severity]}
    </span>
  );
}

function fmt(n: number) {
  return n.toFixed(1);
}

/** With zero confidence the engine still returns a number (0.0, OK); the demo shows it as unavailable instead. */
function unavailable(h: Score) {
  return h.confidence === 0;
}

function NoData() {
  return (
    <span className="inline-flex items-center rounded-full border border-line-strong px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-ink-3">
      No trusted data
    </span>
  );
}

export function HealthRollup() {
  const id = useId();
  const [sensors, setSensors] = useState<Sensor[]>(INITIAL);

  const result = useMemo(() => {
    const bySensor = new Map(sensors.map((s) => [s.key, sensorHealth(s)]));
    const subs = SUBSYSTEMS.map((sub) => ({
      ...sub,
      health: rollup(sensors.filter((s) => s.subsystem === sub.key).map((s) => bySensor.get(s.key)!)),
    }));
    const machine = rollup(subs.map((s) => s.health));
    return { bySensor, subs, machine };
  }, [sensors]);

  const update = (key: string, patch: Partial<Sensor>) =>
    setSensors((prev) => prev.map((s) => (s.key === key ? { ...s, ...patch } : s)));

  const machineUnavailable = unavailable(result.machine);
  const masked = !machineUnavailable && result.machine.severity !== severityFromScore(result.machine.score);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.35fr]">
      <div className="flex flex-col gap-4">
        <div aria-live="polite" className="rounded-[var(--radius)] border border-line bg-surface-1 p-5" data-testid="machine-health">
          <p className="label-mono text-ink-3">Machine · screw compressor</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <p className="font-display text-step-4 leading-none tabular">{machineUnavailable ? "—" : fmt(result.machine.score)}</p>
            {machineUnavailable ? <NoData /> : <Badge severity={result.machine.severity} />}
          </div>
          <p className="mt-3 text-[0.84rem] text-ink-3">Confidence {result.machine.confidence.toFixed(2)}: the mean trust of what it was built from.</p>
          {machineUnavailable ? (
            <p className="mt-3 rounded-[10px] border border-line-strong bg-bg p-3 text-[0.84rem] text-ink-2">
              Nothing it was built from can be trusted, so there is no score to show. The engine&apos;s raw output here is{" "}
              <span className="font-mono">{fmt(result.machine.score)} · {SEVERITY_LABEL[result.machine.severity]} · confidence 0</span>: a score
              is only meaningful next to its confidence.
            </p>
          ) : null}
          {masked ? (
            <p className="mt-3 rounded-[10px] border border-warn/30 bg-warn/[0.06] p-3 text-[0.84rem] text-ink-2">
              The score alone reads as {SEVERITY_LABEL[severityFromScore(result.machine.score)]}, but severity is never averaged away: the worst
              sensor&apos;s severity travels up to the machine.
            </p>
          ) : null}
        </div>

        {result.subs.map((sub) => (
          <div key={sub.key} className="rounded-[var(--radius)] border border-line bg-surface-1 p-4" data-testid={`subsystem-${sub.key}`}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-medium">{sub.name}</p>
              {unavailable(sub.health) ? <NoData /> : <Badge severity={sub.health.severity} />}
            </div>
            <p className="mt-2 font-mono text-[0.78rem] text-ink-2">
              score <span className="text-ink tabular">{unavailable(sub.health) ? "—" : fmt(sub.health.score)}</span> · confidence{" "}
              {sub.health.confidence.toFixed(2)}
            </p>
          </div>
        ))}

        <p className="font-mono text-[0.74rem] leading-relaxed text-ink-3">
          score = Σ(scoreᵢ × trustᵢ) / Σ trustᵢ · severity = worst child · bands: ≥ 80 OK, 50–79 Warning, &lt; 50 Critical
        </p>
      </div>

      <div className="grid content-start gap-3">
        {SUBSYSTEMS.map((sub) => (
          <fieldset key={sub.key} className="rounded-[var(--radius)] border border-line bg-surface-1 p-4">
            <legend className="label-mono px-1 text-ink-3">{sub.name} sensors</legend>
            <div className="grid gap-4">
              {sensors
                .filter((s) => s.subsystem === sub.key)
                .map((s) => {
                  const h = result.bySensor.get(s.key)!;
                  return (
                    <div key={s.key} className="grid gap-2 border-t border-line pt-3 first:border-t-0 first:pt-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <label htmlFor={`${id}-${s.key}-state`} className="text-[0.9rem] font-medium">
                          {s.name}
                        </label>
                        <span className="flex items-center gap-2 font-mono text-[0.78rem] text-ink-2 tabular">
                          {fmt(h.score)} <Badge severity={h.severity} />
                        </span>
                      </div>
                      <select
                        id={`${id}-${s.key}-state`}
                        value={s.state}
                        onChange={(e) => update(s.key, { state: e.target.value as State })}
                        className="min-h-10 rounded-[9px] border border-line-strong bg-bg px-3 text-[0.86rem] text-ink"
                      >
                        {(Object.keys(STATE_LABEL) as State[]).map((st) => (
                          <option key={st} value={st}>
                            {STATE_LABEL[st]}
                            {st === "none" ? "" : ` · ${STATE_HEALTH[st].score}`}
                          </option>
                        ))}
                      </select>
                      <div>
                        <div className="flex items-baseline justify-between gap-3">
                          <label htmlFor={`${id}-${s.key}-trust`} className="text-[0.8rem] text-ink-2">
                            Data trust
                          </label>
                          <output htmlFor={`${id}-${s.key}-trust`} className="font-mono text-[0.78rem] text-ink tabular">
                            {s.trust.toFixed(2)}
                          </output>
                        </div>
                        <input
                          id={`${id}-${s.key}-trust`}
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={s.trust}
                          onChange={(e) => update(s.key, { trust: Number(e.target.value) })}
                          className="range"
                          style={{ "--range-pct": `${s.trust * 100}%` } as CSSProperties}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </fieldset>
        ))}
        <p className="text-[0.82rem] text-ink-3">
          Data trust comes from the platform&apos;s sensor-reliability engine (flatlines, noise, drift, spikes). A sensor it trusts less counts
          less, and without a threshold its score is its trust.
        </p>
      </div>
    </div>
  );
}
