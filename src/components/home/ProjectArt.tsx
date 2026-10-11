import type { ReactNode } from "react";
import { mulberry32 } from "@/lib/random";

/**
 * Bespoke artwork per project: each drawing is a simplified view of the
 * system's real mechanism (queues, telemetry, guarded graph, retrieval,
 * two-stage fine-tuning, junction control). Decorative; the case study
 * carries the accessible explanation.
 */

const W = 800;
const H = 500;
const mono = "var(--font-geist-mono), ui-monospace, monospace";

function Frame({ id, children }: { id: string; children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full"
      aria-hidden
      focusable={false}
      preserveAspectRatio="xMidYMid meet"
      data-art
    >
      <defs>
        <pattern id={`${id}-dots`} width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="var(--color-line-strong)" opacity="0.55" />
        </pattern>
        <radialGradient id={`${id}-glow`} gradientUnits="userSpaceOnUse" cx={W / 2} cy={H / 2} r={W * 0.6}>
          <stop offset="0" stopColor="var(--color-signal)" stopOpacity="0.13" />
          <stop offset="1" stopColor="var(--color-signal)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* backgrounds bleed past the viewBox so letterboxed frames stay filled */}
      <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="var(--color-surface-1)" />
      <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={`url(#${id}-dots)`} />
      <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={`url(#${id}-glow)`} />
      {children}
    </svg>
  );
}

function Label({ x, y, children, anchor = "start", fill = "var(--color-ink-3)" }: { x: number; y: number; children: ReactNode; anchor?: "start" | "middle" | "end"; fill?: string }) {
  return (
    <text x={x} y={y} fill={fill} fontFamily={mono} fontSize="12" letterSpacing="0.08em" textAnchor={anchor}>
      {children}
    </text>
  );
}

function SighnalArt() {
  const lanes = [150, 210, 270, 330];
  return (
    <Frame id="art-sighnal">
      {lanes.map((y, i) => (
        <g key={y}>
          <Label x={48} y={y + 4}>{`Q${i + 1}`}</Label>
          <path d={`M88 ${y} H360 C 430 ${y}, 440 245, 500 245`} stroke="var(--color-line-strong)" strokeWidth="1.25" fill="none" />
          <path
            d={`M88 ${y} H360 C 430 ${y}, 440 245, 500 245`}
            stroke="var(--color-signal-soft)"
            strokeWidth="2"
            fill="none"
            pathLength={200}
            className="art-flow"
            style={{ animationDelay: `${i * -0.9}s` }}
          />
          {[0, 1, 2, 3].map((k) => (
            <rect
              key={k}
              x={110 + k * 58 + ((i * 23) % 40)}
              y={y - 5}
              width="10"
              height="10"
              rx="2.5"
              fill="var(--color-surface-3)"
              stroke="var(--color-signal)"
              strokeOpacity={0.55 - k * 0.1}
            />
          ))}
        </g>
      ))}
      {/* breaker */}
      <g>
        <path d="M560 110 v52" stroke="var(--color-warn)" strokeWidth="1.25" strokeDasharray="3 5" />
        <circle cx="548" cy="96" r="4" fill="none" stroke="var(--color-warn)" />
        <circle cx="574" cy="96" r="4" fill="none" stroke="var(--color-warn)" />
        <path d="M552 96 L570 86" stroke="var(--color-warn)" strokeWidth="1.5" />
        <Label x={590} y={100} fill="var(--color-warn)">BREAKER</Label>
      </g>
      {/* classifier */}
      <rect x="500" y="205" width="130" height="80" rx="14" fill="var(--color-surface-2)" stroke="var(--color-line-strong)" />
      <text x="565" y="241" textAnchor="middle" fill="var(--color-ink)" fontSize="17" fontWeight="500" letterSpacing="-0.01em">
        classify
      </text>
      <Label x={565} y={263} anchor="middle">BATCH · DEDUP</Label>
      {/* retry loop */}
      <path d="M565 285 C 565 410, 160 410, 110 336" stroke="var(--color-warn)" strokeOpacity="0.7" strokeWidth="1.25" strokeDasharray="4 6" fill="none" />
      <Label x={330} y={420} anchor="middle" fill="var(--color-warn)">RETRY · RESUME</Label>
      {/* verify */}
      <path d="M630 245 H 668" stroke="var(--color-verify)" strokeWidth="1.5" />
      <circle cx="704" cy="245" r="36" fill="var(--color-surface-2)" stroke="var(--color-verify)" strokeOpacity="0.7" />
      <circle cx="704" cy="245" r="48" fill="none" stroke="var(--color-verify)" strokeOpacity="0.25" className="art-blink" />
      <path d="M690 246 l10 10 l19 -22" stroke="var(--color-verify-soft)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Label x={704} y={316} anchor="middle" fill="var(--color-verify-soft)">VERIFIED</Label>
      <path d="M740 245 H 800" stroke="var(--color-verify)" strokeWidth="1.5" />
    </Frame>
  );
}

