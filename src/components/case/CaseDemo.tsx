import type { DemoId } from "@/content/projects";
import { TrainingCard } from "@/components/demos/TrainingCard";
import { InteractiveDemo } from "./InteractiveDemo";

/** The static training card renders on the server; interactive demos load one chunk each. */
export function CaseDemo({ id }: { id: DemoId }) {
  if (id === "training-card") return <TrainingCard />;
  return <InteractiveDemo id={id} />;
}
