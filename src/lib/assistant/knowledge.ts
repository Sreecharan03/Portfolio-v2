import { headlineStats, recognitions } from "@/content/achievements";
import { alsoComfortableWith, capabilities } from "@/content/capabilities";
import { publicJourney } from "@/content/experience";
import { alsoBuilt, publicProjects } from "@/content/projects";
import { principles } from "@/content/principles";
import { publication } from "@/content/research";
import { site } from "@/content/site";
import { SOURCES, type Metric } from "@/content/sources";

/**
 * The assistant's knowledge, built only from the site's public content layer — the same
 * sourced facts a visitor can read. The private knowledge base (readme.md) is deliberately
 * not used: anything in a chatbot's context can be repeated to any visitor.
 * Server-side only (imported by the chat route).
 */

export interface Chunk {
  id: string;
  title: string;
  href: string;
  text: string;
}

const metric = (m: Metric) => `${m.value} ${m.label} [${SOURCES[m.source].label}]`;
const lines = (items: (string | false | undefined)[]) => items.filter(Boolean).join("\n");

function profile(): Chunk {
  const socials = site.socials.map((s) => `${s.label}: ${s.href}`).join("; ");
  return {
    id: "profile",
    title: "Profile and contact",
    href: "/#contact",
    text: lines([
      `${site.name} (Charan), ${site.role}. ${site.positioning}`,
      `Now: ${site.current.title} at ${site.current.org} since ${site.current.since}; also ${site.independent.toLowerCase()}. Based in ${site.location}.`,
      `Looking for: ${site.interest}`,
      `Education: ${site.education.degree}, ${site.education.school}, ${site.education.period}, ${site.education.detail}.`,
      `Contact: email ${site.email}; phone ${site.phone.display}; ${socials}. Résumé: ${site.resumePdf ?? "/resume"}.`,
    ]),
  };
}

function projectIndex(): Chunk {
  return {
    id: "projects",
    title: "Selected work",
    href: "/#work",
    text: lines([
      ...publicProjects().map((p) => `- ${p.title} (${p.category}; ${p.kind}; ${p.period}): ${p.tagline} Case study /work/${p.slug}`),
      ...alsoBuilt.map((a) => `- Also built: ${a.title}: ${a.summary}`),
    ]),
  };
}

function projectChunks(): Chunk[] {
  return publicProjects().flatMap((p) => {
    const cs = p.caseStudy;
    const href = `/work/${p.slug}`;
    return [
      {
        id: `${p.slug}-overview`,
        title: p.title,
        href,
        text: lines([
          `${p.title} — ${p.category}. ${p.kind}, ${p.period}. Role: ${p.role}.`,
          p.summary,
          `Stack: ${p.stack.join(", ")}.`,
          `Highlights: ${p.highlights.map(metric).join("; ")}.`,
          p.links.length > 0 && `Links: ${p.links.map((l) => `${l.label} ${l.href}`).join("; ")}.`,
          ...cs.context,
          ...cs.challenge,
          ...cs.role,
        ]),
      },
      {
        id: `${p.slug}-details`,
        title: `${p.title}: decisions and results`,
        href,
        text: lines([
          ...cs.decisions.map((d) => `${d.title}: ${d.body}`),
          ...cs.quality.body,
          `Results: ${cs.results.map(metric).join("; ")}.`,
          cs.resultsNote,
          `Lessons: ${cs.lessons.join(" ")}`,
          `Next: ${cs.next.join(" ")}`,
        ]),
      },
    ];
  });
}

function journeyChunks(): Chunk[] {
  return publicJourney().map((e) => ({
    id: `journey-${e.id}`,
    title: `${e.title}, ${e.org}`,
    href: "/#journey",
    text: lines([
      `${e.type}: ${e.title} at ${e.org}, ${e.period}. ${e.summary}`,
      ...e.points,
      e.metrics && e.metrics.length > 0 && `Figures: ${e.metrics.map(metric).join("; ")}.`,
    ]),
  }));
}

function achievementChunks(): Chunk[] {
  return [
    {
      id: "achievements-stats",
      title: "Competitive programming",
      href: "/#achievements",
      text: headlineStats
        .map((s) => `${s.display}${s.suffix ?? ""} ${s.label} (${s.context}) [${SOURCES[s.source].label}${s.asOf ? `, as of ${s.asOf}` : ""}]`)
        .join("\n"),
    },
    {
      id: "achievements-recognition",
      title: "Awards and recognition",
      href: "/#achievements",
      text: recognitions
        .map((r) => `${r.title} — ${r.issuer}${r.date ? `, ${r.date}` : ""}. ${r.detail} [${SOURCES[r.source].label}]`)
        .join("\n"),
    },
  ];
}

function capabilityChunks(): Chunk[] {
  return [
    ...capabilities.map((c) => ({
      id: `capability-${c.id}`,
      title: c.title,
      href: "/#capabilities",
      text: lines([
        `${c.title}: ${c.summary}`,
        `Tools: ${c.tools.join(", ")}.`,
        `Shown in: ${c.evidence.map((e) => `${e.label} (${e.note})`).join("; ")}.`,
      ]),
    })),
    {
      id: "capability-also",
      title: "Also comfortable with",
      href: "/#capabilities",
      text: `Also: ${alsoComfortableWith.join("; ")}.`,
    },
  ];
}

function researchChunk(): Chunk {
  return {
    id: "research",
    title: "Publication",
    href: "/#research",
    text: lines([
      `"${publication.title}", ${publication.venue}, ${publication.volume}, ${publication.date}. ${publication.role}`,
      `Authors: ${publication.authors.map((a) => a.name).join(", ")}.`,
      publication.problem,
      publication.approach,
      publication.evaluation,
    ]),
  };
}

function principlesChunk(): Chunk {
  return {
    id: "principles",
    title: "Engineering principles",
    href: "/#principles",
    text: principles.map((p) => `${p.title}: ${p.body}`).join("\n"),
  };
}

/** Always sent: who Charan is, how to reach him, and the list of work. */
export const coreChunks: Chunk[] = [profile(), projectIndex()];

/** Retrieved per question. */
export const searchChunks: Chunk[] = [
  ...projectChunks(),
  ...journeyChunks(),
  ...achievementChunks(),
  ...capabilityChunks(),
  researchChunk(),
  principlesChunk(),
];
