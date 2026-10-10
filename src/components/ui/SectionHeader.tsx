import type { ReactNode } from "react";
import { Accent } from "./Accent";

export function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <p className="label-mono flex items-center gap-3 text-ink-3">
      <span className="text-signal-soft tabular">{index}</span>
      <span aria-hidden className="h-px w-8 bg-line-strong" />
      <span>{label}</span>
    </p>
  );
}

export function SectionHeader({
  index,
  label,
  title,
  intro,
  id,
  aside,
}: {
  index: string;
  label: string;
  title: string;
  intro?: ReactNode;
  id?: string;
  aside?: ReactNode;
}) {
  return (
    <header className="grid gap-y-6 lg:grid-cols-12 lg:gap-x-8">
      <div className="lg:col-span-3 lg:pt-3">
        <SectionLabel index={index} label={label} />
      </div>
      <div className="lg:col-span-9">
        <h2 id={id} className="font-display max-w-[18ch] text-step-4" data-reveal="lines">
          <Accent text={title} />
        </h2>
        {intro ? (
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-[58ch] text-step-1 text-ink-2" data-reveal="up">
              {intro}
            </p>
            {aside}
          </div>
        ) : null}
      </div>
    </header>
  );
}
