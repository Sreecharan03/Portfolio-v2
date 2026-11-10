"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

const PULL = 0.3; // share of the pointer's distance from the centre
const MAX = 10; // px

function enabled() {
  return window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
}

/**
 * Pulls its child a few pixels toward the pointer and springs back on leave. Uses the
 * `translate` property, so it never fights a child's own transform (hover or press scale).
 */
export function Magnetic({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  const move = (e: PointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || !enabled()) return;
    const r = el.getBoundingClientRect();
    const clamp = (v: number) => Math.max(-MAX, Math.min(MAX, v));
    const x = clamp((e.clientX - (r.left + r.width / 2)) * PULL);
    const y = clamp((e.clientY - (r.top + r.height / 2)) * PULL);
    el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.translate = "";
  };

  return (
    <span
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      className={`inline-block transition-[translate] duration-500 ease-out-expo ${className}`}
    >
      {children}
    </span>
  );
}
