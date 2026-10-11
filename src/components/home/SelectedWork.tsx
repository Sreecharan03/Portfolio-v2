import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SourceTag } from "@/components/ui/SourceTag";
import { alsoBuilt, publicProjects, type Project } from "@/content/projects";
import { ProjectArt } from "./ProjectArt";
import { WorkIndex } from "./WorkIndex";

type Variant = "feature" | "split-art-left" | "split-art-right";

function variantFor(i: number): Variant {
  if (i < 2) return "feature";
  return i % 2 === 0 ? "split-art-left" : "split-art-right";
}

function Art({ project, className = "" }: { project: Project; className?: string }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      tabIndex={-1}
      aria-hidden
      className={`group/art relative block overflow-hidden rounded-[18px] border border-line bg-surface-1 ${className}`}
      data-reveal="mask"
    >
      <div className="absolute inset-0 transition-transform duration-[1400ms] ease-out-expo group-hover/art:scale-[1.025]">
        <ProjectArt slug={project.slug} />
      </div>
      <span className="absolute left-3 top-3 rounded-full border border-line bg-bg/75 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-2 backdrop-blur-sm sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[0.72rem]">
        {project.index} · {project.category}
      </span>
    </Link>
  );
}

function Highlights({ project }: { project: Project }) {
  return (
    <ul className="divide-y divide-line border-y border-line" aria-label="Highlights">
      {project.highlights.map((m) => (
        <li key={m.label} className="flex items-start justify-between gap-4 py-4">
          <div>
            <p className="tabular font-display text-step-2 leading-none">{m.value}</p>
            <p className="mt-2 max-w-[30ch] text-[0.84rem] leading-snug text-ink-2">{m.label}</p>
          </div>
          <SourceTag source={m.source} className="mt-1" />
        </li>
      ))}
    </ul>
  );
}

function Copy({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <div>
      <p className="label-mono text-ink-3">
        {project.kind} <span aria-hidden>·</span> {project.period}
      </p>
      <h3
        id={`work-${project.slug}-title`}
        className={`font-display mt-3 ${compact ? "text-[clamp(1.6rem,1.15rem+1.2vw,2.25rem)] leading-[1.02]" : "text-step-3"}`}
      >
        <Link href={`/work/${project.slug}`} className="transition-colors hover:text-signal-soft">
          {project.title}
        </Link>
      </h3>
      <p className="mt-4 max-w-[52ch] text-ink-2">{project.summary}</p>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Domains">
        {project.domains.map((d) => (
          <li key={d} className="rounded-full border border-line px-3 py-1 text-[0.78rem] text-ink-2">
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectPanel({ project, variant }: { project: Project; variant: Variant }) {
  const cta = (
    <ButtonLink
      href={`/work/${project.slug}`}
      variant="secondary"
      icon={<ArrowRight size={15} />}
      ariaLabel={`Read the ${project.title} case study`}
    >
      Read the case study
    </ButtonLink>
  );

  if (variant === "feature") {
    return (
      <article id={`work-${project.slug}`} aria-labelledby={`work-${project.slug}-title`} className="scroll-mt-28">
        <Art project={project} className="aspect-[16/10] sm:aspect-[16/9]" />
        <div className="mt-8 grid gap-8 md:grid-cols-9 md:gap-10">
          <div className="md:col-span-5" data-reveal="up">
            <Copy project={project} />
          </div>
          <div className="md:col-span-4" data-reveal="up">
            <Highlights project={project} />
            <div className="mt-6">{cta}</div>
          </div>
        </div>
      </article>
    );
  }

  const artLeft = variant === "split-art-left";
  return (
    <article
      id={`work-${project.slug}`}
      aria-labelledby={`work-${project.slug}-title`}
      className="grid scroll-mt-28 items-center gap-8 md:grid-cols-9 md:gap-10"
    >
      <div className={`md:col-span-5 ${artLeft ? "" : "md:order-2"}`}>
        <Art project={project} className="aspect-[16/11]" />
      </div>
      <div className={`md:col-span-4 ${artLeft ? "" : "md:order-1"}`} data-reveal="up">
        <Copy project={project} compact />
        <div className="mt-6">
          <Highlights project={project} />
        </div>
        <div className="mt-6">{cta}</div>
      </div>
    </article>
  );
}

export function SelectedWork() {
  const projects = publicProjects();
  return (
    <section id="work" aria-labelledby="work-title" className="section-y relative border-t border-line">
      <div className="container-page">
        <SectionHeader
          id="work-title"
          index="02"
          label="Selected work"
          title="Six systems, *built to hold up.*"
          intro="From distributed LLM pipelines to video-based traffic control. Each case study covers the problem, the architecture, the decisions, and where every number comes from."
        />

        <div className="mt-12 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-8">
          <div className="hidden lg:col-span-3 lg:block">
            <WorkIndex items={projects.map(({ slug, index, title, category }) => ({ slug, index, title, category }))} />
          </div>

          <div className="space-y-20 lg:col-span-9 lg:space-y-28">
            {projects.map((p, i) => (
              <ProjectPanel key={p.slug} project={p} variant={variantFor(i)} />
            ))}

            <div className="border-t border-line pt-10" data-reveal="up">
              <p className="label-mono text-ink-3">Also built</p>
              <ul className="mt-5 grid gap-4">
                {alsoBuilt.map((a) => (
                  <li key={a.href}>
                    <a
                      href={a.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group grid gap-3 rounded-[var(--radius)] border border-line p-6 transition-colors hover:border-line-strong hover:bg-surface-1 md:grid-cols-[1fr_auto] md:items-start md:gap-10"
                    >
                      <span>
                        <span className="flex items-center gap-2 text-[1.1rem] font-medium tracking-[-0.01em]">
                          {a.title}
                          <ArrowUpRight size={14} className="arrow-nudge arrow-nudge-diag text-ink-3" />
                        </span>
                        <span className="mt-2 block max-w-[70ch] text-step--1 text-ink-2">{a.summary}</span>
                      </span>
                      <span className="flex flex-col items-start gap-3 md:items-end">
                        <span className="font-mono text-[0.72rem] text-ink-3 md:text-right">{a.stack.join(" · ")}</span>
                        <SourceTag source="repo" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
