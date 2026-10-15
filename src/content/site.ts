/**
 * Identity, links and global copy. Edit here; components read from this file.
 *
 * Contact details are taken from the owner's public GitHub profile README.
 * `resumePdf` points at the PDF in /public; set it to null to fall back to the
 * print-ready /resume page.
 */

const PLACEHOLDER_HOST = "your-domain.example"; // the sample value in .env.example

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    if (explicit.includes(PLACEHOLDER_HOST)) {
      throw new Error(`NEXT_PUBLIC_SITE_URL is still the sample value (${explicit}). Set the real production URL or unset it.`);
    }
    return explicit.replace(/\/$/, "");
  }
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
    // Canonical links, Open Graph and the sitemap will point at localhost on a non-Vercel host.
    console.warn("[site] No NEXT_PUBLIC_SITE_URL or VERCEL_PROJECT_PRODUCTION_URL: canonical URLs fall back to http://localhost:3000.");
  }
  return "http://localhost:3000";
}

export const site = {
  url: resolveSiteUrl(),
  name: "Sree Charan Chintalapudi",
  shortName: "Sree Charan",
  initials: "SC",
  role: "AI Engineer",
  positioning:
    "AI Engineer building reliable GenAI and agentic systems, with practical experience in backend engineering, applied ML and production data pipelines.",
  tagline: ["Intelligence,", "engineered."] as const,
  lede: "I build LLM and agentic systems that hold up outside the demo: classification pipelines that recover from failure, answers whose citations are checked in code, and the data pipelines underneath them.",
  specialisms: ["GenAI", "Agentic systems", "LLM reliability", "Applied ML", "Data pipelines"],
  location: "India",
  current: { title: "Data Engineer", org: "TCS Digital", since: "Dec 2025" },
  independent: "Independent AI & backend engineer",
  focus: "Agentic AI · LLM reliability · Applied ML",
  interest:
    "Interested in AI engineering roles across GenAI, agentic systems and the backend work that makes them dependable.",
  email: "charanch53030@gmail.com",
  phone: { display: "+91 74163 57722", href: "tel:+917416357722" },
  resumePdf: "/Sreecharan_Ai_Engineer.pdf" as string | null,
  socials: [
    { id: "github", label: "GitHub", handle: "Sreecharan03", href: "https://github.com/Sreecharan03" },
    { id: "linkedin", label: "LinkedIn", handle: "sreecharan1208", href: "https://www.linkedin.com/in/sreecharan1208/" },
    { id: "leetcode", label: "LeetCode", handle: "sreecharan_12082003", href: "https://leetcode.com/u/sreecharan_12082003/" },
  ],
  codingProfiles: [
    { id: "leetcode", label: "LeetCode", href: "https://leetcode.com/u/sreecharan_12082003/" },
    { id: "codechef", label: "CodeChef", href: "https://www.codechef.com/users/sreecharan_2k3" },
    { id: "gfg", label: "GeeksforGeeks", href: "https://www.geeksforgeeks.org/profile/sree_charan" },
  ],
  education: {
    degree: "B.Tech, Data Science",
    school: "Raghu Engineering College, Visakhapatnam",
    period: "2021 — 2025",
    detail: "CGPA 8.8 / 10",
  },
  description:
    "Sree Charan Chintalapudi is an AI engineer building reliable GenAI and agentic systems: distributed LLM pipelines, guarded Text-to-SQL agents, verified retrieval, applied ML on industrial telemetry and production data pipelines.",
} as const;

export type Site = typeof site;

export const navItems = [
  { id: "work", label: "Work" },
  { id: "capabilities", label: "Capabilities" },
  { id: "journey", label: "Journey" },
  { id: "achievements", label: "Achievements" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
] as const;

export function resumeHref(): string {
  return site.resumePdf ?? "/resume";
}

/** Link attributes for the résumé: a PDF opens in a new tab, the /resume page in place. */
export function resumeLink(): { href: string; target?: "_blank"; rel?: string } {
  return site.resumePdf ? { href: site.resumePdf, target: "_blank", rel: "noopener" } : { href: "/resume" };
}
