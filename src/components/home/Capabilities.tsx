import { SectionHeader } from "@/components/ui/SectionHeader";
import { alsoComfortableWith } from "@/content/capabilities";
import { CapabilityExplorer } from "./CapabilityExplorer";

export function Capabilities() {
  return (
    <section id="capabilities" aria-labelledby="capabilities-title" className="section-y border-t border-line">
      <div className="container-page">
        <SectionHeader
          id="capabilities-title"
          index="03"
          label="Capabilities"
          title="Capabilities, *with receipts.*"
          intro="Grouped by what they let me build, each with the work that demonstrates it. No self-ratings and no percentage bars."
        />
        <div className="mt-12 lg:mt-14" data-reveal="up">
          <CapabilityExplorer />
        </div>
        <p className="mt-10 text-step--1 text-ink-3" data-reveal="up">
          <span className="label-mono mr-3 text-ink-3">Also</span>
          {alsoComfortableWith.join(" · ")}
        </p>
      </div>
    </section>
  );
}
