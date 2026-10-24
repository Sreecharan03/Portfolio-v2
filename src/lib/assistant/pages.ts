import { publicProjects } from "@/content/projects";
import { navItems } from "@/content/site";

/** Readable names for the site paths an answer may mention, so the chat shows "Contact", not "/#contact". */
export function pageLabels(): Record<string, string> {
  return {
    "/#approach": "Approach",
    ...Object.fromEntries(navItems.map((n) => [`/#${n.id}`, n.label])),
    "/#principles": "Principles",
    "/resume": "Résumé",
    ...Object.fromEntries(publicProjects().map((p) => [`/work/${p.slug}`, `${p.title} case study`])),
  };
}
