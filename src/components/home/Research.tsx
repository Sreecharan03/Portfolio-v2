import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { SourceTag } from "@/components/ui/SourceTag";
import { publication as pub } from "@/content/research";

export function Research() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: pub.title,
    author: pub.authors.map((a) => ({ "@type": "Person", name: a.name })),
    datePublished: pub.datePublished,
    isPartOf: {
      "@type": "PublicationIssue",
      issueNumber: "10",
      isPartOf: { "@type": "PublicationVolume", volumeNumber: "11", isPartOf: { "@type": "Periodical", name: pub.venue, issn: pub.issn } },
    },
    pagination: pub.pages,
    url: pub.links[0]?.href,
  };

  return (
    <section id="research" aria-labelledby="research-title" className="section-y border-t border-line">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-page">
        <SectionHeader id="research-title" index="06" label="Research" title="Fine-tuning small models for *legal language.*" />

        <article className="mt-12 overflow-hidden rounded-[20px] border border-line bg-surface-1/60 lg:mt-14" aria-labelledby="pub-title">
          <div className="grid lg:grid-cols-12">
            <div className="p-6 sm:p-10 lg:col-span-7" data-reveal="up">
              <p className="label-mono flex flex-wrap items-center gap-x-3 gap-y-2 text-ink-3">
                <span className="text-verify-soft">{pub.venueShort}</span>
                <span>{pub.volume}</span>
                <span aria-hidden>·</span>
                <span>{pub.date}</span>
                <SourceTag source="publication" />
              </p>
              <h3 id="pub-title" className="mt-5 text-step-3 leading-[1.08] tracking-[-0.03em]">
                <span className="serif-accent">{pub.title}</span>
              </h3>
              <p className="mt-5 text-step--1 text-ink-3">
                {pub.authors.map((a, i) => (
                  <span key={a.name}>
                    <span className={a.self ? "font-medium text-ink" : undefined}>{a.name}</span>
                    {i < pub.authors.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="label-mono text-ink-3">Problem</p>
                  <p className="mt-2 text-ink-2">{pub.problem}</p>
                </div>
                <div>
                  <p className="label-mono text-ink-3">Approach</p>
                  <p className="mt-2 text-ink-2">{pub.approach}</p>
                </div>
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                {pub.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-[0.92rem] transition-colors hover:border-ink-3 hover:bg-surface-2"
                  >
                    {l.label}
                    <ArrowUpRight size={13} className="arrow-nudge arrow-nudge-diag" />
                  </a>
                ))}
                <Link
                  href={pub.caseStudy}
                  className="group inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2.5 text-[0.92rem] text-ink-2 hover:text-ink"
                >
                  Case study <ArrowRight size={14} className="arrow-nudge" />
                </Link>
              </div>
            </div>

            <div className="border-t border-line bg-surface-2/40 p-6 sm:p-10 lg:col-span-5 lg:border-l lg:border-t-0" data-reveal="up">
              <p className="label-mono text-ink-3">Method</p>
              <dl className="mt-4 divide-y divide-line border-y border-line text-step--1">
                {pub.method.map((m) => (
                  <div key={m.k} className="grid grid-cols-[8.5rem_1fr] gap-4 py-3">
                    <dt className="text-ink-3">{m.k}</dt>
                    <dd className="text-ink">{m.v}</dd>
                  </div>
                ))}
              </dl>
              <p className="label-mono mt-8 text-ink-3">Evaluation</p>
              <p className="mt-2 text-step--1 text-ink-2">{pub.evaluation}</p>
              <p className="label-mono mt-8 text-ink-3">My role</p>
              <p className="mt-2 text-step--1 text-ink-2">{pub.role}</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
