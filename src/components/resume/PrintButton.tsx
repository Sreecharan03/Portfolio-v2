"use client";

import { DocIcon } from "@/components/ui/Icons";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[0.92rem] font-medium text-bg transition-colors hover:bg-white"
    >
      <DocIcon size={15} />
      Save as PDF
    </button>
  );
}
