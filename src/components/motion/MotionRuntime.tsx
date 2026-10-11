"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    __motionReady?: boolean;
  }
}

type Gsap = typeof import("gsap").gsap;

const EASE = "expo.out";

function onIdle(cb: () => void, timeout = 1200): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(cb, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(cb, 200);
  return () => window.clearTimeout(id);
}

/**
 * One runtime for scroll choreography. Elements opt in declaratively:
 *   data-reveal="up" | "lines" | "stagger" | "mask" | "draw"
 *   data-count="1898" data-display="1,898"   counts up once, then shows the exact display string
 *   data-scrub-line                         scaleY follows its parent's scroll progress
 *   data-art                                CSS loops paused while off-screen
 *
 * Cost model: nothing runs before first paint. GSAP core loads when the
 * browser is idle; each element is animated only when it approaches the
 * viewport (IntersectionObserver, no per-frame scroll work); SplitText loads
 * only when the first heading needs it. Reduced motion, a failed import or a
 * runtime that never starts all leave content visible.
 */
export function MotionRuntime() {
  const pathname = usePathname();

  // Decorative loops: pause off-screen. Cheap, so it runs immediately (and with reduced motion,
  // where the CSS already disables the loops).
  useEffect(() => {
    const arts = Array.from(document.querySelectorAll<HTMLElement>("[data-art]"));
    arts.forEach((el) => el.setAttribute("data-art-paused", ""));
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) e.target.removeAttribute("data-art-paused");
        else e.target.setAttribute("data-art-paused", "");
      }
    });
    arts.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    window.__motionReady = true;
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("motion-off");
      return;
    }

    let cancelled = false;
    let dispose: (() => void) | undefined;
    const cancelIdle = onIdle(async () => {
      try {
        const { gsap } = await import("gsap");
        if (cancelled) return;
        dispose = setup(gsap, () => cancelled);
      } catch {
        root.classList.add("motion-off");
      }
    });

    return () => {
      cancelled = true;
      cancelIdle();
      dispose?.();
    };
  }, [pathname]);

  return null;
}

function setup(gsap: Gsap, isCancelled: () => boolean): () => void {
  const disposers: (() => void)[] = [];
  const tweens: { kill: () => void }[] = [];
  let splitText: Promise<typeof import("gsap/SplitText")> | null = null;

  const revealLines = async (el: HTMLElement) => {
    splitText ??= import("gsap/SplitText");
    try {
      const { SplitText } = await splitText;
      if (isCancelled()) return;
      gsap.registerPlugin(SplitText);
      gsap.set(el, { opacity: 1 });
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, { yPercent: 110, duration: 1.2, ease: EASE, stagger: 0.09 });
        },
      });
      disposers.push(() => split.revert());
    } catch {
      gsap.set(el, { opacity: 1 });
    }
  };

  const reveal = (el: HTMLElement, order: number) => {
    const delay = Math.min(order, 6) * 0.08;
    switch (el.dataset.reveal) {
      case "lines":
        void revealLines(el);
        break;
      case "stagger":
        gsap.set(el, { opacity: 1 });
        tweens.push(gsap.fromTo(el.children, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1, ease: EASE, stagger: 0.07, delay }));
        break;
      case "mask":
        gsap.set(el, { opacity: 1 });
        tweens.push(
          gsap.fromTo(
            el,
            { clipPath: "inset(12% 0% 12% 0% round 18px)", scale: 0.97 },
            { clipPath: "inset(0% 0% 0% 0% round 18px)", scale: 1, duration: 1.4, ease: EASE, delay, clearProps: "clipPath,scale" },
          ),
        );
        break;
      case "draw":
        gsap.set(el, { opacity: 1 });
        tweens.push(gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center", duration: 1.6, ease: EASE, delay }));
        break;
      default:
        tweens.push(gsap.fromTo(el, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1.1, ease: EASE, delay }));
    }
  };

  const countUp = (el: HTMLElement) => {
    const target = Number(el.dataset.count);
    const display = el.dataset.display ?? el.textContent ?? "";
    if (!Number.isFinite(target)) return;
    const state = { v: 0 };
    el.textContent = "0";
    tweens.push(
      gsap.to(state, {
        v: target,
        duration: target > 100 ? 1.8 : 1.2,
        ease: "power3.out",
        onUpdate: () => {
          el.textContent = Math.round(state.v).toLocaleString("en-US");
        },
        onComplete: () => {
          el.textContent = display;
        },
      }),
    );
  };

  // Reveal on approach. Entries arriving together get a short stagger.
  const io = new IntersectionObserver(
    (entries) => {
      let order = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        if (el.dataset.reveal) reveal(el, order++);
        if (el.dataset.count !== undefined) countUp(el);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  document.querySelectorAll<HTMLElement>("[data-reveal], [data-count]").forEach((el) => io.observe(el));
  disposers.push(() => io.disconnect());

  // Scroll-linked progress lines: listen to scroll only while the track is on screen.
  for (const line of Array.from(document.querySelectorAll<HTMLElement>("[data-scrub-line]"))) {
    const track = line.parentElement;
    if (!track) continue;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.7 - r.top) / (r.height + vh * 0.1)));
      line.style.transform = `scaleY(${p.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    line.style.transformOrigin = "top center";
    line.style.transition = "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)";
    update();
    const watch = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) window.addEventListener("scroll", onScroll, { passive: true });
      else window.removeEventListener("scroll", onScroll);
    });
    watch.observe(track);
    disposers.push(() => {
      watch.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    });
  }

  return () => {
    tweens.forEach((t) => t.kill());
    disposers.forEach((d) => d());
  };
}
