/**
 * Provenance labels. Every number on the site carries one of these so a
 * reader can tell an issuer-verified result from an on-the-job measurement
 * or an illustrative simulation.
 */
export type SourceKind =
  | "certificate"
  | "profile"
  | "repo"
  | "codebase"
  | "email"
  | "publication"
  | "reported"
  | "spec"
  | "illustrative";

export interface SourceInfo {
  label: string;
  description: string;
  tone: "verified" | "public" | "reported" | "illustrative";
}

export const SOURCES: Record<SourceKind, SourceInfo> = {
  certificate: {
    label: "Certificate",
    description: "Backed by an issuer certificate on file.",
    tone: "verified",
  },
  email: {
    label: "Award email",
    description: "Backed by the organiser's result email on file.",
    tone: "verified",
  },
  publication: {
    label: "Publication",
    description: "Stated in the published paper.",
    tone: "verified",
  },
  profile: {
    label: "Public profile",
    description: "Read from a linkable public profile; value as of the snapshot date.",
    tone: "public",
  },
  repo: {
    label: "Public repo",
    description: "Read directly from the public source code.",
    tone: "public",
  },
  codebase: {
    label: "Private codebase",
    description: "Read from the project's own code, tests and design records. The repository is private because it contains client details.",
    tone: "reported",
  },
  spec: {
    label: "System spec",
    description: "Follows directly from the documented configuration.",
    tone: "public",
  },
  reported: {
    label: "Reported",
    description: "Reported from the job or my own records. The evidence (work data, offer letters) is private, so the figure is stated, not linked.",
    tone: "reported",
  },
  illustrative: {
    label: "Illustrative",
    description: "Synthetic data or a simulation that explains a mechanism. Not a real measurement.",
    tone: "illustrative",
  },
};

export const SOURCE_ORDER: SourceKind[] = [
  "certificate",
  "email",
  "publication",
  "profile",
  "repo",
  "codebase",
  "spec",
  "reported",
  "illustrative",
];

export interface Metric {
  value: string;
  label: string;
  source: SourceKind;
  note?: string;
}
