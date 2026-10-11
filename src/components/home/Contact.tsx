import Link from "next/link";
import { Accent } from "@/components/ui/Accent";
import { ArrowUpRight, DocIcon } from "@/components/ui/Icons";
import { SectionLabel } from "@/components/ui/SectionHeader";
import { resumeHref, site } from "@/content/site";
import { CopyEmail } from "./CopyEmail";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden border-t border-line">
      <div
        aria-hidden
        className="absolute -z-10 bottom-[-40%] left-1/2 aspect-square w-[110vw] max-w-[1400px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(148,119,255,0.12),rgba(100,149,255,0.05)_40%,transparent_68%)]"
      />
      <div className="container-page section-y">
        <SectionLabel index="08" label="Contact" />
        <h2 id="contact-title" className="font-display mt-8 max-w-[14ch] text-step-5" data-reveal="lines">
          <Accent text="Let's build something *dependable.*" />
        </h2>
        <p className="mt-8 max-w-[52ch] text-step-1 text-ink-2" data-reveal="up">
          {site.interest}
        </p>

        <div className="mt-14 grid gap-10 border-t border-line pt-10 lg:grid-cols-12" data-reveal="up">
          <div className="lg:col-span-7">
            <p className="label-mono text-ink-3">Email</p>
            <a
              id="contact-email"
              href={`mailto:${site.email}`}
              className="font-display mt-3 block break-all text-step-3 transition-colors hover:text-signal-soft sm:break-normal"
            >
              {site.email}
            </a>
            <div className="mt-5 flex flex-wrap gap-3">
              <CopyEmail email={site.email} />
              <Link
                href={resumeHref()}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 py-2 text-[0.88rem] font-medium text-bg transition-colors hover:bg-white"
              >
                <DocIcon size={15} /> Résumé
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <p className="label-mono text-ink-3">Elsewhere</p>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {site.socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-signal-soft"
                  >
                    <span className="font-medium">{s.label}</span>
                    <span className="flex items-center gap-2 font-mono text-[0.8rem] text-ink-3">
                      {s.handle}
                      <ArrowUpRight size={13} className="arrow-nudge arrow-nudge-diag" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
