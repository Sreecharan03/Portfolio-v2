import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { CaseDemo } from "@/components/case/CaseDemo";
import { ChapterNav } from "@/components/case/ChapterNav";
import { FlowDiagram } from "@/components/case/FlowDiagram";
import { ProjectArt } from "@/components/home/ProjectArt";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { SourceTag } from "@/components/ui/SourceTag";
import { diagrams } from "@/content/diagrams";
import { getProject, publicProjects, type Accent } from "@/content/projects";
import { site } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return publicProjects().map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.title} — case study`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { type: "article", title, description: project.summary, url: `/work/${project.slug}` },
    twitter: { card: "summary_large_image", title, description: project.summary },
  };
}

const accentText: Record<Accent, string> = {
  signal: "text-signal-soft",
  verify: "text-verify-soft",
  warn: "text-warn",
};

function Chapter({
  id,
  n,
  label,
  title,
  accent,
  children,
}: {
  id: string;
  n: number;
  label: string;
  title: string;
  accent: Accent;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28">
      <p className="label-mono flex items-center gap-3 text-ink-3" data-reveal="up">
        <span className={accentText[accent]}>{String(n).padStart(2, "0")}</span>
        <span aria-hidden className="h-px w-6 bg-line-strong" />
        {label}
      </p>
      <h2 id={`${id}-title`} className="font-display mt-4 max-w-[22ch] text-step-3" data-reveal="lines">
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const cs = project.caseStudy;
  const all = publicProjects();
  const index = all.findIndex((p) => p.slug === project.slug);
  const next = all[(index + 1) % all.length];
  const spec = diagrams[cs.diagram];

  const chapters = [
    { id: "context", label: "Context", title: "The problem" },
    { id: "challenge", label: "Challenge", title: "Why it is hard" },
    { id: "role", label: "Role", title: "What I did" },
    { id: "architecture", label: "Architecture", title: "How it fits together" },
    ...(cs.demo ? [{ id: "demo", label: "Interactive", title: cs.demo.title }] : []),
    { id: "decisions", label: "Decisions", title: "Decisions that mattered" },
    { id: "quality", label: "Quality", title: cs.quality.title },
    { id: "results", label: "Results", title: "Results, with sources" },
    { id: "lessons", label: "Lessons", title: "Lessons and next steps" },
  ];
  const n = (id: string) => chapters.findIndex((c) => c.id === id) + 1;
  const c = (id: string) => chapters.find((ch) => ch.id === id) ?? { id, label: id, title: id };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: `${project.title} — case study`,
    description: project.summary,
    author: { "@type": "Person", name: site.name, url: site.url },
    url: `${site.url}/work/${project.slug}`,
    keywords: project.stack.join(", "),
  };

  const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

  return (
    <article aria-labelledby="case-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <header className="relative isolate overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-40" />
        <div className="container-page pb-12 pt-[calc(var(--header-h)+2.5rem)] sm:pt-[calc(var(--header-h)+4rem)]">
          <nav aria-label="Breadcrumb" className="intro-fade" style={d(0)}>
            <ol className="label-mono flex flex-wrap items-center gap-2 text-ink-3">
              <li>
                <Link href="/#work" className="link-underline hover:text-ink">
                  Work
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-ink-2">
                {project.index} · {project.title}
              </li>
            </ol>
          </nav>

          <p className={`intro-fade label-mono mt-10 ${accentText[project.accent]}`} style={d(60)}>
            {project.category}
          </p>
          <h1 id="case-title" className="font-display mt-4 max-w-[15ch] text-step-5">
            <span className="intro-mask">
              <span style={d(120)}>{project.title}</span>
            </span>
          </h1>
          <p className="intro-fade mt-8 max-w-[40ch] text-step-2 leading-[1.3] text-ink-2" style={d(300)}>
            {project.tagline}
          </p>

          <dl
            className="intro-fade mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[16px] border border-line bg-line lg:grid-cols-4"
            style={d(420)}
          >
            <div className="bg-bg p-4 sm:p-5">
              <dt className="label-mono text-ink-3">Role</dt>
              <dd className="mt-2 text-step--1">{project.role}</dd>
            </div>
            <div className="bg-bg p-4 sm:p-5">
              <dt className="label-mono text-ink-3">Context</dt>
              <dd className="mt-2 text-step--1">{project.kind}</dd>
            </div>
            <div className="bg-bg p-4 sm:p-5">
              <dt className="label-mono text-ink-3">Period</dt>
              <dd className="mt-2 text-step--1">{project.period}</dd>
            </div>
            <div className="bg-bg p-4 sm:p-5">
              <dt className="label-mono text-ink-3">Links</dt>
              <dd className="mt-2 flex flex-col items-start gap-1 text-step--1">
                {project.links.length ? (
                  project.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1 text-signal-soft hover:text-ink"
                    >
                      <span className="link-underline">{l.label}</span>
                      <ArrowUpRight size={12} className="arrow-nudge arrow-nudge-diag" />
                    </a>
                  ))
                ) : (
                  <span className="text-ink-3">Private client code</span>
                )}
              </dd>
            </div>
          </dl>

          <div className="intro-fade mt-6" style={d(500)}>
            <p className="sr-only">Technologies</p>
            <ul className="flex flex-wrap gap-2" aria-label="Technologies">
              {project.stack.map((s) => (
                <li key={s} className="rounded-full border border-line px-3 py-1 font-mono text-[0.72rem] text-ink-2">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="container-page">
          <div className="intro-fade relative aspect-[16/9] overflow-hidden rounded-[20px] border border-line sm:aspect-[21/9]" style={d(560)}>
            <ProjectArt slug={project.slug} />
          </div>
        </div>
      </header>

      <div className="container-page grid gap-10 pb-24 pt-20 lg:grid-cols-12 lg:gap-8 lg:pt-28">
        <aside className="hidden lg:col-span-3 lg:block">
          <ChapterNav chapters={chapters.map(({ id, label }) => ({ id, label }))} />
        </aside>

        <div className="min-w-0 space-y-24 lg:col-span-9 lg:space-y-32">
          <Chapter id="context" n={n("context")} label="Context" title={c("context").title} accent={project.accent}>
            <div className="max-w-[68ch] space-y-5 text-step-1 leading-relaxed text-ink-2" data-reveal="up">
              {cs.context.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Chapter>

          <Chapter id="challenge" n={n("challenge")} label="Challenge" title={c("challenge").title} accent={project.accent}>
            <div className="max-w-[68ch] space-y-5" data-reveal="up">
              {cs.challenge.map((p, i) => (
                <p key={p} className={i === 0 ? "border-l-2 border-signal/50 pl-6 text-step-2 leading-snug text-ink" : "pl-6 text-ink-2"}>
                  {p}
                </p>
              ))}
            </div>
          </Chapter>

          <Chapter id="role" n={n("role")} label="Role" title={c("role").title} accent={project.accent}>
            <div className="max-w-[68ch] space-y-5 text-step-1 leading-relaxed text-ink-2" data-reveal="up">
              {cs.role.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Chapter>

          <Chapter id="architecture" n={n("architecture")} label="Architecture" title={c("architecture").title} accent={project.accent}>
            <div data-reveal="up">
              <FlowDiagram spec={spec} caption={cs.architectureCaption} />
            </div>
          </Chapter>

          {cs.demo ? (
            <Chapter id="demo" n={n("demo")} label="Interactive" title={cs.demo.title} accent={project.accent}>
              <p className="max-w-[68ch] text-ink-2" data-reveal="up">
                {cs.demo.intro}
              </p>
              <div className="mt-8" data-reveal="up">
                <CaseDemo id={cs.demo.id} />
              </div>
            </Chapter>
          ) : null}

          <Chapter id="decisions" n={n("decisions")} label="Decisions" title={c("decisions").title} accent={project.accent}>
            <ol className="grid gap-px overflow-hidden rounded-[18px] border border-line bg-line md:grid-cols-2">
              {cs.decisions.map((dec, i) => (
                <li key={dec.title} className="bg-bg p-6 sm:p-7 md:[&:last-child:nth-child(odd)]:col-span-2" data-reveal="up">
                  <p className="font-mono text-[0.75rem] text-ink-3">D{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 text-step-1 font-medium tracking-[-0.015em]">{dec.title}</h3>
                  <p className="mt-3 text-step--1 leading-relaxed text-ink-2">{dec.body}</p>
                </li>
              ))}
            </ol>
          </Chapter>

          <Chapter id="quality" n={n("quality")} label="Quality" title={cs.quality.title} accent={project.accent}>
            <div className="max-w-[68ch] space-y-5 text-step-1 leading-relaxed text-ink-2" data-reveal="up">
              {cs.quality.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Chapter>

          <Chapter id="results" n={n("results")} label="Results" title={c("results").title} accent={project.accent}>
            <ul className="grid gap-px overflow-hidden rounded-[18px] border border-line bg-line sm:grid-cols-2">
              {cs.results.map((m) => (
                <li key={m.label} className="flex flex-col justify-between gap-6 bg-bg p-6 sm:p-7 sm:[&:last-child:nth-child(odd)]:col-span-2" data-reveal="up">
                  <div>
                    <p className="font-display text-step-3 leading-none tabular">{m.value}</p>
                    <p className="mt-3 text-step--1 text-ink-2">{m.label}</p>
                  </div>
                  <SourceTag source={m.source} />
                </li>
              ))}
            </ul>
            {cs.resultsNote ? (
              <p className="mt-5 max-w-[68ch] text-step--1 text-ink-3" data-reveal="up">
                {cs.resultsNote}
              </p>
            ) : null}
          </Chapter>

          <Chapter id="lessons" n={n("lessons")} label="Lessons" title={c("lessons").title} accent={project.accent}>
            <div className="grid gap-8 md:grid-cols-2" data-reveal="up">
              <div>
                <p className="label-mono text-ink-3">What I took away</p>
                <ul className="mt-4 space-y-4">
                  {cs.lessons.map((l) => (
                    <li key={l} className="border-l border-line-strong pl-5 text-ink-2">
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="label-mono text-ink-3">What I would do next</p>
                <ul className="mt-4 space-y-4">
                  {cs.next.map((l) => (
                    <li key={l} className="border-l border-signal/50 pl-5 text-ink-2">
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Chapter>
        </div>
      </div>

      {next && next.slug !== project.slug ? (
        <nav aria-label="Next case study" className="border-t border-line">
          <Link href={`/work/${next.slug}`} className="group block">
            <div className="container-page flex flex-col gap-6 py-16 sm:py-24 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="label-mono text-ink-3">Next case study · {next.index}</p>
                <p className="font-display mt-4 text-step-4 transition-colors duration-500 group-hover:text-signal-soft">{next.title}</p>
                <p className="mt-3 max-w-[56ch] text-ink-2">{next.category}</p>
              </div>
              <span className="grid size-16 shrink-0 place-items-center rounded-full border border-line-strong transition-[background-color,border-color,transform] duration-500 ease-out-expo group-hover:translate-x-2 group-hover:border-ink group-hover:bg-ink group-hover:text-bg">
                <ArrowRight size={22} />
              </span>
            </div>
          </Link>
        </nav>
      ) : null}
    </article>
  );
}
