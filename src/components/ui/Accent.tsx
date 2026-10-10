import { Fragment } from "react";

/**
 * Renders copy with *starred* fragments set in the italic serif accent.
 * Keeps headings as plain strings in the content layer.
 */
export function Accent({ text }: { text: string }) {
  const parts = text.split("*");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="serif-accent text-[1.06em]">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
