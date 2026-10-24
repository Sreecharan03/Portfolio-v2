"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { SparkIcon } from "@/components/ui/Icons";

// The panel (and its logic) loads only when someone opens it.
const ChatPanel = dynamic(() => import("./ChatPanel").then((m) => m.ChatPanel), { ssr: false });

export function ChatLauncher({ pages }: { pages: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const wasOpen = useRef(false);
  const close = useCallback(() => setOpen(false), []);

  // Return focus to the launcher after closing. It runs after render because on phones the
  // launcher is hidden while the panel is open.
  useEffect(() => {
    if (wasOpen.current && !open) buttonRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <div className="no-print">
      {loaded ? <ChatPanel open={open} onClose={close} pages={pages} /> : null}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setLoaded(true);
          setOpen((v) => !v);
        }}
        onPointerEnter={() => setLoaded(true)}
        aria-expanded={open}
        aria-controls="portfolio-assistant"
        aria-label={open ? "Close the assistant" : "Ask the AI assistant about Charan"}
        className={`fixed bottom-4 right-4 z-40 inline-flex min-h-12 items-center gap-2 rounded-full border border-line-strong bg-surface-2/95 px-4 text-[0.9rem] font-medium text-ink shadow-[0_18px_50px_-18px_rgba(100,149,255,0.55)] backdrop-blur transition-[transform,background-color,border-color] duration-300 ease-out-expo hover:border-signal/60 hover:bg-surface-2 active:scale-[0.97] sm:bottom-6 sm:right-6 ${
          open ? "max-sm:hidden" : ""
        }`}
      >
        <SparkIcon size={16} className="text-verify-soft" />
        <span aria-hidden>{open ? "Close" : "Ask AI"}</span>
      </button>
    </div>
  );
}
