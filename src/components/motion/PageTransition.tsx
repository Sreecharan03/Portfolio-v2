import { ViewTransition, type ReactNode } from "react";

/**
 * Directional page transitions: content slides left when going deeper ("nav-forward") and
 * right when going back home ("nav-back"). Links pick the type (see AppLink); untyped
 * navigations (browser back/forward, refresh) do not slide. Wrap each page, not the layout:
 * layouts persist across navigations, so enter and exit would never fire there.
 */
const directional = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={directional} exit={directional} default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}

/** Pairs the same element across pages (for example a project's art) so it morphs between them. */
export function SharedElement({ name, children }: { name: string; children: ReactNode }) {
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
