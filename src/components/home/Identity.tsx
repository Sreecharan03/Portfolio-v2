import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";

const layers = [
  {
    n: "04",
    title: "Agents & LLM applications",
    line: "Stateful workflows that route, retrieve, call tools and answer.",
    tools: ["LangGraph", "Text-to-SQL", "RAG", "Grounded chat"],
    proof: [
      { label: "Financial agents", href: "/work/financial-agents" },
      { label: "Agentic RAG", href: "/work/agentic-rag" },
    ],
    tone: "verify",
  },
  {
    n: "03",
    title: "Reliability & backend",
    line: "Queues, rate control and checks that keep those workflows online and honest.",
    tools: ["Celery · Redis", "AIMD", "Circuit breakers", "JWT · RBAC"],
    proof: [{ label: "Sighnal", href: "/work/sighnal" }],
    tone: "signal",
  },
  {
    n: "02",
    title: "Models & evaluation",
    line: "Choosing, fine-tuning and explaining models, and measuring what they do.",
    tools: ["Isolation Forest", "Gaussian Mixture", "Backtested forecasts", "LoRA", "ROUGE"],
    proof: [
      { label: "SenseMinds 360", href: "/work/senseminds-360" },
      { label: "Legal summarization", href: "/work/legal-summarization" },
    ],
    tone: "signal",
  },
  {
    n: "01",
    title: "Data & pipelines",
    line: "Moving data reliably from where it lands to where it is useful.",
    tools: ["Azure Databricks", "PySpark", "Delta Lake", "TimescaleDB", "PostgreSQL"],
    proof: [
      { label: "TCS Digital", href: "#journey" },
      { label: "SenseMinds 360", href: "/work/senseminds-360" },
    ],
    tone: "ink",
  },
] as const;

export function Identity() {
  return (
    <section id="approach" aria-labelledby="approach-title" className="section-y relative">
      <div className="container-page">
        <SectionHeader
          id="approach-title"
          index="01"
          label="Approach"
          title="The model is one component. *The system* is the work."
        />

        <div className="mt-10 grid lg:mt-12 lg:grid-cols-12 lg:gap-x-8">
          <div
            className="grid gap-6 text-step-1 leading-relaxed text-ink-2 lg:col-span-9 lg:col-start-4 xl:grid-cols-2 xl:gap-10"
            data-reveal="up"
          >
            <p>
              Most of my work happens <span className="text-ink">around</span> the model: queues that keep thousands of LLM
              calls moving, validators that stop a generated query before it reaches a database, retrieval and verification
              steps that decide whether an answer may leave, and the pipelines that feed all of it.
            </p>
            <p>
              I came to this from applied ML — anomaly detection on industrial telemetry, as technical lead of a 12-member
              team — and today I work on production data pipelines at TCS Digital while building GenAI systems
              independently.
            </p>
          </div>
        </div>

        <figure className="mt-12 lg:mt-14" aria-labelledby="stack-caption">
          <div className="relative pl-7 lg:pl-0 lg:pt-7">
            {/* the rail: a signal travels through every layer (up on mobile, left to right on desktop) */}
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-6 left-[12px] top-6 w-px overflow-hidden bg-line-strong lg:bottom-auto lg:left-6 lg:right-6 lg:top-[11px] lg:h-px lg:w-auto"
              data-art
            >
              <span className="rail-pulse absolute inset-0" />
            </div>
            <ol className="grid gap-3 lg:grid-cols-4 lg:gap-4" data-reveal="stagger">
              {[...layers].reverse().map((layer) => (
                <li
                  key={layer.n}
                  className="group relative flex flex-col rounded-[var(--radius)] border border-line bg-surface-1/60 p-5 transition-[border-color,background-color] duration-300 hover:border-line-strong hover:bg-surface-2 focus-within:border-line-strong"
                >
                  <span
                    aria-hidden
                    className={`absolute -left-[20px] top-6 size-2.5 rounded-full border-2 border-bg lg:-top-[21px] lg:left-5 ${
                      layer.tone === "verify" ? "bg-verify" : layer.tone === "signal" ? "bg-signal" : "bg-ink-3"
                    } ring-1 ring-line-strong transition-transform duration-300 group-hover:scale-125`}
                  />
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-[1.05rem] font-medium tracking-[-0.01em]">{layer.title}</h3>
                    <span className="font-mono text-[0.7rem] text-ink-3">L{layer.n}</span>
                  </div>
                  <p className="mt-1.5 text-step--1 text-ink-2">{layer.line}</p>
                  <p className="mt-3 font-mono text-[0.72rem] leading-relaxed text-ink-3">{layer.tools.join(" · ")}</p>
                  <p className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-3 text-[0.82rem]">
                    {layer.proof.map((p) => (
                      <Link key={p.label} href={p.href} className="link-underline text-signal-soft hover:text-ink">
                        {p.label}
                      </Link>
                    ))}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <figcaption id="stack-caption" className="mt-4 pl-7 font-mono text-[0.7rem] tracking-[0.04em] text-ink-3 lg:pl-0">
            Four layers, one system, from data up to agents. Each links to the work that shows it.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
