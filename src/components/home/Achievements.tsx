import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowUpRight } from "@/components/ui/Icons";
import { SourceTag } from "@/components/ui/SourceTag";
import { headlineStats, recognitions } from "@/content/achievements";
import { SOURCES, SOURCE_ORDER } from "@/content/sources";

export function Achievements() {
  const usedSources = SOURCE_ORDER.filter((s) => s !== "illustrative" && s !== "spec" && s !== "repo");
  return (
    <section id="achievements" aria-labelledby="achievements-title" className="section-y border-t border-line">
      <div className="container-page">
        <SectionHeader
          id="achievements-title"
          index="05"
          label="Achievements"
          title="Numbers, *with sources.*"
          intro="Competitive programming, awards and recognition. Every figure carries its source: an issuer's certificate, a public profile, an organiser's email, or a figure reported from the job."
        />

        <ul className="mt-16 grid gap-px overflow-hidden rounded-[18px] border border-line bg-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {headlineStats.map((s) => (
            <li key={s.id} className="flex flex-col justify-between gap-8 bg-bg p-6 sm:p-8" data-reveal="up">
              <div>
                <p className="font-display flex items-baseline text-step-4 leading-none tabular">
                  <span data-count={s.count} data-display={s.display}>
                    {s.display}
                  </span>
                  {s.suffix ? <span className="ml-1 text-[0.42em] tracking-[-0.02em] text-ink-2">{s.suffix}</span> : null}
                </p>
                <p className="mt-5 font-medium">{s.label}</p>
                <p className="mt-1 text-step--1 text-ink-2">{s.context}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[0.78rem] text-ink-3">
                <SourceTag source={s.source} />
                {s.asOf ? <span>as of {s.asOf}</span> : null}
                {s.href ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group ml-auto inline-flex min-h-8 items-center gap-1 text-ink-2 hover:text-ink"
                    aria-label={`${s.label}: view public profile`}
                  >
                    Profile <ArrowUpRight size={12} className="arrow-nudge arrow-nudge-diag" />
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-20 grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4" data-reveal="up">
            <h3 className="font-display text-step-2">Recognition</h3>
            <div className="mt-6 rounded-[var(--radius)] border border-line p-5">
              <p className="label-mono text-ink-3">Reading the labels</p>
              <dl className="mt-4 space-y-3">
                {usedSources.map((k) => (
                  <div key={k} className="grid grid-cols-[auto_1fr] items-start gap-3">
                    <dt>
                      <SourceTag source={k} />
                    </dt>
                    <dd className="text-[0.82rem] leading-snug text-ink-2">{SOURCES[k].description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <ul className="divide-y divide-line border-y border-line lg:col-span-8">
            {recognitions.map((r) => (
              <li key={r.title} className="grid gap-2 py-5 sm:grid-cols-[7rem_1fr_auto] sm:gap-6" data-reveal="up">
                <span className="font-mono text-[0.8rem] text-ink-3 tabular">
                  {r.date ?? (
                    <>
                      <span aria-hidden>—</span>
                      <span className="sr-only">Date not listed</span>
                    </>
                  )}
                </span>
                <div>
                  <p className="font-medium">
                    {r.href ? (
                      <a
                        href={r.href}
                        className="link-underline hover:text-signal-soft"
                        {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {r.title}
                      </a>
                    ) : (
                      r.title
                    )}
                  </p>
                  <p className="mt-0.5 text-step--1 text-ink-3">{r.issuer}</p>
                  <p className="mt-2 max-w-[62ch] text-step--1 text-ink-2">{r.detail}</p>
                </div>
                <div className="sm:pt-0.5">
                  <SourceTag source={r.source} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
