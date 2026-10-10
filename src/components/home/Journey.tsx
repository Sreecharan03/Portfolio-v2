import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceTag } from "@/components/ui/SourceTag";
import { publicJourney, type EntryType } from "@/content/experience";
import { getProject } from "@/content/projects";

const typeStyle: Record<EntryType, string> = {
  Employment: "border-signal/40 text-signal-soft",
  Internship: "border-line-strong text-ink-2",
  Independent: "border-verify/40 text-verify-soft",
  Education: "border-line-strong text-ink-3",
};

const dotStyle: Record<EntryType, string> = {
  Employment: "bg-signal",
  Internship: "bg-ink-2",
  Independent: "bg-verify",
  Education: "bg-ink-3",
};

export function Journey() {
  const entries = publicJourney();
  return (
    <section id="journey" aria-labelledby="journey-title" className="section-y border-t border-line">
      <div className="container-page">
        <SectionHeader
          id="journey-title"
          index="04"
          label="Journey"
          title="From applied ML to *dependable AI systems.*"
          intro="Employment, internship, independent work and education, newest first, each labelled for what it was."
        />

        <div className="relative mt-16 lg:mt-24">
          <div aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-line md:left-[calc(25%+7px)]">
            <span data-scrub-line className="absolute inset-0 origin-top bg-gradient-to-b from-signal via-verify to-transparent" />
          </div>

          <ol className="space-y-14 md:space-y-20">
            {entries.map((e) => (
              <li key={e.id} className="relative grid gap-4 pl-9 md:grid-cols-4 md:gap-8 md:pl-0">
                <span
                  aria-hidden
                  className={`absolute left-[2px] top-[0.55rem] size-[11px] rounded-full border-2 border-bg ring-1 ring-line-strong md:left-[calc(25%+2px)] ${dotStyle[e.type]}`}
                />
                <div className="md:pr-10 md:text-right" data-reveal="up">
                  <p className="font-mono text-[0.8rem] tracking-[0.02em] text-ink-2 tabular">{e.period}</p>
                  <p className="mt-2">
                    <span className={`inline-block rounded-full border px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.08em] ${typeStyle[e.type]}`}>
                      {e.type}
                    </span>
                  </p>
                </div>
                <div className="md:col-span-3 md:pl-12" data-reveal="up">
                  <h3 className="text-step-2 font-medium tracking-[-0.02em]">
                    {e.title}
                    <span className="text-ink-3"> · </span>
                    <span className="text-ink-2">{e.org}</span>
                  </h3>
                  <p className="mt-2 text-ink-2">{e.summary}</p>
                  <ul className="mt-4 max-w-[68ch] space-y-2 text-step--1 text-ink-2">
                    {e.points.map((pt) => (
                      <li key={pt} className="relative pl-5">
                        <span aria-hidden className="absolute left-0 top-[0.7em] h-px w-2.5 bg-ink-3" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  {e.metrics?.length || e.projects?.length ? (
                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                      {e.metrics?.map((m) => (
                        <span key={m.label} className="inline-flex items-center gap-2.5 text-[0.84rem]">
                          <span className="tabular whitespace-nowrap font-medium">{m.value}</span>
                          <span className="text-ink-3">{m.label}</span>
                          <SourceTag source={m.source} />
                        </span>
                      ))}
                      {e.projects?.map((slug) => {
                        const p = getProject(slug);
                        return p ? (
                          <Link key={slug} href={`/work/${slug}`} className="link-underline text-[0.84rem] text-signal-soft hover:text-ink">
                            Case study: {p.title} →
                          </Link>
                        ) : null;
                      })}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
