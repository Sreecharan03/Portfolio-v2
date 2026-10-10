"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { DiagramEdge, DiagramNode, DiagramSpec, NodeKind } from "@/content/diagrams";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";

type Box = { x: number; y: number; w: number; h: number };

const KIND_LABEL: Partial<Record<NodeKind, string>> = {
  guard: "GUARD",
  store: "STORE",
  verify: "VERIFY",
  io: "I/O",
  warn: "FAILSAFE",
};

const KIND_COLOR: Record<NodeKind, string> = {
  default: "var(--color-line-strong)",
  guard: "var(--color-warn)",
  store: "var(--color-signal)",
  verify: "var(--color-verify)",
  io: "var(--color-ink-3)",
  warn: "var(--color-warn)",
};

const KIND_TINT: Record<NodeKind, string> = {
  default: "rgba(100,149,255,0.09)",
  guard: "rgba(242,166,94,0.08)",
  store: "rgba(100,149,255,0.09)",
  verify: "rgba(148,119,255,0.12)",
  io: "rgba(168,182,210,0.07)",
  warn: "rgba(242,166,94,0.08)",
};

const key = (e: Pick<DiagramEdge, "from" | "to">) => `${e.from}>${e.to}`;

function routeEdge(a: Box, b: Box, via?: "h" | "v"): string {
  const acx = a.x + a.w / 2;
  const acy = a.y + a.h / 2;
  const bcx = b.x + b.w / 2;
  const bcy = b.y + b.h / 2;
  const dx = bcx - acx;
  const dy = bcy - acy;
  const horizontal = via ? via === "h" : Math.abs(dx) >= Math.abs(dy) * 1.2;
  if (horizontal) {
    const dir = dx >= 0 ? 1 : -1;
    const sx = dir > 0 ? a.x + a.w : a.x;
    const ex = dir > 0 ? b.x : b.x + b.w;
    const c = Math.max(24, Math.abs(ex - sx) / 2);
    return `M${sx} ${acy} C ${sx + c * dir} ${acy}, ${ex - c * dir} ${bcy}, ${ex} ${bcy}`;
  }
  const dir = dy >= 0 ? 1 : -1;
  const sy = dir > 0 ? a.y + a.h : a.y;
  const ey = dir > 0 ? b.y : b.y + b.h;
  const c = Math.max(18, Math.abs(ey - sy) / 2);
  return `M${acx} ${sy} C ${acx} ${sy + c * dir}, ${bcx} ${ey - c * dir}, ${bcx} ${ey}`;
}

function narrowLayout(spec: DiagramSpec) {
  const order: string[] = [];
  for (const s of spec.steps) for (const n of s.nodes) if (!order.includes(n)) order.push(n);
  for (const n of spec.nodes) if (!order.includes(n.id)) order.push(n.id);
  const boxes = new Map<string, Box>();
  let y = 14;
  for (const id of order) {
    const node = spec.nodes.find((n) => n.id === id);
    const lines = node?.lines?.length ?? 0;
    const h = 50 + lines * 19;
    boxes.set(id, { x: 14, y, w: 318, h });
    y += h + 34;
  }
  return { boxes, order, height: y - 34 + 14 };
}

