"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/**
 * Weighted, smooth wheel scrolling (Lenis) for mouse and trackpad users. It drives the page's
 * native scroll, so sticky elements, anchors, find-in-page and assistive tech keep working.
 * Touch devices keep their own momentum scrolling; reduced-motion users get plain scrolling
 * (Lenis follows that preference live). Dialogs, the chat log and text areas scroll natively.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      anchors: true, // in-page links glide to their section (honours scroll-padding-top)
      autoToggle: true, // pauses while a dialog locks page scroll
      stopInertiaOnNavigate: true,
      prevent: (node) =>
        node instanceof Element && node.closest("dialog[open], [data-lenis-prevent], textarea") !== null,
    });
    return () => lenis.destroy();
  }, []);
  return null;
}
