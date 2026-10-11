"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { navItems } from "@/content/site";
import { BriefDialog } from "@/components/brief/BriefDialog";
import type { BriefData } from "@/components/brief/types";
import { ArrowUpRight, CloseIcon, DocIcon, SparkIcon } from "@/components/ui/Icons";
import { LogoMark } from "./Logo";

function lockScroll(lock: boolean) {
  document.documentElement.style.overflow = lock ? "hidden" : "";
}

export function SiteHeader({ brief }: { brief: BriefData }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);
  const briefRef = useRef<HTMLDialogElement>(null);
  const menuRef = useRef<HTMLDialogElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const focusWithin = useRef(false);

  // Scroll state: elevate after a few pixels, tuck away when reading downwards.
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 12);
      if (y < 240 || focusWithin.current) setHidden(false);
      else if (y > lastY + 6) setHidden(true);
      else if (y < lastY - 6) setHidden(false);
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Active section tracking (home page only).
  useEffect(() => {
    if (!isHome) return;
    const sections = navItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        const current = navItems.find((n) => visible.get(n.id));
        setActive(current ? current.id : null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  const current = isHome ? active : null;

  // Slide the single indicator under the active link (reads layout once per change).
  useEffect(() => {
    const list = navRef.current;
    const link = current ? list?.querySelector<HTMLAnchorElement>(`a[data-nav="${current}"]`) : null;
    const next = link ? { x: link.offsetLeft, w: link.offsetWidth } : null;
    const id = requestAnimationFrame(() => setIndicator(next));
    return () => cancelAnimationFrame(id);
  }, [current]);

  const openBrief = useCallback(() => {
    menuRef.current?.close();
    briefRef.current?.showModal();
    lockScroll(true);
  }, []);
  const closeBrief = useCallback(() => briefRef.current?.close(), []);
  const openMenu = useCallback(() => {
    menuRef.current?.showModal();
    lockScroll(true);
  }, []);
  const closeMenu = useCallback(() => menuRef.current?.close(), []);

  useEffect(() => {
    const dialogs = [briefRef.current, menuRef.current].filter((d): d is HTMLDialogElement => d !== null);
    const onClose = () => {
      if (!dialogs.some((d) => d.open)) lockScroll(false);
    };
    dialogs.forEach((d) => d.addEventListener("close", onClose));
    return () => dialogs.forEach((d) => d.removeEventListener("close", onClose));
  }, []);

  // Close the mobile menu after client-side navigation.
  useEffect(() => {
    menuRef.current?.close();
  }, [pathname]);

  const href = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <header
        className={`no-print fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-out-expo ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${scrolled ? "border-b border-line/80 bg-bg/80 backdrop-blur-xl" : "border-b border-transparent"}`}
        onFocusCapture={() => {
          focusWithin.current = true;
          setHidden(false);
        }}
        onBlurCapture={() => {
          focusWithin.current = false;
        }}
      >
        <div className="container-page flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href="/" className="group flex items-center gap-3" aria-label="Sree Charan Chintalapudi — home">
            <LogoMark />
            <span className="hidden text-[0.95rem] font-medium tracking-[-0.01em] sm:block">
              Sree Charan
              <span className="ml-2 font-mono text-[0.72rem] tracking-[0.08em] text-ink-3 uppercase">AI Engineer</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul ref={navRef} className="relative flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={href(item.id)}
                    data-nav={item.id}
                    aria-current={current === item.id ? "true" : undefined}
                    className={`relative block rounded-full px-3.5 py-2 text-[0.9rem] transition-colors duration-200 ${
                      current === item.id ? "text-ink" : "text-ink-2 hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-0.5 left-0 h-px bg-signal transition-[transform,width,opacity] duration-500 ease-out-expo"
                style={{
                  width: indicator ? indicator.w - 28 : 0,
                  transform: `translateX(${indicator ? indicator.x + 14 : 0}px)`,
                  opacity: indicator ? 1 : 0,
                }}
              />
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openBrief}
              className="group hidden min-h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-[0.88rem] text-ink-2 transition-colors hover:border-ink-3 hover:text-ink sm:inline-flex"
              aria-haspopup="dialog"
            >
              <SparkIcon size={14} className="text-verify-soft" />
              30-sec brief
            </button>
            <Link
              href={brief.resume}
              className="hidden min-h-10 items-center gap-2 rounded-full bg-ink px-4 text-[0.88rem] font-medium text-bg transition-colors hover:bg-white sm:inline-flex"
            >
              <DocIcon size={14} />
              Résumé
            </Link>
            <button
              type="button"
              onClick={openMenu}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-[0.88rem] lg:hidden"
              aria-haspopup="dialog"
            >
              <span aria-hidden className="flex flex-col gap-[4px]">
                <span className="h-px w-4 bg-current" />
                <span className="h-px w-4 bg-current" />
              </span>
              Menu
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={menuRef}
        aria-label="Site menu"
        className="dialog-anim no-print m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-ink"
      >
        <div className="container-page flex h-full flex-col">
          <div className="flex h-[var(--header-h)] items-center justify-between">
            <Link href="/" onClick={closeMenu} className="flex items-center gap-3" aria-label="Home">
              <LogoMark />
              <span className="text-[0.95rem] font-medium">Sree Charan</span>
            </Link>
            <button
              type="button"
              onClick={closeMenu}
              className="grid size-11 place-items-center rounded-full border border-line-strong"
              aria-label="Close menu"
            >
              <CloseIcon size={16} />
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-6 flex-1">
            <ul className="border-t border-line">
              {navItems.map((item, i) => (
                <li key={item.id} className="border-b border-line">
                  <a
                    href={href(item.id)}
                    onClick={closeMenu}
                    className="flex items-baseline justify-between py-4 font-display text-step-3"
                  >
                    {item.label}
                    <span className="font-mono text-[0.75rem] tracking-[0.08em] text-ink-3">0{i + 1}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="grid gap-3 pb-8 pt-6">
            <button
              type="button"
              onClick={openBrief}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-line-strong"
            >
              <SparkIcon size={14} className="text-verify-soft" /> 30-second brief
            </button>
            <Link
              href={brief.resume}
              onClick={closeMenu}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink font-medium text-bg"
            >
              <DocIcon size={15} /> Résumé
            </Link>
            <div className="mt-2 flex justify-center gap-6 text-ink-2">
              {brief.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 py-2">
                  {l.label} <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </dialog>

      <BriefDialog ref={briefRef} data={brief} onClose={closeBrief} />
    </>
  );
}
