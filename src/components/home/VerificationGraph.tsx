"use client";

import { useEffect, useRef } from "react";
import { clamp, easeOutExpo, mulberry32 } from "@/lib/random";

/**
 * Hero visual: an agentic pipeline drawn as a 3-D graph on a 2-D canvas.
 * Signals enter wide (many inputs), narrow through reasoning and retrieval,
 * and must pass the verify layer to reach the output. Roughly one in six is
 * rejected at verification and fades out in amber.
 *
 * Canvas 2D instead of WebGL: ~40 nodes and ~90 edges don't need a GPU
 * pipeline, and this avoids a 150 KB 3-D runtime and context-loss handling.
 * The loop sleeps when the hero is off-screen or the tab is hidden; with
 * reduced motion it renders one still frame.
 */

const LAYERS = [
  { label: "Ingest", count: 13, radius: 1.0 },
  { label: "Reason", count: 10, radius: 0.8 },
  { label: "Retrieve", count: 8, radius: 0.62 },
  { label: "Verify", count: 5, radius: 0.44 },
  { label: "Respond", count: 2, radius: 0.2 },
] as const;
const VERIFY = 3;
const REJECT_RATE = 0.17;
const SEG_MS = 820;

type V3 = { x: number; y: number; z: number };

interface GNode {
  layer: number;
  base: V3;
  start: V3;
  sx: number;
  sy: number;
  s: number;
  depth: number;
  flash: number;
  flashKind: "verify" | "reject" | "out";
  out: GEdge[];
}

interface GEdge {
  a: GNode;
  b: GNode;
  heat: number;
}

interface Pulse {
  path: GNode[];
  seg: number;
  t: number;
  speed: number;
  rejected: boolean;
  dying: number; // 0 = alive; counts up when finished
  color: "signal" | "verify" | "warn";
  trail: { x: number; y: number }[];
}

const COLORS = {
  signal: [100, 149, 255],
  verify: [148, 119, 255],
  warn: [242, 166, 94],
  ink: [168, 182, 210],
} as const;

