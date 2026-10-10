import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowRight } from "@/components/ui/Icons";
import { getProject } from "@/content/projects";
import { principles } from "@/content/principles";

export function Principles() {
  return (
    <section id="principles" aria-labelledby="principles-title" className="section-y border-t border-line">
      <div className="container-page">
        <SectionHeader id="principles-title" index="07" label="Principles" title="How I *build.*" />
        <ol className="mt-16 border-t border-line lg:mt-20">
          {principles.map((p, i) => {
            const project = p.slug ? getProject(p.slug) : undefined;
            return (
              <li key={p.title} className="group grid gap-4 border-b border-line py-8 md:grid-cols-12 md:gap-8 md:py-10" data-reveal="up">
                <span className="font-mono text-[0.78rem] text-ink-3 md:col-span-1 md:pt-2">0{i + 1}</span>
                <h3 className="font-display text-step-3 transition-transform duration-500 ease-out-expo md:col-span-5 md:group-hover:translate-x-2">
                  {p.title}
                </h3>
                <div className="md:col-span-6 md:pt-1">
                  <p className="max-w-[56ch] text-ink-2">{p.body}</p>
                  {project ? (
                    <Link
                      href={`/work/${project.slug}`}
                      className="group/link mt-3 inline-flex items-center gap-1.5 text-[0.88rem] text-signal-soft hover:text-ink"
                    >
                      See it in {project.title}
                      <ArrowRight size={13} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  ) : (
                    <a href="#achievements" className="mt-3 inline-flex items-center gap-1.5 text-[0.88rem] text-signal-soft hover:text-ink">
                      See the labels in use <ArrowRight size={13} />
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
