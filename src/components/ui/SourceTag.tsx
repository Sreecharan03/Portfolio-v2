import { SOURCES, type SourceKind } from "@/content/sources";

const toneClass: Record<string, string> = {
  verified: "text-verify-soft border-verify/35 [--dot:var(--color-verify)]",
  public: "text-signal-soft border-signal/35 [--dot:var(--color-signal)]",
  reported: "text-ink-2 border-line-strong [--dot:var(--color-ink-3)]",
  illustrative: "text-warn border-warn/40 border-dashed [--dot:var(--color-warn)]",
};

export function SourceTag({ source, className = "" }: { source: SourceKind; className?: string }) {
  const info = SOURCES[source];
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2 py-[3px] font-mono text-[10.5px] leading-none tracking-[0.06em] uppercase ${toneClass[info.tone]} ${className}`}
    >
      <span aria-hidden className="size-[5px] rounded-full bg-[var(--dot)]" />
      <span className="sr-only">Source: </span>
      {info.label}
    </span>
  );
}
