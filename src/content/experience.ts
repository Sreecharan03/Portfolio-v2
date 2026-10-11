import type { Metric } from "./sources";

export type EntryType = "Employment" | "Internship" | "Independent" | "Education";

export interface JourneyEntry {
  id: string;
  type: EntryType;
  period: string;
  start: string; // first month (or year) on record; entries are listed newest-ending first
  title: string;
  org: string;
  summary: string;
  points: string[];
  metrics?: Metric[];
  projects?: string[]; // project slugs
  visibility: "public" | "hidden";
}

export const journey: JourneyEntry[] = [
  {
    id: "tcs",
    type: "Employment",
    period: "Dec 2025 — present",
    start: "2025-12",
    title: "Data Engineer",
    org: "TCS Digital",
    summary: "Production data engineering on Azure Databricks and PySpark.",
    points: [
      "Build and maintain automated ingestion jobs and pipelines handling 100K–1M records per run, about 80K rows per data file on average.",
      "Built reusable notebooks that make the automation easier to extend.",
      "Removed duplicated and repeated calls in ingestion notebooks, cutting run time by about 20%.",
    ],
    metrics: [
      { value: "~20%", label: "shorter ingestion run time", source: "reported" },
      { value: "Jun 2026", label: "TCS Gems Special Initiative Award", source: "certificate" },
    ],
    visibility: "public",
  },
  {
    id: "sighnal",
    type: "Independent",
    period: "2026 — present",
    start: "2026",
    title: "AI & Backend Engineer (freelance)",
    org: "Sighnal",
    summary: "Designed and built a distributed GenAI analytics platform end to end.",
    points: [
      "Celery and Redis queue fabric with fan-out, distributed locks, concurrency gates and a self-healing watchdog.",
      "LLM classification with batching, deduplication, caching, AIMD rate control and a circuit breaker; grounded chat with citations verified in code.",
      "JWT (argon2), RBAC, plan tiers and audit logging; Next.js and TanStack Query front end.",
    ],
    metrics: [{ value: "574 → 0", label: "permanently failed comments on a 12,910-comment run", source: "reported" }],
    projects: ["sighnal"],
    visibility: "public",
  },
  {
    id: "codex",
    type: "Independent",
    period: "Oct 2025 — May 2026",
    start: "2025-10",
    title: "Team Lead (independent contract)",
    org: "Codex Free Lancers",
    summary: "Led project mentoring and delivery for B.Tech student teams in data science and AI.",
    points: [
      "Led a development team and a documentation team supporting 100+ student project groups (300+ students).",
      "Walked 50+ groups through their projects end to end.",
    ],
    metrics: [{ value: "100+", label: "student project groups supported", source: "reported" }],
    visibility: "public",
  },
  {
    id: "aismartlive",
    type: "Employment",
    period: "Mar — Dec 2025",
    start: "2025-03",
    title: "Junior Data Scientist",
    org: "AISmartLive Solutions",
    summary: "Technical lead of a 12-member team on SenseMinds 360, an industrial IoT anomaly-detection platform.",
    points: [
      "MQTT to InfluxDB telemetry from 30 sensors at 15-second resolution.",
      "XGBoost, Isolation Forest and NeuralProphet models with SHAP explanations; deployed for an industrial client.",
      "Team lead on two Andhra Pradesh hackathon entries that both placed third.",
    ],
    metrics: [
      { value: "92%", label: "detection accuracy", source: "reported" },
      { value: "8 h → 1 h", label: "investigation time", source: "reported" },
    ],
    projects: ["senseminds-360"],
    visibility: "public",
  },
  {
    id: "aays",
    type: "Internship",
    period: "Jun — Aug 2025",
    start: "2025-06",
    title: "Data Science Intern",
    org: "AAYS Advisory",
    summary: "GenAI tooling, deployment and dashboard engineering.",
    points: [
      "Containerised Langflow and published the images to Azure Container Registry and AWS ECR.",
      "Built a FastAPI RAG microservice for a knowledge-transfer platform.",
      "Migrated a fintech client's dashboards from Plotly to ECharts and AmCharts.",
    ],
    visibility: "public",
  },
  {
    id: "btech",
    type: "Education",
    period: "2021 — 2025",
    start: "2021-10",
    title: "B.Tech, Data Science",
    org: "Raghu Engineering College, Visakhapatnam",
    summary: "CGPA 8.8 / 10.",
    points: ["Co-authored a paper on instruction fine-tuning for legal summarization, published in IJIRT (March 2025)."],
    projects: ["legal-summarization"],
    visibility: "public",
  },
];

export function publicJourney(): JourneyEntry[] {
  return journey.filter((j) => j.visibility === "public");
}
