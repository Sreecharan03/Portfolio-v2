import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * next/link with direction-aware view transitions. Going deeper (a case study, the résumé)
 * is "nav-forward"; returning home is "nav-back". The page wrappers map these types to
 * directional slides (see globals.css). Works in server and client components.
 */
export function transitionTypesFor(href: string): string[] | undefined {
  if (href.startsWith("/work/") || href === "/resume") return ["nav-forward"];
  if (href === "/" || href.startsWith("/#")) return ["nav-back"];
  return undefined;
}

export function AppLink({ href, transitionTypes, ...rest }: ComponentProps<typeof Link>) {
  const types = transitionTypes ?? (typeof href === "string" ? transitionTypesFor(href) : undefined);
  return <Link href={href} transitionTypes={types} {...rest} />;
}
