"use client";

import Link from "next/link";
import { Fragment, useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { ArrowRight, CloseIcon, SparkIcon } from "@/components/ui/Icons";

type Msg = { role: "user" | "assistant"; content: string };
type Related = { title: string; href: string };

const SUGGESTIONS = [
  "What did Charan build at Sighnal?",
  "What is SenseMinds 360?",
  "Which roles is Charan looking for?",
  "How can I contact Charan?",
];

const ERRORS: Record<string, string> = {
  rate_limited: "That's a lot of questions in a short time. Please try again in a minute.",
  busy: "The assistant is busy right now. Please try again in a moment.",
  offline: "The assistant is offline right now. The contact section has Charan's email and phone.",
};
const GENERIC_ERROR = "Something went wrong. Please try again, or use the contact section.";

/** Turns site paths, links and email addresses in an answer into links; site paths get readable names. */
function linkify(raw: string, pages: Record<string, string>, onNavigate: () => void): ReactNode[] {
  // Models occasionally add markdown despite instructions; show it as plain text.
  const text = raw.replace(/\*\*(.+?)\*\*/g, "$1").replace(/^#{1,6}\s+/gm, "").replace(/^\* /gm, "- ");
  const parts = text.split(/(https?:\/\/[^\s)]+|(?<![\w/.])\/(?:#[a-z-]+|work\/[a-z0-9-]+|resume\b)|[\w.+-]+@[\w-]+\.[a-z.]+)/gi);
  return parts.map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
    const clean = part.replace(/[.,;]+$/, "");
    const tail = part.slice(clean.length);
    const cls = "text-signal-soft underline underline-offset-2 hover:text-ink";
    const link = clean.includes("@") ? (
      <a href={`mailto:${clean}`} className={cls}>
        {clean}
      </a>
    ) : clean.startsWith("/") ? (
      <Link href={clean} onClick={onNavigate} className={cls}>
        {pages[clean] ?? clean}
      </Link>
    ) : (
      <a href={clean} target="_blank" rel="noopener noreferrer" className={cls}>
        {clean}
      </a>
    );
    return (
      <Fragment key={i}>
        {link}
        {tail}
      </Fragment>
    );
  });
}

export function ChatPanel({ open, onClose, pages }: { open: boolean; onClose: () => void; pages: Record<string, string> }) {
  const titleId = useId();
  const inputId = useId();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [related, setRelated] = useState<Related[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    // Escape closes the panel wherever focus is, unless a modal (menu, brief) is on top of it.
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape" || document.querySelector("dialog[open]")) return;
      onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, error]);

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || streaming) return;
    const history: Msg[] = [...messages, { role: "user", content: q }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setError(null);
    setRelated([]);
    setStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-8) }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const code = ((await res.json().catch(() => null)) as { error?: string } | null)?.error ?? "";
        throw new Error(ERRORS[code] ?? GENERIC_ERROR);
      }
      try {
        setRelated(JSON.parse(decodeURIComponent(res.headers.get("x-chat-related") ?? "%5B%5D")) as Related[]);
      } catch {
        setRelated([]);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        const current = answer;
        setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content: current }]);
      }
      if (!answer.trim()) throw new Error(GENERIC_ERROR);
    } catch (e) {
      if (controller.signal.aborted) return;
      // Drop the empty answer bubble so the failed turn is not sent as history.
      setMessages((prev) => (prev[prev.length - 1]?.content ? prev : prev.slice(0, -2)));
      setError(e instanceof Error && e.message ? e.message : GENERIC_ERROR);
      setInput(q);
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void ask(input);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void ask(input);
    }
  };

  const lastAssistant = messages.length - 1;

  return (
    <section
      id="portfolio-assistant"
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      hidden={!open}
      className="fixed inset-x-0 bottom-0 z-40 flex h-[min(88dvh,640px)] flex-col overflow-hidden rounded-t-[20px] border border-line-strong bg-bg/97 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur sm:inset-x-auto sm:bottom-24 sm:right-6 sm:h-[min(72vh,600px)] sm:w-[400px] sm:rounded-[20px]"
    >
      <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <h2 id={titleId} className="flex items-center gap-2 text-[1rem] font-medium">
            <SparkIcon size={15} className="text-verify-soft" />
            Ask about Charan
          </h2>
          <p className="mt-0.5 text-[0.78rem] text-ink-3">Short answers from this site&apos;s content. AI can be wrong.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close the assistant"
          className="grid size-10 shrink-0 place-items-center rounded-full border border-line-strong text-ink-2 transition-colors hover:text-ink"
        >
          <CloseIcon size={14} />
        </button>
      </header>

      <div ref={logRef} role="log" aria-busy={streaming} aria-label="Conversation" className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <div>
            <p className="text-[0.9rem] text-ink-2">
              Hi! Ask me anything about Charan&apos;s projects, experience, skills or how to get in touch. English, Hindi,
              Telugu or your own language all work.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => {
                      // The suggestions disappear once asked; keep focus in the panel.
                      inputRef.current?.focus();
                      void ask(s);
                    }}
                    className="rounded-full border border-line px-3 py-1.5 text-left text-[0.8rem] text-ink-2 transition-colors hover:border-signal/50 hover:text-ink"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <p key={i} className="ml-auto w-fit max-w-[85%] rounded-[14px] rounded-br-[4px] bg-signal/15 px-3.5 py-2 text-[0.88rem] text-ink">
              {m.content}
            </p>
          ) : (
            <div key={i} className="max-w-[92%]">
              <p className="whitespace-pre-line text-[0.9rem] leading-relaxed text-ink-2" data-testid="chat-answer">
                {m.content ? linkify(m.content, pages, onClose) : <span className="inline-block animate-pulse text-ink-3">Thinking…</span>}
              </p>
              {i === lastAssistant && !streaming && related.length > 0 ? (
                <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.76rem] text-ink-3">
                  <span className="label-mono">Related</span>
                  {related.map((r) => (
                    <Link key={r.href + r.title} href={r.href} onClick={onClose} className="link-underline text-signal-soft hover:text-ink">
                      {r.title}
                    </Link>
                  ))}
                </p>
              ) : null}
            </div>
          ),
        )}

        {error ? (
          <p role="alert" className="rounded-[10px] border border-warn/30 bg-warn/[0.06] px-3 py-2 text-[0.84rem] text-ink-2">
            {error}
          </p>
        ) : null}
      </div>

      <form onSubmit={submit} className="border-t border-line px-4 pb-4 pt-3">
        <label htmlFor={inputId} className="sr-only">
          Your question
        </label>
        <div className="flex items-end gap-2">
          <textarea
            id={inputId}
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            maxLength={500}
            placeholder="Ask a question…"
            className="max-h-28 min-h-11 flex-1 resize-none rounded-[12px] border border-line-strong bg-surface-1 px-3.5 py-2.5 text-[0.9rem] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-signal/60"
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            aria-label="Send"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-bg transition-colors hover:bg-white disabled:opacity-40"
          >
            <ArrowRight size={16} />
          </button>
        </div>
        <p className="mt-2 text-[0.7rem] leading-snug text-ink-3">
          Answers come from an AI model on Groq, using only this site&apos;s content. Messages are sent to Groq to answer and are not stored here.
        </p>
      </form>
    </section>
  );
}
