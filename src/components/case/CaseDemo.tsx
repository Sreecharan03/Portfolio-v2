import type { DemoId } from "@/content/projects";
import { HealthRollup } from "@/components/demos/HealthRollup";
import { JunctionSandbox } from "@/components/demos/JunctionSandbox";
import { RagLab } from "@/components/demos/RagLab";
import { ResilienceDrill } from "@/components/demos/ResilienceDrill";
import { SqlGuard } from "@/components/demos/SqlGuard";
import { TrainingCard } from "@/components/demos/TrainingCard";

/** Only the demo a page renders is sent to the browser (each is its own client chunk). */
export function CaseDemo({ id }: { id: DemoId }) {
  switch (id) {
    case "resilience-drill":
      return <ResilienceDrill />;
    case "health-rollup":
      return <HealthRollup />;
    case "sql-guard":
      return <SqlGuard />;
    case "rag-lab":
      return <RagLab />;
    case "junction-sandbox":
      return <JunctionSandbox />;
    case "training-card":
      return <TrainingCard />;
  }
}