function Node({
  node,
  box,
  state,
  title,
  sub,
}: {
  node: DiagramNode;
  box: Box;
  state: "idle" | "active" | "dim";
  title: number;
  sub: number;
}) {
  const kind = node.kind ?? "default";
  const color = KIND_COLOR[kind];
  const active = state === "active";
  const label = KIND_LABEL[kind];
  // If the title would collide with the kind label, drop the label to the bottom-right corner.
  const crowded = label ? node.title.length * title * 0.56 + label.length * (sub - 2) * 0.78 + 44 > box.w : false;
  return (
    <g style={{ opacity: state === "dim" ? 0.3 : 1, transition: "opacity 450ms var(--ease-out-expo)" }}>
      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        rx={12}
        fill={active ? KIND_TINT[kind] : "var(--color-surface-2)"}
        stroke={active && kind === "default" ? "var(--color-signal)" : color}
        strokeOpacity={active ? 1 : kind === "default" ? 1 : 0.65}
        strokeDasharray={kind === "store" ? "5 4" : undefined}
        style={{ transition: "fill 400ms, stroke 400ms" }}
      />
      {label ? (
        <text
          x={box.x + box.w - 14}
          y={crowded ? box.y + box.h - 12 : box.y + 22}
          textAnchor="end"
          fontSize={sub - 2}
          letterSpacing="0.12em"
          fontFamily="var(--font-geist-mono), monospace"
          fill={color}
        >
          {label}
        </text>
      ) : null}
      <text x={box.x + 16} y={box.y + 30} fontSize={title} fontWeight={500} letterSpacing="-0.01em" fill="var(--color-ink)">
        {node.title}
      </text>
      {node.lines?.map((line, i) => (
        <text
          key={line}
          x={box.x + 16}
          y={box.y + 52 + i * (sub + 5.5)}
          fontSize={sub}
          fontFamily="var(--font-geist-mono), monospace"
          fill="var(--color-ink-2)"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function Edges({
  spec,
  boxes,
  activeEdges,
  stepActive,
  uid,
  routeFn,
}: {
  spec: DiagramSpec;
  boxes: Map<string, Box>;
  activeEdges: Set<string>;
  stepActive: boolean;
  uid: string;
  routeFn: (e: DiagramEdge, a: Box, b: Box) => string;
}) {
  return (
    <>
      {spec.edges.map((e) => {
        const a = boxes.get(e.from);
        const b = boxes.get(e.to);
        if (!a || !b) return null;
        const d = routeFn(e, a, b);
        const on = activeEdges.has(key(e));
        const kind = e.kind ?? "flow";
        const target = spec.nodes.find((n) => n.id === e.to)?.kind;
        const hot = kind === "error" ? "warn" : target === "verify" ? "verify" : "signal";
        const color = on || kind === "error" ? `var(--color-${hot})` : "var(--color-ink-3)";
        const marker = on || kind === "error" ? hot : "dim";
        return (
          <g key={key(e)} style={{ opacity: stepActive && !on ? 0.28 : 1, transition: "opacity 450ms" }}>
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeOpacity={on ? 0.95 : kind === "error" ? 0.55 : 0.6}
              strokeWidth={on ? 1.6 : 1.2}
              strokeDasharray={kind === "flow" ? undefined : "5 6"}
              markerEnd={`url(#${uid}-arrow-${marker})`}
            />
            {on ? (
              <path
                d={d}
                fill="none"
                pathLength={100}
                className="flow-pulse"
                stroke={`var(--color-${hot === "signal" ? "signal-soft" : hot === "verify" ? "verify-soft" : "warn"})`}
                strokeWidth={2.6}
                strokeLinecap="round"
              />
            ) : null}
          </g>
        );
      })}
    </>
  );
}

function Markers({ uid }: { uid: string }) {
  const colors: Record<string, string> = {
    dim: "var(--color-ink-3)",
    signal: "var(--color-signal)",
    verify: "var(--color-verify)",
    warn: "var(--color-warn)",
  };
  return (
    <defs>
      {Object.entries(colors).map(([k, c]) => (
        <marker
          key={k}
          id={`${uid}-arrow-${k}`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M0 1 L9 5 L0 9 Z" fill={c} />
        </marker>
      ))}
    </defs>
  );
}

export function FlowDiagram({ spec, caption }: { spec: DiagramSpec; caption: string }) {
  const rawId = useId();
  const uid = `fd${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const wideBoxes = useMemo(() => new Map(spec.nodes.map((n) => [n.id, n.box] as const)), [spec]);
  const narrow = useMemo(() => narrowLayout(spec), [spec]);

  const current = step >= 0 ? spec.steps[step] : undefined;
  const activeNodes = useMemo(() => new Set(current?.nodes ?? []), [current]);
  const activeEdges = useMemo(() => new Set(current?.edges ?? []), [current]);
  const stepActive = step >= 0;

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setStep((s) => (s + 1 >= spec.steps.length ? 0 : s + 1));
    }, 4800);
    return () => window.clearInterval(id);
  }, [playing, spec.steps.length]);

  const choose = (i: number) => {
    setPlaying(false);
    setStep(i);
  };

  const total = spec.steps.length;
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    // tab indices: 0 = overview, 1..n = steps
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % (total + 1);
    else if (e.key === "ArrowLeft") next = (i - 1 + total + 1) % (total + 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = total;
    else return;
    e.preventDefault();
    choose(next - 1);
    tabs.current[next]?.focus();
  };

  const state = (id: string): "idle" | "active" | "dim" => (!stepActive ? "idle" : activeNodes.has(id) ? "active" : "dim");

  const narrowRoute = (e: DiagramEdge, a: Box, b: Box) => {
    const ia = narrow.order.indexOf(e.from);
    const ib = narrow.order.indexOf(e.to);
    if (Math.abs(ia - ib) === 1) return routeEdge(a, b, "v");
    const span = Math.abs(ia - ib);
    const out = 26 + Math.min(4, span) * 9;
    const ax = a.x + a.w;
    const bx = b.x + b.w;
    const ay = a.y + a.h / 2;
    const by = b.y + b.h / 2;
    return `M${ax} ${ay} C ${ax + out} ${ay}, ${bx + out} ${by}, ${bx} ${by}`;
  };

  const tabClass = (on: boolean) =>
    `inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.84rem] transition-colors duration-300 ${
      on ? "border-signal/60 bg-signal/10 text-ink" : "border-line text-ink-2 hover:border-line-strong hover:text-ink"
    }`;

  return (
    <figure aria-labelledby={`${uid}-cap`}>
      <div className="overflow-hidden rounded-[18px] border border-line bg-surface-1/70 p-3 sm:p-6">
        <svg
          viewBox={`0 0 1200 ${spec.height}`}
          className="hidden w-full md:block"
          aria-hidden
          focusable={false}
          style={{ maxHeight: "70vh" }}
        >
          <Markers uid={uid} />
          <Edges
            spec={spec}
            boxes={wideBoxes}
            activeEdges={activeEdges}
            stepActive={stepActive}
            uid={uid}
            routeFn={(e, a, b) => routeEdge(a, b, e.via)}
          />
          {spec.nodes.map((n) => (
            <Node key={n.id} node={n} box={n.box} state={state(n.id)} title={15.5} sub={11.5} />
          ))}
        </svg>
        <svg
          viewBox={`0 0 412 ${narrow.height}`}
          className="mx-auto block w-full max-w-[460px] md:hidden"
          aria-hidden
          focusable={false}
        >
          <Markers uid={`${uid}n`} />
          <Edges
            spec={spec}
            boxes={narrow.boxes}
            activeEdges={activeEdges}
            stepActive={stepActive}
            uid={`${uid}n`}
            routeFn={narrowRoute}
          />
          {spec.nodes.map((n) => {
            const box = narrow.boxes.get(n.id);
            return box ? <Node key={n.id} node={n} box={box} state={state(n.id)} title={17} sub={13} /> : null;
          })}
        </svg>
      </div>

      <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div role="tablist" aria-label="Architecture walkthrough" className="flex flex-wrap gap-2">
          <button
            ref={(el) => {
              tabs.current[0] = el;
            }}
            role="tab"
            id={`${uid}-tab-overview`}
            aria-selected={step === -1}
            aria-controls={`${uid}-panel`}
            tabIndex={step === -1 ? 0 : -1}
            onClick={() => choose(-1)}
            onKeyDown={(e) => onKey(e, 0)}
            className={tabClass(step === -1)}
          >
            Overview
          </button>
          {spec.steps.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                tabs.current[i + 1] = el;
              }}
              role="tab"
              id={`${uid}-tab-${s.id}`}
              aria-selected={step === i}
              aria-controls={`${uid}-panel`}
              tabIndex={step === i ? 0 : -1}
              onClick={() => choose(i)}
              onKeyDown={(e) => onKey(e, i + 1)}
              className={tabClass(step === i)}
            >
              <span className={`font-mono text-[0.7rem] ${step === i ? "text-signal-soft" : "text-ink-3"}`}>0{i + 1}</span>
              {s.title}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => choose(step <= 0 ? total - 1 : step - 1)}
            className="grid size-10 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
            aria-label="Previous step"
          >
            <ArrowLeft size={15} />
          </button>
          <button
            type="button"
            onClick={() => choose(step + 1 >= total ? 0 : step + 1)}
            className="grid size-10 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
            aria-label="Next step"
          >
            <ArrowRight size={15} />
          </button>
          <button
            type="button"
            onClick={() => {
              if (!playing && step === -1) setStep(0);
              setPlaying((p) => !p);
            }}
            aria-pressed={playing}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-[0.84rem] text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
          >
            <span aria-hidden className={`size-1.5 rounded-full ${playing ? "bg-signal" : "bg-ink-3"}`} />
            {playing ? "Pause walkthrough" : "Play walkthrough"}
          </button>
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={current ? `${uid}-tab-${current.id}` : `${uid}-tab-overview`}
        aria-live={playing ? "polite" : "off"}
        className="mt-5 min-h-[7.5rem] rounded-[var(--radius)] border border-line p-5 sm:p-6"
      >
        {current ? (
          <>
            <p className="label-mono text-ink-3">
              Step {String(step + 1).padStart(2, "0")} of {String(total).padStart(2, "0")}
            </p>
            <p className="mt-2 text-step-1 font-medium tracking-[-0.01em]">{current.title}</p>
            <p className="mt-2 max-w-[70ch] text-ink-2">{current.body}</p>
          </>
        ) : (
          <>
            <p className="label-mono text-ink-3">Overview</p>
            <p className="mt-2 max-w-[70ch] text-ink-2">
              Select a step, use the arrow keys, or play the walkthrough to follow work through the system.
            </p>
            <ol className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-step--1 text-ink-3">
              {spec.steps.map((s, i) => (
                <li key={s.id}>
                  <span className="font-mono text-[0.72rem]">0{i + 1}</span> {s.title}
                </li>
              ))}
            </ol>
          </>
        )}
      </div>

      <figcaption id={`${uid}-cap`} className="mt-3 font-mono text-[0.72rem] tracking-[0.03em] text-ink-3">
        {spec.label}. {caption}
      </figcaption>
    </figure>
  );
}
