"use client";

import { useEffect, useState } from "react";

/** Sticky chapter list for case studies; highlights the chapter in view. */
export function ChapterNav({ chapters }: { chapters: { id: string; label: string }[] }) {
  const [active, setActive] = useState(chapters[0]?.id ?? "");

  useEffect(() => {
    const els = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [chapters]);

  const index = Math.max(0, chapters.findIndex((c) => c.id === active));

  return (
    <nav aria-label="Chapters" className="sticky top-[calc(var(--header-h)+2rem)]">
      <p className="label-mono text-ink-3">Chapters</p>
      <ol className="relative mt-4 border-l border-line">
        <span
          aria-hidden
          className="absolute -left-px top-0 w-px bg-signal transition-[height] duration-500 ease-out-expo"
          style={{ height: `${((index + 1) / chapters.length) * 100}%` }}
        />
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              aria-current={c.id === active ? "true" : undefined}
              className={`flex items-baseline gap-3 py-1.5 pl-4 text-[0.88rem] transition-colors duration-300 ${
                c.id === active ? "text-ink" : "text-ink-3 hover:text-ink-2"
              }`}
            >
              <span className="font-mono text-[0.7rem]">{String(i + 1).padStart(2, "0")}</span>
              {c.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
