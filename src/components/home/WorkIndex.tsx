"use client";

import { useEffect, useState } from "react";

interface Item {
  slug: string;
  index: string;
  title: string;
  category: string;
}

/** Sticky project index that follows the reader through the work section. */
export function WorkIndex({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = items
      .map((it) => document.getElementById(`work-${it.slug}`))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = els.indexOf(entry.target as HTMLElement);
          if (i >= 0) setActive(i);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const progress = items.length > 1 ? active / (items.length - 1) : 0;

  return (
    <nav aria-label="Projects in this section" className="sticky top-[calc(var(--header-h)+2.5rem)]">
      <p className="label-mono text-ink-3">Index</p>
      <div className="relative mt-5 pl-5">
        <span aria-hidden className="absolute left-0 top-1 bottom-1 w-px bg-line" />
        <span
          aria-hidden
          className="absolute left-0 top-1 w-px origin-top bg-signal transition-transform duration-700 ease-out-expo"
          style={{ height: "calc(100% - 0.5rem)", transform: `scaleY(${Math.max(0.04, progress)})` }}
        />
        <ol className="space-y-1">
          {items.map((it, i) => (
            <li key={it.slug}>
              <a
                href={`#work-${it.slug}`}
                aria-current={i === active ? "true" : undefined}
                className={`group block rounded-lg py-2 pr-2 transition-colors duration-300 ${
                  i === active ? "text-ink" : "text-ink-3 hover:text-ink-2"
                }`}
              >
                <span className="flex items-baseline gap-3">
                  <span className={`font-mono text-[0.72rem] ${i === active ? "text-signal-soft" : ""}`}>{it.index}</span>
                  <span className="text-[0.95rem] leading-snug tracking-[-0.01em]">{it.title}</span>
                </span>
                <span
                  className={`ml-8 block overflow-hidden text-[0.78rem] text-ink-3 transition-[max-height,opacity] duration-500 ease-out-expo ${
                    i === active ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {it.category}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
