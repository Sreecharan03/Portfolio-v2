import type { SourceKind } from "@/content/sources";

/** Serializable payload for the 30-second recruiter brief (built on the server). */
export interface BriefData {
  name: string;
  role: string;
  positioning: string;
  current: string;
  focus: string[];
  highlights: { title: string; href: string; line: string; metric?: { value: string; label: string; source: SourceKind } }[];
  proof: { value: string; label: string; source: SourceKind }[];
  email: string;
  resume: string;
  resumeIsFile: boolean;
  phone: { display: string; href: string };
  links: { label: string; href: string }[];
}
