"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { SourceTag } from "@/components/ui/SourceTag";
import { ArrowRight, ArrowUpRight, CloseIcon, DocIcon, MailIcon } from "@/components/ui/Icons";
import type { BriefData } from "./types";

/**
 * The 30-second brief: everything a recruiter needs without scrolling the site.
 * Native <dialog> gives focus containment, Escape to close and focus return.
 */
export const BriefDialog = forwardRef<HTMLDialogElement, { data: BriefData; onClose: () => void }>(function BriefDialog(
  { data, onClose },
  ref,
) {
  return (
    <dialog
      ref={ref}
      aria-labelledby="brief-title"
      className="dialog-anim m-auto max-h-[min(92svh,860px)] w-[min(100%-1.5rem,52rem)] overflow-y-auto overscroll-contain rounded-[20px] border border-line-strong bg-surface-1 p-0 text-ink shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative p-6 sm:p-9">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="label-mono text-ink-3">30-second brief</p>
            <h2 id="brief-title" className="font-display mt-3 text-step-2">
              {data.name}
            </h2>
            <p className="mt-1 text-ink-2">{data.role}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
            aria-label="Close brief"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        <p className="mt-6 max-w-[60ch] text-step-1 leading-snug">{data.positioning}</p>

        <dl className="mt-7 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
          <div className="bg-surface-1 p-4">
            <dt className="label-mono text-ink-3">Now</dt>
            <dd className="mt-1.5">{data.current}</dd>
          </div>
          <div className="bg-surface-1 p-4">
            <dt className="label-mono text-ink-3">Focus</dt>
            <dd className="mt-1.5">{data.focus.join(" · ")}</dd>
          </div>
        </dl>

        <h3 className="label-mono mt-9 text-ink-3">Strongest work</h3>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {data.highlights.map((h) => (
            <li key={h.href}>
              <Link
                href={h.href}
                onClick={onClose}
                className="group grid gap-2 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6"
              >
                <span>
                  <span className="flex items-center gap-2 font-medium">
                    {h.title}
                    <ArrowRight size={14} className="arrow-nudge text-ink-3" />
                  </span>
                  <span className="mt-1 block text-step--1 text-ink-2">{h.line}</span>
                </span>
                {h.metric ? (
                  <span className="flex items-center gap-3 sm:justify-end">
                    <span className="text-right">
                      <span className="tabular block font-medium">{h.metric.value}</span>
                      <span className="block max-w-[22ch] text-[0.78rem] leading-snug text-ink-3">{h.metric.label}</span>
                    </span>
                    <SourceTag source={h.metric.source} />
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>

        <h3 className="label-mono mt-9 text-ink-3">Verified signals</h3>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          {data.proof.map((p) => (
            <li key={p.label} className="rounded-xl border border-line p-4">
              <span className="tabular font-display block text-step-2">{p.value}</span>
              <span className="mt-1 block text-[0.84rem] leading-snug text-ink-2">{p.label}</span>
              <SourceTag source={p.source} className="mt-3" />
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            href={data.resume}
            onClick={onClose}
            {...(data.resumeIsFile ? { target: "_blank", rel: "noopener", prefetch: false } : {})}
            className="group inline-flex min-h-11 items-center gap-2.5 rounded-full bg-ink px-5 py-2.5 font-medium text-bg transition-colors hover:bg-white"
          >
            <DocIcon size={16} />
            Résumé
          </Link>
          <a
            href={`mailto:${data.email}`}
            className="group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-line-strong px-5 py-2.5 font-medium transition-colors hover:border-ink-3 hover:bg-surface-2"
          >
            <MailIcon size={16} />
            {data.email}
          </a>
          <a
            href={data.phone.href}
            className="group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-line-strong px-5 py-2.5 font-medium tabular transition-colors hover:border-ink-3 hover:bg-surface-2"
          >
            {data.phone.display}
          </a>
          {data.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 py-2.5 text-ink-2 transition-colors hover:text-ink"
            >
              {l.label}
              <ArrowUpRight size={13} className="arrow-nudge arrow-nudge-diag" />
            </a>
          ))}
        </div>
      </div>
    </dialog>
  );
});
