import Link from "next/link";
import { site, resumeLink } from "@/content/site";
import { ArrowUpRight } from "@/components/ui/Icons";
import { LogoMark } from "./Logo";

/** Signals from many sources converge on one verified output — the site's motif, closing. */
function Convergence() {
  const lines = Array.from({ length: 14 }, (_, i) => {
    const y = 8 + i * 9;
    return `M0 ${y} C 520 ${y}, 760 66, 1160 66`;
  });
  return (
    <svg
      viewBox="0 0 1200 132"
      preserveAspectRatio="none"
      className="h-24 w-full sm:h-32"
      aria-hidden
      focusable={false}
      data-art
    >
      <defs>
        <linearGradient id="conv-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--color-line-strong)" stopOpacity="0" />
          <stop offset="0.55" stopColor="var(--color-line-strong)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--color-signal)" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="conv-pulse" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0.25" stopColor="var(--color-signal-soft)" stopOpacity="0" />
          <stop offset="0.7" stopColor="var(--color-signal-soft)" stopOpacity="1" />
        </linearGradient>
      </defs>
      {lines.map((d, i) => (
        <path key={i} d={d} stroke="url(#conv-fade)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
      ))}
      {lines.filter((_, i) => i % 4 === 1).map((d, i) => (
        <path
          key={`p${i}`}
          d={d}
          pathLength={200}
          className="art-flow"
          style={{ animationDelay: `${i * -1.1}s` }}
          stroke="url(#conv-pulse)"
          strokeWidth="1.5"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="no-print relative mt-0 border-t border-line">
      <div className="relative container-page">
        <div className="pointer-events-none relative -mx-[var(--page-x)] overflow-hidden">
          <Convergence />
          <span
            aria-hidden
            className="absolute right-[calc(3.333%-9px)] top-1/2 size-[18px] -translate-y-1/2 rounded-full border border-verify/60 bg-bg"
          >
            <span className="absolute inset-[4px] rounded-full bg-verify" />
          </span>
        </div>

        <div className="grid gap-10 pb-12 pt-4 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-3" aria-label="Home">
              <LogoMark />
              <span className="font-medium">{site.name}</span>
            </Link>
            <p className="mt-4 max-w-[44ch] text-step--1 text-ink-2">{site.positioning}</p>
          </div>

          <nav aria-label="Footer" className="md:col-span-4">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-step--1">
              <li>
                <Link href="/#work" className="link-underline text-ink-2 hover:text-ink">
                  Selected work
                </Link>
              </li>
              <li>
                <a {...resumeLink()} className="link-underline text-ink-2 hover:text-ink">
                  Résumé
                </a>
              </li>
              <li>
                <Link href="/#achievements" className="link-underline text-ink-2 hover:text-ink">
                  Achievements
                </Link>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="link-underline text-ink-2 hover:text-ink">
                  Email
                </a>
              </li>
              {site.socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-ink-2 hover:text-ink"
                  >
                    <span className="link-underline">{s.label}</span>
                    <ArrowUpRight size={12} className="arrow-nudge arrow-nudge-diag" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-step--1 text-ink-3 md:col-span-3 md:text-right">
            <p>Every number on this site is labelled with its source.</p>
            <p className="mt-2">
              © {year} {site.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
