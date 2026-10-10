import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowLeft } from "@/components/ui/Icons";
import { publicProjects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-40" />
      <div className="container-page flex min-h-[86svh] flex-col justify-center pb-16 pt-[calc(var(--header-h)+3rem)]">
        <p className="label-mono flex items-center gap-3 text-warn">
          <span aria-hidden className="size-1.5 rounded-full bg-warn" /> 404 · rejected at verification
        </p>
        <h1 className="font-display mt-6 max-w-[16ch] text-step-5">
          This path <span className="serif-accent">doesn&apos;t resolve.</span>
        </h1>
        <p className="mt-6 max-w-[48ch] text-step-1 text-ink-2">
          The page you asked for isn&apos;t here. These are:
        </p>
        <ul className="mt-6 grid max-w-3xl gap-x-8 gap-y-1 sm:grid-cols-2">
          {publicProjects().map((p) => (
            <li key={p.slug}>
              <Link href={`/work/${p.slug}`} className="group flex items-baseline gap-3 py-1.5 text-ink-2 hover:text-ink">
                <span className="font-mono text-[0.72rem] text-ink-3">{p.index}</span>
                <span className="link-underline">{p.title}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <ButtonLink href="/" variant="secondary" icon={<ArrowLeft size={15} />}>
            Back to the home page
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
