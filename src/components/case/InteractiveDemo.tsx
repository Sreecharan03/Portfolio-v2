"use client";

import dynamic from "next/dynamic";
import type { DemoId } from "@/content/projects";

// Each interactive demo is its own lazily loaded chunk, so a case study downloads only the demo it shows.
// ssr stays on: the demo is still rendered into the static HTML.
const demos = {
  "resilience-drill": dynamic(() => import("@/components/demos/ResilienceDrill").then((m) => m.ResilienceDrill)),
  "health-rollup": dynamic(() => import("@/components/demos/HealthRollup").then((m) => m.HealthRollup)),
  "sql-guard": dynamic(() => import("@/components/demos/SqlGuard").then((m) => m.SqlGuard)),
  "rag-lab": dynamic(() => import("@/components/demos/RagLab").then((m) => m.RagLab)),
  "junction-sandbox": dynamic(() => import("@/components/demos/JunctionSandbox").then((m) => m.JunctionSandbox)),
} satisfies Partial<Record<DemoId, unknown>>;

export type InteractiveDemoId = keyof typeof demos;

export function InteractiveDemo({ id }: { id: InteractiveDemoId }) {
  const Demo = demos[id];
  return <Demo />;
}
