import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-bg hover:bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_12px_40px_-12px_rgba(100,149,255,0.45)]",
  secondary: "border border-line-strong text-ink hover:border-ink-3 hover:bg-surface-2",
  ghost: "text-ink-2 hover:text-ink",
};

export interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function ButtonLink({ href, children, variant = "primary", icon, external, className = "", ariaLabel }: ButtonLinkProps) {
  const cls = `group inline-flex min-h-11 items-center gap-2.5 rounded-full px-5 py-2.5 text-[0.95rem] font-medium tracking-[-0.01em] transition-[background-color,border-color,color,transform] duration-300 ease-out-expo active:scale-[0.98] ${variants[variant]} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {icon ? <span className="arrow-nudge">{icon}</span> : null}
    </>
  );
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {content}
    </Link>
  );
}
