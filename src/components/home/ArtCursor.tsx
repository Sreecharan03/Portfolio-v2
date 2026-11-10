"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "@/components/ui/Icons";

/**
 * A "View case study" chip that follows the pointer over a project's art (mouse only).
 * It eases toward the pointer each frame while visible and stops its loop when hidden.
 * Decorative: the card's title link and button carry the accessible names.
 */
export function ArtCursor() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const chip = ref.current;
    const host = chip?.parentElement;
    if (!chip || !host || !window.matchMedia("(pointer: fine)").matches) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    const pos = { x: 0, y: 0, tx: 0, ty: 0 };
    const place = () => {
      chip.style.translate = `${pos.x.toFixed(1)}px ${pos.y.toFixed(1)}px`;
    };
    const tick = () => {
      pos.x += (pos.tx - pos.x) * 0.18;
      pos.y += (pos.ty - pos.y) * 0.18;
      place();
      frame = Math.abs(pos.tx - pos.x) + Math.abs(pos.ty - pos.y) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const target = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pos.tx = e.clientX - r.left;
      pos.ty = e.clientY - r.top;
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target(e);
      pos.x = pos.tx;
      pos.y = pos.ty;
      place();
      chip.dataset.visible = "";
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target(e);
      if (still) {
        pos.x = pos.tx;
        pos.y = pos.ty;
        place();
      } else if (!frame) frame = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      delete chip.dataset.visible;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className="art-cursor pointer-events-none absolute left-0 top-0 z-10 hidden items-center gap-1.5 whitespace-nowrap rounded-full bg-ink px-3.5 py-2 text-[0.8rem] font-medium text-bg shadow-[0_12px_40px_-12px_rgba(100,149,255,0.6)] [@media(pointer:fine)]:inline-flex"
    >
      View case study <ArrowUpRight size={12} />
    </span>
  );
}
