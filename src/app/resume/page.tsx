import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { PrintButton } from "@/components/resume/PrintButton";
import { ArrowLeft } from "@/components/ui/Icons";
import { capabilities } from "@/content/capabilities";
import { publicJourney } from "@/content/experience";
import { getProject } from "@/content/projects";
import { publication } from "@/content/research";
import { site } from "@/content/site";

const description = `Résumé of ${site.name}, ${site.role}: GenAI and agentic systems, backend engineering, applied ML and data pipelines.`;

export const metadata: Metadata = {
  title: "Résumé",
  description,
  alternates: { canonical: "/resume" },
  // Reuses the site-wide card image; a page-level openGraph would otherwise drop it.
  openGraph: {
    type: "profile",
    siteName: site.name,
    url: "/resume",
    title: `Résumé — ${site.name}`,
    description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} — ${site.role}` }],
  },
  twitter: { card: "summary_large_image", title: `Résumé — ${site.name}`, description, images: ["/opengraph-image"] },
};

function H({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-6 border-b border-neutral-300 pb-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-neutral-500 print:mt-4">
      {children}
    </h2>
  );
}

function Entry({ title, meta, children }: { title: ReactNode; meta: string; children?: ReactNode }) {
  return (
    <div className="mt-3 break-inside-avoid">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="text-[0.95rem] font-semibold text-neutral-900">{title}</h3>
        <p className="font-mono text-[0.72rem] text-neutral-500">{meta}</p>
      </div>
      {children}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[0.84rem] leading-snug text-neutral-700 marker:text-neutral-400">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

export default function ResumePage() {
  const journey = publicJourney();
  const jobs = journey.filter((j) => j.type === "Employment" || j.type === "Internship");
  const independent = journey.filter((j) => j.type === "Independent");
  const education = journey.find((j) => j.type === "Education");
  const projects = ["financial-agents", "agentic-rag", "smart-traffic"].map(getProject).filter((p) => p !== undefined);
  const linkedin = site.socials.find((s) => s.id === "linkedin");
  const github = site.socials.find((s) => s.id === "github");
  const host = site.url.replace(/^https?:\/\//, "");

  const extra: Record<string, string[]> = {
    sighnal: ["A 12,910-comment run went from 574 permanently failed comments to 0; 300+ automated tests including a 33-test resilience suite."],
  };

  return (
    <div className="pb-24 pt-[calc(var(--header-h)+2rem)] print:p-0">
      <div className="container-page no-print mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="group inline-flex items-center gap-2 text-ink-2 hover:text-ink">
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /> Back to portfolio
        </Link>
        <div className="flex items-center gap-3">
          <p className="hidden text-step--1 text-ink-3 sm:block">Generated from the same content as this site.</p>
          <PrintButton />
        </div>
      </div>

      <div className="container-page print:max-w-none print:p-0">
        <article
          aria-labelledby="resume-name"
          className="mx-auto max-w-[52rem] rounded-[6px] bg-white px-6 py-10 text-neutral-800 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] sm:px-14 sm:py-14 print:max-w-none print:rounded-none print:p-0 print:shadow-none"
        >
          <header className="border-b border-neutral-200 pb-4">
            <h1 id="resume-name" className="text-[1.9rem] font-semibold tracking-[-0.03em] text-neutral-950">
              {site.name}
            </h1>
            <p className="mt-1 text-[0.98rem] text-neutral-700">
              {site.role} · GenAI, agentic systems, backend engineering, applied ML, data pipelines
            </p>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.8rem] text-neutral-600">
              <a href={`mailto:${site.email}`} className="underline-offset-2 hover:underline">
                {site.email}
              </a>
              <a href={site.phone.href} className="underline-offset-2 hover:underline">
                {site.phone.display}
              </a>
              {linkedin ? <a href={linkedin.href}>linkedin.com/in/{linkedin.handle}</a> : null}
              {github ? <a href={github.href}>github.com/{github.handle}</a> : null}
              {host.startsWith("localhost") ? null : <a href={site.url}>{host}</a>}
              <span>{site.location}</span>
            </p>
          </header>

          <H>Summary</H>
          <p className="mt-2 text-[0.88rem] leading-relaxed text-neutral-700">
            AI engineer building reliable GenAI and agentic systems: distributed LLM pipelines with failure handling and
            code-verified grounding, LangGraph agents with deterministic guardrails, and retrieval with scored verification. Data
            Engineer at TCS Digital on production Azure Databricks and PySpark ingestion; previously technical lead of a 12-member
            team on industrial anomaly detection.
          </p>

          <H>Experience</H>
          {jobs.map((j) => (
            <Entry
              key={j.id}
              title={
                <>
                  {j.title} <span className="font-normal text-neutral-500">· {j.org}</span>
                </>
              }
              meta={j.period}
            >
              <Bullets items={[...j.points, ...(extra[j.id] ?? [])]} />
            </Entry>
          ))}

          <H>Independent work</H>
          {independent.map((j) => (
            <Entry
              key={j.id}
              title={
                <>
                  {j.title} <span className="font-normal text-neutral-500">· {j.org}</span>
                </>
              }
              meta={j.period}
            >
              <Bullets items={[...j.points, ...(extra[j.id] ?? [])]} />
            </Entry>
          ))}

          <H>Selected projects</H>
          {projects.map((p) => (
            <Entry key={p.slug} title={p.title} meta={p.links[0]?.href.replace("https://", "") ?? p.period}>
              <p className="mt-1 text-[0.84rem] leading-snug text-neutral-700">{p.summary}</p>
              <p className="mt-0.5 font-mono text-[0.7rem] text-neutral-500">{p.stack.join(" · ")}</p>
            </Entry>
          ))}

          <H>Publication</H>
          <Entry title={publication.title} meta={`${publication.venueShort} · ${publication.date}`}>
            <p className="mt-1 text-[0.84rem] leading-snug text-neutral-700">
              {publication.authors.map((a) => a.name).join(", ")}. {publication.venue}, {publication.volume}, pp. {publication.pages}.
              Two-stage instruction fine-tuning (TinyLLaMA 1.1B → Gemma 2-2B, LoRA on 4-bit weights) for legal summarization.
            </p>
          </Entry>

          <H>Skills</H>
          <dl className="mt-2 grid gap-1 text-[0.82rem]">
            {capabilities.map((c) => (
              <div key={c.id} className="grid grid-cols-[11rem_1fr] gap-3 max-sm:grid-cols-1 max-sm:gap-0">
                <dt className="font-semibold text-neutral-800">{c.title}</dt>
                <dd className="text-neutral-700">{c.tools.join(", ")}</dd>
              </div>
            ))}
          </dl>

          <H>Achievements</H>
          <Bullets
            items={[
              "LeetCode Knight: contest rating 1,898 (top 4.74%), 757 problems solved (Oct 2026).",
              "TCS CodeVita Season 12: global rank 5,127. Smart Interviews “Smart Coder”: rank 159 of 35,859 (2024).",
              "TCS Gems Special Initiative Award, June 2026, for outperforming the entire training cohort in HLD and LLD.",
              "8 job offers from a tier-3 college, including TCS Digital and Infosys (DSE); chose TCS Digital.",
              "Third prize (“Predictive Protection”) and third position (“Health – Care Saver”) at an Andhra Pradesh hackathon, as team lead.",
              "AMD × TCS AI Hackathon Champion Certificate (participation recognition), August 2026.",
            ]}
          />

          {education ? (
            <>
              <H>Education</H>
              <Entry
                title={
                  <>
                    {education.title} <span className="font-normal text-neutral-500">· {education.org}</span>
                  </>
                }
                meta={education.period}
              >
                <p className="mt-1 text-[0.84rem] text-neutral-700">{education.summary}</p>
              </Entry>
            </>
          ) : null}
        </article>
      </div>
    </div>
  );
}
