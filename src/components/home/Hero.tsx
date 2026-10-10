import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowDown, DocIcon, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/Icons";
import { resumeHref, site } from "@/content/site";
import { VerificationGraph } from "./VerificationGraph";

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

export function Hero() {
  const github = site.socials.find((s) => s.id === "github");
  const linkedin = site.socials.find((s) => s.id === "linkedin");

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-50" />
      <div
        aria-hidden
        className="absolute -z-10 right-[-18%] top-[-8%] aspect-square w-[78vw] max-w-[1100px] rounded-full bg-[radial-gradient(circle_at_center,rgba(100,149,255,0.11),rgba(148,119,255,0.05)_38%,transparent_66%)]"
      />

      <div className="container-page relative flex min-h-[100svh] flex-col pb-8 pt-[calc(var(--header-h)+2.5rem)] lg:pt-[calc(var(--header-h)+1rem)]">
        <div className="relative flex flex-1 flex-col justify-center">
          <div className="relative z-10 max-w-[44rem] lg:max-w-[52%]">
            <p className="intro-fade label-mono flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-3" style={d(0)}>
              <span className="inline-flex items-center gap-2 text-ink-2">
                <span aria-hidden className="size-1.5 rounded-full bg-verify shadow-[0_0_0_4px_rgba(148,119,255,0.18)]" />
                {site.role}
              </span>
              <span aria-hidden className="hidden h-px w-6 bg-line-strong sm:block" />
              <span>GenAI · Agentic systems · Backend · Data</span>
            </p>

            <h1 id="hero-title" className="mt-6 text-step-2 font-medium tracking-[-0.03em]">
              <span className="intro-mask">
                <span style={d(80)}>{site.name}</span>
              </span>
            </h1>

            <p className="font-display mt-3 text-step-5 lg:whitespace-nowrap">
              <span className="intro-mask">
                <span style={d(170)}>{site.tagline[0]}</span>
              </span>
              <span className="intro-mask">
                <span style={d(270)}>
                  <span className="serif-accent pr-[0.06em] text-[1.08em] tracking-[-0.02em]">{site.tagline[1]}</span>
                  <span aria-hidden className="relative ml-[0.1em] inline-block size-[0.1em] rounded-full bg-verify align-baseline shadow-[0_0_0_0.05em_rgba(148,119,255,0.22),0_0_24px_rgba(148,119,255,0.5)]" />
                </span>
              </span>
            </p>

            <p className="intro-fade mt-7 max-w-[46ch] text-[1.08rem] leading-[1.55] text-ink-2 sm:text-step-1 sm:leading-[1.5]" style={d(420)}>
              {site.lede}
            </p>

            <div className="intro-fade mt-9 flex flex-wrap items-center gap-3" style={d(520)}>
              <ButtonLink href="#work" icon={<ArrowDown size={15} />}>
                Explore work
              </ButtonLink>
              <ButtonLink href={resumeHref()} variant="secondary" icon={<DocIcon size={15} />}>
                Résumé
              </ButtonLink>
              <span aria-hidden className="mx-1 hidden h-6 w-px bg-line-strong sm:block" />
              <div className="flex items-center gap-1">
                {github ? (
                  <a
                    href={github.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub profile"
                    className="grid size-11 place-items-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                  >
                    <GitHubIcon size={18} />
                  </a>
                ) : null}
                {linkedin ? (
                  <a
                    href={linkedin.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn profile"
                    className="grid size-11 place-items-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                  >
                    <LinkedInIcon size={17} />
                  </a>
                ) : null}
                <a
                  href={`mailto:${site.email}`}
                  aria-label={`Email ${site.email}`}
                  className="grid size-11 place-items-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  <MailIcon size={18} />
                </a>
              </div>
            </div>
          </div>

          <figure className="intro-fade relative -mx-[var(--page-x)] mt-8 lg:absolute lg:inset-y-[-2rem] lg:left-[40%] lg:right-[calc(-1*var(--page-x))] lg:mx-0 lg:mt-0" style={d(200)}>
            <div className="relative h-[min(72vw,340px)] [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)] lg:absolute lg:inset-0 lg:h-auto lg:[mask-image:linear-gradient(to_right,transparent,#000_20%,#000_94%,transparent)]">
              <VerificationGraph className="h-full w-full" />
            </div>
            <figcaption className="mx-[var(--page-x)] mt-1 max-w-[40ch] font-mono text-[0.68rem] leading-relaxed tracking-[0.04em] text-ink-3 lg:absolute lg:bottom-[13%] lg:right-[var(--page-x)] lg:mx-0 lg:mt-0 lg:max-w-[34ch] lg:text-right">
              <span className="text-ink-2">Fig. 00 — Signal path.</span> Inputs fan in through reasoning and retrieval; only
              signals that pass <span className="text-verify-soft">verification</span> reach the output.
            </figcaption>
          </figure>
        </div>

        <dl
          className="intro-fade relative z-10 mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 text-step--1 md:grid-cols-4"
          style={d(640)}
        >
          {[
            ["Now", `${site.current.title} · ${site.current.org}`],
            ["Also", site.independent],
            ["Focus", site.focus],
            ["Based", site.location],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="label-mono text-ink-3">{k}</dt>
              <dd className="mt-1.5 text-ink-2">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
