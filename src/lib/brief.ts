import type { BriefData } from "@/components/brief/types";
import { headlineStats, recognitions } from "@/content/achievements";
import { getProject } from "@/content/projects";
import { resumeHref, site } from "@/content/site";

/** Builds the recruiter brief on the server so the client receives only this payload. */
export function buildBrief(): BriefData {
  const pick = (slug: string, line?: string) => {
    const p = getProject(slug);
    if (!p) return null;
    const metric = p.highlights[0];
    return {
      title: p.title,
      href: `/work/${p.slug}`,
      line: line ?? p.category,
      metric: metric ? { value: metric.value, label: metric.label, source: metric.source } : undefined,
    };
  };

  const highlights = [
    pick("sighnal", "Distributed LLM analytics with self-healing queues and grounded chat"),
    pick("senseminds-360", "Grounded industrial intelligence: deterministic engines, rules and a cited LLM copilot"),
    pick("financial-agents", "LangGraph Text-to-SQL with deterministic guardrails"),
  ].filter((h): h is NonNullable<typeof h> => h !== null);

  const stat = (id: string) => headlineStats.find((s) => s.id === id);
  const leet = stat("leetcode-rating");
  const codevita = stat("codevita");
  const award = recognitions.find((r) => r.title === "Special Initiative Award");

  const proof = [
    leet && { value: leet.display, label: "LeetCode rating · Knight, top 4.74%", source: leet.source },
    codevita && { value: codevita.display, label: "TCS CodeVita S12 global rank", source: codevita.source },
    award && { value: "TCS Gems", label: `${award.title}, ${award.date ?? ""}`.trim(), source: award.source },
    { value: "8 offers", label: "from a tier-3 college, incl. TCS Digital and Infosys (DSE)", source: "reported" as const },
  ].filter((p): p is NonNullable<typeof p> => Boolean(p));

  return {
    name: site.name,
    role: `${site.role} · GenAI, agentic systems, backend, applied ML, data pipelines`,
    positioning: site.positioning,
    current: `${site.current.title}, ${site.current.org} (since ${site.current.since}) · ${site.independent}`,
    focus: ["Agentic AI", "LLM reliability", "Backend systems", "Applied ML"],
    highlights,
    proof,
    email: site.email,
    resume: resumeHref(),
    resumeIsFile: site.resumePdf !== null,
    phone: { ...site.phone },
    links: site.socials.filter((s) => s.id !== "leetcode").map((s) => ({ label: s.label, href: s.href })),
  };
}