const telemetry = (() => {
  const rand = mulberry32(42);
  const pts: { x: number; y: number }[] = [];
  let v = 0;
  for (let i = 0; i <= 120; i++) {
    const x = 50 + (i / 120) * 700;
    v = v * 0.82 + (rand() - 0.5) * 14;
    const drift = i > 78 ? Math.pow((i - 78) / 22, 2) * 70 : 0;
    const y = 280 + Math.sin(i / 9) * 18 + v - drift;
    pts.push({ x, y });
  }
  return pts;
})();

function SenseMindsArt() {
  const line = telemetry.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const upper = telemetry.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${(280 + Math.sin(i / 9) * 18 - 34).toFixed(1)}`).join(" ");
  const lowerPts = telemetry
    .map((p, i) => `L${p.x.toFixed(1)} ${(280 + Math.sin(i / 9) * 18 + 34).toFixed(1)}`)
    .reverse()
    .join(" ");
  return (
    <Frame id="art-senseminds">
      <path d={`${upper} ${lowerPts} Z`} fill="var(--color-signal)" opacity="0.08" />
      <path d={upper} stroke="var(--color-signal)" strokeOpacity="0.35" strokeDasharray="2 5" fill="none" />
      <rect x="512" y="90" width="130" height="300" fill="var(--color-warn)" opacity="0.07" />
      <path d="M512 90 V390 M642 90 V390" stroke="var(--color-warn)" strokeOpacity="0.5" strokeDasharray="3 5" />
      <path d={line} stroke="var(--color-ink-2)" strokeWidth="1.6" fill="none" />
      <path d={line} stroke="var(--color-warn)" strokeWidth="2" fill="none" pathLength={200} className="art-flow" />
      <circle cx="560" cy={telemetry[73]?.y ?? 260} r="6" fill="var(--color-warn)" className="art-blink" />
      <Label x={520} y={80} fill="var(--color-warn)">FLAG</Label>
      <path d="M716 70 V 410" stroke="var(--color-ink-3)" strokeDasharray="2 4" />
      <Label x={712} y={430} anchor="end">FAILURE</Label>
      <path d="M560 440 H 712" stroke="var(--color-warn)" strokeWidth="1.25" />
      <path d="M560 434 v12 M712 434 v12" stroke="var(--color-warn)" />
      <Label x={636} y={466} anchor="middle" fill="var(--color-warn)">LEAD TIME</Label>
      {/* attribution bars */}
      <g transform="translate(64 84)">
        <Label x={0} y={0}>WHY</Label>
        {[0.92, 0.55, 0.28].map((v, i) => (
          <g key={i} transform={`translate(0 ${18 + i * 20})`}>
            <rect width={v * 150} height="8" rx="2" fill={i === 0 ? "var(--color-verify)" : "var(--color-line-strong)"} />
          </g>
        ))}
      </g>
      <path d="M50 400 H750" stroke="var(--color-line-strong)" />
    </Frame>
  );
}

function FinancialArt() {
  const xs = [110, 250, 390, 530, 670];
  const names = ["intent", "entities", "sql", "guard", "answer"];
  return (
    <Frame id="art-financial">
      {xs.slice(0, -1).map((x, i) => (
        <g key={x}>
          <path d={`M${x + 26} 210 H${(xs[i + 1] ?? x) - 26}`} stroke="var(--color-line-strong)" strokeWidth="1.5" />
          <path
            d={`M${x + 26} 210 H${(xs[i + 1] ?? x) - 26}`}
            stroke="var(--color-verify-soft)"
            strokeWidth="2"
            pathLength={200}
            className="art-flow"
            style={{ animationDelay: `${i * -0.7}s` }}
          />
          {i < 4 ? (
            <path d={`M${x} 236 C ${x} 330, 360 330, 390 362`} stroke="var(--color-warn)" strokeOpacity="0.45" strokeDasharray="3 6" fill="none" />
          ) : null}
        </g>
      ))}
      {xs.map((x, i) =>
        i === 3 ? (
          <g key={x}>
            <path
              d={`M${x} 182 l24 9 v20 c0 14 -10 24 -24 30 c-14 -6 -24 -16 -24 -30 v-20 z`}
              fill="var(--color-surface-2)"
              stroke="var(--color-verify)"
              strokeWidth="1.5"
            />
            <path d={`M${x - 8} 210 l6 6 l11 -12`} stroke="var(--color-verify-soft)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <Label x={x} y={268} anchor="middle" fill="var(--color-verify-soft)">{names[i]?.toUpperCase()}</Label>
          </g>
        ) : (
          <g key={x}>
            <circle cx={x} cy="210" r="24" fill="var(--color-surface-2)" stroke="var(--color-line-strong)" />
            <circle cx={x} cy="210" r="5" fill={i === 4 ? "var(--color-verify)" : "var(--color-signal)"} />
            <Label x={x} y={268} anchor="middle">{names[i]?.toUpperCase()}</Label>
          </g>
        ),
      )}
      <rect x="350" y="362" width="80" height="34" rx="8" fill="var(--color-surface-2)" stroke="var(--color-warn)" strokeOpacity="0.6" />
      <Label x={390} y={384} anchor="middle" fill="var(--color-warn)">ERROR</Label>
      <g transform="translate(468 70)">
        <rect width="290" height="78" rx="10" fill="var(--color-surface-2)" stroke="var(--color-line-strong)" />
        <text x="16" y="31" fill="var(--color-ink-2)" fontFamily={mono} fontSize="12.5">
          SELECT symbol, close
        </text>
        <text x="16" y="52" fill="var(--color-ink-2)" fontFamily={mono} fontSize="12.5">
          FROM stock_prices …
        </text>
        <path d="M262 30 l6 6 l11 -12" stroke="var(--color-verify-soft)" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      <g transform="translate(40 70)">
        <rect width="250" height="56" rx="10" fill="var(--color-surface-2)" stroke="var(--color-warn)" strokeOpacity="0.45" />
        <text x="16" y="34" fill="var(--color-warn)" fontFamily={mono} fontSize="12.5" textDecoration="line-through">
          ; DROP TABLE stocks
        </text>
        <path d="M224 22 l12 12 M236 22 l-12 12" stroke="var(--color-warn)" strokeWidth="2" strokeLinecap="round" />
      </g>
    </Frame>
  );
}

const embedding = (() => {
  const rand = mulberry32(9);
  return Array.from({ length: 78 }, () => {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand());
    return { x: 250 + Math.cos(a) * r * 190, y: 250 + Math.sin(a) * r * 150 };
  });
})();

function RagArt() {
  const q = { x: 300, y: 225 };
  const nearest = [...embedding]
    .sort((a, b) => (a.x - q.x) ** 2 + (a.y - q.y) ** 2 - ((b.x - q.x) ** 2 + (b.y - q.y) ** 2))
    .slice(0, 5);
  const arc = (from: number, to: number, r: number) => {
    const p = (t: number) => ({ x: 620 + Math.cos(Math.PI + t * Math.PI) * r, y: 300 + Math.sin(Math.PI + t * Math.PI) * r });
    const a = p(from);
    const b = p(to);
    return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${r} ${r} 0 0 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  };
  return (
    <Frame id="art-rag">
      {embedding.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.4" fill="var(--color-ink-3)" opacity="0.6" />
      ))}
      {nearest.map((p, i) => (
        <g key={i}>
          <path d={`M${q.x} ${q.y} L${p.x} ${p.y}`} stroke="var(--color-verify)" strokeOpacity="0.5" />
          <circle cx={p.x} cy={p.y} r="7" fill="none" stroke="var(--color-verify)" />
        </g>
      ))}
      <circle cx={q.x} cy={q.y} r="7" fill="var(--color-signal)" />
      <circle cx={q.x} cy={q.y} r="16" fill="none" stroke="var(--color-signal)" strokeOpacity="0.4" className="art-blink" />
      <Label x={q.x + 22} y={q.y - 14} fill="var(--color-signal-soft)">QUERY</Label>
      <Label x={70} y={440}>TOP-5 · SUBJECT FILTER</Label>
      <path d="M470 250 C 520 250, 520 300, 560 300" stroke="var(--color-line-strong)" fill="none" />
      <path d={arc(0, 1, 110)} stroke="var(--color-line-strong)" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d={arc(0.5, 0.7, 110)} stroke="var(--color-verify)" strokeOpacity="0.45" strokeWidth="10" fill="none" />
      <path d={arc(0.7, 1, 110)} stroke="var(--color-verify)" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M620 300 L 700 238" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="620" cy="300" r="7" fill="var(--color-ink)" />
      <Label x={510} y={330}>LOW</Label>
      <Label x={620} y={170} anchor="middle">MED ≥ 0.5</Label>
      <Label x={730} y={330} anchor="end" fill="var(--color-verify-soft)">HIGH ≥ 0.7</Label>
      <Label x={620} y={370} anchor="middle">CONFIDENCE</Label>
    </Frame>
  );
}

function LegalArt() {
  const doc = [0.92, 0.84, 0.95, 0.62, 0.9, 0.88, 0.7, 0.93, 0.8, 0.9, 0.55, 0.86];
  const summary = [0.9, 0.76, 0.88, 0.64, 0.5];
  return (
    <Frame id="art-legal">
      <rect x="60" y="70" width="250" height="360" rx="14" fill="var(--color-surface-2)" stroke="var(--color-line-strong)" />
      {doc.map((v, i) => (
        <rect
          key={i}
          x="84"
          y={102 + i * 25}
          width={v * 200}
          height="8"
          rx="3"
          fill={i === 2 || i === 7 ? "var(--color-verify)" : "var(--color-line-strong)"}
          opacity={i === 2 || i === 7 ? 0.9 : 1}
        />
      ))}
      <Label x={60} y={456}>JUDGMENT · 40 PP.</Label>
      {/* flow sits under the stage boxes so the pulse passes behind them */}
      <path d="M310 250 H360 M432 250 H452 M524 250 H560" stroke="var(--color-line-strong)" strokeWidth="1.5" />
      <path d="M310 250 H560" stroke="var(--color-verify-soft)" strokeWidth="2" pathLength={200} className="art-flow" />
      {[
        { x: 360, t: "1.1B" },
        { x: 452, t: "2B" },
      ].map((s, i) => (
        <g key={s.t}>
          <rect x={s.x} y="222" width="72" height="56" rx="12" fill="var(--color-surface-2)" stroke={i ? "var(--color-verify)" : "var(--color-signal)"} />
          <text x={s.x + 36} y="256" textAnchor="middle" fill="var(--color-ink)" fontFamily={mono} fontSize="15">
            {s.t}
          </text>
          <Label x={s.x + 36} y={300} anchor="middle">{`STAGE ${i + 1}`}</Label>
        </g>
      ))}
      <rect x="560" y="150" width="200" height="200" rx="14" fill="var(--color-surface-2)" stroke="var(--color-verify)" strokeOpacity="0.6" />
      {summary.map((v, i) => (
        <rect key={i} x="582" y={182 + i * 28} width={v * 156} height="8" rx="3" fill={i === 0 ? "var(--color-verify)" : "var(--color-ink-3)"} />
      ))}
      <Label x={560} y={376} fill="var(--color-verify-soft)">EXTRACTIVE + ABSTRACTIVE</Label>
    </Frame>
  );
}

function TrafficArt() {
  // queues and the controller's own formula (0.6·count + 0.3·wait + 0.1·since-green)
  const approaches = [
    { k: "N", count: 3, wait: 18, since: 40, zone: "M370 60 H430 V170 H370 Z", dots: [[385, 90], [415, 115], [392, 145]] },
    { k: "E", count: 7, wait: 26, since: 55, zone: "M470 220 H660 V280 H470 Z", dots: [[490, 238], [520, 262], [548, 236], [575, 258], [603, 240], [628, 262], [650, 244]] },
    { k: "S", count: 2, wait: 9, since: 30, zone: "M370 330 H430 V440 H370 Z", dots: [[392, 360], [412, 405]] },
    { k: "W", count: 4, wait: 14, since: 25, zone: "M140 220 H330 V280 H140 Z", dots: [[160, 240], [210, 262], [250, 236], [300, 258]] },
  ];
  const prio = approaches.map((a) => 0.6 * a.count + 0.3 * a.wait + 0.1 * a.since);
  const max = Math.max(...prio);
  return (
    <Frame id="art-traffic">
      <rect x="340" y="40" width="120" height="420" fill="var(--color-surface-2)" />
      <rect x="120" y="190" width="560" height="120" fill="var(--color-surface-2)" />
      <path d="M400 40 V190 M400 310 V460 M120 250 H340 M460 250 H680" stroke="var(--color-line-strong)" strokeDasharray="8 10" />
      {approaches.map((a, i) => (
        <g key={a.k}>
          <path d={a.zone} fill={a.k === "E" ? "var(--color-signal)" : "var(--color-ink-3)"} opacity={a.k === "E" ? 0.16 : 0.08} />
          <path d={a.zone} fill="none" stroke={a.k === "E" ? "var(--color-signal)" : "var(--color-line-strong)"} strokeDasharray="4 4" />
          {a.dots.map(([x, y], j) => (
            <rect key={j} x={(x ?? 0) - 6} y={(y ?? 0) - 6} width="12" height="12" rx="3" fill={a.k === "E" ? "var(--color-signal-soft)" : "var(--color-ink-3)"} />
          ))}
          <g transform={`translate(700 ${150 + i * 50})`}>
            <Label x={0} y={4} fill={a.k === "E" ? "var(--color-signal-soft)" : "var(--color-ink-3)"}>{a.k}</Label>
            <rect x="18" y="-6" width={((prio[i] ?? 0) / max) * 70} height="10" rx="2" fill={a.k === "E" ? "var(--color-signal)" : "var(--color-line-strong)"} />
          </g>
        </g>
      ))}
      <circle cx="680" cy="250" r="7" fill="var(--color-signal)" className="art-blink" />
      <Label x={700} y={128}>PRIORITY</Label>
      <Label x={140} y={176}>ZONE · COUNT ON ENTRY</Label>
    </Frame>
  );
}

const arts: Record<string, () => ReactNode> = {
  sighnal: SighnalArt,
  "senseminds-360": SenseMindsArt,
  "financial-agents": FinancialArt,
  "agentic-rag": RagArt,
  "legal-summarization": LegalArt,
  "smart-traffic": TrafficArt,
};

export function ProjectArt({ slug }: { slug: string }) {
  const Art = arts[slug];
  return Art ? <Art /> : null;
}