function rgba(c: readonly number[], a: number) {
  return `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;
}

function buildGraph(seed = 7) {
  const rand = mulberry32(seed);
  const nodes: GNode[] = [];
  const layers: GNode[][] = [];
  const spanX = 1.65;
  LAYERS.forEach((L, li) => {
    const row: GNode[] = [];
    const x = -spanX + (li / (LAYERS.length - 1)) * spanX * 2;
    for (let i = 0; i < L.count; i++) {
      const theta = i * 2.39996 + rand() * 0.6; // golden angle with jitter
      const r = L.radius * (0.55 + 0.45 * Math.sqrt((i + 0.5) / L.count));
      const base = {
        x: x + (rand() - 0.5) * 0.18,
        y: Math.cos(theta) * r * 0.95,
        z: Math.sin(theta) * r * 0.9,
      };
      const start = {
        x: base.x * 0.4 + (rand() - 0.5) * 2.4,
        y: base.y * 2.2 + (rand() - 0.5) * 1.2,
        z: base.z * 2 + (rand() - 0.5) * 1.6,
      };
      const n: GNode = { layer: li, base, start, sx: 0, sy: 0, s: 1, depth: 0, flash: 0, flashKind: "verify", out: [] };
      row.push(n);
      nodes.push(n);
    }
    layers.push(row);
  });

  const edges: GEdge[] = [];
  for (let li = 0; li < layers.length - 1; li++) {
    const here = layers[li] ?? [];
    const next = layers[li + 1] ?? [];
    const incoming = new Set<GNode>();
    for (const a of here) {
      const ranked = [...next].sort(
        (p, q) => dist2(a.base, p.base) - dist2(a.base, q.base),
      );
      const k = li >= VERIFY ? 1 : 2;
      for (const b of ranked.slice(0, k)) {
        const e = { a, b, heat: 0 };
        a.out.push(e);
        edges.push(e);
        incoming.add(b);
      }
    }
    for (const b of next) {
      if (incoming.has(b)) continue;
      const a = [...here].sort((p, q) => dist2(p.base, b.base) - dist2(q.base, b.base))[0];
      if (a) {
        const e = { a, b, heat: 0 };
        a.out.push(e);
        edges.push(e);
      }
    }
  }
  return { nodes, layers, edges, rand };
}

function dist2(p: V3, q: V3) {
  return (p.y - q.y) ** 2 + (p.z - q.z) ** 2;
}

function makeGlow(color: readonly number[]) {
  const c = document.createElement("canvas");
  const size = 64;
  c.width = c.height = size;
  const g = c.getContext("2d");
  if (!g) return c;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, rgba(color, 0.95));
  grad.addColorStop(0.18, rgba(color, 0.55));
  grad.addColorStop(0.5, rgba(color, 0.12));
  grad.addColorStop(1, rgba(color, 0));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export function VerificationGraph({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !host || !ctx) return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduce = reduceQuery.matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const { nodes, layers, edges, rand } = buildGraph();
    const glows = { signal: makeGlow(COLORS.signal), verify: makeGlow(COLORS.verify), warn: makeGlow(COLORS.warn) };
    const mono =
      getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim() || "ui-monospace, monospace";

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let visible = true;
    let last = 0;
    let spawnClock = 0;
    let t0 = performance.now();
    let started = false; // the loop waits for the first idle period so it never competes with first paint
    let throttled = false; // drop to ~30 fps if frames prove expensive on this device
    let costEma = 0;
    let frames = 0;
    let cancelIdle = () => {};
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const pulses: Pulse[] = [];

    const resize = () => {
      const rect = host.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, w < 640 ? 1.75 : 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!running) draw(performance.now(), 0);
    };

    const spawn = () => {
      const first = layers[0];
      if (!first || first.length === 0) return;
      let node = first[Math.floor(rand() * first.length)];
      if (!node) return;
      const path: GNode[] = [node];
      while (node && node.out.length) {
        const e: GEdge | undefined = node.out[Math.floor(rand() * node.out.length)];
        if (!e) break;
        node = e.b;
        path.push(node);
      }
      pulses.push({
        path,
        seg: 0,
        t: 0,
        speed: 0.85 + rand() * 0.35,
        rejected: rand() < REJECT_RATE,
        dying: 0,
        color: "signal",
        trail: [],
      });
    };

    const project = (now: number) => {
      const intro = reduce ? 1 : clamp((now - t0) / 1700, 0, 1);
      const time = reduce ? 0 : now - t0;
      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;
      const yaw = -0.32 + Math.sin(time * 0.00011) * 0.16 + pointer.x * 0.22;
      const pitch = -0.16 + Math.sin(time * 0.00008) * 0.05 + pointer.y * 0.12;
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const narrow = w < 640;
      const S = narrow ? Math.min(w * 0.235, h * 0.4) : Math.min(w * 0.205, h * 0.32);
      const cx = narrow ? w * 0.5 : w * 0.54;
      const cyScreen = h * (narrow ? 0.44 : 0.45);
      const D = 4.4;
      for (const n of nodes) {
        const local = easeOutExpo(clamp(intro * 1.25 - n.layer * 0.06, 0, 1));
        const x0 = n.start.x + (n.base.x - n.start.x) * local;
        const y0 = n.start.y + (n.base.y - n.start.y) * local;
        const z0 = n.start.z + (n.base.z - n.start.z) * local;
        const x1 = x0 * cy + z0 * sy;
        const z1 = -x0 * sy + z0 * cy;
        const y2 = y0 * cp - z1 * sp;
        const z2 = y0 * sp + z1 * cp;
        const s = D / (D - z2);
        n.sx = cx + x1 * s * S;
        n.sy = cyScreen - y2 * s * S;
        n.s = s;
        n.depth = clamp((z2 + 1.2) / 2.4, 0, 1);
      }
      return intro;
    };

    const draw = (now: number, dt: number) => {
      const intro = project(now);
      ctx.clearRect(0, 0, w, h);
      const edgeAlpha = clamp((intro - 0.35) / 0.65, 0, 1);

      // Edges in three depth buckets, one stroke each.
      if (edgeAlpha > 0) {
        for (let b = 0; b < 3; b++) {
          ctx.beginPath();
          for (const e of edges) {
            const d = (e.a.depth + e.b.depth) / 2;
            const bucket = d < 0.33 ? 0 : d < 0.66 ? 1 : 2;
            if (bucket !== b) continue;
            ctx.moveTo(e.a.sx, e.a.sy);
            ctx.lineTo(e.b.sx, e.b.sy);
          }
          ctx.strokeStyle = rgba(COLORS.ink, (0.075 + b * 0.065) * edgeAlpha);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        // Recently travelled edges glow briefly.
        for (const e of edges) {
          if (e.heat <= 0.01) continue;
          ctx.beginPath();
          ctx.moveTo(e.a.sx, e.a.sy);
          ctx.lineTo(e.b.sx, e.b.sy);
          const toVerify = e.b.layer > VERIFY;
          ctx.strokeStyle = rgba(toVerify ? COLORS.verify : COLORS.signal, 0.32 * e.heat * edgeAlpha);
          ctx.lineWidth = 1.2;
          ctx.stroke();
          e.heat = Math.max(0, e.heat - dt * 0.0011);
        }
      }

      // Nodes.
      for (const n of nodes) {
        const a = (0.45 + n.depth * 0.55) * Math.min(1, intro * 1.6);
        const isVerify = n.layer === VERIFY;
        const isOut = n.layer === LAYERS.length - 1;
        const r = (isOut ? 3.4 : isVerify ? 2.6 : 1.7) * n.s;
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, r, 0, Math.PI * 2);
        ctx.fillStyle = isVerify ? rgba(COLORS.verify, a) : isOut ? rgba([236, 241, 255], a) : rgba(COLORS.ink, a * 0.9);
        ctx.fill();
        if (isVerify || isOut) {
          ctx.beginPath();
          ctx.arc(n.sx, n.sy, r + 4.5 * n.s, 0, Math.PI * 2);
          ctx.strokeStyle = rgba(isVerify ? COLORS.verify : COLORS.signal, 0.28 * a);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        if (n.flash > 0) {
          const col = n.flashKind === "reject" ? COLORS.warn : n.flashKind === "out" ? COLORS.signal : COLORS.verify;
          ctx.beginPath();
          ctx.arc(n.sx, n.sy, r + (1 - n.flash) * 16 * n.s, 0, Math.PI * 2);
          ctx.strokeStyle = rgba(col, n.flash * 0.8);
          ctx.lineWidth = 1.2;
          ctx.stroke();
          n.flash = Math.max(0, n.flash - dt * 0.0016);
        }
      }

      // Pulses.
      ctx.globalCompositeOperation = "lighter";
      for (const p of pulses) {
        const a = p.path[p.seg];
        const b = p.path[p.seg + 1] ?? a;
        if (!a || !b) continue;
        const x = a.sx + (b.sx - a.sx) * p.t;
        const y = a.sy + (b.sy - a.sy) * p.t;
        const fade = p.dying > 0 ? Math.max(0, 1 - p.dying / 600) : 1;
        const glow = glows[p.color];
        for (let i = 0; i < p.trail.length; i++) {
          const pt = p.trail[i];
          if (!pt) continue;
          const ta = ((i + 1) / (p.trail.length + 1)) * 0.35 * fade;
          ctx.globalAlpha = ta;
          ctx.drawImage(glow, pt.x - 6, pt.y - 6, 12, 12);
        }
        ctx.globalAlpha = fade;
        const size = 22 * (0.8 + a.s * 0.25);
        ctx.drawImage(glow, x - size / 2, y - size / 2, size, size);
        ctx.globalAlpha = 1;
        if (!reduce && dt > 0) {
          p.trail.push({ x, y });
          if (p.trail.length > 7) p.trail.shift();
        }
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      // Layer labels along the baseline.
      const labelAlpha = clamp((intro - 0.5) / 0.5, 0, 1);
      if (labelAlpha > 0 && w > 360) {
        ctx.font = `500 10px ${mono}`;
        ctx.textAlign = "center";
        const baseY = h - 18;
        layers.forEach((row, li) => {
          let sum = 0;
          for (const n of row) sum += n.sx;
          const lx = sum / Math.max(1, row.length);
          const label = LAYERS[li]?.label.toUpperCase() ?? "";
          ctx.fillStyle = li === VERIFY ? rgba(COLORS.verify, 0.9 * labelAlpha) : rgba(COLORS.ink, 0.62 * labelAlpha);
          ctx.fillText(label, lx, baseY);
          ctx.fillRect(lx - 0.5, baseY - 22, 1, 6);
        });
        ctx.fillStyle = rgba(COLORS.ink, 0.12 * labelAlpha);
        ctx.fillRect(w * 0.06, h - 38, w * 0.88, 1);
      }
    };

    const step = (now: number) => {
      raf = 0;
      if (!running) return;
      frames += 1;
      if (throttled && frames % 2 === 1) {
        raf = requestAnimationFrame(step);
        return;
      }
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      const intro = clamp((now - t0) / 1700, 0, 1);
      if (intro > 0.7) {
        spawnClock += dt;
        if (spawnClock > 380 && pulses.length < 16) {
          spawnClock = 0;
          spawn();
        }
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        if (!p) continue;
        if (p.dying > 0) {
          p.dying += dt;
          if (p.dying > 600) pulses.splice(i, 1);
          continue;
        }
        p.t += (dt / SEG_MS) * p.speed;
        if (p.t >= 1) {
          const arrived = p.path[p.seg + 1];
          const from = p.path[p.seg];
          const edge = from?.out.find((e) => e.b === arrived);
          if (edge) edge.heat = 1;
          p.seg += 1;
          p.t = 0;
          if (arrived) {
            if (arrived.layer === VERIFY) {
              arrived.flash = 1;
              if (p.rejected) {
                arrived.flashKind = "reject";
                p.color = "warn";
                p.dying = 1; // parks on the verify node and fades out
              } else {
                arrived.flashKind = "verify";
                p.color = "verify";
              }
            } else if (arrived.layer === LAYERS.length - 1) {
              arrived.flash = 1;
              arrived.flashKind = "out";
            }
          }
          if (p.dying === 0 && p.seg >= p.path.length - 1) p.dying = 1;
          if (p.dying > 0) {
            // Park the pulse on the node it reached.
            p.seg = Math.min(p.seg, p.path.length - 1);
          }
        }
      }
      const c0 = performance.now();
      draw(now, dt);
      costEma = costEma * 0.92 + (performance.now() - c0) * 0.08;
      if (!throttled && frames > 45 && costEma > 4.5) throttled = true;
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || reduce || !started) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const sync = () => (visible && document.visibilityState === "visible" ? start() : stop());

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
        sync();
      },
      { rootMargin: "80px" },
    );
    io.observe(host);
    document.addEventListener("visibilitychange", sync);

    const onPointer = (e: PointerEvent) => {
      pointer.tx = clamp(e.clientX / window.innerWidth - 0.5, -0.5, 0.5) * 2;
      pointer.ty = clamp(e.clientY / window.innerHeight - 0.5, -0.5, 0.5) * 2;
    };
    if (finePointer && !reduce) window.addEventListener("pointermove", onPointer, { passive: true });

    if (reduce) {
      // A still frame with a few signals in flight.
      for (let i = 0; i < 6; i++) spawn();
      pulses.forEach((p, i) => {
        p.seg = Math.min(i % 4, p.path.length - 2);
        p.t = 0.5;
        const next = p.path[p.seg + 1];
        if (next && next.layer > VERIFY) p.color = "verify";
      });
      draw(performance.now(), 0);
    } else {
      const begin = () => {
        started = true;
        t0 = performance.now();
        sync();
      };
      if (typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(begin, { timeout: 700 });
        cancelIdle = () => window.cancelIdleCallback(id);
      } else {
        const id = window.setTimeout(begin, 150);
        cancelIdle = () => window.clearTimeout(id);
      }
    }

    // Follow the motion preference live: freeze on a still frame, or resume.
    const onPreference = () => {
      reduce = reduceQuery.matches;
      if (reduce) {
        stop();
        draw(performance.now(), 0);
        return;
      }
      if (!started) {
        started = true;
        t0 = performance.now();
      }
      sync();
    };
    reduceQuery.addEventListener("change", onPreference);

    return () => {
      cancelIdle();
      stop();
      reduceQuery.removeEventListener("change", onPreference);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
